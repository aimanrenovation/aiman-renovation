import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookKey } from "@/lib/magicplan";
import { uploadToS3 } from "@/lib/s3";
import { resend, DEVIS_FROM_EMAIL, DEVIS_RECIPIENT_EMAIL } from "@/lib/email";

function getField(formData: FormData, key: string): string {
  const val = formData.get(key);
  return typeof val === "string" ? val : "";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const key = getField(formData, "key");
    if (!key || !verifyWebhookKey(key)) {
      return new NextResponse(
        '<?xml version="1.0" encoding="UTF-8"?><response><status>1</status><message>Invalid key</message></response>',
        { status: 401, headers: { "Content-Type": "application/xml" } }
      );
    }

    const projectId = getField(formData, "project_id");
    const planId = getField(formData, "planid");
    const title = getField(formData, "title");
    const email = getField(formData, "email");
    const externalRefId = getField(formData, "listing");

    const fileUrls: { type: string; url: string }[] = [];

    const pdf = getField(formData, "pdf");
    if (pdf) fileUrls.push({ type: "pdf", url: pdf });

    for (let i = 0; ; i++) {
      const jpg = getField(formData, `jpg${i}`);
      if (!jpg) break;
      fileUrls.push({ type: `floor-${i}.jpg`, url: jpg });
    }

    for (let i = 0; ; i++) {
      const svg = getField(formData, `svg${i}`);
      if (!svg) break;
      fileUrls.push({ type: `floor-${i}.svg`, url: svg });
    }

    const xml = getField(formData, "xml");
    if (xml) fileUrls.push({ type: "plan.xml", url: xml });

    const s3Prefix = `magicplan/${externalRefId || projectId}`;
    const uploadedFiles: { name: string; url: string }[] = [];

    for (const file of fileUrls) {
      try {
        const res = await fetch(file.url);
        if (!res.ok) continue;
        const buffer = Buffer.from(await res.arrayBuffer());
        const fileName = file.type.includes(".")
          ? file.type
          : `plan.${file.type}`;
        const contentType = fileName.endsWith(".pdf")
          ? "application/pdf"
          : fileName.endsWith(".svg")
            ? "image/svg+xml"
            : fileName.endsWith(".jpg")
              ? "image/jpeg"
              : fileName.endsWith(".xml")
                ? "application/xml"
                : "application/octet-stream";

        const s3Url = await uploadToS3({
          key: `${s3Prefix}/${fileName}`,
          body: buffer,
          contentType,
        });
        uploadedFiles.push({ name: fileName, url: s3Url });
      } catch (err) {
        console.error(`Failed to download/upload ${file.type}:`, err);
      }
    }

    const metadata = {
      projectId,
      planId,
      title,
      email,
      externalRefId,
      files: uploadedFiles,
      receivedAt: new Date().toISOString(),
    };

    await uploadToS3({
      key: `${s3Prefix}/metadata.json`,
      body: Buffer.from(JSON.stringify(metadata, null, 2)),
      contentType: "application/json",
    });

    const pdfFile = uploadedFiles.find((f) => f.name === "plan.pdf");
    const filesListHtml = uploadedFiles
      .map((f) => `<li><a href="${f.url}">${f.name}</a></li>`)
      .join("");

    await resend.emails.send({
      from: DEVIS_FROM_EMAIL,
      to: DEVIS_RECIPIENT_EMAIL,
      subject: `MagicPlan reçu — ${title || "Sans titre"} (ref: ${externalRefId || projectId})`,
      html: `
        <h2>Nouveau plan MagicPlan reçu</h2>
        <p><strong>Projet :</strong> ${title}</p>
        <p><strong>Référence devis :</strong> ${externalRefId || "N/A"}</p>
        <p><strong>Email client :</strong> ${email}</p>
        <h3>Fichiers uploadés sur S3 :</h3>
        <ul>${filesListHtml}</ul>
        ${pdfFile ? `<p><a href="${pdfFile.url}" style="color:#E50000;font-weight:bold;">Voir le PDF du plan</a></p>` : ""}
      `,
    });

    const jarvisUrl = process.env.JARVIS_WEBHOOK_URL;
    if (jarvisUrl) {
      try {
        await fetch(jarvisUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "magicplan_received",
            client: title,
            reference: externalRefId,
            pdfUrl: pdfFile?.url,
            filesCount: uploadedFiles.length,
          }),
        });
      } catch (err) {
        console.error("Failed to notify Jarvis:", err);
      }
    }

    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><response><status>0</status><message>OK</message></response>',
      { status: 200, headers: { "Content-Type": "application/xml" } }
    );
  } catch (error) {
    console.error("MagicPlan webhook error:", error);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><response><status>1</status><message>Internal error</message></response>',
      { status: 500, headers: { "Content-Type": "application/xml" } }
    );
  }
}
