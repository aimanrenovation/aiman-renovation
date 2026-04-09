import { haversineMeters } from "./haversine";

export interface PointageLocationInput {
  userLat: number | null;
  userLng: number | null;
  chantierLat: number | null;
  chantierLng: number | null;
  radiusM: number;
}

export interface PointageLocationResult {
  distance_m: number | null;
  on_site: boolean | null;
  no_geo: boolean;
}

/**
 * Evaluates whether an employe's reported position is within the chantier's allowed radius.
 * - no_geo=true when the user has no GPS (refused or error).
 * - on_site=null when either side lacks coordinates (we can't decide).
 */
export function checkPointageLocation(input: PointageLocationInput): PointageLocationResult {
  const { userLat, userLng, chantierLat, chantierLng, radiusM } = input;

  if (userLat == null || userLng == null) {
    return { distance_m: null, on_site: null, no_geo: true };
  }

  if (chantierLat == null || chantierLng == null) {
    return { distance_m: null, on_site: null, no_geo: false };
  }

  const distance = Math.round(
    haversineMeters(userLat, userLng, chantierLat, chantierLng)
  );
  return {
    distance_m: distance,
    on_site: distance <= radiusM,
    no_geo: false,
  };
}
