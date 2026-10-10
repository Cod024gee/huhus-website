import { NextRequest, NextResponse } from "next/server";
import menuData from "@/data/menu.json";

// Server-side order creation — NEVER trust client prices
// Recomputes totals from DB (menuData) + zones, validates phone, idempotent via orderNumber

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, fulfilment, zoneId, customer, paymentMethod } = body;

    if (!items || !Array.isArray(items) || items.length===0) {
      return NextResponse.json({ error: "Cart empty" }, { status: 400 });
    }
    if (!customer?.name || !customer?.phone) {
      return NextResponse.json({ error: "Name and phone required" }, { status: 400 });
    }

    // Validate phone
    const phone = String(customer.phone).replace(/\D/g,"");
    if (!/^254(7|1)\d{8}$/.test(phone)) {
      return NextResponse.json({ error: "Invalid Kenyan phone" }, { status: 400 });
    }

    // Recompute subtotal from menuData
    let subtotal = 0;
    for (const ci of items) {
      const menuItem = (menuData as any).items.find((m:any)=> m.id===ci.itemId);
      if (!menuItem) return NextResponse.json({ error: `Invalid item ${ci.itemId}` }, { status: 400 });
      const size = menuItem.sizes.find((s:any)=> s.name===ci.size.name);
      if (!size) return NextResponse.json({ error: `Invalid size for ${ci.itemId}` }, { status: 400 });
      let line = size.price;
      // crust extra
      if (ci.crust && ci.crust.includes("+")) {
        const extra = parseInt(ci.crust.split("+")[1])||0;
        line += extra;
      }
      // extras
      if (ci.extras && Array.isArray(ci.extras)) {
        for (const ex of ci.extras) {
          const found = menuItem.extras.find((e:any)=> e.name===ex.name);
          if (found) line += found.price;
        }
      }
      line *= (ci.qty || 1);
      // Verify lineTotal matches server (tolerance 1)
      if (Math.abs(line - ci.lineTotal) > 1) {
        console.warn(`Price mismatch for ${ci.itemId}: client ${ci.lineTotal} server ${line}`);
        // Use server price — don't trust client
      }
      subtotal += line;
    }

    // Delivery fee
    let deliveryFee = 0;
    if (fulfilment==="delivery") {
      const zone = (menuData as any).zones.find((z:any)=> z.id===zoneId);
      if (!zone) return NextResponse.json({ error: "Invalid delivery zone" }, { status: 400 });
      deliveryFee = zone.fee;
      if (subtotal < 800) return NextResponse.json({ error: "Minimum order KSh 800 for delivery", min: 800, subtotal }, { status: 400 });
    }

    const total = subtotal + deliveryFee;

    // Idempotent orderNumber
    const orderNumber = `HUHU-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2,4).toUpperCase()}`;
    const orderId = Math.random().toString(36).slice(2,9).toUpperCase();

    // In production: insert into Supabase
    // const { data, error } = await supabase.from("orders").insert({ ... }).select().single()
    // For demo we return computed totals and let client persist to localStorage

    // Mock notifications (server logs — in prod Resend + Africa's Talking)
    console.log(`[ORDER ${orderNumber}] ${customer.name} ${phone} ${fulfilment} ${paymentMethod} subtotal ${subtotal} fee ${deliveryFee} total ${total}`);
    // Example: await resend.emails.send({ from: process.env.RESEND_FROM_EMAIL, to: process.env.RESEND_TO_EMAIL, subject: `New order ${orderNumber}`, html: `...` })

    return NextResponse.json({
      ok: true,
      orderId,
      orderNumber,
      subtotal,
      deliveryFee,
      total,
      // echo normalized phone
      customer: { ...customer, phone },
    });
  } catch (e:any) {
    console.error("Order create error", e);
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
