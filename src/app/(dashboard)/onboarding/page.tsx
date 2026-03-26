"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { saveProfile, extractDepartment, activateAdmin } from "@/lib/profile";
import { SPECIALTIES } from "@/lib/specialties";

const RADIUS_OPTIONS = [
  { value: 10, label: "10 km" },
  { value: 20, label: "20 km" },
  { value: 30, label: "30 km" },
  { value: 50, label: "50 km" },
];

function RadarLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-2 -2 52 52" fill="none">
      <circle cx="24" cy="24" r="4.5" fill="currentColor" />
      <path d="M24 14a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 7a17 17 0 0 1 17 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <path d="M24 1a23 23 0 0 1 23 23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [company, setCompany] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [cityResults, setCityResults] = useState<Array<{ label: string; city: string; postcode: string; context: string; lat: number; lng: number }>>([]);
  const [selectedCity, setSelectedCity] = useState<{ label: string; city: string; postcode: string; context: string; lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState(30);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [adminCode, setAdminCode] = useState("");

  const specialties = SPECIALTIES.filter((s) => s.id !== "all");

  async function searchCity(query: string) {
    setCityQuery(query);
    if (query.length < 3) {
      setCityResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`https://api-adresse.data.gouv.fr/search?q=${encodeURIComponent(query)}&type=municipality&limit=5`);
      const data = await res.json();
      setCityResults(
        (data.features || []).map((f: { properties: { label: string; city: string; postcode: string; context: string }; geometry: { coordinates: number[] } }) => ({
          label: f.properties.label,
          city: f.properties.city,
          postcode: f.properties.postcode,
          context: f.properties.context,
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
        }))
      );
    } catch {
      setCityResults([]);
    } finally {
      setSearching(false);
    }
  }

  function selectCity(city: typeof cityResults[0]) {
    setSelectedCity(city);
    setCityQuery(city.label);
    setCityResults([]);
  }

  async function handleSubmit() {
    if (!selectedCity || !specialty || !company) return;
    setSaving(true);

    saveProfile({
      company,
      specialty,
      city: selectedCity.city,
      department: extractDepartment(selectedCity.context),
      postalCode: selectedCity.postcode,
      latitude: selectedCity.lat,
      longitude: selectedCity.lng,
      radiusKm,
    });

    if (adminCode) activateAdmin(adminCode);

    router.push("/carte");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4 text-gray-900">
            <RadarLogo size={48} />
          </div>
          <h1 className="font-heading text-3xl font-bold text-gray-900 tracking-tight">
            Configurez votre espace
          </h1>
          <p className="text-gray-500 mt-2">
            On adapte les résultats à votre métier et votre zone
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 max-w-xs mx-auto">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-gray-900" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Company + Specialty */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-gray-900 mb-6">Votre entreprise</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l&apos;entreprise
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ex: Verizo, Geothermie Vanhaecke..."
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50 focus:border-chartreuse"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Votre spécialité principale
              </label>
              <div className="grid grid-cols-2 gap-2">
                {specialties.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => setSpecialty(spec.id)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                      specialty === spec.id
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium">{spec.label}</div>
                    <div className={`text-xs mt-0.5 ${specialty === spec.id ? "text-gray-400" : "text-gray-400"}`}>
                      {spec.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={!company || !specialty}
              onClick={() => setStep(2)}
            >
              Continuer
            </Button>
          </div>
        )}

        {/* Step 2: City + Radius */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-gray-900 mb-6">Votre zone d&apos;intervention</h2>

            <div className="mb-6 relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville de votre entreprise
              </label>
              <input
                type="text"
                value={cityQuery}
                onChange={(e) => searchCity(e.target.value)}
                placeholder="Tapez votre ville..."
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50 focus:border-chartreuse"
              />
              {searching && (
                <div className="absolute right-3 top-10 text-xs text-gray-400">Recherche...</div>
              )}
              {cityResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {cityResults.map((city, i) => (
                    <button
                      key={i}
                      onClick={() => selectCity(city)}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 cursor-pointer"
                    >
                      <div className="font-medium text-gray-900">{city.city}</div>
                      <div className="text-xs text-gray-400">{city.context}</div>
                    </button>
                  ))}
                </div>
              )}
              {selectedCity && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-green-700 font-medium">{selectedCity.city} ({extractDepartment(selectedCity.context)})</span>
                </div>
              )}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rayon d&apos;intervention
              </label>
              <div className="flex gap-2">
                {RADIUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setRadiusKm(opt.value)}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                      radiusKm === opt.value
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(1)} className="flex-1">
                Retour
              </Button>
              <Button
                className="flex-1"
                size="lg"
                disabled={!selectedCity}
                onClick={() => setStep(3)}
              >
                Continuer
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Recap */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-gray-900 mb-6">Récapitulatif</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Entreprise</span>
                <span className="text-sm font-medium text-gray-900">{company}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Spécialité</span>
                <span className="text-sm font-medium text-gray-900">
                  {specialties.find((s) => s.id === specialty)?.label}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Ville</span>
                <span className="text-sm font-medium text-gray-900">{selectedCity?.city}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Département</span>
                <span className="text-sm font-medium text-gray-900">{selectedCity ? extractDepartment(selectedCity.context) : ""}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-gray-500">Zone</span>
                <span className="text-sm font-medium text-gray-900">{radiusKm} km autour de {selectedCity?.city}</span>
              </div>
            </div>

            <div className="mb-6">
              <input
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Code d'accès (optionnel)"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50 focus:border-chartreuse text-gray-400"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep(2)} className="flex-1">
                Modifier
              </Button>
              <Button
                className="flex-1"
                size="lg"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Chargement..." : "Accéder à mes prospects"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
