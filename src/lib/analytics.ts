// Analytics helper — GA4 + Meta Pixel
// Events: view_item, add_to_cart, begin_checkout, payment_started, purchase, whatsapp_click, call_click
// Usage: track('add_to_cart', { item_id: 'pepperoni-heat', value: 1350 })

type EventName = "view_item" | "add_to_cart" | "begin_checkout" | "payment_started" | "purchase" | "whatsapp_click" | "call_click";

declare global {
  interface Window {
    gtag?: (...args:any[])=>void;
    fbq?: (...args:any[])=>void;
    dataLayer?: any[];
  }
}

export function track(name: EventName, params: Record<string, any> = {}) {
  // GA4
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  }
  // Meta Pixel (maps to standard events)
  if (typeof window !== "undefined" && window.fbq) {
    const metaMap: Record<string,string> = {
      view_item: "ViewContent",
      add_to_cart: "AddToCart",
      begin_checkout: "InitiateCheckout",
      payment_started: "AddPaymentInfo",
      purchase: "Purchase",
      whatsapp_click: "Contact",
      call_click: "Contact",
    };
    const metaEvent = metaMap[name] || name;
    window.fbq("track", metaEvent, params);
  }
  // Console in dev for verification
  if (process.env.NODE_ENV !== "production") {
    console.log(`[analytics] ${name}`, params);
  }
}

// Helper to emit purchase with value
export const analytics = { track };
