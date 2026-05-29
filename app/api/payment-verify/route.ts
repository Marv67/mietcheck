/**
 * GET /api/payment-verify?session_id=XXX&return_to=/
 *
 * Stripe leitet nach erfolgreicher Zahlung hierhin weiter.
 * Wir verifizieren die Session server-seitig, setzen den Cookie
 * `mc_paid=1` und leiten den Nutzer zur Ergebnisseite zurueck.
 *
 * Cookie mc_paid:
 *  - httpOnly: false  → muss vom Client (upload-flow.tsx) lesbar sein
 *  - secure: true in Produktion
 *  - SameSite: lax    → reicht fuer Redirect-Flow von Stripe (same-site
 *    nach Domain-Weiterleitung wird als "lax" behandelt)
 *  - Max-Age: 90 Tage
 *
 * Sicherheit: Ohne echte User-Accounts koennen wir nicht verhindern,
 * dass jemand den Cookie manuell setzt. Das ist bewusst akzeptiert —
 * der Wert des Bypasses (Details zu Klauseln sehen) steht in keinem
 * Verhaeltnis zum Aufwand. Fuer haertere Guarantees: User-Auth einbauen.
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 Tage

/**
 * Basis-URL fuer Redirects. Bevorzugt NEXT_PUBLIC_SITE_URL; faellt
 * sonst auf den Request-Host zurueck (verhindert den localhost-Footgun,
 * wenn die Env-Variable in Produktion fehlt).
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
  if (!key) throw new Error("STRIPE_SECRET_KEY nicht gesetzt.");
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const SITE_URL = siteUrl(req);
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id") ?? "";
  const returnTo = searchParams.get("return_to") ?? "/";

  // Fallback-Redirect ohne Cookie wenn keine session_id
  if (!sessionId) {
    return NextResponse.redirect(new URL(returnTo, SITE_URL));
  }

  let paid = false;
  try {
    const stripe = stripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    paid = session.payment_status === "paid";
  } catch (err) {
    console.error("[payment-verify] Stripe-Fehler:", err);
  }

  // Weiterleitung mit ?paid=1&sid=<session_id> wenn Zahlung bestaetigt.
  // sid wird clientseitig an /api/unlock weitergereicht, um die
  // verschluesselten Report-Details zu entschluesseln.
  const sep = returnTo.includes("?") ? "&" : "?";
  const redirectTarget = paid
    ? `${returnTo}${sep}paid=1&sid=${encodeURIComponent(sessionId)}`
    : returnTo;
  const redirectUrl = new URL(redirectTarget, SITE_URL);
  const response = NextResponse.redirect(redirectUrl);

  if (paid) {
    response.cookies.set("mc_paid", "1", {
      httpOnly: false, // Client (JS) muss diesen Cookie lesen koennen
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  }

  return response;
}
