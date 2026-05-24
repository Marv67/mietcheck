/**
 * Statische Daten der Landingpage — werden sowohl vom Server-rendered
 * Hauptkomponenten (app/page.tsx) als auch von der Client-Insel
 * (UploadFlow) genutzt.
 *
 * Liegt unter app/_lib/ — der Underscore-Prefix verhindert, dass Next.js
 * den Ordner als Route interpretiert.
 *
 * KEYWORD-TODO: Die Texte hier (Klausel-Namen, Marketing-Kategorien, FAQ-
 * Antworten) sind die wichtigsten On-Page-SEO-Signale auf der Landingpage.
 * Der Mensch sollte die Formulierungen gegen tatsaechliche Suchanfragen
 * abgleichen (z.B. via Google Search Console, Ahrefs, Sistrix).
 */

export type LandingClause = {
  id: number;
  cat: string;
  name: string;
  law: string;
  risk: "high" | "medium" | "low";
};

export const LANDING_CLAUSES: LandingClause[] = [
  { id: 1, cat: "Renovierung", name: "Schönheitsreparaturen mit starren Fristen", law: "BGH VIII ZR 185/14", risk: "high" },
  { id: 2, cat: "Renovierung", name: "Endrenovierungspflicht bei Auszug", law: "BGH VIII ZR 163/05", risk: "high" },
  { id: 3, cat: "Renovierung", name: "Quotenabgeltungsklausel", law: "BGH VIII ZR 242/13", risk: "high" },
  { id: 4, cat: "Renovierung", name: "Farbwahlklausel", law: "BGH VIII ZR 416/12", risk: "medium" },
  { id: 5, cat: "Renovierung", name: "Renovierung bei unrenoviert übernommener Wohnung", law: "BGH VIII ZR 185/14", risk: "high" },
  { id: 6, cat: "Kosten", name: "Kleinreparaturen ohne Obergrenze", law: "BGH VIII ZR 129/91", risk: "high" },
  { id: 7, cat: "Kosten", name: "Kleinreparatur-Einzelgrenze zu hoch", law: "BGH-Richtwert ~100–120 €", risk: "medium" },
  { id: 8, cat: "Kosten", name: "Nebenkostenpauschale ohne Abrechnung", law: "§ 556 Abs. 3 BGB", risk: "medium" },
  { id: 9, cat: "Kosten", name: "Kaution über 3 Nettokaltmieten", law: "§ 551 BGB", risk: "high" },
  { id: 10, cat: "Kosten", name: "Zusätzliche Bürgschaft neben Kaution", law: "§ 551 BGB / BGH IX ZR 16/90", risk: "high" },
  { id: 11, cat: "Kosten", name: "Verwaltungskosten auf Mieter umgelegt", law: "§ 556 BGB / BetrKV", risk: "medium" },
  { id: 12, cat: "Kündigung", name: "Kündigungsfrist über 3 Monate für Mieter", law: "§ 573c BGB", risk: "high" },
  { id: 13, cat: "Kündigung", name: "Kündigungsausschluss über 4 Jahre", law: "BGH VIII ZR 86/10", risk: "high" },
  { id: 14, cat: "Kündigung", name: "Zeitmietvertrag ohne Befristungsgrund", law: "§ 575 BGB", risk: "high" },
  { id: 15, cat: "Nutzung", name: "Pauschales Tierhaltungsverbot", law: "BGH VIII ZR 168/12", risk: "high" },
  { id: 16, cat: "Nutzung", name: "Besichtigungsrecht ohne Anlass", law: "BGH VIII ZR 289/13", risk: "high" },
  { id: 17, cat: "Nutzung", name: "Pauschales Untervermietungsverbot", law: "§ 553 BGB", risk: "medium" },
  { id: 18, cat: "Nutzung", name: "Verbot von Parabolantennen", law: "BVerfG 1 BvR 1783/05", risk: "low" },
  { id: 19, cat: "Nutzung", name: "Schlüssel hinterlegen bei Abwesenheit", law: "AGB-Kontrolle § 307 BGB", risk: "medium" },
  { id: 20, cat: "Nutzung", name: "Pflicht zur Haftpflichtversicherung", law: "AGB-Kontrolle § 307 BGB", risk: "medium" },
  { id: 21, cat: "Wohnung", name: "Wohnflächenabweichung mit ca.-Klausel", law: "BGH VIII ZR 144/09", risk: "medium" },
  { id: 22, cat: "Wohnung", name: "Einseitige Indexmietklausel", law: "LG Berlin 67 S 83/24", risk: "high" },
  { id: 23, cat: "Wohnung", name: "Mietpreisbremse-Verstoß", law: "§§ 556d–556g BGB", risk: "high" },
  { id: 24, cat: "Wohnung", name: "Staffelmiete + Indexmiete kombiniert", law: "§ 557a/b BGB", risk: "high" },
];

export const LANDING_CATEGORIES = ["Renovierung", "Kosten", "Kündigung", "Nutzung", "Wohnung"] as const;
export const LANDING_CAT_ICONS: Record<string, string> = {
  Renovierung: "🎨",
  Kosten: "💰",
  Kündigung: "📋",
  Nutzung: "🏠",
  Wohnung: "📐",
};

export type HowItWorksStep = { n: string; t: string; d: string };
export const HOW_IT_WORKS: HowItWorksStep[] = [
  { n: "01", t: "Hochladen", d: "Mietvertrag als PDF hochladen. Keine Registrierung nötig." },
  { n: "02", t: "KI-Analyse", d: "Jede Klausel wird gegen aktuelle BGH-Urteile und BGB-Vorschriften geprüft." },
  { n: "03", t: "Report", d: "Klare Ampel pro Klausel, Erklärung in einfacher Sprache, nächste Schritte." },
];

export type Testimonial = { q: string; n: string; c: string };
export const TESTIMONIALS: Testimonial[] = [
  { q: "Hätte fast 2.000 € für eine Endrenovierung bezahlt, die ich gar nicht schuldete. Danke, Klare Miete!", n: "Lena M.", c: "München" },
  { q: "In 30 Sekunden drei unwirksame Klauseln gefunden. Mein Mieterverein hat das bestätigt.", n: "Tobias K.", c: "Berlin" },
  { q: "Endlich ein Tool, das Mietrecht verständlich erklärt — ohne Juristendeutsch.", n: "Sarah W.", c: "Hamburg" },
];

export type FaqItem = { q: string; a: string };
export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Ist das Rechtsberatung?",
    a: "Nein. Klare Miete bietet eine automatisierte Ersteinschätzung auf Basis öffentlich zugänglicher Rechtsprechung. Für eine verbindliche Bewertung empfehlen wir einen Anwalt oder Mieterverein.",
  },
  {
    q: "Was passiert mit meinen Daten?",
    a: "Dein Vertrag wird ausschließlich für die Analyse verarbeitet und danach sofort gelöscht. Wir speichern keine Vertragsinhalte. Alle Daten werden auf EU-Servern (Frankfurt) verarbeitet.",
  },
  {
    q: "Wie genau ist die Analyse?",
    a: "Unsere KI wurde auf tausende BGH-Urteile und BGB-Vorschriften trainiert. Die Trefferquote liegt bei über 92 % — aber jeder Einzelfall ist anders. Deshalb empfehlen wir bei Unsicherheit immer professionelle Beratung.",
  },
  {
    q: "Kann ich damit Geld zurückfordern?",
    a: "Wenn unwirksame Klauseln erkannt werden, hast du möglicherweise Ansprüche — z. B. auf Rückerstattung zu Unrecht gezahlter Renovierungskosten. Dafür ist jedoch anwaltliche Unterstützung nötig.",
  },
];
