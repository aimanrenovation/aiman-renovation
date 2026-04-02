export function canRender3D(): boolean {
  if (typeof window === "undefined") return false;

  // Verifier WebGL support
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return false;
  } catch {
    return false;
  }

  // Verifier taille ecran (mobile petit = fallback 2D)
  if (window.innerWidth < 768) return false;

  // Verifier si device a peu de memoire
  if ("deviceMemory" in navigator) {
    const memory = (navigator as any).deviceMemory;
    if (memory && memory < 4) return false;
  }

  // Verifier preference de mouvement reduit
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  return true;
}
