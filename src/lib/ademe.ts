const BASE_URL =
  "https://data.ademe.fr/data-fair/api/v1/datasets/meg-83tjwtg8dyz4vv7h1dqe/lines";

interface AdemeFilters {
  department: string;
  etiquetteDpe?: string[]; // ["F", "G"]
  typeBatiment?: string;
  typeEnergieChauffage?: string;
  surfaceMin?: number;
  surfaceMax?: number;
  dateMin?: string; // YYYY-MM-DD
  size?: number;
  page?: number;
}

interface AdemeResponse {
  total: number;
  results: AdemeRecord[];
}

export interface AdemeRecord {
  n_dpe: string;
  etiquette_dpe: string;
  date_etablissement_dpe: string;
  consommation_energie: number;
  emission_ges: number;
  type_batiment: string;
  surface_habitable_logement: number;
  annee_construction: number;
  nombre_niveau_logement: number;
  type_energie_principale_chauffage: string;
  type_installation_chauffage: string;
  type_energie_chauffage_appoint: string;
  type_energie_principale_ecs: string;
  isolation_mur: string;
  isolation_toiture: string;
  isolation_plancher_bas: string;
  type_vitrage: string;
  // Adresse
  adresse_ban: string;
  code_postal_ban: string;
  nom_commune_ban: string;
  code_departement_ban: string;
  latitude_ban: number;
  longitude_ban: number;
  code_commune_ban: string;
}

export async function fetchAdemeRecords(
  filters: AdemeFilters
): Promise<AdemeResponse> {
  const params = new URLSearchParams();

  // Département obligatoire
  params.set("code_departement_ban_eq", filters.department);

  // DPE
  if (filters.etiquetteDpe?.length) {
    params.set("etiquette_dpe_in", filters.etiquetteDpe.join(","));
  }

  // Type bâtiment
  if (filters.typeBatiment) {
    params.set("type_batiment_eq", filters.typeBatiment);
  }

  // Chauffage
  if (filters.typeEnergieChauffage) {
    params.set(
      "type_energie_principale_chauffage_eq",
      filters.typeEnergieChauffage
    );
  }

  // Surface
  if (filters.surfaceMin) {
    params.set(
      "surface_habitable_logement_gte",
      filters.surfaceMin.toString()
    );
  }
  if (filters.surfaceMax) {
    params.set(
      "surface_habitable_logement_lte",
      filters.surfaceMax.toString()
    );
  }

  // Date min (DPE récents uniquement)
  if (filters.dateMin) {
    params.set("date_etablissement_dpe_gte", filters.dateMin);
  }

  // Pagination
  params.set("size", (filters.size || 100).toString());
  if (filters.page && filters.page > 1) {
    params.set("after", ((filters.page - 1) * (filters.size || 100)).toString());
  }

  // Tri par date décroissante
  params.set("sort", "date_etablissement_dpe:-1");

  // Sélection des champs utiles
  params.set(
    "select",
    [
      "n_dpe",
      "etiquette_dpe",
      "date_etablissement_dpe",
      "consommation_energie",
      "emission_ges",
      "type_batiment",
      "surface_habitable_logement",
      "annee_construction",
      "nombre_niveau_logement",
      "type_energie_principale_chauffage",
      "type_installation_chauffage",
      "type_energie_chauffage_appoint",
      "type_energie_principale_ecs",
      "isolation_mur",
      "isolation_toiture",
      "isolation_plancher_bas",
      "type_vitrage",
      "adresse_ban",
      "code_postal_ban",
      "nom_commune_ban",
      "code_departement_ban",
      "latitude_ban",
      "longitude_ban",
      "code_commune_ban",
    ].join(",")
  );

  const headers: Record<string, string> = {};
  if (process.env.ADEME_API_KEY) {
    headers["Authorization"] = `Bearer ${process.env.ADEME_API_KEY}`;
  }

  const res = await fetch(`${BASE_URL}?${params.toString()}`, { headers });

  if (!res.ok) {
    throw new Error(`ADEME API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function countAdemeRecords(
  department: string,
  etiquetteDpe: string[] = ["F", "G"]
): Promise<number> {
  const params = new URLSearchParams({
    code_departement_ban_eq: department,
    etiquette_dpe_in: etiquetteDpe.join(","),
    size: "0",
  });

  const headers: Record<string, string> = {};
  if (process.env.ADEME_API_KEY) {
    headers["Authorization"] = `Bearer ${process.env.ADEME_API_KEY}`;
  }

  const res = await fetch(`${BASE_URL}?${params.toString()}`, { headers });
  const data = await res.json();
  return data.total;
}
