import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3";
import { resend, DEVIS_FROM_EMAIL, DEVIS_RECIPIENT_EMAIL } from "@/lib/email";
import { notifyJarvis } from "@/lib/jarvis-notify";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_FILES = 10;

function getString(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function extToContentType(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".heic")) return "image/heic";
  if (lower.endsWith(".xml")) return "application/xml";
  return "application/octet-stream";
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const magicplanProjectId = getString(formData, "magicplanProjectId") || null;
    const clientEmail = getString(formData, "clientEmail");
    const clientName = getString(formData, "clientName") || "Client";
    const locale = getString(formData, "locale") || "fr";

    const files = formData.getAll("files").filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: "no_files" },
        { status: 400 },
      );
    }
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, error: "too_many_files" },
        { status: 400 },
      );
    }
    for (const f of files) {
      if (f.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: "file_too_large", filename: f.name },
          { status: 400 },
        );
      }
    }

    const timestamp = Date.now();
    const folderId = magicplanProjectId || "no-id";
    const uploaded: { name: string; url: string; size: number }[] = [];

    for (const file of files) {
      const safeName = sanitizeFilename(file.name);
      const key = `magicplan-uploads/${folderId}/${timestamp}-${safeName}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const contentType = file.type || extToContentType(safeName);

      const url = await uploadToS3({ key, body: buffer, contentType });
      uploaded.push({ name: safeName, url, size: file.size });
    }

    const filesListHtml = uploaded
      .map(
        (f) =>
          `<li><a href="${f.url}">${f.name}</a> (${(f.size / 1024).toFixed(0)} KB)</li>`,
      )
      .join("");

    await resend.emails.send({
      from: DEVIS_FROM_EMAIL,
      to: DEVIS_RECIPIENT_EMAIL,
      subject: `MagicPlan upload client — ${clientName} (${clientEmail || "sans email"})`,
      html: `
        <h2>Upload MagicPlan direct du client</h2>
        <p><strong>Client :</strong> ${clientName}</p>
        <p><strong>Email :</strong> ${clientEmail || "—"}</p>
        <p><strong>Projet MagicPlan ID :</strong> ${magicplanProjectId || "—"}</p>
        <p><strong>Locale :</strong> ${locale}</p>
        <h3>Fichiers uploadés sur S3 :</h3>
        <ul>${filesListHtml}</ul>
      `,
    });

    await notifyJarvis({
      type: "magicplan_upload_client",
      client: clientName,
      email: clientEmail,
      filesCount: uploaded.length,
      projectId: magicplanProjectId,
    });

    return NextResponse.json({
      success: true,
      filesUploaded: uploaded.length,
      urls: uploaded.map((u) => u.url),
    });
  } catch (error) {
    console.error("[magicplan-upload] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "internal_error",
      },
      { status: 500 },
    );
  }
}
