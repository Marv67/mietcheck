/**
 * Server-side Helper fuer die Klausel-Routen (/klauseln, /klauseln/[slug]).
 * Reusst die bereits vorhandene Lookup-Infrastruktur aus lib/clauses-index.ts.
 *
 * Slug-Konvention: lowercase Katalog-ID, z.B. "SR-001" -> "sr-001".
 * Kurze, eindeutige URL. SEO-TODO: spaeter zu sprechenden URLs migrieren
 * (z.B. /klauseln/schoenheitsreparaturen-starre-fristen-sr-001) und
 * 301-Redirect von den aktuellen ID-URLs einrichten.
 */

import { allClauseIds, lookupClause, type FullClause } from "@/lib/clauses-index";

export type ClauseRecord = (FullClause & { kategorie: string }) | undefined;

export function clauseSlug(id: string): string {
  return id.toLowerCase();
}

export function slugToId(slug: string): string {
  return slug.toUpperCase();
}

export function getClauseBySlug(slug: string): ClauseRecord {
  return lookupClause(slugToId(slug));
}

export function allClauseSlugs(): string[] {
  return allClauseIds().map(clauseSlug);
}

/**
 * Alle Klauseln, gruppiert nach Kategorie, in Original-DB-Reihenfolge.
 * Wird sowohl von der Uebersichts-Seite als auch von Detail-Seiten
 * (fuer "verwandte Klauseln") genutzt.
 */
export function allClausesByCategory(): { kategorie: string; klauseln: (FullClause & { kategorie: string })[] }[] {
  const ids = allClauseIds();
  const map = new Map<string, (FullClause & { kategorie: string })[]>();
  for (const id of ids) {
    const c = lookupClause(id);
    if (!c) continue;
    if (!map.has(c.kategorie)) map.set(c.kategorie, []);
    map.get(c.kategorie)!.push(c);
  }
  return Array.from(map.entries()).map(([kategorie, klauseln]) => ({ kategorie, klauseln }));
}

export function statusLabel(status: string): { label: string; tone: "ok" | "warn" | "bad" | "unknown" } {
  if (status === "unzulässig" || status === "unzulaessig") return { label: "Unwirksam", tone: "bad" };
  if (status === "zulässig" || status === "zulaessig") return { label: "Wirksam", tone: "ok" };
  if (status === "bedingt_zulässig" || status === "bedingt_zulaessig") return { label: "Bedingt wirksam", tone: "warn" };
  return { label: status, tone: "unknown" };
}
