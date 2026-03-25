import type { AdemeRecord } from "./ademe";
import type { ProspectPublic, ProspectDetail, MapPoint } from "@/types";
import { computeScore, getSurfaceRange } from "./scoring";

/**
 * Jitter déterministe pour flouter les coordonnées (~500m).
 * Le même n_dpe donnera toujours le même offset.
 */
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
  const offset = ((h % 1000) / 100000) - 0.005; // -0.005 à +0.005 (~500m)
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

export function ademeToPublic(record: AdemeRecord): ProspectPublic {
  return {
    id: record.n_dpe,
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
    latitude: jitterCoord(record.latitude_ban, record.n_dpe, "lat"),
    longitude: jitterCoord(record.longitude_ban, record.n_dpe, "lng"),
  };
}

function getIsolationResume(record: AdemeRecord): string | null {
  const env = record.qualite_isolation_enveloppe?.toLowerCase();
  if (!env) return null;
  if (env.includes("très bonne") || env.includes("bonne")) return "Bonne";
  if (env.includes("moyenne")) return "Moyenne";
  if (env.includes("insuffisante")) return "Insuffisante";
  return null;
}

export function ademeToDetail(record: AdemeRecord): ProspectDetail {
  const pub = ademeToPublic(record);
  return {
    ...pub,
    surfaceHabitable: record.surface_habitable_logement || 0,
    anneeConstruction: record.annee_construction || null,
    consommationEnergie: record.consommation_energie || null,
    emissionGes: record.emission_ges || null,
    coutAnnuel: record.cout_total_5_usages || null,
    isolationMurs: record.qualite_isolation_murs || null,
    isolationEnveloppe: record.qualite_isolation_enveloppe || null,
    isolationPlancher: record.qualite_isolation_plancher_bas || null,
    isolationMenuiseries: record.qualite_isolation_menuiseries || null,
    typeVitrage: record.type_vitrage || null,
    typeEnergieEcs: record.type_energie_principale_ecs || null,
    dateEtablissementDpe: record.date_etablissement_dpe,
    nbNiveaux: record.nombre_niveau_logement || null,
    address: null, // verrouillé
    isUnlocked: false,
  };
}

export function ademeToMapPoint(record: AdemeRecord): MapPoint {
  return {
    id: record.n_dpe,
    lat: jitterCoord(record.latitude_ban, record.n_dpe, "lat"),
    lng: jitterCoord(record.longitude_ban, record.n_dpe, "lng"),
    dpe: record.etiquette_dpe,
    city: record.nom_commune_ban || "Inconnu",
    score: scoreFromRecord(record),
  };
}
