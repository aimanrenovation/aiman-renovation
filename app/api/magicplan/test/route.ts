import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.MAGICPLAN_API_KEY || "NOT_SET";
  return NextResponse.json({
    hasKey: apiKey !== "NOT_SET",
    keyPrefix: apiKey.substring(0, 8),
    keyLength: apiKey.length,
  });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const key = formData.get("key");
  const envKey = process.env.MAGICPLAN_API_KEY || "";

  return NextResponse.json({
    receivedKey: typeof key === "string" ? key.substring(0, 8) : `type:${typeof key}`,
    receivedKeyLength: typeof key === "string" ? key.length : -1,
    envKeyLength: envKey.length,
    match: key === envKey,
    envKeyTrimmed: envKey.trim() === key,
  });
}
