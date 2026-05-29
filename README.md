# MietCheck

Automatisierte Ersteinschätzung deutscher Wohnraummietverträge. Lädt einen Vertrag hoch, klassifiziert die enthaltenen Klauseln gegen eine kuratierte BGH-Rechtsprechungs-Datenbank und gibt ein Ampel-Ergebnis pro Klausel + Gesamtbewertung.

> **Disclaimer:** Automatisierte Ersteinschätzung. Keine Rechtsberatung i.S.d. RDG.

---

## Start

```bash
npm install
cp .env.local.example .env.local
# In .env.local eintragen (Details siehe .env.local.example):
#   ANTHROPIC_API_KEY   – sonst Mock-Modus
#   STRIPE_SECRET_KEY   – für den Bezahl-Flow (sk_test_… im Test)
#   UNLOCK_SECRET       – Report-Verschlüsselung; erzeugen: openssl rand -hex 32
npm run dev
```

Läuft auf `http://localhost:3000` (oder einem freien Port).

> **Deploy (Vercel):** Dieselben Env-Variablen in den Project Settings setzen.
> `UNLOCK_SECRET` ist in Produktion **Pflicht** — ohne ihn schlägt `/api/analyze`
> fail-closed fehl (die Bezahl-Details werden serverseitig verschlüsselt).
> `NEXT_PUBLIC_SITE_URL` auf die echte Domain setzen.

**Ohne API-Key** läuft die Analyse-Route im **Mock-Modus** — sie matched ein paar bekannte Patterns per Regex (Schönheitsreparaturen, Endrenovierung, Tierhaltungsverbot, Kaution > 3 NKM, Kleinreparaturen) und gibt strukturierte Sample-Ergebnisse zurück. Auf der Results-Seite erscheint dann ein gelbes Mock-Banner.

## Tech-Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** als utility framework (konfiguriert, aber das Page-Design nutzt inline styles aus dem Original-Mockup)
- **React 18**

## Projektstruktur

```
mietcheck/
├── app/
│   ├── api/
│   │   ├── extract/route.ts        # PDF-Text-Extraktion (pdf-parse, Node-Runtime)
│   │   ├── analyze/route.ts        # LLM-Analyse; trennt Gratis-/Bezahl-Felder, versiegelt
│   │   ├── checkout/route.ts       # Stripe-Checkout-Session (2,99 €)
│   │   ├── payment-verify/route.ts # Stripe-Redirect-Ziel, verifiziert Zahlung
│   │   └── unlock/route.ts         # entschlüsselt Bezahl-Details nach Zahlung
│   ├── layout.tsx             # Root-Layout + SEO-Metadata
│   ├── page.tsx               # Single-page app: Landing / Upload / Loading / Results
│   └── globals.css
├── lib/
│   ├── analyze.ts             # Anthropic-Call + Mock-Fallback + Enrichment
│   ├── clauses-index.ts       # Kompakter Klausel-Index für den Prompt + ID-Lookup
│   └── seal.ts                # AES-256-GCM Ver-/Entschlüsselung der Bezahl-Felder
├── data/
│   ├── klausel_db.json        # 260 Klauseln · 76 Kategorien · 377 Leitentscheidungen
│   ├── website_db.json        # Erweiterte Wissensdatenbank (Mietminderung, Nebenkosten, Mietpreisbremse, Musterschreiben)
│   ├── system_prompt.md       # Original-Konzeptpapier (Referenz)
│   └── MVP_Bauplan.md         # Strategie- und Roadmap-Dokument
├── .env.local.example         # Template für alle Env-Variablen (Anthropic, Stripe, UNLOCK_SECRET)
├── tailwind.config.ts
└── next.config.mjs            # externalisiert pdf-parse + pdfjs-dist für Node-Bundling
```

## LLM-Analyse — Architektur

Statt die 337KB klausel_db.json bei jedem Call mitzuschicken (teuer & langsam), läuft folgendes:

1. **`lib/clauses-index.ts`** baut beim ersten Zugriff einen kompakten Katalog aller 260 Klauseln (~47KB, ~12K Tokens) — eine Zeile pro Klausel mit ID, Kategorie, Typ, Status, BGH-Az, Norm, typischer Formulierung.
2. **`/api/analyze`** schickt diesen Katalog als **gecachten** System-Block an Claude (Prompt-Caching: erster Call zahlt voll, alle Folgecalls innerhalb 5 Min zahlen ~10% für den Cache-Read).
3. Claude antwortet mit JSON: pro identifizierter Klausel nur `{ id, status, zitat, erklaerung }` — keine BGH-Begründungen halluzinieren.
4. Server reichert die zurückgegebenen IDs aus `klausel_db.json` an (volle Rechtsfolge, Handlungsempfehlung, alle Leitentscheidungen) bevor die Antwort an den Client geht.

Vorteile: kleine Output-Tokens, kein Halluzinationsrisiko bei Aktenzeichen, deterministische Datenqualität pro Klausel.

Modell-Override per Env-Var: `ANTHROPIC_MODEL=claude-sonnet-4-5` (Default) oder beliebig anderes.

## Status MVP

Was läuft:

- [x] Landing Page mit Hero, How-it-Works, Klausel-Übersicht, Social Proof, Pricing, FAQ, CTA, Footer
- [x] PDF-Upload (Drag & Drop oder Klick)
- [x] **Echte PDF-Textextraktion** (`pdf-parse` v2, Node-Runtime, Edge-Cases abgefangen)
- [x] **LLM-Analyse** via Anthropic Claude mit Prompt-Caching gegen die 260-Klauseln-DB
- [x] Server-seitiges Enrichment der LLM-IDs aus der Original-DB (Rechtsfolge, Leitentscheidungen, Handlungsempfehlung)
- [x] Mock-Fallback ohne API-Key (Regex-basierte Schnellprüfung)
- [x] Results-View mit Statistik, Filter, ausklappbaren Klausel-Karten, Mock-Banner, Risiko-Indikator
- [x] Kuratierte Klausel-DB (260 Einträge · 76 Kategorien · 377 Leitentscheidungen · 285 Norm-Verweise)

Inzwischen ergänzt:

- [x] **Payment** via **Stripe Checkout** (2,99 € Einmalzahlung, `card` + `paypal`)
- [x] **Bezahl-Schutz serverseitig**: Bezahl-Felder AES-256-GCM-verschlüsselt (`lib/seal.ts`), Entschlüsselung erst nach verifizierter Zahlung (`/api/unlock`) — kein DevTools-Bypass mehr
- [x] **Mietpreisbremse-Check**, Mietminderungs-Rechner, Musterschreiben-Generator
- [x] **Impressum, Datenschutz, AGB, Kontakt** ausgearbeitet
- [x] **Vercel-Deployment** (Auto-Deploy vom `main`-Branch)

Was noch fehlt / offene Betreiber-Aufgaben:

- [ ] **OCR-Pipeline** für gescannte Image-PDFs (aktuell: `empty_text`-Fehler)
- [ ] **Stripe Live-Key** statt Test-Key + Webhook (optional; Verifizierung läuft on-demand)
- [ ] **`UNLOCK_SECRET`** als Vercel-Env-Variable setzen (Produktion sonst fail-closed)
- [ ] **Gewerbe anmelden** + DPAs (Anthropic, Vercel, Stripe) gegenzeichnen
- [ ] Persistenz optional (aktuell bewusst zustandslos & datensparsam — keine Vertragsspeicherung)

Plan im Detail: siehe `data/MVP_Bauplan.md`.

## Klausel-DB erweitern

`data/klausel_db.json` ist nach diesem Schema strukturiert:

```jsonc
{
  "kategorien": [
    {
      "kategorie_id": "SR",
      "kategorie_name": "Schönheitsreparaturen",
      "klauseln": [
        {
          "id": "SR-001",
          "klausel_typ": "...",
          "typische_formulierung": "...",
          "status": "unzulässig|bedingt_zulässig|zulässig",
          "norm": ["§ 307 Abs. 1 S. 1 BGB", ...],
          "rechtsfolge": "...",
          "leitentscheidungen": [{ "gericht": "BGH", "aktenzeichen": "VIII ZR 361/03", "datum": "...", "kernaussage": "..." }],
          "handlungsempfehlung": "..."
        }
      ]
    }
  ]
}
```

**Quellen-Workflow (urheberrechtssicher):**

1. Norm aus [gesetze-im-internet.de](https://gesetze-im-internet.de) (BMJV, gemeinfrei)
2. Einschlägige Urteile via [dejure.org](https://dejure.org) recherchieren
3. Volltexte von [bundesgerichtshof.de](https://bundesgerichtshof.de) oder [openjur.de](https://openjur.de) holen
4. Aktenzeichen, Datum und die rechtliche Kernaussage **in eigenen Worten** übernehmen
5. **Niemals** Formulierungen aus Palandt/Grüneberg, BeckOK, MüKo o.ä. kopieren

Amtliche Leitsätze (vom Gericht selbst formuliert) sind gemeinfrei. Verlags-Leitsätze (Beck, NJW) sind geschützt.

## Sicherheit

Die installierte Next.js-14-Version hat bekannte CVEs (Fix nur in Next 16, was ein Breaking-Upgrade ist). Vor Production-Deployment:

```bash
npm install next@latest
```

und gegebenenfalls App-Router-API-Brüche anpassen.

## RDG-Compliance

- Keine individuelle Rechtsberatung — nur allgemeine Information auf Basis öffentlicher Rechtsprechung
- Disclaimer auf jeder Ergebnisansicht (bereits im Footer der Results-View enthalten)
- Verweise auf Mieterverein/Anwalt als Next-Steps

## Lizenz

Privat — Marvin Kalkschmid.
