/**
 * Supabase service layer.
 * All database & storage CRUD operations for products and site settings.
 *
 * Database tables:
 *   products (id TEXT PK, name, description, price, category, image_url, images, highlights, created_at)
 *   site_settings (id TEXT PK DEFAULT 'main', hero_image, whatsapp_number, instagram_url, email, phone, address, showroom_hours, about_text, about_hero_image)
 *
 * Storage bucket:
 *   product-images (public)
 */

import { supabase, isSupabaseConfigured } from './supabase';
import type { Product } from '../store';
import type { SiteSettings } from './siteConfig';

// ── Helpers: DB ↔ TypeScript mapping ──────────────────────────────────

function dbToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    imageUrl: row.image_url,
    images: row.images || [],
    highlights: row.highlights || '',
    createdAt: row.created_at,
  };
}

function productToDb(p: Partial<Product> & { imageUrl?: string }) {
  const obj: any = {};
  if (p.name !== undefined) obj.name = p.name;
  if (p.description !== undefined) obj.description = p.description;
  if (p.price !== undefined) obj.price = p.price;
  if (p.category !== undefined) obj.category = p.category;
  if (p.imageUrl !== undefined) obj.image_url = p.imageUrl;
  if (p.images !== undefined) obj.images = p.images;
  if (p.highlights !== undefined) obj.highlights = p.highlights;
  if (p.createdAt !== undefined) obj.created_at = p.createdAt;
  return obj;
}

function dbToSettings(row: any): SiteSettings {
  return {
    heroImage: row.hero_image || '',
    whatsappNumber: row.whatsapp_number || '',
    instagramUrl: row.instagram_url || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    showroomHours: row.showroom_hours || '',
    aboutText: row.about_text || '',
    aboutHeroImage: row.about_hero_image || '',
  };
}

function settingsToDb(s: Partial<SiteSettings>) {
  const obj: any = {};
  if (s.heroImage !== undefined) obj.hero_image = s.heroImage;
  if (s.whatsappNumber !== undefined) obj.whatsapp_number = s.whatsappNumber;
  if (s.instagramUrl !== undefined) obj.instagram_url = s.instagramUrl;
  if (s.email !== undefined) obj.email = s.email;
  if (s.phone !== undefined) obj.phone = s.phone;
  if (s.address !== undefined) obj.address = s.address;
  if (s.showroomHours !== undefined) obj.showroom_hours = s.showroomHours;
  if (s.aboutText !== undefined) obj.about_text = s.aboutText;
  if (s.aboutHeroImage !== undefined) obj.about_hero_image = s.aboutHeroImage;
  return obj;
}

// ── Products ──────────────────────────────────────────────────────────

export async function fetchProductsFromSupabase(): Promise<Product[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(dbToProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function addProductToSupabase(
  product: Omit<Product, 'id'>,
  imageFile?: File
): Promise<Product | null> {
  if (!supabase) return null;
  try {
    let imageUrl = product.imageUrl;
    if (imageFile) {
      imageUrl = await uploadImageToSupabase(imageFile);
    }

    const id = Math.random().toString(36).substring(2, 9);
    const row = {
      id,
      ...productToDb({ ...product, imageUrl }),
      created_at: Date.now(),
    };

    const { data, error } = await supabase.from('products').insert(row).select().single();
    if (error) throw error;
    return dbToProduct(data);
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
}

export async function updateProductInSupabase(
  id: string,
  fields: Partial<Product>,
  imageFile?: File
): Promise<boolean> {
  if (!supabase) return false;
  try {
    let updateFields = { ...fields };
    if (imageFile) {
      updateFields.imageUrl = await uploadImageToSupabase(imageFile);
    }

    const { error } = await supabase
      .from('products')
      .update(productToDb(updateFields))
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
}

export async function deleteProductFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

// ── Images ────────────────────────────────────────────────────────────

export async function uploadImageToSupabase(file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured');

  const ext = file.name.split('.').pop() || 'png';
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, { cacheControl: '31536000', upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
  return data.publicUrl;
}

// ── Site Settings ─────────────────────────────────────────────────────

export async function fetchSiteSettingsFromSupabase(): Promise<SiteSettings | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'main')
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = row not found
    if (!data) return null;
    return dbToSettings(data);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

export async function updateSiteSettingsInSupabase(
  settings: Partial<SiteSettings>
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 'main', ...settingsToDb(settings) }, { onConflict: 'id' });
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating site settings:', error);
    return false;
  }
}

// ── Auth ──────────────────────────────────────────────────────────────

export async function signInAdmin(email: string, password: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOutAdmin() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export function onAuthChanged(callback: (user: any) => void): () => void {
  if (!supabase) {
    callback(null);
    return () => {};
  }
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
  return () => subscription.unsubscribe();
}

export { isSupabaseConfigured };
