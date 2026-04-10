import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { db, schema } from "@/lib/db/client";

const s3 = new S3Client({
  region: "fr-par",
  endpoint: "https://s3.fr-par.scw.cloud",
  credentials: {
    accessKeyId: (process.env.SCW_ACCESS_KEY || "").trim(),
    secretAccessKey: (process.env.SCW_SECRET_KEY || "").trim(),
  },
  forcePathStyle: true,
});

const BUCKET = (process.env.SCW_BUCKET || "").trim();

/** GET /api/employes/avatar/[id] — serve avatar image from S3 */
export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  const [employe] = await db
    .select({ avatarUrl: schema.employes.avatarUrl })
    .from(schema.employes)
    .where(eq(schema.employes.id, id))
    .limit(1);

  if (!employe?.avatarUrl) {
    return NextResponse.json({ error: "no_avatar" }, { status: 404 });
  }

  // Try common extensions
  const extensions = ["jpg", "png", "webp"];
  for (const ext of extensions) {
    const key = `employes/${id}/avatar.${ext}`;
    try {
      const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
      if (res.Body) {
        const bytes = await res.Body.transformToByteArray();
        return new Response(Buffer.from(bytes), {
          headers: {
            "Content-Type": res.ContentType || "image/jpeg",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    } catch {
      // Try next extension
    }
  }

  return NextResponse.json({ error: "avatar_not_found" }, { status: 404 });
}
