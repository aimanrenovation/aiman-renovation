import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface MapboxFeature {
  id: string;
  place_name: string;
  text: string;
  center: [number, number]; // [lng, lat]
  place_type: string[];
  properties: Record<string, unknown>;
  context?: { id: string; text: string }[];
}

interface MapboxResponse {
  features: MapboxFeature[];
}

const ACCEPTED_TYPES = new Set(["address", "street", "poi"]);

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() || "";
  if (q.length < 3) {
    return NextResponse.json({ features: [] });
  }

  const token = (process.env.MAPBOX_TOKEN || "").trim();
  if (!token) {
    return NextResponse.json(
      { error: "mapbox_not_configured" },
      { status: 500 },
    );
  }

  try {
    const url = new URL(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json`,
    );
    url.searchParams.set("access_token", token);
    url.searchParams.set("limit", "5");
    url.searchParams.set("language", "fr");
    url.searchParams.set("country", "fr,de,ch,lu");
    url.searchParams.set("types", "address,street");
    url.searchParams.set("autocomplete", "true");

    const res = await fetch(url.toString());
    if (!res.ok) {
      return NextResponse.json(
        { error: "mapbox_error", status: res.status },
        { status: 502 },
      );
    }

    const data = (await res.json()) as MapboxResponse;

    // Only return precise (address-level) features
    const features = (data.features || [])
      .filter((f) => f.place_type.some((t) => ACCEPTED_TYPES.has(t)))
      .map((f) => ({
        id: f.id,
        place_name: f.place_name,
        place_type: f.place_type[0],
        center: f.center,
        precise: f.place_type.includes("address"),
      }));

    return NextResponse.json({ features });
  } catch (error) {
    console.error("[geocode] error:", error);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 },
    );
  }
}
