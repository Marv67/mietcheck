/**
 * Report-Versiegelung (Bezahl-Schutz).
 *
 * Die bezahlpflichtigen Report-Felder (Erklaerung, Rechtsfolge,
 * Handlungsempfehlung, Rechtsgrundlage, Leitentscheidungen) werden
 * verschluesselt an den Client geliefert. Erst nach verifizierter
 * Stripe-Zahlung gibt /api/unlock den Klartext zurueck.
 *
 * Verfahren:
 *  - Pro Analyse wird eine zufaellige `analysisId` (UUID) erzeugt.
 *  - Der Schluessel K = HMAC-SHA256(UNLOCK_SECRET, analysisId) (32 Byte).
 *  - Verschluesselung: AES-256-GCM (IV 12 Byte, Auth-Tag 16 Byte).
 *  - sealed = base64( IV | TAG | CIPHERTEXT ).
 *
 * Sicherheit:
 *  - Der Schluessel ist pro Analyse einzigartig und nur aus dem
 *    geheimen UNLOCK_SECRET ableitbar. Ohne dieses Secret kann der
 *    Client den Blob NICHT entschluesseln, obwohl analysisId im Klartext
 *    vorliegt.
 *  - Die Stripe-Session bindet (via metadata.analysisId) genau einen
 *    bezahlten Report. Ein bezahlter Blob A kann nicht zum Entsperren
 *    eines anderen Blobs B missbraucht werden: der aus A abgeleitete
 *    Schluessel laesst B's GCM-Auth-Tag fehlschlagen.
 *  - UNLOCK_SECRET MUSS in Produktion gesetzt sein. Ist es nicht
 *    gesetzt, schlaegt seal()/open() in Produktion bewusst fehl
 *    (fail-closed) — ein vorhersehbares Secret wuerde den gesamten
 *    Schutz aushebeln.
 */

import crypto from "node:crypto";

function secret(): string {
  const s = process.env.UNLOCK_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "UNLOCK_SECRET ist nicht (ausreichend) gesetzt — Report-Verschluesselung deaktiviert.",
    );
  }
  // Nur fuer lokale Entwicklung ohne gesetztes Secret.
  return "dev-insecure-unlock-secret-do-not-use-in-production";
}

function keyFor(analysisId: string): Buffer {
  return crypto.createHmac("sha256", secret()).update(analysisId).digest();
}

/**
 * Verschluesselt ein beliebiges JSON-serialisierbares Objekt.
 * Gibt die zufaellige analysisId und den base64-Blob zurueck.
 */
export function seal(payload: unknown): { analysisId: string; sealed: string } {
  const analysisId = crypto.randomUUID();
  const key = keyFor(analysisId);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const plaintext = Buffer.from(JSON.stringify(payload), "utf8");
  const ct = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  const sealed = Buffer.concat([iv, tag, ct]).toString("base64");
  return { analysisId, sealed };
}

/**
 * Entschluesselt einen Blob mit dem aus analysisId abgeleiteten Schluessel.
 * Wirft, wenn der Blob nicht zur analysisId passt (Auth-Tag ungueltig)
 * oder manipuliert wurde.
 */
export function open<T = unknown>(analysisId: string, sealed: string): T {
  const key = keyFor(analysisId);
  const raw = Buffer.from(sealed, "base64");
  if (raw.length < 12 + 16 + 1) {
    throw new Error("Versiegelter Report ist unvollstaendig.");
  }
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const ct = raw.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  return JSON.parse(pt.toString("utf8")) as T;
}
