# MietCheck.de — Vollständiger MVP-Bauplan

## Executive Summary

**Produkt:** KI-gestützter Mietvertrags-Analysator für deutsche Mieter
**Zielgruppe:** 21+ Mio. Mieterhaushalte in Deutschland
**Preis:** Freemium (3 Klauseln gratis) → 4,99–9,99 € Vollreport
**Zeithorizont MVP:** 8 Wochen bei 5–10 h/Woche
**Gesamtkosten MVP:** ~500–800 €
**Ziel Monat 12:** 500 zahlende Nutzer × 9,99 € = ~5.000 € MRR

---

## 1. Die 12 Klauseln, die MietCheck prüft

### MVP-Klauseln (Launch)

| # | Klausel | Typisches Problem | Rechtsgrundlage |
|---|---------|-------------------|-----------------|
| 1 | Schönheitsreparaturen mit starren Fristen | "Alle 3 Jahre Bad, alle 5 Jahre Wohnräume" → unwirksam | BGH VIII ZR 185/14 |
| 2 | Endrenovierungspflicht | "Bei Auszug ist zu renovieren" → unwirksam wenn pauschal | BGH VIII ZR 163/05 |
| 3 | Quotenabgeltungsklausel | Anteilige Renovierungskosten bei Auszug → unwirksam | BGH VIII ZR 242/13 |
| 4 | Kleinreparaturklausel ohne Grenzen | Ohne Einzel- UND Jahresobergrenze → unwirksam | BGH VIII ZR 129/91 |
| 5 | Pauschales Tierhaltungsverbot | "Tierhaltung ist untersagt" → unwirksam | BGH VIII ZR 168/12 |

### Erweiterung (Monat 2–3)

| # | Klausel | Typisches Problem | Rechtsgrundlage |
|---|---------|-------------------|-----------------|
| 6 | Kündigungsfrist > 3 Monate für Mieter | Gesetzlich max. 3 Monate für Mieter | § 573c BGB |
| 7 | Kündigungsausschluss > 4 Jahre | Max. 4 Jahre beidseitig | BGH VIII ZR 86/10 |
| 8 | Besichtigungsrecht ohne konkreten Anlass | "Vermieter darf jederzeit besichtigen" → unwirksam | BGH VIII ZR 289/13 |
| 9 | Wohnfläche mit "ca."-Einschränkung | Schützt nicht vor Mietminderung bei >10% Abweichung | BGH VIII ZR 144/09 |
| 10 | Kaution > 3 Nettokaltmieten | Max. 3 Nettokaltmieten erlaubt | § 551 BGB |
| 11 | Einseitige Indexmietklausel | Nur Erhöhungen, keine Senkungen → unwirksam | LG Berlin 67 S 83/24 |
| 12 | Zeitmietvertrag ohne Befristungsgrund | Grund muss schriftlich bei Vertragsschluss vorliegen | § 575 BGB |

### Upsell-Feature: Mietpreisbremse-Check

Prüft, ob die Miete in einem Gebiet mit Mietpreisbremse mehr als 10% über der ortsüblichen Vergleichsmiete liegt (§§ 556d–556g BGB). Dafür Mietspiegel-Daten der jeweiligen Stadt einbinden.

---

## 2. Tech-Stack im Detail

### Frontend
- **Next.js 14** (App Router) — React-Framework mit SSR, perfekt für SEO
- **Tailwind CSS** + **shadcn/ui** — schnelles, professionelles UI ohne Design-Skills
- **react-pdf** oder **pdf.js** — PDF-Vorschau im Browser

### Backend
- **Next.js API Routes** — kein separater Backend-Server nötig
- **pdf-parse** (npm) — serverseite PDF-Text-Extraktion
- **Anthropic Claude API** — Kernstück der Analyse
  - Modell: `claude-sonnet-4-20250514` (gutes Preis-Leistungs-Verhältnis)
  - Kosten: ~0,003 $ pro 1K Input-Tokens, ~0,015 $ pro 1K Output-Tokens
  - Ein typischer Mietvertrag (5-10 Seiten) = ca. 3.000–6.000 Tokens Input
  - **Kosten pro Analyse: ~0,10–0,30 €**

### Datenbank & Auth
- **Supabase** (Frankfurt-Region!)
  - PostgreSQL-Datenbank
  - Built-in Auth (E-Mail, Google, Apple)
  - Row Level Security — jeder User sieht nur seine Verträge
  - Free Tier: 500 MB Datenbank, 50.000 Auth-Nutzer

### Zahlungen
- **Lemon Squeezy** (empfohlen) oder **Stripe**
  - Lemon Squeezy: Merchant of Record → kümmert sich um EU-Umsatzsteuer
  - Kein eigenes Umsatzsteuer-Setup nötig als Kleinunternehmer
  - 5% + 0,50 € pro Transaktion (Lemon Squeezy)

### Hosting
- **Vercel** — Free Tier (100 GB Bandwidth, 100 Deployments/Tag)
- **Domain:** z.B. mietcheck.de über Namecheap (~12 €/Jahr)

### DSGVO-Compliance
- Supabase EU-Region (Frankfurt) — Daten bleiben in der EU
- Auftragsverarbeitungsvertrag (AV-Vertrag) mit Anthropic abschließen
- Datenschutzerklärung: Welche Daten verarbeitet werden, Rechtsgrundlage (Art. 6 Abs. 1 lit. b DSGVO)
- **Vertragstexte NICHT dauerhaft speichern** — nach Analyse löschen oder nur Hash behalten
- Cookie-Banner nicht nötig, wenn keine Tracking-Cookies verwendet werden

---

## 3. KI-Prompt-Architektur (das Herzstück)

### System-Prompt (vereinfacht)

```
Du bist ein Mietvertrags-Analysesystem für den deutschen Wohnungsmarkt.

AUFGABE: Analysiere den folgenden Mietvertragstext auf potenziell unwirksame Klauseln.

WICHTIG:
- Dies ist KEINE Rechtsberatung, sondern eine automatisierte Ersteinschätzung
- Antworte IMMER im vorgegebenen JSON-Format
- Wenn eine Klausel nicht eindeutig bewertbar ist, setze Status auf "unklar"
- Zitiere die relevante Rechtsgrundlage (BGH-Urteil oder BGB-Paragraph)
- Erkläre in einfacher, verständlicher Sprache (kein Juristendeutsch)

PRÜFE FOLGENDE KLAUSELN:
1. Schönheitsreparaturen: Starre Fristen ("alle X Jahre") → unwirksam (BGH VIII ZR 185/14)
   Flexible Formulierungen ("im Allgemeinen", "bei Bedarf") → wirksam
2. Endrenovierung: Pauschal bei Auszug → unwirksam (BGH VIII ZR 163/05)
3. Quotenabgeltung: Anteilige Kosten ohne konkreten Bedarf → unwirksam
4. Kleinreparaturen: Ohne Einzelgrenze (~100€) UND Jahresgrenze (6-8% Jahresmiete) → unwirksam
5. Tierhaltung: Pauschales Verbot → unwirksam (BGH VIII ZR 168/12)
   Erlaubnisvorbehalt mit Einzelfallprüfung → wirksam

OUTPUT-FORMAT (JSON):
{
  "klauseln": [
    {
      "id": 1,
      "name": "Schönheitsreparaturen",
      "status": "unwirksam" | "wirksam" | "unklar" | "nicht_gefunden",
      "zitat": "Exaktes Zitat aus dem Vertrag",
      "erklaerung": "Erklärung in einfacher Sprache",
      "rechtsgrundlage": "BGH VIII ZR 185/14",
      "handlungsempfehlung": "Was der Mieter tun kann"
    }
  ],
  "zusammenfassung": {
    "gesamt_klauseln_geprueft": 5,
    "unwirksam": 2,
    "wirksam": 2,
    "unklar": 1,
    "risiko_score": "mittel"
  }
}
```

### Prompt-Engineering-Tipps

1. **Few-Shot-Beispiele einbauen** — 3-5 echte Klauseln mit korrekter Bewertung im System-Prompt
2. **Chain-of-Thought erzwingen** — "Erkläre zuerst, warum die Klausel problematisch ist, dann bewerte"
3. **Halluzinationsschutz** — "Erfinde KEINE BGH-Urteile. Wenn unsicher, antworte 'unklar'"
4. **Temperature auf 0 setzen** — maximale Konsistenz bei juristischen Analysen
5. **Vertrag in Chunks aufteilen** — bei sehr langen Verträgen in Abschnitte splitten

---

## 4. Rechtliche Absicherung

### RDG-Compliance (Rechtsdienstleistungsgesetz)

Das RDG verbietet außergerichtliche Rechtsberatung durch Nicht-Anwälte. So bleibst du sicher:

1. **Disclaimer auf jeder Seite:**
   > "MietCheck bietet eine automatisierte Ersteinschätzung auf Basis öffentlich zugänglicher Rechtsprechung. Dies stellt keine Rechtsberatung dar. Für eine verbindliche rechtliche Bewertung wenden Sie sich an einen Rechtsanwalt oder Ihren örtlichen Mieterverein."

2. **Keine individuellen Handlungsempfehlungen** — nur allgemeine Informationen
3. **Immer auf Anwalt/Mieterverein verweisen** — ist gleichzeitig dein Affiliate-Kanal
4. **Erlaubnisfreie Tätigkeit nach § 2 Abs. 3 Nr. 4 RDG:** Rechtsdienstleistungen, die in unmittelbarem Zusammenhang mit einer anderen Tätigkeit stehen (hier: Software-Dienstleistung), können erlaubt sein

### DSGVO-Absicherung

- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
- **Datensparsamkeit:** Vertragstexte nach Analyse löschen
- **AV-Vertrag** mit Anthropic (API-Anbieter) abschließen
- **Hosting in EU** (Supabase Frankfurt)
- **Kein Tracking** — keine Google Analytics, keine Cookies → kein Cookie-Banner nötig
- Alternative Analytics: Plausible oder Umami (Privacy-freundlich, EU-gehostet)

### EU AI Act

- Mietvertrags-Analyse ist **kein High-Risk-AI-System** (kein Scoring, keine biometrische Identifikation)
- Trotzdem: **AI Literacy** sicherstellen — Nutzer müssen wissen, dass KI die Analyse durchführt
- Transparenz-Hinweis: "Diese Analyse wird durch künstliche Intelligenz erstellt"

### Gewerbeanmeldung

- **Gewerbeanmeldung München:** Kreisverwaltungsreferat, ~50 €
- **Kleinunternehmerregelung** (§ 19 UStG): Bis 22.000 €/Jahr Umsatz keine USt-Pflicht
- **Wenn Lemon Squeezy als MoR:** Die kümmern sich um die USt → noch einfacher

---

## 5. Marketing-Strategie (0 € Budget)

### Viraler Wachstumshebel

Der Freemium-Scan ist der Motor. Ein Mieter scannt seinen Vertrag, findet 3 unwirksame Klauseln, und teilt das Ergebnis. Das Produkt verkauft sich durch den "Aha-Moment".

### Kanäle

| Kanal | Strategie | Aufwand |
|-------|-----------|--------|
| Reddit (r/germany, r/munich, r/wohnen) | Hilfreiche Posts zum Thema Mietrecht, Tool als Ressource verlinken | 1h/Woche |
| TikTok/Reels | "Wusstest du, dass 90% aller Mietverträge unwirksame Klauseln enthalten?" — kurze Erklärvideos | 2h/Woche |
| WG-gesucht Forum | Hilfreich in Mietrecht-Threads sein, Tool empfehlen | 30min/Woche |
| Uni-Gruppen (WhatsApp, Telegram) | "Lass deinen Mietvertrag kostenlos checken" an Studierende | Einmalig |
| LinkedIn | "Building in Public" — wöchentliche Updates über den Aufbau | 1h/Woche |
| Product Hunt | Launch-Day mit vorbereitetem Pitch | Einmalig |
| SEO | Blog-Artikel: "Schönheitsreparaturen im Mietvertrag — BGH-Urteile 2025" | 2h/Woche |

### Content-Ideen für virales Wachstum

1. "Die 5 teuersten Fehler in deinem Mietvertrag"
2. "Ich habe meinen Mietvertrag durch KI prüfen lassen — das Ergebnis schockiert"
3. "So sparst du 2.000 € bei deinem Auszug (Schönheitsreparaturen-Hack)"
4. "Dein Vermieter darf das nicht: 7 unwirksame Klauseln"

---

## 6. Skalierungspfad (nach MVP)

### Phase 2: Monat 3–6
- Mietpreisbremse-Check einbauen (ortsübliche Vergleichsmiete)
- Nebenkostencheck (häufige Fehler in Nebenkostenabrechnungen)
- Abo-Modell: 4,99 €/Monat für Monitoring + Updates bei Rechtsänderungen
- Affiliate-Partnerschaften mit Mieterverein und Mietrecht-Anwälten

### Phase 3: Monat 6–12
- B2B-Kanal: Paketpreise für Mietervereine und Verbraucherzentralen
- API für PropTech-Startups
- Widerspruchsbrief-Generator (automatisch generierte Schreiben an Vermieter)
- Mobile App (React Native / Expo)

### Phase 4: Nach dem Studium
- Ausbau zur vollständigen Legal-Tech-Plattform
- Mietrecht-Chatbot für laufende Fragen
- Expansion nach Österreich und Schweiz (ähnliches Mietrecht)
- Team aufbauen, ggf. Pre-Seed-Runde

---

## 7. Erste Schritte — diese Woche

- [ ] Domain sichern (mietcheck.de, mietcheck.app, mietpruefer.de)
- [ ] Gewerbe anmelden (München KVR, online möglich)
- [ ] Supabase-Projekt erstellen (EU-Region Frankfurt)
- [ ] Next.js-Projekt aufsetzen mit Cursor
- [ ] Anthropic API-Key beantragen
- [ ] 3 echte Mietverträge von Freunden/WG sammeln (für Testing)
- [ ] Landing Page mit E-Mail-Waitlist deployen
- [ ] Ersten TikTok-/Reddit-Post planen
