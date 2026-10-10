"use client";
import { useState, useMemo, useRef } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { MenuItem, Category } from "@/lib/types";
import { formatKSh } from "@/lib/utils";

type Props = {
  data: { categories: Category[]; items: MenuItem[] };
};

export default function MenuClient({ data }: Props) {
  const [active, setActive] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [diet, setDiet] = useState<string>("all");
  const [selected, setSelected] = useState<MenuItem | null>(null);

  const filtered = useMemo(()=>{
    return data.items.filter(i=>{
      if (active!=="all" && i.category!==active) return false;
      if (diet==="veg" && !i.tags.includes("vegetarian")) return false;
      if (diet==="spicy" && !i.tags.includes("spicy")) return false;
      if (search && !(`${i.name} ${i.description} ${i.ingredients.join(" ")}`.toLowerCase().includes(search.toLowerCase()))) return false;
      return true;
    });
  }, [active, search, diet, data.items]);

  return (
    <div className="bg-[var(--paper)]">
      {/* header */}
      <div className="bg-[var(--ink)] text-[var(--paper)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"radial-gradient(var(--paper) 1px, transparent 1px)", backgroundSize:"18px 18px"}} />
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[11px] tracking-[0.18em] font-black text-[var(--accent)]">MENU • PRICES IN KSh • UPDATED DAILY</div>
              <h1 className="bleed-type text-[36px] sm:text-[56px] leading-none mt-2">CHAGUA<br/><span className="text-[var(--accent)]">POISON.</span></h1>
            </div>
            <div className="max-w-[420px] w-full">
              <div className="relative">
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search — pepperoni, nyama, peri..." className="w-full h-11 pl-10 pr-4 rounded-full bg-white text-[var(--ink)] placeholder:text-[var(--stone)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--stone)]">⌕</span>
                {search && <button onClick={()=>setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 grid place-items-center rounded-full bg-[var(--paper)] text-xs">✕</button>}
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={()=>setDiet("all")} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${diet==="all"?"bg-[var(--accent)] text-black border-[var(--accent)]":"bg-white/10 text-white border-white/20"}`}>ALL</button>
                <button onClick={()=>setDiet("veg")} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${diet==="veg"?"bg-[var(--accent)] text-black border-[var(--accent)]":"bg-white/10 text-white border-white/20"}`}>🌿 VEGETARIAN</button>
                <button onClick={()=>setDiet("spicy")} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${diet==="spicy"?"bg-[var(--accent)] text-black border-[var(--accent)]":"bg-white/10 text-white border-white/20"}`}>🌶 MOTO</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* sticky category rail */}
      <div className="sticky top-[64px] sm:top-[72px] z-30 bg-[var(--paper)]/95 backdrop-blur border-b border-[var(--line)]">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
            <button onClick={()=>setActive("all")} className={`shrink-0 h-9 px-5 rounded-full font-black text-xs tracking-widest border ${active==="all"?"bg-[var(--ink)] text-white border-[var(--ink)]":"bg-white border-[var(--line)] hover:border-[var(--ink)]"}`}>ALL</button>
            {data.categories.map(c=>(
              <button key={c.id} onClick={()=>setActive(c.id)} className={`shrink-0 h-9 px-5 rounded-full font-bold text-sm border flex items-center gap-2 ${active===c.id?"bg-[var(--brand)] text-white border-[var(--brand)]":"bg-white border-[var(--line)] hover:border-[var(--ink)]"}`}>
                {c.name} <span className="hidden sm:inline text-[10px] tracking-widest opacity-60">{c.swahili?.toUpperCase()}</span>
              </button>
            ))}
            <span className="ml-auto hidden sm:inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[var(--stone)] shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" /> OPEN TILL 22:00
            </span>
          </div>
        </div>
      </div>

      {/* grid */}
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {filtered.length===0 ? (
          <div className="py-20 text-center">
            <div className="font-display font-black text-[24px]">Hakuna kitu hapa</div>
            <p className="text-[var(--stone)] mt-2">Try another category or clear search.</p>
            <button onClick={()=>{setSearch(""); setActive("all"); setDiet("all");}} className="mt-4 h-10 px-6 rounded-full bg-[var(--brand)] text-white font-bold">CLEAR FILTERS</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map(item=>(
              <ProductCard key={item.id} item={item} onOpen={()=>setSelected(item)} />
            ))}
          </div>
        )}

        {/* menu meta */}
        <div className="mt-10 p-4 sm:p-6 bg-white border border-[var(--line)] rounded-[16px] grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-black tracking-widest text-xs">ALLERGENS & NOTES</div>
            <p className="text-[var(--stone)] mt-1 leading-relaxed">All pizzas contain gluten & dairy. Tell us allergies in “Special notes”. We fire on same surface — not celiac-safe.</p>
          </div>
          <div>
            <div className="font-black tracking-widest text-xs">SIZES</div>
            <p className="text-[var(--stone)] mt-1">Regular 9" • Medium 12" • Large 14"</p>
            <p className="text-[11px] mt-1 font-bold bg-[var(--brand-soft)] inline-block px-2 py-1 rounded-full">Large feeds 2–3 watu</p>
          </div>
          <div>
            <div className="font-black tracking-widest text-xs">PRICES</div>
            <p className="text-[var(--stone)] mt-1">In KSh, inclusive. Delivery fee by zone shows at checkout.</p>
          </div>
        </div>
      </div>

      <ProductModal item={selected} open={!!selected} onClose={()=>setSelected(null)} />
    </div>
  );
}
