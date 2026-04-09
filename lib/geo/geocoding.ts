export interface GeocodeResult {
  lat: number;
  lng: number;
  source: "mapbox" | "nominatim";
}

interface MapboxFeature {
  center: [number, number]; // [lng, lat]
}

interface MapboxResponse {
  features?: MapboxFeature[];
}

interface NominatimHit {
  lat: string;
  lon: string;
}

async function geocodeMapbox(address: string): Promise<GeocodeResult | null> {
  const token = process.env.MAPBOX_TOKEN;
  if (!token) return null;

  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("limit", "1");
  url.searchParams.set("language", "fr");
  url.searchParams.set("country", "fr,de,ch");

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) return null;

  const data = (await res.json()) as MapboxResponse;
  const feature = data.features?.[0];
  if (!feature?.center) return null;

  const [lng, lat] = feature.center;
  return { lat, lng, source: "mapbox" };
}

async function geocodeNominatim(address: string): Promise<GeocodeResult | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", address);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("accept-language", "fr");

  const res = await fetch(url, {
    headers: {
      // Nominatim requires a meaningful UA
      "User-Agent": "aiman-renovation-employes/1.0 (contact@aiman-renovation.fr)",
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;

  const hits = (await res.json()) as NominatimHit[];
  const first = hits[0];
  if (!first) return null;

  return {
    lat: Number.parseFloat(first.lat),
    lng: Number.parseFloat(first.lon),
    source: "nominatim",
  };
}

/**
 * Geocode a chantier address. Tries Mapbox first, falls back to Nominatim.
 * Throws if both providers fail so callers can decide how to handle it.
 */
export async function geocodeChantier(address: string): Promise<GeocodeResult> {
  try {
    const mapbox = await geocodeMapbox(address);
    if (mapbox) return mapbox;
  } catch {
    // fall through to Nominatim
  }

  const nominatim = await geocodeNominatim(address);
  if (nominatim) return nominatim;

  throw new Error(`geocoding_failed: ${address}`);
}
