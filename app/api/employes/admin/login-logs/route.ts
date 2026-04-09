import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

/** GET /api/employes/admin/login-logs?limit=50&employeId=optional */
export const GET = requireAuth(async (request) => {
  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);
  const employeId = url.searchParams.get("employeId");

  let query = db
    .select({
      id: schema.loginLogs.id,
      employeId: schema.loginLogs.employeId,
      employeFirstname: schema.employes.firstname,
      employeLastname: schema.employes.lastname,
      email: schema.loginLogs.email,
      ip: schema.loginLogs.ip,
      userAgent: schema.loginLogs.userAgent,
      success: schema.loginLogs.success,
      newDevice: schema.loginLogs.newDevice,
      createdAt: schema.loginLogs.createdAt,
    })
    .from(schema.loginLogs)
    .leftJoin(schema.employes, eq(schema.loginLogs.employeId, schema.employes.id))
    .orderBy(desc(schema.loginLogs.createdAt))
    .limit(limit);

  if (employeId) {
    query = query.where(eq(schema.loginLogs.employeId, employeId)) as typeof query;
  }

  const rows = await query;

  return NextResponse.json({ logs: rows });
}, ["patron"]);
