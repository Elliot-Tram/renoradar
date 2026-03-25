"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const DEPARTMENTS = [
  { code: "62", label: "Pas-de-Calais (62)" },
  { code: "38", label: "Isère (38)" },
  { code: "57", label: "Moselle (57)" },
];

const CHAUFFAGE_OPTIONS = [
  "Tous",
  "Fioul domestique",
  "Gaz naturel",
  "Électricité",
  "Charbon",
  "Bois",
];

export default function CartePage() {
  const [department, setDepartment] = useState("62");
  const [chauffage, setChauffage] = useState("Tous");
  const [surfaceMin, setSurfaceMin] = useState(0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Carte des prospects</h1>
          <p className="text-gray-500 mt-1">Passoires thermiques F et G dans votre zone</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Département
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50 focus:border-chartreuse"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.code} value={d.code}>{d.label}</option>
              ))}
            </select>
          </div>

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
                <option key={c} value={c}>{c}</option>
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
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-28 bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50 focus:border-chartreuse"
            />
          </div>

          <Button size="md">Rechercher</Button>
        </div>
      </Card>

      {/* Map */}
      <Card padding="sm" className="overflow-hidden">
        <div className="h-[600px] rounded-xl overflow-hidden">
          <Map department={department} />
        </div>
      </Card>
    </div>
  );
}
