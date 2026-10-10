"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "./types";

type CartContextType = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (uid: string) => void;
  updateQty: (uid: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  flyToCart: (fromRect: DOMRect | null) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [fly, setFly] = useState<{x:number;y:number}|null>(null);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("huhus_cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("huhus_cart", JSON.stringify(items));
  }, [items]);

  const add = (item: CartItem) => {
    setItems(prev => {
      // merge if same config
      const idx = prev.findIndex(p => p.itemId===item.itemId && p.size.name===item.size.name && p.crust===item.crust && JSON.stringify(p.extras)===JSON.stringify(item.extras) && p.notes===item.notes);
      if (idx>=0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + item.qty, lineTotal: copy[idx].lineTotal + item.lineTotal };
        return copy;
      }
      return [...prev, item];
    });
    setIsOpen(true);
  };
  const remove = (uid:string) => setItems(prev=>prev.filter(p=>p.uid!==uid));
  const updateQty = (uid:string, qty:number) => {
    if (qty<=0) return remove(uid);
    setItems(prev=>prev.map(p=> p.uid===uid ? {...p, qty, lineTotal: (p.lineTotal/p.qty)*qty } : p));
  };
  const clear = () => setItems([]);
  const count = useMemo(()=> items.reduce((a,b)=>a+b.qty,0),[items]);
  const subtotal = useMemo(()=> items.reduce((a,b)=>a+b.lineTotal,0),[items]);

  const flyToCart = (fromRect: DOMRect | null) => {
    if (!fromRect) return;
    const target = document.getElementById("cart-icon");
    if (!target) return;
    const tRect = target.getBoundingClientRect();
    const el = document.createElement("div");
    el.textContent = "•"; el.style.fontWeight="900"; el.style.color="var(--brand)"; el.style.background="var(--accent)"; el.style.width="24px"; el.style.height="24px"; el.style.display="grid"; el.style.placeItems="center"; el.style.borderRadius="999px";
    el.style.position = "fixed";
    el.style.left = fromRect.left + "px";
    el.style.top = fromRect.top + "px";
    el.style.zIndex = "9999";
    el.style.fontSize = "24px";
    el.style.pointerEvents = "none";
    el.style.transition = "transform 700ms cubic-bezier(0.34,1.56,0.64,1), opacity 700ms ease";
    document.body.appendChild(el);
    requestAnimationFrame(()=>{
      const dx = tRect.left - fromRect.left;
      const dy = tRect.top - fromRect.top;
      el.style.transform = `translate(${dx}px, ${dy}px) scale(0.3) rotate(720deg)`;
      el.style.opacity = "0";
    });
    setTimeout(()=> el.remove(), 750);
    // buzz cart icon
    target.animate([{transform:"scale(1)"},{transform:"scale(1.25)"},{transform:"scale(1)"}],{duration:400,easing:"cubic-bezier(0.34,1.56,0.64,1)"});
  };

  return <CartContext.Provider value={{items, add, remove, updateQty, clear, count, subtotal, isOpen, setIsOpen, flyToCart}}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside provider");
  return ctx;
}
