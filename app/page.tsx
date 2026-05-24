/**
 * Landingpage — Server Component.
 *
 * Der gesamte ranking-relevante Content (Hero, Trust, How-it-Works,
 * Klausel-Uebersicht, Social Proof, Pricing, FAQ, CTA, Footer) rendert
 * server-seitig als HTML. Google sieht beim ersten HTTP-Request sofort
 * den vollstaendigen Inhalt — kein Warten auf Client-JS.
 *
 * Nur der interaktive Upload-/Analyse-Flow ist als Client-Insel
 * (UploadFlow) ausgelagert.
 *
 * KEYWORD-TODO: Texte hier (Headlines, Section-Titles, FAQ) sind
 * direktes Ranking-Material. Bitte gegen tatsaechliche Suchanfragen
 * der Zielgruppe abgleichen und ggf. anpassen.
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";
import UploadFlow from "./_components/upload-flow";
import {
  LANDING_CLAUSES,
  LANDING_CATEGORIES,
  LANDING_CAT_ICONS,
  HOW_IT_WORKS,
  TESTIMONIALS,
  FAQ_ITEMS,
} from "./_lib/landing-data";
import { JsonLd, faqPageJsonLd } from "./_lib/jsonld";

/**
 * KEYWORD-TODO: title und description sind die wichtigsten
 * Ranking-/CTR-Hebel der Landingpage. Die Werte hier sind ein erster
 * Vorschlag basierend auf dem Markenversprechen — bitte gegen tatsaechliche
 * Suchanfragen (Google Search Console, Sistrix, Ahrefs) abgleichen und
 * gegebenenfalls auf Conversion-optimierte Varianten aendern.
 *
 * Faustregeln:
 *  - title <= 60 Zeichen, primaeres Keyword ZUERST, Marke ans Ende
 *  - description 140-160 Zeichen, mit klarem Nutzenversprechen + CTA-Wort
 */
export const metadata: Metadata = {
  title: "Mietvertrag prüfen – unwirksame Klauseln finden | Klare Miete",
  description:
    "Lade deinen Mietvertrag hoch und finde in 30 Sekunden unwirksame Klauseln – auf Basis aktueller BGH-Rechtsprechung. Kostenlose Ersteinschätzung, keine Anmeldung.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Mietvertrag prüfen – unwirksame Klauseln finden",
    description:
      "90 % aller Mietverträge enthalten ungültige Regelungen. Lade deinen Vertrag hoch — in 30 Sekunden weißt du, welche.",
    url: "/",
    type: "website",
    // Next.js mergt openGraph nicht — Felder aus layout.tsx muessen
    // hier wiederholt werden, sonst fallen sie raus.
    locale: "de_DE",
    siteName: "Klare Miete",
  },
  twitter: {
    title: "Mietvertrag prüfen – unwirksame Klauseln finden",
    description:
      "90 % aller Mietverträge enthalten ungültige Regelungen. In 30 Sekunden weißt du, welche.",
  },
};

export default function Page() {
  const isPaid = cookies().get("mc_paid")?.value === "1";
  return (
    <div
      style={
        {
          "--bg": "#F8F7F4",
          "--fg": "#1C1B19",
          "--dim": "#8C8A82",
          "--card": "#FFFFFF",
          "--line": "rgba(0,0,0,.07)",
          "--blue": "#2558D4",
          "--blue-bg": "rgba(37,88,212,.06)",
          // --mono mappt auf next/font CSS-Variable (siehe app/layout.tsx)
          "--mono": "var(--font-mono), monospace",
          minHeight: "100vh",
          background: "var(--bg)",
          color: "var(--fg)",
          // Body-Font wird ueber globals.css gesetzt (--font-sans).
          // Hier keine font-family-Override -> erbt sauber von <html>.
          overflowX: "hidden",
        } as React.CSSProperties
      }
    >
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes scan { 0%,100% { transform:translateY(-100%) } 50% { transform:translateY(200%) } }
        @keyframes countUp { from { opacity:0; transform:scale(.8) } to { opacity:1; transform:scale(1) } }
        ::selection { background: #2558D433; }
        * { box-sizing:border-box; margin:0 }
      `}</style>

      {/* ─── NAV ─── */}
      <header className="site-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", background: "rgba(248,247,244,.85)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }} aria-label="Zur Startseite">
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
        </a>
        <a
          href="#upload"
          style={{ background: "var(--fg)", color: "var(--bg)", textDecoration: "none", padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, letterSpacing: -0.2 }}
        >
          Vertrag prüfen
        </a>
      </header>

      <main id="main-content">
        {/* ═══════ HERO ═══════ */}
        <section style={{ maxWidth: 660, margin: "0 auto", padding: "72px 24px 56px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 20, padding: "5px 14px 5px 8px", fontSize: 12, fontWeight: 500, color: "var(--dim)", marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} aria-hidden="true" />
            Über 2.400 Verträge geprüft
          </div>
          {/*
            KEYWORD-TODO: h1 ist der wichtigste On-Page-Faktor.
            Aktueller Wortlaut zielt auf das emotionale Aha-Trigger.
            Search-volumen-orientierte Alternative koennte sein:
            "Mietvertrag kostenlos prüfen lassen". Bitte Search Console
            Daten konsultieren bevor du das hier anpasst.
          */}
          <h1 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(36px,5.5vw,54px)", fontWeight: 400, lineHeight: 1.12, letterSpacing: -0.5, marginBottom: 20 }}>
            Dein Mietvertrag enthält
            <br />
            vermutlich <span style={{ fontStyle: "italic", color: "var(--blue)" }}>unwirksame Klauseln</span>
          </h1>
          <p style={{ fontSize: 17, color: "var(--dim)", lineHeight: 1.65, maxWidth: 480, margin: "0 auto 40px" }}>
            Der Deutsche Mieterbund schätzt: 90 % aller Mietverträge enthalten ungültige Regelungen. Lade deinen Vertrag hoch — in 30 Sekunden weißt du, welche.
          </p>

          {/* ───── UPLOAD (Client-Insel) ───── */}
          <UploadFlow isPaid={isPaid} />

          <div className="hero-trust-strip" style={{ color: "var(--dim)" }}>
            <span>🔒 Daten werden nicht gespeichert</span>
            <span>⚡ Ergebnis in 30 Sekunden</span>
            <span>✓ 3 Klauseln kostenlos</span>
          </div>
        </section>

        {/* ═══════ TRUST LOGOS ═══════ */}
        <section style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px 48px", textAlign: "center" }} aria-labelledby="trust-heading">
          {/*
            Bewusst <p> statt <h2>: Caption fuer die Trust-Logos,
            kein eigenes Hierarchie-Heading. aria-labelledby auf der
            <section> akzeptiert jedes Element mit id.
          */}
          <p id="trust-heading" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--dim)", marginBottom: 16, fontWeight: 500 }}>
            Analyse basiert auf
          </p>
          <ul style={{ display: "flex", justifyContent: "center", gap: 18, rowGap: 8, alignItems: "center", flexWrap: "wrap", opacity: 0.45, listStyle: "none", padding: 0, margin: 0 }}>
            {["Bundesgerichtshof", "Bürgerliches Gesetzbuch", "Deutscher Mieterbund", "Aktuelle Rechtsprechung 2025/26"].map((t) => (
              <li key={t} style={{ fontSize: 13, fontWeight: 600, letterSpacing: -0.2 }}>
                {t}
              </li>
            ))}
          </ul>
        </section>

        {/* ═══════ HOW IT WORKS ═══════ */}
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 64px" }} aria-labelledby="howitworks-heading">
          <h2 id="howitworks-heading" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 30, fontWeight: 400, textAlign: "center", marginBottom: 40 }}>
            So funktioniert&apos;s
          </h2>
          <div className="grid-cards grid-cards--3">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.n} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "28px 22px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--blue)", fontWeight: 600, marginBottom: 12 }}>{s.n}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{s.t}</h3>
                <p style={{ fontSize: 13, color: "var(--dim)", lineHeight: 1.55 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ ALL CLAUSES ═══════ */}
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 64px" }} aria-labelledby="clauses-heading">
          <h2 id="clauses-heading" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 30, fontWeight: 400, textAlign: "center", marginBottom: 8 }}>
            Was wir prüfen
          </h2>
          <p style={{ textAlign: "center", color: "var(--dim)", fontSize: 15, marginBottom: 36 }}>
            {LANDING_CLAUSES.length} Klauseln in {LANDING_CATEGORIES.length} Kategorien — basierend auf aktueller Rechtsprechung
          </p>
          {LANDING_CATEGORIES.map((cat) => (
            <div key={cat} style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }} aria-hidden="true">{LANDING_CAT_ICONS[cat]}</span>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>{cat}</h3>
                <span style={{ fontSize: 11, color: "var(--dim)", fontFamily: "var(--mono)" }}>
                  {LANDING_CLAUSES.filter((c) => c.cat === cat).length} Klauseln
                </span>
              </div>
              <div className="grid-clauses-pair">
                {LANDING_CLAUSES.filter((c) => c.cat === cat).map((c) => (
                  <div key={c.id} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.35 }}>{c.name}</span>
                    <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--blue)", flexShrink: 0, background: "var(--blue-bg)", padding: "2px 6px", borderRadius: 4 }}>
                      {c.law.length > 22 ? c.law.slice(0, 20) + "…" : c.law}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ═══════ SOCIAL PROOF ═══════ */}
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 64px" }} aria-labelledby="testimonials-heading">
          <h2 id="testimonials-heading" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 30, fontWeight: 400, textAlign: "center", marginBottom: 36 }}>
            Das sagen unsere Nutzer
          </h2>
          <div className="grid-cards grid-cards--3">
            {TESTIMONIALS.map((t, i) => (
              <figure key={i} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "22px 18px", margin: 0 }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 12 }} aria-label="5 von 5 Sternen">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="none" aria-hidden="true" focusable="false">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
                    </svg>
                  ))}
                </div>
                <blockquote style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, marginBottom: 14, color: "var(--fg)" }}>„{t.q}“</blockquote>
                <figcaption style={{ fontSize: 12, color: "var(--dim)" }}>
                  <span style={{ fontWeight: 600, color: "var(--fg)" }}>{t.n}</span> · {t.c}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ═══════ PRICING ═══════ */}
        <section style={{ maxWidth: 580, margin: "0 auto", padding: "0 24px 64px" }} aria-labelledby="pricing-heading">
          <h2 id="pricing-heading" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 30, fontWeight: 400, textAlign: "center", marginBottom: 36 }}>
            Einfache Preise
          </h2>
          <div className="grid-cards grid-cards--2">
            <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "28px 22px" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Kostenlos</p>
              <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1, marginBottom: 4 }}>0 €</p>
              <p style={{ fontSize: 13, color: "var(--dim)", marginBottom: 18 }}>Erste Einschätzung</p>
              <ul style={{ listStyle: "none", padding: 0, fontSize: 13, color: "var(--fg)", lineHeight: 2.2 }}>
                <li>✓ 3 Klauseln geprüft</li>
                <li>✓ Ampel-Bewertung</li>
                <li>✓ Kein Account nötig</li>
                <li style={{ color: "var(--dim)" }}>✗ Kein Vollreport</li>
              </ul>
            </div>
            <div style={{ background: "var(--fg)", color: "var(--bg)", borderRadius: 14, padding: "28px 22px", position: "relative" }}>
              <div style={{ position: "absolute", top: 14, right: 14, fontSize: 10, fontWeight: 600, background: "var(--blue)", color: "#fff", padding: "3px 10px", borderRadius: 6 }}>Beliebt</div>
              <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.6, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Vollreport</p>
              <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1, marginBottom: 4 }}>4,99 €</p>
              <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 18 }}>Einmalzahlung</p>
              <ul style={{ listStyle: "none", padding: 0, fontSize: 13, lineHeight: 2.2 }}>
                <li>✓ Alle {LANDING_CLAUSES.length} Klauseln geprüft</li>
                <li>✓ Detaillierte Erklärungen</li>
                <li>✓ BGH-Urteile + Rechtsgrundlage</li>
                <li>✓ Mietpreisbremse-Check</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ═══════ FAQ ═══════ */}
        <section style={{ maxWidth: 580, margin: "0 auto", padding: "0 24px 64px" }} aria-labelledby="faq-heading">
          {/*
            FAQPage-JSON-LD direkt neben dem sichtbaren FAQ-Content.
            Google-Forderung: strukturierte Daten muessen mit dem sichtbaren
            Content uebereinstimmen. Bei Diskrepanz droht manuelle Massnahme
            ("Spam: Misleading Structured Data").
          */}
          <JsonLd data={faqPageJsonLd(FAQ_ITEMS)} id="ld-faq" />
          <h2 id="faq-heading" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 30, fontWeight: 400, textAlign: "center", marginBottom: 32 }}>
            Häufige Fragen
          </h2>
          {FAQ_ITEMS.map((item, i) => (
            <details key={i} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, marginBottom: 8, overflow: "hidden" }}>
              <summary style={{ padding: "14px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {item.q} <span style={{ fontSize: 18, color: "var(--dim)" }} aria-hidden="true">+</span>
              </summary>
              <div style={{ padding: "0 18px 16px" }}>
                <p style={{ fontSize: 13.5, color: "var(--dim)", lineHeight: 1.65 }}>{item.a}</p>
              </div>
            </details>
          ))}
        </section>

        {/* ═══════ CTA ═══════ */}
        <section style={{ maxWidth: 660, margin: "0 auto", padding: "0 24px 48px", textAlign: "center" }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: "48px 32px" }}>
            <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 12 }}>
              Bereit, deinen Vertrag zu prüfen?
            </h2>
            <p style={{ color: "var(--dim)", fontSize: 15, marginBottom: 28 }}>Kostenlos starten — kein Account nötig.</p>
            <a
              href="#upload"
              style={{ display: "inline-block", background: "var(--fg)", color: "var(--bg)", textDecoration: "none", padding: "14px 36px", borderRadius: 10, fontSize: 15, fontWeight: 600, letterSpacing: -0.3 }}
            >
              Jetzt Mietvertrag prüfen →
            </a>
          </div>
        </section>
      </main>

      {/* ═══════ FOOTER ═══════ */}
      <footer style={{ borderTop: "1px solid var(--line)", padding: "24px", textAlign: "center", fontSize: 12, color: "var(--dim)" }}>
        <nav className="footer-nav" aria-label="Rechtliche Hinweise">
          <a href="/impressum" style={{ color: "inherit", textDecoration: "none" }}>Impressum</a>
          <a href="/datenschutz" style={{ color: "inherit", textDecoration: "none" }}>Datenschutz</a>
          <a href="/agb" style={{ color: "inherit", textDecoration: "none" }}>AGB</a>
          <a href="/kontakt" style={{ color: "inherit", textDecoration: "none" }}>Kontakt</a>
        </nav>
        <p>© 2026 Klare Miete · Automatisierte Ersteinschätzung · Keine Rechtsberatung</p>
      </footer>
    </div>
  );
}
