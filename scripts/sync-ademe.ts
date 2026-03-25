import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BASE_URL =
  "https://data.ademe.fr/data-fair/api/v1/datasets/meg-83tjwtg8dyz4vv7h1dqe/lines";

const DEPARTMENTS = ["62", "38", "57"];
const PAGE_SIZE = 500; // Pages plus grosses = moins de requêtes API
const BATCH_SIZE = 500; // Insert 500 lignes par requête SQL

const FIELDS = [
  "numero_dpe",
  "etiquette_dpe",
  "date_etablissement_dpe",
  "date_derniere_modification_dpe",
  "conso_5_usages_par_m2_ep",
  "emission_ges_5_usages_par_m2",
  "type_batiment",
  "surface_habitable_logement",
  "annee_construction",
  "nombre_niveau_logement",
  "type_energie_principale_chauffage",
  "type_installation_chauffage",
  "type_energie_principale_ecs",
  "qualite_isolation_murs",
  "qualite_isolation_plancher_bas",
  "qualite_isolation_menuiseries",
  "qualite_isolation_enveloppe",
  "adresse_ban",
  "code_postal_ban",
  "nom_commune_ban",
  "code_departement_ban",
  "_geopoint",
].join(",");

function computeScore(record: any): number {
  let score = 0;

  if (record.etiquette_dpe === "G") score += 25;
  else if (record.etiquette_dpe === "F") score += 15;

  const chauffage = (record.type_energie_principale_chauffage || "").toLowerCase();
  if (chauffage.includes("fioul")) score += 20;
  else if (chauffage.includes("gaz")) score += 10;
  else if (chauffage.includes("charbon")) score += 20;
  else if (chauffage.includes("électri") || chauffage.includes("electri")) score += 5;

  const surface = record.surface_habitable_logement || 0;
  if (surface >= 150) score += 15;
  else if (surface >= 100) score += 12;
  else if (surface >= 80) score += 8;
  else if (surface >= 60) score += 5;

  if ((record.type_batiment || "").toLowerCase() === "maison") score += 10;

  const dateDpe = new Date(record.date_etablissement_dpe);
  const ageMonths = (Date.now() - dateDpe.getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (ageMonths <= 12) score += 10;
  else if (ageMonths <= 24) score += 5;

  if ((record.qualite_isolation_murs || "").toLowerCase().includes("insuffisant")) score += 5;
  if ((record.qualite_isolation_enveloppe || "").toLowerCase().includes("insuffisant")) score += 5;

  return Math.min(score, 100);
}

function parseGeopoint(geopoint: string): { lat: number; lng: number } | null {
  if (!geopoint) return null;
  const [lat, lng] = geopoint.split(",").map(Number);
  if (isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng };
}

function toProspectData(r: any, department: string) {
  const geo = parseGeopoint(r._geopoint);
  if (!r.numero_dpe || !r.adresse_ban || !geo) return null;

  return {
    numeroDpe: r.numero_dpe,
    address: r.adresse_ban,
    city: r.nom_commune_ban || "",
    postalCode: r.code_postal_ban || "",
    department: r.code_departement_ban || department,
    latitude: geo.lat,
    longitude: geo.lng,
    etiquetteDpe: r.etiquette_dpe,
    dateEtablissementDpe: new Date(r.date_etablissement_dpe),
    consommationEnergie: r.conso_5_usages_par_m2_ep ? parseFloat(r.conso_5_usages_par_m2_ep) : null,
    emissionGes: r.emission_ges_5_usages_par_m2 ? parseFloat(r.emission_ges_5_usages_par_m2) : null,
    typeBatiment: r.type_batiment || "Inconnu",
    surfaceHabitable: r.surface_habitable_logement ? parseFloat(r.surface_habitable_logement) : 0,
    anneeConstruction: r.annee_construction ? parseInt(r.annee_construction) : null,
    nbNiveaux: r.nombre_niveau_logement ? parseInt(r.nombre_niveau_logement) : null,
    typeEnergieChauffage: r.type_energie_principale_chauffage || "Inconnu",
    typeInstallationChauffage: r.type_installation_chauffage || null,
    typeEnergieEcs: r.type_energie_principale_ecs || null,
    isolationMurs: r.qualite_isolation_murs || null,
    isolationToiture: r.qualite_isolation_enveloppe || null,
    isolationPlancher: r.qualite_isolation_plancher_bas || null,
    typeVitrage: r.qualite_isolation_menuiseries || null,
    score: computeScore(r),
  };
}

async function batchUpsert(records: any[]): Promise<number> {
  if (records.length === 0) return 0;

  // Une seule requête SQL brute pour tout le batch :
  // INSERT ... ON CONFLICT (numeroDpe) DO UPDATE
  const values = records.map((r) => {
    const esc = (v: any) => (v === null || v === undefined ? "NULL" : `'${String(v).replace(/'/g, "''")}'`);
    const num = (v: any) => (v === null || v === undefined ? "NULL" : Number(v));
    const dat = (v: any) => (v ? `'${new Date(v).toISOString()}'` : "NULL");

    return `(
      ${esc(r.numeroDpe)}, ${esc(r.address)}, ${esc(r.city)}, ${esc(r.postalCode)},
      ${esc(r.department)}, ${num(r.latitude)}, ${num(r.longitude)}, ${esc(r.etiquetteDpe)},
      ${dat(r.dateEtablissementDpe)}, ${num(r.consommationEnergie)}, ${num(r.emissionGes)},
      ${esc(r.typeBatiment)}, ${num(r.surfaceHabitable)}, ${num(r.anneeConstruction)},
      ${num(r.nbNiveaux)}, ${esc(r.typeEnergieChauffage)}, ${esc(r.typeInstallationChauffage)},
      ${esc(r.typeEnergieEcs)}, ${esc(r.isolationMurs)}, ${esc(r.isolationToiture)},
      ${esc(r.isolationPlancher)}, ${esc(r.typeVitrage)}, ${num(r.score)}, NOW(), NOW()
    )`;
  });

  const sql = `
    INSERT INTO "Prospect" (
      "numeroDpe", "address", "city", "postalCode", "department",
      "latitude", "longitude", "etiquetteDpe", "dateEtablissementDpe",
      "consommationEnergie", "emissionGes", "typeBatiment", "surfaceHabitable",
      "anneeConstruction", "nbNiveaux", "typeEnergieChauffage", "typeInstallationChauffage",
      "typeEnergieEcs", "isolationMurs", "isolationToiture", "isolationPlancher",
      "typeVitrage", "score", "createdAt", "updatedAt"
    ) VALUES ${values.join(",\n")}
    ON CONFLICT ("numeroDpe") DO UPDATE SET
      "etiquetteDpe" = EXCLUDED."etiquetteDpe",
      "consommationEnergie" = EXCLUDED."consommationEnergie",
      "emissionGes" = EXCLUDED."emissionGes",
      "typeEnergieChauffage" = EXCLUDED."typeEnergieChauffage",
      "typeInstallationChauffage" = EXCLUDED."typeInstallationChauffage",
      "typeEnergieEcs" = EXCLUDED."typeEnergieEcs",
      "isolationMurs" = EXCLUDED."isolationMurs",
      "isolationToiture" = EXCLUDED."isolationToiture",
      "isolationPlancher" = EXCLUDED."isolationPlancher",
      "typeVitrage" = EXCLUDED."typeVitrage",
      "score" = EXCLUDED."score",
      "updatedAt" = NOW()
  `;

  await prisma.$executeRawUnsafe(sql);
  return records.length;
}

async function fetchPage(url: string): Promise<{ results: any[]; total: number; next: string | null }> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`ADEME API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return {
    results: data.results || [],
    total: data.total || 0,
    next: data.next || null,
  };
}

function buildFirstUrl(department: string, since?: string): string {
  let url = `${BASE_URL}?code_departement_ban_eq=${department}&etiquette_dpe_in=F,G&size=${PAGE_SIZE}&select=${FIELDS}`;
  // Sync incrémental : uniquement les DPE modifiés depuis une date
  if (since) {
    url += `&date_derniere_modification_dpe_gte=${since}`;
  }
  return url;
}

async function getLastSyncDate(department: string): Promise<string | null> {
  const result = await prisma.prospect.findFirst({
    where: { department },
    orderBy: { updatedAt: "desc" },
    select: { updatedAt: true },
  });

  if (!result) return null;

  // Retourner la date - 1 jour pour être sûr de ne rien rater
  const d = new Date(result.updatedAt);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

async function syncDepartment(department: string, fullSync: boolean) {
  console.log(`\n--- Département ${department} ---`);

  let since: string | undefined;
  if (!fullSync) {
    const lastSync = await getLastSyncDate(department);
    if (lastSync) {
      since = lastSync;
      console.log(`Sync incrémental depuis ${since}`);
    }
  }

  let url: string | null = buildFirstUrl(department, since);
  let imported = 0;
  let skipped = 0;
  let total = 0;
  let pageNum = 0;
  let batch: any[] = [];

  while (url) {
    const data = await fetchPage(url);

    if (pageNum === 0) {
      total = data.total;
      console.log(`${total} prospects à traiter`);
    }

    for (const r of data.results) {
      const prospect = toProspectData(r, department);
      if (prospect) {
        batch.push(prospect);
      } else {
        skipped++;
      }

      // Flush le batch quand il atteint la taille max
      if (batch.length >= BATCH_SIZE) {
        const count = await batchUpsert(batch);
        imported += count;
        batch = [];
      }
    }

    pageNum++;
    const processed = Math.min(pageNum * PAGE_SIZE, total);
    const pct = total > 0 ? Math.round((processed / total) * 100) : 0;
    process.stdout.write(`\r  ${department}: ${imported} importés, ${skipped} ignorés (${pct}%)`);

    url = data.next;

    // Respecter le rate limit ADEME (100ms entre requêtes)
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Flush le dernier batch
  if (batch.length > 0) {
    const count = await batchUpsert(batch);
    imported += count;
  }

  console.log(`\n  ${department} terminé : ${imported} importés, ${skipped} ignorés`);
  return imported;
}

async function main() {
  // --full pour forcer un sync complet (premier import)
  const fullSync = process.argv.includes("--full");
  const mode = fullSync ? "COMPLET" : "INCRÉMENTAL";

  console.log(`=== Sync ADEME → PostgreSQL (${mode}) ===`);
  console.log(`Départements : ${DEPARTMENTS.join(", ")}`);
  console.log(`Filtre : DPE F et G uniquement`);
  console.log(`Batch SQL : ${BATCH_SIZE} lignes par requête\n`);

  let totalImported = 0;

  for (const dept of DEPARTMENTS) {
    const count = await syncDepartment(dept, fullSync);
    totalImported += count;
  }

  console.log(`\n=== Terminé : ${totalImported} prospects importés au total ===`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Erreur fatale :", err);
  prisma.$disconnect();
  process.exit(1);
});
