import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

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
 * NEXT_PUBLIC_SITE_URL wird über Vercel-Env gesetzt; bei Domain-Wechsel
 * dort anpassen — robots.ts liest automatisch den neuen Wert.
 */
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
