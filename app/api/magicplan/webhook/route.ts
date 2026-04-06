import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookKey } from "@/lib/magicplan";
import { uploadToS3 } from "@/lib/s3";
import { resend, DEVIS_FROM_EMAIL, DEVIS_RECIPIENT_EMAIL } from "@/lib/email";

async function parseBody(request: NextRequest): Promise<Map<string, string>> {
  const contentType = request.headers.get("content-type") || "";
  const params = new Map<string, string>();

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    for (const [k, v] of formData.entries()) {
      if (typeof v === "string") params.set(k, v);
    }
  } else {
    // application/x-www-form-urlencoded or other
    const text = await request.text();
    const urlParams = new URLSearchParams(text);
    for (const [k, v] of urlParams.entries()) {
      params.set(k, v);
    }
  }

  return params;
}

export async function POST(request: NextRequest) {
  try {
    const params = await parseBody(request);

    const key = params.get("key") || "";
    const envKey = process.env.MAGICPLAN_API_KEY || "";
    console.log(`Webhook received: key=${key.substring(0, 8)}... envKey=${envKey.substring(0, 8)}... match=${key === envKey}`);
    if (!key || !verifyWebhookKey(key)) {
      return new NextResponse(
        '<?xml version="1.0" encoding="UTF-8"?><response><status>1</status><message>Invalid key</message></response>',
        { status: 401, headers: { "Content-Type": "application/xml" } }
      );
    }

    const projectId = params.get("project_id") || "";
    const planId = params.get("planid") || "";
    const title = params.get("title") || "";
    const email = params.get("email") || "";
    const externalRefId = params.get("listing") || "";

    const fileUrls: { type: string; url: string }[] = [];

    const pdf = params.get("pdf");
    if (pdf) fileUrls.push({ type: "pdf", url: pdf });

    for (let i = 0; ; i++) {
      const jpg = params.get(`jpg${i}`);
      if (!jpg) break;
      fileUrls.push({ type: `floor-${i}.jpg`, url: jpg });
    }

    for (let i = 0; ; i++) {
      const svg = params.get(`svg${i}`);
      if (!svg) break;
      fileUrls.push({ type: `floor-${i}.svg`, url: svg });
    }

    const xml = params.get("xml");
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
