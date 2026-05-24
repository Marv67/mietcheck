/**
 * Kompakter Klausel-Index fuer die LLM-Analyse.
 *
 * Der LLM bekommt im System-Prompt nur eine Kurzfassung (eine Zeile pro Klausel)
 * — Status, Pattern, BGH-Az + Norm — und gibt im Output Klausel-IDs zurueck.
 * Serverseitig reichern wir die IDs aus der vollen DB an (rechtsfolge,
 * handlungsempfehlung, alle leitentscheidungen) bevor wir an den Client liefern.
 */

import klauselDb from "../data/klausel_db.json";

export type Leitentscheidung = {
  gericht: string;
  aktenzeichen: string;
  datum?: string;
  kernaussage?: string;
};

export type FullClause = {
  id: string;
  klausel_typ: string;
  beschreibung?: string;
  typische_formulierung?: string;
  status: string;
  norm?: string[];
  rechtsfolge?: string;
  leitentscheidungen?: Leitentscheidung[];
  handlungsempfehlung?: string;
};

export type Category = {
  kategorie_id: string;
  kategorie_name: string;
  beschreibung?: string;
  gesetzliche_grundlage?: string;
  klauseln: FullClause[];
};

type Db = { kategorien: Category[]; meta?: unknown };

const db = klauselDb as Db;

// Flatten + Index
const FLAT: Array<FullClause & { kategorie: string }> = [];
const BY_ID = new Map<string, FullClause & { kategorie: string }>();

for (const k of db.kategorien) {
  for (const cl of k.klauseln) {
    const entry = { ...cl, kategorie: k.kategorie_name };
    FLAT.push(entry);
    BY_ID.set(cl.id, entry);
  }
}

export function lookupClause(id: string): (FullClause & { kategorie: string }) | undefined {
  return BY_ID.get(id);
}

export function allClauseIds(): string[] {
  return Array.from(BY_ID.keys());
}

export function countClauses(): { categories: number; clauses: number } {
  return { categories: db.kategorien.length, clauses: FLAT.length };
}

/**
 * Erzeugt den kompakten Katalog-String, der dem LLM im System-Prompt
 * uebergeben wird. Eine Zeile pro Klausel — Pipe-getrennt.
 */
export function buildCompactCatalog(): string {
  const lines: string[] = ["# KLAUSEL-KATALOG (eine Zeile pro Eintrag, Pipe-getrennt)", ""];
  lines.push("ID | KATEGORIE | KLAUSEL_TYP | STATUS | LEIT-AZ | NORM | TYPISCHE FORMULIERUNG");
  lines.push("-".repeat(80));

  for (const c of FLAT) {
    const az = c.leitentscheidungen?.[0]?.aktenzeichen
      ? `${c.leitentscheidungen[0].gericht} ${c.leitentscheidungen[0].aktenzeichen}`
      : "—";
    const norm = c.norm?.[0] ?? "—";
    const typ = (c.typische_formulierung ?? c.beschreibung ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 220);
    lines.push([c.id, c.kategorie, c.klausel_typ, c.status, az, norm, typ].join(" | "));
  }

  return lines.join("\n");
}

let _catalogCache: string | null = null;
export function compactCatalog(): string {
  if (_catalogCache === null) _catalogCache = buildCompactCatalog();
  return _catalogCache;
}

/**
 * Kuratierte Liste der Top-Klausel-IDs nach praktischer Haeufigkeit.
 * Diese werden dem LLM als Quick-Reference "Pattern -> ID" gezeigt,
 * damit haeufige Vertragsformulierungen direkt gematcht werden statt
 * im 260-Eintraege-Katalog manuell zu suchen.
 */
const PATTERN_TARGETS = [
  "SR-001", "SR-002", "SR-003", "SR-004", "SR-005", "SR-006",
  "KR-001", "KR-002", "KR-003",
  "KA-001", "KA-002", "KA-003", "KA-004",
  "KF-001", "KF-002", "KF-003",
  "BK-001", "BK-002", "BK-003",
  "UV-001", "TH-001", "TH-002",
  "BR-001", "SF-001",
  "HA-001", "HA-002", "HA-003",
  "IN-001", "IN-002", "IN-003",
  "HO-001", "HO-002", "HO-003",
  "MZ-001", "MZ-002", "MZ-003",
  "SL-001", "SL-002", "SL-003",
  "RG-001", "RG-002",
  "MV-001", "MV-002",
  "WF-001",
  "SO-001", "SO-002", "SO-003",
];

let _patternCache: string | null = null;
export function patternExamples(): string {
  if (_patternCache !== null) return _patternCache;
  const lines: string[] = [];
  for (const id of PATTERN_TARGETS) {
    const c = BY_ID.get(id);
    if (!c) continue;
    const formul = (c.typische_formulierung ?? c.beschreibung ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 140);
    if (!formul) continue;
    lines.push(`${id} (${c.klausel_typ ?? "?"}) ← „${formul}“`);
  }
  _patternCache = lines.join("\n");
  return _patternCache;
}
