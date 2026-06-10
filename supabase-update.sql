-- ══════════════════════════════════════════════════════════════════
-- Rachit Creation — Supabase Database Updates
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ══════════════════════════════════════════════════════════════════

-- 1. Extend site settings table with Google Maps, Facebook Pixel, Pinterest and Twitter URLs
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS google_maps_url TEXT DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS facebook_pixel_id TEXT DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS pinterest_url TEXT DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS twitter_url TEXT DEFAULT '';

-- 2. Create Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  created_at BIGINT DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- 3. Create Team Members table
CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at BIGINT DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- 5. Public and Auth Policies for Blogs
DROP POLICY IF EXISTS "Public read blogs" ON blogs;
DROP POLICY IF EXISTS "Auth insert blogs" ON blogs;
DROP POLICY IF EXISTS "Auth update blogs" ON blogs;
DROP POLICY IF EXISTS "Auth delete blogs" ON blogs;

CREATE POLICY "Public read blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Auth insert blogs" ON blogs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update blogs" ON blogs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete blogs" ON blogs FOR DELETE USING (auth.role() = 'authenticated');

-- 6. Public and Auth Policies for Team Members
DROP POLICY IF EXISTS "Public read team_members" ON team_members;
DROP POLICY IF EXISTS "Auth insert team_members" ON team_members;
DROP POLICY IF EXISTS "Auth update team_members" ON team_members;
DROP POLICY IF EXISTS "Auth delete team_members" ON team_members;

CREATE POLICY "Public read team_members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Auth insert team_members" ON team_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update team_members" ON team_members FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete team_members" ON team_members FOR DELETE USING (auth.role() = 'authenticated');

-- 7. Create FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at BIGINT DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- RLS for FAQs
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read faqs" ON faqs;
DROP POLICY IF EXISTS "Auth insert faqs" ON faqs;
DROP POLICY IF EXISTS "Auth update faqs" ON faqs;
DROP POLICY IF EXISTS "Auth delete faqs" ON faqs;

CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Auth insert faqs" ON faqs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update faqs" ON faqs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete faqs" ON faqs FOR DELETE USING (auth.role() = 'authenticated');

