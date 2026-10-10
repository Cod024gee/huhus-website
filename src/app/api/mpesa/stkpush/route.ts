import { NextRequest, NextResponse } from "next/server";

// M-Pesa Daraja STK Push — server-side only
// Env required: MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_ENV (sandbox | production), MPESA_CALLBACK_URL

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, amount, orderId } = body;

    if (!phone || !amount) {
      return NextResponse.json({ error: "phone and amount required" }, { status: 400 });
    }

    // Validate Kenyan phone
    const normalized = String(phone).replace(/\D/g,"");
    if (!/^254(7|1)\d{8}$/.test(normalized)) {
      return NextResponse.json({ error: "Invalid Kenyan phone. Use 2547XXXXXXXX or 2541XXXXXXXX" }, { status: 400 });
    }

    // Rate limit simple check
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    // In production use Upstash Redis or similar

    // If no Daraja creds -> mock sandbox success (so site launches before approval)
    const hasCreds = process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_SECRET && process.env.MPESA_PASSKEY;
    if (!hasCreds) {
      console.log(`[MOCK M-Pesa] STK Push to ${normalized} amount ${amount} order ${orderId} — no creds, returning mock success`);
      // mimic Daraja response
      return NextResponse.json({
        MerchantRequestID: "MOCK-" + Date.now(),
        CheckoutRequestID: "ws_CO_" + Math.random().toString(36).slice(2,10),
        ResponseCode: "0",
        ResponseDescription: "Success. Request accepted for processing (MOCK — no Daraja keys)",
        CustomerMessage: "Success. Request accepted for processing (MOCK)"
      });
    }

    // Real Daraja flow
    const env = process.env.MPESA_ENV === "production" ? "production" : "sandbox";
    const base = env === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";

    // 1. Get access token
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
    const tokenRes = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!tokenRes.ok) {
      const txt = await tokenRes.text();
      console.error("Daraja token failed", txt);
      return NextResponse.json({ error: "Failed to get M-Pesa token", details: txt }, { status: 502 });
    }
    const { access_token } = await tokenRes.json();

    // 2. STK Push
    const timestamp = new Date().toISOString().replace(/[-:T.]/g,"").slice(0,14); // YYYYMMDDHHmmss
    const shortcode = process.env.MPESA_SHORTCODE!;
    const passkey = process.env.MPESA_PASSKEY!;
    const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");

    const callbackUrl = process.env.MPESA_CALLBACK_URL || `${req.nextUrl.origin}/api/mpesa/callback`;

    const stkRes = await fetch(`${base}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(Number(amount)),
        PartyA: normalized,
        PartyB: shortcode,
        PhoneNumber: normalized,
        CallBackURL: callbackUrl,
        AccountReference: `HUHUS-${orderId || "ORDER"}`.slice(0,12),
        TransactionDesc: "Huhu's Pizzas order",
      }),
    });

    const stkData = await stkRes.json();
    if (!stkRes.ok || stkData.ResponseCode !== "0") {
      console.error("STK push failed", stkData);
      return NextResponse.json({ error: stkData.errorMessage || stkData.ResponseDescription || "STK push failed", details: stkData }, { status: 400 });
    }

    return NextResponse.json(stkData);
  } catch (e:any) {
    console.error("STK error", e);
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}

// Make sure this route is not cached
export const dynamic = "force-dynamic";
