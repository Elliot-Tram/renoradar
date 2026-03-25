"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DpeBadge from "@/components/DpeBadge";
import ScoreBadge from "@/components/ScoreBadge";
import type { ProspectPublic } from "@/types";

const DEPARTMENTS = [
  { code: "62", label: "Pas-de-Calais (62)" },
  { code: "38", label: "Isère (38)" },
  { code: "57", label: "Moselle (57)" },
];

export default function ProspectsPage() {
  const [department, setDepartment] = useState("62");
  const [dpeFilter, setDpeFilter] = useState("F,G");
  const [chauffageFilter, setChauffageFilter] = useState("");
  const [prospects, setProspects] = useState<ProspectPublic[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchProspects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ department, dpe: dpeFilter, page: page.toString() });
      if (chauffageFilter) params.set("chauffage", chauffageFilter);

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
  }, [department, dpeFilter, chauffageFilter, page]);

  useEffect(() => {
    fetchProspects();
  }, [fetchProspects]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Prospects</h1>
          <p className="text-gray-500 mt-1">
            {loading ? "Chargement..." : `${total.toLocaleString("fr-FR")} prospect${total > 1 ? "s" : ""} trouvé${total > 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={department}
          onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50"
        >
          {DEPARTMENTS.map((d) => (
            <option key={d.code} value={d.code}>{d.label}</option>
          ))}
        </select>

        <select
          value={dpeFilter}
          onChange={(e) => { setDpeFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50"
        >
          <option value="F,G">DPE F et G</option>
          <option value="F">DPE F uniquement</option>
          <option value="G">DPE G uniquement</option>
        </select>

        <select
          value={chauffageFilter}
          onChange={(e) => { setChauffageFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50"
        >
          <option value="">Tous chauffages</option>
          <option value="Fioul domestique">Fioul</option>
          <option value="Gaz naturel">Gaz</option>
          <option value="Électricité">Électricité</option>
        </select>
      </div>

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
          {prospects.map((prospect) => (
            <Link key={prospect.id} href={`/prospects/${prospect.id}`}>
              <Card className="hover:border-chartreuse/40 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-6">
                  <DpeBadge etiquette={prospect.etiquetteDpe} size="lg" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-gray-900">{prospect.city}</h3>
                      <span className="text-sm text-gray-400">{prospect.postalCode}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>{prospect.typeEnergieChauffage}</span>
                      <span className="text-gray-300">|</span>
                      <span>{prospect.surfaceRange}</span>
                      <span className="text-gray-300">|</span>
                      <span>{prospect.typeBatiment}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {prospect.hasOwnerInfo && (
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
