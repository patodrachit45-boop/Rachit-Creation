import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Simple Env Loader ──────────────────────────────────────────────────
function loadEnv() {
  const root = path.resolve(__dirname, '..');
  const files = ['.env.local', '.env.production', '.env'];
  for (const file of files) {
    const envPath = path.join(root, file);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const idx = trimmed.indexOf('=');
          if (idx !== -1) {
            const key = trimmed.substring(0, idx).trim();
            let value = trimmed.substring(idx + 1).trim();
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
            process.env[key] = value;
          }
        }
      });
      console.log(`Loaded environment from ${file}`);
      break;
    }
  }
}

loadEnv();

const BASE_URL = 'https://raccreation.com';
const VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function fetchSupabaseData(table) {
  if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
    return [];
  }
  try {
    const cleanUrl = VITE_SUPABASE_URL.replace(/\/$/, '');
    if (table === 'blogs') {
      const res = await fetch(`${cleanUrl}/rest/v1/site_settings?id=eq.main&select=about_text`, {
        headers: {
          'apikey': VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${VITE_SUPABASE_ANON_KEY}`
        }
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (data && data.length > 0 && data[0].about_text) {
        const parts = data[0].about_text.split('|||JSON_DATA|||');
        if (parts.length > 1) {
          const extraData = JSON.parse(parts[1].trim());
          return extraData.blogs || [];
        }
      }
      return [];
    }

    const res = await fetch(`${cleanUrl}/rest/v1/${table}?select=id`, {
      headers: {
        'apikey': VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${VITE_SUPABASE_ANON_KEY}`
      }
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data || [];
  } catch (error) {
    console.warn(`Failed to fetch ${table} from Supabase:`, error.message);
    return [];
  }
}

async function generate() {
  console.log('Generating sitemap...');
  
  // 1. Static pages
  const pages = [
    '',
    '/about',
    '/contact',
    '/wishlist',
    '/blog',
    '/category/Bridal',
    '/category/Designer',
    '/category/Girlish',
    '/category/Heavy',
  ];

  // 2. Fetch Dynamic Products
  let products = [];
  try {
    products = await fetchSupabaseData('products');
    if (products.length === 0) {
      // Hardcoded fallback product IDs based on initialProducts.ts
      products = [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }, { id: 'p4' }, { id: 'p5' }, { id: 'p6' }, { id: 'p7' }, { id: 'p8' }];
    }
  } catch (e) {
    products = [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }, { id: 'p4' }, { id: 'p5' }, { id: 'p6' }, { id: 'p7' }, { id: 'p8' }];
  }

  // 3. Fetch Dynamic Blogs
  let blogs = [];
  try {
    blogs = await fetchSupabaseData('blogs');
    if (blogs.length === 0) {
      blogs = [{ id: 'blog1' }, { id: 'blog2' }];
    }
  } catch (e) {
    blogs = [{ id: 'blog1' }, { id: 'blog2' }];
  }

  // 4. Assemble XML URLs
  const urls = [];
  
  // Add static URLs
  pages.forEach((page) => {
    urls.push(`  <url>\n    <loc>${BASE_URL}${page}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n  </url>`);
  });

  // Add Product URLs
  products.forEach((prod) => {
    urls.push(`  <url>\n    <loc>${BASE_URL}/product/${prod.id}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`);
  });

  // Add Blog URLs
  blogs.forEach((post) => {
    urls.push(`  <url>\n    <loc>${BASE_URL}/blog/${post.id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`);
  });

  // 5. Build XML Structure
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  // 6. Write to public directory
  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, sitemapXml, 'utf-8');
  console.log(`Sitemap written successfully to ${outputPath} (${urls.length} URLs)`);
}

generate().catch(console.error);
