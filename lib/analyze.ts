/**
 * MietCheck-Analyse:
 *  - Pass 1: vollstaendige Klausel-Identifikation + Best-Effort-Katalog-Match
 *            via Anthropic Tool-Use (strukturierte Ausgabe, kein JSON-Parsing)
 *  - Pass 2: fokussiertes Retry fuer alle "nicht_gefunden"-Klauseln aus Pass 1
 *  - Enrichment: Katalog-IDs -> volle DB-Daten (Rechtsfolge, Leitentscheidungen,
 *    Handlungsempfehlung) bevor an den Client geliefert wird.
 */

import Anthropic from "@anthropic-ai/sdk";
import { compactCatalog, lookupClause, countClauses, patternExamples } from "./clauses-index";

export type ClauseStatus = "unwirksam" | "wirksam" | "unklar" | "nicht_gefunden";

export type AnalyzedClause = {
  id: string;
  kategorie?: string;
  klausel_typ?: string;
  status: ClauseStatus;
  zitat: string;
  erklaerung: string;
  rechtsgrundlage?: string;
  rechtsfolge?: string;
  leitentscheidungen?: { gericht: string; aktenzeichen: string; kernaussage?: string }[];
  handlungsempfehlung?: string;
};

export type AnalysisResult = {
  klauseln: AnalyzedClause[];
  zusammenfassung: {
    gesamt: number;
    unwirksam: number;
    wirksam: number;
    unklar: number;
    risiko: "niedrig" | "mittel" | "hoch";
    bewertung: string;
  };
  meta: {
    model: string;
    mock: boolean;
    passes: number;
    pass2_recovered?: number;
    input_chars: number;
    input_tokens?: number;
    output_tokens?: number;
    cache_read?: number;
    cache_write?: number;
  };
};

// ─────────────────────────────────────────────────────────────────────────
// Tool-Schemata (forciert strukturierte Ausgabe)
// ─────────────────────────────────────────────────────────────────────────

const ANALYSE_TOOL = {
  name: "submit_mietvertrag_analyse",
  description:
    "Uebergibt die strukturierte Analyse-Ausgabe fuer den geprueften Mietvertrag. Genau einmal aufrufen mit dem vollstaendigen Ergebnis.",
  input_schema: {
    type: "object" as const,
    required: ["klauseln", "zusammenfassung"],
    properties: {
      klauseln: {
        type: "array",
        description: "Liste aller im Vertrag identifizierten Klauseln, in der Reihenfolge ihres Auftretens im Vertragstext.",
        items: {
          type: "object",
          required: ["id", "status", "zitat", "erklaerung"],
          properties: {
            id: {
              type: "string",
              description:
                "Katalog-ID (z.B. 'SR-001') oder leerer String wenn status='nicht_gefunden'. Niemals erfundene IDs.",
            },
            status: {
              type: "string",
              enum: ["unwirksam", "wirksam", "unklar", "nicht_gefunden"],
            },
            zitat: {
              type: "string",
              description: "Exakter Wortlaut der Klausel aus dem Vertrag, max. 400 Zeichen.",
            },
            erklaerung: {
              type: "string",
              description: "1-3 Saetze in einfacher Sprache: warum dieser Status, mit Bezug zum Vertragstext.",
            },
          },
        },
      },
      zusammenfassung: {
        type: "object",
        required: ["risiko", "bewertung"],
        properties: {
          risiko: { type: "string", enum: ["niedrig", "mittel", "hoch"] },
          bewertung: {
            type: "string",
            description: "2-3 Saetze Gesamteinschaetzung: groesste Probleme + ggf. Handlungsempfehlung allgemeiner Natur.",
          },
        },
      },
    },
  },
};

const RECHECK_TOOL = {
  name: "submit_recheck_results",
  description:
    "Uebergibt die Re-Pruefungsergebnisse fuer zuvor 'nicht_gefunden'-Klauseln. Genau einmal aufrufen mit dem Array.",
  input_schema: {
    type: "object" as const,
    required: ["matches"],
    properties: {
      matches: {
        type: "array",
        description: "Pro Eingabeklausel ein Match-Resultat in derselben Reihenfolge.",
        items: {
          type: "object",
          required: ["index", "id", "status"],
          properties: {
            index: { type: "integer", description: "0-basierter Index der Eingabeklausel." },
            id: {
              type: "string",
              description: "Katalog-ID falls jetzt gefunden, sonst leerer String.",
            },
            status: {
              type: "string",
              enum: ["unwirksam", "wirksam", "unklar", "nicht_gefunden"],
            },
            erklaerung: {
              type: "string",
              description: "Optional: aktualisierte Erklaerung falls Match gefunden.",
            },
          },
        },
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────
// System-Prompts (statisch -> caching-faehig)
// ─────────────────────────────────────────────────────────────────────────

function buildPass1SystemPrompt(): string {
  const { categories, clauses } = countClauses();
  return `Du bist MietCheck, ein rechtlicher Analyse-Assistent fuer deutsche Wohnraummietvertraege (§§ 535 ff. BGB).

KERNREGELN
1. Du analysierst ausschliesslich Klauseln aus deutschen Wohnraummietvertraegen.
2. Jede Bewertung MUSS auf einen Eintrag im untenstehenden KLAUSEL-KATALOG zurueckfuehrbar sein.
3. Du bist kein Anwalt. Dies ist eine automatisierte Ersteinschaetzung, keine Rechtsberatung im Sinne des RDG.
4. Sprache: Deutsch. Sachlich, praezise, ohne Floskeln. Kein Marketing-Speak. Keine Emojis.

VOLLSTAENDIGKEITS-PFLICHT — ZWINGEND
Das ist die wichtigste Regel. Du MUSST den Vertrag systematisch von oben nach unten Wort fuer Wort lesen und JEDE einzelne Regelung als eigene Klausel im Output abbilden:

a) Gehe den Vertrag absatzweise / nummerierungsweise durch (z.B. § 1, § 2, … oder Punkt 1, 2, 3, …). Springe NICHTS.
b) Innerhalb eines Paragrafen koennen MEHRERE Regelungsgegenstaende stecken (z.B. Punkt 2 enthaelt 2a Kautionshoehe + 2b Einzugsermaechtigung + 2c Faelligkeit) — jeder Regelungsgegenstand wird zu einer EIGENEN Klausel.
c) Auch Regelungen, die unauffaellig wirken (Schriftform, Hausordnung-Verweis, Meldepflicht, Ansprechpartner, Pauschal-Verweise), MUESSEN als Klausel auftauchen — wenn dazu kein Katalog-Eintrag passt, status = "nicht_gefunden" mit klarer Erklaerung.
d) Wirksame, gesetzeskonforme Klauseln (z.B. korrekte Kuendigungsfrist, korrekter Kautionsbetrag) werden ebenfalls als eigene Klausel ausgewiesen mit status = "wirksam".
e) Reine Identifikationsangaben (Vertragsparteien, Adresse, Mietbeginn ohne Sondervereinbarung) sind KEINE Klauseln und werden weggelassen.

SUCH-PFLICHT VOR "NICHT_GEFUNDEN"
"nicht_gefunden" ist die ABSOLUTE AUSNAHME. Bevor du diesen Status waehlst:

a) Pruefe den vollstaendigen Katalog auf INHALTLICHE Aehnlichkeit (nicht nur Wortgleichheit). Eine Untervermietungsklausel ist IMMER UV-*, auch wenn der Vertrag "Gebrauchsueberlassung an Dritte" statt "Untervermietung" formuliert. Eine Endrenovierungsklausel ist IMMER SR-*, auch wenn der Vertrag "Schoenheitsreparaturen erfolgen durch den Vermieter auf Kosten des Mieters" tarnt.
b) Gehe gedanklich diese Hauptkategorien durch und ueberlege, ob eine passt:
  SR Schoenheitsreparaturen · KR Kleinreparaturen · KA Kaution · KF Kuendigung · BK Betriebskosten · ME Mieterhoehung · UV Untervermietung · TH Tierhaltung · BR Besichtigung · SF Schriftform · HA Haftung · IN Instandhaltung · HO Hausordnung · MZ Mietzahlung · SL Schluessel · RG Rueckgabe · MV Moeblierte Vermietung · WF Wohnflaeche · MO Modernisierung · SO Sonstige · DA Datenschutz · VS Vertragsstrafen · IA Individual-vs-AGB
c) Erwartungswert: In einem typischen Wohnraummietvertrag lassen sich ~60-80% der Klauseln einem Katalog-Eintrag zuordnen. Wenn deine nicht_gefunden-Quote >40% ist, hast du nicht gruendlich genug gesucht.

ID-INTEGRITAET
- Wenn status "unwirksam"/"wirksam"/"unklar": id MUSS eine reale Katalog-ID sein. Keine erfundenen IDs.
- Wenn status "nicht_gefunden": id = "".

STATUS-MAPPING
- Katalog-Status "unzulaessig" -> "unwirksam".
- Katalog-Status "zulaessig" -> "wirksam".
- Katalog-Status "bedingt_zulaessig" -> "wirksam" wenn der Vertragstext die zulaessigen Bedingungen erfuellt, sonst "unklar".

MUSTER-ZUORDNUNGEN (haeufige Vertragsformulierungen -> Katalog-ID)
${patternExamples()}

VOR DEM TOOL-CALL: SELBSTPRUEFUNG
1. Habe ich JEDEN nummerierten Punkt / Paragrafen abgedeckt?
2. Habe ich Teilregelungen aufgesplittet?
3. Habe ich Sonderregelungen (Schriftform, Hausordnung-Verweis, Salvatorische Klausel, Datenschutz, Meldepflicht, etc.) erfasst?
4. Hat JEDE Klausel mit Status != "nicht_gefunden" eine reale Katalog-ID?
5. Liegt meine nicht_gefunden-Quote unter 40%?

KATALOG-UMFANG: ${categories} Kategorien, ${clauses} Klauseln.

${compactCatalog()}`;
}

function buildPass2SystemPrompt(): string {
  return `Du bist MietCheck, ein rechtlicher Analyse-Assistent.

AUFGABE: Du erhaeltst eine Liste von Vertragsklauseln, die in einem ersten Durchlauf NICHT eindeutig einem Katalog-Eintrag zugeordnet werden konnten. Pruefe JEDE Klausel jetzt mit erhoehter Sorgfalt erneut gegen den vollstaendigen Katalog.

REGELN
1. Gehe pro Klausel den vollstaendigen Katalog noch einmal durch — insbesondere die Kategorien, die du beim ersten Mal vielleicht uebersprungen hast.
2. Vergleiche INHALTLICH, nicht nur lexikalisch. Eine Klausel, die wirtschaftlich dasselbe bewirkt wie ein Katalog-Eintrag, ist ein Match.
3. Wenn ein passender Eintrag existiert, setze id = <Katalog-ID> und status nach Katalog-Status-Mapping.
4. Findest du wirklich keinen Match, behalte status = "nicht_gefunden" und id = "".
5. Erfinde NIEMALS IDs.

STATUS-MAPPING
- Katalog "unzulaessig" -> "unwirksam"
- Katalog "zulaessig" -> "wirksam"
- Katalog "bedingt_zulaessig" -> "wirksam" wenn Bedingungen erfuellt, sonst "unklar"

MUSTER-ZUORDNUNGEN
${patternExamples()}

KATALOG:

${compactCatalog()}`;
}

let _pass1SystemCache: string | null = null;
let _pass2SystemCache: string | null = null;
function pass1SystemPrompt(): string {
  if (_pass1SystemCache === null) _pass1SystemCache = buildPass1SystemPrompt();
  return _pass1SystemCache;
}
function pass2SystemPrompt(): string {
  if (_pass2SystemCache === null) _pass2SystemCache = buildPass2SystemPrompt();
  return _pass2SystemCache;
}

// ─────────────────────────────────────────────────────────────────────────
// Enrichment
// ─────────────────────────────────────────────────────────────────────────

function enrichClause(c: { id: string; status: ClauseStatus; zitat: string; erklaerung: string }): AnalyzedClause {
  const full = c.id ? lookupClause(c.id) : undefined;
  if (!full) {
    return { id: c.id || "", status: c.status, zitat: c.zitat, erklaerung: c.erklaerung };
  }
  return {
    id: c.id,
    status: c.status,
    zitat: c.zitat,
    erklaerung: c.erklaerung,
    kategorie: full.kategorie,
    klausel_typ: full.klausel_typ,
    rechtsgrundlage: full.norm?.join(", "),
    rechtsfolge: full.rechtsfolge,
    leitentscheidungen: full.leitentscheidungen?.slice(0, 2).map((l) => ({
      gericht: l.gericht,
      aktenzeichen: l.aktenzeichen,
      kernaussage: l.kernaussage,
    })),
    handlungsempfehlung: full.handlungsempfehlung,
  };
}

function normalizeStatus(s: unknown): ClauseStatus {
  return s === "unwirksam" || s === "wirksam" || s === "unklar" || s === "nicht_gefunden"
    ? s
    : "unklar";
}

function validateId(id: unknown, status: ClauseStatus): { id: string; status: ClauseStatus } {
  const sid = typeof id === "string" ? id.trim() : "";
  if (status !== "nicht_gefunden") {
    if (!sid || !lookupClause(sid)) {
      return { id: "", status: "nicht_gefunden" };
    }
  }
  return { id: sid, status };
}

// ─────────────────────────────────────────────────────────────────────────
// Mock-Modus (kein API-Key)
// ─────────────────────────────────────────────────────────────────────────

function mockAnalysis(text: string): AnalysisResult {
  const found: { id: string; status: ClauseStatus; zitat: string; erklaerung: string }[] = [];

  const patterns: Array<{ id: string; re: RegExp; status: ClauseStatus; erklaerung: string }> = [
    { id: "SR-001", re: /alle\s*\d+\s*(jahr|jahren).*sch[oö]nheitsreparatur|sch[oö]nheitsreparatur.*alle\s*\d+\s*(jahr|jahren)/i, status: "unwirksam", erklaerung: "Starrer Renovierungs-Fristenplan ohne Flexibilitaetsklausel — nach staendiger BGH-Rechtsprechung unwirksam." },
    { id: "SR-002", re: /(bei|zur)\s+(beendigung|auszug).*(renoviert|streichen|gestrichen)/i, status: "unwirksam", erklaerung: "Pauschale Endrenovierungsklausel benachteiligt den Mieter unangemessen." },
    { id: "KR-001", re: /kleinreparatur/i, status: "unklar", erklaerung: "Kleinreparaturklausel gefunden — pruefe Einzel- und Jahresobergrenze." },
    { id: "TH-001", re: /(tierhaltung|haustier).*(verbot|untersagt|nicht gestattet)/i, status: "unwirksam", erklaerung: "Pauschales Tierhaltungsverbot ohne Einzelfallpruefung ist unwirksam." },
    { id: "KA-001", re: /kaution.*(vier|fuenf|4|5)\s*(monat|nettokalt)/i, status: "unwirksam", erklaerung: "Kaution darf gesetzlich maximal drei Nettokaltmieten betragen." },
  ];

  for (const p of patterns) {
    const m = text.match(p.re);
    if (m) {
      const start = Math.max(0, m.index! - 50);
      const end = Math.min(text.length, m.index! + (m[0]?.length ?? 0) + 150);
      const zitat = text.slice(start, end).replace(/\s+/g, " ").trim();
      found.push({ id: p.id, status: p.status, zitat: zitat.slice(0, 400), erklaerung: p.erklaerung });
    }
  }

  if (found.length === 0) {
    found.push({
      id: "",
      status: "nicht_gefunden",
      zitat: text.slice(0, 200).replace(/\s+/g, " ").trim(),
      erklaerung: "Im Mock-Modus konnte keine bekannte Klausel automatisch erkannt werden. Setze ANTHROPIC_API_KEY in .env.local fuer echte Analyse.",
    });
  }

  const klauseln = found.map(enrichClause);
  const unwirksam = klauseln.filter((c) => c.status === "unwirksam").length;
  const wirksam = klauseln.filter((c) => c.status === "wirksam").length;
  const unklar = klauseln.filter((c) => c.status === "unklar").length;

  return {
    klauseln,
    zusammenfassung: {
      gesamt: klauseln.length,
      unwirksam,
      wirksam,
      unklar,
      risiko: unwirksam >= 3 ? "hoch" : unwirksam >= 1 ? "mittel" : "niedrig",
      bewertung: "Mock-Analyse ohne LLM. Fuer eine vollwertige Pruefung setze ANTHROPIC_API_KEY in .env.local.",
    },
    meta: { model: "mock", mock: true, passes: 0, input_chars: text.length },
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Hauptanalyse (Pass 1 + optional Pass 2)
// ─────────────────────────────────────────────────────────────────────────

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";

type Pass1Input = { id?: unknown; status?: unknown; zitat?: unknown; erklaerung?: unknown };
type Pass2Match = { index?: unknown; id?: unknown; status?: unknown; erklaerung?: unknown };

function extractToolUse<T>(content: Anthropic.Messages.ContentBlock[], toolName: string): T | null {
  for (const block of content) {
    if (block.type === "tool_use" && block.name === toolName) {
      return block.input as T;
    }
  }
  return null;
}

async function runPass1(
  client: Anthropic,
  text: string,
): Promise<{
  klauseln: AnalyzedClause[];
  risiko: AnalysisResult["zusammenfassung"]["risiko"];
  bewertung: string;
  usage: Anthropic.Messages.Message["usage"];
}> {
  const MAX_INPUT_CHARS = 100_000;
  const userText = text.length > MAX_INPUT_CHARS ? text.slice(0, MAX_INPUT_CHARS) + "\n\n[…Text wegen Laenge gekuerzt…]" : text;

  // Tool-Call zwingend (forciert via tool_choice). Thinking inkompatibel mit
  // forced tool_use, also deaktiviert. Statt Thinking erzwingen wir die
  // systematische Durchsicht ueber den verschaerften System-Prompt.
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16_000,
    temperature: 0,
    system: [{ type: "text", text: pass1SystemPrompt(), cache_control: { type: "ephemeral" } }],
    tools: [ANALYSE_TOOL],
    tool_choice: { type: "tool", name: ANALYSE_TOOL.name },
    messages: [
      {
        role: "user",
        content: `Hier der zu pruefende Mietvertragstext:\n\n---\n${userText}\n---\n\nAufgabe:
1. Lies den Vertrag absatzweise / nummerierungsweise systematisch durch.
2. Identifiziere JEDE einzelne Regelung — auch unscheinbare (Schriftform, Hausordnung-Verweis, Meldepflicht, Salvatorische, Datenschutz, Zustaendigkeiten).
3. Pruefe pro Regelung den vollstaendigen Katalog, nicht nur die offensichtlichen Kandidaten.

ZWINGEND: Du MUSST das Tool 'submit_mietvertrag_analyse' aufrufen — gib das Ergebnis ausschliesslich ueber den Tool-Call aus, NICHT als freier Text. Genau ein Tool-Call, mit dem vollstaendigen Ergebnis (alle Klauseln + Zusammenfassung).`,
      },
    ],
  });

  const toolInput = extractToolUse<{
    klauseln?: Pass1Input[];
    zusammenfassung?: { risiko?: string; bewertung?: string };
  }>(response.content, ANALYSE_TOOL.name);

  if (!toolInput) {
    throw new Error("LLM hat das Analyse-Tool nicht aufgerufen.");
  }

  const klauselnIn = Array.isArray(toolInput.klauseln) ? toolInput.klauseln : [];
  const klauseln: AnalyzedClause[] = klauselnIn.map((c) => {
    const status0 = normalizeStatus(c.status);
    const { id, status } = validateId(c.id, status0);
    return enrichClause({
      id,
      status,
      zitat: typeof c.zitat === "string" ? c.zitat : "",
      erklaerung: typeof c.erklaerung === "string" ? c.erklaerung : "",
    });
  });

  const risiko: AnalysisResult["zusammenfassung"]["risiko"] =
    toolInput.zusammenfassung?.risiko === "niedrig" ||
    toolInput.zusammenfassung?.risiko === "mittel" ||
    toolInput.zusammenfassung?.risiko === "hoch"
      ? toolInput.zusammenfassung.risiko
      : "mittel";

  return {
    klauseln,
    risiko,
    bewertung: typeof toolInput.zusammenfassung?.bewertung === "string" ? toolInput.zusammenfassung.bewertung : "",
    usage: response.usage,
  };
}

async function runPass2(
  client: Anthropic,
  unmatched: { index: number; zitat: string; erklaerung: string }[],
): Promise<{
  updates: Map<number, { id: string; status: ClauseStatus; erklaerung?: string }>;
  usage: Anthropic.Messages.Message["usage"];
}> {
  const listing = unmatched
    .map((u) => `[Index ${u.index}] Zitat: "${u.zitat.replace(/\s+/g, " ").slice(0, 300)}"\n  Bisherige Erklaerung: ${u.erklaerung.slice(0, 200)}`)
    .join("\n\n");

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    temperature: 0,
    system: [{ type: "text", text: pass2SystemPrompt(), cache_control: { type: "ephemeral" } }],
    tools: [RECHECK_TOOL],
    tool_choice: { type: "tool", name: RECHECK_TOOL.name },
    messages: [
      {
        role: "user",
        content: `Folgende ${unmatched.length} Klauseln konnten im ersten Durchlauf nicht eindeutig einem Katalog-Eintrag zugeordnet werden. Pruefe jede gegen den vollstaendigen Katalog noch einmal mit erhoehter Sorgfalt.\n\n${listing}\n\nZWINGEND: Rufe das Tool 'submit_recheck_results' auf — pro Eingabeklausel ein Match-Resultat in derselben Reihenfolge.`,
      },
    ],
  });

  const toolInput = extractToolUse<{ matches?: Pass2Match[] }>(response.content, RECHECK_TOOL.name);
  const updates = new Map<number, { id: string; status: ClauseStatus; erklaerung?: string }>();
  if (!toolInput) return { updates, usage: response.usage };

  const matches = Array.isArray(toolInput.matches) ? toolInput.matches : [];
  for (const m of matches) {
    const idx = typeof m.index === "number" ? m.index : -1;
    if (idx < 0) continue;
    const status0 = normalizeStatus(m.status);
    const { id, status } = validateId(m.id, status0);
    if (status === "nicht_gefunden") continue; // nichts hat sich geaendert
    updates.set(idx, {
      id,
      status,
      erklaerung: typeof m.erklaerung === "string" ? m.erklaerung : undefined,
    });
  }
  return { updates, usage: response.usage };
}

export async function analyze(text: string): Promise<AnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return mockAnalysis(text);

  const client = new Anthropic({ apiKey });

  // ─── Pass 1: vollstaendige Identifikation + Best-Effort-Match ─────
  const pass1 = await runPass1(client, text);

  // ─── Pass 2: Retry fuer alle nicht_gefunden ───────────────────────
  const unmatched = pass1.klauseln
    .map((k, idx) => ({ idx, k }))
    .filter(({ k }) => k.status === "nicht_gefunden")
    .map(({ idx, k }) => ({ index: idx, zitat: k.zitat, erklaerung: k.erklaerung }));

  let passes = 1;
  let pass2Recovered = 0;
  let p2Usage: Anthropic.Messages.Message["usage"] | null = null;
  let finalKlauseln = pass1.klauseln;

  if (unmatched.length > 0) {
    passes = 2;
    const { updates, usage } = await runPass2(client, unmatched);
    p2Usage = usage;

    finalKlauseln = pass1.klauseln.map((k, idx) => {
      const upd = updates.get(idx);
      if (!upd) return k;
      pass2Recovered++;
      return enrichClause({
        id: upd.id,
        status: upd.status,
        zitat: k.zitat,
        erklaerung: upd.erklaerung || k.erklaerung,
      });
    });
  }

  // ─── Counts + Risiko-Override falls Pass 2 etwas verschoben hat ───
  const unwirksam = finalKlauseln.filter((c) => c.status === "unwirksam").length;
  const wirksam = finalKlauseln.filter((c) => c.status === "wirksam").length;
  const unklar = finalKlauseln.filter((c) => c.status === "unklar").length;

  // Token-Sammler ueber alle Passes
  const u1 = pass1.usage as unknown as {
    input_tokens?: number;
    output_tokens?: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
  const u2 = p2Usage as unknown as {
    input_tokens?: number;
    output_tokens?: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  } | null;

  return {
    klauseln: finalKlauseln,
    zusammenfassung: {
      gesamt: finalKlauseln.length,
      unwirksam,
      wirksam,
      unklar,
      risiko: pass1.risiko,
      bewertung: pass1.bewertung || `${unwirksam} unwirksame, ${wirksam} wirksame und ${unklar} unklare Klauseln identifiziert.`,
    },
    meta: {
      model: MODEL,
      mock: false,
      passes,
      pass2_recovered: pass2Recovered || undefined,
      input_chars: text.length,
      input_tokens: (u1.input_tokens ?? 0) + (u2?.input_tokens ?? 0),
      output_tokens: (u1.output_tokens ?? 0) + (u2?.output_tokens ?? 0),
      cache_write: (u1.cache_creation_input_tokens ?? 0) + (u2?.cache_creation_input_tokens ?? 0),
      cache_read: (u1.cache_read_input_tokens ?? 0) + (u2?.cache_read_input_tokens ?? 0),
    },
  };
}
