import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Aiman Renovation — Rénovation à Saint-Louis (68)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          position: "relative",
        }}
      >
        {/* Bande tricolore en haut */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            display: "flex",
          }}
        >
          <div style={{ flex: 1, backgroundColor: "#002B7F" }} />
          <div style={{ flex: 1, backgroundColor: "#FFFFFF" }} />
          <div style={{ flex: 1, backgroundColor: "#CE1126" }} />
        </div>

        {/* Logo */}
        <img
          src="https://aiman-renovation.fr/logo/logo-full.png"
          width={280}
          height={280}
          style={{ marginBottom: 30 }}
        />

        {/* Nom */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: "-1px",
          }}
        >
          AIMAN RENOVATION
        </div>

        {/* Slogan */}
        <div
          style={{
            fontSize: 24,
            color: "#E50000",
            marginTop: 12,
          }}
        >
          Nous rénovons jusqu&apos;au bout de vos rêves !
        </div>

        {/* Localisation */}
        <div
          style={{
            fontSize: 18,
            color: "#999999",
            marginTop: 20,
          }}
        >
          Saint-Louis (68) · Devis gratuit · 19 ans d&apos;expérience
        </div>

        {/* Bande tricolore en bas */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            display: "flex",
          }}
        >
          <div style={{ flex: 1, backgroundColor: "#002B7F" }} />
          <div style={{ flex: 1, backgroundColor: "#FFFFFF" }} />
          <div style={{ flex: 1, backgroundColor: "#CE1126" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
