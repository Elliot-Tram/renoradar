import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "@/styles/globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RénoRadar — Détectez les passoires thermiques près de chez vous",
  description:
    "Plateforme de prospects qualifiés pour artisans RGE. Trouvez les passoires thermiques F et G dans votre zone et prospectez les propriétaires.",
  keywords: [
    "passoires thermiques",
    "DPE F G",
    "artisan RGE",
    "rénovation énergétique",
    "prospects",
    "pompe à chaleur",
    "isolation",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${plusJakarta.variable}`}>
      <body className="antialiased">
        <GoogleTagManager gtmId="GTM-PQ53F8RB" />
        {children}
      </body>
    </html>
  );
}
