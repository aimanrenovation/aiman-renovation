import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.MAGICPLAN_API_KEY || "NOT_SET";
  return NextResponse.json({
    hasKey: apiKey !== "NOT_SET",
    keyPrefix: apiKey.substring(0, 8),
    scwBucket: process.env.SCW_BUCKET || "NOT_SET",
  });
}
