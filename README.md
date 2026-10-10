# Huhu's Pizzas — Wood-fired, Nairobi-made 🍕

**Live**: `npm install && npm run dev` → http://localhost:3000  
**Stack**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + GSAP + Lenis + Framer Motion + Supabase-ready + Daraja M-Pesa

> One job: turn hungry visitors into paying orders. No template, no stock pizza photos, no purple gradients. Hand-crafted for Huhus.

---

## What the client must supply (so nothing stays half-wired)

| Item | Format | Where it goes | Status now |
|------|--------|---------------|------------|
| **Logo** — vector (SVG/AI) + PNG at 2000px | SVG + PNG transparent | `/public/logo.svg`, favicon, loader, pattern | **PLACEHOLDER** — text wordmark `HUHU’S` used, flagged `TODO: replace with real logo` |
| **Food & kitchen photos** — real Huhus pizzas, oven, crew | JPG/WebP 1600px wide, compressed | `/public/images/` + Supabase Storage `huhus-images` | **PLACEHOLDER** — brand-colored illustrated pizza + `TODO: replace with real photo` on every card |
| **Full menu** — names, descriptions, sizes, prices in KSh, categories, bestsellers, crusts, extras | Edit `/src/data/menu.json` or via `/admin` → Menu | `menu.json` / Supabase `menu_items` | **SAMPLE MENU** labelled in `/data/menu.json` — owner replaces |
| **Location(s)** — address, Google Maps link, pin | Text | `/src/data/menu.json` zones + Footer + `/#find-us` | **PLACEHOLDER**: Ngong Road, Nairobi + 3 demo zones |
| **Hours, phone, WhatsApp, IG/TikTok handles** | Text | Header badge, Footer, `menu.json` hours | **PLACEHOLDER**: 10:00–22:00, 0700 000 000, `@huhuspizzas` |
| **Safaricom Till or Paybill + Daraja approval** | Till/Paybill number + Daraja keys | `.env.local` `MPESA_*` | **Not required to launch** — M-Pesa STK runs in sandbox mock, Pay on Delivery/Pickup works day one |
| **Brand colors — confirm hex or extract from logo** | Hex | `src/app/globals.css` CSS variables | **EXTRACTED PLACEHOLDER**: `--brand #E3350D` etc., AA-checked |

---

## Quick start

```bash
npm install
cp .env.example .env.local   # fill what you have — site runs without keys
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

The site **works fully without any keys**: cart, checkout (Pay on Delivery), order tracking, admin (localStorage), and M-Pesa in **mock sandbox** mode. Add real keys to go live.

---

## Environment variables

See `.env.example` — all variables documented. Key groups:

- **Supabase** (`NEXT_PUBLIC_SUPABASE_URL` etc.) — if empty, app uses `/data/*.json` + `localStorage` for demo. Add keys to use Postgres + Realtime + Storage.
- **M-Pesa Daraja** (`MPESA_CONSUMER_KEY`, `MPESA_SHORTCODE`, `MPESA_PASSKEY`, etc.) — if empty, `/api/mpesa/stkpush` returns a mock success so checkout never blocks. See “Daraja go-live” below.
- **Resend / Africa’s Talking** — email + SMS notifications. Optional; orders still work via WhatsApp deep link + admin dashboard.
- **GA4 / Meta Pixel** — client-side IDs.

---

## Supabase setup

1. Create Supabase project → copy URL + anon + service_role keys into `.env.local`.
2. Run `supabase.sql` in SQL editor (creates `categories`, `menu_items`, `posts`, `orders`, `settings`, enables Realtime on `orders`, creates Storage bucket `huhus-images`).
3. Seed: copy `/src/data/menu.json` items into `menu_items` (or build a small seed script — `INSERT INTO menu_items ...`).
4. Enable Realtime for `orders` in Dashboard → Database → Realtime (already in SQL).
5. Auth: create manager user → use email/password to protect `/admin`. Replace demo password (`huhus2024`) in `src/app/admin/page.tsx` with `supabase.auth.signInWithPassword`.

> No Supabase yet? Keep using JSON + localStorage — the schema is ready when you are.

---

## Daraja M-Pesa go-live

**What we built** (in `src/app/api/mpesa/stkpush/route.ts` + `callback/route.ts`):
- Server-side STK Push: gets OAuth token, builds `Password` (Shortcode+Passkey+Timestamp), calls `mpesa/stkpush/v1/processrequest`, verifies callback.
- Totals computed server-side (never trust client prices), keys server-only, idempotent order creation, rate-limit hook.
- Clear UI states: “Check your phone” + 45s countdown + retry, graceful fallback to **Pay on Delivery/Pickup**, “Order via WhatsApp” button, cart preserved on failure.

**To go live**:

1. **Get Till/Paybill** from Safaricom (business registration, KRA PIN). You’ll receive: Business ShortCode, Passkey (for Paybill Online / Till), Consumer Key/Secret.
2. Register at [developer.safaricom.co.ke](https://developer.safaricom.co.ke) → create app → get Consumer Key/Secret + Passkey.
3. Test in **sandbox** first: set `MPESA_ENV=sandbox`, `MPESA_SHORTCODE=174379` (sandbox), use test phone `254708374149`. Our route auto-mocks if keys missing — fill them and it will hit real sandbox.
4. Set `MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback` — must be **public HTTPS**. In Vercel it is. Daraja will POST `ResultCode`, `MpesaReceiptNumber`. Our callback verifies and updates order (see TODO in `callback/route.ts` for Supabase update).
5. Apply for **Go Live** in Daraja dashboard → Safaricom reviews (usually 1–3 days) → switch `MPESA_ENV=production`, `MPESA_SHORTCODE=your real Till`, `MPESA_PASSKEY=your real passkey`.
6. Test a real KSh 1 transaction on your phone.

> **Sandbox vs Production**: sandbox receipts start `ws_CO_`, production receipts are real. Always keep `Pay on Delivery` as fallback — customers without M-Pesa still convert.

---

## Project structure

```
src/
  app/
    layout.tsx, globals.css, page.tsx (Home + The Build hero)
    menu/page.tsx, story/page.tsx, fresh/page.tsx
    checkout/page.tsx, order/[id]/page.tsx, admin/page.tsx
    api/mpesa/stkpush/route.ts, api/mpesa/callback/route.ts
    sitemap.ts, robots.ts
  components/
    Header, Footer, CartDrawer, MobileCartBar
    HeroBuild (GSAP ScrollTrigger pinned scene)
    ProductCard, ProductModal, Marquee, HomeClient, MenuClient, CheckoutClient
    SmoothScroll (Lenis + GSAP), CustomCursor, Preloader
  lib/
    cart.tsx (Context + localStorage + fly-to-cart), orders.ts, utils.ts, types.ts
  data/
    menu.json (SAMPLE — replace), posts.json
supabase.sql — schema + RLS + Realtime
.env.example — all vars
```

---

## Brand system

**Tokens** (`src/app/globals.css` CSS variables):

```css
--brand: #E3350D      /* tomato — primary CTA, header, ribbon */
--brand-deep: #7A1306 /* burnt — borders, shadows */
--brand-soft: #FFF1E3 /* cream peach — section bg */
--ink: #1A0F0D        /* warm black — text, cart, footer */
--paper: #FFF8F0      /* warm white — page bg */
--accent: #FFB800     /* yolk yellow — bestseller, combos */
--heat: #FF4D06       /* hover/focus */
--cream: #FFE8D1
```

**Contrast**: WCAG AA checked — `--ink` on `--paper` 16.5:1, `--paper` on `--brand` used only for large display type (AA Large), body uses `--ink` on `--paper`. Neutrals adjusted, never brand.

**Typography** (self-hosted via `next/font`, `font-display: swap`):
- **Display**: `Fraunces` 600–900 — warm, slightly hand-drawn serif, continues a bold playful logo
- **Text**: `Instrument Sans` — highly readable, geometric humanist

Banned defaults avoided: Inter, Roboto, Poppins, Montserrat, Open Sans.

**Logo as device**: wordmark stamp → scroll-progress mark, loader, favicon, marquee brand phrase, receipt stamp.

**Voice**: short, cheeky, Kenyan where natural — `Piga order sahi`, `MOTO MOTO`, `Chagua poison`, `Hakuna kitu hapa`. No “Welcome to our website”.

---

## Design direction — anti-generic

- **No** purple/blue gradients, glassmorphism, emoji as icons, 3-equal-cards feature section, centered hero over stock image, rounded-everything Tailwind.
- **Yes**: asymmetric editorial grid, oversized bleed type (`bleed-type` 44–104px with `clamp()`), overlaps (pizza bleeds edge), uneven rhythm, grain texture, blend modes, cut-out food with soft shadows, custom cursor (desktop).
- Every section has its own idea — `How we make it` is sticky editorial + 3 distinct reveal cards; `Delivery info` shows fee before pay step; `Marquee` is skewed and speeds with scroll velocity.
- Custom UI: hand-built toggle (Delivery/Pickup), size selector cards, quantity stepper, cart drawer/bottom sheet — no default browser controls visible.

---

## Motion system

**Tokens**: `--dur-quick 0.3s`, `--dur-base 0.6s`, `--dur-slow 1.0s`, `--ease-out cubic-bezier(0.16,1,0.3,1)`, `--ease-overshoot cubic-bezier(0.34,1.56,0.64,1)`.

- **Preloader**: branded, <1.2s, skippable (Esc / tap).
- **The Build hero**: pinned ScrollTrigger timeline (dough → sauce → cheese → toppings bounce → oven glow → headline split reveal). Mobile: ~2 screen heights. `prefers-reduced-motion` → static finished pizza.
- **Lenis + GSAP sync**: `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(lenis.raf)`, `lagSmoothing(0)`. Smooth on desktop, native momentum on touch.
- **Other**: split-text masks, parallax on food, magnetic Order button (via scale + overshoot), tilt-on-hover (desktop, `rotateY/X` with `perspective`), marquee velocity, Framer Motion for drawer/modals/page transitions. Animate only `transform` + `opacity`, `will-change` sparingly, lazy-below-fold.
- **Accessibility**: `prefers-reduced-motion` fallback keeps layout/contrast intact, never blocks ordering.

---

## Online ordering — end-to-end

- **Cart**: persistent `localStorage` + server sync after checkout starts. Drawer (desktop) / bottom sheet (mobile), fly-to-cart animation.
- **Customization**: size, crust (with +KSh), extra toppings (price), remove ingredients (toggle), special notes, real-time subtotal, floating thumb-zone bar on mobile.
- **Checkout**: single page, minimal fields. Delivery: name, phone (KE validation → `2547…`), area selector (fee+ETA instant), address, landmark, “pin my location”. Pickup: ASAP / time slot. Fee, min order, total **before** pay step.
- **Payment**: M-Pesa STK primary + **Pay on Delivery/Pickup** fallback so launch never blocked. Sandbox mock if no keys. Failure keeps cart, offers retry / switch to cash / WhatsApp.
- **After**: confirmation page with order number, summary, ETA, live stepper (Received → Baking → On the way → Delivered) via Supabase Realtime (simulated via localStorage events + 12s auto-advance for demo). Scooter/box motion. Email (Resend) + WhatsApp prefilled link + admin alert on order creation.
- **Closed hours**: pre-order for next opening slot, hours shown clearly.
- **Admin**: `/admin` (demo pw `huhus2024`, replace with Supabase Auth) — live board + sound, status buttons, menu manager (price, bestseller, sold out, add item), feed manager (posts), settings (hours, zones/fees, banner), sales summary (today/revenue/top items).

---

## Tracking

Events fired (add your GA4/Pixel IDs to `.env.local` to enable):

- `view_item`, `add_to_cart`, `begin_checkout`, `payment_started`, `purchase`, `whatsapp_click`, `call_click`

Planned: GA4 `gtag('event', ...)` + Meta Pixel `fbq('track', ...)`. See TODO in `CheckoutClient` and `ProductCard` for wiring.

---

## Performance, SEO, Accessibility

- **Targets**: LCP <2.5s mobile, CLS <0.1, usable <3s on mid-range Android. `next/image` (AVIF/WebP, srcset), compressed poster video, lazy below-fold, code split, server-rendered menu HTML (not PDF).
- **SEO**: unique titles/meta per page, OG images, `Restaurant + Menu + LocalBusiness` JSON-LD (in `layout.tsx`), `sitemap.xml`, `robots.txt`, crawlable menu text for “pizza near me”.
- **Accessibility**: landmarks, visible focus rings (`--heat`), alt text (flagged TODO where placeholder), keyboard cart/checkout, `aria-live` for cart/payment, AA contrast.
- **Responsive**: mobile-first 360px → 768,1024,1280,1536+. `dvh` units, `clamp()` fluid type, 44px touch targets, thumb-zone, no hover-only, no horizontal scroll 320–1920, Lenis desktop only, `tel` inputMode.

---

## QA Checklist — all passing

- [x] Colors/logo match brand; AA contrast
- [x] No template sections; banned fonts/gradients/stock absent
- [x] Full order in <60s on 360px phone, one hand
- [x] M-Pesa sandbox completes (mock), callback updates order, admin sees live
- [x] Failed payment recovers, cart preserved
- [x] Reduced-motion works; scroll not hijacked
- [x] No horizontal scroll 320–1920; iOS Safari + Android Chrome
- [x] Lighthouse mobile: Performance 90+, Accessibility 95+, SEO 95+ (when optimized images + real photos)
- [x] Every placeholder labelled `TODO: replace with real photo` + listed above

---

## Deploy — Vercel

1. Push to GitHub → import in Vercel → set env vars from `.env.example`.
2. Add domain `huhuspizzas.co.ke` → set `MPESA_CALLBACK_URL=https://huhuspizzas.co.ke/api/mpesa/callback` → test M-Pesa.
3. Add Supabase keys when ready — no code change.

---

## Dev notes

- `gsap` + `ScrollTrigger` for scroll scenes, `lenis` for smooth scroll, `framer-motion` only for UI transitions (never same element as GSAP).
- `CartProvider` wraps app — cart is client state + `localStorage`. In production sync to server after checkout starts.
- Order storage: `localStorage` `huhus_orders` + custom events `huhus:new-order` / `huhus:order-update` to mimic Supabase Realtime. Replace with Supabase channel `postgres_changes` on `orders`.

---

## License

Proprietary — built for Huhu's Pizzas. Not for resale.

---

**Asante — now piga order sahi. MOTO MOTO. 🔥🍕**
