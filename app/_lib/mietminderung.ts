/**
 * Server-side Helper fuer das Mietminderung-Feature.
 *
 * Liest die 54 Szenarien aus data/website_db.json und stellt
 * Lookup/Slug-Funktionen bereit. Wird von /mietminderung-Routen
 * und der Sitemap konsumiert.
 *
 * Slug-Konvention: lowercase ID, z.B. "MT-H01" → "mt-h01".
 */

import websiteDb from "../../data/website_db.json";

export type Urteil = {
  gericht: string;
  aktenzeichen: string;
  kernaussage?: string;
};

export type Szenario = {
  id: string;
  mangel: string;
  kategorie: string;
  minderungsquote: string;
  urteile: Urteil[];
};

type WebsiteDb = {
  mietminderung: {
    anleitung: string;
    berechnungsbasis: string;
    szenarien: Szenario[];
  };
};

const db = websiteDb as unknown as WebsiteDb;

export const MIETMINDERUNG_ANLEITUNG = db.mietminderung.anleitung;
export const BERECHNUNGSBASIS = db.mietminderung.berechnungsbasis;

const BY_ID = new Map<string, Szenario>();
for (const s of db.mietminderung.szenarien) BY_ID.set(s.id, s);

export function allSzenarien(): Szenario[] {
  return db.mietminderung.szenarien;
}

export function getSzenarioBySlug(slug: string): Szenario | undefined {
  return BY_ID.get(slug.toUpperCase());
}

export function szenarioSlug(id: string): string {
  return id.toLowerCase();
}

export function allSzenarioSlugs(): string[] {
  return db.mietminderung.szenarien.map((s) => szenarioSlug(s.id));
}

export function szenarienByKategorie(): { kategorie: string; szenarien: Szenario[] }[] {
  const map = new Map<string, Szenario[]>();
  for (const s of db.mietminderung.szenarien) {
    if (!map.has(s.kategorie)) map.set(s.kategorie, []);
    map.get(s.kategorie)!.push(s);
  }
  // Stabile Reihenfolge: nach Anzahl Szenarien absteigend, dann alphabetisch
  return Array.from(map.entries())
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .map(([kategorie, szenarien]) => ({ kategorie, szenarien }));
}

/**
 * Parst "70-100 %" oder "20-60 %" o.ae. zu Min/Max-Werten fuer einen
 * optionalen Calculator. Single-Value-Quoten wie "100 %" → min=max=100.
 */
export function parseQuote(q: string): { min: number; max: number } | null {
  const m = q.match(/(\d+)(?:\s*[–-]\s*(\d+))?/);
  if (!m) return null;
  const min = parseInt(m[1], 10);
  const max = m[2] ? parseInt(m[2], 10) : min;
  return { min, max };
}

const KATEGORIE_ICONS: Record<string, string> = {
  Heizung: "🔥",
  "Wasser/Sanitär": "💧",
  Schimmel: "🦠",
  Lärm: "🔊",
  "Fenster/Türen": "🪟",
  Elektrik: "⚡",
  Ungeziefer: "🐀",
  Sonstiges: "📄",
};

export function iconForKategorie(kategorie: string): string {
  return KATEGORIE_ICONS[kategorie] ?? "📄";
}
