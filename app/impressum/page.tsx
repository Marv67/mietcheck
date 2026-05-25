/**
 * Impressum — Pflichtangaben nach § 5 TMG + § 55 RStV.
 *
 * Vor Live-Gang MUESSEN alle mit [PLATZHALTER] markierten Felder
 * durch echte Angaben ersetzt werden. Empfohlene Generatoren:
 *  - https://www.e-recht24.de/impressum-generator.html
 *  - https://datenschutz-generator.de/ (Dr. Schwenke)
 *
 * Was benoetigt wird:
 *  - Vollstaendiger Name (natuerliche oder juristische Person)
 *  - Anschrift (Strasse, Hausnummer, PLZ, Ort)
 *  - Kontakt-E-Mail (Pflicht nach § 5 TMG)
 *  - Handelsregisternummer + Gericht (falls eingetragen)
 *  - Umsatzsteuer-ID oder Kleinunternehmerhinweis
 *  - Wirtschafts-ID (falls schon zugeteilt)
 *  - Name Verantwortlicher i.S.d. § 18 Abs. 2 MStV
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum",
  description:
    "Anbieterkennzeichnung und Pflichtangaben gemäß § 5 TMG für Klare Miete.",
  alternates: { canonical: "/impressum" },
  // noindex entfernt — Seite hat jetzt substanziellen Inhalt.
};

const CSS = {
  "--bg": "#F8F7F4",
  "--fg": "#1C1B19",
  "--dim": "#8C8A82",
  "--card": "#FFFFFF",
  "--line": "rgba(0,0,0,.07)",
  "--blue": "#2558D4",
  "--blue-bg": "rgba(37,88,212,.06)",
  "--mono": "var(--font-mono), monospace",
  minHeight: "100vh",
  background: "var(--bg)",
  color: "var(--fg)",
} as React.CSSProperties;

export default function ImpressumPage() {
  return (
    <div style={CSS}>
      {/* ── Header ── */}
      <header
        className="site-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--line)",
          background: "rgba(248,247,244,.85)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}
          aria-label="Zur Startseite"
        >
          <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} aria-hidden="true">
            <svg width="22" height="26" viewBox="0 0 22 26" fill="none" aria-hidden="true" focusable="false">
              <path d="M2 2h12l6 6v16a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" fill="white" stroke="#1B2B5E" strokeWidth="1.5"/>
              <path d="M14 2v7h6" fill="none" stroke="#1B2B5E" strokeWidth="1.5" strokeLinejoin="round"/>
              <line x1="6" y1="12" x2="15" y2="12" stroke="#1B2B5E" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="6" y1="16" x2="15" y2="16" stroke="#1B2B5E" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="15" cy="22" r="4" fill="#1B2B5E"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: -0.5 }}>Klare Miete</span>
        </Link>
        <Link
          href="/#upload"
          style={{ background: "var(--fg)", color: "var(--bg)", textDecoration: "none", padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, letterSpacing: -0.2 }}
        >
          Vertrag prüfen
        </Link>
      </header>

      <main id="main-content">
        <article style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px 80px" }}>
          {/* Breadcrumb */}
          <nav aria-label="Brotkrumen" style={{ fontSize: 12, color: "var(--dim)", marginBottom: 16 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Start</Link>
            <span aria-hidden="true"> › </span>
            <span aria-current="page">Impressum</span>
          </nav>

          <h1
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "clamp(32px,5vw,46px)",
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: -0.5,
              marginBottom: 8,
            }}
          >
            Impressum
          </h1>
          <p style={{ fontSize: 13, color: "var(--dim)", marginBottom: 40 }}>
            Pflichtangaben gemäß § 5 TMG
          </p>

          {/* ─── Platzhalter-Hinweis ─── */}

          <div className="legal-prose">

            {/* ── Anbieter ── */}
            <h2>Anbieter</h2>
            <p>
              Marvin Kalkschmid<br />
              Berliner Ring 57<br />
              72076 Tübingen<br />
              Deutschland
            </p>

            {/* ── Kontakt ── */}
            <h2>Kontakt</h2>
            <p>
              E-Mail: <a href="mailto:klaremiete@gmx.de">klaremiete@gmx.de</a>
            </p>

            {/* ── Umsatzsteuer ── */}
            <h2>Umsatzsteuer</h2>
            <p>
              Gemäß § 19 UStG wird keine Umsatzsteuer erhoben.
            </p>

            {/* ── Verantwortlicher für Inhalt ── */}
            <h2>Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)</h2>
            <p>
              Marvin Kalkschmid<br />
              Berliner Ring 57<br />
              72076 Tübingen
            </p>

            {/* ── Streitbeilegung ── */}
            <h2>Hinweis zur Online-Streitbeilegung (§ 36 VSBG)</h2>
            <p>
              Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor
              einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
              bereit:{" "}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
                ec.europa.eu/consumers/odr
              </a>
            </p>

            {/* ── Haftungsausschluss ── */}
            <h2>Haftungsausschluss</h2>

            <h3>Inhalt</h3>
            <p>
              Klare Miete bietet eine automatisierte Ersteinschätzung von Mietvertragsklauseln auf
              Basis öffentlicher Rechtsprechung. Diese Einschätzung ist eine unverbindliche
              Information und stellt{" "}
              <strong>keine Rechtsberatung im Sinne des Rechtsdienstleistungsgesetzes (RDG)</strong>{" "}
              dar. Sie ersetzt nicht die individuelle Beratung durch einen Rechtsanwalt oder
              Mieterverein.
            </p>
            <p>
              Für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten
              Informationen und Analysen wird keine Haftung übernommen. Bei rechtlich
              bedeutsamen Entscheidungen empfehlen wir stets die Rücksprache mit einem
              Fachanwalt für Mietrecht.
            </p>

            <h3>Externe Links</h3>
            <p>
              Diese Website enthält Links zu externen Webseiten Dritter. Auf deren Inhalte
              haben wir keinen Einfluss und übernehmen für diese keine Haftung. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.
              Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
              Rechtsverstöße überprüft; ohne konkrete Anhaltspunkte für Rechtsverstöße ist
              eine permanente inhaltliche Kontrolle nicht zumutbar.
            </p>

            <h3>Urheberrecht</h3>
            <p>
              Die auf dieser Website veröffentlichten Inhalte und Werke sind urheberrechtlich
              geschützt. Die zugrundeliegende Klausel-Datenbank basiert auf öffentlich
              zugänglicher Rechtsprechung des BGH und anderer Gerichte.
            </p>
          </div>
        </article>
      </main>

      <footer style={{ borderTop: "1px solid var(--line)", padding: "24px", textAlign: "center", fontSize: 12, color: "var(--dim)" }}>
        <nav className="footer-nav" aria-label="Rechtliche Hinweise">
          <Link href="/impressum" style={{ color: "inherit", textDecoration: "none" }}>Impressum</Link>
          <Link href="/datenschutz" style={{ color: "inherit", textDecoration: "none" }}>Datenschutz</Link>
          <Link href="/agb" style={{ color: "inherit", textDecoration: "none" }}>AGB</Link>
          <Link href="/kontakt" style={{ color: "inherit", textDecoration: "none" }}>Kontakt</Link>
        </nav>
        <p>© 2026 Klare Miete · Automatisierte Ersteinschätzung · Keine Rechtsberatung</p>
      </footer>
    </div>
  );
}
