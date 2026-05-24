/**
 * /mietpreisbremse/[bundesland] — pro Bundesland eine SSG-Seite mit
 * vollstaendiger Liste aller MPB-Gemeinden, Gueltigkeit, Kappungsgrenze.
 *
 * SEO-Hebel: 16 statische URLs, jede mit eigenem Title-Tag und
 * description, ranking-fokussiert auf '[Bundesland] Mietpreisbremse'-
 * Anfragen.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allBundeslandSlugs,
  getBundeslandBySlug,
  sortedGemeinden,
  MPB_PRUEFSCHEMA,
} from "../../_lib/mietpreisbremse";
import { JsonLd } from "../../_lib/jsonld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mietcheck.de";

type RouteParams = { bundesland: string };

export function generateStaticParams(): RouteParams[] {
  return allBundeslandSlugs().map((bundesland) => ({ bundesland }));
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { bundesland } = await params;
  const b = getBundeslandBySlug(bundesland);
  if (!b) return { title: "Bundesland nicht gefunden" };

  const path = `/mietpreisbremse/${b.slug}`;
  const active = b.data.mietpreisbremse;
  const title = active
    ? `Mietpreisbremse ${b.name} – ${b.data.gemeinden.length} Gemeinden`
    : `Mietpreisbremse ${b.name} – aktuell nicht aktiv`;
  const description = active
    ? `Mietpreisbremse in ${b.name}: gilt in ${b.data.gemeinden.length} Gemeinden, gültig bis ${b.data.gueltig_bis}. Vollständige Stadt-Liste und Prüfschritte.`
    : `In ${b.name} gilt aktuell keine Mietpreisbremse. Übersicht und alternative Schutzmechanismen.`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
      locale: "de_DE",
      siteName: "Klare Miete",
    },
    twitter: { title, description },
  };
}

export default async function BundeslandPage({ params }: { params: Promise<RouteParams> }) {
  const { bundesland } = await params;
  const b = getBundeslandBySlug(bundesland);
  if (!b) notFound();

  const gemeinden = sortedGemeinden(b);
  const active = b.data.mietpreisbremse;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Mietpreisbremse ${b.name}`,
    description: active
      ? `Mietpreisbremse in ${b.name} mit ${b.data.gemeinden.length} betroffenen Gemeinden, gültig bis ${b.data.gueltig_bis}.`
      : `Mietpreisbremse aktuell nicht aktiv in ${b.name}.`,
    inLanguage: "de-DE",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: { "@type": "AdministrativeArea", name: b.name },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/mietpreisbremse/${b.slug}` },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Start", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Mietpreisbremse", item: `${SITE_URL}/mietpreisbremse` },
      { "@type": "ListItem", position: 3, name: b.name, item: `${SITE_URL}/mietpreisbremse/${b.slug}` },
    ],
  };

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
      <JsonLd data={articleLd} id="ld-article" />
      <JsonLd data={breadcrumbLd} id="ld-breadcrumb" />

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
        <article style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 32px" }}>
          <nav aria-label="Brotkrumen" style={{ fontSize: 12, color: "var(--dim)", marginBottom: 16 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Start</Link>
            <span aria-hidden="true"> › </span>
            <Link href="/mietpreisbremse" style={{ color: "inherit", textDecoration: "none" }}>Mietpreisbremse</Link>
            <span aria-hidden="true"> › </span>
            <span aria-current="page">{b.name}</span>
          </nav>

          <h1 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(28px,4.5vw,42px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 16 }}>
            Mietpreisbremse {b.name}
          </h1>

          {/* Status-Banner */}
          <div
            role="status"
            style={{
              padding: "18px 22px",
              background: active ? "#FEF2F2" : "#F0FDF4",
              border: `1px solid ${active ? "#FECACA" : "#BBF7D0"}`,
              color: active ? "#B91C1C" : "#15803D",
              borderRadius: 12,
              marginBottom: 28,
            }}
          >
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              {active
                ? `✓ Mietpreisbremse aktiv in ${b.data.gemeinden.length} ${b.data.gemeinden.length === 1 ? "Gemeinde" : "Gemeinden"}`
                : `Mietpreisbremse aktuell nicht aktiv in ${b.name}`}
            </p>
            <p style={{ fontSize: 13.5, lineHeight: 1.55 }}>
              {active && (
                <>
                  Gültig bis <strong>{b.data.gueltig_bis}</strong>
                  {b.data.kappungsgrenze_15 && <> · Abgesenkte Kappungsgrenze: <strong>15 % in 3 Jahren</strong></>}
                </>
              )}
              {!active && b.data.kappungsgrenze_15 && (
                <>Abgesenkte Kappungsgrenze: <strong>15 % in 3 Jahren</strong> (§ 558 Abs. 3 BGB).</>
              )}
            </p>
          </div>

          {active && gemeinden.length > 0 && (
            <section style={{ marginBottom: 32 }} aria-labelledby="h-gemeinden">
              <h2 id="h-gemeinden" style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
                {gemeinden.length} betroffene {gemeinden.length === 1 ? "Gemeinde" : "Gemeinden"}
              </h2>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 6,
                }}
              >
                {gemeinden.map((g) => (
                  <li key={g} style={{ fontSize: 13.5, padding: "8px 12px", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 7 }}>
                    {g}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: 12, color: "var(--dim)", marginTop: 12 }}>
                Stand: Verordnung gültig bis {b.data.gueltig_bis}. Maßgeblich ist die jeweils aktuelle Rechtsverordnung des Landes.
              </p>
            </section>
          )}

          {active && (
            <section style={{ marginBottom: 32 }} aria-labelledby="h-vorgehen">
              <h2 id="h-vorgehen" style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>So gehst du bei zu hoher Miete vor</h2>
              <ol style={{ paddingLeft: 22, fontSize: 14.5, lineHeight: 1.7, color: "var(--fg)" }}>
                {MPB_PRUEFSCHEMA.map((step, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>
                    {step.replace(/^\d+\.\s*/, "")}
                  </li>
                ))}
              </ol>
            </section>
          )}

          <p style={{ fontSize: 12, color: "var(--dim)", lineHeight: 1.55, padding: "16px 0", borderTop: "1px solid var(--line)", marginTop: 32 }}>
            ⚖️ Diese Information ersetzt keine anwaltliche Beratung im Sinne des Rechtsdienstleistungsgesetzes (RDG). Die Rechtsverordnungen der Länder ändern sich regelmäßig — verbindlich ist die aktuelle Fassung der jeweiligen Mietpreisbegrenzungsverordnung.
          </p>
        </article>

        <section style={{ maxWidth: 660, margin: "0 auto", padding: "0 24px 64px", textAlign: "center" }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: "40px 32px" }}>
            <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 24, fontWeight: 400, marginBottom: 10 }}>
              Konkrete Mietprüfung
            </h2>
            <p style={{ color: "var(--dim)", fontSize: 14.5, marginBottom: 22, lineHeight: 1.6 }}>
              Lade deinen Mietvertrag hoch — Klare Miete prüft den Vertragstext und identifiziert Verstöße gegen die Mietpreisbremse automatisch.
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
