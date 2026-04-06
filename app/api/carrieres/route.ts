import { NextRequest, NextResponse } from "next/server";
import { resend, DEVIS_FROM_EMAIL, DEVIS_RECIPIENT_EMAIL } from "@/lib/email";
import { uploadToS3 } from "@/lib/s3";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const firstName = (formData.get("firstName") as string) || "";
    const lastName = (formData.get("lastName") as string) || "";
    const email = (formData.get("email") as string) || "";
    const phone = (formData.get("phone") as string) || "";
    const position = (formData.get("position") as string) || "";
    const experience = (formData.get("experience") as string) || "";
    const message = (formData.get("message") as string) || "";
    const linkedin = (formData.get("linkedin") as string) || "";
    const facebook = (formData.get("facebook") as string) || "";
    const instagram = (formData.get("instagram") as string) || "";
    const website = (formData.get("website") as string) || "";

    if (!firstName || !lastName || !email || !phone || !position) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const cv = formData.get("cv") as File | null;
    const motivation = formData.get("motivation") as File | null;

    const attachments: { filename: string; content: Buffer }[] = [];
    const s3Files: { name: string; url: string }[] = [];
    const refId = `${Date.now()}-${sanitizeFileName(`${firstName}-${lastName}`)}`;

    for (const [label, file] of [
      ["CV", cv],
      ["Lettre", motivation],
    ] as const) {
      if (!file || !(file instanceof File) || file.size === 0) continue;
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `${label} trop volumineux (max 5 MB)` }, { status: 400 });
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `${label} format invalide (PDF ou Word)` }, { status: 400 });
      }
      const bytes = Buffer.from(await file.arrayBuffer());
      const fileName = `${label}-${sanitizeFileName(file.name)}`;
      attachments.push({ filename: fileName, content: bytes });

      try {
        const s3Url = await uploadToS3({
          key: `carrieres/${refId}/${fileName}`,
          body: bytes,
          contentType: file.type,
        });
        s3Files.push({ name: fileName, url: s3Url });
      } catch (err) {
        console.error("S3 upload failed (non-blocking):", err);
      }
    }

    const socialHtml = [
      linkedin && `<li>LinkedIn : <a href="${linkedin}">${linkedin}</a></li>`,
      facebook && `<li>Facebook : <a href="${facebook}">${facebook}</a></li>`,
      instagram && `<li>Instagram : <a href="${instagram}">${instagram}</a></li>`,
      website && `<li>Site / Portfolio : <a href="${website}">${website}</a></li>`,
    ]
      .filter(Boolean)
      .join("");

    const s3FilesHtml = s3Files
      .map((f) => `<li><a href="${f.url}">${f.name}</a></li>`)
      .join("");

    await resend.emails.send({
      from: DEVIS_FROM_EMAIL,
      to: DEVIS_RECIPIENT_EMAIL,
      subject: `Nouvelle candidature — ${firstName} ${lastName} — ${position}`,
      html: `
        <h2>Nouvelle candidature reçue</h2>
        <h3>Candidat</h3>
        <p>
          <strong>${firstName} ${lastName}</strong><br/>
          Email : <a href="mailto:${email}">${email}</a><br/>
          Téléphone : <a href="tel:${phone}">${phone}</a>
        </p>

        <h3>Poste visé</h3>
        <p><strong>${position}</strong>${experience ? ` — ${experience}` : ""}</p>

        ${message ? `<h3>Message</h3><p style="white-space:pre-wrap;">${message}</p>` : ""}

        ${socialHtml ? `<h3>Réseaux et liens</h3><ul>${socialHtml}</ul>` : ""}

        ${s3FilesHtml ? `<h3>Fichiers (sauvegarde S3)</h3><ul>${s3FilesHtml}</ul>` : ""}

        <p style="color:#888;font-size:12px;margin-top:24px;">
          Référence : ${refId}<br/>
          Reçu via aiman-renovation.fr/carrieres
        </p>
      `,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    // Confirmation email to candidate
    await resend.emails.send({
      from: DEVIS_FROM_EMAIL,
      to: email,
      subject: "Votre candidature — Aiman Renovation",
      html: `
        <p>Bonjour ${firstName},</p>
        <p>Nous avons bien reçu votre candidature pour le poste de <strong>${position}</strong>.</p>
        <p>Nous prenons le temps d'étudier votre profil et reviendrons vers vous très prochainement.</p>
        <p>À bientôt,<br/>L'équipe Aiman Renovation</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur candidature:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi de la candidature" }, { status: 500 });
  }
}
