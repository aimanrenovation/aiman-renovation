import { and, eq, gte, isNull, lte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";
import { checkPointageLocation } from "@/lib/geo/pointage-check";
import { dispatchJarvisEvent } from "@/lib/jarvis/webhook";

type Action = "start" | "stop";

interface StartBody {
  action: "start";
  chantier_id: string;
  lat?: number | null;
  lng?: number | null;
  notes?: string;
}

interface StopBody {
  action: "stop";
  lat?: number | null;
  lng?: number | null;
  pause_minutes?: number;
  notes?: string;
}

type Body = StartBody | StopBody;

function isoDateToday() {
  return new Date().toISOString().slice(0, 10);
}

async function loadEmployeNom(employeId: string) {
  const [e] = await db
    .select({ firstname: schema.employes.firstname, lastname: schema.employes.lastname })
    .from(schema.employes)
    .where(eq(schema.employes.id, employeId))
    .limit(1);
  return e ? `${e.firstname} ${e.lastname}` : undefined;
}

export const POST = requireAuth(async (request, _ctx, session) => {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const action = body.action as Action;
  if (action !== "start" && action !== "stop") {
    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  }

  if (action === "start") {
    const { chantier_id, lat, lng, notes } = body as StartBody;
    if (!chantier_id) {
      return NextResponse.json({ error: "missing_chantier_id" }, { status: 400 });
    }

    // Disallow two open pointages at once
    const [open] = await db
      .select()
      .from(schema.pointages)
      .where(and(eq(schema.pointages.employeId, session.sub), isNull(schema.pointages.heureFin)))
      .limit(1);
    if (open) {
      return NextResponse.json(
        { error: "pointage_already_open", pointage_id: open.id },
        { status: 409 }
      );
    }

    const [chantier] = await db
      .select()
      .from(schema.chantiers)
      .where(eq(schema.chantiers.id, chantier_id))
      .limit(1);
    if (!chantier) {
      return NextResponse.json({ error: "chantier_not_found" }, { status: 404 });
    }

    const geo = checkPointageLocation({
      userLat: typeof lat === "number" ? lat : null,
      userLng: typeof lng === "number" ? lng : null,
      chantierLat: chantier.latChantier ? Number.parseFloat(chantier.latChantier) : null,
      chantierLng: chantier.lngChantier ? Number.parseFloat(chantier.lngChantier) : null,
      radiusM: chantier.radiusM,
    });

    const [row] = await db
      .insert(schema.pointages)
      .values({
        employeId: session.sub,
        chantierId: chantier.id,
        date: isoDateToday(),
        heureDebut: new Date(),
        latDebut: lat != null ? String(lat) : null,
        lngDebut: lng != null ? String(lng) : null,
        distanceDebutM: geo.distance_m,
        onSiteDebut: geo.on_site,
        noGeoDebut: geo.no_geo,
        notes: notes ?? null,
        source: "app",
      })
      .returning();

    const employeNom = await loadEmployeNom(session.sub);
    dispatchJarvisEvent({
      type: "pointage.start",
      employe_id: session.sub,
      employe_nom: employeNom,
      chantier_id: chantier.id,
      chantier_nom: chantier.nom,
      timestamp: row.heureDebut.toISOString(),
      data: {
        pointage_id: row.id,
        distance_m: geo.distance_m,
        on_site: geo.on_site,
        no_geo: geo.no_geo,
      },
    });

    if (geo.on_site === false || geo.no_geo) {
      dispatchJarvisEvent({
        type: "pointage.off_site",
        employe_id: session.sub,
        employe_nom: employeNom,
        chantier_id: chantier.id,
        chantier_nom: chantier.nom,
        timestamp: row.heureDebut.toISOString(),
        data: {
          phase: "start",
          distance_m: geo.distance_m,
          radius_m: chantier.radiusM,
          no_geo: geo.no_geo,
        },
      });
    }

    return NextResponse.json({ ok: true, pointage: row });
  }

  // action === "stop"
  const { lat, lng, pause_minutes, notes } = body as StopBody;
  const [open] = await db
    .select()
    .from(schema.pointages)
    .where(and(eq(schema.pointages.employeId, session.sub), isNull(schema.pointages.heureFin)))
    .limit(1);
  if (!open) {
    return NextResponse.json({ error: "no_open_pointage" }, { status: 404 });
  }

  const [chantier] = await db
    .select()
    .from(schema.chantiers)
    .where(eq(schema.chantiers.id, open.chantierId))
    .limit(1);

  const geo = checkPointageLocation({
    userLat: typeof lat === "number" ? lat : null,
    userLng: typeof lng === "number" ? lng : null,
    chantierLat: chantier?.latChantier ? Number.parseFloat(chantier.latChantier) : null,
    chantierLng: chantier?.lngChantier ? Number.parseFloat(chantier.lngChantier) : null,
    radiusM: chantier?.radiusM ?? 500,
  });

  const now = new Date();
  const [updated] = await db
    .update(schema.pointages)
    .set({
      heureFin: now,
      latFin: lat != null ? String(lat) : null,
      lngFin: lng != null ? String(lng) : null,
      distanceFinM: geo.distance_m,
      onSiteFin: geo.on_site,
      noGeoFin: geo.no_geo,
      pauseMinutes: pause_minutes ?? open.pauseMinutes,
      notes: notes ?? open.notes,
    })
    .where(eq(schema.pointages.id, open.id))
    .returning();

  const durationMs = now.getTime() - updated.heureDebut.getTime();
  const durationMin = Math.round(durationMs / 60000) - (updated.pauseMinutes ?? 0);

  const employeNom = await loadEmployeNom(session.sub);
  dispatchJarvisEvent({
    type: "pointage.stop",
    employe_id: session.sub,
    employe_nom: employeNom,
    chantier_id: updated.chantierId,
    chantier_nom: chantier?.nom,
    timestamp: now.toISOString(),
    data: {
      pointage_id: updated.id,
      duration_minutes: durationMin,
      distance_m: geo.distance_m,
      on_site: geo.on_site,
      no_geo: geo.no_geo,
    },
  });

  if (geo.on_site === false || geo.no_geo) {
    dispatchJarvisEvent({
      type: "pointage.off_site",
      employe_id: session.sub,
      employe_nom: employeNom,
      chantier_id: updated.chantierId,
      chantier_nom: chantier?.nom,
      timestamp: now.toISOString(),
      data: {
        phase: "stop",
        distance_m: geo.distance_m,
        radius_m: chantier?.radiusM ?? 500,
        no_geo: geo.no_geo,
      },
    });
  }

  return NextResponse.json({ ok: true, pointage: updated, duration_minutes: durationMin });
});

export const GET = requireAuth(async (request, _ctx, session) => {
  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const conditions = [eq(schema.pointages.employeId, session.sub)];
  if (from) conditions.push(gte(schema.pointages.date, from));
  if (to) conditions.push(lte(schema.pointages.date, to));

  const rows = await db
    .select()
    .from(schema.pointages)
    .where(and(...conditions))
    .orderBy(schema.pointages.heureDebut);

  return NextResponse.json({ pointages: rows });
});
