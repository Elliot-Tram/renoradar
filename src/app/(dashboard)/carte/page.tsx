"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Card from "@/components/ui/Card";
import { getSpecialtyById } from "@/lib/specialties";
import { getProfile, radiusToZoom } from "@/lib/profile";
import { distanceKm } from "@/lib/transform";
import { getDepartmentsForRadius } from "@/lib/departments";
import type { MapPoint } from "@/types";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function CartePage() {
  const profileRef = useRef(getProfile());
  const profile = profileRef.current;

  const [points, setPoints] = useState<MapPoint[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const department = profile?.department || "62";
  const specialty = profile?.specialty || "all";
  const mapCenter: [number, number] | undefined = profile
    ? [profile.latitude, profile.longitude]
    : undefined;
  const mapZoom = profile ? radiusToZoom(profile.radiusKm) : 9;

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchPoints() {
      try {
        const spec = getSpecialtyById(specialty);
        const dpe = spec.filters.etiquetteDpe || ["F", "G"];

        // Charger les départements voisins si le rayon est grand
        const departments = profile
          ? getDepartmentsForRadius(department, profile.radiusKm)
          : [department];

        const allPoints: MapPoint[] = [];

        // Fetch en parallèle pour chaque département
        const fetches = departments.map(async (dept) => {
          const params = new URLSearchParams({ department: dept, dpe: dpe.join(",") });

          if (spec.filters.typeEnergieChauffage) params.set("chauffage", spec.filters.typeEnergieChauffage);
          if (spec.filters.surfaceMin) params.set("surfaceMin", spec.filters.surfaceMin.toString());
          if (spec.filters.isolationMurs) params.set("isolationMurs", spec.filters.isolationMurs);
          if (spec.filters.isolationEnveloppe) params.set("isolationEnveloppe", spec.filters.isolationEnveloppe);
          if (spec.filters.isolationMenuiseries) params.set("isolationMenuiseries", spec.filters.isolationMenuiseries);

          if (specialty !== "all") params.set("specialty", specialty);
          if (profile) {
            params.set("artisanLat", profile.latitude.toString());
            params.set("artisanLng", profile.longitude.toString());
          }

          const res = await fetch(`/api/map-points?${params.toString()}`);
          const data = await res.json();
          return data.points || [];
        });

        const results = await Promise.all(fetches);
        for (const pts of results) {
          allPoints.push(...pts);
        }

        // Filtrer par rayon
        let filteredPoints = allPoints;
        if (profile) {
          filteredPoints = allPoints.filter((p) =>
            distanceKm(profile.latitude, profile.longitude, p.lat, p.lng) <= profile.radiusKm
          );
        }

        setPoints(filteredPoints);
        setTotal(filteredPoints.length);
      } catch {
        setPoints([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }

    fetchPoints();
  }, [department, specialty, profile]);

  const specLabel = getSpecialtyById(specialty);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          {profile ? `Prospects autour de ${profile.city}` : "Carte des prospects"}
        </h1>
        <p className="text-gray-500 mt-1">
          {loading ? "Chargement..." : (
            <>
              <span className="font-heading font-bold text-gray-900">{total.toLocaleString("fr-FR")}</span> prospects
              {profile && <span> dans un rayon de {profile.radiusKm} km</span>}
              {specialty !== "all" && <span> — {specLabel.label}</span>}
            </>
          )}
        </p>
      </div>

      <Card padding="sm" className="overflow-hidden">
        <div className="h-[650px] rounded-xl overflow-hidden relative">
          {/* Légende */}
          <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-md border border-gray-200">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Pertinence</div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
                <span className="text-xs text-gray-600">Excellent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#C8F23D]" />
                <span className="text-xs text-gray-600">Bon</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span className="text-xs text-gray-600">Moyen</span>
              </div>
            </div>
          </div>
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
