import type { MetadataRoute } from "next";
import { allClauseSlugs } from "./_lib/clauses";
import { allSzenarioSlugs } from "./_lib/mietminderung";

/**
 * sitemap.xml-Generator (Next.js App Router).
 *
 * Enthaelt:
 *  - Landingpage (/)
 *  - Klausel-Uebersicht (/klauseln)
 *  - 260 Klausel-Detail-Seiten (/klauseln/[slug])
 *  - rechtliche Seiten (Stubs, Routen muessen noch angelegt werden)
 *
 * SEO-Wirkung: Sitemap beschleunigt Discovery durch Googlebot,
 * signalisiert Wichtigkeit (priority) und Aktualitaet (lastModified).
 * Mit 260+ Klausel-URLs sehr wichtig — ohne Sitemap braucht Google
 * Wochen bis Monate, alle URLs zu finden.
 *
 * SEO-TODO: NEXT_PUBLIC_SITE_URL auf echte Domain setzen.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mietcheck.de";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const clauseEntries: MetadataRoute.Sitemap = allClauseSlugs().map((slug) => ({
    url: `${SITE_URL}/klauseln/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const mietminderungEntries: MetadataRoute.Sitemap = allSzenarioSlugs().map((slug) => ({
    url: `${SITE_URL}/mietminderung/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/klauseln`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/mietminderung`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...clauseEntries,
    ...mietminderungEntries,
    // SEO-TODO: Sobald Impressum/Datenschutz/AGB/Kontakt finale Inhalte
    // haben (statt aktuell noindex-Stubs), hier wieder aufnehmen mit
    // priority 0.3. Solange die Stubs noindex sind, sie BEWUSST nicht
    // in der Sitemap listen — Sitemap signalisiert sonst "indexiere
    // mich" und widerspricht dem noindex auf der Page selbst.
  ];
}
