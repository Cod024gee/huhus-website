import CheckoutClient from "@/components/CheckoutClient";
import menuData from "@/data/menu.json";

export const metadata = { title: "Checkout — Huhu's Pizzas", description: "Checkout — delivery or pickup, M-Pesa or cash." };

export default function CheckoutPage() {
  return <CheckoutClient zones={(menuData as any).zones} hours={(menuData as any).hours} />;
}
