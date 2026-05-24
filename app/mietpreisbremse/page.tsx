/**
 * /mietpreisbremse — Hauptseite: Such-Eingabe + Bundesland-Uebersicht
 * + Pruefschema + Ausnahmen.
 *
 * Server Component, SSG. Sucht-Komponente ist Client-Insel.
 * KEYWORD-TODO: title und Description sind hoch konkurrent — bitte
 * an konkrete Suchanfragen anpassen.
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  allBundeslaender,
  buildSearchIndex,
  totalGemeinden,
  MPB_PRUEFSCHEMA,
  MPB_AUSNAHMEN,
  MPB_KAPPUNGSGRENZE,
} from "../_lib/mietpreisbremse";
import MpbSearch from "../_components/mpb-search";

const total = totalGemeinden();

export const metadata: Metadata = {
  title: `Mietpreisbremse-Check – ${total} Gemeinden in 13 Bundesländern`,
  description: `Gilt die Mietpreisbremse in deiner Stadt? Sofort-Check für ${total} Gemeinden in 13 Bundesländern, inklusive Gültigkeitsdatum und Ausnahmeregeln nach § 556d BGB.`,
  alternates: { canonical: "/mietpreisbremse" },
  openGraph: {
    title: "Mietpreisbremse-Check für alle deutschen Gemeinden",
    description: "Sofort prüfen, ob deine Stadt unter die Mietpreisbremse fällt — inkl. Ausnahmeregeln und Rückforderungsrecht.",
    url: "/mietpreisbremse",
    type: "website",
    locale: "de_DE",
    siteName: "MietCheck",
  },
};

export default function MietpreisbremseHub() {
  const bl = allBundeslaender();
  const aktive = bl.filter((b) => b.data.mietpreisbremse);
  const inaktive = bl.filter((b) => !b.data.mietpreisbremse);
  const idx = buildSearchIndex();

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
        <section style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 16px" }}>
          <nav aria-label="Brotkrumen" style={{ fontSize: 12, color: "var(--dim)", marginBottom: 16 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Start</Link>
            <span aria-hidden="true"> › </span>
            <span aria-current="page">Mietpreisbremse</span>
          </nav>
          <h1 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(32px,5vw,46px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 16 }}>
            Mietpreisbremse-Check
          </h1>
          <p style={{ fontSize: 17, color: "var(--dim)", lineHeight: 1.6, marginBottom: 28 }}>
            Gilt die Mietpreisbremse für deine Wohnung? Gib deine Stadt ein — wir zeigen sofort, ob sie unter die Mietpreisbremse fällt und wie hoch die Miete maximal sein darf.
          </p>
        </section>

        <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 48px" }} aria-labelledby="search-heading">
          <h2 id="search-heading" style={{ position: "absolute", left: -9999 }}>Stadt-Suche</h2>
          <MpbSearch index={idx} />
        </section>

        <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 48px" }} aria-labelledby="pruefen-heading">
          <h2 id="pruefen-heading" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 16 }}>
            So prüfst du, ob deine Miete zu hoch ist
          </h2>
          <ol style={{ paddingLeft: 22, fontSize: 14.5, lineHeight: 1.7, color: "var(--fg)" }}>
            {MPB_PRUEFSCHEMA.map((step, i) => (
              <li key={i} style={{ marginBottom: 10 }}>
                {step.replace(/^\d+\.\s*/, "")}
              </li>
            ))}
          </ol>
        </section>

        <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 48px" }} aria-labelledby="ausnahmen-heading">
          <h2 id="ausnahmen-heading" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 16 }}>
            Wann gilt die Mietpreisbremse <em>nicht</em>?
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(MPB_AUSNAHMEN).map(([key, txt]) => (
              <li key={key} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, padding: "14px 18px" }}>
                <p style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                  {key.replace(/_/g, " ")}
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.65 }}>{txt}</p>
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 13, color: "var(--dim)", marginTop: 16, padding: "10px 14px", background: "var(--blue-bg)", borderRadius: 8 }}>
            <strong style={{ color: "var(--blue)" }}>Kappungsgrenze:</strong> {MPB_KAPPUNGSGRENZE.abgesenkt}. In allen anderen Gebieten: {MPB_KAPPUNGSGRENZE.normal}.
          </p>
        </section>

        <section style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 48px" }} aria-labelledby="bl-heading">
          <h2 id="bl-heading" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 16 }}>
            Übersicht nach Bundesland
          </h2>

          <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
            Aktive Mietpreisbremse ({aktive.length})
          </h3>
          <ul className="grid-clauses" style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
            {aktive.map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/mietpreisbremse/${b.slug}`}
                  style={{ display: "block", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, padding: "14px 16px", textDecoration: "none", color: "inherit" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 600 }}>{b.name}</span>
                    <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--dim)" }}>
                      {b.data.gemeinden.length} {b.data.gemeinden.length === 1 ? "Gemeinde" : "Gemeinden"}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--dim)", marginTop: 4 }}>
                    Gültig bis {b.data.gueltig_bis}
                    {b.data.kappungsgrenze_15 && " · Kappungsgrenze 15 %"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          {inaktive.length > 0 && (
            <>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                Keine aktuelle Mietpreisbremse ({inaktive.length})
              </h3>
              <ul className="grid-clauses" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {inaktive.map((b) => (
                  <li key={b.slug}>
                    <Link
                      href={`/mietpreisbremse/${b.slug}`}
                      style={{ display: "block", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, padding: "14px 16px", textDecoration: "none", color: "inherit", opacity: 0.7 }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 14.5, fontWeight: 600 }}>{b.name}</span>
                        <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--dim)" }}>—</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section style={{ maxWidth: 660, margin: "0 auto", padding: "0 24px 64px", textAlign: "center" }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: "40px 32px" }}>
            <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 26, fontWeight: 400, marginBottom: 10 }}>
              Verstoß gegen die Mietpreisbremse?
            </h2>
            <p style={{ color: "var(--dim)", fontSize: 14.5, marginBottom: 24, lineHeight: 1.6 }}>
              Lade deinen Mietvertrag hoch — MietCheck prüft alle Klauseln und erkennt automatisch, ob du zu viel zahlst.
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
