export function generateParrainageCode(nom: string): string {
  const normalized = nom
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z]/g, "");
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PARRAIN-${normalized}-${year}-${random}`;
}
