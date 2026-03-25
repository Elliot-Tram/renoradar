"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

function RadarLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="5" fill="currentColor" />
      <path d="M24 12a12 12 0 0 1 12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      <path d="M24 6a18 18 0 0 1 18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

const SPECIALITIES = [
  { value: "PAC", label: "Pompe à chaleur" },
  { value: "ISOLATION", label: "Isolation thermique" },
  { value: "MENUISERIE", label: "Menuiseries (fenêtres, portes)" },
  { value: "CHAUDIERE", label: "Chaudière gaz condensation" },
  { value: "SOLAIRE", label: "Solaire (panneaux / chauffe-eau)" },
  { value: "VENTILATION", label: "VMC double flux" },
];

const DEPARTMENTS = [
  { value: "62", label: "Pas-de-Calais (62)" },
  { value: "38", label: "Isère (38)" },
  { value: "57", label: "Moselle (57)" },
];

export default function InscriptionPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [department, setDepartment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // TODO: create account via NextAuth + save profile
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-900 mb-6">
            <RadarLogo />
            <span className="font-heading font-bold text-xl tracking-tight">RénoRadar</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-gray-500 mt-2">3 fiches prospects offertes</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? "bg-chartreuse w-8" : "bg-gray-200 w-4"
              }`}
            />
          ))}
        </div>

        <Card>
          {step === 3 ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-chartreuse/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#A8D020" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="font-heading text-lg font-bold text-gray-900 mb-2">Compte créé</h2>
              <p className="text-sm text-gray-500 mb-4">
                Vérifiez votre email ({email}) pour vous connecter.
              </p>
              <Link href="/connexion">
                <Button className="w-full" size="lg">Se connecter</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="artisan@exemple.fr"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-chartreuse/50 focus:border-chartreuse"
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nom de l&apos;entreprise
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Ex: Dupont Chauffage SARL"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-chartreuse/50 focus:border-chartreuse"
                  />
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Votre spécialité
                  </label>
                  <select
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50 focus:border-chartreuse"
                  >
                    <option value="">Sélectionnez...</option>
                    {SPECIALITIES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>

                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Département principal
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm mb-6 bg-white focus:outline-none focus:ring-2 focus:ring-chartreuse/50 focus:border-chartreuse"
                  >
                    <option value="">Sélectionnez...</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </>
              )}

              <Button className="w-full" size="lg" type="submit">
                {step === 1 ? "Continuer" : "Créer mon compte"}
              </Button>
            </form>
          )}
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="text-chartreuse-dark font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
