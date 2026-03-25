// Types publics (carte + liste prospects)
export interface ProspectPublic {
  id: string;
  city: string;
  department: string;
  postalCode: string;
  etiquetteDpe: string;
  typeBatiment: string;
  typeEnergieChauffage: string;
  surfaceRange: string;
  score: number;
  hasOwnerInfo: boolean;
  latitude: number;
  longitude: number;
}

// Type détail (champs visibles + champs verrouillés)
export interface ProspectDetail extends ProspectPublic {
  surfaceHabitable: number;
  anneeConstruction: number | null;
  consommationEnergie: number | null;
  emissionGes: number | null;
  coutAnnuel: number | null;
  isolationMurs: string | null;
  isolationEnveloppe: string | null;
  isolationPlancher: string | null;
  isolationMenuiseries: string | null;
  typeVitrage: string | null;
  typeEnergieEcs: string | null;
  dateEtablissementDpe: string;
  nbNiveaux: number | null;
  // Champs verrouillés (null si pas débloqué)
  address: string | null;
  isUnlocked: boolean;
}

// Point pour la carte
export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  dpe: string;
  city: string;
  score: number;
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
