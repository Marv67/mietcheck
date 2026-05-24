"use client";

/**
 * Client-Insel fuer den Upload-/Analyse-Flow.
 *
 * Paywall-Logik:
 *  - isPaid=false (Default): Klausel-Header + Zitat sichtbar;
 *    Erklaerung / Rechtsgrundlage / Handlungsempfehlung gelockt.
 *  - isPaid=true (Cookie mc_paid=1 vom Server gesetzt):
 *    Alle Details sichtbar.
 *
 * Stripe-Flow:
 *  1. handleCheckout() speichert Ergebnis in sessionStorage,
 *     ruft POST /api/checkout auf, leitet zu Stripe weiter.
 *  2. Nach Zahlung: Stripe → /api/payment-verify → setzt Cookie →
 *     Redirect zu /?paid=1.
 *  3. useEffect: isPaid=true + sessionStorage hat Daten → Ergebnis
 *     wird automatisch wiederhergestellt.
 */

import { useEffect, useRef, useState } from "react";

/* ───────── TYPEN ───────── */
type AnalysisStatus = "unwirksam" | "wirksam" | "unklar" | "nicht_gefunden";

type AnalyzedClause = {
  id: string;
  kategorie?: string;
  klausel_typ?: string;
  status: AnalysisStatus;
  zitat: string;
  erklaerung: string;
  rechtsgrundlage?: string;
  rechtsfolge?: string;
  leitentscheidungen?: { gericht: string; aktenzeichen: string; kernaussage?: string }[];
  handlungsempfehlung?: string;
};

type AnalysisData = {
  klauseln: AnalyzedClause[];
  zusammenfassung: {
    gesamt: number;
    unwirksam: number;
    wirksam: number;
    unklar: number;
    risiko: "niedrig" | "mittel" | "hoch";
    bewertung: string;
  };
  meta: { model: string; mock: boolean; passes?: number; pass2_recovered?: number; input_chars: number };
};

type StoredAnalysis = AnalysisData & { filename: string; pages: number; chars: number };

const STORAGE_KEY = "mc_analysis_v1";

/* ───────── HILFSFUNKTIONEN ───────── */
function iconForKategorie(kat?: string): string {
  if (!kat) return "Al";
  const k = kat.toLowerCase();
  if (/(reparatur|renovierung|schönheits|tapete|rückbau)/.test(k)) return "Re";
  if (/(kaution|nebenkosten|betriebs|miete|kosten|verwaltung|heiz|index|staffel|modernisierung)/.test(k)) return "Ko";
  if (/(kündigung|frist|räumung|eigenbedarf|verwertung)/.test(k)) return "Kü";
  if (/(tier|untervermietung|hausordnung|besichtigung|schlüssel|haftung)/.test(k)) return "Nu";
  if (/(wohnfläche|wohnung|stellplatz|garage|möblier|wg|barrierefrei)/.test(k)) return "Wo";
  return "Al";
}

function Badge({ status }: { status: string }) {
  const m =
    (
      {
        unwirksam: { bg: "#FEF2F2", fg: "#B91C1C", border: "#FECACA", label: "Unwirksam" },
        wirksam: { bg: "#F0FDF4", fg: "#15803D", border: "#BBF7D0", label: "Wirksam" },
        unklar: { bg: "#FFFBEB", fg: "#A16207", border: "#FDE68A", label: "Prüfung empfohlen" },
      } as Record<string, { bg: string; fg: string; border: string; label: string }>
    )[status] || { bg: "#F3F4F6", fg: "#6B7280", border: "#E5E7EB", label: status };
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: m.bg, color: m.fg, border: `1px solid ${m.border}`, letterSpacing: 0.2, whiteSpace: "nowrap" }}>
      {m.label}
    </span>
  );
}

/* ───────── RESULT CARD ───────── */
function ResultCard({ r, i, isPaid }: { r: AnalyzedClause; i: number; isPaid: boolean }) {
  const [open, setOpen] = useState(false);
  const title = r.klausel_typ || r.kategorie || "Klausel";

  const hasDetails = !!(r.erklaerung || r.rechtsfolge || r.handlungsempfehlung || r.rechtsgrundlage || r.leitentscheidungen?.length);

  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: "var(--card)",
        borderRadius: 12,
        border: "1px solid var(--line)",
        cursor: "pointer",
        transition: "box-shadow .15s",
        overflow: "hidden",
        animation: `fadeUp .45s ${i * 80}ms both`,
      }}
    >
      {/* ─── Kartenheader (immer sichtbar) ─── */}
      <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--blue)", background: "var(--blue-bg)", padding: "2px 6px", borderRadius: 4, letterSpacing: 0.3, fontFamily: "var(--mono)", flexShrink: 0 }} aria-hidden="true">{iconForKategorie(r.kategorie)}</span>
          <span style={{ fontSize: 14, fontWeight: 550, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
          {r.id && (
            <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--dim)", flexShrink: 0 }}>{r.id}</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <Badge status={r.status} />
          {!isPaid && hasDetails && (
            <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-label="gesperrt" style={{ flexShrink: 0 }}>
              <rect x="1" y="5.5" width="9" height="7" rx="1.5" fill="none" stroke="var(--dim)" strokeWidth="1.3"/>
              <path d="M3 5.5V3.5a2.5 2.5 0 015 0v2" stroke="var(--dim)" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          )}
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false" style={{ transition: "transform .2s", transform: open ? "rotate(180deg)" : "" }}>
            <path d="M4 6l4 4 4-4" fill="none" stroke="var(--dim)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ─── Aufgeklappter Bereich ─── */}
      {open && (
        <div style={{ padding: "0 20px 18px", borderTop: "1px solid var(--line)" }}>
          {/* Zitat — immer sichtbar */}
          {r.zitat && (
            <div style={{ margin: "14px 0", padding: "10px 14px", background: "var(--bg)", borderLeft: "2.5px solid var(--blue)", borderRadius: "0 6px 6px 0" }}>
              <p style={{ margin: 0, fontSize: 13, fontStyle: "italic", color: "var(--dim)", lineHeight: 1.65 }}>„{r.zitat}"</p>
            </div>
          )}

          {/* Details — nur wenn bezahlt */}
          {isPaid ? (
            <>
              {r.erklaerung && (
                <p style={{ margin: "0 0 12px", fontSize: 13.5, lineHeight: 1.7, color: "var(--fg)" }}>{r.erklaerung}</p>
              )}
              {r.rechtsfolge && (
                <div style={{ margin: "10px 0" }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "var(--dim)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Rechtsfolge</p>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--fg)" }}>{r.rechtsfolge}</p>
                </div>
              )}
              {r.handlungsempfehlung && (
                <div style={{ margin: "10px 0" }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "var(--dim)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Handlungsempfehlung</p>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--fg)" }}>{r.handlungsempfehlung}</p>
                </div>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                {r.rechtsgrundlage && (
                  <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--blue)", background: "var(--blue-bg)", padding: "3px 8px", borderRadius: 5 }}>{r.rechtsgrundlage}</span>
                )}
                {r.leitentscheidungen?.map((l, idx) => (
                  <span key={idx} style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--blue)", background: "var(--blue-bg)", padding: "3px 8px", borderRadius: 5 }}>
                    {l.gericht} {l.aktenzeichen}
                  </span>
                ))}
              </div>
            </>
          ) : hasDetails ? (
            /* Locked-Overlay */
            <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", marginTop: 4 }}>
              {/* Unscharfer Dummy-Content */}
              <div aria-hidden="true" style={{ filter: "blur(5px)", userSelect: "none", pointerEvents: "none", padding: "12px 14px", background: "var(--bg)", borderRadius: 10, fontSize: 13, lineHeight: 1.7, color: "var(--fg)" }}>
                Die Klausel ist unwirksam, weil sie den Mieter unangemessen benachteiligt gemäß § 307 Abs. 1 BGB. Nach der Rechtsprechung des BGH (VIII ZR 394/12) ist eine solche Regelung ohne Ausnahme nichtig. Als Mieter können Sie die Rückzahlung schriftlich fordern und ggf. einen Mieterverein einschalten. Rechtsgrundlage: §§ 307, 536 BGB.
              </div>
              {/* Lock-Badge */}
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, background: "rgba(248,247,244,.82)", backdropFilter: "blur(3px)" }}>
                <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden="true">
                  <rect x="2" y="10" width="16" height="13" rx="2.5" fill="none" stroke="var(--dim)" strokeWidth="1.6"/>
                  <path d="M6 10V7a4 4 0 018 0v3" stroke="var(--dim)" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", textAlign: "center" }}>
                  Erklärung, Rechtsgrundlage &amp; Empfehlung<br />nach dem Freischalten sichtbar
                </span>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function Stat({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 28, fontWeight: 700, color, letterSpacing: -1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

/* ───────── MAIN COMPONENT ───────── */
export default function UploadFlow({ isPaid = false }: { isPaid?: boolean }) {
  const [view, setView] = useState<"idle" | "loading" | "results">("idle");
  const [inputMode, setInputMode] = useState<"pdf" | "text">("pdf");
  const [manualText, setManualText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");
  const [filter, setFilter] = useState<"all" | "unwirksam" | "wirksam" | "unklar">("all");
  const [extracted, setExtracted] = useState<{ text: string; pages: number; chars: number } | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  // ── Nach Rückkehr von Stripe: Ergebnis aus sessionStorage wiederherstellen ──
  useEffect(() => {
    if (!isPaid) return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const stored: StoredAnalysis = JSON.parse(raw);
      setFile({ name: stored.filename } as File);
      setExtracted({ text: "", pages: stored.pages, chars: stored.chars });
      setAnalysis({ klauseln: stored.klauseln, zusammenfassung: stored.zusammenfassung, meta: stored.meta });
      setView("results");
    } catch { /* sessionStorage-Fehler ignorieren */ }
  }, [isPaid]);

  /* ─── Upload + Analyse ─── */
  const analyze = async (f: File) => {
    setFile(f);
    setError(null);
    setExtracted(null);
    setAnalysis(null);
    setView("loading");
    setProgress(8);
    setStep("Datei wird hochgeladen …");

    const fd = new FormData();
    fd.append("file", f);

    let extractResp: Response;
    try {
      setProgress(20);
      setStep("Vertragstext wird extrahiert …");
      extractResp = await fetch("/api/extract", { method: "POST", body: fd });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verbindung zum Server fehlgeschlagen.");
      setView("idle");
      return;
    }

    let extractData: { ok: boolean; error?: string; text?: string; pages?: number; chars?: number };
    try {
      extractData = await extractResp.json();
    } catch {
      setError(`Unerwartete Server-Antwort (HTTP ${extractResp.status}).`);
      setView("idle");
      return;
    }

    if (!extractResp.ok || !extractData.ok) {
      setError(extractData.error || `Extraktion fehlgeschlagen (HTTP ${extractResp.status}).`);
      setView("idle");
      return;
    }

    const extractedText = extractData.text!;
    const extractedMeta = { text: extractedText, pages: extractData.pages ?? 0, chars: extractData.chars ?? extractedText.length };
    setExtracted(extractedMeta);

    setProgress(48);
    setStep("Klauseln werden identifiziert …");

    let analyzeResp: Response;
    try {
      analyzeResp = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: extractedText }),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verbindung zum Analyse-Server fehlgeschlagen.");
      setView("idle");
      return;
    }

    setProgress(72);
    setStep("Prüfung gegen BGH-Rechtsprechung · Tiefenprüfung läuft …");

    let analyzeData: { ok: boolean; error?: string } & Partial<AnalysisData>;
    try {
      analyzeData = await analyzeResp.json();
    } catch {
      setError(`Unerwartete Server-Antwort (HTTP ${analyzeResp.status}).`);
      setView("idle");
      return;
    }

    if (!analyzeResp.ok || !analyzeData.ok || !analyzeData.klauseln || !analyzeData.zusammenfassung) {
      setError(analyzeData.error || `Analyse fehlgeschlagen (HTTP ${analyzeResp.status}).`);
      setView("idle");
      return;
    }

    const finalAnalysis: AnalysisData = {
      klauseln: analyzeData.klauseln,
      zusammenfassung: analyzeData.zusammenfassung,
      meta: analyzeData.meta!,
    };
    setAnalysis(finalAnalysis);

    // Ergebnis in sessionStorage sichern (fuer Post-Payment-Wiederherstellung)
    try {
      const stored: StoredAnalysis = {
        ...finalAnalysis,
        filename: f.name,
        pages: extractedMeta.pages,
        chars: extractedMeta.chars,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch { /* sessionStorage nicht verfuegbar — ignorieren */ }

    setProgress(95);
    setStep("Report wird zusammengestellt …");
    await new Promise((r) => setTimeout(r, 300));
    setProgress(100);
    setStep("Analyse abgeschlossen");
    setTimeout(() => setView("results"), 400);
  };

  /* ─── Stripe Checkout starten ─── */
  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const resp = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnTo: "/" }),
      });
      const data: { ok: boolean; url?: string; error?: string } = await resp.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Checkout konnte nicht gestartet werden.");
        setCheckoutLoading(false);
      }
    } catch {
      setError("Verbindung zum Zahlungs-Server fehlgeschlagen.");
      setCheckoutLoading(false);
    }
  };

  const drop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer?.files[0];
    if (f) analyze(f);
  };

  /* ─── Direkt-Text-Analyse (überspringt /api/extract) ─── */
  const analyzeText = async () => {
    const text = manualText.trim();
    if (text.length < 50) {
      setError("Bitte mindestens 50 Zeichen Vertragstext eingeben.");
      return;
    }
    setFile({ name: "Manuell eingegeben" } as File);
    setError(null);
    setExtracted(null);
    setAnalysis(null);
    setView("loading");
    setProgress(30);
    setStep("Text wird analysiert …");

    const extractedMeta = { text, pages: 1, chars: text.length };
    setExtracted(extractedMeta);

    let analyzeResp: Response;
    try {
      setProgress(50);
      setStep("Klauseln werden identifiziert …");
      analyzeResp = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verbindung zum Analyse-Server fehlgeschlagen.");
      setView("idle");
      return;
    }

    setProgress(75);
    setStep("Prüfung gegen BGH-Rechtsprechung …");

    let analyzeData: { ok: boolean; error?: string } & Partial<AnalysisData>;
    try {
      analyzeData = await analyzeResp.json();
    } catch {
      setError(`Unerwartete Server-Antwort (HTTP ${analyzeResp.status}).`);
      setView("idle");
      return;
    }

    if (!analyzeResp.ok || !analyzeData.ok || !analyzeData.klauseln || !analyzeData.zusammenfassung) {
      setError(analyzeData.error || `Analyse fehlgeschlagen (HTTP ${analyzeResp.status}).`);
      setView("idle");
      return;
    }

    const finalAnalysis: AnalysisData = {
      klauseln: analyzeData.klauseln,
      zusammenfassung: analyzeData.zusammenfassung,
      meta: analyzeData.meta!,
    };
    setAnalysis(finalAnalysis);

    try {
      const stored: StoredAnalysis = { ...finalAnalysis, filename: "Manuell eingegeben", pages: 1, chars: text.length };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {}

    setProgress(95);
    setStep("Report wird zusammengestellt …");
    await new Promise((r) => setTimeout(r, 300));
    setProgress(100);
    setTimeout(() => setView("results"), 400);
  };

  const reset = () => {
    setView("idle");
    setFile(null);
    setFilter("all");
    setError(null);
    setExtracted(null);
    setAnalysis(null);
    setManualText("");
    try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const klauseln = analysis?.klauseln ?? [];
  const filtered = filter === "all" ? klauseln : klauseln.filter((r) => r.status === filter);
  const totalChecked = analysis?.zusammenfassung.gesamt ?? klauseln.length;
  const unwirksamCount = analysis?.zusammenfassung.unwirksam ?? klauseln.filter((r) => r.status === "unwirksam").length;
  const wirksamCount = analysis?.zusammenfassung.wirksam ?? klauseln.filter((r) => r.status === "wirksam").length;
  const unklarCount = analysis?.zusammenfassung.unklar ?? klauseln.filter((r) => r.status === "unklar").length;
  const mockMode = analysis?.meta.mock ?? false;

  return (
    <>
      {/* ───── INLINE UPLOAD-ZONE ───── */}
      <div id="upload" style={{ scrollMarginTop: 80, maxWidth: 480, margin: "0 auto" }}>

        {/* Tab-Toggle */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "rgba(0,0,0,.05)", borderRadius: 10, padding: 4 }}>
          {(["pdf", "text"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => { setInputMode(mode); setError(null); }}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 7,
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all .15s",
                background: inputMode === mode ? "var(--card)" : "transparent",
                color: inputMode === mode ? "var(--fg)" : "var(--dim)",
                boxShadow: inputMode === mode ? "0 1px 4px rgba(0,0,0,.08)" : "none",
              }}
            >
              {mode === "pdf" ? "PDF hochladen" : "Text einfügen"}
            </button>
          ))}
        </div>

        {/* PDF-Zone */}
        {inputMode === "pdf" && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={drop}
            onClick={() => ref.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Mietvertrag als PDF hochladen"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ref.current?.click(); }
            }}
            style={{
              border: `2px dashed ${drag ? "var(--blue)" : "rgba(0,0,0,.12)"}`,
              borderRadius: 16,
              padding: "44px 28px 38px",
              background: drag ? "var(--blue-bg)" : "var(--card)",
              cursor: "pointer",
              transition: "all .2s",
              textAlign: "center",
            }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 12, background: "var(--blue-bg)", display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Mietvertrag als PDF hochladen</p>
            <p style={{ fontSize: 13, color: "var(--dim)" }}>Drag &amp; Drop oder klicken zum Auswählen</p>
          </div>
        )}

        {/* Text-Zone */}
        {inputMode === "text" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Vertragstext hier einfügen — z. B. kopiert aus Word oder einem Scan-Tool …"
              rows={10}
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: 14,
                lineHeight: 1.6,
                border: "1px solid var(--line)",
                borderRadius: 12,
                background: "var(--card)",
                color: "var(--fg)",
                fontFamily: "inherit",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
            <p style={{ fontSize: 12, color: "var(--dim)", margin: 0 }}>
              {manualText.length} Zeichen
              {manualText.length > 0 && manualText.length < 50 && (
                <span style={{ color: "#B91C1C" }}> — mindestens 50 benötigt</span>
              )}
            </p>
            <button
              onClick={analyzeText}
              disabled={manualText.trim().length < 50}
              style={{
                background: manualText.trim().length >= 50 ? "var(--fg)" : "rgba(0,0,0,.12)",
                color: manualText.trim().length >= 50 ? "var(--bg)" : "var(--dim)",
                border: "none",
                padding: "13px 0",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: manualText.trim().length >= 50 ? "pointer" : "not-allowed",
                transition: "all .15s",
              }}
            >
              Vertrag jetzt prüfen →
            </button>
          </div>
        )}

        {error && (
          <div role="alert" style={{ margin: "14px 0 0", background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", borderRadius: 10, padding: "10px 14px", fontSize: 13, lineHeight: 1.5 }}>
            <strong style={{ fontWeight: 600 }}>Fehler:</strong> {error}
          </div>
        )}

        {/* DSGVO-Hinweis */}
        <p style={{ margin: "12px 0 0", fontSize: 11.5, color: "#8C8A82", textAlign: "center", lineHeight: 1.5 }}>
          Ihr Vertragstext wird ausschließlich zur Analyse verarbeitet und danach sofort
          gelöscht — keine dauerhafte Speicherung, keine Weitergabe.{" "}
          <a href="/datenschutz" style={{ color: "#2558D4", textDecoration: "underline" }}>
            Datenschutzerklärung
          </a>
        </p>
        <input ref={ref} type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && analyze(e.target.files[0])} />
      </div>

      {/* ───── FULLSCREEN OVERLAY ───── */}
      {view !== "idle" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={view === "loading" ? "Analyse läuft" : "Analyse-Ergebnis"}
          style={{ position: "fixed", inset: 0, background: "var(--bg)", zIndex: 100, overflowY: "auto", animation: "fadeUp .3s both" }}
        >
          {/* ── Loading ── */}
          {view === "loading" && (
            <div style={{ padding: "140px 24px", maxWidth: 400, margin: "0 auto", textAlign: "center", animation: "fadeUp .4s both" }}>
              <div style={{ width: 72, height: 90, margin: "0 auto 28px", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, width: "100%", height: 2, background: "var(--blue)", animation: "scan 2s ease-in-out infinite" }} />
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--dim)" strokeWidth="1.5" aria-hidden="true" focusable="false" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <p style={{ fontWeight: 600, fontSize: 17, marginBottom: 6, letterSpacing: -0.3 }}>{file?.name || "Mietvertrag.pdf"}</p>
              <p style={{ fontSize: 14, color: "var(--dim)", marginBottom: 28, minHeight: 20 }}>{step}</p>
              <div style={{ background: "var(--line)", borderRadius: 6, height: 5, overflow: "hidden", maxWidth: 280, margin: "0 auto" }}>
                <div style={{ background: "var(--blue)", height: "100%", borderRadius: 6, width: `${progress}%`, transition: "width .5s ease" }} />
              </div>
            </div>
          )}

          {/* ── Ergebnisse ── */}
          {view === "results" && (
            <div style={{ maxWidth: 680, margin: "0 auto", padding: "36px 24px 120px", animation: "fadeUp .5s both" }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <h2 style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 30, fontWeight: 400, marginBottom: 4 }}>Analyse abgeschlossen</h2>
                <p style={{ fontSize: 14, color: "var(--dim)" }}>
                  {file?.name || "Mietvertrag.pdf"}
                  {extracted && ` · ${extracted.pages} Seiten · ${extracted.chars.toLocaleString("de-DE")} Zeichen extrahiert`}
                  {" · "}
                  {totalChecked} Klauseln geprüft
                </p>
              </div>

              {mockMode && (
                <div role="status" style={{ background: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, marginBottom: 18, textAlign: "center" }}>
                  Mock-Modus aktiv — kein <code style={{ fontFamily: "var(--mono)" }}>ANTHROPIC_API_KEY</code> gesetzt. Nur Pattern-basierte Schnellprüfung.
                </div>
              )}

              {/* Statistik-Kacheln */}
              <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 16, padding: "28px 32px", display: "flex", justifyContent: "space-around", marginBottom: 28 }}>
                <Stat value={unwirksamCount} label="Unwirksam" color="#DC2626" />
                <div style={{ width: 1, background: "var(--line)" }} />
                <Stat value={wirksamCount} label="Wirksam" color="#16A34A" />
                <div style={{ width: 1, background: "var(--line)" }} />
                <Stat value={unklarCount} label="Prüfen" color="#D97706" />
                <div style={{ width: 1, background: "var(--line)" }} />
                <Stat
                  value={analysis?.zusammenfassung.risiko ? analysis.zusammenfassung.risiko.toUpperCase() : "—"}
                  label="Gesamtrisiko"
                  color={analysis?.zusammenfassung.risiko === "hoch" ? "#DC2626" : analysis?.zusammenfassung.risiko === "mittel" ? "#D97706" : "#16A34A"}
                />
              </div>

              {analysis?.zusammenfassung.bewertung && (
                <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: "16px 20px", marginBottom: 20 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "var(--dim)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Gesamtbewertung</p>
                  <p style={{ fontSize: 14, lineHeight: 1.65 }}>{analysis.zusammenfassung.bewertung}</p>
                </div>
              )}

              {/* Filter-Buttons */}
              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {([ ["all", "Alle"], ["unwirksam", "Unwirksam"], ["wirksam", "Wirksam"], ["unklar", "Unklar"] ] as const).map(([k, l]) => (
                  <button key={k} onClick={() => setFilter(k)} style={{ padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 550, border: "1px solid var(--line)", background: filter === k ? "var(--fg)" : "var(--card)", color: filter === k ? "var(--bg)" : "var(--dim)", cursor: "pointer", transition: "all .15s" }}>
                    {l}
                  </button>
                ))}
              </div>

              {/* Klausel-Karten */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.map((r, i) => (
                  <ResultCard key={`${r.id || "x"}-${i}`} r={r} i={i} isPaid={isPaid} />
                ))}
              </div>

              {/* Neuer Vertrag */}
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <button onClick={reset} style={{ background: "none", border: "1px solid var(--line)", color: "var(--fg)", padding: "10px 28px", borderRadius: 8, fontSize: 13, fontWeight: 550, cursor: "pointer" }}>
                  Neuen Vertrag prüfen
                </button>
              </div>

              <p style={{ textAlign: "center", fontSize: 11, color: "var(--dim)", marginTop: 20, lineHeight: 1.5 }}>
                Automatisierte Ersteinschätzung auf Basis öffentlicher Rechtsprechung · Keine Rechtsberatung i.S.d. RDG
              </p>
            </div>
          )}

          {/* ───── PAYWALL-BANNER (sticky unten, nur wenn nicht bezahlt) ───── */}
          {view === "results" && !isPaid && (
            <div
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 110,
                background: "rgba(28,27,25,.96)",
                backdropFilter: "blur(16px)",
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                borderTop: "1px solid rgba(255,255,255,.1)",
              }}
            >
              <div>
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: 0, letterSpacing: -0.2 }}>
                  Alle Details freischalten
                </p>
                <p style={{ color: "rgba(255,255,255,.55)", fontSize: 12, margin: "2px 0 0" }}>
                  Erklärungen · Rechtsgrundlagen · BGH-Urteile · Handlungsempfehlungen
                </p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                style={{
                  background: checkoutLoading ? "#888" : "#2558D4",
                  color: "#fff",
                  border: "none",
                  padding: "12px 28px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: checkoutLoading ? "wait" : "pointer",
                  letterSpacing: -0.3,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {checkoutLoading ? "Weiterleitung …" : "Jetzt freischalten — 2,99 €"}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
