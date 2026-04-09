import { NextResponse } from "next/server";
import { and, eq, gte, lte } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

/** GET /api/employes/admin/export?type=heures|pointages&debut=YYYY-MM-DD&fin=YYYY-MM-DD&employeId=optional */
export const GET = requireAuth(async (request) => {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "heures";
  const debut = url.searchParams.get("debut");
  const fin = url.searchParams.get("fin");
  const employeId = url.searchParams.get("employeId");

  if (!debut || !fin) {
    return NextResponse.json({ error: "missing_params", required: ["debut", "fin"] }, { status: 400 });
  }

  const conditions = [
    gte(schema.pointages.date, debut),
    lte(schema.pointages.date, fin),
  ];
  if (employeId) conditions.push(eq(schema.pointages.employeId, employeId));

  const rows = await db
    .select({
      date: schema.pointages.date,
      employeFirstname: schema.employes.firstname,
      employeLastname: schema.employes.lastname,
      hourlyRateCents: schema.employes.hourlyRateCents,
      chantierNom: schema.chantiers.nom,
      heureDebut: schema.pointages.heureDebut,
      heureFin: schema.pointages.heureFin,
      pauseMinutes: schema.pointages.pauseMinutes,
      onSiteDebut: schema.pointages.onSiteDebut,
      notes: schema.pointages.notes,
      latDebut: schema.pointages.latDebut,
      lngDebut: schema.pointages.lngDebut,
    })
    .from(schema.pointages)
    .innerJoin(schema.employes, eq(schema.pointages.employeId, schema.employes.id))
    .innerJoin(schema.chantiers, eq(schema.pointages.chantierId, schema.chantiers.id))
    .where(and(...conditions));

  if (type === "pointages") {
    // Raw CSV
    const header = "Date,Employé,Chantier,Début,Fin,Pause(min),Sur site,Notes,Lat,Lng";
    const lines = rows.map((r) => {
      const deb = r.heureDebut ? new Date(r.heureDebut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "";
      const fin = r.heureFin ? new Date(r.heureFin).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "";
      return [
        r.date,
        `${r.employeFirstname} ${r.employeLastname}`,
        r.chantierNom,
        deb,
        fin,
        r.pauseMinutes,
        r.onSiteDebut ? "Oui" : "Non",
        (r.notes || "").replace(/[,\n]/g, " "),
        r.latDebut || "",
        r.lngDebut || "",
      ].join(",");
    });

    const csv = [header, ...lines].join("\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="pointages_${debut}_${fin}.csv"`,
      },
    });
  }

  // type === "heures" — computed hours CSV
  const header = "Date,Employé,Chantier,Début,Fin,Pause(min),Durée(h),Taux(€/h),Coût(€)";
  const lines = rows.map((r) => {
    const deb = r.heureDebut ? new Date(r.heureDebut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "";
    const finStr = r.heureFin ? new Date(r.heureFin).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "";
    let dureeH = 0;
    if (r.heureDebut && r.heureFin) {
      dureeH = (new Date(r.heureFin).getTime() - new Date(r.heureDebut).getTime()) / 3_600_000 - (r.pauseMinutes || 0) / 60;
      dureeH = Math.round(dureeH * 100) / 100;
    }
    const tauxH = (r.hourlyRateCents || 0) / 100;
    const cout = Math.round(dureeH * tauxH * 100) / 100;

    return [
      r.date,
      `${r.employeFirstname} ${r.employeLastname}`,
      r.chantierNom,
      deb,
      finStr,
      r.pauseMinutes,
      dureeH,
      tauxH,
      cout,
    ].join(",");
  });

  const csv = [header, ...lines].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="heures_${debut}_${fin}.csv"`,
    },
  });
}, ["patron"]);
