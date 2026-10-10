export type MenuSize = { name: string; inches?: number; price: number };
export type Extra = { name: string; price: number };

export type MenuItem = {
  id: string;
  name: string;
  swahili?: string;
  category: string;
  bestseller: boolean;
  description: string;
  ingredients: string[];
  tags: string[];
  image: string;
  sizes: MenuSize[];
  crusts: string[];
  extras: Extra[];
};

export type Category = { id: string; name: string; swahili?: string };

export type Zone = { id: string; name: string; fee: number; eta: string };

export type CartItem = {
  uid: string;
  itemId: string;
  name: string;
  image: string;
  size: MenuSize;
  crust?: string;
  extras: Extra[];
  removedIngredients: string[];
  notes: string;
  qty: number;
  lineTotal: number;
};

export type OrderStatus = "Received" | "Baking" | "On the way" | "Delivered" | "Cancelled";

export type Order = {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  fulfilment: "delivery" | "pickup";
  customer: {
    name: string;
    phone: string; // normalized 254...
    zoneId?: string;
    address?: string;
    landmark?: string;
  };
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "mpesa" | "cash";
  mpesaReceipt?: string;
  notes?: string;
};

export type FeedPost = {
  id: string;
  title: string;
  body: string;
  image: string;
  type: "image" | "video";
  date: string;
  orderLink?: string | null;
};
