import Link from "next/link";

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8 inline-block">
          &larr; Retour
        </Link>
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-8">Mentions légales</h1>
        <div className="prose prose-gray max-w-none text-sm text-gray-600 space-y-6">
          <section>
            <h2 className="font-heading text-lg font-bold text-gray-900">Éditeur</h2>
            <p>RénoRadar — [Raison sociale à compléter]</p>
            <p>Contact : contact@renoradar.fr</p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-gray-900">Hébergement</h2>
            <p>Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-gray-900">Données</h2>
            <p>
              Les données DPE sont fournies par l&apos;ADEME et diffusées sous Licence Ouverte v2.0 (Etalab).
              L&apos;utilisation commerciale est autorisée avec mention de la source.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-gray-900">RGPD</h2>
            <p>
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression
              de vos données personnelles. Contact : contact@renoradar.fr
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
