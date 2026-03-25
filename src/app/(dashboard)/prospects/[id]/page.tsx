"use client";

import { use } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DpeBadge from "@/components/DpeBadge";
import ScoreBadge from "@/components/ScoreBadge";

// Données de démo
const DEMO_PROSPECT = {
  id: "1",
  city: "Bapaume",
  postalCode: "62450",
  department: "62",
  dpe: "G",
  chauffage: "Fioul domestique",
  surface: "92 m²",
  surfaceRange: "80-100 m²",
  typeBatiment: "Maison",
  score: 85,
  hasOwner: true,
  consommation: 425,
  ges: 98,
  anneeConstruction: 1965,
  nbNiveaux: 2,
  isolationMurs: "Isolation insuffisante",
  isolationToiture: "Isolation insuffisante",
  isolationPlancher: "Non isolé",
  typeVitrage: "Simple vitrage",
  typeEcs: "Fioul domestique",
  dateEtablissementDpe: "2024-11-15",
};

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-400">
      <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function ProspectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const prospect = DEMO_PROSPECT; // TODO: fetch from API

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
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="font-heading text-2xl font-bold text-gray-900">{prospect.city}</h1>
                  <span className="text-gray-400">{prospect.postalCode}</span>
                </div>
                <p className="text-gray-500">Pas-de-Calais (62)</p>
              </div>
              <ScoreBadge score={prospect.score} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">DPE</div>
                <DpeBadge etiquette={prospect.dpe} size="lg" />
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Chauffage</div>
                <p className="font-heading font-bold text-gray-900">{prospect.chauffage}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Surface</div>
                <p className="font-heading font-bold text-gray-900">{prospect.surface}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Type</div>
                <p className="font-heading font-bold text-gray-900">{prospect.typeBatiment}</p>
              </div>
            </div>
          </Card>

          {/* DPE details */}
          <Card>
            <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">Diagnostic énergétique</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Consommation</span>
                <p className="font-heading text-2xl font-bold text-gray-900 mt-1">
                  {prospect.consommation} <span className="text-sm text-gray-400 font-normal">kWh/m²/an</span>
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Émissions GES</span>
                <p className="font-heading text-2xl font-bold text-gray-900 mt-1">
                  {prospect.ges} <span className="text-sm text-gray-400 font-normal">kgCO₂/m²/an</span>
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Année construction</span>
                <p className="font-heading text-xl font-bold text-gray-900 mt-1">{prospect.anneeConstruction}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Niveaux</span>
                <p className="font-heading text-xl font-bold text-gray-900 mt-1">{prospect.nbNiveaux}</p>
              </div>
            </div>
          </Card>

          {/* Isolation */}
          <Card>
            <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">État d&apos;isolation</h2>
            <div className="space-y-3">
              {[
                { label: "Murs", value: prospect.isolationMurs },
                { label: "Toiture", value: prospect.isolationToiture },
                { label: "Plancher bas", value: prospect.isolationPlancher },
                { label: "Vitrage", value: prospect.typeVitrage },
                { label: "Eau chaude", value: prospect.typeEcs },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className={`text-sm font-medium ${
                    item.value?.toLowerCase().includes("insuffisant") || item.value?.toLowerCase().includes("non isolé") || item.value?.toLowerCase().includes("simple")
                      ? "text-dpe-g"
                      : "text-gray-900"
                  }`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar - locked info */}
        <div className="space-y-6">
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
        </div>
      </div>
    </div>
  );
}
