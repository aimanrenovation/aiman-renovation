import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";
import { dispatchJarvisEvent } from "@/lib/jarvis/webhook";
import { uploadToS3 } from "@/lib/s3";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "audio/webm",
  "audio/ogg",
  "audio/mp4",
]);

export const POST = requireAuth(async (request, _ctx, session) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const file = form.get("file");
  const chantierId = form.get("chantier_id");
  const rapportId = form.get("rapport_id");
  const caption = form.get("caption");
  const tagsRaw = form.get("tags");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing_file" }, { status: 400 });
  }
  if (typeof chantierId !== "string" || !chantierId) {
    return NextResponse.json({ error: "missing_chantier_id" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "file_too_large" }, { status: 413 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "unsupported_type", type: file.type }, { status: 415 });
  }

  const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
  const today = new Date().toISOString().slice(0, 10);
  const key = `employes/${session.sub}/${chantierId}/${today}/${randomUUID()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await uploadToS3({ key, body: buffer, contentType: file.type });

  let tags: unknown = null;
  if (typeof tagsRaw === "string" && tagsRaw.length > 0) {
    try {
      tags = JSON.parse(tagsRaw);
    } catch {
      tags = tagsRaw.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  const [row] = await db
    .insert(schema.photosChantier)
    .values({
      employeId: session.sub,
      chantierId,
      rapportId: typeof rapportId === "string" && rapportId ? rapportId : null,
      s3Key: key,
      caption: typeof caption === "string" ? caption : null,
      tags: tags as object | null,
      priseLe: new Date(),
      bytes: file.size,
    })
    .returning();

  const [chantier] = await db
    .select({ nom: schema.chantiers.nom })
    .from(schema.chantiers)
    .where(eq(schema.chantiers.id, chantierId))
    .limit(1);

  dispatchJarvisEvent({
    type: "photo.uploaded",
    employe_id: session.sub,
    chantier_id: chantierId,
    chantier_nom: chantier?.nom,
    timestamp: row.createdAt.toISOString(),
    data: {
      photo_id: row.id,
      s3_key: key,
      bytes: file.size,
      caption: typeof caption === "string" ? caption : undefined,
      tags,
    },
  });

  return NextResponse.json({ ok: true, photo: { id: row.id, s3_key: key } });
});
