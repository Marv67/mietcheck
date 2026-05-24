/**
 * /musterschreiben/[slug] — Editor pro Vorlage mit Formular + Live-
 * Preview + Copy/Download/Print.
 *
 * SSG fuer die statische Seite, eingebettet TemplateForm Client-Insel
 * fuer den interaktiven Editor.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allVorlagenSlugs,
  getVorlageBySlug,
  extractPlatzhalter,
} from "../../_lib/musterschreiben";
import TemplateForm from "../../_components/template-form";
import { JsonLd } from "../../_lib/jsonld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mietcheck.de";

type RouteParams = { slug: string };

export function generateStaticParams(): RouteParams[] {
  return allVorlagenSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { slug } = await params;
  const v = getVorlageBySlug(slug);
  if (!v) return { title: "Vorlage nicht gefunden" };

  const path = `/musterschreiben/${v.slug}`;
  const title = `Musterschreiben ${v.titel}`;
  const description = `Kostenlose Vorlage für ${v.titel.toLowerCase()}. ${v.hinweis} Mit Platzhaltern ausfüllen, kopieren oder als .txt herunterladen.`;

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

export default async function VorlageDetail({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const v = getVorlageBySlug(slug);
  if (!v) notFound();

  const platzhalter = extractPlatzhalter(v.vorlage);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Musterschreiben ${v.titel}`,
    description: v.hinweis,
    inLanguage: "de-DE",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/musterschreiben/${v.slug}` },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Start", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Musterschreiben", item: `${SITE_URL}/musterschreiben` },
      { "@type": "ListItem", position: 3, name: v.titel, item: `${SITE_URL}/musterschreiben/${v.slug}` },
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
            <Link href="/musterschreiben" style={{ color: "inherit", textDecoration: "none" }}>Musterschreiben</Link>
            <span aria-hidden="true"> › </span>
            <span aria-current="page">{v.titel}</span>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--dim)" }}>{v.id}</span>
            {v.norm.map((n) => (
              <span key={n} style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--blue)", background: "var(--blue-bg)", padding: "2px 8px", borderRadius: 5 }}>
                {n}
              </span>
            ))}
          </div>

          <h1 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "clamp(28px,4.5vw,42px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 16 }}>
            {v.titel}
          </h1>

          <p style={{ fontSize: 15, color: "var(--dim)", lineHeight: 1.65, marginBottom: 32, padding: "12px 16px", background: "var(--blue-bg)", borderRadius: 8 }}>
            <strong style={{ color: "var(--blue)" }}>Tipp:</strong> {v.hinweis}
          </p>

          <TemplateForm template={v.vorlage} placeholders={platzhalter} filename={`${v.slug}-${v.id}`} />

          <p style={{ fontSize: 12, color: "var(--dim)", lineHeight: 1.55, padding: "16px 0", borderTop: "1px solid var(--line)", marginTop: 40 }}>
            ⚖️ Diese Vorlage ersetzt keine anwaltliche Beratung im Sinne des Rechtsdienstleistungsgesetzes (RDG). Bei komplexen Sachverhalten und vor Versand wichtiger Schreiben empfehlen wir Rücksprache mit einem Fachanwalt für Mietrecht oder dem örtlichen Mieterverein. Versand möglichst per Einschreiben/Rückschein zur Beweissicherung.
          </p>
        </article>

        <section style={{ maxWidth: 660, margin: "0 auto", padding: "0 24px 64px", textAlign: "center" }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: "40px 32px" }}>
            <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 24, fontWeight: 400, marginBottom: 10 }}>
              Sicherheit durch Vertragsprüfung
            </h2>
            <p style={{ color: "var(--dim)", fontSize: 14.5, marginBottom: 22, lineHeight: 1.6 }}>
              Bevor du schreibst: Lass Klare Miete prüfen, welche Klauseln in deinem Mietvertrag unwirksam sind. Das stärkt deine Argumente.
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
