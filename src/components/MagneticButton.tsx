"use client";
import { useRef, useEffect } from "react";

export default function MagneticButton({ children, className, href, onClick }: { children: React.ReactNode; className?: string; href?: string; onClick?: ()=>void }) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  useEffect(()=>{
    const el = ref.current;
    if (!el) return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top - rect.height/2;
      el.style.transform = `translate(${x*0.18}px, ${y*0.35}px)`;
    };
    const onLeave = () => { el.style.transform = "translate(0,0)"; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return ()=> { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  },[]);
  const base = `inline-flex items-center justify-center transition-transform duration-200 will-change-transform ${className || ""}`;
  if (href) return <a ref={ref as any} href={href} className={base}>{children}</a>;
  return <button ref={ref as any} onClick={onClick} className={base}>{children}</button>;
}
