import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-[var(--paper)]">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        {/* big CTA */}
        <div className="py-10 sm:py-14 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center border-b border-white/10">
          <div>
            <div className="bleed-type text-[42px] sm:text-[64px] lg:text-[88px] text-[var(--paper)]">
              STILL <span className="text-[var(--accent)]">HUNGRY?</span>
            </div>
            <p className="text-white/70 max-w-[520px] mt-3">Order direct — we fire in 10. No app fees. Your money stays with the kitchen that fed you.</p>
          </div>
          <div className="flex flex-col sm:flex-row lg:justify-end gap-3">
            <Link href="/menu" className="h-[56px] px-8 grid place-items-center rounded-full bg-[var(--brand)] text-white font-black tracking-widest hover:bg-[var(--heat)] transition-colors text-center">
              ORDER NOW — MENU
            </Link>
            <a href="https://wa.me/254700000000?text=Habari%20Huhus!%20Nataka%20ku-order" target="_blank" className="h-[56px] px-8 grid place-items-center rounded-full bg-white text-[var(--ink)] font-black tracking-widest hover:bg-[var(--accent)] transition-colors text-center">
              WHATSAPP US
            </a>
          </div>
        </div>

        <div className="py-10 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="font-display font-black text-[20px] tracking-tighter">HUHU’S PIZZAS</div>
            <div className="text-white/60 mt-2 leading-relaxed">
              Wood-fired, hand-tossed, Nairobi-made.<br/>Mon–Sun 10:00 – 22:00<br/>
              <a href="tel:+254700000000" className="underline decoration-[var(--accent)] hover:text-white">0700 000 000</a> • <a href="mailto:hello@huhuspizzas.co.ke" className="underline">hello@huhuspizzas.co.ke</a>
            </div>
            <div className="flex gap-2 mt-4">
              <a href="#" className="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-[var(--accent)] hover:text-[var(--ink)] transition-colors">IG</a>
              <a href="#" className="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-[var(--accent)] hover:text-[var(--ink)] transition-colors">TT</a>
              <a href="#" className="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-[var(--accent)] hover:text-[var(--ink)] transition-colors">WA</a>
            </div>
          </div>
          <div>
            <div className="font-bold tracking-widest text-xs">VISIT</div>
            <div className="text-white/60 mt-3 leading-relaxed">
              Huhus HQ — Ngong Road, Nairobi<br/>
              <a href="https://maps.google.com/?q=Ngong+Road+Nairobi" target="_blank" className="underline">Get directions →</a><br/>
              Pickup • Delivery • Dine-in
            </div>
            {/* TODO: replace with real map embed */}
          </div>
          <div>
            <div className="font-bold tracking-widest text-xs">QUICK LINKS</div>
            <div className="flex flex-col gap-2 mt-3 text-white/70">
              <Link href="/menu" className="hover:text-white">Menu</Link>
              <Link href="/story" className="hover:text-white">Our Story</Link>
              <Link href="/fresh" className="hover:text-white">Fresh — New & Specials</Link>
              <Link href="/admin" className="hover:text-white">Admin login</Link>
            </div>
          </div>
          <div>
            <div className="font-bold tracking-widest text-xs">SECONDARY DELIVERY</div>
            <p className="text-white/50 text-xs mt-3">We cook best when you order direct. If you prefer apps:</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <a href="#" className="px-3 py-1.5 rounded-full border border-white/20 text-xs hover:bg-white hover:text-black">Glovo</a>
              <a href="#" className="px-3 py-1.5 rounded-full border border-white/20 text-xs hover:bg-white hover:text-black">Uber Eats</a>
              <a href="#" className="px-3 py-1.5 rounded-full border border-white/20 text-xs hover:bg-white hover:text-black">Bolt Food</a>
            </div>
            <div className="mt-6 text-[10px] tracking-widest font-bold text-white/30">© {new Date().getFullYear()} HUHU’S PIZZAS • MADE IN NAIROBI</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
