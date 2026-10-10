"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

export default function HeroBuild() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pizzaRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(()=>{
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "+=120%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });

      // dough scale in
      tl.fromTo(".hero-dough", { scale: 0.6, opacity: 0, rotation: -8 }, { scale:1, opacity:1, rotation:0, duration:0.25, ease:"back.out(1.4)" }, 0);
      // sauce spread
      tl.fromTo(".hero-sauce", { scale:0, opacity:0 }, { scale:1, opacity:1, duration:0.2, ease:"power2.out" }, 0.18);
      // cheese melt
      tl.fromTo(".hero-cheese", { scale:0.8, opacity:0, y:20 }, { scale:1, opacity:1, y:0, duration:0.22, ease:"power2.out" }, 0.30);
      // toppings drop with bounce
      tl.fromTo(".hero-topping-1", { y:-120, opacity:0, rotation:-20 }, { y:0, opacity:1, rotation:0, duration:0.18, ease:"bounce.out" }, 0.45);
      tl.fromTo(".hero-topping-2", { y:-140, opacity:0, rotation:15 }, { y:0, opacity:1, rotation:0, duration:0.18, ease:"bounce.out" }, 0.52);
      tl.fromTo(".hero-topping-3", { y:-110, opacity:0, rotation:-12 }, { y:0, opacity:1, rotation:0, duration:0.18, ease:"bounce.out" }, 0.58);
      // oven glow rise
      tl.fromTo(".hero-glow", { opacity:0, scale:0.7 }, { opacity:1, scale:1, duration:0.25 }, 0.65);
      // headline resolves
      tl.fromTo(".hero-headline-word", { y: 80, opacity:0 }, { y:0, opacity:1, duration:0.3, stagger:0.07, ease:"power3.out" }, 0.70);

      // parallax slight rotation on pizza with scroll
      gsap.to(pizzaRef.current, {
        rotation: 4,
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }, wrapRef);

    return ()=> ctx.revert();
  },[]);

  return (
    <section ref={wrapRef} className="relative bg-[var(--paper)] overflow-hidden border-b border-[var(--line)]">
      {/* grain */}
      <div className="absolute inset-0 grain opacity-40 pointer-events-none" />

      {/* subtle grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:"linear-gradient(to right, var(--ink) 1px, transparent 1px), linear-gradient(to bottom, var(--ink) 1px, transparent 1px)", backgroundSize:"48px 48px"}} />

      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 relative">
        <div className="min-h-[86dvh] sm:min-h-[84dvh] pt-[24px] sm:pt-[36px] pb-6 grid lg:grid-cols-[1.15fr_0.85fr] gap-6 lg:gap-10 items-center">
          {/* left — headline (asymmetric editorial) */}
          <div ref={headlineRef} className="relative z-10 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-white border border-[var(--line)] rounded-full px-3 py-1.5 text-[11px] font-bold tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" /> WOOD-FIRED • 90 SECONDS • NAIROBI
            </div>

            <h1 className="mt-4 bleed-type text-[44px] sm:text-[62px] lg:text-[88px] xl:text-[104px] leading-[0.85] tracking-[-0.04em]">
              <span className="hero-headline-word inline-block overflow-hidden"><span className="inline-block">PIZZA</span></span><br/>
              <span className="hero-headline-word inline-block overflow-hidden"><span className="inline-block">NI <span className="text-[var(--brand)]">MOTO</span></span></span><br/>
              <span className="hero-headline-word inline-block overflow-hidden"><span className="inline-block text-[var(--stone)] text-[32px] sm:text-[44px] lg:text-[54px] tracking-[-0.03em]">MOTO.</span></span>
            </h1>

            <p className="mt-4 max-w-[520px] text-[15px] sm:text-[16px] leading-relaxed text-[var(--stone)] font-medium">
              Hand-tossed, blistered in a 400°C oven, finished with chilli honey. We don’t do soggy. We do <em className="text-[var(--ink)] not-italic font-bold">chew, char, na hio stretch ya cheese</em>.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <MagneticButton href="/menu" className="h-[52px] px-7 rounded-full bg-[var(--brand)] text-white font-black tracking-widest text-[13px] hover:bg-[var(--heat)] shadow-[0_10px_30px_rgba(227,53,13,0.35)]">
                ORDER THIS ONE — KSh 1,350
              </MagneticButton>
              <a href="#how" className="h-[52px] px-6 inline-flex items-center justify-center rounded-full bg-white border border-[var(--line)] font-bold text-sm hover:border-[var(--ink)] transition-colors">
                HOW WE MAKE IT ↓
              </a>
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs">
              <div className="flex -space-x-2">
                {[0,1,2].map(i=>(
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--paper)] bg-[var(--cream)] grid place-items-center text-[11px] font-bold">{["A","J","M"][i]}</div>
                ))}
              </div>
              <div className="leading-tight">
                <div className="font-bold">4.8 ★ on Google</div>
                <div className="text-[var(--stone)]">2,400+ orders this month</div>
              </div>
              <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-[var(--line)]">
                <span className="w-8 h-8 rounded-full bg-[#E8F5E9] border border-[#A5D6A7] grid place-items-center font-bold text-[10px] text-[#1B5E20]">25’</span>
                <div className="leading-tight text-[11px] font-bold tracking-wide">25-35 MIN<br/><span className="text-[var(--stone)] font-normal">Avg. delivery — CBD</span></div>
              </div>
            </div>
          </div>

          {/* right — The Build scene */}
          <div className="order-1 lg:order-2 relative min-h-[420px] sm:min-h-[520px] lg:min-h-[620px] grid place-items-center">
            {/* stamp */}
            <div className="absolute top-2 right-2 sm:right-6 rotate-[8deg] bg-[var(--accent)] text-[var(--ink)] px-3 py-1.5 rounded-[2px] font-black text-[10px] tracking-[0.14em] border border-[var(--ink)] shadow-[3px_3px_0_var(--ink)] z-20">
              ORDER DIRECT • NO APP FEE
            </div>

            <div ref={pizzaRef} className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[520px] lg:h-[520px]">
              {/* glow */}
              <div className="hero-glow absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,_rgba(255,77,6,0.35),_transparent_70%)] blur-[18px]" />

              {/* shadow */}
              <div className="absolute bottom-[18px] left-1/2 -translate-x-1/2 w-[68%] h-[28px] bg-black/20 blur-[16px] rounded-full" />

              {/* dough */}
              <div className="hero-dough absolute inset-[6%] rounded-full bg-[#FFE8D1] border-[10px] border-white shadow-[0_18px_40px_rgba(0,0,0,0.18),inset_0_0_0_2px_rgba(0,0,0,0.05)] overflow-hidden">
                {/* crust dots */}
                <div className="absolute inset-0 rounded-full border-[14px] border-[#FFD9B3]/60" />
              </div>

              {/* sauce */}
              <div className="hero-sauce absolute inset-[14%] rounded-full bg-[#E3350D] opacity-90" style={{background:"radial-gradient(circle at 30% 30%, #FF4D06 0%, #E3350D 55%, #9B1B0F 100%)"}} />

              {/* cheese */}
              <div className="hero-cheese absolute inset-[18%] rounded-full bg-[#FFF3B0] opacity-95" style={{background:"radial-gradient(circle at 35% 25%, #FFF8C6 0%, #FFE8A0 35%, #FFD666 70%)"}} >
                <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(white 1.5px, transparent 1.5px)", backgroundSize:"14px 14px"}} />
                {/* stretch strings */}
                <div className="absolute top-[18%] left-[28%] w-[2px] h-[40%] bg-white/60 rotate-[12deg] rounded-full" />
                <div className="absolute top-[30%] right-[32%] w-[2px] h-[28%] bg-white/50 rotate-[-8deg] rounded-full" />
              </div>

              {/* toppings */}
              <div className="hero-topping-1 absolute w-[68px] h-[68px] sm:w-[84px] sm:h-[84px] rounded-full bg-[#7A1306] border-[3px] border-[#FF8A6B] shadow-md top-[22%] left-[24%] grid place-items-center">
                <span className="w-2 h-2 rounded-full bg-[#FFB3A0] absolute top-[28%] left-[30%]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB3A0] absolute bottom-[30%] right-[28%]" />
              </div>
              <div className="hero-topping-2 absolute w-[58px] h-[58px] sm:w-[74px] sm:h-[74px] rounded-full bg-[#7A1306] border-[3px] border-[#FF8A6B] shadow-md top-[48%] right-[20%] grid place-items-center">
                <span className="w-2 h-2 rounded-full bg-[#FFB3A0] absolute top-[32%] left-[28%]" />
              </div>
              <div className="hero-topping-3 absolute w-[62px] h-[62px] sm:w-[78px] sm:h-[78px] rounded-full bg-[#3B8A2E] border-[3px] border-[#A8E6A0] shadow-md bottom-[22%] left-[34%] grid place-items-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2C8 6 6 10 12 22C18 10 16 6 12 2Z" fill="#A8E6A0" stroke="#1B5E20" strokeWidth="1.2"/></svg>
              </div>

              {/* basil leaf SVG overlay */}
              <div className="hero-topping-3 absolute bottom-[30%] right-[30%] w-12 h-12 rotate-[18deg] opacity-90">
                <svg viewBox="0 0 40 40" fill="none"><path d="M20 4 C 12 12, 8 20, 20 36 C 32 20, 28 12, 20 4Z" fill="#2E7D32" stroke="#1B5E20" strokeWidth="1.5"/></svg>
              </div>

              {/* steam */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-60">
                <span className="w-[2px] h-10 bg-gradient-to-t from-transparent to-white/80 rounded-full animate-pulse" />
                <span className="w-[2px] h-14 bg-gradient-to-t from-transparent to-white/60 rounded-full animate-pulse delay-150" />
                <span className="w-[2px] h-8 bg-gradient-to-t from-transparent to-white/70 rounded-full animate-pulse delay-300" />
              </div>
            </div>

            {/* price tag */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:translate-x-0 bg-[var(--ink)] text-white px-4 py-3 rounded-[12px] flex items-center gap-3 shadow-xl">
              <div className="w-10 h-10 rounded-full bg-[var(--accent)] grid place-items-center text-[var(--ink)] font-black">→</div>
              <div className="leading-tight">
                <div className="text-[11px] tracking-widest font-bold opacity-60">THIS BUILD</div>
                <div className="font-black">Pepperoni Heat — Large</div>
              </div>
            </div>

            {/* cut-out shadow label */}
            <div className="hidden lg:block absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 bg-white border border-[var(--line)] px-3 py-1 text-[10px] tracking-[0.2em] font-black">
              HAND-TOSSED • WOOD-FIRED • NAIROBI
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="hidden sm:flex items-center justify-between py-3 border-t border-[var(--line)] text-[11px] font-bold tracking-widest">
          <span>SCROLL TO BUILD ↓</span>
          <span className="text-[var(--stone)]">EST. 2020 • NGONG ROAD • 400°C OVEN</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" /> WHATSAPP 0700 000 000</span>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .hero-topping-1, .hero-topping-2, .hero-topping-3 { will-change: transform; } }`}</style>
    </section>
  );
}
