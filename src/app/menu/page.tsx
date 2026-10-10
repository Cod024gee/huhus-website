import MenuClient from "@/components/MenuClient";
import menuData from "@/data/menu.json";

export const metadata = {
  title: "Menu — Huhu's Pizzas | Prices in KSh",
  description: "Full Huhu's menu — pizzas, combos, sides, drinks. Prices in KSh, sizes, crusts, extras. Order direct.",
};

export default function MenuPage() {
  return <MenuClient data={menuData as any} />;
}
