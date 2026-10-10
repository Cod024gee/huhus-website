-- HUHU'S PIZZAS — Supabase schema
-- Run in Supabase SQL editor. Enables Postgres + Realtime.

-- Enable UUID
create extension if not exists "uuid-ossp";

-- Menu categories
create table categories (
  id text primary key,
  name text not null,
  swahili text,
  sort int default 0
);

-- Menu items
create table menu_items (
  id text primary key,
  name text not null,
  swahili text,
  category text references categories(id),
  bestseller boolean default false,
  description text,
  ingredients text[],
  tags text[],
  image_url text,
 _sizes jsonb not null default '[]', -- [{name, inches, price}]
  crusts text[] default '{}',
  extras jsonb default '[]', -- [{name, price}]
  available boolean default true,
  created_at timestamptz default now()
);

-- Posts (Fresh feed)
create table posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  body text,
  image_url text,
  video_url text,
  type text check (type in ('image','video')),
  order_link text references menu_items(id),
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default uuid_generate_v4(),
  number text unique not null,
  created_at timestamptz default now(),
  status text check (status in ('Received','Baking','On the way','Delivered','Cancelled')) default 'Received',
  fulfilment text check (fulfilment in ('delivery','pickup','dine-in')),
  customer_name text,
  customer_phone text,
  zone_id text,
  address text,
  landmark text,
  items jsonb not null, -- CartItem[]
  subtotal int not null,
  delivery_fee int not null,
  total int not null,
  payment_method text check (payment_method in ('mpesa','cash')),
  mpesa_receipt text,
  checkout_request_id text,
  notes text
);

-- Settings (single row)
create table settings (
  id int primary key check (id=1),
  hours_open text default '10:00',
  hours_close text default '22:00',
  zones jsonb default '[]',
  min_order int default 800,
  banner text,
  updated_at timestamptz default now()
);
insert into settings (id) values (1) on conflict do nothing;

-- Enable Realtime for orders
alter publication supabase_realtime add table orders;

-- Storage bucket for menu/post images
-- Create via Dashboard: Storage -> new bucket "huhus-images" public

-- Seed example (from /data/menu.json)
-- See README for seed script: npm run seed

-- RLS (example — adjust for your auth)
alter table menu_items enable row level security;
create policy "public read menu" on menu_items for select using (true);
create policy "admin write menu" on menu_items for all using (auth.role()='authenticated');

alter table orders enable row level security;
create policy "public insert orders" on orders for insert with check (true);
create policy "admin read orders" on orders for select using (auth.role()='authenticated');
create policy "admin update orders" on orders for update using (auth.role()='authenticated');
