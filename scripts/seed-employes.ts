// Seed script: creates test employes + chantiers (with geocoding) for local dev.
// Usage: DATABASE_URL=... MAPBOX_TOKEN=... npx tsx scripts/seed-employes.ts
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { hashPassword } from "@/lib/auth/password";
import { createChantier } from "@/lib/employes/chantiers";

const DEFAULT_PASSWORD = "password123";

async function upsertEmploye(row: {
  firstname: string;
  lastname: string;
  email: string;
  role: "employe" | "chef_chantier" | "patron";
  hourlyRateCents?: number;
}) {
  const [existing] = await db
    .select()
    .from(schema.employes)
    .where(eq(schema.employes.email, row.email))
    .limit(1);
  if (existing) {
    console.log(`  = ${row.email} (exists)`);
    return existing;
  }
  const hash = await hashPassword(DEFAULT_PASSWORD);
  const [created] = await db
    .insert(schema.employes)
    .values({
      firstname: row.firstname,
      lastname: row.lastname,
      email: row.email,
      passwordHash: hash,
      role: row.role,
      hourlyRateCents: row.hourlyRateCents ?? null,
      actif: true,
    })
    .returning();
  console.log(`  + ${row.email} (${row.role}) password=${DEFAULT_PASSWORD}`);
  return created;
}

async function main() {
  console.log("Seeding employes…");
  const patron = await upsertEmploye({
    firstname: "Aiman",
    lastname: "Patron",
    email: "patron@aiman-renovation.local",
    role: "patron",
    hourlyRateCents: 5000,
  });
  const chef = await upsertEmploye({
    firstname: "Karim",
    lastname: "Chef",
    email: "chef@aiman-renovation.local",
    role: "chef_chantier",
    hourlyRateCents: 3500,
  });
  const emp1 = await upsertEmploye({
    firstname: "Yassine",
    lastname: "Ouvrier",
    email: "yassine@aiman-renovation.local",
    role: "employe",
    hourlyRateCents: 2500,
  });
  const emp2 = await upsertEmploye({
    firstname: "Lucas",
    lastname: "Ouvrier",
    email: "lucas@aiman-renovation.local",
    role: "employe",
    hourlyRateCents: 2500,
  });

  console.log("Seeding chantiers…");
  const existingChantiers = await db.select().from(schema.chantiers).limit(1);
  if (existingChantiers.length > 0) {
    console.log("  = chantiers already present, skipping");
  } else {
    const c1 = await createChantier({
      clientNom: "Famille Dupont",
      nom: "Rénovation Villa Dupont",
      adresse: "12 rue de la Paix",
      codePostal: "68100",
      ville: "Mulhouse",
      statut: "en_cours",
    });
    const c2 = await createChantier({
      clientNom: "Famille Martin",
      nom: "Extension Martin",
      adresse: "45 avenue de Colmar",
      codePostal: "68000",
      ville: "Colmar",
      statut: "en_cours",
    });
    console.log(`  + ${c1.nom} (geocoded=${c1.geocodingSource ?? "none"})`);
    console.log(`  + ${c2.nom} (geocoded=${c2.geocodingSource ?? "none"})`);

    console.log("Seeding plannings…");
    const today = new Date().toISOString().slice(0, 10);
    await db.insert(schema.plannings).values([
      {
        employeId: emp1.id,
        chantierId: c1.id,
        date: today,
        heureDebut: "08:00",
        heureFin: "17:00",
        mission: "Carrelage salle de bain",
      },
      {
        employeId: emp2.id,
        chantierId: c2.id,
        date: today,
        heureDebut: "08:00",
        heureFin: "17:00",
        mission: "Placo rez-de-chaussée",
      },
      {
        employeId: chef.id,
        chantierId: c1.id,
        date: today,
        heureDebut: "09:00",
        heureFin: "12:00",
        mission: "Supervision",
      },
    ]);
    console.log("  + 3 plannings pour aujourd'hui");
  }

  console.log(`\nDone. Login: ${patron.email} / ${DEFAULT_PASSWORD}`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
