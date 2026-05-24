/**
 * Allgemeine Geschaeftsbedingungen.
 *
 * STUB: aktueller Inhalt nur Platzhalter, noindex bis finaler Text steht.
 *
 * LEGAL-TODO (vor Live-Gang ausfuellen):
 *  - Geltungsbereich (B2C: Verbraucher in Deutschland)
 *  - Vertragsschluss + Leistungsbeschreibung
 *    (Freier Klausel-Check vs. kostenpflichtiger Vollreport ~4,99 EUR)
 *  - Preise und Zahlungsbedingungen (Lemon Squeezy als Merchant of
 *    Record → die kuemmern sich um USt; Erwaehnung notwendig)
 *  - Widerrufsrecht nach §§ 312g, 355 BGB:
 *    - Bei digitalen Inhalten erlischt das Widerrufsrecht mit
 *      Beginn der Ausfuehrung, sofern der Nutzer ausdruecklich
 *      zustimmt (§ 356 Abs. 5 BGB) — Opt-In im Checkout einbauen!
 *  - Haftungsbeschraenkung: ausdruecklicher Hinweis, dass MietCheck
 *    KEINE Rechtsberatung im Sinne des RDG darstellt; Haftung fuer
 *    Fehlbewertungen ausgeschlossen (soweit nicht Vorsatz/grobe
 *    Fahrlaessigkeit)
 *  - Schlussbestimmungen (Salvatorische, anwendbares Recht =
 *    Deutsches Recht, Gerichtsstand)
 *  - Hinweis OS-Plattform (https://ec.europa.eu/consumers/odr) +
 *    keine Teilnahme am VSBG (oder Teilnahme erklaeren)
 *
 * Empfohlene Generatoren als Startpunkt:
 *  - https://www.it-recht-kanzlei.de/ (kostenpflichtig, aber haftbar)
 *  - https://www.haendlerbund.de/
 *  - Trusted Shops AGB-Service
 */

import type { Metadata } from "next";
import LegalPageLayout from "../_components/legal-page";

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen",
  description: "AGB für die Nutzung von MietCheck",
  alternates: { canonical: "/agb" },
  robots: { index: false, follow: true },
};

export default function AgbPage() {
  return (
    <LegalPageLayout
      title="Allgemeine Geschäftsbedingungen"
      intro="Bedingungen für die Nutzung des MietCheck-Dienstes."
    />
  );
}
