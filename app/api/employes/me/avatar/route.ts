import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";
import { uploadToS3 } from "@/lib/s3";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export const GET = requireAuth(async (_request, _ctx, session) => {
  const [employe] = await db
    .select({ avatarUrl: schema.employes.avatarUrl })
    .from(schema.employes)
    .where(eq(schema.employes.id, session.sub))
    .limit(1);

  if (!employe) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ avatarUrl: employe.avatarUrl });
});

export const POST = requireAuth(async (request, _ctx, session) => {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_form_data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "missing_file" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "invalid_type", allowed: ALLOWED_TYPES }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "file_too_large", maxBytes: MAX_SIZE }, { status: 400 });
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const key = `employes/${session.sub}/avatar.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  await uploadToS3({ key, body: buffer, contentType: file.type });

  // Store the proxy URL instead of direct S3 URL
  const avatarUrl = `/api/employes/avatar/${session.sub}`;

  await db
    .update(schema.employes)
    .set({ avatarUrl, updatedAt: new Date() })
    .where(eq(schema.employes.id, session.sub));

  return NextResponse.json({ avatarUrl });
});
