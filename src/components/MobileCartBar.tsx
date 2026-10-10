"use client";
import { useCart } from "@/lib/cart";
import { formatKSh } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MobileCartBar() {
  const { count, subtotal } = useCart();
  const [visible, setVisible] = useState(false);
  useEffect(()=> setVisible(count>0), [count]);
  if (!visible) return null;
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 p-3 pointer-events-none">
      <div className="mx-auto max-w-[640px] bg-[var(--ink)] text-white rounded-full p-2 flex items-center gap-3 shadow-2xl pointer-events-auto border border-white/10">
        <div className="w-10 h-10 rounded-full bg-[var(--brand)] grid place-items-center font-black text-sm">{count}</div>
        <div className="flex-1 leading-tight">
          <div className="text-xs font-black tracking-widest">{count} ITEM{count>1?"S":""} • {formatKSh(subtotal)}</div>
          <div className="text-[11px] opacity-70">Tap to checkout — 1-thumb</div>
        </div>
        <Link href="/checkout" className="h-10 px-6 grid place-items-center rounded-full bg-[var(--accent)] text-[var(--ink)] font-black text-xs tracking-widest">CHECKOUT →</Link>
      </div>
    </div>
  );
}
