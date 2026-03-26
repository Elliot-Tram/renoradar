const BASE_URL =
  "https://data.ademe.fr/data-fair/api/v1/datasets/meg-83tjwtg8dyz4vv7h1dqe/lines";

export interface AdemeFilters {
  department: string;
  etiquetteDpe?: string[];
  typeBatiment?: string;
  typeEnergieChauffage?: string;
  surfaceMin?: number;
  surfaceMax?: number;
  dateMin?: string;
  isolationMurs?: string;
  isolationEnveloppe?: string;
  isolationMenuiseries?: string;
  size?: number;
  page?: number;
}

interface AdemeResponse {
  total: number;
  results: AdemeRecord[];
}

export interface AdemeRecord {
  numero_dpe: string;
  etiquette_dpe: string;
  date_etablissement_dpe: string;
  conso_5_usages_par_m2_ef: number;
  emission_ges_5_usages_par_m2: number;
  cout_total_5_usages: number;
  cout_chauffage: number;
  type_batiment: string;
  surface_habitable_logement: number;
  annee_construction: number;
  nombre_niveau_logement: number;
  type_energie_principale_chauffage: string;
  type_energie_principale_ecs: string;
  qualite_isolation_murs: string;
  qualite_isolation_enveloppe: string;
  qualite_isolation_plancher_bas: string;
  qualite_isolation_menuiseries: string;
  adresse_ban: string;
  code_postal_ban: string;
  nom_commune_ban: string;
  code_departement_ban: string;
  _geopoint: string; // "lat,lon"
}

const SELECT_FIELDS = [
  "numero_dpe",
  "etiquette_dpe",
  "date_etablissement_dpe",
  "conso_5_usages_par_m2_ef",
  "emission_ges_5_usages_par_m2",
  "cout_total_5_usages",
  "cout_chauffage",
  "type_batiment",
  "surface_habitable_logement",
  "annee_construction",
  "nombre_niveau_logement",
  "type_energie_principale_chauffage",
  "type_energie_principale_ecs",
  "qualite_isolation_murs",
  "qualite_isolation_enveloppe",
  "qualite_isolation_plancher_bas",
  "qualite_isolation_menuiseries",
  "adresse_ban",
  "code_postal_ban",
  "nom_commune_ban",
  "code_departement_ban",
  "_geopoint",
].join(",");

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (process.env.ADEME_API_KEY) {
    headers["Authorization"] = `Bearer ${process.env.ADEME_API_KEY}`;
  }
  return headers;
}

export function parseGeopoint(geopoint: string | null): { lat: number; lng: number } | null {
  if (!geopoint) return null;
  const [lat, lng] = geopoint.split(",").map(Number);
  if (isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng };
}

export async function fetchAdemeRecords(
  filters: AdemeFilters
): Promise<AdemeResponse> {
  const params = new URLSearchParams();

  params.set("code_departement_ban_eq", filters.department);

  if (filters.etiquetteDpe?.length) {
    params.set("etiquette_dpe_in", filters.etiquetteDpe.join(","));
  }

  if (filters.typeBatiment) {
    params.set("type_batiment_eq", filters.typeBatiment);
  }

  if (filters.typeEnergieChauffage) {
    params.set("type_energie_principale_chauffage_eq", filters.typeEnergieChauffage);
  }

  if (filters.surfaceMin) {
    params.set("surface_habitable_logement_gte", filters.surfaceMin.toString());
  }
  if (filters.surfaceMax) {
    params.set("surface_habitable_logement_lte", filters.surfaceMax.toString());
  }

  if (filters.dateMin) {
    params.set("date_etablissement_dpe_gte", filters.dateMin);
  }

  if (filters.isolationMurs) {
    if (filters.isolationMurs.includes(",")) {
      params.set("qualite_isolation_murs_in", filters.isolationMurs);
    } else {
      params.set("qualite_isolation_murs_eq", filters.isolationMurs);
    }
  }

  if (filters.isolationEnveloppe) {
    if (filters.isolationEnveloppe.includes(",")) {
      params.set("qualite_isolation_enveloppe_in", filters.isolationEnveloppe);
    } else {
      params.set("qualite_isolation_enveloppe_eq", filters.isolationEnveloppe);
    }
  }

  if (filters.isolationMenuiseries) {
    if (filters.isolationMenuiseries.includes(",")) {
      params.set("qualite_isolation_menuiseries_in", filters.isolationMenuiseries);
    } else {
      params.set("qualite_isolation_menuiseries_eq", filters.isolationMenuiseries);
    }
  }

  params.set("size", (filters.size || 100).toString());
  if (filters.page && filters.page > 1) {
    params.set("after", ((filters.page - 1) * (filters.size || 100)).toString());
  }

  params.set("sort", "-date_etablissement_dpe");
  params.set("select", SELECT_FIELDS);

  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`ADEME API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function fetchAdemeByDpeId(
  nDpe: string
): Promise<AdemeRecord | null> {
  const params = new URLSearchParams({
    numero_dpe_eq: nDpe,
    size: "1",
    select: SELECT_FIELDS,
  });

  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;

  const data: AdemeResponse = await res.json();
  return data.results[0] || null;
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

  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  return data.total;
}
