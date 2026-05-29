import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen",
  description:
    "AGB für die Nutzung des Klare-Miete-Dienstes — automatisierte Mietvertragsanalyse.",
  alternates: { canonical: "/agb" },
};

const CSS = {
  "--bg": "#F8F7F4",
  "--fg": "#1A1815",
  "--dim": "#76746C",
  "--card": "#FFFFFF",
  "--line": "rgba(0,0,0,.07)",
  "--blue": "#1B2B5E",
  "--blue-bg": "rgba(27,43,94,.06)",
  "--mono": "var(--font-mono), monospace",
  minHeight: "100vh",
  background: "var(--bg)",
  color: "var(--fg)",
} as React.CSSProperties;

export default function AgbPage() {
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
            <span aria-current="page">AGB</span>
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
            Allgemeine Geschäftsbedingungen
          </h1>
          <p style={{ fontSize: 13, color: "var(--dim)", marginBottom: 40 }}>
            Stand: Mai 2026
          </p>

          <div className="legal-prose">

            {/* § 1 */}
            <h2>§ 1 Geltungsbereich</h2>
            <p>
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Nutzungsverträge zwischen
            </p>
            <p>
              Marvin Kalkschmid<br />
              Karl-Theodor-Straße 19<br />
              72076 Tübingen<br />
              E-Mail: <a href="mailto:klaremiete@gmx.de">klaremiete@gmx.de</a>
            </p>
            <p>
              (nachfolgend <strong>„Anbieter"</strong>) und den Nutzerinnen und Nutzern des
              Dienstes Klare Miete unter <Link href="/" style={{ color: "var(--blue)" }}>mietcheck-three.vercel.app</Link>{" "}
              (nachfolgend <strong>„Nutzer"</strong>).
            </p>
            <p>
              Entgegenstehende oder abweichende Bedingungen des Nutzers werden nicht anerkannt,
              es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.
            </p>

            {/* § 2 */}
            <h2>§ 2 Leistungsbeschreibung</h2>
            <p>
              Klare Miete ist ein Online-Dienst zur automatisierten Ersteinschätzung von
              Mietvertragsklauseln auf Basis öffentlich zugänglicher Rechtsprechung und
              gesetzlicher Vorschriften.
            </p>
            <p>Der Dienst umfasst folgende Leistungen:</p>
            <ul>
              <li>
                <strong>Kostenlose Basisprüfung:</strong> Nach dem Hochladen eines Mietvertrags
                als PDF oder der manuellen Texteingabe werden erkannte Klauseln identifiziert
                und mit einer Statusampel (wirksam / unwirksam / Prüfung empfohlen) versehen.
                Klausel-Titel und Kurzzitat sind kostenlos einsehbar.
              </li>
              <li>
                <strong>Kostenpflichtiger Vollreport (2,99 €):</strong> Nach einmaliger Zahlung
                werden für alle erkannten Klauseln vollständige Erläuterungen, Rechtsgrundlagen,
                einschlägige BGH-Urteile und konkrete Handlungsempfehlungen freigeschaltet.
              </li>
            </ul>
            <p>
              Der Dienst stellt ausschließlich eine <strong>unverbindliche, automatisierte
              Ersteinschätzung</strong> bereit. Er ersetzt keine individuelle Rechtsberatung
              durch einen zugelassenen Rechtsanwalt oder Mieterverein. Näheres regelt § 6.
            </p>

            {/* § 3 */}
            <h2>§ 3 Vertragsschluss</h2>
            <p>
              Die Nutzung der kostenlosen Basisprüfung setzt keine Registrierung voraus und
              begründet keinen entgeltlichen Vertrag.
            </p>
            <p>
              Der kostenpflichtige Vertrag über den Vollreport kommt wie folgt zustande:
            </p>
            <ol>
              <li>
                Der Nutzer klickt auf die Schaltfläche <em>„Jetzt freischalten — 2,99 €"</em>.
              </li>
              <li>
                Der Nutzer wird zur Zahlungsseite des Zahlungsdienstleisters Stripe weitergeleitet
                und gibt dort seine Zahlungsdaten ein.
              </li>
              <li>
                Mit dem Abschluss des Zahlungsvorgangs gibt der Nutzer ein verbindliches Angebot
                zum Abschluss des Vertrags ab.
              </li>
              <li>
                Der Vertrag kommt mit der Bestätigung der Zahlung durch Stripe und der
                anschließenden Freischaltung des Vollreports zustande.
              </li>
            </ol>

            {/* § 4 */}
            <h2>§ 4 Preise und Zahlung</h2>
            <p>
              Der Preis für den Vollreport beträgt <strong>2,99 €</strong>.
            </p>
            <p>
              Der Anbieter ist Kleinunternehmer im Sinne des § 19 UStG. Es wird daher
              <strong> keine Umsatzsteuer</strong> ausgewiesen.
            </p>
            <p>
              Die Zahlung erfolgt über den Zahlungsdienstleister{" "}
              <strong>Stripe Payments Europe, Ltd.</strong> (1 Grand Canal Street Lower,
              Grand Canal Dock, Dublin, D02 H210, Irland). Akzeptiert werden Kredit- und
              Debitkarten sowie weitere von Stripe angebotene Zahlungsmethoden. Die
              Zahlungsdaten werden ausschließlich von Stripe verarbeitet; der Anbieter
              erhält keinen Zugriff auf vollständige Kartendaten.
            </p>
            <p>
              Der Betrag wird unmittelbar nach Abschluss des Zahlungsvorgangs fällig und
              eingezogen. Eine Rechnung wird auf Anfrage per E-Mail zugesandt.
            </p>

            {/* § 5 */}
            <h2>§ 5 Widerrufsrecht und Widerrufsbelehrung</h2>

            <h3>Widerrufsrecht</h3>
            <p>
              Sie haben das Recht, binnen <strong>vierzehn Tagen</strong> ohne Angabe von
              Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage
              ab dem Tag des Vertragsabschlusses.
            </p>
            <p>
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
            </p>
            <p>
              Marvin Kalkschmid<br />
              Karl-Theodor-Straße 19<br />
              72076 Tübingen<br />
              E-Mail: <a href="mailto:klaremiete@gmx.de">klaremiete@gmx.de</a>
            </p>
            <p>
              mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief
              oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen,
              informieren. Sie können dafür das beigefügte Muster-Widerrufsformular
              verwenden, das jedoch nicht vorgeschrieben ist.
            </p>
            <p>
              Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über
              die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
            </p>

            <h3>Folgen des Widerrufs</h3>
            <p>
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir
              von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen
              ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf bei uns
              eingegangen ist. Für die Rückzahlung verwenden wir dasselbe Zahlungsmittel,
              das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn,
              mit Ihnen wurde ausdrücklich etwas anderes vereinbart.
            </p>

            <h3>Vorzeitiges Erlöschen des Widerrufsrechts</h3>
            <p>
              Das Widerrufsrecht erlischt bei einem Vertrag zur Lieferung von nicht auf
              einem körperlichen Datenträger befindlichen digitalen Inhalten gemäß
              § 356 Abs. 5 BGB <strong>nur dann</strong>, wenn der Anbieter mit der
              Ausführung des Vertrags begonnen hat, nachdem Sie
            </p>
            <ol>
              <li>
                ausdrücklich zugestimmt haben, dass der Anbieter mit der Ausführung des
                Vertrags vor Ablauf der Widerrufsfrist beginnt, und
              </li>
              <li>
                Ihre Kenntnis davon bestätigt haben, dass Sie durch Ihre Zustimmung mit
                Beginn der Ausführung des Vertrags Ihr Widerrufsrecht verlieren.
              </li>
            </ol>
            <p>
              Liegen diese Voraussetzungen nicht vor, bleibt das 14-tägige Widerrufsrecht
              bestehen. Anfragen auf Widerruf und Rückerstattung richten Sie bitte an:{" "}
              <a href="mailto:klaremiete@gmx.de">klaremiete@gmx.de</a>. Die Erstattung
              erfolgt in der Regel innerhalb von 5 Werktagen über Stripe.
            </p>

            <h3>Muster-Widerrufsformular</h3>
            <p>
              (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses
              Formular aus und senden Sie es zurück.)
            </p>
            <div style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 8, padding: "16px 20px", fontSize: 13, lineHeight: 1.7 }}>
              An Marvin Kalkschmid, Karl-Theodor-Straße 19, 72076 Tübingen,
              E-Mail: klaremiete@gmx.de<br /><br />
              Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag
              über die Erbringung der folgenden Dienstleistung (*):<br /><br />
              ____________________________________________<br /><br />
              Bestellt am (*): __________________<br />
              Name des/der Verbraucher(s): __________________<br />
              Anschrift des/der Verbraucher(s): __________________<br />
              Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):
              __________________<br />
              Datum: __________________<br /><br />
              (*) Unzutreffendes streichen.
            </div>

            {/* § 6 */}
            <h2>§ 6 Kein Rechtsberatungsverhältnis</h2>
            <p>
              Die von Klare Miete bereitgestellten Analysen und Einschätzungen stellen
              ausdrücklich <strong>keine Rechtsberatung im Sinne des
              Rechtsdienstleistungsgesetzes (RDG)</strong> dar. Der Dienst bietet
              ausschließlich eine automatisierte, informatorische Ersteinschätzung auf
              Grundlage öffentlich zugänglicher Gerichtsurteile und gesetzlicher Vorschriften.
            </p>
            <p>
              Die Ergebnisse sind nicht rechtsverbindlich. Für rechtlich relevante
              Entscheidungen — insbesondere die Geltendmachung von Ansprüchen gegenüber
              Vermietern oder die Beurteilung individueller Vertragssituationen — empfiehlt
              der Anbieter ausdrücklich die Beratung durch einen zugelassenen Rechtsanwalt
              oder einen anerkannten Mieterverein.
            </p>

            {/* § 7 */}
            <h2>§ 7 Haftungsbeschränkung</h2>
            <p>
              Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens,
              des Körpers oder der Gesundheit sowie für vorsätzlich oder grob fahrlässig
              verursachte Schäden.
            </p>
            <p>
              Im Übrigen ist die Haftung des Anbieters — insbesondere für Schäden, die
              daraus entstehen, dass der Nutzer sich auf die Analyse verlässt und auf eine
              individuelle rechtliche Prüfung verzichtet — auf Vorsatz und grobe
              Fahrlässigkeit beschränkt. Eine Haftung für einfache Fahrlässigkeit ist
              ausgeschlossen, soweit keine wesentlichen Vertragspflichten (Kardinalpflichten)
              verletzt werden.
            </p>
            <p>
              Die Analyse erfolgt KI-gestützt. Fehler, Unvollständigkeiten oder veraltete
              Rechtsprechungsbezüge können nicht vollständig ausgeschlossen werden. Der
              Anbieter übernimmt keine Gewähr für die Vollständigkeit, Richtigkeit oder
              Aktualität der Analyseergebnisse.
            </p>

            {/* § 8 */}
            <h2>§ 8 Verfügbarkeit</h2>
            <p>
              Der Anbieter ist bemüht, den Dienst durchgehend verfügbar zu halten, übernimmt
              jedoch keine Garantie für eine ununterbrochene Verfügbarkeit. Wartungsarbeiten
              und technische Störungen können zu vorübergehenden Einschränkungen führen.
            </p>
            <p>
              Wird der kostenpflichtige Vollreport aufgrund eines technischen Fehlers auf
              Anbieterseite nicht freigeschaltet, erstattet der Anbieter den Kaufpreis auf
              Anfrage vollständig.
            </p>

            {/* § 9 */}
            <h2>§ 9 Datenschutz</h2>
            <p>
              Informationen zur Verarbeitung personenbezogener Daten finden sich in der{" "}
              <Link href="/datenschutz" style={{ color: "var(--blue)" }}>Datenschutzerklärung</Link>.
            </p>

            {/* § 10 */}
            <h2>§ 10 Online-Streitbeilegung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung
              (OS) bereit:{" "}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
                ec.europa.eu/consumers/odr
              </a>
            </p>
            <p>
              Der Anbieter ist nicht bereit und nicht verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen (§ 36 VSBG).
            </p>

            {/* § 11 */}
            <h2>§ 11 Änderungen der AGB</h2>
            <p>
              Der Anbieter behält sich vor, diese AGB mit Wirkung für die Zukunft zu ändern.
              Über wesentliche Änderungen werden Nutzer, soweit möglich, informiert. Die
              jeweils aktuelle Fassung ist stets unter{" "}
              <Link href="/agb" style={{ color: "var(--blue)" }}>mietcheck-three.vercel.app/agb</Link>{" "}
              abrufbar.
            </p>

            {/* § 12 */}
            <h2>§ 12 Schlussbestimmungen</h2>
            <p>
              Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
              UN-Kaufrechts (CISG).
            </p>
            <p>
              Gerichtsstand für alle Streitigkeiten aus oder im Zusammenhang mit diesen AGB
              ist — soweit gesetzlich zulässig — Tübingen.
            </p>
            <p>
              Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam oder
              undurchführbar sein oder werden, berührt dies die Wirksamkeit der übrigen
              Bestimmungen nicht (Salvatorische Klausel). An die Stelle der unwirksamen
              Bestimmung tritt die gesetzliche Regelung.
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
