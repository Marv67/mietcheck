import { NextRequest, NextResponse } from "next/server";
import { analyze, type AnalysisResult } from "@/lib/analyze";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // sec

type AnalyzeError = { ok: false; error: string };
type AnalyzeOk = { ok: true } & AnalysisResult;

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
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler.";
    console.error("[analyze] Fehler:", err);
    return NextResponse.json({ ok: false, error: `Analyse fehlgeschlagen: ${msg}` }, { status: 500 });
  }
}
