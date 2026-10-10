"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(()=>{
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(()=> setShow(false), reduced ? 400 : 1100);
    const onKey = (e:KeyboardEvent)=> { if (e.key==="Escape") setShow(false); };
    window.addEventListener("keydown", onKey);
    return ()=> { clearTimeout(t); window.removeEventListener("keydown", onKey); };
  },[]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{y:0}} exit={{y:"-100%"}} transition={{duration:0.6, ease:[0.16,1,0.3,1]}} className="fixed inset-0 z-[100] bg-[var(--brand)] text-[var(--paper)] grid place-items-center">
          <div className="text-center">
            <motion.div initial={{scale:0.8, rotate:-2}} animate={{scale:1, rotate:0}} transition={{duration:0.6, ease:"easeOut"}} className="mx-auto w-20 h-20 rounded-[4px] bg-[var(--paper)] text-[var(--brand)] grid place-items-center font-display font-black text-[24px] rotate-[-2deg]">
              HUHU’S
            </motion.div>
            <div className="mt-4 font-display font-black text-[18px] tracking-tighter">MOTO INAJIPIKA...</div>
            <div className="mt-2 w-32 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
              <motion.div initial={{x:"-100%"}} animate={{x:0}} transition={{duration:1, ease:"easeInOut"}} className="h-full bg-[var(--accent)] w-full" />
            </div>
            <button onClick={()=>setShow(false)} className="mt-6 text-[11px] font-bold tracking-widest opacity-60 hover:opacity-100">SKIP — TAP TO ORDER →</button>
          </div>
          <div className="absolute bottom-6 text-[10px] tracking-[0.2em] font-bold opacity-60">NAIROBI • WOOD-FIRED SINCE 2020</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
