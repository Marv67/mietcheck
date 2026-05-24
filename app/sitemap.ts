import type { MetadataRoute } from "next";

/**
 * sitemap.xml-Generator (Next.js App Router).
 *
 * Listet aktuell:
 *  - Landingpage (/)
 *  - rechtliche Seiten (Stubs, Routen muessen noch angelegt werden)
 *
 * SEO-Wirkung: Sitemap beschleunigt Discovery neuer Seiten durch
 * Googlebot, signalisiert Wichtigkeit (priority) und Aktualitaet
 * (lastModified).
 *
 * In Commit 6 wird die Sitemap dynamisch aus klausel_db.json um
 * 260 Klausel-Detail-Seiten erweitert.
 *
 * SEO-TODO: NEXT_PUBLIC_SITE_URL auf echte Domain setzen.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mietcheck.de";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // Stubs — Routen werden in spaeteren Commits implementiert.
    // SEO-TODO: Falls diese Routen NICHT bis zum Live-Gang existieren,
    // bitte aus der Sitemap entfernen (sonst 404-Strafen).
    {
      url: `${SITE_URL}/impressum`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/datenschutz`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/agb`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
