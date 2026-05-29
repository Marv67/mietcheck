/**
 * POST /api/checkout
 *
 * Erstellt eine Stripe-Checkout-Session fuer die Klare-Miete-Vollanalyse
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

/**
 * Basis-URL fuer Stripe-Redirects. Bevorzugt NEXT_PUBLIC_SITE_URL;
 * faellt sonst auf den Request-Origin zurueck (verhindert den
 * localhost-Footgun, wenn die Env-Variable in Produktion fehlt).
 */
function siteUrl(req: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (!host) return "http://localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY ist nicht gesetzt.");
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: { returnTo?: unknown; analysisId?: unknown };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const returnTo = typeof body.returnTo === "string" ? body.returnTo : "/";
  const analysisId = typeof body.analysisId === "string" ? body.analysisId : "";
  const SITE_URL = siteUrl(req);

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
      // Bindet die Analyse an diese Zahlung — /api/unlock entschluesselt
      // nur den Report mit genau dieser analysisId.
      metadata: analysisId ? { analysisId } : undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: PRICE_CENTS,
            product_data: {
              name: "Klare Miete – Vollanalyse",
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
    const detail = err instanceof Error ? err.message : "Unbekannter Fehler.";
    console.error("[checkout] Stripe-Fehler:", detail);
    // Rohe Stripe-Fehlermeldung nur im Dev an den Client geben.
    const clientError =
      process.env.NODE_ENV === "production"
        ? "Checkout konnte nicht gestartet werden. Bitte versuchen Sie es später erneut."
        : `Checkout konnte nicht gestartet werden: ${detail}`;
    return NextResponse.json({ ok: false, error: clientError }, { status: 500 });
  }
}
