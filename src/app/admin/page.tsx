"use client";
import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "@/lib/orders";
import { formatKSh } from "@/lib/utils";
import menuData from "@/data/menu.json";
import postsData from "@/data/posts.json";
import { Order, OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["Received","Baking","On the way","Delivered","Cancelled"];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<"orders"|"menu"|"feed"|"settings">("orders");
  const [menuItems, setMenuItems] = useState<any[]>(() => (menuData as any).items);
  const [posts, setPosts] = useState<any[]>(() => (postsData as any).posts);
  const [banner, setBanner] = useState("MOTO MOTO — Order direct, we fire in 10 🔥");
  const [hours, setHours] = useState({ open:"10:00", close:"22:00" });
  const [zones, setZones] = useState<any[]>(() => (menuData as any).zones);

  useEffect(()=>{
    if (!authed) return;
    const load = ()=> setOrders(getOrders());
    load();
    const onNew = (e:any)=> {
      setOrders(getOrders());
      // sound alert
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = 880; g.gain.value=0.1;
        o.start(); setTimeout(()=>{o.stop(); ctx.close();}, 300);
      } catch {}
      // simple toast
      if ("vibrate" in navigator) navigator.vibrate(200);
    };
    window.addEventListener("huhus:new-order", onNew);
    window.addEventListener("huhus:order-update", load);
    const interval = setInterval(load, 2000);
    return ()=> { window.removeEventListener("huhus:new-order", onNew); window.removeEventListener("huhus:order-update", load); clearInterval(interval); };
  }, [authed]);

  // Sales summary
  const today = new Date().toISOString().slice(0,10);
  const todayOrders = orders.filter(o=> o.createdAt.slice(0,10)===today);
  const revenueToday = todayOrders.reduce((a,b)=>a+b.total,0);
  const topItems = (()=> {
    const map = new Map<string, number>();
    orders.forEach(o=> o.items.forEach((ci:any)=> map.set(ci.name, (map.get(ci.name)||0)+ci.qty)));
    return [...map.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5);
  })();

  const handleLogin = (e:any)=> {
    e.preventDefault();
    if (pw==="huhus2024" || pw==="admin") setAuthed(true);
    else alert("Wrong password — try huhus2024 (demo)");
  };

  if (!authed) {
    return (
      <div className="min-h-[70dvh] grid place-items-center bg-[var(--paper)] px-4">
        <form onSubmit={handleLogin} className="w-full max-w-[380px] bg-white border border-[var(--line)] rounded-[16px] p-6 text-center">
          <div className="w-14 h-14 rounded-[4px] bg-[var(--brand)] text-white grid place-items-center font-black mx-auto">HUHU’S</div>
          <h1 className="mt-3 font-display font-black text-[20px]">Admin Login</h1>
          <p className="text-xs text-[var(--stone)] mt-1">Protected — manager only. Demo password: <span className="font-bold text-[var(--ink)]">huhus2024</span></p>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password" className="mt-4 w-full h-11 px-3 rounded-[10px] border border-[var(--line)] focus:border-[var(--ink)] outline-none" />
          <button type="submit" className="mt-3 w-full h-11 rounded-full bg-[var(--ink)] text-white font-black tracking-widest">ENTER</button>
          <div className="mt-3 text-[11px] text-[var(--stone)]">In production: Supabase Auth + RLS. This demo uses localStorage.</div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-[var(--paper)] min-h-[80dvh]">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="bleed-type text-[28px] sm:text-[36px]">ADMIN — HUHU’S</h1>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#A5D6A7] text-xs font-black">● LIVE • {orders.length} ORDERS</span>
            <button onClick={()=>setAuthed(false)} className="h-9 px-4 rounded-full border border-[var(--line)] bg-white font-bold text-xs">LOGOUT</button>
          </div>
        </div>

        {/* tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar border-b border-[var(--line)] pb-2">
          {[
            {id:"orders", label:"ORDERS"},
            {id:"menu", label:"MENU"},
            {id:"feed", label:"FEED"},
            {id:"settings", label:"SETTINGS"},
          ].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id as any)} className={`h-9 px-5 rounded-full font-black text-xs tracking-widest border shrink-0 ${tab===t.id?"bg-[var(--ink)] text-white border-[var(--ink)]":"bg-white border-[var(--line)]"}`}>{t.label}</button>
          ))}
        </div>

        {tab==="orders" && (
          <div className="mt-6 space-y-6">
            {/* sales summary */}
            <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[var(--line)] rounded-[12px] p-4">
                <div className="text-[11px] font-black tracking-widest text-[var(--stone)]">ORDERS TODAY</div>
                <div className="font-black text-[24px]">{todayOrders.length}</div>
                <div className="text-xs text-[var(--stone)]">{orders.length} total</div>
              </div>
              <div className="bg-[var(--brand)] text-white rounded-[12px] p-4">
                <div className="text-[11px] font-black tracking-widest opacity-80">REVENUE TODAY</div>
                <div className="font-black text-[24px]">{formatKSh(revenueToday)}</div>
                <div className="text-xs opacity-80">{formatKSh(orders.reduce((a,b)=>a+b.total,0))} total</div>
              </div>
              <div className="bg-white border border-[var(--line)] rounded-[12px] p-4 sm:col-span-2">
                <div className="text-[11px] font-black tracking-widest text-[var(--stone)]">TOP ITEMS</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {topItems.length ? topItems.map(([name,c])=>(
                    <span key={name} className="px-2.5 py-1 rounded-full bg-[var(--brand-soft)] border border-[var(--line)] text-xs font-bold">{name} ×{c}</span>
                  )) : <span className="text-xs text-[var(--stone)]">No sales yet — place a test order</span>}
                </div>
              </div>
            </div>

            {/* orders board */}
            {orders.length===0 ? (
              <div className="bg-white border border-dashed border-[var(--line)] rounded-[16px] p-10 text-center">
                <div className="font-display font-black text-[18px]">No orders yet</div>
                <p className="text-sm text-[var(--stone)] mt-1">Place a test order from /menu → checkout. It will appear here live with sound.</p>
                <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-[var(--accent)] text-xs font-black">TIP: Enable sound — we beep on new order</div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-4">
                {orders.map(o=>(
                  <div key={o.id} className="bg-white border border-[var(--line)] rounded-[16px] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-black text-sm">{o.number} <span className="font-normal text-[var(--stone)]">• {new Date(o.createdAt).toLocaleString()}</span></div>
                        <div className="text-sm font-bold mt-0.5">{o.customer.name} • {o.customer.phone}</div>
                        <div className="text-xs text-[var(--stone)]">{o.fulfilment.toUpperCase()} {o.customer.zoneId?`• ${o.customer.zoneId}`:""} {o.customer.address?`• ${o.customer.address}`:""}</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest border shrink-0 ${o.status==="Received"?"bg-[#FFF3E0] text-[#E65100] border-[#FFCC80]": o.status==="Baking"?"bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]": o.status==="On the way"?"bg-[#E3F2FD] text-[#1565C0] border-[#90CAF9]": o.status==="Delivered"?"bg-[#E8F5E9] text-[#1B5E20] border-[#A5D6A7]":"bg-[#FFEBEE] text-[#C62828] border-[#EF9A9A]"}`}>{o.status.toUpperCase()}</span>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {o.items.map((ci:any)=>(
                        <div key={ci.uid} className="flex justify-between text-xs bg-[var(--paper)] px-2.5 py-1.5 rounded-[8px] border border-[var(--line)]">
                          <span>{ci.qty}× {ci.name} <span className="text-[var(--stone)]">({ci.size.name}{ci.crust?` • ${ci.crust}`:""})</span></span>
                          <span className="font-bold">{formatKSh(ci.lineTotal)}</span>
                        </div>
                      ))}
                    </div>
                    {o.notes && <div className="mt-2 text-xs italic bg-[var(--brand-soft)] px-2.5 py-1.5 rounded-[8px]">"{o.notes}"</div>}
                    <div className="mt-3 flex justify-between items-center">
                      <div className="font-black">{formatKSh(o.total)} <span className="text-xs font-normal text-[var(--stone)]">via {o.paymentMethod}</span></div>
                      <a href={`https://wa.me/${o.customer.phone.replace("+","")}?text=Habari%20${encodeURIComponent(o.customer.name)}!%20Order%20${encodeURIComponent(o.number)}%20status:%20${encodeURIComponent(o.status)}`} target="_blank" className="h-7 px-3 grid place-items-center rounded-full bg-[#25D366] text-white text-[10px] font-black">WHATSAPP</a>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {STATUSES.map(s=>(
                        <button key={s} onClick={()=>{updateOrderStatus(o.id, s); setOrders(getOrders());}} className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide border ${o.status===s?"bg-[var(--ink)] text-white border-[var(--ink)]":"bg-white border-[var(--line)] hover:border-[var(--ink)]"}`}>{s.toUpperCase()}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-[12px] p-4 text-sm">
              <div className="font-black">Kitchen screen tip</div>
              <p className="text-[var(--stone)] mt-1">Keep this tab open — new orders beep and vibrate. In production this is Supabase Realtime + sound. Print via thermal printer supported via browser print.</p>
            </div>
          </div>
        )}

        {tab==="menu" && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-black text-[18px]">Menu Manager</h2>
              <div className="text-xs font-bold tracking-widest bg-[var(--brand-soft)] px-2.5 py-1 rounded-full border border-[var(--line)]">LOCAL DEMO — edits persist in memory only</div>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item:any)=>(
                <div key={item.id} className="bg-white border border-[var(--line)] rounded-[12px] p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-black text-sm leading-tight">{item.name}</div>
                    <span className={`w-3 h-3 rounded-full ${item.bestseller?"bg-[var(--accent)]":"bg-[var(--line)]"}`} title={item.bestseller?"Bestseller":""} />
                  </div>
                  <div className="text-xs text-[var(--stone)] mt-1 line-clamp-2">{item.description}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.sizes.map((s:any)=>(
                      <span key={s.name} className="px-2 py-1 rounded-full bg-[var(--paper)] border border-[var(--line)] text-[11px] font-bold">{s.name}: {formatKSh(s.price)}</span>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={()=>{
                      const newPrice = prompt(`New price for ${item.sizes[0].name} (KSh)`, String(item.sizes[0].price));
                      if (newPrice) {
                        setMenuItems(prev=> prev.map(p=> p.id===item.id ? {...p, sizes: p.sizes.map((s:any,i:number)=> i===0?{...s, price: parseInt(newPrice)||s.price}:s)} : p));
                      }
                    }} className="flex-1 h-8 rounded-full border border-[var(--line)] font-bold text-xs">EDIT PRICE</button>
                    <button onClick={()=>{
                      setMenuItems(prev=> prev.map(p=> p.id===item.id ? {...p, bestseller: !p.bestseller} : p));
                    }} className={`h-8 px-3 rounded-full font-bold text-xs border ${item.bestseller?"bg-[var(--accent)] border-[var(--ink)]":"bg-white border-[var(--line)]"}`}>BESTSELLER</button>
                    <button onClick={()=>{
                      if (confirm(`Toggle ${item.name} sold out?`)) {
                        setMenuItems(prev=> prev.map(p=> p.id===item.id ? {...p, _soldOut: !p._soldOut} : p));
                      }
                    }} className="h-8 px-3 rounded-full bg-white border border-[var(--line)] font-bold text-xs">SOLD OUT</button>
                  </div>
                  {item._soldOut && <div className="mt-2 text-[10px] font-black tracking-widest text-red-600">● SOLD OUT (hidden from customers)</div>}
                </div>
              ))}
            </div>
            <div className="mt-6 bg-white border border-[var(--line)] rounded-[12px] p-4">
              <div className="font-black text-sm">Add new item (demo)</div>
              <div className="mt-3 grid sm:grid-cols-3 gap-3">
                <input placeholder="Name" id="new-name" className="h-10 px-3 rounded-[10px] border border-[var(--line)]" />
                <input placeholder="Price KSh" id="new-price" className="h-10 px-3 rounded-[10px] border border-[var(--line)]" />
                <button onClick={()=>{
                  const name = (document.getElementById("new-name") as HTMLInputElement).value;
                  const price = parseInt((document.getElementById("new-price") as HTMLInputElement).value) || 0;
                  if (!name || !price) return alert("Enter name and price");
                  setMenuItems(prev=> [...prev, { id: name.toLowerCase().replace(/\s+/g,"-"), name, category:"pizzas", bestseller:false, description:"New item — edit me", ingredients:[], tags:[], image:"/images/placeholder.jpg", sizes:[{name:"Regular", price}], crusts:["Thin Crust"], extras:[]}]);
                }} className="h-10 rounded-full bg-[var(--brand)] text-white font-black text-xs">+ ADD ITEM</button>
              </div>
              <div className="mt-3 text-xs text-[var(--stone)]">In production: Supabase Storage for photos, toggle availability instantly. Seed via /data/menu.json → Supabase seed script in README.</div>
            </div>
          </div>
        )}

        {tab==="feed" && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-black text-[18px]">Feed Manager — Fresh Posts</h2>
              <button onClick={()=>{
                const title = prompt("Post title");
                if (!title) return;
                const body = prompt("Body") || "";
                setPosts(prev=> [{id: Date.now().toString(), title, body, image:"/images/placeholder.jpg", type:"image", date: new Date().toISOString().slice(0,10), orderLink:null}, ...prev]);
              }} className="h-9 px-4 rounded-full bg-[var(--brand)] text-white font-black text-xs">+ NEW POST</button>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((p:any)=>(
                <div key={p.id} className="bg-white border border-[var(--line)] rounded-[12px] overflow-hidden">
                  <div className="aspect-[4/3] bg-[var(--cream)] grid place-items-center relative">
                    <div className="w-12 h-12 rounded-full bg-white border border-[var(--line)] grid place-items-center font-black text-[10px]">HUHU’S</div>
                    <span className="absolute top-2 left-2 bg-[var(--ink)] text-white text-[10px] font-black px-2 py-1 rounded-full">{p.type.toUpperCase()}</span>
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] font-bold tracking-widest text-[var(--stone)]">{p.date}</div>
                    <div className="font-black mt-1 leading-tight">{p.title}</div>
                    <p className="text-xs text-[var(--stone)] mt-1 line-clamp-3">{p.body}</p>
                    <div className="mt-3 flex gap-2">
                      <button onClick={()=>{
                        if (confirm("Delete post?")) setPosts(prev=> prev.filter(x=>x.id!==p.id));
                      }} className="flex-1 h-8 rounded-full border border-[var(--line)] font-bold text-xs">DELETE</button>
                      <button onClick={()=>{
                        const nt = prompt("Edit title", p.title);
                        if (nt) setPosts(prev=> prev.map(x=> x.id===p.id ? {...x, title: nt}:x));
                      }} className="flex-1 h-8 rounded-full bg-[var(--ink)] text-white font-bold text-xs">EDIT</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="settings" && (
          <div className="mt-6 grid lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[var(--line)] rounded-[16px] p-5">
              <h3 className="font-display font-black">Opening Hours</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="space-y-1">
                  <span className="text-[11px] font-black tracking-widest">OPEN</span>
                  <input type="time" value={hours.open} onChange={e=>setHours({...hours, open:e.target.value})} className="w-full h-10 px-3 rounded-[10px] border border-[var(--line)]" />
                </label>
                <label className="space-y-1">
                  <span className="text-[11px] font-black tracking-widest">CLOSE</span>
                  <input type="time" value={hours.close} onChange={e=>setHours({...hours, close:e.target.value})} className="w-full h-10 px-3 rounded-[10px] border border-[var(--line)]" />
                </label>
              </div>
              <div className="mt-3 text-xs text-[var(--stone)]">Badge in header updates instantly. When closed, checkout shows pre-order.</div>

              <h3 className="font-display font-black mt-6">Banner Message</h3>
              <input value={banner} onChange={e=>setBanner(e.target.value)} placeholder="Christmas closure..." className="mt-2 w-full h-10 px-3 rounded-[10px] border border-[var(--line)]" />
              <div className="mt-2 p-2 rounded-[8px] bg-[var(--accent)] text-xs font-bold border border-[var(--ink)]">{banner || "No banner"}</div>
            </div>

            <div className="bg-white border border-[var(--line)] rounded-[16px] p-5">
              <h3 className="font-display font-black">Delivery Zones & Fees</h3>
              <div className="mt-3 space-y-2">
                {zones.map((z:any)=>(
                  <div key={z.id} className="flex items-center gap-2 p-2 rounded-[10px] border border-[var(--line)] bg-[var(--paper)]">
                    <span className="flex-1 font-bold text-sm">{z.name}</span>
                    <input type="number" value={z.fee} onChange={e=> setZones(prev=> prev.map(x=> x.id===z.id ? {...x, fee: parseInt(e.target.value)||0}:x))} className="w-20 h-8 px-2 rounded-[8px] border border-[var(--line)] text-sm" />
                    <span className="text-xs font-bold">KSh</span>
                    <button onClick={()=> setZones(prev=> prev.filter(x=>x.id!==z.id))} className="w-7 h-7 grid place-items-center rounded-full bg-white border border-[var(--line)] text-xs">✕</button>
                  </div>
                ))}
              </div>
              <button onClick={()=>{
                const name = prompt("Zone name");
                if (!name) return;
                setZones(prev=> [...prev, {id: name.toLowerCase().replace(/\s+/g,"-"), name, fee: 200, eta:"30-40 min"}]);
              }} className="mt-3 h-9 px-4 rounded-full border border-[var(--line)] font-bold text-xs">+ ADD ZONE</button>

              <div className="mt-6 p-3 rounded-[10px] bg-[var(--paper)] border border-[var(--line)] text-xs leading-relaxed">
                <div className="font-black">How zones work</div>
                <p className="text-[var(--stone)] mt-1">Customer picks zone at checkout — fee & ETA show instantly before pay. Edit here, changes reflect at checkout (demo: in-memory).</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={()=> alert("Saved (demo) — in production writes to Supabase settings table")} className="flex-1 h-10 rounded-full bg-[var(--brand)] text-white font-black text-xs">SAVE SETTINGS</button>
                <button onClick={()=>{
                  localStorage.clear();
                  alert("Cleared localStorage — orders, cart reset");
                  setOrders([]);
                }} className="h-10 px-4 rounded-full bg-white border border-[var(--line)] font-black text-xs text-red-600">RESET DEMO DATA</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
