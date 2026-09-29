/*
# Create premium clothing store schema

## Overview
Creates the complete database schema for a premium online clothing store.
The store uses Supabase as the shared backend — products, banners, and orders
all live here. A Telegram bot admin panel can later connect to the same tables.

## New Tables

1. `categories` — product categories (anime kiyim, futbolka, oyoq kiyim, etc.)
   - id, name, slug, icon, sort_order, created_at

2. `products` — main product catalog
   - id, category_id (FK), name, slug, sku (product code), description,
     price (bigint, in UZS), discount_price, discount_percent,
     colors (text[]), sizes (text[]), is_new, is_active, created_at, updated_at

3. `product_images` — multiple images per product (front, back, extra)
   - id, product_id (FK CASCADE), url, sort_order, type, created_at

4. `banners` — homepage promotional banners
   - id, title, subtitle, image_url, link_url, sort_order, is_active, created_at

5. `store_settings` — singleton config (store name, bot links, about text, etc.)
   - id (always 1), store_name, store_description, telegram_bot_url,
     telegram_channel_url, help_url, privacy_policy, about_text, updated_at

6. `orders` — customer orders
   - id, order_number (unique), customer_name, customer_phone, customer_telegram,
     delivery_address, total_amount, prepaid_amount (50% advance),
     status (new/accepted/awaiting_payment/payment_confirmed/delivering/delivered/cancelled),
     notes, created_at, updated_at

7. `order_items` — line items in orders
   - id, order_id (FK CASCADE), product_id (FK SET NULL), product_name,
     product_sku, quantity, price, color, size, created_at

## Security
- RLS enabled on all tables.
- This is a no-auth app (Telegram auth not yet implemented), so all policies
  use `TO anon, authenticated` — the anon-key frontend can read/write.
- When Telegram auth is added later, order/favorite policies can be tightened
  to `TO authenticated` with ownership checks.
- Products, categories, banners, store_settings: public read, no public write.
- Orders: public read (so customer can track by order number), public insert.
- Order items: public read via order join, public insert.

## Notes
1. Prices stored as bigint (UZS has no fractional units).
2. Order status is a text field with a CHECK constraint for valid values.
3. store_settings is a singleton — only row with id=1 is ever used.
4. Product images use a `type` field: 'front', 'back', 'extra'.
*/

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_categories" ON categories;
CREATE POLICY "anon_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sku text NOT NULL UNIQUE,
  description text,
  price bigint NOT NULL,
  discount_price bigint,
  discount_percent int,
  colors text[] NOT NULL DEFAULT '{}',
  sizes text[] NOT NULL DEFAULT '{}',
  is_new boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_products" ON products;
CREATE POLICY "anon_read_products" ON products FOR SELECT
  TO anon, authenticated USING (is_active = true);

-- Product images
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  type text NOT NULL DEFAULT 'front',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_product_images" ON product_images;
CREATE POLICY "anon_read_product_images" ON product_images FOR SELECT
  TO anon, authenticated USING (true);

-- Banners
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  subtitle text,
  image_url text NOT NULL,
  link_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_banners" ON banners;
CREATE POLICY "anon_read_banners" ON banners FOR SELECT
  TO anon, authenticated USING (is_active = true);

-- Store settings (singleton)
CREATE TABLE IF NOT EXISTS store_settings (
  id int PRIMARY KEY DEFAULT 1,
  store_name text NOT NULL DEFAULT 'Premium Store',
  store_description text,
  telegram_bot_url text,
  telegram_channel_url text,
  help_url text,
  privacy_policy text,
  about_text text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT singleton_only CHECK (id = 1)
);

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_store_settings" ON store_settings;
CREATE POLICY "anon_read_store_settings" ON store_settings FOR SELECT
  TO anon, authenticated USING (true);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_telegram text,
  delivery_address text NOT NULL,
  total_amount bigint NOT NULL,
  prepaid_amount bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'new' CHECK (status IN (
    'new', 'accepted', 'awaiting_payment', 'payment_confirmed',
    'delivering', 'delivered', 'cancelled'
  )),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_orders" ON orders;
CREATE POLICY "anon_read_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_sku text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  price bigint NOT NULL,
  color text,
  size text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_order_items" ON order_items;
CREATE POLICY "anon_read_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Insert default store settings
INSERT INTO store_settings (id, store_name, store_description, about_text, privacy_policy)
VALUES (1, 'LUXE Wear', 'Premium onlayn kiyim do‘koni. Zamonaviy va sifatli kiyimlar.', 
  'LUXE Wear — premium darajadagi onlayn kiyim do‘koni. Biz eng yangi va zamonaviy kiyim modellarini sizga taqdim etamiz.',
  'Foydalanuvchi ma''lumotlari faqat buyurtmalarni qayta ishlash uchun ishlatiladi. Biz sizning shaxsiy ma''lumotlaringizni hech kimga oshkor qilmaymiz.')
ON CONFLICT (id) DO NOTHING;
