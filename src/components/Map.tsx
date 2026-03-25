"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
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

interface MapProps {
  department: string;
  points: MapPoint[];
}

export default function Map({ department, points }: MapProps) {
  const center = DEPT_CENTERS[department] || DEPT_CENTERS["62"];
  const router = useRouter();

  return (
    <MapContainer
      center={center}
      zoom={9}
      className="h-full w-full"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
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
