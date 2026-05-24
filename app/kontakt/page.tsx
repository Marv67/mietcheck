/**
 * Kontaktseite.
 *
 * STUB: aktueller Inhalt nur Platzhalter, noindex bis finaler Text steht.
 *
 * TODO (vor Live-Gang ausfuellen):
 *  - E-Mail-Adresse (z.B. hallo@mietcheck.de) — am besten als
 *    Mailto-Link, NICHT als Klartext (Spam-Schutz). Alternativ
 *    obfuskieren: dezent Unicode-encodierte @ und . trennen.
 *  - Postanschrift (kann mit Impressum identisch sein)
 *  - Optional: Kontaktformular (waere eine eigene API-Route +
 *    Resend/Sendgrid-Integration)
 *  - Reaktionszeiten / Sprechzeiten (Marketing-Erwartungsmanagement)
 *  - Hinweis "Keine Rechtsberatung" + Verweis auf Mieterverein/
 *    Fachanwalt fuer Mietrecht
 */

import type { Metadata } from "next";
import LegalPageLayout from "../_components/legal-page";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktmöglichkeiten zu Klare Miete",
  alternates: { canonical: "/kontakt" },
  robots: { index: false, follow: true },
};

export default function KontaktPage() {
  return (
    <LegalPageLayout
      title="Kontakt"
      intro="Wir freuen uns über Feedback, Hinweise und Anfragen."
    />
  );
}
