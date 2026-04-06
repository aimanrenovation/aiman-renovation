const BASE = "https://aiman-renovation.fr";

export function getAlternates(path: string) {
  return {
    canonical: `${BASE}${path}`,
    languages: {
      fr: `${BASE}${path}`,
      de: `${BASE}/de${path}`,
      en: `${BASE}/en${path}`,
      "x-default": `${BASE}${path}`,
    },
  };
}
