"use client";
import { MenuItem } from "@/lib/types";
import { formatKSh } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@/lib/analytics";

export default function ProductModal({ item, open, onClose }: { item: MenuItem | null; open: boolean; onClose: ()=>void }) {
  const { add, flyToCart } = useCart();
  const [sizeIdx, setSizeIdx] = useState(0);
  const [crust, setCrust] = useState<string | undefined>(item?.crusts[0]);
  const [extras, setExtras] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [removed, setRemoved] = useState<string[]>([]);

  if (!item) return null;
  const size = item.sizes[sizeIdx] ?? item.sizes[0];
  const extrasTotal = extras.reduce((acc, name)=> acc + (item.extras.find(e=>e.name===name)?.price||0), 0);
  const crustExtra = crust?.includes("+") ? parseInt(crust.split("+")[1]) || 0 : 0;
  const lineTotal = (size.price + extrasTotal + crustExtra) * qty;

  const handleAdd = (e?: React.MouseEvent) => {
    const rect = (e?.currentTarget as HTMLElement)?.getBoundingClientRect() ?? null;
    add({
      uid: Math.random().toString(36).slice(2),
      itemId: item.id,
      name: item.name,
      image: item.image,
      size,
      crust,
      extras: item.extras.filter(ex=>extras.includes(ex.name)),
      removedIngredients: removed,
      notes,
      qty,
      lineTotal
    });
    if (rect) flyToCart(rect);
    else {
      const el = document.getElementById("cart-icon");
      if (el) flyToCart(el.getBoundingClientRect());
    }
    track("add_to_cart", { item_id: item.id, item_name: item.name, price: lineTotal, currency:"KES", qty });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}} transition={{type:"spring", damping:30, stiffness:300}} className="fixed bottom-0 left-0 right-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-[720px] sm:w-[92%] bg-[var(--paper)] z-50 rounded-t-[20px] sm:rounded-[16px] max-h-[92dvh] flex flex-col overflow-hidden border border-[var(--line)] shadow-2xl">
            {/* handle bar mobile */}
            <div className="sm:hidden w-10 h-1.5 rounded-full bg-[var(--line)] mx-auto mt-3" />
            <div className="overflow-auto flex-1">
              <div className="grid sm:grid-cols-[1.05fr_1fr] gap-0">
                {/* image */}
                <div className="bg-[var(--brand-soft)] p-6 grid place-items-center relative min-h-[260px]">
                  <div className="w-[80%] aspect-square rounded-full bg-gradient-to-br from-[#FF6B35] via-[#E3350D] to-[#7A1306] border-[10px] border-white shadow-xl grid place-items-center text-white font-black">HUHU’S</div>
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-black">TODO: real photo</div>
                </div>
                {/* details */}
                <div className="p-6 space-y-5">
                  <div>
                    <div className="font-display font-black text-[22px] leading-none tracking-tighter">{item.name}</div>
                    {item.swahili && <div className="text-[11px] tracking-[0.15em] font-bold text-[var(--brand)]">{item.swahili.toUpperCase()}</div>}
                    <p className="text-sm text-[var(--stone)] mt-2 leading-relaxed">{item.description}</p>
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {item.ingredients.map(ing=>(
                        <button key={ing} onClick={()=> setRemoved(r=> r.includes(ing) ? r.filter(x=>x!==ing) : [...r, ing])} className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${removed.includes(ing) ? "bg-[var(--ink)] text-white border-[var(--ink)] line-through opacity-60" : "bg-white border-[var(--line)] hover:border-[var(--ink)]"}`}>
                          {removed.includes(ing) ? `✕ ${ing}` : `− ${ing}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* size */}
                  <div>
                    <div className="text-[11px] font-black tracking-widest">SIZE</div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {item.sizes.map((s,idx)=>(
                        <button key={s.name} onClick={()=>setSizeIdx(idx)} className={`p-3 rounded-[12px] border-2 text-left ${sizeIdx===idx ? "border-[var(--brand)] bg-[var(--brand-soft)]" : "border-[var(--line)] bg-white"}`}>
                          <div className="font-black text-sm leading-none">{s.name}</div>
                          {s.inches && <div className="text-[11px] text-[var(--stone)]">{s.inches}"</div>}
                          <div className="font-bold text-[13px] mt-1">{formatKSh(s.price)}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* crust */}
                  {item.crusts.length>0 && (
                    <div>
                      <div className="text-[11px] font-black tracking-widest">CRUST</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.crusts.map(c=>(
                          <button key={c} onClick={()=>setCrust(c)} className={`px-3 py-2 rounded-full text-sm font-bold border ${crust===c ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "bg-white border-[var(--line)]"}`}>{c}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* extras */}
                  {item.extras.length>0 && (
                    <div>
                      <div className="text-[11px] font-black tracking-widest">ADD EXTRA</div>
                      <div className="space-y-2 mt-2">
                        {item.extras.map(ex=>(
                          <label key={ex.name} className="flex items-center justify-between p-3 rounded-[12px] border border-[var(--line)] bg-white cursor-pointer hover:border-[var(--ink)]">
                            <span className="flex items-center gap-3">
                              <input type="checkbox" checked={extras.includes(ex.name)} onChange={e=> setExtras(v=> e.target.checked ? [...v, ex.name] : v.filter(x=>x!==ex.name))} className="w-4 h-4 accent-[var(--brand)]" />
                              <span className="font-bold text-sm">{ex.name}</span>
                            </span>
                            <span className="text-sm font-bold">+{formatKSh(ex.price)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-[11px] font-black tracking-widest">SPECIAL NOTES</div>
                    <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="No onions, extra chilli..." className="mt-2 w-full h-10 px-3 rounded-[10px] border border-[var(--line)] bg-white text-sm focus:border-[var(--ink)] outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* footer bar */}
            <div className="border-t border-[var(--line)] bg-white p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1 border border-[var(--line)] rounded-full p-1">
                <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--paper)]">−</button>
                <span className="w-8 text-center font-black">{qty}</span>
                <button onClick={()=>setQty(q=>q+1)} className="w-9 h-9 grid place-items-center rounded-full hover:bg-[var(--paper)]">+</button>
              </div>
              <button onClick={(e)=>handleAdd(e)} className="flex-1 h-12 rounded-full bg-[var(--brand)] text-white font-black tracking-widest hover:bg-[var(--heat)] transition-colors">
                ADD • {formatKSh(lineTotal)}
              </button>
              <button onClick={onClose} className="hidden sm:grid w-10 h-10 place-items-center rounded-full border border-[var(--line)]">✕</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
