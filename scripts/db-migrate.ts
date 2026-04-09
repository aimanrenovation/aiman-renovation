// Runs all SQL files in lib/db/migrations against DATABASE_URL.
// Usage: npx tsx scripts/db-migrate.ts
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const sql = neon(url);
  const migrationsDir = join(process.cwd(), "lib/db/migrations");
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log(`Running ${files.length} migration(s)...`);

  for (const file of files) {
    const fullPath = join(migrationsDir, file);
    const content = readFileSync(fullPath, "utf-8");
    const statements = content
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(`  • ${file} (${statements.length} statements)`);
    for (const statement of statements) {
      await sql.query(statement);
    }
  }

  console.log("✓ Migrations applied.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
