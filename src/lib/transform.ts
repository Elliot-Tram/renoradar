import type { AdemeRecord } from "./ademe";
import { parseGeopoint } from "./ademe";
import type { ProspectPublic, ProspectDetail, MapPoint } from "@/types";
import { computeScore, getSurfaceRange } from "./scoring";

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function jitterCoord(value: number, seed: string, axis: "lat" | "lng"): number {
  const h = hashCode(seed + axis);
  const offset = ((h % 1000) / 100000) - 0.005;
  return value + offset;
}

function scoreFromRecord(record: AdemeRecord): number {
  return computeScore({
    etiquetteDpe: record.etiquette_dpe,
    typeEnergieChauffage: record.type_energie_principale_chauffage || "",
    surfaceHabitable: record.surface_habitable_logement || 0,
    anneeConstruction: record.annee_construction || null,
    typeBatiment: record.type_batiment || "",
    dateEtablissementDpe: new Date(record.date_etablissement_dpe),
    hasOwnerInfo: false,
    isolationMurs: record.qualite_isolation_murs || null,
    isolationToiture: record.qualite_isolation_enveloppe || null,
  });
}

function getIsolationResume(record: AdemeRecord): string | null {
  const env = record.qualite_isolation_enveloppe?.toLowerCase();
  if (!env) return null;
  if (env.includes("très bonne") || env.includes("bonne")) return "Bonne";
  if (env.includes("moyenne")) return "Moyenne";
  if (env.includes("insuffisante")) return "Insuffisante";
  return null;
}

export function ademeToPublic(record: AdemeRecord): ProspectPublic | null {
  const geo = parseGeopoint(record._geopoint);
  if (!geo) return null;

  return {
    id: record.numero_dpe,
    city: record.nom_commune_ban || "Inconnu",
    department: record.code_departement_ban || "",
    postalCode: record.code_postal_ban || "",
    etiquetteDpe: record.etiquette_dpe,
    typeBatiment: record.type_batiment || "Inconnu",
    typeEnergieChauffage: record.type_energie_principale_chauffage || "Inconnu",
    surfaceRange: getSurfaceRange(record.surface_habitable_logement || 0),
    score: scoreFromRecord(record),
    hasOwnerInfo: false,
    coutAnnuel: record.cout_total_5_usages || null,
    isolationResume: getIsolationResume(record),
    latitude: jitterCoord(geo.lat, record.numero_dpe, "lat"),
    longitude: jitterCoord(geo.lng, record.numero_dpe, "lng"),
  };
}

export function ademeToDetail(record: AdemeRecord): ProspectDetail | null {
  const pub = ademeToPublic(record);
  if (!pub) return null;

  return {
    ...pub,
    surfaceHabitable: record.surface_habitable_logement || 0,
    anneeConstruction: record.annee_construction || null,
    consommationEnergie: record.conso_5_usages_par_m2_ef || null,
    emissionGes: record.emission_ges_5_usages_par_m2 || null,
    coutAnnuel: record.cout_total_5_usages || null,
    isolationMurs: record.qualite_isolation_murs || null,
    isolationEnveloppe: record.qualite_isolation_enveloppe || null,
    isolationPlancher: record.qualite_isolation_plancher_bas || null,
    isolationMenuiseries: record.qualite_isolation_menuiseries || null,
    typeVitrage: null,
    typeEnergieEcs: record.type_energie_principale_ecs || null,
    dateEtablissementDpe: record.date_etablissement_dpe,
    nbNiveaux: record.nombre_niveau_logement || null,
    address: null,
    isUnlocked: false,
  };
}

export function ademeToMapPoint(record: AdemeRecord): MapPoint | null {
  const geo = parseGeopoint(record._geopoint);
  if (!geo) return null;

  return {
    id: record.numero_dpe,
    lat: jitterCoord(geo.lat, record.numero_dpe, "lat"),
    lng: jitterCoord(geo.lng, record.numero_dpe, "lng"),
    dpe: record.etiquette_dpe,
    city: record.nom_commune_ban || "Inconnu",
    score: scoreFromRecord(record),
  };
}
