# MietCheck – Vollständiger Prompt für Claude Code

## 1. PROJEKTÜBERSICHT

Baue eine seriöse, professionelle Web-App namens **MietCheck**, die Mietverträge analysiert. Der Nutzer lädt seinen Mietvertrag hoch (PDF oder Foto), die KI prüft jede Klausel auf Zulässigkeit und gibt eine detaillierte Auswertung mit BGH-Belegen, Rechtsfolgen und Handlungsempfehlungen.

**Zielgruppe:** Deutsche Mieter, die wissen wollen, ob ihr Mietvertrag faire Bedingungen enthält.

**Tonalität:** Seriös, rational, juristisch fundiert. Kein Marketing-Speak, keine Emojis im Analyseergebnis. Die Website soll wirken wie ein digitaler Fachanwalt – kompetent, nüchtern, vertrauenswürdig.

**Wissensbasis:** Die gesamte KI-Analyse basiert AUSSCHLIESSLICH auf der Datei `mietcheck_website_db.json`. Kein Halluzinieren, keine eigenen Einschätzungen. Wenn die Datenbank keinen passenden Eintrag hat, sagt die KI das ehrlich.

---

## 2. TECH-STACK

```
Frontend:    Next.js 14+ (App Router), TypeScript, Tailwind CSS
Backend:     Next.js API Routes / Server Actions
KI:          Claude API (Anthropic) – claude-sonnet-4-20250514
OCR:         Tesseract.js (clientseitig) oder Claude Vision API (PDF/Bilder direkt)
Datenbank:   mietcheck_website_db.json (als statische Wissensbasis, eingebunden als JSON-Import)
Auth:        Keine Registrierung nötig für Basis-Analyse
Payments:    Lemon Squeezy (für Premium-Features, optional)
Hosting:     Vercel (EU-Region: fra1)
Domain:      mietcheck.de / mietcheck.app
```

---

## 3. SYSTEM-PROMPT FÜR DIE MIETCHECK-KI

Dieser Prompt wird bei jedem API-Call an Claude gesendet:

```
Du bist MietCheck, ein rechtlicher Analyse-Assistent für deutsche Wohnraummietverträge.

KERNREGELN:
1. Du analysierst ausschließlich Klauseln aus deutschen Wohnraummietverträgen (§§ 535 ff. BGB).
2. Jede Aussage MUSS auf einen konkreten Eintrag in der MietCheck-Wissensdatenbank zurückführbar sein. Gibt es keinen passenden Eintrag, antwortest du: "Zu dieser Klausel liegt kein Datenbankeintrag vor. Eine rechtliche Einschätzung ist daher nicht möglich. Bitte konsultieren Sie einen Fachanwalt für Mietrecht."
3. Du verwendest KEINE eigenen Trainingsdaten zur rechtlichen Bewertung. Die Wissensdatenbank ist deine einzige Quelle.
4. Du bist kein Anwalt. Jede Analyse enthält den Disclaimer: "Diese Analyse ist eine automatisierte Ersteinschätzung. Sie ersetzt keine anwaltliche Beratung."
5. Antworte IMMER auf Deutsch.
6. Keine Emotionen, kein Smalltalk, keine Füllsätze. Sachlich, präzise, strukturiert.
7. Bei Unklarheit im Vertragstext: Beide möglichen Auslegungen mit jeweiliger Rechtsfolge angeben.
8. Bei mehreren Regelungsgegenständen in einer Klausel: Zerlege sie in Teilklauseln und prüfe jede einzeln.

ANALYSE-WORKFLOW:
Schritt 1 – EXTRAKTION: Lies den Vertragstext. Identifiziere und nummeriere jede Klausel.
Schritt 2 – KLASSIFIKATION: Ordne jede Klausel einer Kategorie zu (scan_keywords aus der DB nutzen).
Schritt 3 – PRÜFUNG: Gleiche mit der Wissensdatenbank ab. Prüfe auf: § 134 BGB (Verstoß gegen zwingendes Recht), § 307 BGB (unangemessene Benachteiligung), § 307 Abs. 1 S. 2 BGB (Transparenzgebot), § 305c BGB (überraschende Klauseln), Summierungseffekt.
Schritt 4 – ERGEBNIS: Strukturiertes Ergebnis pro Klausel.

AUSGABEFORMAT PRO KLAUSEL (JSON):
{
  "klausel_nr": 1,
  "vertragstext": "[Exakter Wortlaut]",
  "status": "unzulässig", // "zulässig" | "problematisch" | "unzulässig"
  "begruendung": "Kurze Begründung mit Norm",
  "rechtsfolge": "Nichtigkeit der Klausel. Gesetzliche Regelung tritt ein (§ 306 Abs. 2 BGB).",
  "leitentscheidung": {"gericht": "BGH", "aktenzeichen": "VIII ZR 185/14", "kernaussage": "..."},
  "handlungsempfehlung": "Was der Mieter tun sollte.",
  "db_referenz": "SR-004" // ID aus der Wissensdatenbank
}

GESAMTAUSWERTUNG (JSON):
{
  "gesamt": {
    "geprueft": 15,
    "zulaessig": 10,
    "problematisch": 2,
    "unzulaessig": 3,
    "score": 67, // Prozent zulässige Klauseln
    "bewertung": "Der Vertrag enthält 3 unwirksame Klauseln...",
    "handlungsbedarf": ["Priorität 1: ...", "Priorität 2: ...", "Priorität 3: ..."]
  }
}

ZUSATZFUNKTIONEN (bei Nutzerfragen):
- Bei Fragen zu Mietminderung: Modul "mietminderung" aus der DB verwenden
- Bei Fragen zu Nebenkosten: Modul "nebenkostenpruefung" verwenden
- Bei Fragen zur Mietpreisbremse: Modul "mietpreisbremse" mit Gemeinden-Lookup verwenden
- Bei Bedarf: Musterschreiben aus Modul "musterschreiben" personalisieren

VERBOTEN:
- Keine Rechtsberatung im Sinne des RDG
- Keine Einschätzungen außerhalb der Datenbank
- Keine Empfehlungen zu konkreten Anwälten oder Kanzleien
- Keine Aussagen zu Gewerbemietverträgen
- Keine Aussagen zu ausländischem Recht
```

---

## 4. SEITENSTRUKTUR

### 4.1 Landing Page (`/`)

Header: Logo "MietCheck" + Navigation (Analyse | So funktioniert's | Preise | FAQ)

Hero Section:
- Headline: "Mietvertrag prüfen lassen – in 2 Minuten"
- Subline: "Laden Sie Ihren Mietvertrag hoch. Unsere KI prüft jede Klausel auf Zulässigkeit – mit BGH-Belegen."
- CTA-Button: "Mietvertrag jetzt prüfen" → /analyse
- Trust-Elemente: "377 Gerichtsentscheidungen | 85 Klauseltypen | 54 Mietminderungs-Szenarien"

So funktioniert's (3 Schritte):
1. Mietvertrag hochladen (PDF, Foto oder Text)
2. KI analysiert jede Klausel
3. Detaillierter Bericht mit Handlungsempfehlungen

FAQ-Section (wichtig für SEO + RDG-Compliance):
- "Ist MietCheck eine Rechtsberatung?" → Nein. Automatisierte Ersteinschätzung. Keine Rechtsberatung i.S.d. RDG.
- "Woher stammen die Daten?" → BGH-Urteile, Instanzgerichte, Gesetze. Alle öffentlich zugänglich.
- "Werden meine Daten gespeichert?" → Nein. Vertrag wird nur für die Analyse verarbeitet und sofort gelöscht. Keine Speicherung auf Servern.
- "Wie genau ist die Analyse?" → Basiert auf 377 Gerichtsentscheidungen. Keine Garantie. Für verbindliche Einschätzung: Fachanwalt konsultieren.

Footer: Impressum | Datenschutz | AGB | Kontakt

### 4.2 Analyse-Seite (`/analyse`)

Upload-Bereich:
- Drag & Drop oder Klick für PDF/JPG/PNG
- Alternativ: Textfeld für Copy-Paste des Vertragstexts
- Max. Dateigröße: 10 MB
- Fortschrittsanzeige beim Upload

Analyse-Prozess (mit Ladeanimation):
- "Vertrag wird gelesen..." → "Klauseln werden identifiziert..." → "Klauseln werden geprüft..." → "Bericht wird erstellt..."

Ergebnis-Ansicht:
- Gesamtscore (Ampel: grün/gelb/rot) mit Prozentangabe
- Zusammenfassung (2-3 Sätze)
- Liste aller Klauseln mit Ampel-Status
- Klick auf Klausel → Detail-Ansicht mit vollem Analyse-Ergebnis
- Button: "Bericht als PDF herunterladen"
- Button: "Musterschreiben generieren" (falls unwirksame Klauseln gefunden)

### 4.3 Mietminderungs-Rechner (`/mietminderung`)

Formular:
- Dropdown: Art des Mangels (Heizung, Wasser, Schimmel, Lärm, etc.)
- Freitext: Beschreibung des Mangels
- Eingabe: Aktuelle Bruttowarmmiete
- Ergebnis: Minderungsquote, Urteil, Betrag/Monat, Handlungsempfehlung

### 4.4 Nebenkostenprüfung (`/nebenkosten`)

Upload der Nebenkostenabrechnung oder manuelle Eingabe der Positionen.
KI prüft formell (6 Punkte) + materiell (9 Punkte).

### 4.5 Mietpreisbremse-Check (`/mietpreisbremse`)

Formular:
- Eingabe: Stadt/Gemeinde (Autocomplete aus den 631 Gemeinden der DB)
- Eingabe: Aktuelle Kaltmiete
- Eingabe: Wohnungsgröße in qm
- Ergebnis: Gilt die Mietpreisbremse? Wie hoch dürfte die Miete maximal sein? Wie viel kann zurückgefordert werden?

### 4.6 Rechtliche Seiten

- `/impressum` — Impressum (s. Abschnitt 7)
- `/datenschutz` — Datenschutzerklärung (s. Abschnitt 6)
- `/agb` — AGB (s. Abschnitt 8)

---

## 5. DESIGN-VORGABEN

### Ästhetik: "Digitale Kanzlei" – seriös, vertrauenswürdig, kühl-professionell

Farbpalette:
```css
:root {
  --primary: #1B2A4A;       /* Dunkles Navy – Vertrauen, Seriosität */
  --primary-light: #2D4A7A; /* Helleres Navy für Hover */
  --accent: #C8A962;        /* Gedämpftes Gold – Qualität, Wertigkeit */
  --success: #2E7D32;       /* Dunkelgrün – zulässig */
  --warning: #E65100;       /* Dunkelorange – problematisch */
  --danger: #B71C1C;        /* Dunkelrot – unzulässig */
  --bg: #FAFAF8;            /* Warmes Off-White */
  --bg-card: #FFFFFF;
  --text: #1A1A1A;
  --text-secondary: #5A5A5A;
  --border: #E0DED8;
}
```

Typografie:
```css
/* Headlines: Playfair Display – klassisch, juristisch, seriös */
font-family: 'Playfair Display', serif;

/* Body: Source Serif 4 – gut lesbar, professionell */
font-family: 'Source Serif 4', serif;

/* UI-Elemente/Daten: DM Sans – clean, modern */
font-family: 'DM Sans', sans-serif;
```

Layout-Prinzipien:
- Großzügiger Weißraum – nichts wirkt gedrängt
- Kein Gradient-Kitsch, keine Schatten-Orgien
- Klare Hierarchie: Headlines > Subtext > Body
- Karten-Design für Klausel-Ergebnisse mit dezenter Border
- Ampel-System: Nur farbige Kreise/Balken, keine bunten Hintergründe
- Mobile First – die meisten Mieter nutzen ihr Handy

Animationen:
- Minimal. Nur beim Analyse-Prozess eine dezente Ladeanimation
- Keine Bounces, keine Slides, kein Confetti
- Einzig: sanftes Fade-In der Ergebnisse

---

## 6. DATENSCHUTZERKLÄRUNG (DSGVO-KONFORM)

Die folgende Datenschutzerklärung muss auf `/datenschutz` eingebunden werden. MK muss die [Platzhalter] mit den eigenen Daten befüllen:

```markdown
# Datenschutzerklärung

## 1. Verantwortlicher
[Name, Adresse, E-Mail – identisch mit Impressum]

## 2. Grundsätzliches
Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Diese Datenschutzerklärung informiert Sie darüber, welche Daten wir erheben, wie wir sie verarbeiten und welche Rechte Sie haben.

## 3. Hosting
Diese Website wird bei Vercel Inc. gehostet (EU-Region Frankfurt). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an zuverlässigem Webhosting). Vercel verarbeitet dabei Zugriffsdaten (IP-Adresse, Datum, Uhrzeit, aufgerufene Seite, Browser-Typ). Diese Daten werden nicht mit anderen Datenquellen zusammengeführt.

Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
Datenverarbeitung auf EU-Servern (Region Frankfurt). Angemessenheitsbeschluss der EU-Kommission für die USA (Data Privacy Framework).

## 4. Mietvertragsanalyse
Wenn Sie einen Mietvertrag zur Analyse hochladen, wird der Vertragstext an die Anthropic API (Claude) übermittelt, um die Analyse durchzuführen.

- **Verarbeitete Daten:** Vertragstext (kann personenbezogene Daten enthalten: Namen, Adressen, Mietkonditionen)
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO (Ihre ausdrückliche Einwilligung vor dem Upload)
- **Speicherung:** Der Vertragstext wird NICHT auf unseren Servern gespeichert. Er wird ausschließlich für die Dauer der Analyse an die Anthropic API übermittelt und danach verworfen.
- **Auftragsverarbeiter:** Anthropic, PBC, 548 Market St, PMB 90375, San Francisco, CA 94104, USA. Verarbeitung auf Grundlage eines Data Processing Agreements (DPA). Anthropic speichert API-Anfragen nicht dauerhaft (Zero Data Retention Policy auf Anfrage aktivierbar).

**Wichtig:** Wir empfehlen, personenbezogene Daten (Namen, Adressen) im Mietvertrag vor dem Upload zu schwärzen, sofern diese für die Klauselprüfung nicht relevant sind.

## 5. Cookies
Diese Website verwendet ausschließlich technisch notwendige Cookies:

| Cookie | Zweck | Speicherdauer |
|--------|-------|---------------|
| session_id | Zuordnung der Analyse-Sitzung | Sitzungsende |
| cookie_consent | Speicherung Ihrer Cookie-Einwilligung | 12 Monate |

Es werden KEINE Tracking-Cookies, Marketing-Cookies oder Analyse-Tools (kein Google Analytics, kein Facebook Pixel) eingesetzt.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (technisch notwendige Cookies sind ohne Einwilligung zulässig, § 25 Abs. 2 Nr. 2 TDDDG).

## 6. Zahlungsabwicklung (sofern Premium-Features angeboten werden)
Zahlungen werden über Lemon Squeezy (Lemon Squeezy, LLC) abgewickelt. Wir erhalten keine Kreditkartendaten. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).

## 7. Ihre Rechte
Sie haben das Recht auf:
- **Auskunft** (Art. 15 DSGVO)
- **Berichtigung** (Art. 16 DSGVO)
- **Löschung** (Art. 17 DSGVO)
- **Einschränkung der Verarbeitung** (Art. 18 DSGVO)
- **Datenübertragbarkeit** (Art. 20 DSGVO)
- **Widerspruch** (Art. 21 DSGVO)
- **Widerruf der Einwilligung** (Art. 7 Abs. 3 DSGVO)

Kontakt: [E-Mail]

## 8. Beschwerderecht
Sie haben das Recht auf Beschwerde bei einer Datenschutz-Aufsichtsbehörde. Zuständig: [Bayerisches Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach – für Bayern]

## 9. Änderungen
Wir behalten uns vor, diese Datenschutzerklärung anzupassen. Stand: [Datum]
```

---

## 7. IMPRESSUM

Pflichtangaben nach § 5 TMG / § 18 MStV. MK muss die [Platzhalter] befüllen:

```markdown
# Impressum

## Angaben gemäß § 5 TMG

[Vor- und Nachname]
[Straße und Hausnummer]
[PLZ Ort]
Deutschland

## Kontakt
E-Mail: [E-Mail-Adresse]
Telefon: [optional, aber empfohlen]

## Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
[Vor- und Nachname]
[Adresse wie oben]

## Hinweis gemäß RDG
MietCheck bietet eine automatisierte Ersteinschätzung von Mietvertragsklauseln auf Basis öffentlich zugänglicher Gerichtsentscheidungen und Gesetze. MietCheck erbringt KEINE Rechtsberatung im Sinne des Rechtsdienstleistungsgesetzes (RDG). Die Ergebnisse ersetzen nicht die Beratung durch einen zugelassenen Rechtsanwalt. Für eine verbindliche rechtliche Einschätzung wenden Sie sich bitte an einen Fachanwalt für Mietrecht oder Ihren örtlichen Mieterverein.

## Haftungsausschluss
Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Analysen und Informationen übernehmen wir keine Gewähr. Die Nutzung der Analyseergebnisse erfolgt auf eigene Verantwortung des Nutzers.

## Streitschlichtung
Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/
Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
```

---

## 8. AGB (Allgemeine Geschäftsbedingungen)

```markdown
# Allgemeine Geschäftsbedingungen (AGB)

Stand: [Datum]

## § 1 Geltungsbereich
(1) Diese AGB gelten für die Nutzung der Website MietCheck ([URL]), betrieben von [Name, Adresse].
(2) MietCheck bietet eine automatisierte Ersteinschätzung von Mietvertragsklauseln. Es handelt sich NICHT um Rechtsberatung im Sinne des RDG.

## § 2 Leistungsbeschreibung
(1) MietCheck ermöglicht das Hochladen und die automatisierte Analyse von Wohnraummietverträgen nach deutschem Recht.
(2) Die Analyse basiert auf einer Wissensdatenbank mit Gesetzen, BGH-Urteilen und Instanzgerichts-Rechtsprechung.
(3) Die Analyseergebnisse stellen eine unverbindliche Ersteinschätzung dar. Sie ersetzen keine anwaltliche Beratung.

## § 3 Nutzungsbedingungen
(1) Die Nutzung von MietCheck ist ab 18 Jahren gestattet.
(2) Der Nutzer versichert, dass er berechtigt ist, den hochgeladenen Mietvertrag zur Analyse einzureichen (eigener Vertrag oder Vollmacht).
(3) Es dürfen ausschließlich deutsche Wohnraummietverträge hochgeladen werden. Gewerbemietverträge, Pachtverträge und ausländische Verträge werden nicht analysiert.

## § 4 Datenschutz und Datenverarbeitung
(1) Hochgeladene Mietverträge werden ausschließlich für die Dauer der Analyse verarbeitet und nicht dauerhaft gespeichert.
(2) Es gelten die Bestimmungen unserer Datenschutzerklärung.

## § 5 Haftung
(1) MietCheck haftet nicht für die Richtigkeit, Vollständigkeit oder Aktualität der Analyseergebnisse.
(2) Die Nutzung der Ergebnisse erfolgt auf eigenes Risiko des Nutzers.
(3) MietCheck haftet nicht für Schäden, die durch die Nutzung oder Nichtnutzung der bereitgestellten Informationen entstehen, es sei denn, es liegt Vorsatz oder grobe Fahrlässigkeit vor.
(4) Die Haftung für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit bleibt unberührt.

## § 6 Preise und Zahlung (sofern Premium-Features angeboten werden)
(1) Die Basis-Analyse ist kostenlos / kostet [Betrag] EUR pro Analyse.
(2) Premium-Features werden über den Zahlungsdienstleister Lemon Squeezy abgewickelt.
(3) Es gelten die zum Zeitpunkt der Bestellung angegebenen Preise.
(4) Widerrufsrecht: Bei digitalen Inhalten erlischt das Widerrufsrecht mit Beginn der Analyse, sofern der Nutzer ausdrücklich zugestimmt hat (§ 356 Abs. 5 BGB).

## § 7 Urheberrecht
(1) Alle Inhalte der Website (Texte, Analysen, Datenbank) sind urheberrechtlich geschützt.
(2) Die Analyseergebnisse dürfen vom Nutzer für private Zwecke verwendet werden. Eine kommerzielle Weiterverwendung ist nicht gestattet.

## § 8 Schlussbestimmungen
(1) Es gilt das Recht der Bundesrepublik Deutschland.
(2) Gerichtsstand ist, soweit gesetzlich zulässig, [Ort].
(3) Sollten einzelne Bestimmungen unwirksam sein, berührt dies die Wirksamkeit der übrigen Bestimmungen nicht.
```

---

## 9. COOKIE-BANNER

Da MietCheck NUR technisch notwendige Cookies verwendet (kein Tracking, kein Google Analytics), ist ein Cookie-Banner nach § 25 Abs. 2 Nr. 2 TDDDG streng genommen NICHT erforderlich. Trotzdem empfohlen für Vertrauen:

```
Einfacher, nicht-blockierender Hinweis (kein Popup, kein Overlay):

"Diese Website verwendet ausschließlich technisch notwendige Cookies. 
Keine Tracking- oder Marketing-Cookies. Mehr erfahren → [Link zu /datenschutz]"
[Verstanden]
```

Kein Cookie-Wall, kein "Alle akzeptieren/ablehnen"-Dialog nötig, da keine Einwilligung erforderlich ist.

---

## 10. RDG-COMPLIANCE (RECHTLICH KRITISCH)

MietCheck bewegt sich im Grenzbereich des Rechtsdienstleistungsgesetzes (RDG). Damit die App KEINE unerlaubte Rechtsberatung darstellt, müssen folgende Punkte ZWINGEND eingehalten werden:

1. **Disclaimer auf JEDER Ergebnisseite:**
   "Diese Analyse ist eine automatisierte Ersteinschätzung auf Basis öffentlich zugänglicher Gerichtsentscheidungen und Gesetze. Sie stellt keine Rechtsberatung im Sinne des RDG dar und ersetzt nicht die Beratung durch einen zugelassenen Rechtsanwalt."

2. **Keine Einzelfallberatung:**
   Die KI gibt keine individuellen Handlungsanweisungen ("Sie sollten klagen"), sondern allgemeine Einschätzungen ("Diese Klausel ist nach BGH-Rechtsprechung unwirksam. Ein Fachanwalt kann Ihre individuelle Situation bewerten.").

3. **Keine Vertretung:**
   MietCheck erstellt keine Schriftsätze für Gerichte, keine Klageschriften, keine Anwaltspost. Die Musterschreiben sind Vorlagen zur Eigenverwendung.

4. **Kennzeichnung als Informationsdienst:**
   MietCheck ist ein "Informationsdienst" / "Legal-Tech-Tool" – kein Rechtsdienstleister.

5. **Empfehlung zur anwaltlichen Beratung:**
   Bei jeder als "unzulässig" bewerteten Klausel: Hinweis "Für eine verbindliche Einschätzung empfehlen wir die Beratung durch einen Fachanwalt für Mietrecht oder Ihren örtlichen Mieterverein."

---

## 11. EINWILLIGUNGS-FLOW VOR DEM UPLOAD

Bevor der Nutzer seinen Mietvertrag hochlädt, MUSS er folgende Einwilligung geben (DSGVO Art. 6 Abs. 1 lit. a):

```
Checkbox (nicht vorausgewählt):

☐ Ich willige ein, dass mein Mietvertrag zur Analyse an die Anthropic API 
  übermittelt wird. Der Vertragstext wird ausschließlich für die Dauer der 
  Analyse verarbeitet und nicht dauerhaft gespeichert. 
  Ich habe die Datenschutzerklärung gelesen.

[Mietvertrag hochladen und analysieren]
```

Button ist NICHT klickbar, solange Checkbox nicht aktiviert ist.

---

## 12. API-CALL ARCHITEKTUR

```typescript
// /app/api/analyse/route.ts

import { Anthropic } from '@anthropic-ai/sdk';
import wissensdatenbank from '@/data/mietcheck_website_db.json';

const client = new Anthropic();

export async function POST(req: Request) {
  const { vertragstext } = await req.json();
  
  // Relevante Module aus der DB laden
  const klauselpruefung = wissensdatenbank.klauselpruefung;
  
  const systemPrompt = `
    [System-Prompt aus Abschnitt 3 einfügen]
    
    WISSENSDATENBANK (Klauselprüfung):
    ${JSON.stringify(klauselpruefung.klauseln)}
  `;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{
      role: 'user',
      content: `Analysiere folgenden Mietvertrag. Prüfe jede Klausel einzeln.\n\n${vertragstext}`
    }]
  });

  return Response.json(response);
}
```

**Hinweis:** Die gesamte Wissensdatenbank (329 KB) passt in den System-Prompt. Bei Bedarf können Module selektiv geladen werden (z.B. nur Klauselprüfung für die Hauptanalyse, Mietminderung nur bei entsprechender Nutzerfrage).

---

## 13. SEO / META

```html
<title>MietCheck – Mietvertrag prüfen lassen | KI-Analyse auf Anwaltsniveau</title>
<meta name="description" content="Laden Sie Ihren Mietvertrag hoch. MietCheck prüft jede Klausel auf Zulässigkeit – mit 377 BGH-Belegen. Kostenlose Erstanalyse." />
<meta name="keywords" content="Mietvertrag prüfen, Mietrecht, Klausel unwirksam, Schönheitsreparaturen, Mietminderung, Nebenkosten prüfen, Mietpreisbremse" />
<meta property="og:title" content="MietCheck – Mietvertrag prüfen lassen" />
<meta property="og:description" content="KI-gestützte Mietvertragsanalyse auf Anwaltsniveau. 377 Gerichtsentscheidungen. Kostenlose Erstanalyse." />
```

---

## 14. ZUSAMMENFASSUNG FÜR CLAUDE CODE

```
Baue die MietCheck Web-App mit diesem Prompt:

Tech: Next.js 14+, TypeScript, Tailwind CSS, Claude API
Design: "Digitale Kanzlei" – Navy (#1B2A4A), Gold-Akzent (#C8A962), Playfair Display + Source Serif 4
Wissensbasis: mietcheck_website_db.json (als JSON importiert)

Seiten: 
  / (Landing), /analyse (Upload + Ergebnis), /mietminderung (Rechner), 
  /nebenkosten (Prüfung), /mietpreisbremse (Check), 
  /impressum, /datenschutz, /agb

Features:
  1. PDF/Foto-Upload → OCR/Vision → Klauselextraktion → KI-Analyse → Bericht
  2. Mietminderungs-Rechner
  3. Nebenkosten-Prüfung
  4. Mietpreisbremse-Check (mit Gemeinden-Autocomplete)
  5. Musterschreiben-Generator
  6. PDF-Export des Analyse-Berichts

Rechtlich: 
  RDG-Disclaimer auf jeder Ergebnisseite
  DSGVO-Einwilligung vor Upload
  Nur technisch notwendige Cookies
  Impressum, Datenschutz, AGB als separate Seiten

Hosting: Vercel EU (fra1)
```
