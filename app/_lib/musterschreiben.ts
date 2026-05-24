/**
 * Server-side Helper fuer das Musterschreiben-Feature.
 *
 * 5 kuratierte Vorlagen (Maengelanzeige, Ruege Mietpreisbremse,
 * Widerspruch Nebenkostenabrechnung, Kautionsrueckforderung,
 * Haertefallwiderspruch). Platzhalter [xxx] werden zur Laufzeit
 * client-seitig durch User-Eingaben ersetzt.
 */

import websiteDb from "../../data/website_db.json";

export type Vorlage = {
  id: string;
  titel: string;
  vorlage: string;
  norm: string[];
  hinweis: string;
};

type WebsiteDb = {
  musterschreiben: {
    anleitung: string;
    vorlagen: Vorlage[];
  };
};

const db = websiteDb as unknown as WebsiteDb;

export const MS_ANLEITUNG = db.musterschreiben.anleitung;

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

const VORLAGEN_WITH_SLUGS = db.musterschreiben.vorlagen.map((v) => ({
  ...v,
  slug: slugify(v.titel),
}));

const BY_SLUG = new Map(VORLAGEN_WITH_SLUGS.map((v) => [v.slug, v]));

export type VorlageWithSlug = Vorlage & { slug: string };

export function allVorlagen(): VorlageWithSlug[] {
  return VORLAGEN_WITH_SLUGS;
}

export function getVorlageBySlug(slug: string): VorlageWithSlug | undefined {
  return BY_SLUG.get(slug);
}

export function allVorlagenSlugs(): string[] {
  return VORLAGEN_WITH_SLUGS.map((v) => v.slug);
}

/**
 * Extrahiert alle Platzhalter [xyz] aus einer Vorlage. Reihenfolge
 * beibehalten, Duplikate entfernen.
 *
 * Lange Platzhalter (mit Komma / Anweisungstext) sollen als Textarea
 * dargestellt werden — wir markieren das ueber den `multiline`-Flag.
 */
export type Platzhalter = { key: string; label: string; hint?: string; multiline: boolean };

export function extractPlatzhalter(vorlage: string): Platzhalter[] {
  const found: Platzhalter[] = [];
  const seen = new Set<string>();
  const re = /\[([^\]]+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(vorlage)) !== null) {
    const full = m[1].trim();
    if (seen.has(full)) continue;
    seen.add(full);

    // Kommagetrennt: Erstes Wort ist das Label, Rest Hint
    const parts = full.split(",").map((p) => p.trim());
    const label = parts[0];
    const hint = parts.length > 1 ? parts.slice(1).join(", ") : undefined;
    // Heuristik: Platzhalter mit Komma oder "Beschreibung"/"Detaillierte"/laenger 20 Zeichen → Textarea
    const multiline = parts.length > 1 || /beschreibung|detailliert/i.test(label) || label.length > 25;

    found.push({ key: full, label, hint, multiline });
  }
  return found;
}

/**
 * Ersetzt Platzhalter durch User-Werte. Wenn ein Wert leer ist,
 * bleibt der originale Platzhalter im Text — so sieht der Nutzer
 * im Preview, was er noch ausfuellen muss.
 */
export function renderTemplate(vorlage: string, values: Record<string, string>): string {
  return vorlage.replace(/\[([^\]]+)\]/g, (full, inner) => {
    const v = values[inner.trim()];
    return v && v.trim() ? v : full;
  });
}
