import postsData from "@/data/posts.json";
import Link from "next/link";
import { formatKSh } from "@/lib/utils";

export const metadata = { title: "Fresh — New, Specials & Events | Huhu's", description: "What's fresh at Huhu's — new dishes, specials, events." };

export default function FreshPage() {
  return (
    <div className="bg-[var(--paper)]">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] tracking-[0.18em] font-black text-[var(--brand)]">FRESH — FROM THE PASS</div>
            <h1 className="bleed-type text-[36px] sm:text-[56px] leading-none mt-2">WHAT’S <span className="text-[var(--brand)]">FRESH.</span></h1>
          </div>
          <p className="max-w-[420px] text-sm text-[var(--stone)]">New pies, pop-ups, and kitchen experiments. If it’s here, it’s in the oven. Hit “Order this” before it’s gone.</p>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(postsData.posts as any[]).map(post=>(
            <article key={post.id} className="bg-white border border-[var(--line)] rounded-[16px] overflow-hidden flex flex-col">
              <div className="aspect-[4/3] bg-[var(--cream)] relative grid place-items-center overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-white border border-[var(--line)] grid place-items-center font-black text-[10px]">HUHU’S</div>
                {post.type==="video" && <span className="absolute top-3 left-3 bg-[var(--ink)] text-white text-[10px] font-black px-2 py-1 rounded-full">VIDEO</span>}
                <span className="absolute bottom-3 left-3 bg-white text-[10px] font-bold px-2 py-1 rounded-full border border-[var(--line)]">TODO: real photo</span>
                <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white grid place-items-center border border-[var(--line)]"><svg width="10" height="10" viewBox="0 0 10 10"><polygon points="2,0 10,5 2,10" fill="var(--ink)"/></svg></span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-[11px] font-bold tracking-widest text-[var(--stone)]">{post.date}</div>
                <h2 className="font-display font-black text-[18px] leading-tight mt-1">{post.title}</h2>
                <p className="text-sm text-[var(--stone)] mt-2 leading-relaxed flex-1">{post.body}</p>
                {post.orderLink && (
                  <Link href={`/menu#${post.orderLink}`} className="mt-4 h-10 w-full grid place-items-center rounded-full bg-[var(--brand)] text-white font-black tracking-widest text-xs">ORDER THIS →</Link>
                )}
              </div>
            </article>
          ))}

          {/* Admin CTA */}
          <div className="bg-[var(--ink)] text-white rounded-[16px] p-6 flex flex-col justify-center min-h-[320px] relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-[var(--brand)] rounded-full blur-2xl opacity-30" />
            <div className="relative">
              <div className="text-[11px] tracking-[0.18em] font-black text-[var(--accent)]">FOR THE TEAM</div>
              <h3 className="mt-2 font-display font-black text-[22px] leading-none">Post your next<br/>special here.</h3>
              <p className="text-sm text-white/60 mt-3">Admin → Feed manager. Add image or video, title, body, and optional “Order this” link.</p>
              <Link href="/admin" className="mt-5 inline-flex h-10 px-6 rounded-full bg-white text-black font-black text-xs tracking-widest">GO TO ADMIN →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
