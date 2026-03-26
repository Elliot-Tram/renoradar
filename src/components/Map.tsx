"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Circle, useMap } from "react-leaflet";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";
import type { MapPoint } from "@/types";

const DEPT_CENTERS: Record<string, [number, number]> = {
  "62": [50.45, 2.75],
  "38": [45.19, 5.73],
  "57": [49.12, 6.18],
};

function getScoreColor(score: number): string {
  if (score >= 80) return "#22C55E"; // vert — excellent
  if (score >= 65) return "#C8F23D"; // chartreuse — bon
  if (score >= 50) return "#F59E0B"; // amber — moyen
  return "#9CA3AF";                  // gris — faible
}

function getScoreRadius(score: number): number {
  if (score >= 80) return 10;
  if (score >= 65) return 8;
  if (score >= 50) return 7;
  return 5;
}

function RecenterMap({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
}

interface MapProps {
  department: string;
  points: MapPoint[];
  center?: [number, number];
  zoom?: number;
  radiusKm?: number;
}

export default function Map({ department, points, center, zoom, radiusKm }: MapProps) {
  const mapCenter = center || DEPT_CENTERS[department] || DEPT_CENTERS["62"];
  const mapZoom = zoom || 9;
  const router = useRouter();

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      className="h-full w-full"
      zoomControl={true}
    >
      <RecenterMap center={mapCenter} zoom={mapZoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {/* Zone circle */}
      {center && radiusKm && (
        <Circle
          center={center}
          radius={radiusKm * 1000}
          pathOptions={{
            color: "#C8F23D",
            fillColor: "#C8F23D",
            fillOpacity: 0.04,
            weight: 2,
            dashArray: "8 4",
          }}
        />
      )}
      {points.map((point) => {
        const color = getScoreColor(point.score);
        const radius = getScoreRadius(point.score);
        return (
          <CircleMarker
            key={point.id}
            center={[point.lat, point.lng]}
            radius={radius}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.7,
              color: color,
              weight: 2,
              opacity: 0.9,
            }}
            eventHandlers={{
              click: () => router.push(`/prospects/${point.id}`),
            }}
          >
            <Tooltip>
              <div className="font-body text-sm">
                <strong>{point.city}</strong> — DPE {point.dpe}
                <br />
                Score : {point.score}/100
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
