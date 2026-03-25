"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DpeBadge from "@/components/DpeBadge";
import ScoreBadge from "@/components/ScoreBadge";
import { SPECIALTIES, getSpecialtyById } from "@/lib/specialties";
import type { ProspectPublic } from "@/types";

const DEPARTMENTS = [
  { code: "62", label: "Pas-de-Calais (62)" },
  { code: "38", label: "Isère (38)" },
  { code: "57", label: "Moselle (57)" },
];

const CHAUFFAGE_OPTIONS = [
  { value: "", label: "Tous chauffages" },
  { value: "Fioul domestique", label: "Fioul" },
  { value: "Gaz naturel", label: "Gaz" },
  { value: "Électricité", label: "Électricité" },
  { value: "Bois - Bûches", label: "Bois" },
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

function getIsolationBadge(value: string | null) {
  if (!value) return null;
  const v = value.toLowerCase();
  if (v.includes("bonne")) return { label: "Isolation bonne", color: "text-green-700 bg-green-50" };
  if (v.includes("moyenne")) return { label: "Isolation moyenne", color: "text-amber-700 bg-amber-50" };
  if (v.includes("insuffisante")) return { label: "Isolation insuffisante", color: "text-red-700 bg-red-50" };
  return null;
}

export default function ProspectsPage() {
  const [department, setDepartment] = useState("62");
  const [specialty, setSpecialty] = useState("all");
  const [chauffage, setChauffage] = useState("");
  const [freshness, setFreshness] = useState("");
  const [surfaceMin, setSurfaceMin] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [prospects, setProspects] = useState<ProspectPublic[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Quand on change de spécialité
  useEffect(() => {
    const spec = getSpecialtyById(specialty);
    if (spec.filters.typeEnergieChauffage) setChauffage(spec.filters.typeEnergieChauffage);
    else setChauffage("");
    if (spec.filters.surfaceMin) setSurfaceMin(spec.filters.surfaceMin);
    else setSurfaceMin(0);
    setPage(1);
  }, [specialty]);

  const fetchProspects = useCallback(async () => {
    setLoading(true);
    try {
      const spec = getSpecialtyById(specialty);
      const dpe = spec.filters.etiquetteDpe || ["F", "G"];

      const params = new URLSearchParams({
        department,
        dpe: dpe.join(","),
        page: page.toString(),
      });
      if (chauffage) params.set("chauffage", chauffage);
      if (surfaceMin > 0) params.set("surfaceMin", surfaceMin.toString());

      const dateMin = getDateMin(freshness);
      if (dateMin) params.set("dateMin", dateMin);

      if (spec.filters.isolationMurs) params.set("isolationMurs", spec.filters.isolationMurs);
      if (spec.filters.isolationEnveloppe) params.set("isolationEnveloppe", spec.filters.isolationEnveloppe);
      if (spec.filters.isolationMenuiseries) params.set("isolationMenuiseries", spec.filters.isolationMenuiseries);

      const res = await fetch(`/api/prospects?${params.toString()}`);
      const data = await res.json();
      setProspects(data.results || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      setProspects([]);
    } finally {
      setLoading(false);
    }
  }, [department, specialty, chauffage, freshness, surfaceMin, page]);

  useEffect(() => {
    fetchProspects();
  }, [fetchProspects]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Prospects</h1>
          <p className="text-gray-500 mt-1">
            {loading ? "Chargement..." : (
              <>
                <span className="font-heading font-bold text-gray-900">{total.toLocaleString("fr-FR")}</span> prospect{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
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
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Département</label>
            <select
              value={department}
              onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.code} value={d.code}>{d.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Chauffage</label>
            <select
              value={chauffage}
              onChange={(e) => { setChauffage(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50"
            >
              {CHAUFFAGE_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Surface min.</label>
            <input
              type="number"
              value={surfaceMin || ""}
              onChange={(e) => { setSurfaceMin(Number(e.target.value)); setPage(1); }}
              placeholder="0 m²"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-24 bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50"
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
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Fraîcheur DPE</label>
              <select
                value={freshness}
                onChange={(e) => { setFreshness(e.target.value); setPage(1); }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50"
              >
                {FRESHNESS_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Card>

      {/* Prospect list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
                <div className="w-16 h-8 bg-gray-200 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {prospects.map((prospect) => {
            const isolation = getIsolationBadge(prospect.isolationResume);
            return (
              <Link key={prospect.id} href={`/prospects/${prospect.id}`}>
                <Card className="hover:border-chartreuse/40 hover:shadow-md transition-all duration-200 cursor-pointer">
                  <div className="flex items-center gap-5">
                    <DpeBadge etiquette={prospect.etiquetteDpe} size="lg" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-bold text-gray-900">{prospect.city}</h3>
                        <span className="text-sm text-gray-400">{prospect.postalCode}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span>{prospect.typeEnergieChauffage}</span>
                        <span className="text-gray-300">|</span>
                        <span>{prospect.surfaceRange}</span>
                        <span className="text-gray-300">|</span>
                        <span>{prospect.typeBatiment}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {prospect.coutAnnuel && prospect.coutAnnuel > 0 && (
                        <span className="text-sm font-heading font-bold text-gray-900">
                          {Math.round(prospect.coutAnnuel).toLocaleString("fr-FR")} €<span className="text-xs text-gray-400 font-normal">/an</span>
                        </span>
                      )}
                      {isolation && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${isolation.color}`}>
                          {isolation.label}
                        </span>
                      )}
                      <ScoreBadge score={prospect.score} size="sm" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Précédent
          </Button>
          <span className="text-sm text-gray-500">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}
