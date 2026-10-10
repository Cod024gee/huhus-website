import HeroBuild from "@/components/HeroBuild";
import Marquee from "@/components/Marquee";
import ProductCard from "@/components/ProductCard";
import menuData from "@/data/menu.json";
import postsData from "@/data/posts.json";
import { formatKSh } from "@/lib/utils";
import Link from "next/link";
import HomeClient from "@/components/HomeClient";
import { Reveal, Parallax } from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";

export default function Home() {
  const bestsellers = (menuData.items as any[]).filter(i=> i.bestseller).slice(0,3);
  const pizzas = (menuData.items as any[]).filter(i=> i.category==="pizzas").slice(0,3);
  const combos = (menuData.items as any[]).filter(i=> i.category==="combos");

  const menuJsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "name": "Huhu's Pizzas Menu",
    "hasMenuSection": (menuData as any).categories.map((c:any)=> ({
      "@type": "MenuSection",
      "name": c.name,
      "hasMenuItem": (menuData as any).items.filter((i:any)=> i.category===c.id).map((i:any)=> ({
        "@type": "MenuItem",
        "name": i.name,
        "description": i.description,
        "offers": { "@type": "Offer", "price": Math.min(...i.sizes.map((s:any)=>s.price)), "priceCurrency": "KES" }
      }))
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(menuJsonLd)}} />
      <HeroBuild />

      {/* Marquee */}
      <Marquee />

      {/* Bestsellers rail */}
      <section className="py-10 sm:py-14 bg-white border-b border-[var(--line)]">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <h2 className="bleed-type text-[32px] sm:text-[48px] lg:text-[56px]">BESTSELLERS <span className="text-[var(--brand)]">—</span> <span className="text-[var(--stone)] text-[16px] sm:text-[20px] tracking-[0.12em] font-bold align-middle">WATU WANAPENDA</span></h2>
              <Link href="/menu" className="hidden sm:inline-flex h-10 px-5 rounded-full border border-[var(--ink)] font-black text-xs tracking-widest hover:bg-[var(--ink)] hover:text-white transition-colors">VIEW FULL MENU →</Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}><HomeClient bestsellers={bestsellers} /></Reveal>
          <div className="sm:hidden mt-4">
            <Link href="/menu" className="h-11 w-full grid place-items-center rounded-full bg-[var(--ink)] text-white font-black tracking-widest">VIEW FULL MENU</Link>
          </div>
        </div>
      </section>

      {/* How we make it — editorial asymmetric */}
      <section id="how" className="py-12 sm:py-20 bg-[var(--brand-soft)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-full opacity-[0.06] pointer-events-none hidden lg:block" style={{backgroundImage:"radial-gradient(var(--brand) 1px, transparent 1px)", backgroundSize:"22px 22px"}} />
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-start">
            <div className="lg:sticky lg:top-[88px]">
              <div className="text-[11px] font-black tracking-[0.18em] text-[var(--brand)]">HOW WE MAKE IT — 3 STEPS, NO SHORTCUTS</div>
              <h2 className="mt-3 bleed-type text-[36px] sm:text-[52px] leading-[0.9]">
                DOUGH<br/><span className="text-[var(--brand)]"> THAT CHEWS.</span><br/>FIRE THAT<br/>BITES.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--stone)] max-w-[520px]">
                48-hour fermented dough, San Marzano tomatoes, fior di latte. We stretch by hand, fire at 400°C for 90 seconds, and finish with things that slap — chilli honey, dhania, peri-peri.
                <br/><span className="text-[var(--ink)] font-bold">Ukikosa hii, umekosa.</span>
              </p>
              <div className="mt-6 flex gap-3">
                <div className="px-3 py-2 bg-white border border-[var(--line)] rounded-[10px] text-center min-w-[92px]">
                  <div className="font-black text-[18px] leading-none">48H</div><div className="text-[10px] tracking-widest font-bold text-[var(--stone)]">FERMENT</div>
                </div>
                <div className="px-3 py-2 bg-white border border-[var(--line)] rounded-[10px] text-center min-w-[92px]">
                  <div className="font-black text-[18px] leading-none">400°C</div><div className="text-[10px] tracking-widest font-bold text-[var(--stone)]">WOOD OVEN</div>
                </div>
                <div className="px-3 py-2 bg-white border border-[var(--line)] rounded-[10px] text-center min-w-[92px]">
                  <div className="font-black text-[18px] leading-none">90S</div><div className="text-[10px] tracking-widest font-bold text-[var(--stone)]">BAKE</div>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {/* Step 1 */}
              <div className="bg-white border border-[var(--line)] rounded-[16px] overflow-hidden grid sm:grid-cols-[1.1fr_0.9fr]">
                <div className="p-6 sm:p-7">
                  <div className="w-8 h-8 rounded-full bg-[var(--brand)] text-white grid place-items-center font-black text-sm">1</div>
                  <h3 className="mt-3 font-display font-black text-[20px] tracking-tighter">DOUGH — COLD FERMENTED</h3>
                  <p className="text-sm text-[var(--stone)] mt-2 leading-relaxed">We mix, we rest, we wait. 48 hours cold for that airy crumb and chew. No shortcuts, no premix.</p>
                  <div className="mt-3 inline-flex px-2.5 py-1 rounded-full bg-[var(--brand-soft)] text-[11px] font-bold tracking-wide">TODO: replace with real kitchen photo</div>
                </div>
                <div className="bg-[var(--cream)] min-h-[180px] grid place-items-center relative">
                  <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg grid place-items-center text-3xl">🥖</div>
                  <div className="absolute bottom-3 right-3 bg-[var(--ink)] text-white text-[10px] font-bold px-2 py-1 rounded-full">48H • 4°C</div>
                </div>
              </div>
              {/* Step 2 */}
              <div className="bg-[var(--ink)] text-white rounded-[16px] overflow-hidden grid sm:grid-cols-[0.9fr_1.1fr]">
                <div className="bg-[#2A1A14] grid place-items-center min-h-[180px] relative overflow-hidden">
                  {/* oven glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_#FF4D06_0%,_transparent_60%)] opacity-60" />
                  <div className="relative w-36 h-24 bg-[#1A0F0D] rounded-[10px] border-4 border-[#3A2015] grid place-items-center">
                    <div className="w-20 h-14 rounded-full bg-gradient-to-b from-orange-400 to-red-700 blur-[2px] animate-pulse" />
                    <div className="absolute -bottom-2 text-[10px] font-black tracking-widest bg-[var(--accent)] text-black px-2 py-0.5 rounded-full">400°C</div>
                  </div>
                </div>
                <div className="p-6 sm:p-7">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--ink)] grid place-items-center font-black text-sm">2</div>
                  <h3 className="mt-3 font-display font-black text-[20px] tracking-tighter">FIRE — 90 SECOND BAKE</h3>
                  <p className="text-sm text-white/70 mt-2 leading-relaxed">Wood fire does what electric can’t — leopard spots, puffed crust, smoky kiss. In and out before your story ends.</p>
                </div>
              </div>
              {/* Step 3 + cheese pull */}
              <div className="bg-white border border-[var(--line)] rounded-[16px] overflow-hidden grid sm:grid-cols-[1.1fr_0.9fr]">
                <div className="p-6 sm:p-7">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--ink)] grid place-items-center font-black text-sm">3</div>
                  <h3 className="mt-3 font-display font-black text-[20px] tracking-tighter">FINISH — CHILLI HONEY & DHANIA</h3>
                  <p className="text-sm text-[var(--stone)] mt-2 leading-relaxed">We finish off-heat so herbs stay fresh, cheese stays stretchy. That pull? That’s the flex.</p>
                </div>
                <div className="relative bg-[var(--brand)] grid place-items-center min-h-[180px] overflow-hidden">
                  {/* cheese pull masked container — brand-shaped */}
                  <div className="w-[78%] aspect-[4/3] bg-white rounded-[18px] rotate-[-2deg] shadow-xl grid place-items-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#FFE8A0] to-white" />
                    <div className="relative text-[var(--brand)] font-black text-[28px]">— CHEESE PULL —</div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest bg-[var(--ink)] text-white px-2 py-1 rounded-full">LOOPING VIDEO PLACEHOLDER</div>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border border-[var(--line)] grid place-items-center"><svg width="10" height="10" viewBox="0 0 10 10"><polygon points="2,0 10,5 2,10" fill="var(--brand)"/></svg></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu preview by category */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="bleed-type text-[28px] sm:text-[44px]">MENU <span className="text-[var(--stone)]">— CHAGUA POISON</span></h2>
            <Link href="/menu" className="text-[11px] font-black tracking-widest underline decoration-[var(--brand)] decoration-2 underline-offset-4">SEE FULL MENU →</Link>
          </div>

          <div className="mt-8 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pizzas.map(p=>(
                  <Link key={p.id} href={`/menu#${p.id}`} className="group relative bg-[var(--paper)] border border-[var(--line)] rounded-[16px] p-4 hover:border-[var(--ink)] transition-colors">
                    <div className="w-full aspect-[4/3] rounded-[12px] bg-white border border-[var(--line)] grid place-items-center overflow-hidden relative">
                      {/* TODO: replace with real Huhus food photo */}
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-white border border-[var(--line)] text-[8px] font-bold">TODO: real photo</span>
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#7A1306] border-4 border-[var(--cream)] group-hover:scale-110 transition-transform grid place-items-center text-white font-black text-[10px]">HUHU’S</div>
                    </div>
                    <div className="mt-3 font-black leading-none">{p.name}</div>
                    <div className="text-xs text-[var(--stone)] mt-1 line-clamp-2">{p.description}</div>
                    <div className="mt-3 font-black text-[var(--brand)] text-sm">{formatKSh(p.sizes[1]?.price || p.sizes[0].price)}</div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-[var(--ink)] text-white rounded-[16px] p-6 flex flex-col justify-between min-h-[280px] relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-[var(--brand)] opacity-20 blur-2xl" />
              <div>
                <div className="inline-flex px-2.5 py-1 rounded-full bg-[var(--accent)] text-[var(--ink)] text-[10px] font-black tracking-widest">COMBOS & OFFERS</div>
                <h3 className="mt-3 font-display font-black text-[24px] leading-none">MSEE WA<br/>COMBO</h3>
                <p className="text-sm text-white/70 mt-2">2 Large + 1.25L soda — for the table that came hungry.</p>
              </div>
              <div>
                <div className="font-black text-[22px]">{formatKSh(combos[0]?.sizes[0].price || 3200)} <span className="text-sm font-bold line-through opacity-50">{formatKSh(3900)}</span></div>
                <Link href="/menu" className="mt-3 h-10 w-full grid place-items-center rounded-full bg-[var(--brand)] font-black tracking-widest text-sm">GRAB COMBO →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offers strip */}
      <section className="bg-[var(--accent)] border-y border-[var(--ink)]">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 font-black tracking-tighter text-[16px] sm:text-[18px]">
            <span className="hidden sm:inline bg-[var(--ink)] text-white px-2 py-1 rounded-[2px] rotate-[-1deg]">OFFER</span>
            <span>TUESDAY BUY 1 GET 1 — Medium pizzas • Dine-in & Pickup</span>
          </div>
          <Link href="/menu" className="h-9 px-5 grid place-items-center rounded-full bg-[var(--ink)] text-white font-black text-xs tracking-widest">CLAIM — MENU</Link>
        </div>
      </section>

      {/* Social proof + Instagram */}
      <section className="py-10 sm:py-14 bg-[var(--paper)]">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.95fr_1.1fr] gap-8 lg:gap-10 items-start">
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-[var(--line)] rounded-full px-3 py-1 text-xs font-bold">
                <span className="text-[#FFB800]">★★★★★</span> 4.8 on Google • 412 reviews
              </div>
              <h2 className="mt-4 bleed-type text-[28px] sm:text-[40px] leading-[0.9]">WATU<br/>WANASEMA</h2>

              <div className="mt-6 space-y-4">
                {[
                  {n:"Brian M.", t:"Best crust in Nairobi. That chilli honey is dangerous.", s:"★★★★★"},
                  {n:"Aisha K.", t:"Peri-peri kuku — moto but balanced. Delivery was 28 mins to Kilimani.", s:"★★★★★"},
                  {n:"Kevin O.", t:"Nyama choma deluxe tastes like Sunday at home. Will order again.", s:"★★★★☆"},
                ].map(r=>(
                  <div key={r.n} className="bg-white border border-[var(--line)] rounded-[12px] p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm">{r.n}</div><div className="text-xs">{r.s}</div>
                    </div>
                    <p className="text-sm text-[var(--stone)] mt-1">“{r.t}”</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <h3 className="font-display font-black text-[18px] tracking-tighter">FRESH FROM THE KITCHEN</h3>
                <a href="#" className="text-[11px] font-black tracking-widest">IG @HUHUSPIZZAS →</a>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {postsData.posts.map((p:any)=>(
                  <div key={p.id} className="aspect-[3/4] rounded-[12px] overflow-hidden bg-white border border-[var(--line)] relative group">
                    <div className="absolute inset-0 bg-[var(--cream)] grid place-items-center">
                      <div className="w-12 h-12 rounded-full bg-white border border-[var(--line)] grid place-items-center font-black text-[10px] tracking-widest">HUHU’S</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-0 p-3 text-white">
                      <div className="text-[11px] font-black leading-tight line-clamp-2">{p.title}</div>
                      <div className="text-[10px] opacity-70 mt-1">{p.date}</div>
                    </div>
                    {p.type==="video" && <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white grid place-items-center border border-[var(--line)]"><svg width="10" height="10" viewBox="0 0 10 10"><polygon points="2,0 10,5 2,10" fill="var(--ink)"/></svg></div>}
                    <div className="absolute top-2 left-2 text-[8px] font-bold tracking-widest bg-[var(--accent)] text-black px-1.5 py-0.5 rounded">TODO: real video</div>
                  </div>
                ))}
                {/* placeholder cells */}
                {[0,1,2].map(i=>(
                  <div key={i} className="aspect-square rounded-[12px] bg-white border border-dashed border-[var(--line)] grid place-items-center text-[10px] font-bold tracking-widest text-[var(--stone)]">IG GRID</div>
                ))}
              </div>
              <Link href="/fresh" className="mt-4 h-10 w-full grid place-items-center rounded-full border border-[var(--ink)] font-black text-xs tracking-widest hover:bg-[var(--ink)] hover:text-white transition-colors">SEE ALL FRESH POSTS →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery & pickup info */}
      <section className="py-10 sm:py-12 bg-white border-y border-[var(--line)]">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10">
            <div>
              <h2 className="bleed-type text-[26px] sm:text-[36px]">DELIVERY • PICKUP • DINE-IN</h2>
              <div className="mt-6 grid sm:grid-cols-3 gap-3">
                {(menuData.zones as any[]).map(z=>(
                  <div key={z.id} className="bg-[var(--paper)] border border-[var(--line)] rounded-[12px] p-4">
                    <div className="text-[11px] font-black tracking-widest text-[var(--brand)]">{z.id.toUpperCase()}</div>
                    <div className="font-bold text-sm mt-1 leading-tight">{z.name}</div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-black text-[18px]">{formatKSh(z.fee)}</span><span className="text-xs text-[var(--stone)]">fee</span>
                    </div>
                    <div className="text-xs text-[var(--stone)]">ETA {z.eta}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-full bg-[var(--brand-soft)] border border-[var(--line)] font-bold">Min order KSh 800 for delivery</span>
                <span className="px-3 py-1.5 rounded-full bg-[var(--brand-soft)] border border-[var(--line)] font-bold">Pickup — no fee • Ready in ~15 mins</span>
                <span className="px-3 py-1.5 rounded-full bg-white border border-[var(--line)]">Pay: M-Pesa STK • Cash on delivery</span>
              </div>
            </div>
            <div className="bg-[var(--ink)] text-white rounded-[16px] p-6 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(white 1px, transparent 1px)", backgroundSize:"18px 18px"}} />
              <div className="relative">
                <div className="text-[11px] tracking-[0.15em] font-black text-[var(--accent)]">ESTIMATE BEFORE YOU PAY — NO SURPRISES</div>
                <div className="mt-2 font-display font-black text-[22px] leading-none">Know your fee before<br/>you choose toppings.</div>
                <p className="text-sm text-white/70 mt-3">Select your area in checkout and the fee shows instantly. We don’t hide it at the end.</p>
                <Link href="/menu" className="mt-5 inline-flex h-10 px-6 rounded-full bg-[var(--accent)] text-[var(--ink)] font-black text-xs tracking-widest">START ORDER — MENU</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="find-us" className="py-10 sm:py-14 bg-[var(--paper)]">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
            <div>
              <h2 className="bleed-type text-[28px] sm:text-[40px]">FIND US</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed">
                <div className="bg-white border border-[var(--line)] rounded-[12px] p-4">
                  <div className="font-black">HUHU’S HQ — Ngong Road</div>
                  <div className="text-[var(--stone)]">Opposite Prestige Plaza, Nairobi — Wood ovens on, daily.</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a href="https://maps.google.com/?q=Ngong+Road+Nairobi" target="_blank" className="h-9 px-4 grid place-items-center rounded-full bg-[var(--ink)] text-white font-bold text-xs">GET DIRECTIONS →</a>
                    <a href="tel:+254700000000" className="h-9 px-4 grid place-items-center rounded-full bg-white border border-[var(--line)] font-bold text-xs">CALL 0700 000 000</a>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-[var(--line)] rounded-[12px] p-4">
                    <div className="text-[11px] font-black tracking-widest">HOURS</div>
                    <div className="font-bold mt-1">Mon – Sun</div>
                    <div className="text-[var(--stone)]">10:00 — 22:00</div>
                    <div className="mt-2 inline-flex px-2 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-[10px] font-black">OPEN NOW</div>
                  </div>
                  <div className="bg-white border border-[var(--line)] rounded-[12px] p-4">
                    <div className="text-[11px] font-black tracking-widest">CONTACT</div>
                    <div className="font-bold mt-1">0700 000 000</div>
                    <div className="text-[var(--stone)] text-xs">WhatsApp • Call • DM</div>
                    <a href="https://wa.me/254700000000" target="_blank" className="mt-2 inline-flex text-xs font-bold underline">WhatsApp us →</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[var(--line)] rounded-[16px] overflow-hidden min-h-[320px] relative">
              {/* map placeholder */}
              <div className="absolute inset-0 bg-[#E8EEF2] grid place-items-center">
                <div className="text-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-[var(--brand)] text-white grid place-items-center text-xl">📍</div>
                  <div className="mt-3 font-black">Ngong Road, Nairobi</div>
                  <div className="text-xs text-[var(--stone)]">TODO: replace with Google Maps embed</div>
                  <a href="https://maps.google.com/?q=Ngong+Road+Nairobi" target="_blank" className="mt-3 inline-flex h-8 px-4 rounded-full bg-[var(--ink)] text-white text-xs font-bold">OPEN IN MAPS</a>
                </div>
              </div>
              {/* paper grain overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-10" style={{backgroundImage:"url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'n\\'%3E%3CfeTurbulence baseFrequency=\\'0.9\\'/%3E%3C/filter%3E%3Crect filter=\\'url(%23n)\\' height=\\'100%25\\' width=\\'100%25\\' opacity=\\'0.4\\'/%3E%3C/svg%3E')"}} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
