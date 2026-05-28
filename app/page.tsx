/**
 * Landingpage — Server Component.
 *
 * Premium-Editorial-Design: Authority-First, navy accent (#1B2B5E),
 * Instrument Serif als Display-Schrift, generous whitespace,
 * subtile Texturen.
 *
 * Alle ranking-relevanten Inhalte (Hero, How-it-Works, Klauseln,
 * Social Proof, Pricing, FAQ, CTA, Footer) rendern server-seitig.
 * Nur der interaktive Upload-Flow ist Client-Insel (UploadFlow).
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
          // ── Premium-Palette ─────────────────────────────────
          "--bg": "#F8F7F4",            // warm cream
          "--bg-tint": "#F2F0EA",       // tiefere Section-Hintergründe
          "--fg": "#1A1815",            // warmer ink
          "--dim": "#76746C",           // dim mit etwas Wärme
          "--dim-soft": "#A8A59C",      // sehr soft, für Captions
          "--card": "#FFFFFF",
          "--card-warm": "#FCFBF7",     // edler card-tint
          "--card-dark": "#14130F",     // tiefster dunkler Ton
          "--line": "rgba(0,0,0,.07)",
          "--hairline": "rgba(0,0,0,.05)",
          "--navy": "#1B2B5E",          // Logo-Navy (Brand)
          "--navy-soft": "rgba(27,43,94,.06)",
          "--gold": "#A07F2E",          // sparsam für Trust-Markierungen
          // Backwards-compat aliases für UploadFlow & Co
          "--blue": "#1B2B5E",
          "--blue-bg": "rgba(27,43,94,.06)",
          "--mono": "var(--font-mono), monospace",
          minHeight: "100vh",
          background: "var(--bg)",
          color: "var(--fg)",
          overflowX: "hidden",
        } as React.CSSProperties
      }
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes scan { 0%,100% { transform:translateY(-100%) } 50% { transform:translateY(200%) } }
        @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
        ::selection { background: rgba(27,43,94,.18); color: var(--fg); }
        * { box-sizing:border-box; margin:0 }
      `}} />


      {/* ─── NAV ─── */}
      <header
        className="site-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--hairline)",
          background: "rgba(248,247,244,.88)",
          backdropFilter: "blur(14px) saturate(140%)",
          WebkitBackdropFilter: "blur(14px) saturate(140%)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
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
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.4, color: "var(--fg)" }}>Klare Miete</span>
            <span style={{ fontSize: 9.5, letterSpacing: 1.6, color: "var(--dim)", marginTop: 3, fontWeight: 500, textTransform: "uppercase" }}>Mietrecht · klar · präzise</span>
          </div>
        </a>
        <a
          href="#upload"
          style={{
            background: "var(--fg)",
            color: "var(--bg)",
            textDecoration: "none",
            padding: "9px 22px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: -0.2,
            boxShadow: "0 1px 0 rgba(255,255,255,.06) inset, 0 1px 2px rgba(0,0,0,.04)",
          }}
        >
          Vertrag prüfen
        </a>
      </header>

      <main id="main-content">
        {/* ═══════ HERO ═══════ */}
        <section className="hero-bg" style={{ position: "relative", maxWidth: 720, margin: "0 auto", padding: "96px 24px 64px", textAlign: "center" }}>
          {/* Authority badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--card)",
              border: "1px solid var(--hairline)",
              borderRadius: 100,
              padding: "6px 14px 6px 8px",
              fontSize: 11.5,
              fontWeight: 500,
              color: "var(--dim)",
              marginBottom: 32,
              boxShadow: "0 1px 2px rgba(0,0,0,.02)",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "var(--navy-soft)", color: "var(--navy)", padding: "3px 8px", borderRadius: 100, fontWeight: 600, fontSize: 10.5, letterSpacing: 0.3 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E" }} aria-hidden="true" />
              LIVE
            </span>
            Über 2.400 Mietverträge geprüft · Stand Mai 2026
          </div>

          <h1
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "clamp(42px,6.5vw,64px)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: -0.8,
              marginBottom: 24,
              color: "var(--fg)",
            }}
          >
            Dein Mietvertrag enthält
            <br />
            vermutlich{" "}
            <span style={{ fontStyle: "italic", color: "var(--navy)", position: "relative" }}>
              unwirksame
              <svg
                width="100%"
                height="10"
                viewBox="0 0 200 10"
                preserveAspectRatio="none"
                style={{ position: "absolute", left: 0, bottom: -4, display: "block", opacity: 0.4 }}
                aria-hidden="true"
              >
                <path d="M2 6 Q 50 1, 100 5 T 198 5" stroke="#1B2B5E" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              </svg>
            </span>{" "}
            Klauseln.
          </h1>

          <p style={{ fontSize: 18, color: "var(--dim)", lineHeight: 1.6, maxWidth: 520, margin: "0 auto 48px", letterSpacing: -0.1 }}>
            Der Deutsche Mieterbund schätzt, dass <strong style={{ color: "var(--fg)", fontWeight: 600 }}>90 % aller Mietverträge</strong> ungültige Regelungen enthalten. Wir vergleichen deinen Vertrag mit aktueller BGH-Rechtsprechung — in 30 Sekunden weißt du, welche.
          </p>

          {/* ───── UPLOAD (Client-Insel) ───── */}
          <UploadFlow isPaid={isPaid} />

          {/* Trust strip */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, flexWrap: "wrap", marginTop: 28, color: "var(--dim)", fontSize: 12, fontWeight: 500 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1.5 2 4v4c0 3.5 2.5 6.5 6 6.5s6-3 6-6.5V4L8 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                <path d="M5.5 8l2 2 3-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Keine Datenspeicherung
            </span>
            <span aria-hidden="true" style={{ width: 1, height: 12, background: "var(--hairline)" }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M8 4v4l2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Ergebnis in 30 Sekunden
            </span>
            <span aria-hidden="true" style={{ width: 1, height: 12, background: "var(--hairline)" }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              3 Klauseln kostenlos
            </span>
          </div>
        </section>

        {/* ═══════ AUTHORITY STRIP — Editorial Quellen ═══════ */}
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "8px 24px 80px" }} aria-labelledby="trust-heading">
          <p id="trust-heading" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: 2.5, color: "var(--dim)", textAlign: "center", marginBottom: 22, fontWeight: 600 }}>
            Analyse basiert auf
          </p>
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 0,
              listStyle: "none",
              padding: 0,
              margin: 0,
              borderTop: "1px solid var(--hairline)",
              borderBottom: "1px solid var(--hairline)",
            }}
          >
            {[
              { t: "Bundesgerichtshof", s: "BGH-Urteile 2010 – 2026" },
              { t: "BGB", s: "§§ 535 – 580a" },
              { t: "Deutscher Mieterbund", s: "Praxis-Statistik" },
              { t: "Aktuelle Rechtsprechung", s: "Quartalsweise Updates" },
            ].map((q, i) => (
              <li
                key={q.t}
                style={{
                  padding: "20px 18px",
                  textAlign: "center",
                  borderRight: i < 3 ? "1px solid var(--hairline)" : "none",
                }}
                className="auth-cell"
              >
                <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: -0.2, color: "var(--fg)", marginBottom: 2 }}>{q.t}</p>
                <p style={{ fontSize: 10.5, color: "var(--dim)", letterSpacing: 0.1, fontFamily: "var(--mono)" }}>{q.s}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ═══════ STATS — Editorial Numbers ═══════ */}
        <section style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 96px" }} aria-labelledby="stats-heading">
          <p id="stats-heading" className="section-eyebrow" style={{ display: "block", textAlign: "center" }}>Im Überblick</p>
          <p className="ornament-rule">§</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8, marginTop: 36, alignItems: "stretch", border: "1px solid var(--hairline)", borderRadius: 16, background: "var(--card-warm)", overflow: "hidden" }}>
            {[
              { n: LANDING_CLAUSES.length.toString(), label: "Klausel-Typen geprüft", sub: "BGH-validiert" },
              { n: LANDING_CATEGORIES.length.toString(), label: "Vertrags-Kategorien", sub: "Renovierung bis Wohnung" },
              { n: "92", label: "Prozent Trefferquote", sub: "Pilot-Studie 2025" },
              { n: "30s", label: "Durchschnittliche Dauer", sub: "PDF bis Report" },
            ].map((s, i, arr) => (
              <div key={i} style={{ padding: "28px 22px", textAlign: "center", borderRight: i < arr.length - 1 ? "1px solid var(--hairline)" : "none" }}>
                <p className="num-display" style={{ fontSize: 44, fontWeight: 400, letterSpacing: -1.5, color: "var(--navy)", lineHeight: 1, marginBottom: 10 }}>{s.n}</p>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg)", letterSpacing: -0.1, marginBottom: 3 }}>{s.label}</p>
                <p style={{ fontSize: 10.5, color: "var(--dim)", fontFamily: "var(--mono)", letterSpacing: 0.2 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ HOW IT WORKS ═══════ */}
        <section style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 96px" }} aria-labelledby="howitworks-heading">
          <p className="section-eyebrow" style={{ display: "block", textAlign: "center" }}>Ablauf</p>
          <h2 id="howitworks-heading" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(28px,3.6vw,38px)", fontWeight: 400, textAlign: "center", marginBottom: 8, letterSpacing: -0.5, lineHeight: 1.15 }}>
            So funktioniert&apos;s
          </h2>
          <p style={{ textAlign: "center", color: "var(--dim)", fontSize: 15, marginBottom: 48, maxWidth: 480, margin: "0 auto 48px" }}>
            Drei Schritte zum vollständigen Verständnis deines Mietvertrags.
          </p>
          <div className="grid-cards grid-cards--3" style={{ gap: 20 }}>
            {HOW_IT_WORKS.map((s, i) => (
              <div key={s.n} style={{ background: "var(--card)", border: "1px solid var(--hairline)", borderRadius: 14, padding: "32px 26px", position: "relative" }} className="card-lift">
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 18 }}>
                  <span className="num-display" style={{ fontSize: 32, fontWeight: 400, color: "var(--navy)", letterSpacing: -1, lineHeight: 1 }}>{s.n}</span>
                  <span style={{ flex: 1, height: 1, background: "var(--hairline)" }} aria-hidden="true" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, letterSpacing: -0.3 }}>{s.t}</h3>
                <p style={{ fontSize: 13.5, color: "var(--dim)", lineHeight: 1.6 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ ALL CLAUSES ═══════ */}
        <section style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 96px" }} aria-labelledby="clauses-heading">
          <p className="section-eyebrow" style={{ display: "block", textAlign: "center" }}>Klausel-Datenbank</p>
          <h2 id="clauses-heading" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(28px,3.6vw,38px)", fontWeight: 400, textAlign: "center", marginBottom: 8, letterSpacing: -0.5, lineHeight: 1.15 }}>
            Was wir prüfen
          </h2>
          <p style={{ textAlign: "center", color: "var(--dim)", fontSize: 15, maxWidth: 540, margin: "0 auto 48px" }}>
            {LANDING_CLAUSES.length} Klausel-Typen aus {LANDING_CATEGORIES.length} Kategorien — jede mit Verweis auf das maßgebliche BGH-Urteil oder den BGB-Paragraphen.
          </p>
          {LANDING_CATEGORIES.map((cat) => (
            <div key={cat} style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid var(--hairline)" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--navy)", background: "var(--navy-soft)", padding: "3px 8px", borderRadius: 4, letterSpacing: 0.4, fontFamily: "var(--mono)" }} aria-hidden="true">{LANDING_CAT_ICONS[cat]}</span>
                <h3 style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>{cat}</h3>
                <span style={{ fontSize: 11, color: "var(--dim)", fontFamily: "var(--mono)", letterSpacing: 0.3, marginLeft: "auto" }}>
                  {LANDING_CLAUSES.filter((c) => c.cat === cat).length} Klauseln
                </span>
              </div>
              <div className="grid-clauses-pair">
                {LANDING_CLAUSES.filter((c) => c.cat === cat).map((c) => (
                  <div key={c.id} style={{ background: "var(--card)", border: "1px solid var(--hairline)", borderRadius: 10, padding: "13px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }} className="card-lift">
                    <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, color: "var(--fg)" }}>{c.name}</span>
                    <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--navy)", flexShrink: 0, background: "var(--navy-soft)", padding: "3px 7px", borderRadius: 4, letterSpacing: 0.2 }}>
                      {c.law.length > 22 ? c.law.slice(0, 20) + "…" : c.law}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ═══════ SOCIAL PROOF ═══════ */}
        <section style={{ background: "var(--bg-tint)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)", padding: "96px 0", marginBottom: 96 }} aria-labelledby="testimonials-heading">
          <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px" }}>
            <p className="section-eyebrow" style={{ display: "block", textAlign: "center" }}>Stimmen</p>
            <h2 id="testimonials-heading" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(28px,3.6vw,38px)", fontWeight: 400, textAlign: "center", marginBottom: 48, letterSpacing: -0.5, lineHeight: 1.15 }}>
              Was unsere Nutzer sagen
            </h2>
            <div className="grid-cards grid-cards--3" style={{ gap: 20 }}>
              {TESTIMONIALS.map((t, i) => (
                <figure
                  key={i}
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--hairline)",
                    borderRadius: 14,
                    padding: "28px 24px",
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                  className="card-lift"
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontSize: 64,
                      lineHeight: 0.6,
                      color: "var(--navy)",
                      opacity: 0.3,
                      position: "absolute",
                      top: 18,
                      right: 22,
                      fontStyle: "italic",
                    }}
                  >
                    „
                  </span>
                  <blockquote style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: "var(--fg)", flex: 1, marginBottom: 20, fontFamily: "var(--font-serif), Georgia, serif", fontStyle: "italic", letterSpacing: -0.1 }}>
                    {t.q}
                  </blockquote>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid var(--hairline)" }}>
                    <figcaption style={{ fontSize: 12 }}>
                      <span style={{ fontWeight: 600, color: "var(--fg)", letterSpacing: -0.1 }}>{t.n}</span>
                      <span style={{ color: "var(--dim)" }}> · {t.c}</span>
                    </figcaption>
                    <div style={{ display: "flex", gap: 2 }} aria-label="5 von 5 Sternen">
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} width="11" height="11" viewBox="0 0 24 24" fill="#A07F2E" stroke="none" aria-hidden="true" focusable="false">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ PRICING ═══════ */}
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 96px" }} aria-labelledby="pricing-heading">
          <p className="section-eyebrow" style={{ display: "block", textAlign: "center" }}>Preise</p>
          <h2 id="pricing-heading" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(28px,3.6vw,38px)", fontWeight: 400, textAlign: "center", marginBottom: 8, letterSpacing: -0.5, lineHeight: 1.15 }}>
            Einmalzahlung. Kein Abo.
          </h2>
          <p style={{ textAlign: "center", color: "var(--dim)", fontSize: 15, marginBottom: 48, maxWidth: 460, margin: "0 auto 48px" }}>
            Du zahlst genau einmal — und bekommst den vollständigen Report. Keine versteckten Kosten, keine Folgeabbuchungen.
          </p>
          <div className="grid-cards grid-cards--2" style={{ gap: 18, alignItems: "stretch" }}>
            {/* Free tier */}
            <div style={{ background: "var(--card)", border: "1px solid var(--hairline)", borderRadius: 16, padding: "32px 26px", display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 10.5, fontWeight: 700, color: "var(--dim)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Kostenlos</p>
              <p className="num-display" style={{ fontSize: 44, fontWeight: 400, letterSpacing: -1.5, marginBottom: 4, color: "var(--fg)", lineHeight: 1 }}>0 €</p>
              <p style={{ fontSize: 13, color: "var(--dim)", marginBottom: 26 }}>Erste Einschätzung</p>
              <ul style={{ listStyle: "none", padding: 0, fontSize: 13.5, color: "var(--fg)", lineHeight: 1, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                <li style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8l3.5 3.5L13 4" stroke="var(--navy)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Bis zu 3 Klauseln geprüft
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8l3.5 3.5L13 4" stroke="var(--navy)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Ampel-Bewertung pro Klausel
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8l3.5 3.5L13 4" stroke="var(--navy)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Keine Anmeldung nötig
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--dim-soft)" }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  Kein detaillierter Report
                </li>
              </ul>
            </div>

            {/* Premium tier */}
            <div className="pricing-premium" style={{ color: "#F5F3EE", borderRadius: 16, padding: "32px 26px", position: "relative", display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,.06)" }}>
              <div
                style={{
                  position: "absolute",
                  top: -1,
                  right: 24,
                  fontSize: 10,
                  fontWeight: 700,
                  background: "var(--gold)",
                  color: "#1A1815",
                  padding: "4px 10px",
                  borderRadius: "0 0 6px 6px",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Empfohlen
              </div>
              <p style={{ fontSize: 10.5, fontWeight: 700, color: "rgba(245,243,238,.55)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Vollreport</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <p className="num-display" style={{ fontSize: 44, fontWeight: 400, letterSpacing: -1.5, color: "#fff", lineHeight: 1 }}>2,99</p>
                <span style={{ fontSize: 18, color: "rgba(245,243,238,.6)", fontWeight: 500 }}>€</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(245,243,238,.55)", marginBottom: 26 }}>Einmalzahlung · Kein Abo</p>
              <ul style={{ listStyle: "none", padding: 0, fontSize: 13.5, lineHeight: 1, display: "flex", flexDirection: "column", gap: 12, flex: 1, marginBottom: 24 }}>
                <li style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8l3.5 3.5L13 4" stroke="#A07F2E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Alle {LANDING_CLAUSES.length} Klausel-Typen geprüft
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8l3.5 3.5L13 4" stroke="#A07F2E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Detaillierte Erklärungen
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8l3.5 3.5L13 4" stroke="#A07F2E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  BGH-Urteile &amp; Rechtsgrundlagen
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8l3.5 3.5L13 4" stroke="#A07F2E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Konkrete Handlungsempfehlungen
                </li>
              </ul>
              <p style={{ fontSize: 11, color: "rgba(245,243,238,.45)", textAlign: "center", letterSpacing: 0.2, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.08)" }}>
                Geld-zurück bei technischen Fehlern · DSGVO-konform
              </p>
            </div>
          </div>
        </section>

        {/* ═══════ FAQ ═══════ */}
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 96px" }} aria-labelledby="faq-heading">
          <JsonLd data={faqPageJsonLd(FAQ_ITEMS)} id="ld-faq" />
          <p className="section-eyebrow" style={{ display: "block", textAlign: "center" }}>Fragen &amp; Antworten</p>
          <h2 id="faq-heading" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(28px,3.6vw,38px)", fontWeight: 400, textAlign: "center", marginBottom: 48, letterSpacing: -0.5, lineHeight: 1.15 }}>
            Häufige Fragen
          </h2>
          <div style={{ borderTop: "1px solid var(--hairline)" }}>
            {FAQ_ITEMS.map((item, i) => (
              <details
                key={i}
                style={{
                  borderBottom: "1px solid var(--hairline)",
                  overflow: "hidden",
                }}
              >
                <summary
                  style={{
                    padding: "20px 4px",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    listStyle: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                    color: "var(--fg)",
                    letterSpacing: -0.2,
                  }}
                >
                  <span>{item.q}</span>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: "1px solid var(--hairline)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--navy)",
                      fontSize: 14,
                      fontFamily: "var(--font-serif), Georgia, serif",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div style={{ padding: "0 4px 20px" }}>
                  <p style={{ fontSize: 14.5, color: "var(--dim)", lineHeight: 1.7, maxWidth: 580 }}>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ═══════ CTA ═══════ */}
        <section style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 96px", textAlign: "center" }}>
          <div
            style={{
              background: "linear-gradient(180deg, var(--card-warm) 0%, var(--bg) 100%)",
              border: "1px solid var(--hairline)",
              borderRadius: 24,
              padding: "72px 32px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <p className="ornament-rule" style={{ marginBottom: 24 }}>§</p>
            <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(30px,4vw,42px)", fontWeight: 400, marginBottom: 18, letterSpacing: -0.6, lineHeight: 1.15 }}>
              Bereit, deinen Vertrag zu&nbsp;prüfen?
            </h2>
            <p style={{ color: "var(--dim)", fontSize: 16, marginBottom: 36, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.6 }}>
              Kostenlos starten · Kein Account · 30 Sekunden bis zur ersten Einschätzung.
            </p>
            <a
              href="#upload"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "var(--fg)",
                color: "var(--bg)",
                textDecoration: "none",
                padding: "16px 36px",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: -0.3,
                boxShadow: "0 1px 0 rgba(255,255,255,.06) inset, 0 4px 20px -6px rgba(27,43,94,.25)",
              }}
            >
              Jetzt Mietvertrag prüfen
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </section>
      </main>

      {/* ═══════ FOOTER ═══════ */}
      <footer style={{ borderTop: "1px solid var(--hairline)", background: "var(--card-warm)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "48px 24px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }} aria-hidden="true">
                <svg width="22" height="26" viewBox="0 0 22 26" fill="none" aria-hidden="true" focusable="false">
                  <path d="M2 2h12l6 6v16a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" fill="white" stroke="#1B2B5E" strokeWidth="1.5"/>
                  <path d="M14 2v7h6" fill="none" stroke="#1B2B5E" strokeWidth="1.5" strokeLinejoin="round"/>
                  <line x1="6" y1="12" x2="15" y2="12" stroke="#1B2B5E" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="6" y1="16" x2="15" y2="16" stroke="#1B2B5E" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="15" cy="22" r="4" fill="#1B2B5E"/>
                </svg>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.3, color: "var(--fg)" }}>Klare Miete</p>
                <p style={{ fontSize: 11, color: "var(--dim)", letterSpacing: 0.3, marginTop: 2 }}>Mietrecht — klar, präzise, digital.</p>
              </div>
            </div>
            <nav className="footer-nav" aria-label="Rechtliche Hinweise" style={{ fontSize: 13, gap: "12px 24px" }}>
              <a href="/impressum" style={{ color: "var(--dim)", textDecoration: "none", letterSpacing: -0.1 }}>Impressum</a>
              <a href="/datenschutz" style={{ color: "var(--dim)", textDecoration: "none", letterSpacing: -0.1 }}>Datenschutz</a>
              <a href="/agb" style={{ color: "var(--dim)", textDecoration: "none", letterSpacing: -0.1 }}>AGB</a>
              <a href="/kontakt" style={{ color: "var(--dim)", textDecoration: "none", letterSpacing: -0.1 }}>Kontakt</a>
            </nav>
          </div>
          <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 11, color: "var(--dim)", letterSpacing: 0.1 }}>
              © 2026 Klare Miete <span className="footer-decor" aria-hidden="true" /> Automatisierte Ersteinschätzung <span className="footer-decor" aria-hidden="true" /> Keine Rechtsberatung i.&nbsp;S.&nbsp;d. RDG
            </p>
            <p style={{ fontSize: 10.5, color: "var(--dim-soft)", fontFamily: "var(--mono)", letterSpacing: 0.4 }}>
              v 1.0 · Made in Tübingen
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
