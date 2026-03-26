"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Circle, useMap } from "react-leaflet";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";
import type { MapPoint } from "@/types";

const DEPT_CENTERS: Record<string, [number, number]> = {
  "62": [50.45, 2.75],
  "38": [45.19, 5.73],
  "57": [49.12, 6.18],
};

function getDpeColor(dpe: string): string {
  return dpe === "G" ? "#EE1D23" : "#F08C1E";
}

function RecenterMap({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1 });
  }, [center[0], center[1], zoom, map]);

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
      {points.map((point) => (
        <CircleMarker
          key={point.id}
          center={[point.lat, point.lng]}
          radius={8}
          pathOptions={{
            fillColor: getDpeColor(point.dpe),
            fillOpacity: 0.6,
            color: getDpeColor(point.dpe),
            weight: 2,
            opacity: 0.8,
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
      ))}
    </MapContainer>
  );
}
