/**
 * /mietminderung/[slug] — Detail-Seite pro Mietminderungs-Szenario.
 *
 * Voll SSG. 54 indexierbare Long-Tail-URLs.
 * KEYWORD-TODO: title und description nutzen `mangel`-Text aus DB.
 * Falls die Mangelbezeichnungen suboptimal sind fuer Suchanfragen
 * (z.B. 'Totalausfall Heizung Winter' vs 'Heizungsausfall Mietminderung'),
 * waere ein zentrales Mapping in mietminderung.ts der richtige Ort.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allSzenarioSlugs,
  getSzenarioBySlug,
  szenarioSlug,
  szenarienByKategorie,
  iconForKategorie,
  BERECHNUNGSBASIS,
  parseQuote,
} from "../../_lib/mietminderung";
import { JsonLd } from "../../_lib/jsonld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mietcheck.de";

type RouteParams = { slug: string };

export function generateStaticParams(): RouteParams[] {
  return allSzenarioSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getSzenarioBySlug(slug);
  if (!s) return { title: "Szenario nicht gefunden" };

  const path = `/mietminderung/${szenarioSlug(s.id)}`;
  const title = `${s.mangel} – Mietminderung ${s.minderungsquote}`;
  const description = `Bei "${s.mangel}" sind ${s.minderungsquote} Mietminderung üblich. ${s.urteile.length} Gerichtsurteile als Beleg.`;

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
      siteName: "MietCheck",
    },
    twitter: { title, description },
  };
}

export default async function SzenarioDetail({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const s = getSzenarioBySlug(slug);
  if (!s) notFound();

  // Verwandte Szenarien aus derselben Kategorie
  const siblings = (szenarienByKategorie().find((g) => g.kategorie === s.kategorie)?.szenarien ?? [])
    .filter((x) => x.id !== s.id)
    .slice(0, 6);

  const quote = parseQuote(s.minderungsquote);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${s.mangel} – Mietminderung ${s.minderungsquote}`,
    description: `Mietminderungs-Quote und Gerichtsurteile bei: ${s.mangel}`,
    inLanguage: "de-DE",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: { "@type": "Thing", name: `Mietminderung ${s.kategorie}` },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/mietminderung/${szenarioSlug(s.id)}` },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Start", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Mietminderung", item: `${SITE_URL}/mietminderung` },
      { "@type": "ListItem", position: 3, name: s.mangel, item: `${SITE_URL}/mietminderung/${szenarioSlug(s.id)}` },
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
        <article style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px 32px" }}>
          <nav aria-label="Brotkrumen" style={{ fontSize: 12, color: "var(--dim)", marginBottom: 16 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Start</Link>
            <span aria-hidden="true"> › </span>
            <Link href="/mietminderung" style={{ color: "inherit", textDecoration: "none" }}>Mietminderung</Link>
            <span aria-hidden="true"> › </span>
            <span aria-current="page">{s.mangel}</span>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--dim)", textTransform: "uppercase", letterSpacing: 1 }}>
              <span aria-hidden="true">{iconForKategorie(s.kategorie)}</span> {s.kategorie}
            </span>
            <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--dim)" }}>·</span>
            <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--dim)" }}>{s.id}</span>
          </div>

          <h1 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(28px,4.5vw,42px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 24 }}>
            {s.mangel}
          </h1>

          {/* Quote-Hero */}
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 16, padding: "24px 28px", marginBottom: 32, textAlign: "center" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Typische Mietminderung</p>
            <p style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(40px,6vw,56px)", fontWeight: 400, color: "#B91C1C", letterSpacing: -1, lineHeight: 1.1 }}>
              {s.minderungsquote}
            </p>
            {quote && quote.min !== quote.max && (
              <p style={{ fontSize: 13, color: "var(--dim)", marginTop: 8 }}>
                Bandbreite je nach Schwere des Mangels
              </p>
            )}
          </div>

          {/* Beispiel-Rechnung */}
          {quote && (
            <section style={{ marginBottom: 32 }} aria-labelledby="h-rechnung">
              <h2 id="h-rechnung" style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Was bedeutet das in Euro?</h2>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--fg)", marginBottom: 12 }}>
                Bei einer <strong>Bruttowarmmiete von 1.000 €</strong> entspricht eine Minderung von{" "}
                <strong>{s.minderungsquote}</strong> einer monatlichen Reduktion von{" "}
                <strong style={{ color: "#B91C1C" }}>
                  {quote.min === quote.max ? `${quote.min * 10} €` : `${quote.min * 10} – ${quote.max * 10} €`}
                </strong>.
              </p>
              <p style={{ fontSize: 12, color: "var(--dim)", padding: "10px 14px", background: "var(--blue-bg)", borderRadius: 8 }}>
                Berechnungsbasis: {BERECHNUNGSBASIS}
              </p>
            </section>
          )}

          {/* Urteile */}
          <section style={{ marginBottom: 32 }} aria-labelledby="h-urteile">
            <h2 id="h-urteile" style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>
              {s.urteile.length === 1 ? "Gerichtsurteil als Beleg" : `${s.urteile.length} Gerichtsurteile als Beleg`}
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {s.urteile.map((u, i) => (
                <li key={`${u.aktenzeichen}-${i}`} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, padding: "14px 16px" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--mono)", color: "var(--blue)", marginBottom: 6 }}>
                    {u.gericht} {u.aktenzeichen}
                  </p>
                  {u.kernaussage && (
                    <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--fg)" }}>{u.kernaussage}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Vorgehen */}
          <section style={{ marginBottom: 32 }} aria-labelledby="h-vorgehen">
            <h2 id="h-vorgehen" style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>So gehst du vor</h2>
            <ol style={{ paddingLeft: 22, fontSize: 14.5, lineHeight: 1.7, color: "var(--fg)" }}>
              <li style={{ marginBottom: 8 }}><strong>Mängelanzeige</strong> schriftlich an den Vermieter (per Einschreiben oder mit Empfangsbestätigung). Mangel präzise beschreiben, angemessene Frist zur Beseitigung setzen.</li>
              <li style={{ marginBottom: 8 }}><strong>Mängelprotokoll</strong> führen: Fotos, Datum, Auswirkungen. Beweissicherung ist später entscheidend.</li>
              <li style={{ marginBottom: 8 }}><strong>Minderung schriftlich ankündigen</strong>, sobald die Frist verstreicht. Höhe der Minderung mit Bezug auf vergleichbare Urteile begründen.</li>
              <li style={{ marginBottom: 8 }}><strong>Unter Vorbehalt zahlen</strong> oder Minderung direkt einbehalten — bei höheren Quoten am besten erst nach Rechtsberatung, um keine Kündigung wegen Zahlungsverzug zu riskieren.</li>
            </ol>
          </section>

          <p style={{ fontSize: 12, color: "var(--dim)", lineHeight: 1.55, padding: "16px 0", borderTop: "1px solid var(--line)", marginTop: 32 }}>
            ⚖️ Diese Information ersetzt keine anwaltliche Beratung im Sinne des Rechtsdienstleistungsgesetzes (RDG). Die genannten Quoten sind Orientierungswerte aus konkreten Einzelfällen — die tatsächliche Minderung hängt vom Einzelfall ab. Vor Minderungseinbehalt empfehlen wir Rücksprache mit einem Fachanwalt für Mietrecht oder dem örtlichen Mieterverein.
          </p>
        </article>

        {siblings.length > 0 && (
          <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 48px" }} aria-labelledby="h-related">
            <h2 id="h-related" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 22, fontWeight: 400, marginBottom: 16 }}>
              Weitere {s.kategorie}-Mängel
            </h2>
            <ul className="grid-clauses" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {siblings.map((x) => (
                <li key={x.id}>
                  <Link
                    href={`/mietminderung/${szenarioSlug(x.id)}`}
                    style={{ display: "block", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, padding: "12px 14px", textDecoration: "none", color: "inherit" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--dim)" }}>{x.id}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 5, background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}>
                        {x.minderungsquote}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 550, lineHeight: 1.4 }}>{x.mangel}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: 16, textAlign: "center" }}>
              <Link href="/mietminderung" style={{ color: "var(--blue)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                Alle Mietminderungs-Szenarien ansehen →
              </Link>
            </p>
          </section>
        )}

        <section style={{ maxWidth: 660, margin: "0 auto", padding: "0 24px 64px", textAlign: "center" }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: "40px 32px" }}>
            <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 24, fontWeight: 400, marginBottom: 10 }}>Mietvertrag auf unwirksame Klauseln prüfen</h2>
            <p style={{ color: "var(--dim)", fontSize: 14.5, marginBottom: 22, lineHeight: 1.6 }}>
              Neben der Mietminderung lohnt sich oft ein Blick auf den Mietvertrag selbst — viele Klauseln zu Schönheitsreparaturen, Kaution oder Nebenkosten sind unwirksam.
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
