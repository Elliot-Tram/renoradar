"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const CREDIT_PACKS = [
  { credits: 5, price: "14 €", perCredit: "2,80 €", popular: false },
  { credits: 15, price: "37,50 €", perCredit: "2,50 €", popular: true },
  { credits: 50, price: "100 €", perCredit: "2,00 €", popular: false },
];

export default function CreditsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Crédits</h1>
        <p className="text-gray-500 mt-1">Achetez des crédits pour débloquer les fiches prospects</p>
      </div>

      {/* Current balance */}
      <Card className="mb-8 bg-gray-900 text-white border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Votre solde actuel</p>
            <p className="font-heading text-4xl font-bold mt-1">3 crédits</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Fiches débloquées</p>
            <p className="font-heading text-4xl font-bold mt-1">0</p>
          </div>
        </div>
      </Card>

      {/* Credit packs */}
      <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">Acheter des crédits</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {CREDIT_PACKS.map((pack) => (
          <Card
            key={pack.credits}
            className={`relative ${pack.popular ? "border-2 border-chartreuse shadow-lg shadow-chartreuse/5" : ""}`}
          >
            {pack.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-chartreuse text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Populaire
              </span>
            )}
            <div className="text-center">
              <p className="font-heading text-4xl font-bold text-gray-900">{pack.credits}</p>
              <p className="text-sm text-gray-500 mt-1">crédits</p>
              <p className="font-heading text-2xl font-bold text-gray-900 mt-4">{pack.price}</p>
              <p className="text-sm text-gray-400 mt-1">{pack.perCredit} par fiche</p>
              <Button
                variant={pack.popular ? "primary" : "outline"}
                className="w-full mt-6"
              >
                Acheter
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
