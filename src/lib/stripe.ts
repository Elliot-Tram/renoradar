import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

// Plans d'abonnement
export const PLANS = [
  {
    id: "decouverte",
    name: "Découverte",
    priceCents: 0,
    fichesPerMonth: 3, // one-shot, pas mensuel
    accessDelay: null,
    maxArtisans: null,
    label: "Gratuit",
  },
  {
    id: "artisan",
    name: "Artisan",
    priceCents: 4900,
    fichesPerMonth: 30,
    accessDelay: 7, // J+7
    maxArtisans: null,
    label: "49 €/mois",
  },
  {
    id: "artisan-pro",
    name: "Artisan Pro",
    priceCents: 14900,
    fichesPerMonth: null, // illimité
    accessDelay: 0, // J+0
    maxArtisans: 5, // semi-exclusive
    label: "149 €/mois",
  },
  {
    id: "exclusif",
    name: "Exclusif",
    priceCents: 39900,
    fichesPerMonth: null, // illimité
    accessDelay: 0,
    maxArtisans: 2, // exclusive
    label: "399 €/mois",
  },
] as const;

// Packs de crédits (achat one-shot)
export const CREDIT_PACKS = [
  { credits: 10, priceCents: 2900, label: "10 fiches — 29 €", pricePerFiche: "2,90 €" },
  { credits: 30, priceCents: 6900, label: "30 fiches — 69 €", pricePerFiche: "2,30 €" },
  { credits: 100, priceCents: 19900, label: "100 fiches — 199 €", pricePerFiche: "1,99 €" },
] as const;
