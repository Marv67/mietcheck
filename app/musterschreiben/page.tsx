/**
 * /musterschreiben — Hub aller 5 Briefvorlagen.
 *
 * Server Component, SSG.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { allVorlagen } from "../_lib/musterschreiben";

const vorlagen = allVorlagen();

export const metadata: Metadata = {
  title: `Musterschreiben für Mieter – ${vorlagen.length} fertige Vorlagen`,
  description: `Kostenlose Musterschreiben für Mängelanzeige, Kautionsrückforderung, Widerspruch Nebenkostenabrechnung, Rüge Mietpreisbremse und Härtefallwiderspruch. Mit Platzhaltern ausfüllen, kopieren, herunterladen.`,
  alternates: { canonical: "/musterschreiben" },
  openGraph: {
    title: "Musterschreiben für Mieter – kostenlos, anpassbar",
    description: "Mängelanzeige, Kautionsrückforderung, Widerspruch Nebenkostenabrechnung – Vorlagen mit Platzhaltern direkt im Browser ausfüllen.",
    url: "/musterschreiben",
    type: "website",
    locale: "de_DE",
    siteName: "MietCheck",
  },
};

export default function MusterschreibenHub() {
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
            <span aria-current="page">Musterschreiben</span>
          </nav>
          <h1 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(32px,5vw,46px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 16 }}>
            Musterschreiben für Mieter
          </h1>
          <p style={{ fontSize: 17, color: "var(--dim)", lineHeight: 1.6, marginBottom: 16 }}>
            Fertige Briefvorlagen für die häufigsten Mieter-Anliegen. Felder im Browser ausfüllen, fertigen Text kopieren oder als Datei herunterladen — kostenlos, ohne Anmeldung.
          </p>
          <p style={{ fontSize: 12, color: "var(--dim)" }}>
            ⚖️ Automatisch generierte Vorlagen auf Basis öffentlicher Rechtsprechung · Keine Rechtsberatung i.S.d. RDG
          </p>
        </section>

        <section style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 48px" }} aria-labelledby="list-heading">
          <h2 id="list-heading" style={{ position: "absolute", left: -9999 }}>Verfügbare Vorlagen</h2>
          <ul className="grid-cards grid-cards--2" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {vorlagen.map((v) => (
              <li key={v.slug}>
                <Link
                  href={`/musterschreiben/${v.slug}`}
                  style={{ display: "block", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "22px 24px", textDecoration: "none", color: "inherit" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--dim)" }}>{v.id}</span>
                    <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--blue)", background: "var(--blue-bg)", padding: "2px 8px", borderRadius: 5 }}>
                      {v.norm[0]}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 22, fontWeight: 400, marginBottom: 10 }}>{v.titel}</h3>
                  <p style={{ fontSize: 13, color: "var(--dim)", lineHeight: 1.55 }}>{v.hinweis}</p>
                  <p style={{ marginTop: 12, fontSize: 13, fontWeight: 600, color: "var(--blue)" }}>
                    Brief erstellen →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ maxWidth: 660, margin: "0 auto", padding: "0 24px 64px", textAlign: "center" }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: "40px 32px" }}>
            <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 26, fontWeight: 400, marginBottom: 10 }}>
              Erst Vertrag prüfen, dann Brief schreiben
            </h2>
            <p style={{ color: "var(--dim)", fontSize: 14.5, marginBottom: 24, lineHeight: 1.6 }}>
              MietCheck zeigt dir, welche Klauseln in deinem Vertrag unwirksam sind — das ist die Faktengrundlage für jedes Schreiben.
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
