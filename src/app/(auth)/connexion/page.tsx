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

export default function ConnexionPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call NextAuth signIn("email", { email })
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-900 mb-6">
            <RadarLogo />
            <span className="font-heading font-bold text-xl tracking-tight">RénoRadar</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Connexion</h1>
          <p className="text-gray-500 mt-2">
            Entrez votre email pour recevoir un lien de connexion
          </p>
        </div>

        <Card>
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-chartreuse/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#A8D020" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="font-heading text-lg font-bold text-gray-900 mb-2">Email envoyé</h2>
              <p className="text-sm text-gray-500">
                Vérifiez votre boîte mail ({email}) et cliquez sur le lien de connexion.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
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
              <Button className="w-full" size="lg" type="submit">
                Recevoir le lien
              </Button>
            </form>
          )}
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="text-chartreuse-dark font-medium hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
