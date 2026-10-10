"use client";
import { useCart } from "@/lib/cart";
import { formatKSh } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQty, remove, subtotal } = useCart();
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setIsOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50" />
          <motion.div initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring", damping:28, stiffness:300}} className="fixed top-0 right-0 h-[100dvh] w-[94%] sm:w-[420px] bg-[var(--paper)] z-50 flex flex-col shadow-2xl border-l border-[var(--line)]">
            {/* header */}
            <div className="h-[64px] flex items-center justify-between px-6 border-b border-[var(--line)]">
              <div className="font-display font-black text-[18px] tracking-tighter">YOUR CART <span className="text-[var(--brand)]">— {items.length}</span></div>
              <button onClick={()=>setIsOpen(false)} className="w-9 h-9 grid place-items-center rounded-full border border-[var(--line)] hover:bg-[var(--ink)] hover:text-white transition-colors">✕</button>
            </div>

            {/* items */}
            <div className="flex-1 overflow-auto px-4 sm:px-6 py-6 space-y-4">
              {items.length===0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-20 h-20 rounded-full bg-[var(--cream)] border border-[var(--line)] grid place-items-center font-display font-black text-[10px] tracking-widest text-[var(--brand)] mb-4">HUHU’S</div>
                  <div className="font-display font-black text-[22px]">Your cart is empty</div>
                  <p className="text-[var(--stone)] text-sm mt-2">Add something hot. It flies to the kitchen fast.</p>
                  <Link href="/menu" onClick={()=>setIsOpen(false)} className="inline-flex mt-6 h-10 px-6 rounded-full bg-[var(--brand)] text-white font-bold text-sm">SEE MENU</Link>
                </div>
              ) : items.map(ci=>(
                <div key={ci.uid} className="flex gap-3 p-3 bg-white border border-[var(--line)] rounded-[12px]">
                  <div className="w-20 h-20 rounded-[8px] bg-[var(--brand-soft)] border border-[var(--line)] grid place-items-center overflow-hidden shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#7A1306] border-2 border-white grid place-items-center text-white font-black text-[8px]">HUHU’S</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold leading-tight text-[14px]">{ci.name}</div>
                    <div className="text-[11px] tracking-wide text-[var(--stone)] mt-0.5">{ci.size.name}{ci.crust?` • ${ci.crust}`:""} {ci.extras.length? `• +${ci.extras.map(e=>e.name).join(", ")}`:""}</div>
                    {ci.notes && <div className="text-[11px] italic bg-[var(--brand-soft)] px-2 py-1 rounded mt-1">"{ci.notes}"</div>}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 border border-[var(--line)] rounded-full px-1">
                        <button onClick={()=>updateQty(ci.uid, ci.qty-1)} className="w-7 h-7 grid place-items-center hover:bg-[var(--paper)] rounded-full">−</button>
                        <span className="w-6 text-center text-sm font-bold">{ci.qty}</span>
                        <button onClick={()=>updateQty(ci.uid, ci.qty+1)} className="w-7 h-7 grid place-items-center hover:bg-[var(--paper)] rounded-full">+</button>
                      </div>
                      <div className="font-black text-[14px]">{formatKSh(ci.lineTotal)}</div>
                    </div>
                  </div>
                  <button onClick={()=>remove(ci.uid)} className="self-start text-[11px] font-bold tracking-widest text-[var(--stone)] hover:text-[var(--brand)]">REMOVE</button>
                </div>
              ))}
              {items.length>0 && (
                <div className="pt-2 text-[11px] tracking-widest font-bold text-[var(--stone)]">PST. DELIVERY FEE CALCULATED AT CHECKOUT BY ZONE.</div>
              )}
            </div>

            {/* footer */}
            <div className="border-t border-[var(--line)] p-6 bg-white space-y-3">
              <div className="flex justify-between text-sm"><span className="text-[var(--stone)]">Subtotal</span><span className="font-bold">{formatKSh(subtotal)}</span></div>
              <div className="flex justify-between font-black text-[18px]"><span>Total</span><span>{formatKSh(subtotal)}</span></div>
              <Link href="/checkout" onClick={()=>setIsOpen(false)} className={`h-12 grid place-items-center rounded-full font-black tracking-widest text-white ${items.length?"bg-[var(--brand)] hover:bg-[var(--heat)]":"bg-[var(--stone)] pointer-events-none"} transition-colors`}>
                CHECKOUT — {formatKSh(subtotal)}
              </Link>
              <button onClick={()=>setIsOpen(false)} className="w-full h-10 grid place-items-center text-sm font-bold tracking-widest">KEEP SHOPPING</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
