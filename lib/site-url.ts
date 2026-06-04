/**
 * Kanonische Site-URL fuer Metadaten, Sitemap und robots.txt.
 *
 * Prioritaet:
 *  1. NEXT_PUBLIC_SITE_URL (explizit, z.B. "https://klaremiete.de")
 *  2. VERCEL_PROJECT_PRODUCTION_URL (Vercel-Auto-Variable, stabile
 *     Production-URL ohne Deployment-Hash, z.B. "mietcheck-three.vercel.app")
 *  3. Fallback-Platzhalter
 *
 * NEXT_PUBLIC_SITE_URL in den Vercel-Env-Variables setzen, sobald eine
 * eigene Domain konfiguriert ist.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://mietcheck.de");
