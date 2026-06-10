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
import type { SiteSettings, BlogPost, TeamMember, FAQ } from './siteConfig';

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
    isSoldOut: row.is_sold_out || false,
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
  if (p.isSoldOut !== undefined) obj.is_sold_out = p.isSoldOut;
  return obj;
}

function dbToSettings(row: any): SiteSettings {
  const settings: SiteSettings = {
    heroImage: row.hero_image || '',
    logoImage: row.logo_image || '',
    whatsappNumber: row.whatsapp_number || '',
    instagramUrl: row.instagram_url || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    showroomHours: row.showroom_hours || '',
    aboutText: row.about_text || '',
    aboutHeroImage: row.about_hero_image || '',
    googleMapsUrl: row.google_maps_url || '',
    facebookPixelId: row.facebook_pixel_id || '',
    pinterestUrl: row.pinterest_url || '',
    twitterUrl: row.twitter_url || '',
  };

  // Fallback for logo if column doesn't exist or is empty
  if (!settings.logoImage) {
    const localFallback = localStorage.getItem('rachit_logo_fallback');
    if (localFallback) {
      settings.logoImage = localFallback;
    }
  }

  // Fallback for Google Maps link if column doesn't exist or is empty
  if (!settings.googleMapsUrl) {
    const localMapsFallback = localStorage.getItem('rachit_google_maps_url_fallback');
    if (localMapsFallback) {
      settings.googleMapsUrl = localMapsFallback;
    }
  }

  // Fallbacks for Pixel and Social URLs
  if (!settings.facebookPixelId) {
    settings.facebookPixelId = localStorage.getItem('rachit_facebook_pixel_id_fallback') || '';
  }
  if (!settings.pinterestUrl) {
    settings.pinterestUrl = localStorage.getItem('rachit_pinterest_url_fallback') || '';
  }
  if (!settings.twitterUrl) {
    settings.twitterUrl = localStorage.getItem('rachit_twitter_url_fallback') || '';
  }

  return settings;
}

function settingsToDb(s: Partial<SiteSettings>) {
  const obj: any = {};
  if (s.heroImage !== undefined) obj.hero_image = s.heroImage;
  if (s.logoImage !== undefined) obj.logo_image = s.logoImage;
  if (s.whatsappNumber !== undefined) obj.whatsapp_number = s.whatsappNumber;
  if (s.instagramUrl !== undefined) obj.instagram_url = s.instagramUrl;
  if (s.email !== undefined) obj.email = s.email;
  if (s.phone !== undefined) obj.phone = s.phone;
  if (s.address !== undefined) obj.address = s.address;
  if (s.showroomHours !== undefined) obj.showroom_hours = s.showroomHours;
  if (s.aboutText !== undefined) obj.about_text = s.aboutText;
  if (s.aboutHeroImage !== undefined) obj.about_hero_image = s.aboutHeroImage;
  if (s.googleMapsUrl !== undefined) obj.google_maps_url = s.googleMapsUrl;
  if (s.facebookPixelId !== undefined) obj.facebook_pixel_id = s.facebookPixelId;
  if (s.pinterestUrl !== undefined) obj.pinterest_url = s.pinterestUrl;
  if (s.twitterUrl !== undefined) obj.twitter_url = s.twitterUrl;
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
    if (error) {
      if (error.code === '42703' || error.message.includes('is_sold_out')) {
        console.warn('Database is missing is_sold_out column. Retrying insert without it...');
        const healedRow = { ...row };
        delete healedRow.is_sold_out;
        const { data: retryData, error: retryError } = await supabase.from('products').insert(healedRow).select().single();
        if (retryError) throw retryError;
        return dbToProduct(retryData);
      }
      throw error;
    }
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

    const payload = productToDb(updateFields);
    const { error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id);
      
    if (error) {
      if (error.code === '42703' || error.message.includes('is_sold_out')) {
        console.warn('Database is missing is_sold_out column. Retrying update without it...');
        const healedPayload = { ...payload };
        delete healedPayload.is_sold_out;
        const { error: retryError } = await supabase
          .from('products')
          .update(healedPayload)
          .eq('id', id);
        if (retryError) throw retryError;
        return true;
      }
      throw error;
    }
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

export async function seedProductsInSupabase(products: any[]): Promise<boolean> {
  if (!supabase) return false;
  try {
    const rows = products.map((p) => ({
      id: p.id,
      ...productToDb(p),
      created_at: p.createdAt || Date.now(),
    }));
    const { error } = await supabase.from('products').insert(rows);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error seeding products:', error);
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
    
    const settings = dbToSettings(data);
    
    // Fallback for logo if column doesn't exist or is empty
    if (!settings.logoImage) {
      const localFallback = localStorage.getItem('rachit_logo_fallback');
      if (localFallback) {
        settings.logoImage = localFallback;
      }
    }
    return settings;
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
    const payload = settingsToDb(settings);
    const { error } = await supabase
      .from('site_settings')
      .update(payload)
      .eq('id', 'main');
      
    if (error) {
      // Auto-healing: If logo_image, google_maps_url, or other new columns do not exist, remove them and retry
      if (error.message.includes('logo_image') || 
          error.message.includes('google_maps_url') || 
          error.message.includes('facebook_pixel_id') || 
          error.message.includes('pinterest_url') || 
          error.message.includes('twitter_url') || 
          error.code === '42703') {
        console.warn('Database is missing new site settings columns. Retrying update with fallback...');
        const healedPayload = { ...payload };
        delete healedPayload.logo_image;
        delete healedPayload.google_maps_url;
        delete healedPayload.facebook_pixel_id;
        delete healedPayload.pinterest_url;
        delete healedPayload.twitter_url;
        
        const { error: retryError } = await supabase
          .from('site_settings')
          .update(healedPayload)
          .eq('id', 'main');
          
        if (retryError) throw retryError;
        
        // Save fallbacks to localStorage
        if (settings.logoImage !== undefined) {
          if (settings.logoImage === '') {
            localStorage.removeItem('rachit_logo_fallback');
          } else {
            localStorage.setItem('rachit_logo_fallback', settings.logoImage);
          }
        }
        if (settings.googleMapsUrl !== undefined) {
          if (settings.googleMapsUrl === '') {
            localStorage.removeItem('rachit_google_maps_url_fallback');
          } else {
            localStorage.setItem('rachit_google_maps_url_fallback', settings.googleMapsUrl);
          }
        }
        if (settings.facebookPixelId !== undefined) {
          if (settings.facebookPixelId === '') {
            localStorage.removeItem('rachit_facebook_pixel_id_fallback');
          } else {
            localStorage.setItem('rachit_facebook_pixel_id_fallback', settings.facebookPixelId);
          }
        }
        if (settings.pinterestUrl !== undefined) {
          if (settings.pinterestUrl === '') {
            localStorage.removeItem('rachit_pinterest_url_fallback');
          } else {
            localStorage.setItem('rachit_pinterest_url_fallback', settings.pinterestUrl);
          }
        }
        if (settings.twitterUrl !== undefined) {
          if (settings.twitterUrl === '') {
            localStorage.removeItem('rachit_twitter_url_fallback');
          } else {
            localStorage.setItem('rachit_twitter_url_fallback', settings.twitterUrl);
          }
        }
        return true;
      }
      throw error;
    }
    
    // If successfully updated main table, also sync to local storage fallbacks
    if (settings.logoImage !== undefined) {
      if (settings.logoImage === '') {
        localStorage.removeItem('rachit_logo_fallback');
      } else {
        localStorage.setItem('rachit_logo_fallback', settings.logoImage);
      }
    }
    if (settings.googleMapsUrl !== undefined) {
      if (settings.googleMapsUrl === '') {
        localStorage.removeItem('rachit_google_maps_url_fallback');
      } else {
        localStorage.setItem('rachit_google_maps_url_fallback', settings.googleMapsUrl);
      }
    }
    if (settings.facebookPixelId !== undefined) {
      if (settings.facebookPixelId === '') {
        localStorage.removeItem('rachit_facebook_pixel_id_fallback');
      } else {
        localStorage.setItem('rachit_facebook_pixel_id_fallback', settings.facebookPixelId);
      }
    }
    if (settings.pinterestUrl !== undefined) {
      if (settings.pinterestUrl === '') {
        localStorage.removeItem('rachit_pinterest_url_fallback');
      } else {
        localStorage.setItem('rachit_pinterest_url_fallback', settings.pinterestUrl);
      }
    }
    if (settings.twitterUrl !== undefined) {
      if (settings.twitterUrl === '') {
        localStorage.removeItem('rachit_twitter_url_fallback');
      } else {
        localStorage.setItem('rachit_twitter_url_fallback', settings.twitterUrl);
      }
    }
    return true;
  } catch (error) {
    console.error('Error updating site settings:', error);
    return false;
  }
}

export async function ensureSiteSettingsRowExists(): Promise<void> {
  if (!supabase) return;
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('id')
      .eq('id', 'main')
      .single();
    if (error && error.code === 'PGRST116') {
      await supabase.from('site_settings').insert({ id: 'main' });
    }
  } catch (error) {
    console.error('Error ensuring site settings row exists:', error);
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

// ── Blogs DB Operations ───────────────────────────────────────────────

export async function fetchBlogsFromSupabase(): Promise<BlogPost[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      if (error.code === '42P01') { // table does not exist
        console.warn('Supabase blogs table not found. Using local fallback.');
        return [];
      }
      throw error;
    }
    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      excerpt: row.excerpt,
      imageUrl: row.image_url,
      createdAt: Number(row.created_at),
    }));
  } catch (error) {
    console.error('Error fetching blogs from Supabase:', error);
    return [];
  }
}

export async function addBlogPostToSupabase(
  post: Omit<BlogPost, 'id' | 'createdAt'>,
  imageFile?: File
): Promise<BlogPost | null> {
  if (!supabase) return null;
  try {
    let imageUrl = post.imageUrl;
    if (imageFile) {
      imageUrl = await uploadImageToSupabase(imageFile);
    }
    const id = Math.random().toString(36).substring(2, 9);
    const createdAt = Date.now();
    const row = {
      id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      image_url: imageUrl,
      created_at: createdAt,
    };
    const { data, error } = await supabase.from('blogs').insert(row).select().single();
    if (error) throw error;
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      imageUrl: data.image_url,
      createdAt: Number(data.created_at),
    };
  } catch (error) {
    console.error('Error adding blog post in Supabase:', error);
    return null;
  }
}

export async function updateBlogPostInSupabase(
  id: string,
  fields: Partial<BlogPost>
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const payload: any = {};
    if (fields.title !== undefined) payload.title = fields.title;
    if (fields.content !== undefined) payload.content = fields.content;
    if (fields.excerpt !== undefined) payload.excerpt = fields.excerpt;
    if (fields.imageUrl !== undefined) payload.image_url = fields.imageUrl;

    const { error } = await supabase.from('blogs').update(payload).eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating blog post in Supabase:', error);
    return false;
  }
}

export async function deleteBlogPostFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting blog post from Supabase:', error);
    return false;
  }
}

// ── Team Members DB Operations ────────────────────────────────────────

export async function fetchTeamFromSupabase(): Promise<TeamMember[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) {
      if (error.code === '42P01') { // table does not exist
        console.warn('Supabase team_members table not found. Using local fallback.');
        return [];
      }
      throw error;
    }
    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      imageUrl: row.image_url,
      displayOrder: Number(row.display_order || 0),
      createdAt: Number(row.created_at),
    }));
  } catch (error) {
    console.error('Error fetching team from Supabase:', error);
    return [];
  }
}

export async function addTeamMemberToSupabase(
  member: Omit<TeamMember, 'id' | 'createdAt'>,
  imageFile?: File
): Promise<TeamMember | null> {
  if (!supabase) return null;
  try {
    let imageUrl = member.imageUrl;
    if (imageFile) {
      imageUrl = await uploadImageToSupabase(imageFile);
    }
    const id = Math.random().toString(36).substring(2, 9);
    const createdAt = Date.now();
    const row = {
      id,
      name: member.name,
      role: member.role,
      image_url: imageUrl,
      display_order: member.displayOrder,
      created_at: createdAt,
    };
    const { data, error } = await supabase.from('team_members').insert(row).select().single();
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      imageUrl: data.image_url,
      displayOrder: Number(data.display_order || 0),
      createdAt: Number(data.created_at),
    };
  } catch (error) {
    console.error('Error adding team member in Supabase:', error);
    return null;
  }
}

export async function updateTeamMemberInSupabase(
  id: string,
  fields: Partial<TeamMember>
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const payload: any = {};
    if (fields.name !== undefined) payload.name = fields.name;
    if (fields.role !== undefined) payload.role = fields.role;
    if (fields.imageUrl !== undefined) payload.image_url = fields.imageUrl;
    if (fields.displayOrder !== undefined) payload.display_order = fields.displayOrder;

    const { error } = await supabase.from('team_members').update(payload).eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating team member in Supabase:', error);
    return false;
  }
}

export async function deleteTeamMemberFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting team member from Supabase:', error);
    return false;
  }
}

// ── FAQ DB Operations ────────────────────────────────────────────────
export async function fetchFaqsFromSupabase(): Promise<FAQ[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) {
      if (error.code === '42P01') { // table does not exist
        console.warn('Supabase faqs table not found. Using local fallback.');
        return [];
      }
      throw error;
    }
    return (data || []).map((row: any) => ({
      id: row.id,
      question: row.question,
      answer: row.answer,
      createdAt: Number(row.created_at)
    }));
  } catch (error) {
    console.error('Error fetching FAQs from Supabase:', error);
    return [];
  }
}

export async function addFaqToSupabase(
  faq: Omit<FAQ, 'id' | 'createdAt'>
): Promise<FAQ | null> {
  if (!supabase) return null;
  try {
    const id = Math.random().toString(36).substring(2, 9);
    const createdAt = Date.now();
    const row = {
      id,
      question: faq.question,
      answer: faq.answer,
      created_at: createdAt
    };
    const { data, error } = await supabase.from('faqs').insert(row).select().single();
    if (error) throw error;
    return {
      id: data.id,
      question: data.question,
      answer: data.answer,
      createdAt: Number(data.created_at)
    };
  } catch (error) {
    console.error('Error adding FAQ in Supabase:', error);
    return null;
  }
}

export async function updateFaqInSupabase(
  id: string,
  fields: Partial<FAQ>
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const payload: any = {};
    if (fields.question !== undefined) payload.question = fields.question;
    if (fields.answer !== undefined) payload.answer = fields.answer;

    const { error } = await supabase.from('faqs').update(payload).eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating FAQ in Supabase:', error);
    return false;
  }
}

export async function deleteFaqFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting FAQ from Supabase:', error);
    return false;
  }
}

export { isSupabaseConfigured };
