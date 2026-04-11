import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country") || "FR";
  return NextResponse.json({ country });
}
