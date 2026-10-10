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
