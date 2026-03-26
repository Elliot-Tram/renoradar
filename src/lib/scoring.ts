interface ScoreInput {
  etiquetteDpe: string;
  typeEnergieChauffage: string;
  surfaceHabitable: number;
  anneeConstruction: number | null;
  typeBatiment: string;
  dateEtablissementDpe: Date;
  hasOwnerInfo: boolean;
  isolationMurs: string | null;
  isolationEnveloppe: string | null;
  isolationMenuiseries: string | null;
  isolationPlancher: string | null;
  distanceKm?: number; // distance depuis l'artisan
  specialty?: string;  // spécialité de l'artisan
}

/**
 * Score un prospect de 0 à 100, adapté à la spécialité de l'artisan.
 */
export function computeScore(input: ScoreInput): number {
  const spec = input.specialty || "all";

  switch (spec) {
    case "pac": return scorePac(input);
    case "isolation-murs": return scoreIsolation(input);
    case "menuiseries": return scoreMenuiseries(input);
    case "chaudiere-gaz": return scoreChaudiereGaz(input);
    case "renovation-globale": return scoreRenovationGlobale(input);
    case "solaire": return scoreSolaire(input);
    default: return scoreGeneral(input);
  }
}

function baseScore(input: ScoreInput): number {
  let score = 0;

  // Maison > appartement
  if (input.typeBatiment.toLowerCase() === "maison") score += 5;

  // Surface
  if (input.surfaceHabitable >= 150) score += 10;
  else if (input.surfaceHabitable >= 100) score += 8;
  else if (input.surfaceHabitable >= 80) score += 5;
  else if (input.surfaceHabitable >= 60) score += 3;

  // DPE récent = proprio en démarche active
  const ageMonths =
    (Date.now() - input.dateEtablissementDpe.getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (ageMonths <= 3) score += 15;
  else if (ageMonths <= 6) score += 12;
  else if (ageMonths <= 12) score += 8;
  else if (ageMonths <= 24) score += 4;

  // Propriétaire identifié
  if (input.hasOwnerInfo) score += 5;

  // Proximité (si disponible)
  if (input.distanceKm !== undefined) {
    if (input.distanceKm <= 5) score += 10;
    else if (input.distanceKm <= 10) score += 8;
    else if (input.distanceKm <= 20) score += 5;
    else if (input.distanceKm <= 30) score += 3;
  }

  return score;
}

function chauffageScore(chauffage: string): { fioul: boolean; gaz: boolean; elec: boolean } {
  const c = chauffage.toLowerCase();
  return {
    fioul: c.includes("fioul") || c.includes("charbon"),
    gaz: c.includes("gaz"),
    elec: c.includes("électri") || c.includes("electri"),
  };
}

function isolationIs(value: string | null, quality: "bonne" | "insuffisante" | "moyenne"): boolean {
  if (!value) return false;
  const v = value.toLowerCase();
  if (quality === "bonne") return v.includes("bonne") || v.includes("très");
  if (quality === "insuffisante") return v.includes("insuffisant");
  return v.includes("moyenne");
}

/** PAC : fioul + bonne isolation = prêt à équiper */
function scorePac(input: ScoreInput): number {
  let score = baseScore(input);

  // Fioul = remplacement quasi-certain
  const c = chauffageScore(input.typeEnergieChauffage);
  if (c.fioul) score += 25;
  else if (c.gaz) score += 15;

  // Bonne isolation = TRES important pour PAC
  if (isolationIs(input.isolationEnveloppe, "bonne")) score += 20;
  else if (isolationIs(input.isolationEnveloppe, "moyenne")) score += 8;

  // Murs biens isolés = bonus
  if (isolationIs(input.isolationMurs, "bonne")) score += 10;

  // DPE E ou F (pas G, trop dégradé pour PAC directe)
  if (input.etiquetteDpe === "E") score += 10;
  else if (input.etiquetteDpe === "F") score += 15;

  return Math.min(score, 100);
}

/** Isolation murs : murs insuffisants = gros chantier */
function scoreIsolation(input: ScoreInput): number {
  let score = baseScore(input);

  // Murs insuffisants = LE critère
  if (isolationIs(input.isolationMurs, "insuffisante")) score += 25;
  if (isolationIs(input.isolationPlancher, "insuffisante")) score += 10;
  if (isolationIs(input.isolationEnveloppe, "insuffisante")) score += 10;

  // DPE F/G = urgence
  if (input.etiquetteDpe === "G") score += 20;
  else if (input.etiquetteDpe === "F") score += 15;

  // Surface = plus de m² à isoler = plus gros chantier
  if (input.surfaceHabitable >= 120) score += 5;

  return Math.min(score, 100);
}

/** Menuiseries : menuiseries insuffisantes */
function scoreMenuiseries(input: ScoreInput): number {
  let score = baseScore(input);

  if (isolationIs(input.isolationMenuiseries, "insuffisante")) score += 30;

  if (input.etiquetteDpe === "G") score += 20;
  else if (input.etiquetteDpe === "F") score += 15;

  // Nombre de fenêtres corrélé à la surface
  if (input.surfaceHabitable >= 100) score += 5;

  return Math.min(score, 100);
}

/** Chaudière gaz : gaz ancien, remplacement condensation */
function scoreChaudiereGaz(input: ScoreInput): number {
  let score = baseScore(input);

  const c = chauffageScore(input.typeEnergieChauffage);
  if (c.gaz) score += 25;

  if (isolationIs(input.isolationEnveloppe, "bonne")) score += 15;
  else if (isolationIs(input.isolationEnveloppe, "moyenne")) score += 8;

  if (input.etiquetteDpe === "E") score += 10;
  else if (input.etiquetteDpe === "F") score += 15;

  return Math.min(score, 100);
}

/** Rénovation globale : tout est à faire */
function scoreRenovationGlobale(input: ScoreInput): number {
  let score = baseScore(input);

  // Plus il y a de postes insuffisants, mieux c'est
  if (isolationIs(input.isolationMurs, "insuffisante")) score += 12;
  if (isolationIs(input.isolationPlancher, "insuffisante")) score += 8;
  if (isolationIs(input.isolationMenuiseries, "insuffisante")) score += 8;
  if (isolationIs(input.isolationEnveloppe, "insuffisante")) score += 8;

  // G = max urgence
  if (input.etiquetteDpe === "G") score += 20;
  else if (input.etiquetteDpe === "F") score += 12;

  // Fioul = encore plus à remplacer
  const c = chauffageScore(input.typeEnergieChauffage);
  if (c.fioul) score += 10;

  return Math.min(score, 100);
}

/** Solaire : chauffage électrique, grande surface */
function scoreSolaire(input: ScoreInput): number {
  let score = baseScore(input);

  const c = chauffageScore(input.typeEnergieChauffage);
  if (c.elec) score += 25; // max autoconsommation
  else if (c.fioul) score += 10; // facture élevée aussi

  // Grande surface = grand toit
  if (input.surfaceHabitable >= 150) score += 15;
  else if (input.surfaceHabitable >= 120) score += 10;
  else if (input.surfaceHabitable >= 100) score += 5;

  // Bonne isolation = proprio qui investit
  if (isolationIs(input.isolationEnveloppe, "bonne")) score += 10;

  return Math.min(score, 100);
}

/** Score générique (toutes spécialités) */
function scoreGeneral(input: ScoreInput): number {
  let score = baseScore(input);

  if (input.etiquetteDpe === "G") score += 25;
  else if (input.etiquetteDpe === "F") score += 20;
  else if (input.etiquetteDpe === "E") score += 12;

  const c = chauffageScore(input.typeEnergieChauffage);
  if (c.fioul) score += 20;
  else if (c.gaz) score += 12;
  else if (c.elec) score += 8;

  if (isolationIs(input.isolationMurs, "insuffisante")) score += 5;
  if (isolationIs(input.isolationEnveloppe, "insuffisante")) score += 5;

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
