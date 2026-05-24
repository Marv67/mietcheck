/**
 * Server-side Helper fuer das Mietpreisbremse-Feature.
 *
 * Liest 631 Gemeinden in 16 Bundeslaendern aus data/website_db.json
 * und stellt Slug/Lookup/Suche bereit.
 *
 * URL-Schema: /mietpreisbremse/[bundesland-slug]
 * KEINE Einzel-Seiten pro Gemeinde (Thin-Content-Risiko bei 631 fast
 * identischen "Stadt X hat MPB ja/nein"-Pages).
 */

import websiteDb from "../../data/website_db.json";

export type BundeslandData = {
  gueltig_bis: string;
  mietpreisbremse: boolean;
  kappungsgrenze_15: boolean;
  gemeinden: string[];
};

export type Bundesland = {
  name: string;
  slug: string;
  data: BundeslandData;
};

type WebsiteDb = {
  mietpreisbremse: {
    anleitung: string;
    pruefschema: string[];
    ausnahmen: Record<string, string>;
    kappungsgrenze: { normal: string; abgesenkt: string };
    gemeinden_lookup: Record<string, BundeslandData>;
    regionale_details?: Record<string, unknown>;
  };
};

const db = websiteDb as unknown as WebsiteDb;

export const MPB_ANLEITUNG = db.mietpreisbremse.anleitung;
export const MPB_PRUEFSCHEMA = db.mietpreisbremse.pruefschema;
export const MPB_AUSNAHMEN = db.mietpreisbremse.ausnahmen;
export const MPB_KAPPUNGSGRENZE = db.mietpreisbremse.kappungsgrenze;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const BUNDESLAENDER: Bundesland[] = Object.entries(db.mietpreisbremse.gemeinden_lookup).map(
  ([name, data]) => ({ name, slug: slugify(name), data }),
);

const BY_SLUG = new Map<string, Bundesland>();
for (const b of BUNDESLAENDER) BY_SLUG.set(b.slug, b);

export function allBundeslaender(): Bundesland[] {
  return BUNDESLAENDER;
}

export function getBundeslandBySlug(slug: string): Bundesland | undefined {
  return BY_SLUG.get(slug);
}

export function allBundeslandSlugs(): string[] {
  return BUNDESLAENDER.map((b) => b.slug);
}

/** Gemeinden-Total (alle 16 Bundeslaender summiert). */
export function totalGemeinden(): number {
  return BUNDESLAENDER.reduce((sum, b) => sum + b.data.gemeinden.length, 0);
}

/** Sortierte Gemeindeliste (alphabetisch) zur Anzeige. */
export function sortedGemeinden(b: Bundesland): string[] {
  return [...b.data.gemeinden].sort((a, b) => a.localeCompare(b, "de"));
}

/**
 * Findet das Bundesland, dessen Gemeinden-Liste eine bestimmte Gemeinde
 * (case-insensitive) enthaelt. Wird vom Client-side Search via API
 * oder im JSON-Index genutzt.
 */
export function findGemeinde(gemeinde: string): { bundesland: Bundesland; treffer: string } | null {
  const needle = gemeinde.trim().toLowerCase();
  if (!needle) return null;
  for (const b of BUNDESLAENDER) {
    const hit = b.data.gemeinden.find((g) => g.toLowerCase() === needle);
    if (hit) return { bundesland: b, treffer: hit };
  }
  return null;
}

/**
 * Baut einen flachen, suchbaren Index aller Gemeinden mit Bundesland-
 * Referenz. Wird auf der Hauptseite per inline-Skript-Tag in den DOM
 * gegeben, damit die Client-Suche ohne API-Call funktioniert.
 *
 * Achtung: ~631 Eintraege × Schnitt 30 Bytes = ~20KB. Im HTML-Source
 * verschwindend gegen Hero/Klauseln-Content.
 */
export function buildSearchIndex(): Array<{ name: string; bl: string; slug: string; mpb: boolean }> {
  const idx: Array<{ name: string; bl: string; slug: string; mpb: boolean }> = [];
  for (const b of BUNDESLAENDER) {
    for (const g of b.data.gemeinden) {
      idx.push({ name: g, bl: b.name, slug: b.slug, mpb: b.data.mietpreisbremse });
    }
  }
  return idx;
}
