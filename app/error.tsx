"use client";
/**
 * Globale Fehlerseite (Next.js App Router).
 *
 * Muss ein Client Component sein — error.tsx empfängt die `error`-
 * und `reset`-Props aus dem React-Fehlergrenzen-Mechanismus.
 *
 * Wird bei ungefangenen Laufzeitfehlern in der Route-Hierarchie
 * angezeigt (nicht für HTTP-404; dafür greift not-found.tsx).
 */
import Link from "next/link";

const CSS = {
  "--bg": "#F8F7F4",
  "--fg": "#1A1815",
  "--dim": "#76746C",
  "--line": "rgba(0,0,0,.07)",
  "--blue": "#1B2B5E",
  minHeight: "100vh",
  background: "var(--bg)",
  color: "var(--fg)",
} as React.CSSProperties;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={CSS}>
      <header
        className="site-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--line)",
          background: "rgba(248,247,244,.85)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}
          aria-label="Zur Startseite"
        >
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
        <Link
          href="/"
          style={{ background: "var(--fg)", color: "var(--bg)", textDecoration: "none", padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, letterSpacing: -0.2 }}
        >
          Zur Startseite
        </Link>
      </header>

      <main id="main-content">
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "96px 24px 120px", textAlign: "center" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--dim)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>
            Fehler
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "clamp(28px,4.5vw,42px)",
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: -0.5,
              marginBottom: 16,
            }}
          >
            Etwas ist schiefgelaufen
          </h1>
          <p style={{ fontSize: 17, color: "var(--dim)", lineHeight: 1.65, marginBottom: 40 }}>
            Ein unerwarteter Fehler ist aufgetreten. Du kannst es erneut versuchen oder
            zur Startseite zurückkehren.
          </p>
          {error.digest && (
            <p style={{ fontSize: 12, color: "var(--dim)", fontFamily: "var(--font-mono), monospace", marginBottom: 32 }}>
              Fehler-ID: {error.digest}
            </p>
          )}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={reset}
              style={{
                background: "var(--blue)",
                color: "#fff",
                border: "none",
                padding: "12px 32px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: -0.3,
              }}
            >
              Erneut versuchen
            </button>
            <Link
              href="/"
              style={{
                display: "inline-block",
                background: "transparent",
                color: "var(--fg)",
                border: "1.5px solid var(--line)",
                textDecoration: "none",
                padding: "12px 32px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: -0.3,
              }}
            >
              Zur Startseite
            </Link>
          </div>
        </div>
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
