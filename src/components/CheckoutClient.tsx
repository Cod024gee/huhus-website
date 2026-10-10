"use client";
import { useCart } from "@/lib/cart";
import { formatKSh, normalizeKEPhone, isOpenNow } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveOrder } from "@/lib/orders";
import Link from "next/link";
import { track } from "@/lib/analytics";

type Zone = { id:string; name:string; fee:number; eta:string };

export default function CheckoutClient({ zones, hours }: { zones: Zone[]; hours: { open:string; close:string } }) {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();

  const [fulfilment, setFulfilment] = useState<"delivery"|"pickup">("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [zoneId, setZoneId] = useState<string>(zones[0]?.id || "");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pickupTime, setPickupTime] = useState<"asap"|"later">("asap");
  const [timeSlot, setTimeSlot] = useState("12:30");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<"mpesa"|"cash">("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [mpesaState, setMpesaState] = useState<"idle"|"prompt"|"success"|"failed">("idle");
  const [countdown, setCountdown] = useState(45);
  const [error, setError] = useState<string|null>(null);
  const [openNow, setOpenNow] = useState(true);

  useEffect(()=> setOpenNow(isOpenNow(hours.open, hours.close)), [hours]);
  useEffect(()=> setMpesaPhone(phone), [phone]);

  // mpesa countdown
  useEffect(()=>{
    if (mpesaState!=="prompt") return;
    const id = setInterval(()=> setCountdown(c=> c>0?c-1:0), 1000);
    return ()=> clearInterval(id);
  }, [mpesaState]);

  const zone = zones.find(z=>z.id===zoneId);
  const deliveryFee = fulfilment==="delivery" ? (zone?.fee||0) : 0;
  const total = subtotal + deliveryFee;
  const minOrder = 800;
  const meetsMin = fulfilment==="pickup" || subtotal >= minOrder;

  const phoneError = phone && !normalizeKEPhone(phone) ? "Use 07… or 01… — 10 digits" : null;
  const mpesaPhoneError = mpesaPhone && !normalizeKEPhone(mpesaPhone) ? "Enter valid M-Pesa number 07… / 01…" : null;

  const canSubmit = items.length>0 && name.trim().length>=2 && normalizeKEPhone(phone) && (fulfilment==="pickup" || (address.trim().length>=4 && zoneId)) && meetsMin && (payment==="cash" || normalizeKEPhone(mpesaPhone));

  const handlePinLocation = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos)=> {
        setAddress(`Pin: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        setLandmark((v)=> v || "Pinned location");
      },
      ()=> setError("Could not get location — allow permission or type address")
    );
  };

  useEffect(()=>{ if (items.length>0) track("begin_checkout", { value: subtotal, currency:"KES", items: items.length }); }, [items.length]);

  const handleMpesaPay = async () => {
    setError(null);
    const normalized = normalizeKEPhone(mpesaPhone);
    if (!normalized) { setError("Enter valid M-Pesa number"); return; }
    track("payment_started", { method:"mpesa", value: total });
    setLoading(true);
    setMpesaState("prompt");
    setCountdown(45);
    // First validate totals server-side
    try {
      const v = await fetch("/api/orders/create", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ items, fulfilment, zoneId, customer:{ name, phone: normalized }, paymentMethod:"mpesa" })
      });
      const vj = await v.json();
      if (!v.ok) throw new Error(vj.error || "Validation failed");
      // now STK push with server total
      const res = await fetch("/api/mpesa/stkpush", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ phone: normalized, amount: vj.total, orderId: vj.orderNumber })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "STK failed");
      // simulate callback after 4s
      setTimeout(()=>{
        setMpesaState("success");
        setLoading(false);
        // auto continue to create order with server-verified totals
        handleCreateOrder("mpesa", data.CheckoutRequestID || "MPESA123", vj);
      }, 3500);
    } catch (e:any) {
      setLoading(false);
      setMpesaState("failed");
      setError(e.message || "M-Pesa failed. Try again or pay on delivery.");
    }
  };

  const handleCreateOrder = async (method: "mpesa"|"cash", receipt?: string, serverTotals?: any) => {
    const normalized = normalizeKEPhone(phone)!;
    // validate server-side if not already
    let sv = serverTotals;
    if (!sv) {
      try {
        const v = await fetch("/api/orders/create", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ items, fulfilment, zoneId, customer:{ name, phone: normalized }, paymentMethod: method })
        });
        const vj = await v.json();
        if (!v.ok) throw new Error(vj.error || "Validation failed");
        sv = vj;
      } catch(e:any){ setError(e.message); setLoading(false); return; }
    }
    const id = sv.orderId || Math.random().toString(36).slice(2,9).toUpperCase();
    const number = sv.orderNumber || `#HUHU-${Date.now().toString().slice(-6)}`;
    const order = {
      id,
      number,
      createdAt: new Date().toISOString(),
      status: "Received" as const,
      fulfilment,
      customer: {
        name, phone: normalized, zoneId: fulfilment==="delivery"?zoneId:undefined,
        address: fulfilment==="delivery"?address:undefined,
        landmark: fulfilment==="delivery"?landmark:undefined,
      },
      items,
      subtotal: sv.subtotal ?? subtotal,
      deliveryFee: sv.deliveryFee ?? deliveryFee,
      total: sv.total ?? total,
      paymentMethod: method,
      mpesaReceipt: receipt,
      notes: `${notes}${pickupTime==="later"?` | Pickup slot: ${timeSlot}`:""}${!openNow?" | PRE-ORDER for next opening":""}`,
    };
    saveOrder(order as any);
    clear();
    track("purchase", { value: order.total, currency:"KES", transaction_id: number, items: order.items.length, payment: method });
    // fire whatsapp + email (mock)
    const whatsappMsg = `Habari Huhus! Order ${number} — ${name}, ${phone}, ${fulfilment} ${zone?`| ${zone.name}`:""} — Total ${formatKSh(order.total)} — ${method==="mpesa"?"M-Pesa paid":"Pay on "+fulfilment}`;
    const waLink = `https://wa.me/254700000000?text=${encodeURIComponent(whatsappMsg)}`;
    // store wa link for confirmation
    localStorage.setItem(`huhus_wa_${id}`, waLink);
    router.push(`/order/${id}`);
  };

  const handleSubmitCash = async () => {
    if (!canSubmit) return;
    track("payment_started", { method:"cash", value: total });
    setLoading(true);
    await handleCreateOrder("cash");
    setLoading(false);
  };

  if (items.length===0) {
    return (
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-[var(--cream)] grid place-items-center text-2xl">🛒</div>
        <h1 className="mt-4 font-display font-black text-[28px]">Your cart is empty</h1>
        <p className="text-[var(--stone)] mt-2">Add a pizza and come back — we’ll keep it hot.</p>
        <Link href="/menu" className="inline-flex mt-6 h-11 px-6 rounded-full bg-[var(--brand)] text-white font-black">GO TO MENU</Link>
      </div>
    );
  }

  return (
    <div className="bg-[var(--paper)]">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center gap-3 text-[11px] font-black tracking-widest">
          <Link href="/menu" className="hover:underline">← MENU</Link>
          <span className="opacity-30">/</span>
          <span className="text-[var(--brand)]">CHECKOUT</span>
          <span className={`ml-auto px-2.5 py-1 rounded-full border text-[10px] ${openNow?"bg-[#E8F5E9] text-[#1B5E20] border-[#A5D6A7]":"bg-[#FFF3E0] text-[#E65100] border-[#FFCC80]"}`}>{openNow?"OPEN — ORDER NOW":"CLOSED — PRE-ORDER FOR TOMORROW 10:00"}</span>
        </div>

        <div className="mt-6 grid lg:grid-cols-[1.15fr_0.85fr] gap-6 lg:gap-8 items-start">
          {/* left form */}
          <div className="space-y-6">
            {/* fulfilment toggle — custom */}
            <div className="bg-white border border-[var(--line)] rounded-[16px] p-2">
              <div className="grid grid-cols-2 gap-2">
                {[
                  {id:"delivery", label:"DELIVERY", sub: zone?`${zone.eta} • ${formatKSh(zone.fee)} fee`:"25-55 min"},
                  {id:"pickup", label:"PICKUP", sub:"No fee • Ready in ~15 mins"},
                ].map(opt=>(
                  <button
                    key={opt.id}
                    onClick={()=>setFulfilment(opt.id as any)}
                    className={`relative p-4 rounded-[12px] border-2 text-left transition-colors ${fulfilment===opt.id ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "bg-white border-transparent hover:border-[var(--line)]"}`}
                  >
                    <div className="font-black tracking-widest text-xs flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full border-2 grid place-items-center ${fulfilment===opt.id?"bg-[var(--accent)] border-[var(--accent)]":"border-[var(--line)]"}`}>{fulfilment===opt.id && <span className="w-1.5 h-1.5 bg-[var(--ink)] rounded-full"/>}</span>
                      {opt.label}
                    </div>
                    <div className={`text-xs mt-1 ${fulfilment===opt.id?"text-white/70":"text-[var(--stone)]"}`}>{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* customer */}
            <div className="bg-white border border-[var(--line)] rounded-[16px] p-5 sm:p-6">
              <h2 className="font-display font-black text-[16px] tracking-tighter">YOUR DETAILS</h2>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <label className="space-y-1.5">
                  <span className="text-[11px] font-black tracking-widest">FULL NAME *</span>
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder="Wanjiku Otieno" className="w-full h-11 px-3 rounded-[10px] border border-[var(--line)] focus:border-[var(--ink)] outline-none text-sm" />
                </label>
                <label className="space-y-1.5">
                  <span className="text-[11px] font-black tracking-widest">PHONE (M-Pesa) *</span>
                  <input value={phone} onChange={e=>setPhone(e.target.value)} inputMode="tel" placeholder="07... or 01..." className={`w-full h-11 px-3 rounded-[10px] border outline-none text-sm ${phoneError?"border-red-500":"border-[var(--line)] focus:border-[var(--ink)]"}`} />
                  {phoneError && <span className="text-[11px] text-red-600 font-bold">{phoneError}</span>}
                </label>
              </div>

              {fulfilment==="delivery" ? (
                <div className="mt-4 space-y-4">
                  <label className="space-y-1.5 block">
                    <span className="text-[11px] font-black tracking-widest">AREA / ZONE *</span>
                    <div className="grid grid-cols-1 gap-2">
                      {zones.map(z=>(
                        <button key={z.id} type="button" onClick={()=>setZoneId(z.id)} className={`text-left p-3 rounded-[10px] border flex items-center justify-between ${zoneId===z.id?"bg-[var(--brand-soft)] border-[var(--brand)]":"bg-white border-[var(--line)] hover:border-[var(--ink)]"}`}>
                          <div>
                            <div className="font-bold text-sm">{z.name}</div>
                            <div className="text-xs text-[var(--stone)]">ETA {z.eta}</div>
                          </div>
                          <div className="font-black text-sm">{formatKSh(z.fee)}</div>
                        </button>
                      ))}
                    </div>
                  </label>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="space-y-1.5">
                      <span className="text-[11px] font-black tracking-widest">ADDRESS / ESTATE *</span>
                      <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Apartment, house no., street" className="w-full h-11 px-3 rounded-[10px] border border-[var(--line)] focus:border-[var(--ink)] outline-none text-sm" />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-[11px] font-black tracking-widest">LANDMARK</span>
                      <input value={landmark} onChange={e=>setLandmark(e.target.value)} placeholder="Near Prestige Plaza..." className="w-full h-11 px-3 rounded-[10px] border border-[var(--line)] focus:border-[var(--ink)] outline-none text-sm" />
                    </label>
                  </div>
                  <button type="button" onClick={handlePinLocation} className="h-9 px-4 rounded-full border border-[var(--ink)] font-bold text-xs hover:bg-[var(--ink)] hover:text-white transition-colors">📍 PIN MY LOCATION</button>
                </div>
              ) : (
                <div className="mt-4">
                  <div className="text-[11px] font-black tracking-widest">PICKUP TIME</div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={()=>setPickupTime("asap")} className={`h-10 px-5 rounded-full border font-bold text-sm ${pickupTime==="asap"?"bg-[var(--ink)] text-white border-[var(--ink)]":"bg-white border-[var(--line)]"}`}>ASAP (~15 mins)</button>
                    <button onClick={()=>setPickupTime("later")} className={`h-10 px-5 rounded-full border font-bold text-sm ${pickupTime==="later"?"bg-[var(--ink)] text-white border-[var(--ink)]":"bg-white border-[var(--line)]"}`}>SCHEDULE</button>
                  </div>
                  {pickupTime==="later" && (
                    <input type="time" value={timeSlot} onChange={e=>setTimeSlot(e.target.value)} className="mt-3 h-10 px-3 rounded-[10px] border border-[var(--line)]" />
                  )}
                  <div className="mt-3 text-xs text-[var(--stone)] bg-[var(--brand-soft)] inline-block px-2.5 py-1 rounded-full">Pickup: Huhu’s HQ — Ngong Road. Come to counter, say your name.</div>
                </div>
              )}

              <label className="space-y-1.5 block mt-4">
                <span className="text-[11px] font-black tracking-widest">SPECIAL NOTES</span>
                <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Gate code, no coriander, call on arrival..." className="w-full h-11 px-3 rounded-[10px] border border-[var(--line)] focus:border-[var(--ink)] outline-none text-sm" />
              </label>
            </div>

            {/* payment */}
            <div className="bg-white border border-[var(--line)] rounded-[16px] p-5 sm:p-6">
              <h2 className="font-display font-black text-[16px] tracking-tighter">PAYMENT</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button onClick={()=>setPayment("mpesa")} className={`p-4 rounded-[12px] border-2 text-left ${payment==="mpesa"?"border-[#34A853] bg-[#E8F5E9]":"border-[var(--line)] bg-white"}`}>
                  <div className="font-black text-sm flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-[#34A853] text-white grid place-items-center text-xs font-black">M</span> M-PESA STK</div>
                  <div className="text-xs text-[var(--stone)] mt-1">Push to your phone. PIN on your handset.</div>
                </button>
                <button onClick={()=>setPayment("cash")} className={`p-4 rounded-[12px] border-2 text-left ${payment==="cash"?"border-[var(--brand)] bg-[var(--brand-soft)]":"border-[var(--line)] bg-white"}`}>
                  <div className="font-black text-sm">💵 PAY ON {fulfilment==="delivery"?"DELIVERY":"PICKUP"}</div>
                  <div className="text-xs text-[var(--stone)] mt-1">Cash or till. No M-Pesa needed.</div>
                </button>
              </div>

              {payment==="mpesa" && (
                <div className="mt-4 space-y-3">
                  <label className="space-y-1.5 block">
                    <span className="text-[11px] font-black tracking-widest">M-PESA NUMBER *</span>
                    <input value={mpesaPhone} onChange={e=>setMpesaPhone(e.target.value)} inputMode="tel" placeholder="07..." className={`w-full h-11 px-3 rounded-[10px] border outline-none text-sm ${mpesaPhoneError?"border-red-500":"border-[var(--line)] focus:border-[#34A853]"}`} />
                    {mpesaPhoneError && <span className="text-[11px] text-red-600 font-bold">{mpesaPhoneError}</span>}
                  </label>

                  {mpesaState==="idle" && (
                    <button onClick={handleMpesaPay} disabled={!normalizeKEPhone(mpesaPhone) || loading} className="w-full h-12 rounded-full bg-[#34A853] text-white font-black tracking-widest disabled:opacity-50 hover:bg-[#2E7D32] transition-colors">
                      {loading ? "SENDING PUSH..." : `PAY ${formatKSh(total)} VIA M-PESA`}
                    </button>
                  )}
                  {mpesaState==="prompt" && (
                    <div className="bg-[#E8F5E9] border border-[#A5D6A7] rounded-[12px] p-4 text-center">
                      <div className="font-black text-[#1B5E20]">CHECK YOUR PHONE — ENTER PIN</div>
                      <div className="text-sm text-[#2E7D32] mt-1">We sent STK push to {mpesaPhone}. Enter M-Pesa PIN to confirm.</div>
                      <div className="mt-3 font-mono text-2xl font-black text-[#1B5E20]">{String(Math.floor(countdown/60)).padStart(2,"0")}:{String(countdown%60).padStart(2,"0")}</div>
                      <div className="mt-2 w-full h-1.5 bg-white rounded-full overflow-hidden">
                        <div className="h-full bg-[#34A853] transition-all" style={{width:`${(countdown/45)*100}%`}} />
                      </div>
                      <div className="mt-3 flex gap-2 justify-center">
                        <button onClick={()=>{setMpesaState("idle"); setLoading(false);}} className="h-8 px-4 rounded-full bg-white border border-[#A5D6A7] text-xs font-bold">CANCEL</button>
                        <button onClick={handleMpesaPay} className="h-8 px-4 rounded-full bg-[#1B5E20] text-white text-xs font-bold">RETRY PUSH</button>
                      </div>
                    </div>
                  )}
                  {mpesaState==="success" && (
                    <div className="bg-[#E8F5E9] border border-[#A5D6A7] rounded-[12px] p-4 text-center">
                      <div className="text-2xl">✅</div>
                      <div className="font-black text-[#1B5E20] mt-1">M-PESA CONFIRMED</div>
                      <div className="text-xs text-[#2E7D32]">Creating your order...</div>
                    </div>
                  )}
                  {mpesaState==="failed" && (
                    <div className="bg-[#FFEBEE] border border-[#EF9A9A] rounded-[12px] p-4">
                      <div className="font-black text-[#C62828]">M-PESA FAILED OR TIMED OUT</div>
                      <p className="text-sm text-[#B71C1C] mt-1">We kept your cart. Try again, or switch to Pay on {fulfilment}.</p>
                      <div className="mt-3 flex gap-2">
                        <button onClick={()=>{setMpesaState("idle"); setLoading(false);}} className="flex-1 h-9 rounded-full bg-white border border-[#EF9A9A] font-bold text-xs">RETRY M-PESA</button>
                        <button onClick={()=>setPayment("cash")} className="flex-1 h-9 rounded-full bg-[var(--ink)] text-white font-bold text-xs">SWITCH TO CASH</button>
                        <a href={`https://wa.me/254700000000?text=Habari%20Huhus!%20M-Pesa%20failed%20for%20${encodeURIComponent(name)}%20${encodeURIComponent(phone)}%20total%20${total}`} target="_blank" className="flex-1 h-9 grid place-items-center rounded-full bg-[#25D366] text-white font-bold text-xs">ORDER VIA WHATSAPP</a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {payment==="cash" && (
                <button onClick={handleSubmitCash} disabled={!canSubmit || loading} className="mt-4 w-full h-12 rounded-full bg-[var(--brand)] text-white font-black tracking-widest disabled:opacity-50 hover:bg-[var(--heat)] transition-colors">
                  {loading ? "PLACING ORDER..." : `PLACE ORDER — ${formatKSh(total)} • PAY ON ${fulfilment.toUpperCase()}`}
                </button>
              )}

              {error && <div className="mt-3 p-3 rounded-[10px] bg-[#FFEBEE] border border-[#EF9A9A] text-sm text-[#C62828] font-medium">{error}</div>}

              <div className="mt-3 text-[11px] leading-relaxed text-[var(--stone)]">
                By ordering you agree to our terms. We compute totals server-side — no funny business. Daraja keys never leave the server.
              </div>
            </div>
          </div>

          {/* right summary */}
          <div className="lg:sticky lg:top-[88px] space-y-4">
            <div className="bg-white border border-[var(--line)] rounded-[16px] p-5 sm:p-6">
              <h2 className="font-display font-black text-[16px]">ORDER SUMMARY</h2>
              <div className="mt-4 divide-y divide-[var(--line)]">
                {items.map(ci=>(
                  <div key={ci.uid} className="py-3 flex gap-3">
                    <div className="w-14 h-14 rounded-[8px] bg-[var(--brand-soft)] border border-[var(--line)] grid place-items-center shrink-0"><div className="w-8 h-8 rounded-full bg-[var(--brand)] grid place-items-center text-white font-black text-[7px]">HUHU</div></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm leading-tight">{ci.name} <span className="font-normal text-[var(--stone)]">×{ci.qty}</span></div>
                      <div className="text-xs text-[var(--stone)]">{ci.size.name}{ci.crust?` • ${ci.crust}`:""}{ci.extras.length?` • +${ci.extras.map(e=>e.name).join(", ")}`:""}</div>
                      {ci.notes && <div className="text-[11px] italic">"{ci.notes}"</div>}
                    </div>
                    <div className="font-black text-sm">{formatKSh(ci.lineTotal)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 text-sm border-t border-[var(--line)] pt-4">
                <div className="flex justify-between"><span className="text-[var(--stone)]">Subtotal</span><span className="font-bold">{formatKSh(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-[var(--stone)]">Delivery fee {zone ? `(${zone.name})` : ""}</span><span className="font-bold">{fulfilment==="delivery" ? formatKSh(deliveryFee) : "FREE"}</span></div>
                {!meetsMin && fulfilment==="delivery" && (
                  <div className="p-2 rounded-[8px] bg-[#FFF3E0] border border-[#FFCC80] text-xs font-bold text-[#E65100]">Add {formatKSh(minOrder - subtotal)} more for delivery (min {formatKSh(minOrder)})</div>
                )}
                <div className="flex justify-between text-[18px] font-black pt-2 border-t border-[var(--line)]"><span>Total</span><span>{formatKSh(total)}</span></div>
                <div className="text-[11px] text-[var(--stone)]">ETA {fulfilment==="delivery" ? (zone?.eta || "30-40 min") : "15 mins"} • Fee shown early — no surprises at pay step.</div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link href="/menu" className="flex-1 h-10 grid place-items-center rounded-full border border-[var(--line)] font-bold text-xs">← BACK TO MENU</Link>
                <a href={`https://wa.me/254700000000?text=Habari%20Huhus!%20Nataka%20ku-order%20—%20${encodeURIComponent(items.map(i=>`${i.qty}x ${i.name}`).join(", "))}%20total%20${total}`} target="_blank" className="flex-1 h-10 grid place-items-center rounded-full bg-[#25D366] text-white font-bold text-xs">ORDER VIA WHATSAPP</a>
              </div>
            </div>

            <div className="bg-[var(--ink)] text-white rounded-[16px] p-5">
              <div className="font-black text-sm">NEED HELP?</div>
              <p className="text-xs text-white/70 mt-1">Call 0700 000 000 or WhatsApp. We answer fast — kitchen doesn’t sleep during service.</p>
              <div className="mt-3 flex gap-2">
                <a href="tel:+254700000000" className="h-9 px-4 grid place-items-center rounded-full bg-white text-black font-bold text-xs">CALL</a>
                <a href="https://wa.me/254700000000" target="_blank" className="h-9 px-4 grid place-items-center rounded-full bg-[#25D366] text-white font-bold text-xs">WHATSAPP</a>
              </div>
            </div>

            {!openNow && (
              <div className="bg-[#FFF3E0] border border-[#FFCC80] rounded-[12px] p-4">
                <div className="font-black text-[#E65100] text-sm">WE’RE CLOSED — PRE-ORDER OK</div>
                <p className="text-xs text-[#BF360C] mt-1">Place your order now, we fire first thing at 10:00. ETA counts from opening.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
