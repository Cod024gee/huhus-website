import { NextRequest, NextResponse } from "next/server";

// Daraja will POST here — must be public HTTPS
// In production, verify order and update Supabase, send email/Whatsapp/SMS

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[M-Pesa Callback]", JSON.stringify(body, null, 2));

    // Daraja callback structure:
    // { Body: { stkCallback: { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } } }
    const stk = body.Body?.stkCallback;
    if (!stk) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid callback" });
    }

    const success = stk.ResultCode === 0;
    const checkoutId = stk.CheckoutRequestID;
    const metadata = stk.CallbackMetadata?.Item || [];
    const amount = metadata.find((i:any)=>i.Name==="Amount")?.Value;
    const receipt = metadata.find((i:any)=>i.Name==="MpesaReceiptNumber")?.Value;
    const phone = metadata.find((i:any)=>i.Name==="PhoneNumber")?.Value;

    // TODO: Lookup order by CheckoutRequestID and update Supabase
    // Example (pseudo):
    // await supabase.from("orders").update({ status: success?"paid":"failed", mpesa_receipt: receipt }).eq("checkout_id", checkoutId)

    // Idempotent: check if already processed

    // Notifications: Resend email, Africa's Talking SMS, WhatsApp alert
    // For now just log

    if (success) {
      console.log(`✅ M-Pesa success ${receipt} amount ${amount} phone ${phone} checkout ${checkoutId}`);
      // TODO: send email to restaurant, SMS to customer
    } else {
      console.log(`❌ M-Pesa failed ResultCode ${stk.ResultCode} ${stk.ResultDesc}`);
    }

    // Must return ResultCode 0 to acknowledge
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (e:any) {
    console.error("Callback error", e);
    // Still ack to prevent retries storm
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted (error logged)" });
  }
}

export async function GET() {
  return NextResponse.json({ status: "M-Pesa callback endpoint alive. POST from Daraja only." });
}

export const dynamic = "force-dynamic";
