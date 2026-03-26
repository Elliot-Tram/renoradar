"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { SPECIALTIES, getSpecialtyById } from "@/lib/specialties";
import { getProfile, radiusToZoom } from "@/lib/profile";
import type { MapPoint } from "@/types";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const CHAUFFAGE_OPTIONS = [
  { value: "", label: "Tous chauffages" },
  { value: "Fioul domestique", label: "Fioul" },
  { value: "Gaz naturel", label: "Gaz" },
  { value: "Électricité", label: "Électricité" },
  { value: "Bois - Bûches", label: "Bois" },
  { value: "Charbon", label: "Charbon" },
];

const FRESHNESS_OPTIONS = [
  { value: "", label: "Tous les DPE" },
  { value: "6", label: "< 6 mois" },
  { value: "18", label: "< 18 mois" },
  { value: "36", label: "< 3 ans" },
];

function getDateMin(months: string): string | undefined {
  if (!months) return undefined;
  const d = new Date();
  d.setMonth(d.getMonth() - parseInt(months));
  return d.toISOString().split("T")[0];
}

export default function CartePage() {
  const profile = getProfile();

  const [specialty, setSpecialty] = useState(profile?.specialty || "all");
  const [chauffage, setChauffage] = useState("");
  const [surfaceMin, setSurfaceMin] = useState(0);
  const [freshness, setFreshness] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [points, setPoints] = useState<MapPoint[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const department = profile?.department || "62";
  const mapCenter: [number, number] | undefined = profile
    ? [profile.latitude, profile.longitude]
    : undefined;
  const mapZoom = profile ? radiusToZoom(profile.radiusKm) : 9;

  // Init filters from specialty
  useEffect(() => {
    const spec = getSpecialtyById(specialty);
    if (spec.filters.typeEnergieChauffage) setChauffage(spec.filters.typeEnergieChauffage);
    else setChauffage("");
    if (spec.filters.surfaceMin) setSurfaceMin(spec.filters.surfaceMin);
    else setSurfaceMin(0);
  }, [specialty]);

  const fetchPoints = useCallback(async () => {
    setLoading(true);
    try {
      const spec = getSpecialtyById(specialty);
      const dpe = spec.filters.etiquetteDpe || ["F", "G"];

      const params = new URLSearchParams({ department, dpe: dpe.join(",") });
      if (chauffage) params.set("chauffage", chauffage);
      if (surfaceMin > 0) params.set("surfaceMin", surfaceMin.toString());

      const dateMin = getDateMin(freshness);
      if (dateMin) params.set("dateMin", dateMin);

      if (spec.filters.isolationMurs) params.set("isolationMurs", spec.filters.isolationMurs);
      if (spec.filters.isolationEnveloppe) params.set("isolationEnveloppe", spec.filters.isolationEnveloppe);
      if (spec.filters.isolationMenuiseries) params.set("isolationMenuiseries", spec.filters.isolationMenuiseries);

      const res = await fetch(`/api/map-points?${params.toString()}`);
      const data = await res.json();
      setPoints(data.points || []);
      setTotal(data.total || 0);
    } catch {
      setPoints([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [department, specialty, chauffage, surfaceMin, freshness]);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            {profile ? `Prospects autour de ${profile.city}` : "Carte des prospects"}
          </h1>
          <p className="text-gray-500 mt-1">
            {loading ? "Chargement..." : (
              <>
                <span className="font-heading font-bold text-gray-900">{total.toLocaleString("fr-FR")}</span> passoires thermiques trouvées
                {profile && <span className="text-gray-400"> — {department}</span>}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Specialty selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SPECIALTIES.map((spec) => (
          <button
            key={spec.id}
            onClick={() => setSpecialty(spec.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              specialty === spec.id
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {spec.label}
          </button>
        ))}
      </div>

      {specialty !== "all" && (
        <p className="text-sm text-gray-400 mb-4">
          {getSpecialtyById(specialty).description}
        </p>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Chauffage
            </label>
            <select
              value={chauffage}
              onChange={(e) => setChauffage(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50 focus:border-chartreuse"
            >
              {CHAUFFAGE_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Surface min.
            </label>
            <input
              type="number"
              value={surfaceMin || ""}
              onChange={(e) => setSurfaceMin(Number(e.target.value))}
              placeholder="0 m²"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-24 bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50 focus:border-chartreuse"
            />
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium py-2 cursor-pointer"
          >
            {showAdvanced ? "Moins de filtres" : "Plus de filtres"}
          </button>
        </div>

        {showAdvanced && (
          <div className="flex flex-wrap items-end gap-4 mt-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Fraîcheur DPE
              </label>
              <select
                value={freshness}
                onChange={(e) => setFreshness(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50 focus:border-chartreuse"
              >
                {FRESHNESS_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Card>

      {/* Map */}
      <Card padding="sm" className="overflow-hidden">
        <div className="h-[600px] rounded-xl overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 z-[1000] bg-white/60 flex items-center justify-center">
              <div className="text-sm text-gray-500 font-medium">Chargement des données ADEME...</div>
            </div>
          )}
          <Map
            department={department}
            points={points}
            center={mapCenter}
            zoom={mapZoom}
            radiusKm={profile?.radiusKm}
          />
        </div>
      </Card>

      <p className="text-xs text-gray-400 mt-3 text-center">
        Données ADEME (Licence Ouverte v2.0) — Les positions sont approximatives. Débloquez une fiche pour l&apos;adresse exacte.
      </p>
    </div>
  );
}
