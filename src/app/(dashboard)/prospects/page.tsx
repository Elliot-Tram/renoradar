"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DpeBadge from "@/components/DpeBadge";
import ScoreBadge from "@/components/ScoreBadge";

// Données de démo
const DEMO_PROSPECTS = [
  { id: "1", city: "Bapaume", postalCode: "62450", dpe: "G", chauffage: "Fioul domestique", surface: "80-100 m²", typeBatiment: "Maison", score: 85, hasOwner: true },
  { id: "2", city: "Saint-Omer", postalCode: "62500", dpe: "F", chauffage: "Fioul domestique", surface: "100-120 m²", typeBatiment: "Maison", score: 72, hasOwner: true },
  { id: "3", city: "Arras", postalCode: "62000", dpe: "G", chauffage: "Gaz naturel", surface: "120-150 m²", typeBatiment: "Maison", score: 91, hasOwner: false },
  { id: "4", city: "Bapaume", postalCode: "62450", dpe: "F", chauffage: "Fioul domestique", surface: "60-80 m²", typeBatiment: "Maison", score: 68, hasOwner: true },
  { id: "5", city: "Calais", postalCode: "62100", dpe: "G", chauffage: "Charbon", surface: "> 150 m²", typeBatiment: "Maison", score: 78, hasOwner: false },
  { id: "6", city: "Béthune", postalCode: "62400", dpe: "F", chauffage: "Gaz naturel", surface: "80-100 m²", typeBatiment: "Appartement", score: 55, hasOwner: true },
  { id: "7", city: "Douai", postalCode: "62590", dpe: "G", chauffage: "Fioul domestique", surface: "100-120 m²", typeBatiment: "Maison", score: 88, hasOwner: true },
  { id: "8", city: "Lens", postalCode: "62300", dpe: "F", chauffage: "Électricité", surface: "40-60 m²", typeBatiment: "Appartement", score: 42, hasOwner: false },
];

export default function ProspectsPage() {
  const [dpeFilter, setDpeFilter] = useState<string>("all");
  const [chauffageFilter, setChauffageFilter] = useState<string>("all");

  const filtered = DEMO_PROSPECTS.filter((p) => {
    if (dpeFilter !== "all" && p.dpe !== dpeFilter) return false;
    if (chauffageFilter !== "all" && p.chauffage !== chauffageFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Prospects</h1>
          <p className="text-gray-500 mt-1">
            {filtered.length} prospect{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""} dans le Pas-de-Calais
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={dpeFilter}
          onChange={(e) => setDpeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50"
        >
          <option value="all">Tous les DPE</option>
          <option value="F">DPE F</option>
          <option value="G">DPE G</option>
        </select>

        <select
          value={chauffageFilter}
          onChange={(e) => setChauffageFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50"
        >
          <option value="all">Tous chauffages</option>
          <option value="Fioul domestique">Fioul</option>
          <option value="Gaz naturel">Gaz</option>
          <option value="Électricité">Électricité</option>
          <option value="Charbon">Charbon</option>
        </select>
      </div>

      {/* Prospect list */}
      <div className="space-y-3">
        {filtered.map((prospect) => (
          <Link key={prospect.id} href={`/prospects/${prospect.id}`}>
            <Card className="hover:border-chartreuse/40 hover:shadow-md transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-6">
                <DpeBadge etiquette={prospect.dpe} size="lg" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-gray-900">{prospect.city}</h3>
                    <span className="text-sm text-gray-400">{prospect.postalCode}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>{prospect.chauffage}</span>
                    <span className="text-gray-300">|</span>
                    <span>{prospect.surface}</span>
                    <span className="text-gray-300">|</span>
                    <span>{prospect.typeBatiment}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {prospect.hasOwner && (
                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Proprio identifié
                    </span>
                  )}
                  <ScoreBadge score={prospect.score} size="sm" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
