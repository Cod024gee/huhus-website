import { Order, OrderStatus } from "./types";

const KEY = "huhus_orders";

export function saveOrder(order: Order) {
  const raw = localStorage.getItem(KEY);
  const arr: Order[] = raw ? JSON.parse(raw) : [];
  arr.unshift(order);
  localStorage.setItem(KEY, JSON.stringify(arr));
  // also save current order id
  localStorage.setItem("huhus_last_order", order.id);
  window.dispatchEvent(new CustomEvent("huhus:new-order", { detail: order }));
}

export function getOrders(): Order[] {
  if (typeof window==="undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function getOrder(id: string): Order | null {
  return getOrders().find(o=>o.id===id || o.number===id) || null;
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  const orders = getOrders();
  const idx = orders.findIndex(o=>o.id===id);
  if (idx>=0) {
    orders[idx].status = status;
    localStorage.setItem(KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent("huhus:order-update", { detail: orders[idx] }));
  }
}

export function clearCart() {
  localStorage.removeItem("huhus_cart");
}
