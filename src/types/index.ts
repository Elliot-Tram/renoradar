// Types publics (carte + liste prospects)
export interface ProspectPublic {
  id: string;
  city: string;
  department: string;
  postalCode: string;
  etiquetteDpe: string;
  typeBatiment: string;
  typeEnergieChauffage: string;
  surfaceRange: string; // "60-80 m²", "80-100 m²"...
  score: number;
  hasOwnerInfo: boolean;
  latitude: number;
  longitude: number;
}

// Type après déblocage
export interface ProspectFull extends ProspectPublic {
  address: string;
  surfaceHabitable: number;
  anneeConstruction: number | null;
  consommationEnergie: number | null;
  emissionGes: number | null;
  isolationMurs: string | null;
  isolationToiture: string | null;
  isolationPlancher: string | null;
  typeVitrage: string | null;
  typeEnergieEcs: string | null;
  proprietaireType: string | null;
  proprietaireNom: string | null;
  dirigeantNom: string | null;
  dirigeantEmail: string | null;
  dernierPrixVente: number | null;
  dateDerniereVente: string | null;
  dateEtablissementDpe: string;
  argumentaire: string[];
}

// Filtres de recherche
export interface ProspectFilters {
  department: string;
  etiquetteDpe?: string[];
  typeEnergieChauffage?: string[];
  surfaceMin?: number;
  surfaceMax?: number;
  typeBatiment?: string;
  scoreMin?: number;
  page?: number;
}

// Stats dashboard
export interface DepartmentStats {
  department: string;
  totalProspects: number;
  totalF: number;
  totalG: number;
  topChauffage: string;
  avgScore: number;
}
