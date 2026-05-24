/**
 * Impressum — Pflichtangaben nach § 5 TMG.
 *
 * STUB: aktueller Inhalt nur Platzhalter, noindex bis finaler Text steht.
 *
 * LEGAL-TODO (vor Live-Gang ausfuellen):
 *  - Vollstaendiger Anbietername (natuerliche/juristische Person)
 *  - Anschrift mit Strasse, Hausnummer, PLZ, Ort
 *  - Kontakt (E-Mail, ggf. Telefon)
 *  - Vertretungsberechtigte Person bei juristischer Person
 *  - Handelsregister-Nummer + Registergericht (falls eingetragen)
 *  - Umsatzsteuer-ID (falls vorhanden, sonst Kleinunternehmer-Hinweis
 *    nach § 19 UStG)
 *  - Wirtschafts-ID nach § 139c AO (falls zugewiesen)
 *  - Berufsbezeichnung + Kammer (falls beruflich reglementiert)
 *  - Verantwortlich nach § 18 Abs. 2 MStV (bei journalistischen Inhalten)
 *  - Hinweis auf Online-Streitbeilegung der EU + Hinweis nach VSBG
 *  - Haftungsausschluss
 *
 * Empfohlene Generatoren als Startpunkt:
 *  - https://www.e-recht24.de/impressum-generator.html
 *  - https://datenschutz-generator.de/ (Dr. Schwenke)
 */

import type { Metadata } from "next";
import LegalPageLayout from "../_components/legal-page";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Anbieterkennzeichnung und Impressum nach § 5 TMG",
  alternates: { canonical: "/impressum" },
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <LegalPageLayout
      title="Impressum"
      intro="Anbieterkennzeichnung gemäß § 5 TMG."
    />
  );
}
