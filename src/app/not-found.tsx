import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-[60dvh] grid place-items-center bg-[var(--paper)] px-4 py-16 text-center">
      <div>
        <div className="bleed-type text-[56px]">404</div>
        <div className="font-display font-black text-[18px] mt-2">Wrong turn — like pineapple on our oven.</div>
        <p className="text-[var(--stone)] mt-2">Go back to menu, we’ll fire something better.</p>
        <Link href="/" className="inline-flex mt-6 h-11 px-6 rounded-full bg-[var(--brand)] text-white font-black">BACK HOME</Link>
      </div>
    </div>
  );
}
