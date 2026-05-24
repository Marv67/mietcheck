import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MietCheck – Mietvertrag in 30 Sekunden prüfen",
  description:
    "Automatisierte Ersteinschätzung deutscher Wohnraummietverträge. Identifiziert unwirksame Klauseln auf Basis aktueller BGH-Rechtsprechung. Keine Rechtsberatung i.S.d. RDG.",
  keywords: [
    "Mietvertrag prüfen",
    "Mietrecht",
    "unwirksame Klauseln",
    "Schönheitsreparaturen",
    "Kleinreparaturen",
    "Mietpreisbremse",
    "BGH",
  ],
  authors: [{ name: "MietCheck" }],
  openGraph: {
    title: "MietCheck – Dein Mietvertrag enthält vermutlich unwirksame Klauseln",
    description:
      "90 % aller Mietverträge enthalten ungültige Regelungen. In 30 Sekunden weißt du, welche.",
    locale: "de_DE",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
