/**
 * Datenschutzerklaerung nach DSGVO + BDSG.
 *
 * STUB: aktueller Inhalt nur Platzhalter, noindex bis finaler Text steht.
 *
 * LEGAL-TODO (vor Live-Gang ausfuellen — relevante Datenkategorien
 * fuer MietCheck):
 *  - Verantwortlicher gem. Art. 4 Nr. 7 DSGVO
 *  - Hosting (Vercel — USA mit Standardvertragsklauseln, oder EU-Region
 *    fra1) inkl. Auftragsverarbeitungsvertrag
 *  - Anthropic API (USA, Standardvertragsklauseln + AV-Vertrag)
 *    -> Klar dokumentieren: Vertragstext wird zur Analyse an Anthropic
 *    uebermittelt und NICHT zum Training verwendet (zero retention).
 *  - Aufbewahrungsfristen: Vertragstext nach Analyse sofort verworfen
 *  - Rechtsgrundlagen: Art. 6 Abs. 1 lit. b (Vertragserfuellung)
 *    fuer die Analyse, Art. 6 Abs. 1 lit. f (berechtigtes Interesse)
 *    fuer technisch notwendige Logs
 *  - Cookies / Tracking: aktuell KEINE Tracking-Cookies, kein
 *    Cookie-Banner erforderlich. Wenn spaeter Analytics dazukommt
 *    (z.B. Plausible/Umami EU-gehostet), entsprechend ergaenzen.
 *  - Betroffenenrechte: Auskunft, Berichtigung, Loeschung, Einschraenkung,
 *    Datenuebertragbarkeit, Widerspruch, Beschwerderecht bei Aufsichtsbehoerde
 *  - Kontakt Datenschutzbeauftragter (falls erforderlich)
 *  - SSL/TLS-Verschluesselungshinweis
 *
 * Empfohlene Generatoren als Startpunkt:
 *  - https://datenschutz-generator.de/ (Dr. Schwenke)
 *  - https://www.activemind.de/datenschutz/datenschutzerklaerung-generator/
 */

import type { Metadata } from "next";
import LegalPageLayout from "../_components/legal-page";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO",
  alternates: { canonical: "/datenschutz" },
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
  return (
    <LegalPageLayout
      title="Datenschutzerklärung"
      intro="Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO und BDSG."
    />
  );
}
