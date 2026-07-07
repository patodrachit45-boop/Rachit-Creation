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

export function parseProductDescription(dbDescription: string): { description: string; extraData: any } {
  if (!dbDescription) return { description: '', extraData: {} };
  const separator = '|||JSON_DATA|||';
  const parts = dbDescription.split(separator);
  const description = parts[0].trim();
  let extraData: any = {};
  if (parts.length > 1) {
    try {
      extraData = JSON.parse(parts[1].trim());
    } catch (e) {
      console.error('Failed to parse extra JSON data from product description:', e);
    }
  }
  return { description, extraData };
}

export function buildProductDescription(description: string, extraData: any): string {
  const separator = '|||JSON_DATA|||';
  const cleanDesc = (description || '').split(separator)[0].trim();
  if (Object.keys(extraData || {}).length === 0) return cleanDesc;
  return `${cleanDesc}\n\n${separator}\n${JSON.stringify(extraData)}`;
}

function dbToProduct(row: any): Product {
  const { description, extraData } = parseProductDescription(row.description || '');
  return {
    id: row.id,
    name: row.name,
    description: description,
    price: row.price,
    category: row.category,
    imageUrl: row.image_url,
    images: row.images || [],
    highlights: row.highlights || '',
    createdAt: row.created_at,
    isSoldOut: row.is_sold_out || false,
    craftingTime: extraData.craftingTime || '4 - 8 Weeks',
    origin: extraData.origin || 'Surat, Gujarat, India',
    customization: extraData.customization || 'Available on Request',
    embroidery: extraData.embroidery || 'Zari, Zardozi, Resham & Stones',
    shipping: extraData.shipping || 'Worldwide Express Delivery',
  };
}

function productToDb(p: Partial<Product> & { imageUrl?: string }) {
  const obj: any = {};
  if (p.name !== undefined) obj.name = p.name;
  
  if (p.description !== undefined) {
    const extraData: any = {};
    if (p.craftingTime !== undefined) extraData.craftingTime = p.craftingTime;
    if (p.origin !== undefined) extraData.origin = p.origin;
    if (p.customization !== undefined) extraData.customization = p.customization;
    if (p.embroidery !== undefined) extraData.embroidery = p.embroidery;
    if (p.shipping !== undefined) extraData.shipping = p.shipping;
    
    obj.description = buildProductDescription(p.description, extraData);
  }
  
  if (p.price !== undefined) obj.price = p.price;
  if (p.category !== undefined) obj.category = p.category;
  if (p.imageUrl !== undefined) obj.image_url = p.imageUrl;
  if (p.images !== undefined) obj.images = p.images;
  if (p.highlights !== undefined) obj.highlights = p.highlights;
  if (p.createdAt !== undefined) obj.created_at = p.createdAt;
  if (p.isSoldOut !== undefined) obj.is_sold_out = p.isSoldOut;
  return obj;
}

const JSON_SEPARATOR = '|||JSON_DATA|||';

export interface ExtraData {
  googleMapsUrl?: string;
  facebookPixelId?: string;
  pinterestUrl?: string;
  twitterUrl?: string;
  blogs?: BlogPost[];
  faqs?: FAQ[];
  teamMembers?: TeamMember[];
  defaultCraftingTime?: string;
  defaultOrigin?: string;
  defaultCustomization?: string;
  defaultEmbroidery?: string;
  defaultShipping?: string;
  quickFactsTitle?: string;
  labelCraftingTime?: string;
  labelOrigin?: string;
  labelCustomization?: string;
  labelEmbroidery?: string;
  labelShipping?: string;
  backlinksText?: string;
  facebookUrl?: string;
  trustBadge1Title?: string;
  trustBadge1Desc?: string;
  trustBadge2Title?: string;
  trustBadge2Desc?: string;
  trustBadge3Title?: string;
  trustBadge3Desc?: string;
}

export function parseAboutText(dbAboutText: string): { aboutText: string; extraData: ExtraData } {
  if (!dbAboutText) return { aboutText: '', extraData: {} };
  const parts = dbAboutText.split(JSON_SEPARATOR);
  const aboutText = parts[0].trim();
  let extraData: ExtraData = {};
  if (parts.length > 1) {
    try {
      extraData = JSON.parse(parts[1].trim());
    } catch (e) {
      console.error('Failed to parse extra JSON data from about_text:', e);
    }
  }
  return { aboutText, extraData };
}

export function buildAboutText(aboutText: string, extraData: ExtraData): string {
  const cleanAbout = (aboutText || '').split(JSON_SEPARATOR)[0].trim();
  return `${cleanAbout}\n\n${JSON_SEPARATOR}\n${JSON.stringify(extraData)}`;
}

function dbToSettings(row: any): SiteSettings {
  const { aboutText, extraData } = parseAboutText(row.about_text || '');

  const settings: SiteSettings = {
    heroImage: row.hero_image || '',
    logoImage: row.logo_image || '',
    whatsappNumber: row.whatsapp_number || '',
    instagramUrl: row.instagram_url || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    showroomHours: row.showroom_hours || '',
    aboutText: aboutText || '',
    aboutHeroImage: row.about_hero_image || '',
    googleMapsUrl: extraData.googleMapsUrl || row.google_maps_url || '',
    facebookPixelId: extraData.facebookPixelId || row.facebook_pixel_id || '',
    pinterestUrl: extraData.pinterestUrl || row.pinterest_url || '',
    twitterUrl: extraData.twitterUrl || row.twitter_url || '',
    defaultCraftingTime: extraData.defaultCraftingTime || '4 - 8 Weeks',
    defaultOrigin: extraData.defaultOrigin || 'Surat, Gujarat, India',
    defaultCustomization: extraData.defaultCustomization || 'Available on Request',
    defaultEmbroidery: extraData.defaultEmbroidery || 'Zari, Zardozi, Resham & Stones',
    defaultShipping: extraData.defaultShipping || 'Worldwide Express Delivery',
    quickFactsTitle: extraData.quickFactsTitle || 'Atelier Quick Facts',
    labelCraftingTime: extraData.labelCraftingTime || 'Crafting Time',
    labelOrigin: extraData.labelOrigin || 'Origin',
    labelCustomization: extraData.labelCustomization || 'Customization',
    labelEmbroidery: extraData.labelEmbroidery || 'Embroidery Handwork',
    labelShipping: extraData.labelShipping || 'Shipping',
    backlinksText: extraData.backlinksText || '',
    facebookUrl: extraData.facebookUrl || '',
    trustBadge1Title: extraData.trustBadge1Title || '100% Authentic Handloom',
    trustBadge1Desc: extraData.trustBadge1Desc || 'Certified traditional handwork and embroidery',
    trustBadge2Title: extraData.trustBadge2Title || 'Secure WhatsApp Checkout',
    trustBadge2Desc: extraData.trustBadge2Desc || 'Direct chat verification and order protection',
    trustBadge3Title: extraData.trustBadge3Title || 'Global Express Shipping',
    trustBadge3Desc: extraData.trustBadge3Desc || 'Safe delivery with international transit tracking',
  };

  // Fallback for logo if column doesn't exist or is empty
  if (!settings.logoImage) {
    const localFallback = localStorage.getItem('rachit_logo_fallback');
    if (localFallback) {
      settings.logoImage = localFallback;
    }
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

    // Since quick facts are serialized inside description, if we update any quick fact
    // OR if we update the description itself, we should make sure we merge it with the
    // existing description and extra facts in the database to prevent overwriting/losing facts.
    const hasQuickFacts = 
      fields.description !== undefined ||
      fields.craftingTime !== undefined ||
      fields.origin !== undefined ||
      fields.customization !== undefined ||
      fields.embroidery !== undefined ||
      fields.shipping !== undefined;

    if (hasQuickFacts) {
      // Fetch current product description from Supabase
      const { data: current, error: fetchErr } = await supabase
        .from('products')
        .select('description')
        .eq('id', id)
        .single();
      
      if (!fetchErr && current) {
        const { description: cleanDesc, extraData: currentExtra } = parseProductDescription(current.description || '');
        
        // Merge the updates
        const mergedDesc = fields.description !== undefined ? fields.description : cleanDesc;
        const mergedExtra = {
          craftingTime: fields.craftingTime !== undefined ? fields.craftingTime : (currentExtra.craftingTime || '4 - 8 Weeks'),
          origin: fields.origin !== undefined ? fields.origin : (currentExtra.origin || 'Surat, Gujarat, India'),
          customization: fields.customization !== undefined ? fields.customization : (currentExtra.customization || 'Available on Request'),
          embroidery: fields.embroidery !== undefined ? fields.embroidery : (currentExtra.embroidery || 'Zari, Zardozi, Resham & Stones'),
          shipping: fields.shipping !== undefined ? fields.shipping : (currentExtra.shipping || 'Worldwide Express Delivery'),
        };
        
        updateFields.description = mergedDesc;
        updateFields.craftingTime = mergedExtra.craftingTime;
        updateFields.origin = mergedExtra.origin;
        updateFields.customization = mergedExtra.customization;
        updateFields.embroidery = mergedExtra.embroidery;
        updateFields.shipping = mergedExtra.shipping;
      }
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
    return dbToSettings(data);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

export async function syncExtraDataToSupabase(data: {
  blogs?: BlogPost[];
  faqs?: FAQ[];
  teamMembers?: TeamMember[];
}): Promise<boolean> {
  if (!supabase) throw new Error('Supabase is not configured');
  
  const { data: currentData, error: selectError } = await supabase
    .from('site_settings')
    .select('about_text')
    .eq('id', 'main')
    .single();
  
  if (selectError && selectError.code !== 'PGRST116') {
    throw selectError;
  }
  
  let aboutTextVal = '';
  let existingExtra: ExtraData = {};
  if (currentData?.about_text) {
    const parsed = parseAboutText(currentData.about_text);
    aboutTextVal = parsed.aboutText;
    existingExtra = parsed.extraData;
  }

  if (data.blogs !== undefined) existingExtra.blogs = data.blogs;
  if (data.faqs !== undefined) existingExtra.faqs = data.faqs;
  if (data.teamMembers !== undefined) existingExtra.teamMembers = data.teamMembers;

  const updatedAboutText = buildAboutText(aboutTextVal, existingExtra);

  const { error: updateError } = await supabase
    .from('site_settings')
    .update({ about_text: updatedAboutText })
    .eq('id', 'main');

  if (updateError) throw updateError;
  return true;
}

export async function updateSiteSettingsInSupabase(
  settings: Partial<SiteSettings>
): Promise<boolean> {
  if (!supabase) throw new Error('Supabase is not configured');
  
  const { data: currentData, error: selectError } = await supabase
    .from('site_settings')
    .select('about_text')
    .eq('id', 'main')
    .single();
  
  if (selectError && selectError.code !== 'PGRST116') {
    throw selectError;
  }
  
  let aboutTextVal = '';
  let existingExtra: ExtraData = {};
  if (currentData?.about_text) {
    const parsed = parseAboutText(currentData.about_text);
    aboutTextVal = parsed.aboutText;
    existingExtra = parsed.extraData;
  }

  if (settings.googleMapsUrl !== undefined) existingExtra.googleMapsUrl = settings.googleMapsUrl;
  if (settings.facebookPixelId !== undefined) existingExtra.facebookPixelId = settings.facebookPixelId;
  if (settings.pinterestUrl !== undefined) existingExtra.pinterestUrl = settings.pinterestUrl;
  if (settings.twitterUrl !== undefined) existingExtra.twitterUrl = settings.twitterUrl;
  if (settings.defaultCraftingTime !== undefined) existingExtra.defaultCraftingTime = settings.defaultCraftingTime;
  if (settings.defaultOrigin !== undefined) existingExtra.defaultOrigin = settings.defaultOrigin;
  if (settings.defaultCustomization !== undefined) existingExtra.defaultCustomization = settings.defaultCustomization;
  if (settings.defaultEmbroidery !== undefined) existingExtra.defaultEmbroidery = settings.defaultEmbroidery;
  if (settings.defaultShipping !== undefined) existingExtra.defaultShipping = settings.defaultShipping;
  if (settings.quickFactsTitle !== undefined) existingExtra.quickFactsTitle = settings.quickFactsTitle;
  if (settings.labelCraftingTime !== undefined) existingExtra.labelCraftingTime = settings.labelCraftingTime;
  if (settings.labelOrigin !== undefined) existingExtra.labelOrigin = settings.labelOrigin;
  if (settings.labelCustomization !== undefined) existingExtra.labelCustomization = settings.labelCustomization;
  if (settings.labelEmbroidery !== undefined) existingExtra.labelEmbroidery = settings.labelEmbroidery;
  if (settings.labelShipping !== undefined) existingExtra.labelShipping = settings.labelShipping;
  if (settings.backlinksText !== undefined) existingExtra.backlinksText = settings.backlinksText;
  if (settings.facebookUrl !== undefined) existingExtra.facebookUrl = settings.facebookUrl;
  if (settings.trustBadge1Title !== undefined) existingExtra.trustBadge1Title = settings.trustBadge1Title;
  if (settings.trustBadge1Desc !== undefined) existingExtra.trustBadge1Desc = settings.trustBadge1Desc;
  if (settings.trustBadge2Title !== undefined) existingExtra.trustBadge2Title = settings.trustBadge2Title;
  if (settings.trustBadge2Desc !== undefined) existingExtra.trustBadge2Desc = settings.trustBadge2Desc;
  if (settings.trustBadge3Title !== undefined) existingExtra.trustBadge3Title = settings.trustBadge3Title;
  if (settings.trustBadge3Desc !== undefined) existingExtra.trustBadge3Desc = settings.trustBadge3Desc;

  if (settings.aboutText !== undefined) {
    aboutTextVal = settings.aboutText;
  }

  const payload = settingsToDb(settings);
  payload.about_text = buildAboutText(aboutTextVal, existingExtra);

  const { error: updateError } = await supabase
    .from('site_settings')
    .update(payload)
    .eq('id', 'main');
    
  if (updateError) throw updateError;
  return true;
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
  const { data, error } = await supabase
    .from('site_settings')
    .select('about_text')
    .eq('id', 'main')
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  if (data?.about_text) {
    const parsed = parseAboutText(data.about_text);
    return parsed.extraData.blogs || [];
  }
  return [];
}

export async function addBlogPostToSupabase(
  post: Omit<BlogPost, 'id' | 'createdAt'> & { createdAt?: number },
  imageFile?: File
): Promise<BlogPost | null> {
  if (!supabase) throw new Error('Supabase not configured');
  let imageUrl = post.imageUrl;
  if (imageFile) {
    imageUrl = await uploadImageToSupabase(imageFile);
  }
  const id = Math.random().toString(36).substring(2, 9);
  const createdAt = post.createdAt || Date.now();
  const newPost: BlogPost = {
    id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    imageUrl,
    createdAt,
  };

  const currentBlogs = await fetchBlogsFromSupabase();
  const updatedBlogs = [newPost, ...currentBlogs];
  await syncExtraDataToSupabase({ blogs: updatedBlogs });
  return newPost;
}

export async function updateBlogPostInSupabase(
  id: string,
  fields: Partial<BlogPost>
): Promise<boolean> {
  if (!supabase) throw new Error('Supabase not configured');
  const currentBlogs = await fetchBlogsFromSupabase();
  const updatedBlogs = currentBlogs.map((b) => b.id === id ? { ...b, ...fields } : b);
  return await syncExtraDataToSupabase({ blogs: updatedBlogs });
}

export async function deleteBlogPostFromSupabase(id: string): Promise<boolean> {
  if (!supabase) throw new Error('Supabase not configured');
  const currentBlogs = await fetchBlogsFromSupabase();
  const updatedBlogs = currentBlogs.filter((b) => b.id !== id);
  return await syncExtraDataToSupabase({ blogs: updatedBlogs });
}

// ── Team Members DB Operations ────────────────────────────────────────

export async function fetchTeamFromSupabase(): Promise<TeamMember[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('site_settings')
    .select('about_text')
    .eq('id', 'main')
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  if (data?.about_text) {
    const parsed = parseAboutText(data.about_text);
    return parsed.extraData.teamMembers || [];
  }
  return [];
}

export async function addTeamMemberToSupabase(
  member: Omit<TeamMember, 'id' | 'createdAt'>,
  imageFile?: File
): Promise<TeamMember | null> {
  if (!supabase) throw new Error('Supabase not configured');
  let imageUrl = member.imageUrl;
  if (imageFile) {
    imageUrl = await uploadImageToSupabase(imageFile);
  }
  const id = Math.random().toString(36).substring(2, 9);
  const createdAt = Date.now();
  const newMember: TeamMember = {
    id,
    name: member.name,
    role: member.role,
    imageUrl,
    displayOrder: member.displayOrder,
    createdAt,
  };

  const currentTeam = await fetchTeamFromSupabase();
  const updatedTeam = [...currentTeam, newMember];
  await syncExtraDataToSupabase({ teamMembers: updatedTeam });
  return newMember;
}

export async function updateTeamMemberInSupabase(
  id: string,
  fields: Partial<TeamMember>
): Promise<boolean> {
  if (!supabase) throw new Error('Supabase not configured');
  const currentTeam = await fetchTeamFromSupabase();
  const updatedTeam = currentTeam.map((m) => m.id === id ? { ...m, ...fields } : m);
  return await syncExtraDataToSupabase({ teamMembers: updatedTeam });
}

export async function deleteTeamMemberFromSupabase(id: string): Promise<boolean> {
  if (!supabase) throw new Error('Supabase not configured');
  const currentTeam = await fetchTeamFromSupabase();
  const updatedTeam = currentTeam.filter((m) => m.id !== id);
  return await syncExtraDataToSupabase({ teamMembers: updatedTeam });
}

// ── FAQ DB Operations ────────────────────────────────────────────────
export async function fetchFaqsFromSupabase(): Promise<FAQ[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('site_settings')
    .select('about_text')
    .eq('id', 'main')
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  if (data?.about_text) {
    const parsed = parseAboutText(data.about_text);
    return parsed.extraData.faqs || [];
  }
  return [];
}

export async function addFaqToSupabase(
  faq: Omit<FAQ, 'id' | 'createdAt'>
): Promise<FAQ | null> {
  if (!supabase) throw new Error('Supabase not configured');
  const id = Math.random().toString(36).substring(2, 9);
  const createdAt = Date.now();
  const newFaq: FAQ = {
    id,
    question: faq.question,
    answer: faq.answer,
    createdAt,
  };

  const currentFaqs = await fetchFaqsFromSupabase();
  const updatedFaqs = [...currentFaqs, newFaq];
  await syncExtraDataToSupabase({ faqs: updatedFaqs });
  return newFaq;
}

export async function updateFaqInSupabase(
  id: string,
  fields: Partial<FAQ>
): Promise<boolean> {
  if (!supabase) throw new Error('Supabase not configured');
  const currentFaqs = await fetchFaqsFromSupabase();
  const updatedFaqs = currentFaqs.map((f) => f.id === id ? { ...f, ...fields } : f);
  return await syncExtraDataToSupabase({ faqs: updatedFaqs });
}

export async function deleteFaqFromSupabase(id: string): Promise<boolean> {
  if (!supabase) throw new Error('Supabase not configured');
  const currentFaqs = await fetchFaqsFromSupabase();
  const updatedFaqs = currentFaqs.filter((f) => f.id !== id);
  return await syncExtraDataToSupabase({ faqs: updatedFaqs });
}

export { isSupabaseConfigured };
