import type { AdemeFilters } from "./ademe";

export interface Specialty {
  id: string;
  label: string;
  description: string;
  filters: Partial<AdemeFilters>;
}

/**
 * Presets de filtres par spécialité artisan.
 * Chaque spécialité configure automatiquement les bons filtres ADEME
 * pour montrer les leads les plus pertinents.
 */
export const SPECIALTIES: Specialty[] = [
  {
    id: "all",
    label: "Toutes spécialités",
    description: "Tous les DPE F et G",
    filters: {},
  },
  {
    id: "pac",
    label: "Pompe à chaleur",
    description: "Fioul/gaz, isolation bonne = prêt à équiper",
    filters: {
      typeEnergieChauffage: "Fioul domestique",
      isolationEnveloppe: "bonne,très bonne",
      etiquetteDpe: ["E", "F"],
    },
  },
  {
    id: "isolation-murs",
    label: "Isolation murs",
    description: "Murs insuffisants, gros volume de chantiers",
    filters: {
      isolationMurs: "insuffisante",
      etiquetteDpe: ["F", "G"],
    },
  },
  {
    id: "menuiseries",
    label: "Menuiseries / fenêtres",
    description: "Menuiseries insuffisantes, remplacement vitrage",
    filters: {
      isolationMenuiseries: "insuffisante",
      etiquetteDpe: ["F", "G"],
    },
  },
  {
    id: "chaudiere-gaz",
    label: "Chaudière gaz",
    description: "Gaz ancien, remplacement condensation",
    filters: {
      typeEnergieChauffage: "Gaz naturel",
      etiquetteDpe: ["E", "F"],
    },
  },
  {
    id: "renovation-globale",
    label: "Rénovation globale",
    description: "Tout insuffisant, > 100 m², gros chantiers",
    filters: {
      isolationMurs: "insuffisante",
      surfaceMin: 100,
      etiquetteDpe: ["F", "G"],
    },
  },
  {
    id: "solaire",
    label: "Panneaux solaires",
    description: "Chauffage électrique, pas de PV, grande surface",
    filters: {
      typeEnergieChauffage: "Électricité",
      surfaceMin: 100,
      etiquetteDpe: ["D", "E", "F"],
    },
  },
];

export function getSpecialtyById(id: string): Specialty {
  return SPECIALTIES.find((s) => s.id === id) || SPECIALTIES[0];
}
