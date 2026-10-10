export const metadata = { title: "Our Story — Huhu's Pizzas", description: "The people, the fire, the dough. Nairobi story." };

export default function StoryPage() {
  return (
    <div className="bg-[var(--paper)]">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* asymmetric editorial */}
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-start">
          <div>
            <div className="text-[11px] tracking-[0.18em] font-black text-[var(--brand)]">OUR STORY — EST. NGONG ROAD 2020</div>
            <h1 className="bleed-type text-[44px] sm:text-[72px] leading-[0.85] mt-3">
              WE<br/>STARTED<br/><span className="text-[var(--brand)]">WITH FIRE.</span>
            </h1>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed max-w-[560px]">
              <p className="font-medium">Huhu’s wasn’t a business plan. It was a jiko, a bag of flour, and a crew that wouldn’t sleep until the crust puffed right.</p>
              <p className="text-[var(--stone)]">We’re from Nairobi, for Nairobi. We ferment 48 hours because haste makes flat bread. We fire at 400°C because that’s where the leopard spots live. And we finish with chilli honey because Kenyans love sweet-heat — <em className="text-[var(--ink)] not-italic font-bold">tamu na moto</em>.</p>
              <p className="text-[var(--stone)]">No freezer dough. No pre-shredded cheese. We hand-toss, we hand-top, we watch it blister, and we box it while it still steams your hands.</p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 max-w-[520px]">
              <div className="bg-white border border-[var(--line)] rounded-[12px] p-4 text-center">
                <div className="font-black text-xl">400°C</div><div className="text-[10px] tracking-widest font-bold text-[var(--stone)]">WOOD OVEN</div>
              </div>
              <div className="bg-white border border-[var(--line)] rounded-[12px] p-4 text-center">
                <div className="font-black text-xl">48H</div><div className="text-[10px] tracking-widest font-bold text-[var(--stone)]">DOUGH</div>
              </div>
              <div className="bg-[var(--brand)] text-white rounded-[12px] p-4 text-center">
                <div className="font-black text-xl">2.4k</div><div className="text-[10px] tracking-widest font-bold opacity-80">ORDERS / MO</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-[var(--line)] rounded-[16px] overflow-hidden">
              <div className="aspect-[4/3] bg-[var(--cream)] grid place-items-center relative">
                <div className="w-20 h-20 rounded-full bg-[var(--ink)] text-white grid place-items-center font-display font-black">HUHU</div>
                <div className="absolute bottom-3 left-3 bg-[var(--ink)] text-white px-3 py-1.5 rounded-full text-xs font-bold">TODO: real chef photo</div>
              </div>
              <div className="p-5">
                <div className="font-display font-black text-[18px]">Chef Huhu & Crew</div>
                <p className="text-sm text-[var(--stone)] mt-1">Ngong Road crew — early dough, late fire. Come say hi. The oven window is open.</p>
              </div>
            </div>
            <div className="bg-[var(--ink)] text-white rounded-[16px] p-6 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[var(--brand)] rounded-full blur-2xl opacity-30" />
              <div className="relative">
                <div className="text-[11px] tracking-[0.18em] font-black text-[var(--accent)]">THE PROMISE</div>
                <p className="mt-2 font-display font-black text-[20px] leading-tight">If the cheese doesn’t pull,<br/>we re-fire it. No questions.</p>
                <p className="text-sm text-white/70 mt-2">That’s the Huhu’s promise. Moto moto, or on us.</p>
              </div>
            </div>
            {/* video placeholder */}
            <div className="bg-white border border-[var(--line)] rounded-[16px] p-4 flex items-center gap-4">
              <div className="w-20 h-20 rounded-[12px] bg-[var(--brand)] grid place-items-center text-white shrink-0"><svg width="20" height="20" viewBox="0 0 20 20"><polygon points="4,0 20,10 4,20" fill="white"/></svg></div>
              <div>
                <div className="font-bold text-sm">Watch the 90-second bake</div>
                <div className="text-xs text-[var(--stone)]">Oven cam — from dough to box.</div>
                <div className="mt-1 text-[10px] font-bold tracking-widest bg-[var(--brand-soft)] inline-block px-2 py-1 rounded-full">TODO: replace with real video</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values — not three equal cards */}
        <div className="mt-12 grid lg:grid-cols-[0.8fr_1.2fr] gap-4">
          <div className="bg-[var(--accent)] rounded-[16px] p-6 border border-[var(--ink)]">
            <div className="font-display font-black text-[22px] leading-none">WARM,<br/>LOUD,<br/>HUNGRY.</div>
            <p className="text-sm mt-3 font-medium">Three words we live by. Warm like home, loud like Nairobi, hungry like we haven’t eaten.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[var(--line)] rounded-[16px] p-5">
              <div className="w-8 h-8 rounded-full bg-[var(--brand-soft)] grid place-items-center">🤝</div>
              <div className="font-black mt-3">Direct First</div>
              <p className="text-xs text-[var(--stone)] mt-1">Order direct, we keep the full cut. No app tax.</p>
            </div>
            <div className="bg-white border border-[var(--line)] rounded-[16px] p-5">
              <div className="w-8 h-8 rounded-full bg-[var(--brand-soft)] grid place-items-center">🌾</div>
              <div className="font-black mt-3">Real Ingredients</div>
              <p className="text-xs text-[var(--stone)] mt-1">San Marzano, flour from local millers, fresh herbs daily.</p>
            </div>
            <div className="bg-white border border-[var(--line)] rounded-[16px] p-5">
              <div className="w-8 h-8 rounded-full bg-[var(--brand-soft)] grid place-items-center">⚡</div>
              <div className="font-black mt-3">Fast Fire</div>
              <p className="text-xs text-[var(--stone)] mt-1">10 min bake, 25 min delivery CBD. No story.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
