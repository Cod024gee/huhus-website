"use client";
import ProductCard from "./ProductCard";
import { useState } from "react";
import ProductModal from "./ProductModal";
import { MenuItem } from "@/lib/types";

export default function HomeClient({ bestsellers }: { bestsellers: MenuItem[] }) {
  const [selected, setSelected] = useState<MenuItem | null>(null);
  return (
    <>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {bestsellers.map(item=>(
          <ProductCard key={item.id} item={item} onOpen={()=>setSelected(item)} />
        ))}
      </div>
      <ProductModal item={selected} open={!!selected} onClose={()=>setSelected(null)} />
    </>
  );
}
