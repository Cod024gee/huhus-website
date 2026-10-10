"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(()=>{
    const isTouch = "ontouchstart" in window || window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return; // native scroll on touch

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t)=> Math.min(1, 1.001 - Math.pow(2, -10*t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.8,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time)=> lenis.raf(time*1000));
    gsap.ticker.lagSmoothing(0);

    return ()=> {
      gsap.ticker.remove((time)=> lenis.raf(time*1000));
      lenis.destroy();
    };
  },[]);
  return null;
}
