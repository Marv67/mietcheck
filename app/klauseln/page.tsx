/**
 * /klauseln — Uebersicht aller 260 Klauseln aus der Klare-Miete-DB.
 *
 * Server Component, voll SSG. Jeder Eintrag verlinkt auf die jeweilige
 * Detail-Seite. Diese Seite ist ein zentraler Hub fuer interne
 * Verlinkung — wichtig fuer Crawler und PageRank-Verteilung.
 *
 * KEYWORD-TODO: h1 und description hier sind die Tuer fuer Suchanfragen
 * wie "unwirksame Klauseln Mietvertrag Liste" oder "Mietrecht Klauseln
 * Uebersicht". Bitte gegen tatsaechliche Suchanfragen anpassen.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { allClausesByCategory, clauseSlug, statusLabel } from "../_lib/clauses";
import { countClauses } from "@/lib/clauses-index";

const { categories, clauses } = countClauses();

export const metadata: Metadata = {
  title: `${clauses} Mietvertrag-Klauseln im Überblick – BGH-Rechtsprechung`,
  description: `Vollständige Übersicht: ${clauses} typische Mietvertrag-Klauseln in ${categories} Kategorien. Pro Klausel: Status nach aktueller BGH-Rechtsprechung, einschlägige Normen und Handlungsempfehlung.`,
  alternates: { canonical: "/klauseln" },
  openGraph: {
    title: `${clauses} Mietvertrag-Klauseln im Überblick`,
    description: `Welche Klauseln in deinem Mietvertrag wirksam, unwirksam oder bedingt zulässig sind – nach aktueller BGH-Rechtsprechung.`,
    url: "/klauseln",
    type: "website",
    locale: "de_DE",
    siteName: "Klare Miete",
  },
};

const TONE_STYLES: Record<string, { bg: string; fg: string; border: string }> = {
  bad: { bg: "#FEF2F2", fg: "#B91C1C", border: "#FECACA" },
  ok: { bg: "#F0FDF4", fg: "#15803D", border: "#BBF7D0" },
  warn: { bg: "#FFFBEB", fg: "#A16207", border: "#FDE68A" },
  unknown: { bg: "#F3F4F6", fg: "#6B7280", border: "#E5E7EB" },
};

export default function KlauselnUebersicht() {
  const groups = allClausesByCategory();

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
          "--mono": "var(--font-mono), monospace",
          minHeight: "100vh",
          background: "var(--bg)",
          color: "var(--fg)",
        } as React.CSSProperties
      }
    >
      {/* ─── NAV ─── */}
      <header className="site-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", background: "rgba(248,247,244,.85)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }} aria-label="Zur Startseite">
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
        <Link href="/#upload" style={{ background: "var(--fg)", color: "var(--bg)", textDecoration: "none", padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, letterSpacing: -0.2 }}>
          Vertrag prüfen
        </Link>
      </header>

      <main id="main-content">
        {/* ───── HERO ───── */}
        <section style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 32px" }}>
          <nav aria-label="Brotkrumen" style={{ fontSize: 12, color: "var(--dim)", marginBottom: 16 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Start</Link>
            <span aria-hidden="true"> › </span>
            <span aria-current="page">Klauseln</span>
          </nav>
          <h1 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(32px,5vw,46px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 16 }}>
            {clauses} Mietvertrag-Klauseln im Überblick
          </h1>
          <p style={{ fontSize: 17, color: "var(--dim)", lineHeight: 1.6, marginBottom: 24, maxWidth: 600 }}>
            Welche Regelungen in deinem Mietvertrag wirksam sind und welche unwirksam — nach aktueller BGH-Rechtsprechung. Pro Eintrag findest du die typische Formulierung, einschlägige Normen, Leitentscheidungen und eine Handlungsempfehlung.
          </p>
          <p style={{ fontSize: 13, color: "var(--dim)", marginBottom: 0 }}>
            ⚖️ Automatisierte Ersteinschätzung auf Basis öffentlicher Rechtsprechung · Keine Rechtsberatung i.S.d. RDG
          </p>
        </section>

        {/* ───── KATEGORIEN ───── */}
        <section style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 64px" }} aria-labelledby="categories-heading">
          <h2 id="categories-heading" style={{ position: "absolute", left: -9999 }}>Klauseln nach Kategorie</h2>
          {groups.map(({ kategorie, klauseln }) => (
            <article key={kategorie} style={{ marginBottom: 36 }}>
              <header style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12, borderBottom: "1px solid var(--line)", paddingBottom: 8 }}>
                <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 24, fontWeight: 400 }}>{kategorie}</h2>
                <span style={{ fontSize: 12, color: "var(--dim)", fontFamily: "var(--mono)" }}>{klauseln.length} Klauseln</span>
              </header>
              <ul className="grid-clauses" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {klauseln.map((c) => {
                  const s = statusLabel(c.status);
                  const tone = TONE_STYLES[s.tone];
                  return (
                    <li key={c.id}>
                      <Link
                        href={`/klauseln/${clauseSlug(c.id)}`}
                        style={{
                          display: "block",
                          background: "var(--card)",
                          border: "1px solid var(--line)",
                          borderRadius: 10,
                          padding: "14px 16px",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 6 }}>
                          <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--dim)" }}>{c.id}</span>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: "2px 8px",
                              borderRadius: 5,
                              background: tone.bg,
                              color: tone.fg,
                              border: `1px solid ${tone.border}`,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {s.label}
                          </span>
                        </div>
                        <p style={{ fontSize: 13.5, fontWeight: 550, lineHeight: 1.4, color: "var(--fg)" }}>{c.klausel_typ}</p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </section>

        {/* ───── CTA ───── */}
        <section style={{ maxWidth: 660, margin: "0 auto", padding: "0 24px 64px", textAlign: "center" }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: "40px 32px" }}>
            <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 26, fontWeight: 400, marginBottom: 10 }}>Deinen Vertrag automatisch prüfen lassen</h2>
            <p style={{ color: "var(--dim)", fontSize: 14.5, marginBottom: 24, lineHeight: 1.6 }}>
              Klare Miete liest deinen Mietvertrag und gleicht jede Klausel automatisch mit dieser Datenbank ab. Kostenlos starten — kein Account nötig.
            </p>
            <Link
              href="/#upload"
              style={{ display: "inline-block", background: "var(--fg)", color: "var(--bg)", textDecoration: "none", padding: "12px 32px", borderRadius: 10, fontSize: 15, fontWeight: 600, letterSpacing: -0.3 }}
            >
              Jetzt Mietvertrag prüfen →
            </Link>
          </div>
        </section>
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
