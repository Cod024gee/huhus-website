"use client";
import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(()=>{
    const isFine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFine || reduced) return;

    document.body.classList.add("custom-cursor-active");
    setVisible(true);

    let mouseX=0, mouseY=0, ringX=0, ringY=0;
    const onMove = (e:MouseEvent)=>{
      mouseX=e.clientX; mouseY=e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    };
    const raf = ()=>{
      ringX += (mouseX - ringX)*0.12;
      ringY += (mouseY - ringY)*0.12;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(raf);
    };
    const rafId = requestAnimationFrame(raf);
    window.addEventListener("mousemove", onMove);

    const onEnter = ()=> setHovering(true);
    const onLeave = ()=> setHovering(false);
    const hoverables = document.querySelectorAll("a, button, [data-cursor]");
    hoverables.forEach(el=>{
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return ()=>{
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      hoverables.forEach(el=>{
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      document.body.classList.remove("custom-cursor-active");
    };
  },[]);

  if (!visible) return null;
  return (
    <>
      <div ref={dotRef} className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-[var(--brand)] pointer-events-none z-[9999] mix-blend-normal" />
      <div ref={ringRef} className={`fixed top-0 left-0 w-10 h-10 -ml-5 -mt-5 rounded-full border pointer-events-none z-[9999] flex items-center justify-center transition-all duration-150 ${hovering ? "border-[var(--brand)] bg-[var(--brand)]/10 scale-125" : "border-[var(--ink)]/30"}`}>
        <span className={`text-[8px] font-black tracking-widest ${hovering ? "opacity-100" : "opacity-0"}`}>ORDER</span>
      </div>
    </>
  );
}
