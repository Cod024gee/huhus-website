"use client";
import { MenuItem } from "@/lib/types";
import { formatKSh } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { useState, useRef } from "react";

export default function ProductCard({ item, onOpen }: { item: MenuItem; onOpen: ()=>void }) {
  const { add, flyToCart } = useCart();
  const [hover, setHover] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cheapest = [...item.sizes].sort((a,b)=>a.price-b.price)[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    add({
      uid: Math.random().toString(36).slice(2),
      itemId: item.id,
      name: item.name,
      image: item.image,
      size: cheapest,
      crust: item.crusts[0],
      extras: [],
      removedIngredients: [],
      notes: "",
      qty: 1,
      lineTotal: cheapest.price
    });
    flyToCart(rect);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 1024) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x*6}deg) rotateX(${-y*6}deg) translateZ(0)`;
  };
  const handleLeave = () => {
    setHover(false);
    if (cardRef.current) cardRef.current.style.transform = "perspective(800px) rotateY(0) rotateX(0)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={handleLeave}
      onClick={onOpen}
      className="group relative bg-white border border-[var(--line)] rounded-[16px] overflow-hidden cursor-pointer tilt-card transition-transform duration-300 will-change-transform"
    >
      {/* image */}
      <div className="relative aspect-[4/3] bg-[var(--brand-soft)] overflow-hidden">
        {/* TODO: replace with real Huhus food photo — visible placeholder */}
        <div className="absolute bottom-2 right-2 z-10 px-2 py-1 rounded-full bg-white/90 border border-[var(--line)] text-[9px] font-bold tracking-widest">TODO: real photo</div>
        <div className="absolute inset-0 grid place-items-center">
          <div className="w-[68%] aspect-square rounded-full bg-gradient-to-br from-[#FF6B35] via-[#E3350D] to-[#7A1306] shadow-[0_18px_40px_rgba(122,19,6,0.45)] relative overflow-hidden border-[8px] border-[#FFE8D1] group-hover:scale-[1.03] transition-transform duration-500">
            {/* cheese pull texture */}
            <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 30% 30%, white 2px, transparent 2px)", backgroundSize:"18px 18px"}} />
            <div className="absolute inset-0 grid place-items-center text-white font-black text-[24px] tracking-tighter drop-shadow">HUHU’S</div>
            {/* pepperoni dots */}
            <div className="absolute w-8 h-8 rounded-full bg-[#7A1306] border-2 border-[#FF8A6B] top-[22%] left-[28%]" />
            <div className="absolute w-6 h-6 rounded-full bg-[#7A1306] border-2 border-[#FF8A6B] top-[55%] left-[60%]" />
            <div className="absolute w-7 h-7 rounded-full bg-[#7A1306] border-2 border-[#FF8A6B] top-[45%] left-[20%]" />
          </div>
        </div>

        {/* tags */}
        <div className="absolute top-3 left-3 flex gap-2">
          {item.bestseller && <span className="px-2.5 py-1 rounded-full bg-[var(--accent)] text-[10px] font-black tracking-widest">BESTSELLER</span>}
          {item.tags.includes("spicy") && <span className="px-2.5 py-1 rounded-full bg-[var(--brand)] text-white text-[10px] font-black tracking-widest">MOTO</span>}
        </div>
        <div className="absolute top-3 right-3 w-8 h-8 grid place-items-center rounded-full bg-white border border-[var(--line)] text-[10px] font-bold">
          {item.sizes.length>1 ? `${item.sizes.length} sizes` : formatKSh(item.sizes[0].price)}
        </div>

        {/* ingredient tags on hover */}
        <div className={`absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 transition-all duration-300 ${hover ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"} hidden sm:flex`}>
          {item.ingredients.slice(0,5).map(ing=>(
            <span key={ing} className="px-2 py-1 rounded-full bg-[var(--ink)] text-white text-[10px] font-bold tracking-wide">{ing}</span>
          ))}
        </div>
      </div>

      {/* body */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-black text-[18px] sm:text-[20px] leading-none tracking-tighter">{item.name}</h3>
          <span className="shrink-0 font-black text-[14px] text-[var(--brand)]">{formatKSh(Math.min(...item.sizes.map(s=>s.price)))} <span className="text-[11px] font-bold text-[var(--stone)]">from</span></span>
        </div>
        <p className="text-[13px] leading-relaxed text-[var(--stone)] mt-1.5 line-clamp-2">{item.description}</p>

        <div className="mt-4 flex items-center gap-2">
          <button onClick={handleQuickAdd} className="flex-1 h-10 rounded-full bg-[var(--ink)] text-white font-black text-[12px] tracking-widest hover:bg-[var(--brand)] transition-colors">
            ADD — {formatKSh(Math.min(...item.sizes.map(s=>s.price)))}
          </button>
          <button className="w-10 h-10 grid place-items-center rounded-full border border-[var(--line)] hover:border-[var(--ink)] transition-colors">
            <span className="text-[16px]">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}
