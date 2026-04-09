export interface FicheMission {
  chantierId: string;
  chantierNom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  lat: number;
  lng: number;
  clientNom: string;
  description: string;
  etapes: { numero: number; titre: string; description: string; done: boolean }[];
  materiel: { nom: string; quantite: number; checked: boolean }[];
  photos: { url: string; caption: string }[];
  documents: { nom: string; url: string; type: string }[];
  contraintes: string[];
  tempsTrajet?: { minutes: number; km: number };
  meteo?: { temp: number; conditions: string; alerte?: string };
}
