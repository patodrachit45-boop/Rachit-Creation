-- ══════════════════════════════════════════════════════════════════
-- Rachit Creation — Supabase Database Setup
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ══════════════════════════════════════════════════════════════════

-- 1. Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('Bridal', 'Designer', 'Girlish', 'Heavy')),
  image_url TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  highlights TEXT DEFAULT '',
  created_at BIGINT DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- 2. Site Settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  hero_image TEXT DEFAULT '',
  whatsapp_number TEXT DEFAULT '917359747911',
  instagram_url TEXT DEFAULT 'https://www.instagram.com/rachit__creation/',
  email TEXT DEFAULT 'rachitcreation@gmail.com',
  phone TEXT DEFAULT '+91 73597 47911',
  address TEXT DEFAULT 'Surat, Gujarat, India',
  showroom_hours TEXT DEFAULT 'Mon - Sat: 10:00 AM - 8:00 PM',
  about_text TEXT DEFAULT '',
  about_hero_image TEXT DEFAULT ''
);

-- 3. Insert default site settings row
INSERT INTO site_settings (id) VALUES ('main')
ON CONFLICT (id) DO NOTHING;

-- 4. Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for products
-- Everyone can read products
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
-- Only authenticated users can insert/update/delete
CREATE POLICY "Auth insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- 6. RLS Policies for site_settings
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Auth update settings" ON site_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth insert settings" ON site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ══════════════════════════════════════════════════════════════════
-- STORAGE SETUP (Run these separately or use Dashboard UI)
-- ══════════════════════════════════════════════════════════════════
-- Go to Supabase Dashboard → Storage → Create bucket:
--   Name: product-images
--   Public: YES (toggle on)
--
-- Then add this storage policy via SQL:
-- ══════════════════════════════════════════════════════════════════

-- Allow public read access to product-images bucket
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow authenticated users to upload/update/delete
CREATE POLICY "Auth upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
