"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el = ref.current;
    if (!el) return;
    const inner = el.querySelector(".marquee-inner") as HTMLElement;
    if (!inner) return;
    const totalWidth = inner.scrollWidth / 2;
    gsap.to(inner, {
      x: -totalWidth,
      duration: 20,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
      }
    });
    // speed up on scroll
    let velocity = 0;
    let lastY = window.scrollY;
    const onScroll = () => {
      const dy = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      velocity = Math.min(dy*0.02, 2);
      gsap.to(inner, { timeScale: 1+velocity, duration:0.4, overwrite:true });
      setTimeout(()=> gsap.to(inner, { timeScale:1, duration:0.8}), 300);
    };
    window.addEventListener("scroll", onScroll, {passive:true});
    return ()=> window.removeEventListener("scroll", onScroll);
  },[]);
  const phrases = ["PEPPERONI HEAT", "•", "NYAMA CHOMA DELUXE", "•", "PERI-PERI KUKU", "•", "MOTO MOTO", "•", "WOOD-FIRED", "•", "NAIROBI'S FAVOURITE", "•", "PIGA ORDER SAHI", "•"];
  const doubled = [...phrases, ...phrases, ...phrases, ...phrases];
  return (
    <div ref={ref} className="overflow-hidden bg-[var(--brand)] text-[var(--paper)] rotate-[-1.2deg] scale-[1.02] border-y border-[var(--brand-deep)]">
      <div className="marquee-inner flex items-center gap-6 py-3 whitespace-nowrap will-change-transform">
        {doubled.map((p,i)=>(
          <span key={i} className={`shrink-0 font-display font-black tracking-tighter ${p==="•" ? "opacity-40" : "text-[16px] sm:text-[20px]"}`}>{p}</span>
        ))}
      </div>
    </div>
  );
}
