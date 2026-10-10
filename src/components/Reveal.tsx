"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Reveal({ children, delay = 0, y = 24, className = "" }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!el) return;
    if (reduced) { el.style.opacity = "1"; return; }
    gsap.fromTo(el,
      { y, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, delay, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true }
      }
    );
  }, [delay, y]);
  return <div ref={ref} className={className} style={{ opacity: 0 }}>{children}</div>;
}

export function Parallax({ children, speed = 0.15, className="" }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!el || reduced) return;
    gsap.to(el, {
      y: () => -window.innerHeight * speed,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
    });
  }, [speed]);
  return <div ref={ref} className={className}>{children}</div>;
}
