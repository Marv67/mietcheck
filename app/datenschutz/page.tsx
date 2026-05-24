/**
 * Datenschutzerklarung nach DSGVO Art. 13/14 + BDSG.
 *
 * Inhalt ist weitgehend ausgefuellt. Vor Live-Gang MUESSEN die mit
 * [PLATZHALTER] markierten Felder durch echte Angaben ersetzt werden:
 *  - Firmenname / Name des Betreibers
 *  - Adresse
 *  - Datenschutz-E-Mail
 *  - Zustaendige Aufsichtsbehoerde (abhaengig vom Sitz des Betreibers)
 *
 * Empfohlener Schritt: Generatoren wie datenschutz-generator.de (Dr. Schwenke)
 * als zweite Quelle nutzen und mit diesem Text abgleichen.
 *
 * DSGVO-relevante Verarbeitungen auf Klare Miete:
 *  - Mietvertragsanalyse via Anthropic-API (Drittlandtransfer USA)
 *  - Hosting via Vercel (Drittlandtransfer USA)
 *  - Server-Logs
 *  - Keine Tracking-Cookies, kein Analytics
 *  - Keine dauerhatte Speicherung von Vertragsinhalten
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Informationen zur Verarbeitung personenbezogener Daten auf Klare Miete gemäß DSGVO und BDSG.",
  alternates: { canonical: "/datenschutz" },
  // noindex entfernt — Seite hat jetzt substanziellen Inhalt.
  // robots: nicht gesetzt → erbt index:true aus layout.tsx.
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

export default function DatenschutzPage() {
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
          <div
            style={{ width: 30, height: 30, borderRadius: 7, background: "var(--blue)", display: "grid", placeItems: "center" }}
            aria-hidden="true"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d="M3 21V7l9-5 9 5v14" />
              <path d="M9 21V13h6v8" />
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
            <span aria-current="page">Datenschutz</span>
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
            Datenschutzerklärung
          </h1>
          <p style={{ fontSize: 13, color: "var(--dim)", marginBottom: 40 }}>
            Gemäß Art. 13, 14 DSGVO und § 13 TMG — Stand: Mai 2026
          </p>

          {/* ─── Platzhalter-Hinweis ─── */}
          <div
            className="legal-prose"
            style={{
              background: "#FEF3C7",
              border: "1px solid #FDE68A",
              borderRadius: 10,
              padding: "14px 18px",
              marginBottom: 32,
              fontSize: 13,
              color: "#78350F",
            }}
          >
            <strong style={{ color: "#92400E" }}>⚠️ Noch ausstehend:</strong>{" "}
            <mark>E-Mail-Adresse</mark> für Datenschutzanfragen vor dem Live-Gang eintragen.
          </div>

          <div className="legal-prose">

            {/* ── 1. Verantwortlicher ── */}
            <h2>1. Verantwortlicher</h2>
            <p>
              Verantwortlicher für die Verarbeitung personenbezogener Daten auf dieser Website im
              Sinne der DSGVO (Art. 4 Nr. 7) ist:
            </p>
            <p>
              Marvin Kalkschmid<br />
              Berliner Ring 57<br />
              72076 Tübingen<br />
              Deutschland
            </p>
            <p>
              E-Mail: <a href="mailto:[DATENSCHUTZ@EXAMPLE.COM]"><mark>[DATENSCHUTZ@EXAMPLE.COM]</mark></a>
            </p>

            {/* ── 2. Verarbeitungsübersicht ── */}
            <h2>2. Welche Daten wir verarbeiten und warum</h2>

            <h3>2.1 Mietvertragsanalyse</h3>
            <p>
              Wenn Sie ein PDF-Dokument hochladen, verarbeiten wir:
            </p>
            <ul>
              <li>
                <strong>Dateiinhalt (Mietvertragstext):</strong> Der aus Ihrer Datei extrahierte
                Text wird ausschließlich für die KI-gestützte Klauselanalyse verwendet. Der Text
                wird <strong>unmittelbar nach Abschluss der Analyse aus dem Arbeitsspeicher
                gelöscht</strong> und nicht dauerhaft gespeichert.
              </li>
              <li>
                <strong>Personenbezogene Daten im Vertragstext:</strong> Ihr Mietvertrag kann
                personenbezogene Daten enthalten (Namen und Anschriften der Vertragsparteien,
                Mietobjektadresse). Diese werden als Teil des Vertragstexts analysiert, aber nicht
                extrahiert, gesondert gespeichert oder anderweitig genutzt.
              </li>
            </ul>
            <p>
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO — die Verarbeitung ist
              erforderlich, um den von Ihnen ausdrücklich angeforderten Analyse-Dienst
              durchzuführen (Erfüllung eines Vertrags bzw. vorvertragliche Maßnahmen).
            </p>
            <p>
              <strong>Speicherdauer:</strong> Keine dauerhafte Speicherung. Der Vertragstext
              existiert ausschließlich im Arbeitsspeicher für die Dauer der Verarbeitung
              (typisch &lt; 60 Sekunden) und wird danach nicht gespeichert.
            </p>

            <h3>2.2 Server-Logs</h3>
            <p>
              Beim Aufruf unserer Website werden technische Zugriffsdaten automatisch erfasst:
            </p>
            <ul>
              <li>IP-Adresse (von Vercel ggf. anonymisiert verarbeitet)</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>Aufgerufene URL und HTTP-Methode</li>
              <li>HTTP-Statuscode und übertragene Datenmenge</li>
              <li>Browser-Typ und -Version (User-Agent)</li>
            </ul>
            <p>
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
              Interesse) — Server-Logs sind zur Sicherstellung des Betriebs, Fehlerdiagnose und
              Abwehr von Missbrauch technisch notwendig.
            </p>
            <p>
              <strong>Speicherdauer:</strong> Gemäß der Datenschutzrichtlinie unseres
              Hosting-Anbieters Vercel (i. d. R. max. 30 Tage).
            </p>

            {/* ── 3. Anthropic ── */}
            <h2>3. Einsatz von KI-Diensten (Anthropic)</h2>
            <p>
              Für die inhaltliche Analyse Ihres Mietvertrags nutzen wir die API von:
            </p>
            <p>
              <strong>Anthropic, PBC</strong><br />
              548 Market Street, PMB 90375<br />
              San Francisco, CA 94104, USA<br />
              Datenschutz: <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer">anthropic.com/privacy</a>
            </p>
            <p>
              Der extrahierte Vertragstext wird zur Analyse an Anthropics API übermittelt.
              Anthropic verarbeitet diesen Text ausschließlich zur Erbringung der Dienst-Leistung.
            </p>
            <div className="notice-box">
              <strong>Zero Data Retention:</strong> Anthropic verwendet die über die API
              übermittelten Inhalte <strong>nicht</strong> zum Training von KI-Modellen. Es
              besteht keine dauerhafte Speicherung der Anfrageinhalte auf Anthropics Servern
              nach Abschluss der Verarbeitung (Anthropic Zero Retention Policy für API-Nutzer).
            </div>
            <p>
              Es besteht ein Auftragsverarbeitungsvertrag (AVV) mit Anthropic gemäß Art. 28 DSGVO.
            </p>
            <p>
              <strong>Drittlandtransfer (USA):</strong> Die Übermittlung an Anthropic erfolgt auf
              Basis von EU-Standardvertragsklauseln (SCC) gemäß Art. 46 Abs. 2 lit. c DSGVO.
              Sofern Anthropic dem EU-US Data Privacy Framework beigetreten ist, stützt sich die
              Übermittlung zusätzlich auf den Angemessenheitsbeschluss der EU-Kommission gemäß
              Art. 45 DSGVO.
            </p>

            {/* ── 4. Vercel Hosting ── */}
            <h2>4. Hosting (Vercel)</h2>
            <p>
              Diese Website wird gehostet von:
            </p>
            <p>
              <strong>Vercel Inc.</strong><br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789, USA<br />
              Datenschutz: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a>
            </p>
            <p>
              Bei jedem Seitenaufruf und jeder API-Anfrage werden technische Metadaten (u. a.
              IP-Adresse, Zeitstempel) durch Vercel erfasst. Es besteht ein AVV mit Vercel gemäß
              Art. 28 DSGVO. Die Übermittlung erfolgt auf Basis von EU-Standardvertragsklauseln
              (SCC) gemäß Art. 46 Abs. 2 lit. c DSGVO.
            </p>

            {/* ── 5. Cookies ── */}
            <h2>5. Cookies und Tracking</h2>
            <div className="notice-box">
              Wir verwenden <strong>keine Tracking-Cookies</strong>, kein Web-Analytics
              (Google Analytics, Matomo etc.) und keine Retargeting- oder Social-Media-Pixel.
              Es ist <strong>kein Cookie-Einverständnis</strong> erforderlich.
            </div>
            <p>
              Die einzige Speicheroperation im Browser ist der React-Anwendungszustand (z. B. das
              Analyse-Ergebnis) im Arbeitsspeicher der aktuellen Sitzung — kein persistentes
              Cookie, keine Übertragung an Dritte.
            </p>

            {/* ── 6. Schriftarten ── */}
            <h2>6. Schriftarten</h2>
            <p>
              Wir binden Schriftarten (Fonts) selbst-gehostet über Next.js ein. Es werden{" "}
              <strong>keine Anfragen</strong> an Google Fonts oder andere externe Font-Server
              gestellt. Kein Datentransfer an Dritte beim Laden der Schriftarten.
            </p>

            {/* ── 7. Betroffenenrechte ── */}
            <h2>7. Ihre Rechte als betroffene Person</h2>
            <p>Nach der DSGVO stehen Ihnen folgende Rechte zu:</p>
            <table>
              <thead>
                <tr>
                  <th>Recht</th>
                  <th>Erläuterung</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Auskunft</strong> (Art. 15)</td>
                  <td>Sie können Auskunft über die von uns verarbeiteten Daten verlangen.</td>
                </tr>
                <tr>
                  <td><strong>Berichtigung</strong> (Art. 16)</td>
                  <td>Unrichtige Daten können Sie korrigieren lassen.</td>
                </tr>
                <tr>
                  <td><strong>Löschung</strong> (Art. 17)</td>
                  <td>Sie können die Löschung Ihrer Daten verlangen.</td>
                </tr>
                <tr>
                  <td><strong>Einschränkung</strong> (Art. 18)</td>
                  <td>Sie können die Einschränkung der Verarbeitung verlangen.</td>
                </tr>
                <tr>
                  <td><strong>Datenübertragbarkeit</strong> (Art. 20)</td>
                  <td>Sie können Ihre Daten in maschinenlesbarem Format erhalten.</td>
                </tr>
                <tr>
                  <td><strong>Widerspruch</strong> (Art. 21)</td>
                  <td>
                    Sie können der Verarbeitung auf Basis berechtigten Interesses
                    (Art. 6 Abs. 1 lit. f) widersprechen.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              <strong>Hinweis:</strong> Da wir Ihren Vertragstext nach der Analyse sofort löschen
              und keine Nutzerkonten führen, ist eine nachträgliche Auskunft oder Löschung
              technisch nicht möglich — weil keine personenbezogenen Daten dauerhaft gespeichert
              werden.
            </p>
            <p>
              Anfragen zu Betroffenenrechten richten Sie bitte an:{" "}
              <a href="mailto:[DATENSCHUTZ@EXAMPLE.COM]"><mark>[DATENSCHUTZ@EXAMPLE.COM]</mark></a>
            </p>

            {/* ── 8. Beschwerderecht ── */}
            <h2>8. Beschwerderecht bei der Aufsichtsbehörde</h2>
            <p>
              Sie haben das Recht, sich bei der zuständigen Datenschutz-Aufsichtsbehörde
              zu beschweren (Art. 77 DSGVO). Die für unseren Sitz (Baden-Württemberg)
              zuständige Behörde ist:
            </p>
            <p>
              <strong>Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit
              Baden-Württemberg</strong><br />
              Lautenschlagerstraße 20<br />
              70173 Stuttgart<br />
              <a href="https://www.baden-wuerttemberg.datenschutz.de/" target="_blank" rel="noopener noreferrer">
                www.baden-wuerttemberg.datenschutz.de
              </a>
            </p>

            {/* ── 9. Profiling ── */}
            <h2>9. Automatisierte Entscheidungsfindung und Profiling</h2>
            <p>
              Wir treffen <strong>keine automatisierten Einzelentscheidungen</strong> im Sinne
              von Art. 22 DSGVO, die rechtliche Wirkung entfalten oder Sie in ähnlicher Weise
              beeinträchtigen. Die Klausel-Analyse ist eine unverbindliche, informationale
              Ersteinschätzung — keine Rechtsberatung im Sinne des RDG, keine Entscheidung mit
              Rechtswirkung.
            </p>
            <p>
              Ein Nutzer-Profil wird zu keinem Zeitpunkt erstellt.
            </p>

            {/* ── 10. Änderungen ── */}
            <h2>10. Änderungen dieser Erklärung</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung bei Änderungen unserer Dienste
              oder der rechtlichen Anforderungen anzupassen. Die jeweils aktuelle Fassung ist
              stets unter <Link href="/datenschutz" style={{ color: "var(--blue)" }}>mietcheck.de/datenschutz</Link> abrufbar.
            </p>
            <p>
              <em>Stand: Mai 2026</em>
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
