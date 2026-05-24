import type { MetadataRoute } from "next";

/**
 * robots.txt-Generator (Next.js App Router).
 *
 * Erlaubt allen Crawlern den Vollzugriff auf oeffentliche Seiten,
 * blockiert /api/* (keine sinnvoll indexierbaren Endpunkte) und Next-
 * interne Pfade.
 *
 * SEO-Wirkung: explizite robots.txt verhindert versehentliches
 * Indexieren von API-Routes als Junk-Pages. Crawl-Budget wird auf
 * Content-Seiten konzentriert.
 *
 * SEO-TODO: Sobald die echte Domain feststeht, hier in
 * sitemap-URL den Platzhalter ersetzen (oder via env-Var lesen).
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mietcheck.de";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
