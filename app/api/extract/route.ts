import { NextRequest, NextResponse } from "next/server";
import { PDFParse, PasswordException, InvalidPDFException } from "pdf-parse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

type ExtractResult = {
  ok: true;
  filename: string;
  pages: number;
  chars: number;
  text: string;
  info?: Record<string, unknown>;
};

type ExtractError = {
  ok: false;
  error: string;
  code: "no_file" | "wrong_type" | "too_large" | "empty" | "encrypted" | "parse_failed" | "empty_text";
};

export async function POST(req: NextRequest): Promise<NextResponse<ExtractResult | ExtractError>> {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, code: "no_file", error: "Konnte den Upload nicht lesen." }, { status: 400 });
  }

  const fileEntry = formData.get("file");
  if (!fileEntry || typeof fileEntry === "string") {
    return NextResponse.json({ ok: false, code: "no_file", error: "Keine Datei gefunden. Bitte lade ein PDF hoch." }, { status: 400 });
  }

  const file = fileEntry as File;

  // Some browsers report no type for drag-and-drop — accept .pdf endings too
  const lowerName = (file.name || "").toLowerCase();
  const isPdf = file.type === "application/pdf" || lowerName.endsWith(".pdf");
  if (!isPdf) {
    return NextResponse.json({ ok: false, code: "wrong_type", error: "Nur PDF-Dateien werden unterstützt." }, { status: 415 });
  }

  if (file.size === 0) {
    return NextResponse.json({ ok: false, code: "empty", error: "Die Datei ist leer." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      {
        ok: false,
        code: "too_large",
        error: `Datei ist zu groß (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum: ${MAX_BYTES / 1024 / 1024} MB.`,
      },
      { status: 413 },
    );
  }

  const data = new Uint8Array(await file.arrayBuffer());

  const parser = new PDFParse({ data });
  try {
    // Sequenziell, weil pdf-parse den Uint8Array beim ersten Aufruf in den Worker transferiert.
    const infoResult = await parser.getInfo();
    const textResult = await parser.getText();
    const text = (textResult.text || "").trim();

    if (text.length === 0) {
      // Likely a scanned/image-only PDF without OCR
      return NextResponse.json(
        {
          ok: false,
          code: "empty_text",
          error:
            "Aus dem PDF konnte kein Text extrahiert werden. Wahrscheinlich handelt es sich um ein gescanntes Bild-PDF. OCR ist in dieser Version noch nicht eingebaut.",
        },
        { status: 422 },
      );
    }

    return NextResponse.json({
      ok: true,
      filename: file.name,
      pages: textResult.total ?? textResult.pages.length,
      chars: text.length,
      text,
      info: (infoResult.info as Record<string, unknown>) ?? undefined,
    });
  } catch (err) {
    if (err instanceof PasswordException) {
      return NextResponse.json(
        { ok: false, code: "encrypted", error: "Das PDF ist passwortgeschützt. Bitte entferne den Schutz und versuche es erneut." },
        { status: 422 },
      );
    }
    if (err instanceof InvalidPDFException) {
      return NextResponse.json(
        { ok: false, code: "parse_failed", error: "Die Datei ist kein gültiges PDF." },
        { status: 422 },
      );
    }
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler beim Parsen.";
    return NextResponse.json(
      { ok: false, code: "parse_failed", error: `PDF konnte nicht gelesen werden: ${msg}` },
      { status: 422 },
    );
  } finally {
    await parser.destroy().catch(() => {});
  }
}
