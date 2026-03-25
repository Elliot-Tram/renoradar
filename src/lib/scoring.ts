interface ScoreInput {
  etiquetteDpe: string;
  typeEnergieChauffage: string;
  surfaceHabitable: number;
  anneeConstruction: number | null;
  typeBatiment: string;
  dateEtablissementDpe: Date;
  hasOwnerInfo: boolean;
  isolationMurs: string | null;
  isolationToiture: string | null;
}

/**
 * Score un prospect de 0 à 100.
 * Plus le score est élevé, plus le prospect est intéressant pour un artisan.
 */
export function computeScore(input: ScoreInput): number {
  let score = 0;

  // DPE : G vaut plus que F (plus urgent)
  if (input.etiquetteDpe === "G") score += 25;
  else if (input.etiquetteDpe === "F") score += 15;

  // Chauffage fioul = remplacement quasi-certain
  const chauffage = input.typeEnergieChauffage.toLowerCase();
  if (chauffage.includes("fioul")) score += 20;
  else if (chauffage.includes("gaz")) score += 10;
  else if (chauffage.includes("charbon")) score += 20;
  else if (chauffage.includes("électri") || chauffage.includes("electri")) score += 5;

  // Surface : plus c'est grand, plus le chantier vaut
  if (input.surfaceHabitable >= 150) score += 15;
  else if (input.surfaceHabitable >= 100) score += 12;
  else if (input.surfaceHabitable >= 80) score += 8;
  else if (input.surfaceHabitable >= 60) score += 5;

  // Maison > appartement (travaux plus simples)
  if (input.typeBatiment.toLowerCase() === "maison") score += 10;

  // DPE récent = données fiables
  const ageMonths =
    (Date.now() - input.dateEtablissementDpe.getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (ageMonths <= 12) score += 10;
  else if (ageMonths <= 24) score += 5;

  // Propriétaire identifié = prospection possible
  if (input.hasOwnerInfo) score += 10;

  // Isolation déficiente = opportunité
  if (input.isolationMurs?.toLowerCase().includes("insuffisant")) score += 5;
  if (input.isolationToiture?.toLowerCase().includes("insuffisant")) score += 5;

  return Math.min(score, 100);
}

/**
 * Transforme la surface en tranche affichable.
 */
export function getSurfaceRange(surface: number): string {
  if (surface < 40) return "< 40 m²";
  if (surface < 60) return "40-60 m²";
  if (surface < 80) return "60-80 m²";
  if (surface < 100) return "80-100 m²";
  if (surface < 120) return "100-120 m²";
  if (surface < 150) return "120-150 m²";
  return "> 150 m²";
}
