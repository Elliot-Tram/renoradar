"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Card from "@/components/ui/Card";
import { getSpecialtyById } from "@/lib/specialties";
import { getProfile, radiusToZoom } from "@/lib/profile";
import { distanceKm } from "@/lib/transform";
import type { MapPoint } from "@/types";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function CartePage() {
  const profile = getProfile();

  const [points, setPoints] = useState<MapPoint[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const department = profile?.department || "62";
  const specialty = profile?.specialty || "all";
  const mapCenter: [number, number] | undefined = profile
    ? [profile.latitude, profile.longitude]
    : undefined;
  const mapZoom = profile ? radiusToZoom(profile.radiusKm) : 9;

  const fetchPoints = useCallback(async () => {
    setLoading(true);
    try {
      const spec = getSpecialtyById(specialty);
      const dpe = spec.filters.etiquetteDpe || ["F", "G"];

      const params = new URLSearchParams({ department, dpe: dpe.join(",") });

      if (spec.filters.typeEnergieChauffage) params.set("chauffage", spec.filters.typeEnergieChauffage);
      if (spec.filters.surfaceMin) params.set("surfaceMin", spec.filters.surfaceMin.toString());
      if (spec.filters.isolationMurs) params.set("isolationMurs", spec.filters.isolationMurs);
      if (spec.filters.isolationEnveloppe) params.set("isolationEnveloppe", spec.filters.isolationEnveloppe);
      if (spec.filters.isolationMenuiseries) params.set("isolationMenuiseries", spec.filters.isolationMenuiseries);

      const res = await fetch(`/api/map-points?${params.toString()}`);
      const data = await res.json();

      let filteredPoints: MapPoint[] = data.points || [];

      // Filtrer par rayon si profil défini
      if (profile) {
        filteredPoints = filteredPoints.filter((p) =>
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
  }, [department, specialty, profile]);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

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

      {/* Map */}
      <Card padding="sm" className="overflow-hidden">
        <div className="h-[650px] rounded-xl overflow-hidden relative">
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
