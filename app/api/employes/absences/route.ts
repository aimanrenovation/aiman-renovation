import { randomUUID } from "node:crypto";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { getEmployeSession } from "@/lib/auth/session";
import { uploadToS3 } from "@/lib/s3";

const VALID_TYPES = new Set([
  "conge_paye",
  "maladie",
  "accident_travail",
  "sans_solde",
  "formation",
  "evenement_familial",
  "autre",
]);

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

/**
 * Count business days (Mon-Fri) between two dates, inclusive.
 */
function countBusinessDays(startStr: string, endStr: string): number {
  const start = new Date(startStr);
  const end = new Date(endStr);
  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

// POST — create a new absence request
export async function POST(request: Request) {
  const session = await getEmployeSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const dateDebut = form.get("dateDebut");
  const dateFin = form.get("dateFin");
  const type = form.get("type");
  const raison = form.get("raison");
  const file = form.get("justificatif");

  if (typeof dateDebut !== "string" || typeof dateFin !== "string" || typeof type !== "string") {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  if (!VALID_TYPES.has(type)) {
    return NextResponse.json({ error: "invalid_type" }, { status: 400 });
  }

  if (dateDebut > dateFin) {
    return NextResponse.json({ error: "date_debut_after_date_fin" }, { status: 400 });
  }

  let justificatifS3Key: string | null = null;

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "file_too_large" }, { status: 413 });
    }
    if (!ALLOWED_FILE_TYPES.has(file.type)) {
      return NextResponse.json({ error: "unsupported_file_type" }, { status: 415 });
    }

    const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "pdf";
    const key = `absences/${session.sub}/${randomUUID()}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await uploadToS3({ key, body: buffer, contentType: file.type });
    justificatifS3Key = key;
  }

  const [row] = await db
    .insert(schema.demandesAbsence)
    .values({
      employeId: session.sub,
      dateDebut,
      dateFin,
      type,
      raison: typeof raison === "string" && raison ? raison : null,
      justificatifS3Key,
    })
    .returning();

  return NextResponse.json({ ok: true, demande: row }, { status: 201 });
}

// GET — list absences for the current employe
export async function GET() {
  const session = await getEmployeSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(schema.demandesAbsence)
    .where(eq(schema.demandesAbsence.employeId, session.sub))
    .orderBy(desc(schema.demandesAbsence.createdAt));

  const absences = rows.map((r) => ({
    ...r,
    nbJours: countBusinessDays(r.dateDebut, r.dateFin),
  }));

  return NextResponse.json({ absences });
}
