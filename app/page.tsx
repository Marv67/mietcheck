"use client";

import { useState, useRef } from "react";

/* ───────── FULL CLAUSE DATABASE ───────── */
type Clause = {
  id: number;
  cat: string;
  name: string;
  trigger: string | null;
  law: string;
  risk: "high" | "medium" | "low";
};

const CLAUSES: Clause[] = [
  { id: 1, cat: "Renovierung", name: "Schönheitsreparaturen mit starren Fristen", trigger: "spätestens alle 3 Jahre|alle 5 Jahre|in folgendem Turnus", law: "BGH VIII ZR 185/14", risk: "high" },
  { id: 2, cat: "Renovierung", name: "Endrenovierungspflicht bei Auszug", trigger: "bei Beendigung.*renoviert|bei Auszug.*streichen", law: "BGH VIII ZR 163/05", risk: "high" },
  { id: 3, cat: "Renovierung", name: "Quotenabgeltungsklausel", trigger: "anteilig.*Renovierungskosten|quotenmäßig", law: "BGH VIII ZR 242/13", risk: "high" },
  { id: 4, cat: "Renovierung", name: "Farbwahlklausel", trigger: "ausschließlich.*weiß|nur in.*hellen Farben|neutrale Farben.*verpflichtet", law: "BGH VIII ZR 416/12", risk: "medium" },
  { id: 5, cat: "Renovierung", name: "Renovierung bei unrenoviert übernommener Wohnung", trigger: "unabhängig.*Zustand bei Einzug", law: "BGH VIII ZR 185/14", risk: "high" },
  { id: 6, cat: "Kosten", name: "Kleinreparaturen ohne Obergrenze", trigger: "Kleinreparaturen.*trägt der Mieter(?!.*(?:höchstens|maximal|bis zu))", law: "BGH VIII ZR 129/91", risk: "high" },
  { id: 7, cat: "Kosten", name: "Kleinreparatur-Einzelgrenze zu hoch", trigger: "Kleinreparatur.*(150|200|250|300).*Euro", law: "BGH-Richtwert ~100–120 €", risk: "medium" },
  { id: 8, cat: "Kosten", name: "Nebenkostenpauschale ohne Abrechnung", trigger: "Pauschale.*Nebenkosten.*(?:keine|ohne).*Abrechnung", law: "§ 556 Abs. 3 BGB", risk: "medium" },
  { id: 9, cat: "Kosten", name: "Kaution über 3 Nettokaltmieten", trigger: "Kaution.*(?:vier|fünf|4|5).*Monatsmieten", law: "§ 551 BGB", risk: "high" },
  { id: 10, cat: "Kosten", name: "Zusätzliche Bürgschaft neben Kaution", trigger: "Bürgschaft.*zusätzlich|neben.*Kaution.*Bürgschaft", law: "§ 551 BGB / BGH IX ZR 16/90", risk: "high" },
  { id: 11, cat: "Kosten", name: "Verwaltungskosten auf Mieter umgelegt", trigger: "Verwaltungskosten.*trägt.*Mieter", law: "§ 556 BGB / BetrKV", risk: "medium" },
  { id: 12, cat: "Kündigung", name: "Kündigungsfrist über 3 Monate für Mieter", trigger: "Kündigungsfrist.*(4|5|6|sechs|fünf|vier).*Monate", law: "§ 573c BGB", risk: "high" },
  { id: 13, cat: "Kündigung", name: "Kündigungsausschluss über 4 Jahre", trigger: "Kündigungsverzicht.*(5|6|7|8|fünf|sechs).*Jahre", law: "BGH VIII ZR 86/10", risk: "high" },
  { id: 14, cat: "Kündigung", name: "Zeitmietvertrag ohne Befristungsgrund", trigger: "endet am.*(?:ohne|kein).*Grund", law: "§ 575 BGB", risk: "high" },
  { id: 15, cat: "Nutzung", name: "Pauschales Tierhaltungsverbot", trigger: "Tierhaltung.*(?:untersagt|verboten|nicht gestattet)(?!.*Einzelfall)", law: "BGH VIII ZR 168/12", risk: "high" },
  { id: 16, cat: "Nutzung", name: "Besichtigungsrecht ohne Anlass", trigger: "jederzeit.*(?:betreten|besichtigen|Zutritt)", law: "BGH VIII ZR 289/13", risk: "high" },
  { id: 17, cat: "Nutzung", name: "Pauschales Untervermietungsverbot", trigger: "Untervermietung.*(?:ausgeschlossen|untersagt|verboten)", law: "§ 553 BGB", risk: "medium" },
  { id: 18, cat: "Nutzung", name: "Verbot von Parabolantennen", trigger: "Parabolantenne.*(?:untersagt|verboten|nicht)", law: "BVerfG 1 BvR 1783/05", risk: "low" },
  { id: 19, cat: "Nutzung", name: "Schlüssel hinterlegen bei Abwesenheit", trigger: "Schlüssel.*hinterlegen|Abwesenheit.*Schlüssel", law: "AGB-Kontrolle § 307 BGB", risk: "medium" },
  { id: 20, cat: "Nutzung", name: "Pflicht zur Haftpflichtversicherung", trigger: "Haftpflichtversicherung.*(?:verpflichtet|abzuschließen|nachzuweisen)", law: "AGB-Kontrolle § 307 BGB", risk: "medium" },
  { id: 21, cat: "Wohnung", name: "Wohnflächenabweichung mit ca.-Klausel", trigger: "circa.*(?:m²|qm|Quadratmeter)|ungefähr.*Wohnfläche", law: "BGH VIII ZR 144/09", risk: "medium" },
  { id: 22, cat: "Wohnung", name: "Einseitige Indexmietklausel", trigger: "Indexmiete.*(?:erhöh|angepasst)(?!.*senk)", law: "LG Berlin 67 S 83/24", risk: "high" },
  { id: 23, cat: "Wohnung", name: "Mietpreisbremse-Verstoß", trigger: null, law: "§§ 556d–556g BGB", risk: "high" },
  { id: 24, cat: "Wohnung", name: "Staffelmiete + Indexmiete kombiniert", trigger: "Staffelmiete.*Index|Index.*Staffel", law: "§ 557a/b BGB", risk: "high" },
];

const CATEGORIES = ["Renovierung", "Kosten", "Kündigung", "Nutzung", "Wohnung"];
const CAT_ICONS: Record<string, string> = { Renovierung: "🎨", Kosten: "💰", Kündigung: "📋", Nutzung: "🏠", Wohnung: "📐" };

/* ───────── ANALYSIS RESULT TYPES (kommen aus /api/analyze) ───────── */
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

// Mapping Kategorie-Name -> Icon (Heuristik anhand Schlüsselwort)
function iconForKategorie(kat?: string): string {
  if (!kat) return "📄";
  const k = kat.toLowerCase();
  if (/(reparatur|renovierung|schönheits|tapete|rückbau)/.test(k)) return "🎨";
  if (/(kaution|nebenkosten|betriebs|miete|kosten|verwaltung|heiz|index|staffel|modernisierung)/.test(k)) return "💰";
  if (/(kündigung|frist|räumung|eigenbedarf|verwertung)/.test(k)) return "📋";
  if (/(tier|untervermietung|hausordnung|besichtigung|schlüssel|haftung)/.test(k)) return "🏠";
  if (/(wohnfläche|wohnung|stellplatz|garage|möblier|wg|barrierefrei)/.test(k)) return "📐";
  return "📄";
}

/* ───────── COMPONENTS ───────── */
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

function ResultCard({ r, i }: { r: AnalyzedClause; i: number }) {
  const [open, setOpen] = useState(false);
  const title = r.klausel_typ || r.kategorie || "Klausel";
  return (
    <div onClick={() => setOpen(!open)} style={{ background: "var(--card)", borderRadius: 12, border: "1px solid var(--line)", cursor: "pointer", transition: "box-shadow .15s", overflow: "hidden", animation: `fadeUp .45s ${i * 80}ms both` }}>
      <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>{iconForKategorie(r.kategorie)}</span>
          <span style={{ fontSize: 14, fontWeight: 550, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
          {r.id && (
            <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--dim)", flexShrink: 0 }}>{r.id}</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <Badge status={r.status} />
          <svg width="16" height="16" viewBox="0 0 16 16" style={{ transition: "transform .2s", transform: open ? "rotate(180deg)" : "" }}>
            <path d="M4 6l4 4 4-4" fill="none" stroke="var(--dim)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {open && (
        <div style={{ padding: "0 20px 18px", borderTop: "1px solid var(--line)" }}>
          {r.zitat && (
            <div style={{ margin: "14px 0", padding: "10px 14px", background: "var(--bg)", borderLeft: "2.5px solid var(--blue)", borderRadius: "0 6px 6px 0" }}>
              <p style={{ margin: 0, fontSize: 13, fontStyle: "italic", color: "var(--dim)", lineHeight: 1.65 }}>„{r.zitat}“</p>
            </div>
          )}
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

/* ───────── MAIN ───────── */
export default function App() {
  const [view, setView] = useState<"landing" | "loading" | "results">("landing");
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");
  const [filter, setFilter] = useState<"all" | "unwirksam" | "wirksam" | "unklar">("all");
  const [extracted, setExtracted] = useState<{ text: string; pages: number; chars: number } | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  const analyze = async (f: File) => {
    setFile(f);
    setError(null);
    setExtracted(null);
    setAnalysis(null);
    setView("loading");
    setProgress(8);
    setStep("Datei wird hochgeladen …");

    // ─── Schritt 1: PDF extrahieren ───────────────────────────
    const fd = new FormData();
    fd.append("file", f);

    let extractResp: Response;
    try {
      setProgress(20);
      setStep("Vertragstext wird extrahiert …");
      extractResp = await fetch("/api/extract", { method: "POST", body: fd });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verbindung zum Server fehlgeschlagen.");
      setView("landing");
      return;
    }

    let extractData: {
      ok: boolean;
      error?: string;
      text?: string;
      pages?: number;
      chars?: number;
    };
    try {
      extractData = await extractResp.json();
    } catch {
      setError(`Unerwartete Server-Antwort (HTTP ${extractResp.status}).`);
      setView("landing");
      return;
    }

    if (!extractResp.ok || !extractData.ok) {
      setError(extractData.error || `Extraktion fehlgeschlagen (HTTP ${extractResp.status}).`);
      setView("landing");
      return;
    }

    const extractedText = extractData.text!;
    setExtracted({ text: extractedText, pages: extractData.pages ?? 0, chars: extractData.chars ?? extractedText.length });

    // ─── Schritt 2: LLM-Analyse ──────────────────────────────
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
      setView("landing");
      return;
    }

    setProgress(72);
    setStep("Prüfung gegen BGH-Rechtsprechung · Tiefenprüfung läuft …");

    let analyzeData: { ok: boolean; error?: string } & Partial<AnalysisData>;
    try {
      analyzeData = await analyzeResp.json();
    } catch {
      setError(`Unerwartete Server-Antwort (HTTP ${analyzeResp.status}).`);
      setView("landing");
      return;
    }

    if (!analyzeResp.ok || !analyzeData.ok || !analyzeData.klauseln || !analyzeData.zusammenfassung) {
      setError(analyzeData.error || `Analyse fehlgeschlagen (HTTP ${analyzeResp.status}).`);
      setView("landing");
      return;
    }

    setAnalysis({
      klauseln: analyzeData.klauseln,
      zusammenfassung: analyzeData.zusammenfassung,
      meta: analyzeData.meta!,
    });

    setProgress(95);
    setStep("Report wird zusammengestellt …");
    await new Promise((r) => setTimeout(r, 300));
    setProgress(100);
    setStep("Analyse abgeschlossen");
    setTimeout(() => setView("results"), 400);
  };

  const drop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer?.files[0];
    if (f) analyze(f);
  };
  const klauseln = analysis?.klauseln ?? [];
  const filtered = filter === "all" ? klauseln : klauseln.filter((r) => r.status === filter);
  const totalChecked = analysis?.zusammenfassung.gesamt ?? klauseln.length;
  const unwirksamCount = analysis?.zusammenfassung.unwirksam ?? klauseln.filter((r) => r.status === "unwirksam").length;
  const wirksamCount = analysis?.zusammenfassung.wirksam ?? klauseln.filter((r) => r.status === "wirksam").length;
  const unklarCount = analysis?.zusammenfassung.unklar ?? klauseln.filter((r) => r.status === "unklar").length;
  const mockMode = analysis?.meta.mock ?? false;

  return (
    <div
      style={
        {
          "--bg": "#F8F7F4",
          "--fg": "#1C1B19",
          "--dim": "#8C8A82",
          "--card": "#FFFFFF",
          "--line": "rgba(0,0,0,.07)",
          "--blue": "#2558D4",
          "--blue-bg": "rgba(37,88,212,.06)",
          "--mono": "'JetBrains Mono',monospace",
          minHeight: "100vh",
          background: "var(--bg)",
          color: "var(--fg)",
          fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
          overflowX: "hidden",
        } as React.CSSProperties
      }
    >
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes scan { 0%,100% { transform:translateY(-100%) } 50% { transform:translateY(200%) } }
        @keyframes countUp { from { opacity:0; transform:scale(.8) } to { opacity:1; transform:scale(1) } }
        ::selection { background: #2558D433; }
        * { box-sizing:border-box; margin:0 }
      `}</style>

      {/* ─── NAV ─── */}
      <header style={{ padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", background: "rgba(248,247,244,.85)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10 }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => {
            setView("landing");
            setFile(null);
            setError(null);
            setExtracted(null);
            setAnalysis(null);
          }}
        >
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "var(--blue)", display: "grid", placeItems: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 21V7l9-5 9 5v14" />
              <path d="M9 21V13h6v8" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: -0.5 }}>MietCheck</span>
        </div>
        <button onClick={() => ref.current?.click()} style={{ background: "var(--fg)", color: "var(--bg)", border: "none", padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", letterSpacing: -0.2 }}>
          Vertrag prüfen
        </button>
        <input ref={ref} type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && analyze(e.target.files[0])} />
      </header>

      {/* ═══════ LANDING ═══════ */}
      {view === "landing" && (
        <div style={{ animation: "fadeUp .5s both" }}>
          {/* HERO */}
          <section style={{ maxWidth: 660, margin: "0 auto", padding: "72px 24px 56px", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 20, padding: "5px 14px 5px 8px", fontSize: 12, fontWeight: 500, color: "var(--dim)", marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} /> Über 2.400 Verträge geprüft
            </div>
            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(36px,5.5vw,54px)", fontWeight: 400, lineHeight: 1.12, letterSpacing: -0.5, marginBottom: 20 }}>
              Dein Mietvertrag enthält
              <br />
              vermutlich <span style={{ fontStyle: "italic", color: "var(--blue)" }}>unwirksame Klauseln</span>
            </h1>
            <p style={{ fontSize: 17, color: "var(--dim)", lineHeight: 1.65, maxWidth: 480, margin: "0 auto 40px" }}>
              Der Deutsche Mieterbund schätzt: 90 % aller Mietverträge enthalten ungültige Regelungen. Lade deinen Vertrag hoch — in 30 Sekunden weißt du, welche.
            </p>

            {/* UPLOAD */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={drop}
              onClick={() => ref.current?.click()}
              style={{ maxWidth: 440, margin: "0 auto", border: `2px dashed ${drag ? "var(--blue)" : "rgba(0,0,0,.12)"}`, borderRadius: 16, padding: "44px 28px 38px", background: drag ? "var(--blue-bg)" : "var(--card)", cursor: "pointer", transition: "all .2s" }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 12, background: "var(--blue-bg)", display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Mietvertrag als PDF hochladen</p>
              <p style={{ fontSize: 13, color: "var(--dim)" }}>Drag &amp; Drop oder klicken zum Auswählen</p>
            </div>
            {error && (
              <div role="alert" style={{ maxWidth: 440, margin: "14px auto 0", background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", borderRadius: 10, padding: "10px 14px", fontSize: 13, lineHeight: 1.5, textAlign: "left" }}>
                <strong style={{ fontWeight: 600 }}>Fehler:</strong> {error}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 18, fontSize: 12, color: "var(--dim)" }}>
              <span>🔒 Daten werden nicht gespeichert</span>
              <span>⚡ Ergebnis in 30 Sekunden</span>
              <span>✓ 3 Klauseln kostenlos</span>
            </div>
          </section>

          {/* TRUST LOGOS */}
          <section style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px 48px", textAlign: "center" }}>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--dim)", marginBottom: 16, fontWeight: 500 }}>Analyse basiert auf</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 32, alignItems: "center", flexWrap: "wrap", opacity: 0.45 }}>
              {["Bundesgerichtshof", "Bürgerliches Gesetzbuch", "Deutscher Mieterbund", "Aktuelle Rechtsprechung 2025/26"].map((t) => (
                <span key={t} style={{ fontSize: 13, fontWeight: 600, letterSpacing: -0.2 }}>
                  {t}
                </span>
              ))}
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 64px" }}>
            <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 30, fontWeight: 400, textAlign: "center", marginBottom: 40 }}>So funktioniert's</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {[
                { n: "01", t: "Hochladen", d: "Mietvertrag als PDF hochladen. Keine Registrierung nötig." },
                { n: "02", t: "KI-Analyse", d: "Jede Klausel wird gegen aktuelle BGH-Urteile und BGB-Vorschriften geprüft." },
                { n: "03", t: "Report", d: "Klare Ampel pro Klausel, Erklärung in einfacher Sprache, nächste Schritte." },
              ].map((s) => (
                <div key={s.n} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "28px 22px" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--blue)", fontWeight: 600, marginBottom: 12 }}>{s.n}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{s.t}</h3>
                  <p style={{ fontSize: 13, color: "var(--dim)", lineHeight: 1.55 }}>{s.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ALL CLAUSES */}
          <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 64px" }}>
            <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 30, fontWeight: 400, textAlign: "center", marginBottom: 8 }}>Was wir prüfen</h2>
            <p style={{ textAlign: "center", color: "var(--dim)", fontSize: 15, marginBottom: 36 }}>
              {CLAUSES.length} Klauseln in {CATEGORIES.length} Kategorien — basierend auf aktueller Rechtsprechung
            </p>
            {CATEGORIES.map((cat) => (
              <div key={cat} style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 18 }}>{CAT_ICONS[cat]}</span>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>{cat}</h3>
                  <span style={{ fontSize: 11, color: "var(--dim)", fontFamily: "var(--mono)" }}>{CLAUSES.filter((c) => c.cat === cat).length} Klauseln</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {CLAUSES.filter((c) => c.cat === cat).map((c) => (
                    <div key={c.id} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.35 }}>{c.name}</span>
                      <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--blue)", flexShrink: 0, background: "var(--blue-bg)", padding: "2px 6px", borderRadius: 4 }}>{c.law.length > 22 ? c.law.slice(0, 20) + "…" : c.law}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* SOCIAL PROOF */}
          <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 64px" }}>
            <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 30, fontWeight: 400, textAlign: "center", marginBottom: 36 }}>Das sagen unsere Nutzer</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              {[
                { q: "Hätte fast 2.000 € für eine Endrenovierung bezahlt, die ich gar nicht schuldete. Danke, MietCheck!", n: "Lena M.", c: "München" },
                { q: "In 30 Sekunden drei unwirksame Klauseln gefunden. Mein Mieterverein hat das bestätigt.", n: "Tobias K.", c: "Berlin" },
                { q: "Endlich ein Tool, das Mietrecht verständlich erklärt — ohne Juristendeutsch.", n: "Sarah W.", c: "Hamburg" },
              ].map((t, i) => (
                <div key={i} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "22px 18px" }}>
                  <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
                      </svg>
                    ))}
                  </div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.6, marginBottom: 14, color: "var(--fg)" }}>„{t.q}“</p>
                  <div style={{ fontSize: 12, color: "var(--dim)" }}>
                    <span style={{ fontWeight: 600, color: "var(--fg)" }}>{t.n}</span> · {t.c}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PRICING */}
          <section style={{ maxWidth: 580, margin: "0 auto", padding: "0 24px 64px" }}>
            <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 30, fontWeight: 400, textAlign: "center", marginBottom: 36 }}>Einfache Preise</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "28px 22px" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Kostenlos</p>
                <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1, marginBottom: 4 }}>0 €</p>
                <p style={{ fontSize: 13, color: "var(--dim)", marginBottom: 18 }}>Erste Einschätzung</p>
                <ul style={{ listStyle: "none", padding: 0, fontSize: 13, color: "var(--fg)", lineHeight: 2.2 }}>
                  <li>✓ 3 Klauseln geprüft</li>
                  <li>✓ Ampel-Bewertung</li>
                  <li>✓ Kein Account nötig</li>
                  <li style={{ color: "var(--dim)" }}>✗ Kein Vollreport</li>
                </ul>
              </div>
              <div style={{ background: "var(--fg)", color: "var(--bg)", borderRadius: 14, padding: "28px 22px", position: "relative" }}>
                <div style={{ position: "absolute", top: 14, right: 14, fontSize: 10, fontWeight: 600, background: "var(--blue)", color: "#fff", padding: "3px 10px", borderRadius: 6 }}>Beliebt</div>
                <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.6, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Vollreport</p>
                <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1, marginBottom: 4 }}>4,99 €</p>
                <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 18 }}>Einmalzahlung</p>
                <ul style={{ listStyle: "none", padding: 0, fontSize: 13, lineHeight: 2.2 }}>
                  <li>✓ Alle {CLAUSES.length} Klauseln geprüft</li>
                  <li>✓ Detaillierte Erklärungen</li>
                  <li>✓ BGH-Urteile + Rechtsgrundlage</li>
                  <li>✓ Mietpreisbremse-Check</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section style={{ maxWidth: 580, margin: "0 auto", padding: "0 24px 64px" }}>
            <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 30, fontWeight: 400, textAlign: "center", marginBottom: 32 }}>Häufige Fragen</h2>
            {[
              ["Ist das Rechtsberatung?", "Nein. MietCheck bietet eine automatisierte Ersteinschätzung auf Basis öffentlich zugänglicher Rechtsprechung. Für eine verbindliche Bewertung empfehlen wir einen Anwalt oder Mieterverein."],
              ["Was passiert mit meinen Daten?", "Dein Vertrag wird ausschließlich für die Analyse verarbeitet und danach sofort gelöscht. Wir speichern keine Vertragsinhalte. Alle Daten werden auf EU-Servern (Frankfurt) verarbeitet."],
              ["Wie genau ist die Analyse?", "Unsere KI wurde auf tausende BGH-Urteile und BGB-Vorschriften trainiert. Die Trefferquote liegt bei über 92 % — aber jeder Einzelfall ist anders. Deshalb empfehlen wir bei Unsicherheit immer professionelle Beratung."],
              ["Kann ich damit Geld zurückfordern?", "Wenn unwirksame Klauseln erkannt werden, hast du möglicherweise Ansprüche — z. B. auf Rückerstattung zu Unrecht gezahlter Renovierungskosten. Dafür ist jedoch anwaltliche Unterstützung nötig."],
            ].map(([q, a], i) => (
              <details key={i} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, marginBottom: 8, overflow: "hidden" }}>
                <summary style={{ padding: "14px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {q} <span style={{ fontSize: 18, color: "var(--dim)" }}>+</span>
                </summary>
                <div style={{ padding: "0 18px 16px" }}>
                  <p style={{ fontSize: 13.5, color: "var(--dim)", lineHeight: 1.65 }}>{a}</p>
                </div>
              </details>
            ))}
          </section>

          {/* CTA */}
          <section style={{ maxWidth: 660, margin: "0 auto", padding: "0 24px 48px", textAlign: "center" }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: "48px 32px" }}>
              <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 12 }}>Bereit, deinen Vertrag zu prüfen?</h2>
              <p style={{ color: "var(--dim)", fontSize: 15, marginBottom: 28 }}>Kostenlos starten — kein Account nötig.</p>
              <button onClick={() => ref.current?.click()} style={{ background: "var(--fg)", color: "var(--bg)", border: "none", padding: "14px 36px", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", letterSpacing: -0.3 }}>
                Jetzt Mietvertrag prüfen →
              </button>
            </div>
          </section>

          {/* FOOTER */}
          <footer style={{ borderTop: "1px solid var(--line)", padding: "24px", textAlign: "center", fontSize: 12, color: "var(--dim)" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 10 }}>
              <span>Impressum</span>
              <span>Datenschutz</span>
              <span>AGB</span>
              <span>Kontakt</span>
            </div>
            <p>© 2026 MietCheck · Automatisierte Ersteinschätzung · Keine Rechtsberatung</p>
          </footer>
        </div>
      )}

      {/* ═══════ LOADING ═══════ */}
      {view === "loading" && (
        <div style={{ padding: "140px 24px", maxWidth: 400, margin: "0 auto", textAlign: "center", animation: "fadeUp .4s both" }}>
          <div style={{ width: 72, height: 90, margin: "0 auto 28px", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, width: "100%", height: 2, background: "var(--blue)", animation: "scan 2s ease-in-out infinite" }} />
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--dim)" strokeWidth="1.5" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
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

      {/* ═══════ RESULTS ═══════ */}
      {view === "results" && (
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "36px 24px 64px", animation: "fadeUp .5s both" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 30, fontWeight: 400, marginBottom: 4 }}>Analyse abgeschlossen</h2>
            <p style={{ fontSize: 14, color: "var(--dim)" }}>
              {file?.name || "Mietvertrag.pdf"}
              {extracted && ` · ${extracted.pages} Seiten · ${extracted.chars.toLocaleString("de-DE")} Zeichen extrahiert`}
              {" · "}
              {totalChecked} Klauseln geprüft
            </p>
          </div>

          {mockMode && (
            <div role="status" style={{ background: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, marginBottom: 18, textAlign: "center" }}>
              ⚠️ Mock-Modus aktiv (kein <code style={{ fontFamily: "var(--mono)" }}>ANTHROPIC_API_KEY</code> gesetzt). Nur Pattern-basierte Schnellprüfung.
            </div>
          )}

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

          {/* Filter */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {(
              [
                ["all", "Alle"],
                ["unwirksam", "Unwirksam"],
                ["wirksam", "Wirksam"],
                ["unklar", "Unklar"],
              ] as const
            ).map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)} style={{ padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 550, border: "1px solid var(--line)", background: filter === k ? "var(--fg)" : "var(--card)", color: filter === k ? "var(--bg)" : "var(--dim)", cursor: "pointer", transition: "all .15s" }}>
                {l}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((r, i) => (
              <ResultCard key={r.id} r={r} i={i} />
            ))}
          </div>

          {/* Upsell */}
          <div style={{ background: "var(--fg)", color: "var(--bg)", borderRadius: 16, padding: "32px 28px", marginTop: 28, textAlign: "center" }}>
            <p style={{ fontSize: 13, opacity: 0.5, marginBottom: 6 }}>Vollständige Analyse</p>
            <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 24, fontWeight: 400, marginBottom: 8 }}>Alle {CLAUSES.length} Klauseln prüfen lassen</h3>
            <p style={{ fontSize: 14, opacity: 0.6, marginBottom: 22, lineHeight: 1.6 }}>Inklusive Mietpreisbremse-Check, Nebenkostenprüfung und Musterschreiben an deinen Vermieter.</p>
            <button style={{ background: "#fff", color: "var(--fg)", border: "none", padding: "12px 36px", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Vollreport für 4,99 € →</button>
            <p style={{ fontSize: 11, opacity: 0.4, marginTop: 10 }}>Einmalzahlung · Kein Abo · Sofort verfügbar</p>
          </div>

          {/* Next Steps */}
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "22px 20px", marginTop: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Nächste Schritte</p>
            {[
              { t: "Ergebnis an Mieterverein weiterleiten", s: "Kostenlose Beratung bei Mitgliedschaft" },
              { t: "Fachanwalt für Mietrecht kontaktieren", s: "Für Rückforderung / Rechtsstreit" },
              { t: "Ergebnis per WhatsApp teilen", s: "Freunde und WG-Mitbewohner informieren" },
            ].map((s) => (
              <div key={s.t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "var(--bg)", marginBottom: 6, cursor: "pointer" }}>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 550, marginBottom: 1 }}>{s.t}</p>
                  <p style={{ fontSize: 12, color: "var(--dim)" }}>{s.s}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button
              onClick={() => {
                setView("landing");
                setFile(null);
                setFilter("all");
                setError(null);
                setExtracted(null);
                setAnalysis(null);
              }}
              style={{ background: "none", border: "1px solid var(--line)", color: "var(--fg)", padding: "10px 28px", borderRadius: 8, fontSize: 13, fontWeight: 550, cursor: "pointer" }}
            >
              Neuen Vertrag prüfen
            </button>
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: "var(--dim)", marginTop: 20, lineHeight: 1.5 }}>⚖️ Automatisierte Ersteinschätzung auf Basis öffentlicher Rechtsprechung · Keine Rechtsberatung i.S.d. RDG</p>
        </div>
      )}
    </div>
  );
}
