import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "./_lib/jsonld";

/*
 * next/font/google self-hostet die Fonts ueber Next.js (kein Request
 * an fonts.googleapis.com im Browser). Vorteile gegenueber externem
 * <link> zu Google Fonts:
 *  - Kein Render-Blocking durch DNS/SSL zu fonts.googleapis.com
 *  - Subsetting auf 'latin' reduziert Byte-Volumen um ~70%
 *  - display: swap verhindert FOIT (Flash of Invisible Text)
 *  - automatisches font-size-adjust gegen CLS waehrend Font-Swap
 *  - keine Cookie-/Datenschutzthematik mit Google
 *
 * SEO-/CWV-Wirkung:
 *  - LCP sinkt um typisch 200-400ms (Hero-Text rendert sofort mit
 *    optimierter Fallback-Schrift, dann kommt die echte Schrift dazu)
 *  - CLS sinkt nahe 0 (size-adjust matched Fallback-Metrics)
 */

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Instrument Serif ist die Hero-Display-Schrift -> preload=true,
// damit sie noch waehrend dem initialen HTTP-Response geladen wird.
// Italic-Variante separat geladen weil im Hero verwendet
// (<span style={{ fontStyle: 'italic' }}>unwirksame Klauseln</span>).
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

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
    default: "Klare Miete – Mietvertrag verstehen",
    template: "%s · Klare Miete",
  },
  description:
    "Automatisierte Ersteinschätzung deutscher Wohnraummietverträge auf Basis aktueller BGH-Rechtsprechung. Keine Rechtsberatung im Sinne des RDG.",
  applicationName: "Klare Miete",
  authors: [{ name: "Klare Miete" }],
  creator: "Klare Miete",
  publisher: "Klare Miete",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: "/",
    languages: { "de-DE": "/" },
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Klare Miete",
    url: "/",
    title: "Klare Miete – Mietvertrag verstehen",
    description:
      "90 % aller Mietverträge enthalten ungültige Regelungen. In 30 Sekunden weißt du, welche.",
    // SEO-TODO: og:image hinzufuegen (1200x630 px) sobald Marketing-Asset
    // existiert. Aktuell faellt Facebook/LinkedIn auf Generisches zurueck.
  },
  twitter: {
    card: "summary_large_image",
    title: "Klare Miete – Mietvertrag verstehen",
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
  const fontClasses = [dmSans.variable, instrumentSerif.variable, jetbrainsMono.variable].join(" ");
  return (
    <html lang="de" className={fontClasses}>
      <body>
        {/*
          Skip-to-Content — versteckt bis Keyboard-Focus.
          Tastatur-User koennen das Menue ueberspringen und direkt
          zum Hauptinhalt springen.
        */}
        <a href="#main-content" className="skip-link">Zum Hauptinhalt springen</a>

        {/*
          Globale schema.org-Markups (Organization + WebSite) — werden
          auf jeder Seite mitgeliefert. FAQPage wird nur dort eingebettet,
          wo tatsaechlich FAQ-Content sichtbar ist (Landingpage).
        */}
        <JsonLd data={organizationJsonLd()} id="ld-org" />
        <JsonLd data={websiteJsonLd()} id="ld-website" />
        {children}
      </body>
    </html>
  );
}
