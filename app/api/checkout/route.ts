/**
 * POST /api/checkout
 *
 * Erstellt eine Stripe-Checkout-Session fuer die MietCheck-Vollanalyse
 * (2,99 EUR, Einmalzahlung). Gibt { url } zurueck; der Client leitet
 * den Browser dorthin weiter.
 *
 * Sicherheit: kein CSRF-Schutz noetig, weil der Endpunkt keine
 * sicherheitskritische Aktion ausfuehrt — er erstellt lediglich eine
 * Checkout-Session. Stripe selbst sichert die Zahlung.
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRICE_CENTS = 299; // 2,99 EUR
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY ist nicht gesetzt.");
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: { returnTo?: unknown };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const returnTo = typeof body.returnTo === "string" ? body.returnTo : "/";

  let stripe: Stripe;
  try {
    stripe = stripeClient();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Zahlungs-Service nicht verfügbar." },
      { status: 503 },
    );
  }

  const successUrl =
    `${SITE_URL}/api/payment-verify` +
    `?session_id={CHECKOUT_SESSION_ID}` +
    `&return_to=${encodeURIComponent(returnTo)}`;

  const cancelUrl = `${SITE_URL}${returnTo}?cancelled=1`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "paypal"],
      locale: "de",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: PRICE_CENTS,
            product_data: {
              name: "MietCheck – Vollanalyse",
              description:
                "Vollständige Klauselprüfung mit Erklärungen, Rechtsgrundlagen (BGH-Urteile) und konkreten Handlungsempfehlungen.",
            },
          },
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Kein Stripe-Tax hier — MwSt-Handling ist Betreibersache.
      // Bei Kleinunternehmerstatus (§ 19 UStG) keinen Tax-Mode aktivieren.
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler.";
    console.error("[checkout] Stripe-Fehler:", msg);
    return NextResponse.json(
      { ok: false, error: `Checkout konnte nicht gestartet werden: ${msg}` },
      { status: 500 },
    );
  }
}
