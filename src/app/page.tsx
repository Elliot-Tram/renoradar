import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DpeBadge from "@/components/DpeBadge";
import ScoreBadge from "@/components/ScoreBadge";

function RadarLogo({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-2 -2 52 52"
      fill="none"
      className={className}
    >
      <circle cx="24" cy="24" r="4.5" fill="currentColor" />
      <path
        d="M24 14a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M24 7a17 17 0 0 1 17 17"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M24 1a23 23 0 0 1 23 23"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
      <path d="M3 8.5l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-400">
      <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-gray-900">
            <RadarLogo size={28} />
            <span className="font-heading font-bold text-lg tracking-tight">RénoRadar</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/connexion"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium px-3 py-2"
            >
              Connexion
            </Link>
            <Link href="/inscription">
              <Button size="sm">Essai gratuit</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════ HERO ═══ */}
      <section className="relative bg-gray-50 pt-32 pb-24 overflow-hidden">
        {/* Radar pulse background — gris foncé, bien visible sur fond clair */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-gray-400/[0.15]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-gray-400/[0.20]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-gray-400/[0.25]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-gray-400/[0.30]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-400/30" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-8 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-chartreuse" />
            <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">
              Données ADEME en temps réel
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6">
            Détectez les passoires
            <br />
            thermiques{" "}
            <span className="text-chartreuse-dark">près de chez vous</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Accédez aux DPE F et G de votre département.
            <br className="hidden sm:block" />
            Identifiez les propriétaires. Prospectez par courrier.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/inscription">
              <Button size="lg" className="text-base px-8">
                Commencer gratuitement
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-400">3 fiches prospects offertes, sans engagement</p>
        </div>

        {/* Stats strip */}
        <div className="relative max-w-3xl mx-auto px-6 mt-20">
          <div className="grid grid-cols-3 divide-x divide-gray-200">
            {[
              { value: "14.3M", label: "DPE analysés" },
              { value: "4.8M", label: "Passoires thermiques" },
              { value: "101", label: "Départements couverts" },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-4 py-2">
                <div className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ HOW IT WORKS ═══ */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Comment ça marche
            </h2>
            <p className="text-gray-500 mt-3 text-lg">
              De la recherche au courrier en 3 étapes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Ciblez votre zone",
                desc: "Choisissez votre département, le type de chauffage à remplacer, la surface minimum. Filtrez les prospects qui correspondent à votre spécialité.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="14" r="5" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 19v7M12 30h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M6 14c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Consultez les fiches",
                desc: "DPE, type de chauffage, isolation, surface, score de priorité. Chaque fiche est un chantier potentiel qualifié par nos algorithmes.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="4" y="4" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
                    <path d="M10 12h12M10 17h8M10 22h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Prospectez",
                desc: "Envoyez un courrier manuscrit personnalisé en 1 clic. Le seul canal légal pour la rénovation énergétique. Livré en J+2.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M4 10l12 8 12-8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <rect x="4" y="8" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
                    <path d="M4 26l9-8M28 26l-9-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-chartreuse/40 hover:shadow-lg hover:shadow-chartreuse/[0.04] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-heading text-sm font-bold text-chartreuse-dark tracking-wider">
                    {item.step}
                  </span>
                  <div className="h-px flex-1 bg-gray-200 group-hover:bg-chartreuse/30 transition-colors" />
                </div>
                <div className="text-gray-400 mb-4 group-hover:text-chartreuse-dark transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-[15px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════ SAMPLE PROSPECT ═══ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Une fiche prospect, c&apos;est quoi ?
            </h2>
            <p className="text-gray-500 mt-3 text-lg">
              Toutes les infos pour décrocher le chantier
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card padding="lg" className="relative overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading text-xl font-bold text-gray-900">Bapaume</h3>
                    <span className="text-sm text-gray-400">62450</span>
                  </div>
                  <p className="text-sm text-gray-400">Pas-de-Calais (62)</p>
                </div>
                <ScoreBadge score={85} />
              </div>

              {/* Visible fields */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">DPE</div>
                  <div className="flex items-center gap-2">
                    <DpeBadge etiquette="G" size="lg" />
                    <span className="text-sm text-gray-600 font-medium">Passoire thermique</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Chauffage</div>
                  <div className="font-heading text-lg font-bold text-gray-900">Fioul</div>
                  <div className="text-xs text-gray-400">domestique</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Surface</div>
                  <div className="font-heading text-lg font-bold text-gray-900">80-100 m&sup2;</div>
                  <div className="text-xs text-gray-400">Maison individuelle</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Propriétaire</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-green-700">Identifié</span>
                  </div>
                </div>
              </div>

              {/* Locked fields */}
              <div className="space-y-3 mb-8">
                {[
                  { label: "Adresse complète", value: "12 rue du Mar████████████" },
                  { label: "Propriétaire", value: "SCI ██████████" },
                  { label: "Dirigeant", value: "████████ ████████" },
                  { label: "Argumentaire", value: "██████████████████████████" },
                ].map((field) => (
                  <div
                    key={field.label}
                    className="flex items-center justify-between py-2.5 px-4 bg-gray-900/[0.02] rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <LockIcon />
                      <span className="text-sm text-gray-400">{field.label}</span>
                    </div>
                    <span className="text-sm text-gray-300 select-none blur-[5px]">
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button className="w-full" size="lg">
                Débloquer cette fiche
              </Button>
            </Card>

            <p className="text-center text-sm text-gray-400 mt-6 max-w-md mx-auto leading-relaxed">
              Chaque fiche contient l&apos;adresse exacte, les détails d&apos;isolation,
              le propriétaire et un argumentaire personnalisé.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ PRICING ═══ */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Tarifs simples, sans surprise
            </h2>
            <p className="text-gray-500 mt-3 text-lg">
              Commencez gratuitement, payez quand vous trouvez vos chantiers
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-5 items-start">
            {/* Découverte */}
            <div className="rounded-2xl border border-gray-200 p-7 bg-white">
              <div className="mb-6">
                <h3 className="font-heading text-lg font-bold text-gray-900">Découverte</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="font-heading text-4xl font-bold text-gray-900">0&euro;</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">Pour tester la plateforme</p>
              </div>
              <Link href="/inscription">
                <Button variant="outline" className="w-full" size="md">
                  Créer mon compte
                </Button>
              </Link>
              <ul className="mt-8 space-y-3">
                {[
                  "3 fiches offertes",
                  "Carte interactive",
                  "Filtres basiques",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Artisan */}
            <div className="rounded-2xl border border-gray-200 p-7 bg-white">
              <div className="mb-6">
                <h3 className="font-heading text-lg font-bold text-gray-900">Artisan</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="font-heading text-4xl font-bold text-gray-900">49&euro;</span>
                  <span className="text-gray-400 text-sm">/mois</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">Pour démarrer la prospection</p>
              </div>
              <Link href="/inscription">
                <Button variant="outline" className="w-full" size="md">
                  Commencer
                </Button>
              </Link>
              <ul className="mt-8 space-y-3">
                {[
                  "Jusqu'à 30 fiches par mois",
                  "Accès J+7",
                  "Filtres avancés",
                  "Courrier Manuscry intégré",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Artisan Pro — highlighted */}
            <div className="rounded-2xl border-2 border-chartreuse p-7 bg-white relative shadow-xl shadow-chartreuse/[0.06]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-chartreuse text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Populaire
                </span>
              </div>
              <div className="mb-6">
                <h3 className="font-heading text-lg font-bold text-gray-900">Artisan Pro</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="font-heading text-4xl font-bold text-gray-900">149&euro;</span>
                  <span className="text-gray-400 text-sm">/mois</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">Prospection sans limite</p>
              </div>
              <Link href="/inscription">
                <Button className="w-full" size="md">
                  Commencer
                </Button>
              </Link>
              <ul className="mt-8 space-y-3">
                {[
                  "Fiches illimitées",
                  "Accès J+0 aux nouveaux DPE",
                  "Zone semi-exclusive (max 5)",
                  "Enrichissement propriétaire",
                  "Courrier Manuscry intégré",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="text-chartreuse-dark"><CheckIcon /></span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusif */}
            <div className="rounded-2xl border border-gray-200 p-7 bg-white">
              <div className="mb-6">
                <h3 className="font-heading text-lg font-bold text-gray-900">Exclusif</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="font-heading text-4xl font-bold text-gray-900">399&euro;</span>
                  <span className="text-gray-400 text-sm">/mois</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">Votre zone, vos chantiers</p>
              </div>
              <Link href="/inscription">
                <Button variant="secondary" className="w-full" size="md">
                  Nous contacter
                </Button>
              </Link>
              <ul className="mt-8 space-y-3">
                {[
                  "Tout Artisan Pro inclus",
                  "Zone exclusive (max 2)",
                  "Alertes nouveaux DPE",
                  "Support dédié",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ URGENCY ═══ */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(200,242,61,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(200,242,61,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Les interdictions de location arrivent
            </h2>
            <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
              Les propriétaires de passoires thermiques n&apos;ont plus le choix. Ils doivent rénover.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative max-w-2xl mx-auto mb-16">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-dpe-g via-dpe-f to-dpe-e" />

            {[
              {
                year: "2025",
                label: "DPE G interdit",
                detail: "Location interdite pour les logements classés G",
                color: "bg-dpe-g",
                active: true,
              },
              {
                year: "2028",
                label: "DPE F interdit",
                detail: "Location interdite pour les logements classés F",
                color: "bg-dpe-f",
                active: false,
              },
              {
                year: "2034",
                label: "DPE E interdit",
                detail: "Location interdite pour les logements classés E",
                color: "bg-dpe-e",
                active: false,
              },
            ].map((item) => (
              <div key={item.year} className="relative flex items-start gap-6 mb-10 last:mb-0">
                <div
                  className={`relative z-10 w-12 h-12 rounded-full ${item.color} flex items-center justify-center font-heading font-bold text-white text-sm shrink-0 ${
                    item.active ? "ring-4 ring-white/20" : ""
                  }`}
                >
                  {item.year.slice(2)}
                </div>
                <div className="pt-2">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-heading text-xl font-bold text-white">
                      {item.year} — {item.label}
                    </h3>
                    {item.active && (
                      <span className="text-[11px] bg-dpe-g/20 text-dpe-g px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        En vigueur
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-xl text-white font-medium mb-8 max-w-lg mx-auto leading-relaxed">
              <span className="font-heading text-chartreuse font-bold">4.8 millions</span> de propriétaires
              doivent rénover. Soyez le premier artisan qu&apos;ils contactent.
            </p>
            <Link href="/inscription">
              <Button size="lg" className="text-base px-8">
                Trouver mes prospects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ FOOTER ═══ */}
      <footer className="bg-gray-900 border-t border-white/[0.06] py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-white mb-2">
                <RadarLogo size={22} />
                <span className="font-heading font-bold text-base">RénoRadar</span>
              </div>
              <p className="text-sm text-gray-500">
                Détectez les passoires thermiques près de chez vous
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/mentions-legales" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                Mentions légales
              </Link>
              <a href="mailto:contact@renoradar.fr" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <p className="text-xs text-gray-600">
              Données DPE fournies par l&apos;ADEME — Licence Ouverte v2.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
