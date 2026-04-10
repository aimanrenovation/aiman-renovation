import { NextResponse } from "next/server";
import { and, eq, gte, lte, inArray, desc } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireManager, isErrorResponse } from "@/lib/employes/manager-guard";

/** GET /api/employes/manager/pointages?week=YYYY-WW&employeId=optional */
export async function GET(request: Request) {
  const result = await requireManager();
  if (isErrorResponse(result)) return result;

  const { managedEmployeIds } = result;

  if (managedEmployeIds.length === 0) {
    return NextResponse.json({ pointages: [] });
  }

  const url = new URL(request.url);
  const weekParam = url.searchParams.get("week");
  const employeIdParam = url.searchParams.get("employeId");

  // Parse week param (YYYY-WW) or default to current week
  let startDate: string;
  let endDate: string;

  if (weekParam && /^\d{4}-W?\d{1,2}$/.test(weekParam)) {
    const normalized = weekParam.replace("W", "");
    const [yearStr, weekStr] = normalized.split("-");
    const year = parseInt(yearStr, 10);
    const week = parseInt(weekStr, 10);
    // ISO week: Monday of week 1 is the Monday nearest to Jan 4
    const jan4 = new Date(year, 0, 4);
    const dayOfWeek = jan4.getDay() || 7; // Mon=1..Sun=7
    const mondayWeek1 = new Date(jan4);
    mondayWeek1.setDate(jan4.getDate() - dayOfWeek + 1);
    const mondayTarget = new Date(mondayWeek1);
    mondayTarget.setDate(mondayWeek1.getDate() + (week - 1) * 7);
    const sundayTarget = new Date(mondayTarget);
    sundayTarget.setDate(mondayTarget.getDate() + 6);
    startDate = mondayTarget.toISOString().slice(0, 10);
    endDate = sundayTarget.toISOString().slice(0, 10);
  } else {
    // Default: current week (Mon-Sun)
    const now = new Date();
    const day = now.getDay() || 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - day + 1);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    startDate = monday.toISOString().slice(0, 10);
    endDate = sunday.toISOString().slice(0, 10);
  }

  // Filter by specific employe if requested (must be in managed list)
  let targetIds = managedEmployeIds;
  if (employeIdParam) {
    if (!managedEmployeIds.includes(employeIdParam)) {
      return NextResponse.json({ error: "employe_not_managed" }, { status: 403 });
    }
    targetIds = [employeIdParam];
  }

  const pointages = await db
    .select({
      id: schema.pointages.id,
      employeId: schema.pointages.employeId,
      employeFirstname: schema.employes.firstname,
      employeLastname: schema.employes.lastname,
      chantierId: schema.pointages.chantierId,
      chantierNom: schema.chantiers.nom,
      date: schema.pointages.date,
      heureDebut: schema.pointages.heureDebut,
      heureFin: schema.pointages.heureFin,
      pauseMinutes: schema.pointages.pauseMinutes,
      validationStatut: schema.pointages.validationStatut,
      correctionNotes: schema.pointages.correctionNotes,
      heureDebutCorrigee: schema.pointages.heureDebutCorrigee,
      heureFinCorrigee: schema.pointages.heureFinCorrigee,
      pauseMinutesCorrigee: schema.pointages.pauseMinutesCorrigee,
    })
    .from(schema.pointages)
    .innerJoin(schema.employes, eq(schema.pointages.employeId, schema.employes.id))
    .innerJoin(schema.chantiers, eq(schema.pointages.chantierId, schema.chantiers.id))
    .where(
      and(
        inArray(schema.pointages.employeId, targetIds),
        gte(schema.pointages.date, startDate),
        lte(schema.pointages.date, endDate)
      )
    )
    .orderBy(desc(schema.pointages.date));

  return NextResponse.json({ pointages, week: { startDate, endDate } });
}
