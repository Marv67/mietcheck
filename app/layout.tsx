import type { Metadata, Viewport } from "next";
import "./globals.css";

/**
 * SEO-TODO: NEXT_PUBLIC_SITE_URL via Vercel-Env setzen, sobald die echte
 * Domain steht. Wert wird als metadataBase fuer alle absoluten URLs
 * (Open-Graph-Images, canonical, etc.) verwendet.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mietcheck.de";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Wird von app/page.tsx und allen Sub-Routes ueberschrieben.
  // Hier nur Defaults fuer Routen ohne eigene Metadata.
  title: {
    default: "MietCheck – Mietvertrag online prüfen lassen",
    template: "%s · MietCheck",
  },
  description:
    "Automatisierte Ersteinschätzung deutscher Wohnraummietverträge auf Basis aktueller BGH-Rechtsprechung. Keine Rechtsberatung im Sinne des RDG.",
  applicationName: "MietCheck",
  authors: [{ name: "MietCheck" }],
  creator: "MietCheck",
  publisher: "MietCheck",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: "/",
    languages: { "de-DE": "/" },
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "MietCheck",
    url: "/",
    title: "MietCheck – Mietvertrag online prüfen lassen",
    description:
      "90 % aller Mietverträge enthalten ungültige Regelungen. In 30 Sekunden weißt du, welche.",
    // SEO-TODO: og:image hinzufuegen (1200x630 px) sobald Marketing-Asset
    // existiert. Aktuell faellt Facebook/LinkedIn auf Generisches zurueck.
  },
  twitter: {
    card: "summary_large_image",
    title: "MietCheck – Mietvertrag online prüfen lassen",
    description:
      "90 % aller Mietverträge enthalten ungültige Regelungen. In 30 Sekunden weißt du, welche.",
    // SEO-TODO: twitter:image + twitter:site sobald Account/Asset existiert
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // SEO-TODO: verification: { google: "GSC-Token" } sobald Search-Console
  // verifiziert ist. Beschleunigt Indexierung beim Go-Live deutlich.
};

/**
 * Viewport wurde von Next.js 14 aus metadata herausgezogen, weil es
 * vom Client gelesen wird (nicht serialisierbar wie der Rest). Eigener
 * Export ist Best-Practice und vermeidet Konsolen-Warnings.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F8F7F4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
