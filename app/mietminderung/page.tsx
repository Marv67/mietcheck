/**
 * /mietminderung — Hub aller 54 Mietminderungs-Szenarien, gruppiert
 * nach Mangelkategorie.
 *
 * Server Component, voll SSG. Long-Tail-Eingang fuer Suchanfragen wie
 * 'Heizungsausfall Mietminderung Prozent', 'Schimmel Mietminderung Hoehe'.
 *
 * KEYWORD-TODO: h1 und Description hier sind das primaere Ranking-Material.
 * Pruefung gegen tatsaechliche Suchanfragen empfohlen.
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  allSzenarien,
  szenarienByKategorie,
  szenarioSlug,
  iconForKategorie,
  BERECHNUNGSBASIS,
} from "../_lib/mietminderung";

const total = allSzenarien().length;

export const metadata: Metadata = {
  title: `Mietminderung-Tabelle – ${total} Mangel-Szenarien mit Urteilen`,
  description: `Wie viel Mietminderung bei welchem Mangel? ${total} typische Wohnungsmangel-Szenarien mit konkreten Gerichtsurteilen und Minderungsquoten – nach aktueller Rechtsprechung.`,
  alternates: { canonical: "/mietminderung" },
  openGraph: {
    title: `Mietminderung-Tabelle – ${total} Mangel-Szenarien mit Urteilen`,
    description:
      "Welche Minderungsquote bei welchem Mangel? Konkrete Urteile, sortiert nach Mangelkategorie (Heizung, Schimmel, Lärm, Wasser, Elektrik, Fenster, Ungeziefer).",
    url: "/mietminderung",
    type: "website",
    locale: "de_DE",
    siteName: "MietCheck",
  },
};

export default function MietminderungHub() {
  const groups = szenarienByKategorie();

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
      <header className="site-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", background: "rgba(248,247,244,.85)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }} aria-label="Zur Startseite">
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "var(--blue)", display: "grid", placeItems: "center" }} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d="M3 21V7l9-5 9 5v14" />
              <path d="M9 21V13h6v8" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: -0.5 }}>MietCheck</span>
        </Link>
        <Link href="/#upload" style={{ background: "var(--fg)", color: "var(--bg)", textDecoration: "none", padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, letterSpacing: -0.2 }}>
          Vertrag prüfen
        </Link>
      </header>

      <main id="main-content">
        <section style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 32px" }}>
          <nav aria-label="Brotkrumen" style={{ fontSize: 12, color: "var(--dim)", marginBottom: 16 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Start</Link>
            <span aria-hidden="true"> › </span>
            <span aria-current="page">Mietminderung</span>
          </nav>
          <h1 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(32px,5vw,46px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 16 }}>
            Mietminderung – Tabelle mit {total} Szenarien
          </h1>
          <p style={{ fontSize: 17, color: "var(--dim)", lineHeight: 1.6, marginBottom: 16 }}>
            Welche Mietminderung bei welchem Mangel? Pro Szenario findest du die typische Minderungsquote und mehrere Gerichtsurteile mit Aktenzeichen.
          </p>
          <p style={{ fontSize: 13, color: "var(--dim)", lineHeight: 1.6, marginBottom: 8, padding: "10px 14px", background: "var(--blue-bg)", borderRadius: 8 }}>
            <strong style={{ color: "var(--blue)" }}>Berechnungsbasis:</strong> {BERECHNUNGSBASIS}.
          </p>
          <p style={{ fontSize: 12, color: "var(--dim)", marginBottom: 0 }}>
            ⚖️ Automatisierte Ersteinschätzung auf Basis öffentlicher Rechtsprechung · Keine Rechtsberatung i.S.d. RDG
          </p>
        </section>

        <section style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 64px" }} aria-labelledby="categories-heading">
          <h2 id="categories-heading" style={{ position: "absolute", left: -9999 }}>Mängel nach Kategorie</h2>
          {groups.map(({ kategorie, szenarien }) => (
            <article key={kategorie} style={{ marginBottom: 36 }}>
              <header style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12, borderBottom: "1px solid var(--line)", paddingBottom: 8, gap: 10, flexWrap: "wrap" }}>
                <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 24, fontWeight: 400 }}>
                  <span aria-hidden="true" style={{ marginRight: 8 }}>{iconForKategorie(kategorie)}</span>
                  {kategorie}
                </h2>
                <span style={{ fontSize: 12, color: "var(--dim)", fontFamily: "var(--mono)" }}>{szenarien.length} Szenarien</span>
              </header>
              <ul className="grid-clauses" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {szenarien.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/mietminderung/${szenarioSlug(s.id)}`}
                      style={{ display: "block", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, padding: "14px 16px", textDecoration: "none", color: "inherit" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--dim)" }}>{s.id}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#B91C1C", background: "#FEF2F2", border: "1px solid #FECACA", padding: "2px 10px", borderRadius: 5, whiteSpace: "nowrap" }}>
                          {s.minderungsquote}
                        </span>
                      </div>
                      <p style={{ fontSize: 13.5, fontWeight: 550, lineHeight: 1.4, color: "var(--fg)" }}>{s.mangel}</p>
                      <p style={{ fontSize: 11, color: "var(--dim)", marginTop: 4 }}>
                        {s.urteile.length} Gerichts­urteil{s.urteile.length === 1 ? "" : "e"}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section style={{ maxWidth: 660, margin: "0 auto", padding: "0 24px 64px", textAlign: "center" }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: "40px 32px" }}>
            <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 26, fontWeight: 400, marginBottom: 10 }}>Auch deinen Mietvertrag prüfen</h2>
            <p style={{ color: "var(--dim)", fontSize: 14.5, marginBottom: 24, lineHeight: 1.6 }}>
              Wenn dein Vermieter unwirksame Klauseln im Vertrag hat, ergeben sich oft weitere Rückforderungs-Ansprüche neben der Mietminderung.
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
        <p>© 2026 MietCheck · Automatisierte Ersteinschätzung · Keine Rechtsberatung</p>
      </footer>
    </div>
  );
}
