"use client";
import { useEffect, useState } from "react";
import { getOrder, updateOrderStatus } from "@/lib/orders";
import { formatKSh } from "@/lib/utils";
import Link from "next/link";
import { Order } from "@/lib/types";

const steps = ["Received","Baking","On the way","Delivered"] as const;

export default function OrderPage({ params }: { params: { id:string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [waLink, setWaLink] = useState<string | null>(null);

  useEffect(()=>{
    const o = getOrder(params.id);
    setOrder(o);
    const wa = localStorage.getItem(`huhus_wa_${params.id}`);
    if (wa) setWaLink(wa);

    const onUpdate = (e:any) => {
      if (e.detail.id===params.id) setOrder({...e.detail});
    };
    window.addEventListener("huhus:order-update", onUpdate);
    return ()=> window.removeEventListener("huhus:order-update", onUpdate);
  }, [params.id]);

  // simulate live progress if demo
  useEffect(()=>{
    if (!order || order.status==="Delivered" || order.status==="Cancelled") return;
    // auto-advance for demo: every 12s
    const id = setInterval(()=>{
      const curIdx = steps.indexOf(order.status as any);
      if (curIdx < steps.length-1) {
        const next = steps[curIdx+1];
        updateOrderStatus(order.id, next as any);
        setOrder(prev=> prev ? {...prev, status: next as any} : prev);
      }
    }, 12000);
    return ()=> clearInterval(id);
  }, [order]);

  if (!order) {
    return (
      <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="font-display font-black text-[24px]">Order not found</div>
        <p className="text-[var(--stone)] mt-2">Check your order number or go to menu.</p>
        <Link href="/menu" className="inline-flex mt-6 h-11 px-6 rounded-full bg-[var(--brand)] text-white font-black">GO TO MENU</Link>
      </div>
    );
  }

  const currentIdx = steps.indexOf(order.status as any);
  const isCancelled = order.status==="Cancelled";

  return (
    <div className="bg-[var(--paper)] min-h-[70dvh]">
      <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-[var(--line)] rounded-[16px] p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[var(--brand)]" />
          <div className="w-14 h-14 rounded-full bg-[#E8F5E9] text-[#1B5E20] grid place-items-center mx-auto text-2xl">✓</div>
          <h1 className="mt-3 font-display font-black text-[24px] sm:text-[28px]">ORDER CONFIRMED — {order.number}</h1>
          <p className="text-sm text-[var(--stone)] mt-1">Asante {order.customer.name}! We’ve got it. ETA {order.fulfilment==="delivery" ? "30-45 mins" : "~15 mins"}.</p>
          <div className="mt-4 inline-flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1.5 rounded-full bg-[var(--ink)] text-white text-xs font-black">{order.fulfilment.toUpperCase()} • {order.paymentMethod==="mpesa"?"M-PESA":"PAY ON "+order.fulfilment.toUpperCase()}</span>
            <span className="px-3 py-1.5 rounded-full bg-[var(--brand-soft)] border border-[var(--line)] text-xs font-bold">{order.customer.phone}</span>
            {order.customer.zoneId && <span className="px-3 py-1.5 rounded-full bg-white border border-[var(--line)] text-xs font-bold">{order.customer.zoneId}</span>}
          </div>

          {/* stepper */}
          <div className="mt-8">
            <div className="flex items-center justify-between gap-2">
              {steps.map((s,idx)=>(
                <div key={s} className="flex-1 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full grid place-items-center font-black text-sm border-2 transition-colors ${isCancelled ? "bg-[#FFEBEE] border-[#EF9A9A] text-[#C62828]" : idx <= currentIdx ? "bg-[var(--brand)] border-[var(--brand)] text-white" : "bg-white border-[var(--line)] text-[var(--stone)]"}`}>
                    {idx < currentIdx ? "✓" : idx+1}
                  </div>
                  <div className={`text-[10px] sm:text-xs font-black tracking-widest text-center leading-tight ${idx <= currentIdx && !isCancelled ? "text-[var(--brand)]" : "text-[var(--stone)]"}`}>{s.toUpperCase()}</div>
                  {idx < steps.length-1 && (
                    <div className={`hidden sm:block absolute h-[2px] top-[14px] w-[18%] ${idx < currentIdx ? "bg-[var(--brand)]" : "bg-[var(--line)]"}`} style={{left:`calc(${(idx*25)+12.5}% )`}} />
                  )}
                </div>
              ))}
            </div>
            {/* animated scooter */}
            <div className="mt-6 relative h-10 bg-[var(--brand-soft)] rounded-full overflow-hidden border border-[var(--line)]">
              <div className="absolute inset-y-0 left-0 bg-[var(--brand)] transition-all duration-700" style={{width: isCancelled ? "12%" : `${((currentIdx+1)/steps.length)*100}%`}} />
              <div className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 text-[11px] font-black tracking-widest bg-white border border-[var(--line)] px-2 py-1 rounded-full" style={{left: isCancelled ? "10%" : `calc(${((currentIdx+1)/steps.length)*100}% - 28px)`}}>
                {isCancelled ? "✕ CANCELLED" : currentIdx===2 ? "ON THE WAY" : currentIdx===3 ? "DELIVERED" : "IN OVEN"}
              </div>
              <div className="absolute inset-0 grid place-items-center text-xs font-black tracking-widest text-[var(--ink)] mix-blend-luminosity">
                {isCancelled ? "CANCELLED — CALL 0700 000 000" : currentIdx===0 ? "RECEIVED — FIRE IN 2 MINS" : currentIdx===1 ? "BAKING — 90 SECONDS IN 400°C" : currentIdx===2 ? "ON THE WAY — RIDER EN ROUTE" : "DELIVERED — KARIBU TENA!"}
              </div>
            </div>
            <div className="mt-3 flex justify-center gap-2">
              <button onClick={()=> {
                if (currentIdx < steps.length-1) {
                  const next = steps[currentIdx+1];
                  updateOrderStatus(order.id, next as any);
                }
              }} className="h-8 px-4 rounded-full bg-white border border-[var(--line)] text-xs font-bold hidden sm:inline-flex">DEMO: ADVANCE STEP →</button>
              {waLink && <a href={waLink} target="_blank" className="h-8 px-4 grid place-items-center rounded-full bg-[#25D366] text-white text-xs font-black">WHATSAPP KITCHEN</a>}
            </div>
          </div>

          {/* summary */}
          <div className="mt-8 text-left bg-[var(--paper)] border border-[var(--line)] rounded-[12px] p-4">
            <div className="font-black text-sm">ORDER SUMMARY</div>
            <div className="mt-3 divide-y divide-[var(--line)]">
              {order.items.map((ci:any)=>(
                <div key={ci.uid} className="py-2 flex justify-between gap-3 text-sm">
                  <span>{ci.qty}× {ci.name} <span className="text-[var(--stone)]">({ci.size.name}{ci.crust?` • ${ci.crust}`:""})</span></span>
                  <span className="font-bold">{formatKSh(ci.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 text-sm border-t border-[var(--line)] pt-3">
              <div className="flex justify-between"><span className="text-[var(--stone)]">Subtotal</span><span className="font-bold">{formatKSh(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--stone)]">Delivery fee</span><span className="font-bold">{order.deliveryFee?formatKSh(order.deliveryFee):"FREE"}</span></div>
              <div className="flex justify-between font-black text-base"><span>Total</span><span>{formatKSh(order.total)}</span></div>
            </div>
            {order.customer.address && (
              <div className="mt-3 text-xs text-[var(--stone)] bg-white p-2 rounded-[8px] border border-[var(--line)]">
                <span className="font-bold text-[var(--ink)]">Deliver to:</span> {order.customer.address}{order.customer.landmark?` • ${order.customer.landmark}`:""} • {order.customer.zoneId}
              </div>
            )}
            <div className="mt-3 text-[11px] text-[var(--stone)]">Order ID: {order.id} • {new Date(order.createdAt).toLocaleString()} • {order.notes}</div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link href="/menu" className="h-11 px-6 grid place-items-center rounded-full bg-[var(--ink)] text-white font-black text-xs tracking-widest">ORDER AGAIN</Link>
            <a href="tel:+254700000000" className="h-11 px-6 grid place-items-center rounded-full bg-white border border-[var(--line)] font-black text-xs">CALL US 0700 000 000</a>
          </div>
        </div>

        <div className="mt-4 text-center text-[11px] text-[var(--stone)]">Live status via Supabase Realtime in production — here simulated locally. Kitchen sees it instantly in /admin.</div>
      </div>
    </div>
  );
}
