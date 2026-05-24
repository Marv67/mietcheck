/**
 * schema.org-Helper für strukturierte Daten (JSON-LD).
 *
 * SEO-Wirkung pro Schema:
 *  - Organization → Knowledge-Panel-Eligibility, Marken-Identitaet
 *  - WebSite mit SearchAction → Sitelinks-Searchbox in den SERPs
 *  - FAQPage → Akkordeon-Rich-Result (massiver CTR-Boost bei
 *    Question-Type-Searches)
 *
 * Best Practice (Google):
 *  - Eigenes <script type="application/ld+json"> pro Schema (sauber
 *    parsbar, kein @graph noetig fuer kleine Setups)
 *  - URL-Felder absolut, ohne Trailing-Slash-Inkonsistenzen
 *  - Nur Daten, die im sichtbaren Content auch wirklich vorkommen
 *    (Google bestraft Diskrepanz seit Helpful-Content-Update)
 */

import type { FaqItem } from "./landing-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mietcheck.de";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "MietCheck",
    url: SITE_URL,
    // SEO-TODO: logo-URL sobald 512x512 PNG/SVG-Asset existiert
    // logo: `${SITE_URL}/logo.png`,
    description:
      "Automatisierte Ersteinschätzung deutscher Wohnraummietverträge auf Basis aktueller BGH-Rechtsprechung.",
    areaServed: { "@type": "Country", name: "Deutschland" },
    knowsLanguage: ["de"],
    // SEO-TODO: sameAs-Profile (Twitter, LinkedIn, etc.) sobald vorhanden
    // sameAs: ["https://twitter.com/mietcheck", "https://linkedin.com/company/mietcheck"]
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "MietCheck",
    description: "Mietvertrag prüfen – unwirksame Klauseln finden",
    inLanguage: "de-DE",
    publisher: { "@id": `${SITE_URL}/#organization` },
    // SearchAction: signalisiert Google die interne Suchfunktion.
    // SEO-TODO: erst aktivieren wenn /suche?q={query} tatsächlich
    // funktioniert. Aktuell auskommentiert um keine 404-Pfade zu signalisieren.
    // potentialAction: {
    //   "@type": "SearchAction",
    //   target: {
    //     "@type": "EntryPoint",
    //     urlTemplate: `${SITE_URL}/suche?q={search_term_string}`,
    //   },
    //   "query-input": "required name=search_term_string",
    // },
  };
}

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

/**
 * Wird in einer Page-Komponente als <JsonLd data={...} /> eingebettet.
 * `dangerouslySetInnerHTML` ist hier sicher, weil die Daten aus
 * eigenem Code stammen (keine User-Inputs).
 */
export function JsonLd({ data, id }: { data: object; id?: string }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
