import { NextRequest, NextResponse } from "next/server";
import { stripe, CREDIT_PACKS } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { packIndex, userId } = body;

  if (packIndex < 0 || packIndex >= CREDIT_PACKS.length) {
    return NextResponse.json({ error: "Pack invalide" }, { status: 400 });
  }

  const pack = CREDIT_PACKS[packIndex];

  // TODO: get user from session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `${pack.credits} crédits RénoRadar`,
            description: `Pack de ${pack.credits} fiches prospects`,
          },
          unit_amount: pack.priceCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: userId || "",
      credits: pack.credits.toString(),
    },
    success_url: `${process.env.NEXTAUTH_URL}/credits?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/credits?canceled=true`,
  });

  return NextResponse.json({ url: session.url });
}
