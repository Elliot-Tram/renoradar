"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DpeBadge from "@/components/DpeBadge";
import ScoreBadge from "@/components/ScoreBadge";
import { getSpecialtyById } from "@/lib/specialties";
import { getProfile } from "@/lib/profile";
import type { ProspectPublic } from "@/types";

function getIsolationBadge(value: string | null) {
  if (!value) return null;
  const v = value.toLowerCase();
  if (v.includes("bonne")) return { label: "Isolation bonne", color: "text-green-700 bg-green-50" };
  if (v.includes("moyenne")) return { label: "Isolation moyenne", color: "text-amber-700 bg-amber-50" };
  if (v.includes("insuffisante")) return { label: "Isolation insuffisante", color: "text-red-700 bg-red-50" };
  return null;
}

export default function ProspectsPage() {
  const profile = getProfile();
  const department = profile?.department || "62";
  const specialty = profile?.specialty || "all";

  const [prospects, setProspects] = useState<ProspectPublic[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

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
  }, [department, specialty, page]);

  useEffect(() => {
    fetchProspects();
  }, [fetchProspects]);

  const specLabel = getSpecialtyById(specialty);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Prospects</h1>
        <p className="text-gray-500 mt-1">
          {loading ? "Chargement..." : (
            <>
              <span className="font-heading font-bold text-gray-900">{total.toLocaleString("fr-FR")}</span> prospect{total > 1 ? "s" : ""}
              {specialty !== "all" && <span> — {specLabel.label}</span>}
              {profile && <span className="text-gray-400"> — {profile.city} ({department})</span>}
            </>
          )}
        </p>
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
