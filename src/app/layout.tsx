import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";
import "@fontsource/fraunces/800.css";
import "@fontsource/fraunces/900.css";
import "@fontsource/instrument-sans/400.css";
import "@fontsource/instrument-sans/500.css";
import "@fontsource/instrument-sans/600.css";
import "@fontsource/instrument-sans/700.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "@/components/CartDrawer";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import MobileCartBar from "@/components/MobileCartBar";

export const metadata: Metadata = {
  title: "Huhu's Pizzas — Wood-fired, Nairobi-made. Piga Order Sahi.",
  description: "Wood-fired pizzas, peri-peri wings, combos ya squad. Delivery & pickup across Nairobi. Open 10am–10pm. Order direct — moto moto.",
  metadataBase: new URL("https://huhuspizzas.co.ke"),
  openGraph: {
    title: "Huhu's Pizzas — Wood-fired, Nairobi-made",
    description: "MOTO MOTO. Order direct for the fastest fire.",
    images: ["/og-image.jpg"],
    type: "website",
  },
  icons: { icon: "/favicon.ico" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{"--font-display":"Fraunces, Georgia, serif", "--font-text":"Instrument Sans, system-ui, -apple-system, sans-serif"} as React.CSSProperties}>
      <head>
        {/* GA4 — set NEXT_PUBLIC_GA4_ID in .env.local */}
        <script dangerouslySetInnerHTML={{__html: `
          if ('${process.env.NEXT_PUBLIC_GA4_ID || ""}') {
            var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID || "G-XXXX"}';document.head.appendChild(s);
            window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA4_ID || "G-XXXX"}');
          }
        `}} />
        {/* Meta Pixel — set NEXT_PUBLIC_META_PIXEL_ID */}
        <script dangerouslySetInnerHTML={{__html: `
          if ('${process.env.NEXT_PUBLIC_META_PIXEL_ID || ""}') {
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${process.env.NEXT_PUBLIC_META_PIXEL_ID || "000"}');fbq('track','PageView');
          }
        `}} />
      </head>
      <body className="font-text">
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context":"https://schema.org",
          "@type":"Restaurant",
          "name":"Huhu's Pizzas",
          "address":{"@type":"PostalAddress","addressLocality":"Nairobi","addressCountry":"KE","streetAddress":"Ngong Road"},
          "servesCuisine":"Pizza",
          "priceRange":"KSh 850 - 3200",
          "openingHours":"Mo-Su 10:00-22:00",
          "telephone":"+254700000000",
          "url":"https://huhuspizzas.co.ke"
        })}} />
        <CartProvider>
          <SmoothScroll />
          <CustomCursor />
          <Preloader />
          <Header />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
          <MobileCartBar />
        </CartProvider>
      </body>
    </html>
  );
}
