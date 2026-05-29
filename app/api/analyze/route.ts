import { NextRequest, NextResponse } from "next/server";
import { analyze } from "@/lib/analyze";
import { seal } from "@/lib/seal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // sec

/**
 * Bezahl-Schutz: Wir liefern nur die GRATIS-Felder im Klartext aus
 * (Kategorie, Klausel-Typ, Status, Zitat). Die bezahlpflichtigen Felder
 * (Erklaerung, Rechtsfolge, Handlungsempfehlung, Rechtsgrundlage,
 * Leitentscheidungen) werden verschluesselt (`sealed`) plus `analysisId`
 * uebergeben und erst von /api/unlock nach Zahlung entschluesselt.
 */
type PaidClause = {
  erklaerung: string;
  rechtsgrundlage?: string;
  rechtsfolge?: string;
  leitentscheidungen?: { gericht: string; aktenzeichen: string; kernaussage?: string }[];
  handlungsempfehlung?: string;
};

type FreeClause = {
  idx: number;
  id: string;
  kategorie?: string;
  klausel_typ?: string;
  status: "unwirksam" | "wirksam" | "unklar" | "nicht_gefunden";
  zitat: string;
  hasDetails: boolean;
};

type AnalyzeError = { ok: false; error: string };
type AnalyzeOk = {
  ok: true;
  klauseln: FreeClause[];
  zusammenfassung: Awaited<ReturnType<typeof analyze>>["zusammenfassung"];
  meta: Awaited<ReturnType<typeof analyze>>["meta"];
  analysisId: string;
  sealed: string;
};

const MAX_TEXT_CHARS = 200_000;

export async function POST(req: NextRequest): Promise<NextResponse<AnalyzeOk | AnalyzeError>> {
  let body: { text?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body ist kein gueltiges JSON." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json({ ok: false, error: "Kein 'text'-Feld im Body." }, { status: 400 });
  }
  if (text.length > MAX_TEXT_CHARS) {
    return NextResponse.json(
      { ok: false, error: `Text zu lang (${text.length} Zeichen, max ${MAX_TEXT_CHARS}).` },
      { status: 413 },
    );
  }

  try {
    const result = await analyze(text);

    // ─── Gratis-/Bezahl-Felder trennen ───
    const paid: PaidClause[] = [];
    const klauseln: FreeClause[] = result.klauseln.map((c, idx) => {
      paid[idx] = {
        erklaerung: c.erklaerung,
        rechtsgrundlage: c.rechtsgrundlage,
        rechtsfolge: c.rechtsfolge,
        leitentscheidungen: c.leitentscheidungen,
        handlungsempfehlung: c.handlungsempfehlung,
      };
      const hasDetails = !!(
        c.erklaerung ||
        c.rechtsfolge ||
        c.handlungsempfehlung ||
        c.rechtsgrundlage ||
        (c.leitentscheidungen && c.leitentscheidungen.length)
      );
      return {
        idx,
        id: c.id,
        kategorie: c.kategorie,
        klausel_typ: c.klausel_typ,
        status: c.status,
        zitat: c.zitat,
        hasDetails,
      };
    });

    // ─── Bezahl-Felder versiegeln ───
    const { analysisId, sealed } = seal(paid);

    return NextResponse.json({
      ok: true,
      klauseln,
      zusammenfassung: result.zusammenfassung,
      meta: result.meta,
      analysisId,
      sealed,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler.";
    console.error("[analyze] Fehler:", err);
    return NextResponse.json({ ok: false, error: `Analyse fehlgeschlagen: ${msg}` }, { status: 500 });
  }
}
