"use client";

import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DpeBadge from "@/components/DpeBadge";
import ScoreBadge from "@/components/ScoreBadge";
import { getProfile, isAdmin } from "@/lib/profile";
import { getSpecialtyById } from "@/lib/specialties";
import { distanceKm } from "@/lib/transform";
import type { ProspectDetail } from "@/types";

interface OwnerInfo {
  type: string;
  nom: string | null;
  dirigeant: string | null;
  siren: string | null;
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-400">
      <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function getIsolationColor(value: string | null): string {
  if (!value) return "text-gray-400";
  const v = value.toLowerCase();
  if (v.includes("insuffisant")) return "text-dpe-g";
  if (v.includes("moyenne") || v.includes("moyen")) return "text-orange-500";
  if (v.includes("bonne") || v.includes("très")) return "text-green-600";
  return "text-gray-900";
}

function getDpeFreshness(dateStr: string): { label: string; badge: string; color: string } {
  const date = new Date(dateStr);
  const months = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (months <= 1) return { label: `il y a ${Math.max(1, Math.round(months * 30))} jours`, badge: "Propriétaire en démarche active", color: "text-green-700 bg-green-50 border-green-200" };
  if (months <= 6) return { label: `il y a ${Math.round(months)} mois`, badge: "DPE récent", color: "text-green-700 bg-green-50 border-green-200" };
  if (months <= 18) return { label: `il y a ${Math.round(months)} mois`, badge: "DPE frais", color: "text-amber-700 bg-amber-50 border-amber-200" };
  return { label: `il y a ${Math.round(months)} mois`, badge: "", color: "" };
}

function getUrgencyBanner(dpe: string): { text: string; color: string } | null {
  if (dpe === "G") return { text: "Ce logement ne peut plus être mis en location depuis le 1er janvier 2025", color: "bg-red-50 border-red-200 text-red-800" };
  if (dpe === "F") return { text: "Ce logement ne pourra plus être loué à partir du 1er janvier 2028", color: "bg-orange-50 border-orange-200 text-orange-800" };
  if (dpe === "E") return { text: "Interdiction de location prévue en 2034", color: "bg-amber-50 border-amber-200 text-amber-800" };
  return null;
}

function getWhyThisLead(prospect: ProspectDetail, specialty: string): string[] {
  const reasons: string[] = [];
  const chauffage = prospect.typeEnergieChauffage?.toLowerCase() || "";
  const envOk = prospect.isolationEnveloppe?.toLowerCase().includes("bonne");
  const mursInsuf = prospect.isolationMurs?.toLowerCase().includes("insuffisant");
  const menuInsuf = prospect.isolationMenuiseries?.toLowerCase().includes("insuffisant");

  switch (specialty) {
    case "pac":
      if (chauffage.includes("fioul")) reasons.push("Chauffage au fioul, remplacement quasi-certain");
      if (envOk) reasons.push("Isolation bonne, compatible PAC directement");
      if (prospect.coutAnnuel && prospect.coutAnnuel > 3000) reasons.push(`Facture élevée (${Math.round(prospect.coutAnnuel).toLocaleString("fr-FR")} €/an), forte motivation`);
      if (prospect.surfaceHabitable >= 100) reasons.push(`Grande surface (${Math.round(prospect.surfaceHabitable)} m²), chantier valorisant`);
      break;
    case "isolation-murs":
      if (mursInsuf) reasons.push("Murs insuffisants, poste de déperdition principal");
      if (prospect.etiquetteDpe === "G" || prospect.etiquetteDpe === "F") reasons.push(`DPE ${prospect.etiquetteDpe}, obligation réglementaire`);
      if (prospect.surfaceHabitable >= 100) reasons.push(`${Math.round(prospect.surfaceHabitable)} m² de murs à isoler`);
      break;
    case "menuiseries":
      if (menuInsuf) reasons.push("Menuiseries insuffisantes, remplacement nécessaire");
      if (prospect.etiquetteDpe === "G" || prospect.etiquetteDpe === "F") reasons.push(`DPE ${prospect.etiquetteDpe}, obligation réglementaire`);
      break;
    case "renovation-globale":
      if (mursInsuf) reasons.push("Murs insuffisants");
      if (menuInsuf) reasons.push("Menuiseries insuffisantes");
      if (prospect.surfaceHabitable >= 100) reasons.push(`${Math.round(prospect.surfaceHabitable)} m², chantier multi-postes`);
      if (prospect.coutAnnuel && prospect.coutAnnuel > 4000) reasons.push(`Facture de ${Math.round(prospect.coutAnnuel).toLocaleString("fr-FR")} €/an`);
      break;
    case "solaire":
      if (chauffage.includes("élect") || chauffage.includes("elect")) reasons.push("Tout-électrique, autoconsommation maximale");
      if (prospect.surfaceHabitable >= 120) reasons.push(`Grande toiture (~${Math.round(prospect.surfaceHabitable)} m²)`);
      if (envOk) reasons.push("Bonne isolation, propriétaire qui investit");
      break;
    default:
      if (chauffage.includes("fioul")) reasons.push("Chauffage au fioul");
      if (prospect.etiquetteDpe === "G") reasons.push("DPE G, urgence maximale");
      else if (prospect.etiquetteDpe === "F") reasons.push("DPE F, interdiction 2028");
      if (prospect.coutAnnuel && prospect.coutAnnuel > 3000) reasons.push(`Facture ${Math.round(prospect.coutAnnuel).toLocaleString("fr-FR")} €/an`);
  }

  // Fraîcheur DPE
  const months = (Date.now() - new Date(prospect.dateEtablissementDpe).getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (months <= 3) reasons.push("DPE très récent, propriétaire en démarche active");

  return reasons.slice(0, 4);
}

function estimateSavings(prospect: ProspectDetail, specialty: string): string | null {
  if (!prospect.coutAnnuel || prospect.coutAnnuel <= 0) return null;
  const chauffage = prospect.typeEnergieChauffage?.toLowerCase() || "";

  if (specialty === "pac" && (chauffage.includes("fioul") || chauffage.includes("gaz"))) {
    const savings = Math.round(prospect.coutAnnuel * 0.6);
    return `~${savings.toLocaleString("fr-FR")} €/an d'économies estimées avec une PAC`;
  }
  if (specialty === "isolation-murs" && prospect.coutAnnuel > 2000) {
    const savings = Math.round(prospect.coutAnnuel * 0.25);
    return `~${savings.toLocaleString("fr-FR")} €/an d'économies estimées après isolation des murs`;
  }
  if (specialty === "renovation-globale" && prospect.coutAnnuel > 3000) {
    const savings = Math.round(prospect.coutAnnuel * 0.65);
    return `~${savings.toLocaleString("fr-FR")} €/an d'économies estimées en rénovation globale`;
  }
  return null;
}

export default function ProspectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const profileRef = useRef(getProfile());
  const profile = profileRef.current;
  const admin = useRef(isAdmin()).current;
  const [prospect, setProspect] = useState<ProspectDetail | null>(null);
  const [owner, setOwner] = useState<OwnerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (profile?.specialty) params.set("specialty", profile.specialty);
    if (profile) {
      params.set("artisanLat", profile.latitude.toString());
      params.set("artisanLng", profile.longitude.toString());
    }
    if (admin) params.set("unlocked", "true");
    const qs = params.toString() ? `?${params.toString()}` : "";

    fetch(`/api/prospects/${id}${qs}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setProspect(data);
        // Si admin et adresse disponible, chercher le propriétaire
        if (admin && data.address) {
          fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(data.address)}&page=1&per_page=3`)
            .then((r) => r.json())
            .then((entreprises) => {
              const results = entreprises.results || [];
              const sci = results.find((e: { nature_juridique: string; nom_complet: string }) =>
                e.nature_juridique === "6540" || e.nom_complet?.toLowerCase().includes("sci")
              );
              if (sci) {
                const dirigeant = sci.dirigeants?.[0];
                setOwner({
                  type: "SCI",
                  nom: sci.nom_complet,
                  dirigeant: dirigeant ? `${dirigeant.prenom || ""} ${dirigeant.nom || ""}`.trim() : null,
                  siren: sci.siren,
                });
              } else if (results.length > 0) {
                const first = results[0];
                setOwner({
                  type: "Entreprise",
                  nom: first.nom_complet,
                  dirigeant: first.dirigeants?.[0] ? `${first.dirigeants[0].prenom || ""} ${first.dirigeants[0].nom || ""}`.trim() : null,
                  siren: first.siren,
                });
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id, profile, admin]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-48 bg-gray-100 rounded-2xl" />
        <div className="h-48 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (error || !prospect) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Prospect non trouvé</p>
        <Link href="/prospects">
          <Button variant="outline">Retour aux prospects</Button>
        </Link>
      </div>
    );
  }

  const specialty = profile?.specialty || "all";
  const specLabel = getSpecialtyById(specialty);
  const urgency = getUrgencyBanner(prospect.etiquetteDpe);
  const freshness = getDpeFreshness(prospect.dateEtablissementDpe);
  const reasons = getWhyThisLead(prospect, specialty);
  const savings = estimateSavings(prospect, specialty);

  // Distance
  let dist: number | null = null;
  if (profile) {
    dist = Math.round(distanceKm(profile.latitude, profile.longitude, prospect.latitude, prospect.longitude));
  }

  return (
    <div>
      <Link
        href="/prospects"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Retour aux prospects
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="font-heading text-2xl font-bold text-gray-900">{prospect.city}</h1>
                  <span className="text-gray-400">{prospect.postalCode}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  {dist !== null && (
                    <span className="text-sm text-gray-500">
                      A {dist} km de {profile?.city}
                    </span>
                  )}
                  {freshness.badge && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${freshness.color}`}>
                      {freshness.badge}
                    </span>
                  )}
                </div>
              </div>
              <ScoreBadge score={prospect.score} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">DPE</div>
                <DpeBadge etiquette={prospect.etiquetteDpe} size="lg" />
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Chauffage</div>
                <p className="font-heading font-bold text-gray-900 text-sm">{prospect.typeEnergieChauffage}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Surface</div>
                <p className="font-heading font-bold text-gray-900">{Math.round(prospect.surfaceHabitable)} m²</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Type</div>
                <p className="font-heading font-bold text-gray-900">{prospect.typeBatiment}</p>
              </div>
            </div>
          </Card>

          {/* Why this lead */}
          {reasons.length > 0 && (
            <Card>
              <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">
                Pourquoi ce prospect {specialty !== "all" ? `pour ${specLabel.label.toLowerCase()}` : ""}
              </h2>
              <div className="space-y-3">
                {reasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-chartreuse/20 flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6.5l3 3L10 3" stroke="#9EC22A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">{reason}</span>
                  </div>
                ))}
              </div>
              {savings && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm font-medium text-green-800">{savings}</p>
                </div>
              )}
              {urgency && (
                <div className={`mt-4 p-4 ${urgency.color} border rounded-xl`}>
                  <p className="text-sm font-medium">{urgency.text}</p>
                </div>
              )}
            </Card>
          )}

          {/* DPE details */}
          <Card>
            <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">Diagnostic énergétique</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Consommation</span>
                <p className="font-heading text-2xl font-bold text-gray-900 mt-1">
                  {prospect.consommationEnergie ? Math.round(prospect.consommationEnergie) : "\u2014"}{" "}
                  <span className="text-sm text-gray-400 font-normal">kWh/m²/an</span>
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Facture annuelle</span>
                <p className="font-heading text-2xl font-bold text-gray-900 mt-1">
                  {prospect.coutAnnuel ? `${Math.round(prospect.coutAnnuel).toLocaleString("fr-FR")} \u20AC` : "\u2014"}
                  <span className="text-sm text-gray-400 font-normal"> /an</span>
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Année construction</span>
                <p className="font-heading text-xl font-bold text-gray-900 mt-1">{prospect.anneeConstruction || "\u2014"}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">DPE établi</span>
                <p className="font-heading text-xl font-bold text-gray-900 mt-1">
                  {new Date(prospect.dateEtablissementDpe).toLocaleDateString("fr-FR")}
                </p>
                <p className="text-xs text-gray-400">{freshness.label}</p>
              </div>
            </div>
          </Card>

          {/* Isolation */}
          <Card>
            <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">État d&apos;isolation</h2>
            <div className="space-y-3">
              {[
                { label: "Enveloppe", value: prospect.isolationEnveloppe },
                { label: "Murs", value: prospect.isolationMurs },
                { label: "Menuiseries", value: prospect.isolationMenuiseries },
                { label: "Plancher bas", value: prospect.isolationPlancher },
                { label: "Eau chaude", value: prospect.typeEnergieEcs },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className={`text-sm font-medium ${getIsolationColor(item.value)}`}>
                    {item.value || "\u2014"}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {prospect.isUnlocked ? (
            <>
              {/* Unlocked: show real info */}
              <Card>
                <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">Adresse du bien</h2>
                {prospect.address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prospect.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-chartreuse transition-colors"
                  >
                    <p className="font-heading font-bold text-gray-900">{prospect.address}</p>
                    <p className="text-xs text-gray-400 mt-1">Ouvrir dans Google Maps</p>
                  </a>
                )}
              </Card>

              <Card>
                <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">Propriétaire</h2>
                {owner ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-gray-400 uppercase tracking-wider">Type</span>
                      <p className="text-sm font-medium text-gray-900 mt-0.5">{owner.type}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 uppercase tracking-wider">Nom</span>
                      <p className="text-sm font-medium text-gray-900 mt-0.5">{owner.nom || "Non identifié"}</p>
                    </div>
                    {owner.dirigeant && (
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Dirigeant</span>
                        <p className="text-sm font-medium text-gray-900 mt-0.5">{owner.dirigeant}</p>
                      </div>
                    )}
                    {owner.siren && (
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">SIREN</span>
                        <p className="text-sm font-medium text-gray-900 mt-0.5">{owner.siren}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    <p>Pas de société identifiée à cette adresse.</p>
                    <p className="mt-2 text-xs text-gray-400">Le propriétaire est probablement un particulier. Prospection par courrier postal recommandée.</p>
                  </div>
                )}
              </Card>

              <Card>
                <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">Envoyer un courrier</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Envoyez une carte manuscrite personnalisée à ce propriétaire via Manuscry. Livraison J+2.
                </p>
                <Button className="w-full" size="lg">
                  Envoyer un courrier — 3,50 €
                </Button>
              </Card>
            </>
          ) : (
            <>
              {/* Locked */}
              <Card>
                <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">Informations verrouillées</h2>
                <div className="space-y-3 mb-6">
                  {[
                    "Adresse complète",
                    "Nom du propriétaire",
                    "Type (SCI / particulier)",
                    "Dirigeant SCI",
                    "Argumentaire personnalisé",
                  ].map((field) => (
                    <div key={field} className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg">
                      <LockIcon />
                      <span className="text-sm text-gray-400">{field}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full" size="lg">
                  Débloquer — 1 crédit
                </Button>
                <p className="text-xs text-gray-400 text-center mt-3">
                  Votre solde : 3 crédits
                </p>
              </Card>

              <Card>
                <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">Envoyer un courrier</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Envoyez une carte manuscrite personnalisée à ce prospect via Manuscry. Livraison J+2.
                </p>
                <Button variant="secondary" className="w-full" disabled>
                  Débloquez d&apos;abord la fiche
                </Button>
              </Card>
            </>
          )}

          <div className="text-xs text-gray-400 text-center">
            Source : ADEME (Licence Ouverte v2.0)
          </div>
        </div>
      </div>
    </div>
  );
}
