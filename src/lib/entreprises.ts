const BASE_URL = "https://recherche-entreprises.api.gouv.fr/search";

export interface Entreprise {
  siren: string;
  nom: string;
  natureJuridique: string;
  dirigeants: { nom: string; prenoms: string; qualite: string }[];
  siege: {
    adresse: string;
    codePostal: string;
    commune: string;
  };
}

export async function searchEntreprises(
  address: string
): Promise<Entreprise[]> {
  const res = await fetch(`${BASE_URL}?q=${encodeURIComponent(address)}&page=1&per_page=5`);

  if (!res.ok) return [];

  const data = await res.json();
  if (!data.results?.length) return [];

  return data.results.map((r: any) => ({
    siren: r.siren,
    nom: r.nom_complet,
    natureJuridique: r.nature_juridique,
    dirigeants: (r.dirigeants || []).map((d: any) => ({
      nom: d.nom,
      prenoms: d.prenoms,
      qualite: d.qualite,
    })),
    siege: {
      adresse: r.siege?.adresse || "",
      codePostal: r.siege?.code_postal || "",
      commune: r.siege?.libelle_commune || "",
    },
  }));
}

export function isSCI(entreprise: Entreprise): boolean {
  // Nature juridique SCI = 6540
  return (
    entreprise.natureJuridique === "6540" ||
    entreprise.nom.toUpperCase().includes("SCI")
  );
}
