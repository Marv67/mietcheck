/**
 * /klauseln/[slug] — Detail-Seite pro Mietvertrag-Klausel.
 *
 * Voll Static-Site-Generated via generateStaticParams (alle 260 Klauseln
 * werden zur Build-Zeit als HTML vorgeneriert). Jede Seite ist ein
 * Long-Tail-Eingang von Google fuer Anfragen wie "Schoenheitsreparaturen
 * starre Fristen unwirksam" oder "BGH VIII ZR 168/12".
 *
 * SEO-Hebel:
 *  - 260 indexierbare URLs mit echtem, unique Content (DB-Eintraege)
 *  - generateMetadata: title und description aus DB
 *  - JSON-LD Article + BreadcrumbList fuer Rich-Snippets
 *  - Internal Linking zur Uebersicht und zu verwandten Klauseln
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allClauseSlugs, getClauseBySlug, clauseSlug, statusLabel, allClausesByCategory } from "../../_lib/clauses";
import { JsonLd } from "../../_lib/jsonld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mietcheck.de";

type RouteParams = { slug: string };

// SSG: alle 260 Klausel-URLs zur Build-Zeit erzeugen
export function generateStaticParams(): RouteParams[] {
  return allClauseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getClauseBySlug(slug);
  if (!c) return { title: "Klausel nicht gefunden" };

  const status = statusLabel(c.status);
  const path = `/klauseln/${clauseSlug(c.id)}`;
  // KEYWORD-TODO: Title-Pattern zentral hier. Aktuell:
  //   "{Klausel-Typ} ({Status}) – {Kategorie} | MietCheck"
  // Mensch sollte gegen tatsaechliche Suchanfragen pruefen und ggf.
  // umstellen (z.B. "{Klausel} im Mietvertrag - wirksam? | MietCheck").
  const title = `${c.klausel_typ} (${status.label}) – ${c.kategorie}`;
  const description = (c.beschreibung ?? c.typische_formulierung ?? "").slice(0, 155);

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

const TONE_STYLES: Record<string, { bg: string; fg: string; border: string; label: string }> = {
  bad: { bg: "#FEF2F2", fg: "#B91C1C", border: "#FECACA", label: "Unwirksam" },
  ok: { bg: "#F0FDF4", fg: "#15803D", border: "#BBF7D0", label: "Wirksam" },
  warn: { bg: "#FFFBEB", fg: "#A16207", border: "#FDE68A", label: "Bedingt wirksam" },
  unknown: { bg: "#F3F4F6", fg: "#6B7280", border: "#E5E7EB", label: "Status unbekannt" },
};

export default async function ClauseDetail({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const c = getClauseBySlug(slug);
  if (!c) notFound();

  const status = statusLabel(c.status);
  const tone = TONE_STYLES[status.tone];

  // Verwandte Klauseln aus derselben Kategorie (ohne sich selbst)
  const siblings = (allClausesByCategory().find((g) => g.kategorie === c.kategorie)?.klauseln ?? [])
    .filter((s) => s.id !== c.id)
    .slice(0, 6);

  // ── JSON-LD: Article + BreadcrumbList ──────────────────────────────
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.klausel_typ,
    description: c.beschreibung ?? c.typische_formulierung,
    inLanguage: "de-DE",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: {
      "@type": "Thing",
      name: c.kategorie,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/klauseln/${clauseSlug(c.id)}`,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Start", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Klauseln", item: `${SITE_URL}/klauseln` },
      { "@type": "ListItem", position: 3, name: c.klausel_typ, item: `${SITE_URL}/klauseln/${clauseSlug(c.id)}` },
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

      <header style={{ padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", background: "rgba(248,247,244,.85)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10 }}>
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
            <Link href="/klauseln" style={{ color: "inherit", textDecoration: "none" }}>Klauseln</Link>
            <span aria-hidden="true"> › </span>
            <span aria-current="page">{c.klausel_typ}</span>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--dim)", textTransform: "uppercase", letterSpacing: 1 }}>{c.kategorie}</span>
            <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--dim)" }}>·</span>
            <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--dim)" }}>{c.id}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: 6,
                background: tone.bg,
                color: tone.fg,
                border: `1px solid ${tone.border}`,
              }}
            >
              {tone.label}
            </span>
          </div>

          <h1 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(28px,4.5vw,42px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 24 }}>
            {c.klausel_typ}
          </h1>

          {c.beschreibung && (
            <p style={{ fontSize: 17, color: "var(--dim)", lineHeight: 1.65, marginBottom: 32 }}>{c.beschreibung}</p>
          )}

          {c.typische_formulierung && (
            <section style={{ marginBottom: 28 }} aria-labelledby="h-typische">
              <h2 id="h-typische" style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Typische Formulierung</h2>
              <blockquote style={{ margin: 0, background: "var(--card)", border: "1px solid var(--line)", borderLeft: "3px solid var(--blue)", borderRadius: "0 8px 8px 0", padding: "16px 20px", fontSize: 15, fontStyle: "italic", lineHeight: 1.7, color: "var(--fg)" }}>
                „{c.typische_formulierung}“
              </blockquote>
            </section>
          )}

          {c.norm && c.norm.length > 0 && (
            <section style={{ marginBottom: 28 }} aria-labelledby="h-norm">
              <h2 id="h-norm" style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Rechtsgrundlage</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {c.norm.map((n) => (
                  <li key={n} style={{ fontSize: 13, fontFamily: "var(--mono)", color: "var(--blue)", background: "var(--blue-bg)", padding: "4px 10px", borderRadius: 5 }}>
                    {n}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {c.rechtsfolge && (
            <section style={{ marginBottom: 28 }} aria-labelledby="h-folge">
              <h2 id="h-folge" style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Rechtsfolge</h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--fg)" }}>{c.rechtsfolge}</p>
            </section>
          )}

          {c.leitentscheidungen && c.leitentscheidungen.length > 0 && (
            <section style={{ marginBottom: 28 }} aria-labelledby="h-leit">
              <h2 id="h-leit" style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Leitentscheidungen</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {c.leitentscheidungen.map((l, i) => (
                  <li key={`${l.aktenzeichen}-${i}`} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--mono)", color: "var(--blue)" }}>{l.gericht} {l.aktenzeichen}</span>
                      {l.datum && <time dateTime={l.datum} style={{ fontSize: 12, color: "var(--dim)" }}>{l.datum}</time>}
                    </div>
                    {l.kernaussage && (
                      <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--fg)" }}>{l.kernaussage}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {c.handlungsempfehlung && (
            <section style={{ marginBottom: 28 }} aria-labelledby="h-handl">
              <h2 id="h-handl" style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Handlungsempfehlung</h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--fg)" }}>{c.handlungsempfehlung}</p>
            </section>
          )}

          <p style={{ fontSize: 12, color: "var(--dim)", lineHeight: 1.55, padding: "16px 0", borderTop: "1px solid var(--line)", marginTop: 32 }}>
            ⚖️ Diese Information ersetzt keine anwaltliche Beratung im Sinne des Rechtsdienstleistungsgesetzes (RDG). Bei konkreten Streitfragen wende dich an einen Fachanwalt für Mietrecht oder deinen örtlichen Mieterverein.
          </p>
        </article>

        {siblings.length > 0 && (
          <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 48px" }} aria-labelledby="h-related">
            <h2 id="h-related" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 22, fontWeight: 400, marginBottom: 16 }}>Weitere Klauseln: {c.kategorie}</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 8 }}>
              {siblings.map((s) => {
                const sl = statusLabel(s.status);
                const t = TONE_STYLES[sl.tone];
                return (
                  <li key={s.id}>
                    <Link
                      href={`/klauseln/${clauseSlug(s.id)}`}
                      style={{ display: "block", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, padding: "12px 14px", textDecoration: "none", color: "inherit" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--dim)" }}>{s.id}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 5, background: t.bg, color: t.fg, border: `1px solid ${t.border}` }}>{sl.label}</span>
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 550, lineHeight: 1.4 }}>{s.klausel_typ}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p style={{ marginTop: 16, textAlign: "center" }}>
              <Link href="/klauseln" style={{ color: "var(--blue)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                Alle Klauseln ansehen →
              </Link>
            </p>
          </section>
        )}

        <section style={{ maxWidth: 660, margin: "0 auto", padding: "0 24px 64px", textAlign: "center" }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: "40px 32px" }}>
            <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 24, fontWeight: 400, marginBottom: 10 }}>Deinen Mietvertrag automatisch prüfen lassen</h2>
            <p style={{ color: "var(--dim)", fontSize: 14.5, marginBottom: 22, lineHeight: 1.6 }}>
              Lade deinen Vertrag hoch und MietCheck identifiziert Klauseln wie diese automatisch.
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
        <nav aria-label="Rechtliche Hinweise" style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 10 }}>
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
