/**
 * POST /api/unlock
 *
 * Gibt die bezahlpflichtigen Report-Details (Klartext) zurueck —
 * aber nur nach verifizierter Stripe-Zahlung.
 *
 * Body: { session_id: string, sealed: string }
 *
 * Ablauf:
 *  1. Stripe-Checkout-Session serverseitig abrufen.
 *  2. payment_status === "paid" pruefen (sonst 402).
 *  3. analysisId aus session.metadata lesen (an die Zahlung gebunden).
 *  4. Den uebergebenen `sealed`-Blob mit dem aus analysisId abgeleiteten
 *     Schluessel entschluesseln. Schlaegt fehl, wenn der Blob nicht zu
 *     dieser (bezahlten) analysisId gehoert.
 *
 * Sicherheit: Die analysisId stammt AUSSCHLIESSLICH aus den
 * Stripe-Metadaten der bezahlten Session — nie aus dem Client-Body.
 * Dadurch kann eine Zahlung fuer Report A nicht zum Entsperren eines
 * anderen Reports B verwendet werden.
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { open } from "@/lib/seal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY ist nicht gesetzt.");
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: { session_id?: unknown; sealed?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body ist kein gueltiges JSON." }, { status: 400 });
  }

  const sessionId = typeof body.session_id === "string" ? body.session_id : "";
  const sealed = typeof body.sealed === "string" ? body.sealed : "";
  if (!sessionId || !sealed) {
    return NextResponse.json({ ok: false, error: "session_id und sealed sind erforderlich." }, { status: 400 });
  }

  let stripe: Stripe;
  try {
    stripe = stripeClient();
  } catch {
    return NextResponse.json({ ok: false, error: "Zahlungs-Service nicht verfuegbar." }, { status: 503 });
  }

  // ─── Zahlung verifizieren ───
  let analysisId = "";
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ ok: false, error: "Zahlung nicht bestaetigt." }, { status: 402 });
    }
    analysisId = (session.metadata?.analysisId as string | undefined) ?? "";
  } catch (err) {
    console.error("[unlock] Stripe-Fehler:", err);
    return NextResponse.json({ ok: false, error: "Zahlung konnte nicht geprueft werden." }, { status: 502 });
  }

  if (!analysisId) {
    return NextResponse.json({ ok: false, error: "Zahlung ist keinem Report zugeordnet." }, { status: 400 });
  }

  // ─── Report entschluesseln (nur passender Blob entschluesselt erfolgreich) ───
  try {
    const details = open(analysisId, sealed);
    return NextResponse.json({ ok: true, details });
  } catch (err) {
    console.error("[unlock] Entschluesselung fehlgeschlagen:", err);
    return NextResponse.json(
      { ok: false, error: "Report konnte nicht entschluesselt werden." },
      { status: 400 },
    );
  }
}
