"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Centre par département
const DEPT_CENTERS: Record<string, [number, number]> = {
  "62": [50.45, 2.75],  // Pas-de-Calais
  "38": [45.19, 5.73],  // Isère
  "57": [49.12, 6.18],  // Moselle
};

// Données de démo (points floutés au niveau commune)
const DEMO_POINTS = [
  { id: "1", lat: 50.11, lng: 2.85, city: "Bapaume", dpe: "G", score: 85 },
  { id: "2", lat: 50.75, lng: 2.25, city: "Saint-Omer", dpe: "F", score: 72 },
  { id: "3", lat: 50.43, lng: 2.83, city: "Arras", dpe: "G", score: 91 },
  { id: "4", lat: 50.29, lng: 2.78, city: "Bapaume", dpe: "F", score: 68 },
  { id: "5", lat: 50.95, lng: 1.85, city: "Calais", dpe: "G", score: 78 },
  { id: "6", lat: 50.72, lng: 1.60, city: "Boulogne", dpe: "F", score: 65 },
  { id: "7", lat: 50.37, lng: 3.07, city: "Douai", dpe: "G", score: 88 },
  { id: "8", lat: 50.52, lng: 2.63, city: "Béthune", dpe: "F", score: 74 },
  { id: "9", lat: 50.47, lng: 2.29, city: "Bruay", dpe: "G", score: 82 },
  { id: "10", lat: 50.69, lng: 2.10, city: "Hazebrouck", dpe: "F", score: 59 },
];

function getDpeColor(dpe: string): string {
  return dpe === "G" ? "#EE1D23" : "#F08C1E";
}

interface MapProps {
  department: string;
}

export default function Map({ department }: MapProps) {
  const center = DEPT_CENTERS[department] || DEPT_CENTERS["62"];

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
      {DEMO_POINTS.map((point) => (
        <CircleMarker
          key={point.id}
          center={[point.lat, point.lng]}
          radius={10}
          pathOptions={{
            fillColor: getDpeColor(point.dpe),
            fillOpacity: 0.6,
            color: getDpeColor(point.dpe),
            weight: 2,
            opacity: 0.8,
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
