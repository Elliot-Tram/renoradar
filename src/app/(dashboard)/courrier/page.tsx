import Card from "@/components/ui/Card";

export default function CourrierPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Courriers envoyés</h1>
        <p className="text-gray-500 mt-1">Historique de vos envois Manuscry</p>
      </div>

      <Card>
        <div className="text-center py-12">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto text-gray-300 mb-4">
            <rect x="6" y="12" width="36" height="26" rx="4" stroke="currentColor" strokeWidth="2" />
            <path d="M6 16l18 12 18-12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
            Aucun courrier envoyé
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Débloquez une fiche prospect puis cliquez sur &quot;Envoyer un courrier&quot; pour envoyer une carte manuscrite personnalisée via Manuscry.
          </p>
        </div>
      </Card>
    </div>
  );
}
