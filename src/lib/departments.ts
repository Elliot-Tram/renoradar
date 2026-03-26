/**
 * Départements voisins pour chaque département supporté.
 * Utilisé quand le rayon de l'artisan déborde sur un département adjacent.
 */
const NEIGHBORS: Record<string, string[]> = {
  "62": ["59", "80"],        // Pas-de-Calais → Nord, Somme
  "59": ["62", "80", "02"],  // Nord → Pas-de-Calais, Somme, Aisne
  "80": ["62", "59", "60"],  // Somme → PdC, Nord, Oise
  "38": ["73", "26", "69", "01"], // Isère → Savoie, Drôme, Rhône, Ain
  "57": ["54", "55", "67", "88"], // Moselle → M&M, Meuse, Bas-Rhin, Vosges
};

/**
 * Retourne le département principal + ses voisins si le rayon est > 30km.
 */
export function getDepartmentsForRadius(department: string, radiusKm: number): string[] {
  const deps = [department];
  if (radiusKm > 30 && NEIGHBORS[department]) {
    deps.push(...NEIGHBORS[department]);
  }
  return deps;
}
