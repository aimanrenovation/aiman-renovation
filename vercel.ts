import { type VercelConfig } from "@vercel/config/v1";

// vercel.ts — configuration Vercel typée pour aiman-renovation
// Remplace vercel.json (inexistant auparavant) — Next.js 16 + Fluid Compute
// Fluid Compute : activer manuellement dans Dashboard Vercel →
//   Project Settings → Functions → toggle "Fluid Compute" ON

export const config: VercelConfig = {
  framework: "nextjs",
  buildCommand: "npm run build",
  installCommand: "npm install",
  // Fluid Compute : pas d'option directe en code pour l'instant
  // → ACTION MANUELLE : Dashboard Vercel → Project Settings → Functions → Fluid Compute ON
};
