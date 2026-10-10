"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { isOpenNow } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function Header() {
  const { count, setIsOpen } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpenState] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(()=>{
    setIsOpenState(isOpenNow("10:00","22:00"));
    const onScroll = ()=> setScrolled(window.scrollY>20);
    window.addEventListener("scroll", onScroll);
    return ()=>window.removeEventListener("scroll", onScroll);
  },[]);

  const nav = [
    { href:"/menu", label:"Menu" },
    { href:"/story", label:"Our Story" },
    { href:"/fresh", label:"Fresh" },
    { href:"/#find-us", label:"Find Us" },
  ];

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors ${scrolled ? "bg-[var(--paper)]/90 backdrop-blur-md border-[var(--line)]" : "bg-[var(--paper)] border-transparent"}`}>
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 h-[64px] sm:h-[72px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-[2px] bg-[var(--brand)] text-[var(--paper)] grid place-items-center font-display font-black text-[18px] leading-none tracking-tighter rotate-[-1deg] group-hover:rotate-[1deg] transition-transform">
            HUHU<span className="text-[10px] leading-none">’S</span>
          </div>
          <div className="hidden sm:block leading-none">
            <div className="font-display font-black text-[22px] tracking-[-0.03em] leading-none">HUHU’S</div>
            <div className="font-text text-[10px] tracking-[0.18em] font-bold text-[var(--brand)] -mt-0.5">PIZZAS • NAIROBI</div>
          </div>
          <span className={`hidden lg:inline-flex ml-3 px-2 py-1 rounded-full text-[10px] font-bold tracking-widest border ${isOpen ? "bg-[#E8F5E9] text-[#1B5E20] border-[#A5D6A7]" : "bg-[#FFF3E0] text-[#E65100] border-[#FFCC80]"}`}>
            {isOpen ? "● OPEN TILL 22:00" : "● PRE-ORDER"}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-bold tracking-widest">
          {nav.map(n=>(
            <Link key={n.href} href={n.href} className={`relative py-2 hover:text-[var(--brand)] transition-colors ${pathname===n.href ? "text-[var(--brand)]" : "text-[var(--ink)]"}`}>
              {n.label}
              {pathname===n.href && <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[var(--brand)]" />}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a href="tel:+254700000000" className="hidden lg:inline-flex items-center gap-2 text-[13px] font-bold tracking-wide border border-[var(--line)] px-3 py-2 rounded-full hover:border-[var(--ink)] transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" /> 0700 000 000
          </a>
          <button id="cart-icon" onClick={()=>setIsOpen(true)} className="relative grid place-items-center w-11 h-11 rounded-full bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--brand)] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6h15l-1.5 9h-13z"/><path d="M6 6L5 2H2"/><circle cx="9" cy="20" r="1.8"/><circle cx="18" cy="20" r="1.8"/></svg>
            {count>0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 grid place-items-center bg-[var(--accent)] text-[var(--ink)] text-[11px] font-black rounded-full border-2 border-[var(--paper)]">
                {count}
              </span>
            )}
          </button>
          <Link href="/menu" className="hidden sm:inline-flex items-center justify-center h-11 px-6 rounded-full bg-[var(--brand)] text-white font-black text-[13px] tracking-widest hover:bg-[var(--heat)] transition-colors shadow-[0_8px_20px_rgba(227,53,13,0.3)]">
            ORDER NOW
          </Link>
          <button onClick={()=>setOpen(v=>!v)} className="md:hidden w-11 h-11 grid place-items-center rounded-full border border-[var(--line)]">
            <span className="space-y-1.5">{[0,1,2].map(i=><span key={i} className="block w-5 h-[2px] bg-[var(--ink)]"/> )}</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-[var(--line)] bg-[var(--paper)]">
          <nav className="px-4 py-4 flex flex-col gap-1">
            {nav.map(n=>(
              <Link key={n.href} href={n.href} onClick={()=>setOpen(false)} className="py-3 text-[14px] font-bold tracking-widest border-b border-[var(--line)] last:border-0">{n.label}</Link>
            ))}
            <Link href="/menu" onClick={()=>setOpen(false)} className="mt-3 h-12 grid place-items-center rounded-full bg-[var(--brand)] text-white font-black tracking-widest">ORDER NOW — MENU</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
