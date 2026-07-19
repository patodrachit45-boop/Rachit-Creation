/**
 * Global state management with Zustand.
 * Products: Supabase-backed (with fallback to static data)
 * Wishlist: localStorage (user-specific, stores only IDs)
 * Site Settings: Supabase-backed (with defaults)
 * Auth: Supabase Auth
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialProducts } from './initialProducts';
import {
  fetchProductsFromSupabase,
  addProductToSupabase,
  updateProductInSupabase,
  deleteProductFromSupabase,
  fetchSiteSettingsFromSupabase,
  updateSiteSettingsInSupabase,
  uploadImageToSupabase,
  signInAdmin,
  signOutAdmin,
  onAuthChanged,
  isSupabaseConfigured,
  seedProductsInSupabase,
  ensureSiteSettingsRowExists,
  fetchBlogsFromSupabase,
  addBlogPostToSupabase,
  updateBlogPostInSupabase,
  deleteBlogPostFromSupabase,
  fetchTeamFromSupabase,
  addTeamMemberToSupabase,
  updateTeamMemberInSupabase,
  deleteTeamMemberFromSupabase,
  fetchFaqsFromSupabase,
  addFaqToSupabase,
  updateFaqInSupabase,
  deleteFaqFromSupabase,
} from './lib/supabaseService';
import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
  type BlogPost,
  type TeamMember,
  type FAQ,
  DEFAULT_BLOGS,
  DEFAULT_TEAM_MEMBERS,
  DEFAULT_FAQS,
} from './lib/siteConfig';

// ── Types ─────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Bridal' | 'Girlish' | 'Designer' | 'Heavy';
  imageUrl: string;
  images?: string[];
  highlights?: string;
  createdAt?: number;
  isSoldOut?: boolean;
  imageAlt?: string;
  
  // Atelier Quick Facts (GEO / Search Optimization)
  craftingTime?: string;
  origin?: string;
  customization?: string;
  embroidery?: string;
  shipping?: string;
}

interface StoreState {
  products: Product[];
  blogs: BlogPost[];
  teamMembers: TeamMember[];
  faqs: FAQ[];
  siteSettings: SiteSettings;
  isLoading: boolean;
  isSettingsLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  adminEmail: string | null;
  isDatabaseEmpty: boolean;
  fetchProducts: () => Promise<void>;
  fetchBlogs: () => Promise<void>;
  fetchTeamMembers: () => Promise<void>;
  fetchFaqs: () => Promise<void>;
  fetchSiteSettings: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>, imageFile?: File) => Promise<boolean>;
  updateProduct: (id: string, fields: Partial<Product>, imageFile?: File) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  addBlogPost: (post: Omit<BlogPost, 'id' | 'createdAt'> & { createdAt?: number }, imageFile?: File) => Promise<{ success: boolean; error?: string }>;
  updateBlogPost: (id: string, fields: Partial<BlogPost>, imageFile?: File) => Promise<{ success: boolean; error?: string }>;
  deleteBlogPost: (id: string) => Promise<{ success: boolean; error?: string }>;
  addTeamMember: (member: Omit<TeamMember, 'id' | 'createdAt'>, imageFile?: File) => Promise<{ success: boolean; error?: string }>;
  updateTeamMember: (id: string, fields: Partial<TeamMember>, imageFile?: File) => Promise<{ success: boolean; error?: string }>;
  deleteTeamMember: (id: string) => Promise<{ success: boolean; error?: string }>;
  addFaq: (faq: Omit<FAQ, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  updateFaq: (id: string, fields: Partial<FAQ>) => Promise<{ success: boolean; error?: string }>;
  deleteFaq: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateSiteSettings: (
    settings: Partial<SiteSettings>,
    heroImageFile?: File,
    logoImageFile?: File,
    aboutImageFile?: File
  ) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setAdmin: (isAdmin: boolean, email: string | null) => void;
}

// ── Persistent wishlist store (localStorage) ──────────────────────────

interface WishlistStore {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlistIds: [],
      toggleWishlist: (productId: string) => {
        const current = get().wishlistIds;
        const exists = current.includes(productId);
        set({ wishlistIds: exists ? current.filter((id) => id !== productId) : [...current, productId] });
      },
    }),
    { name: 'rachit-wishlist' }
  )
);

// ── Main store ────────────────────────────────────────────────────────

export const useStore = create<StoreState>()((set, get) => ({
  products: initialProducts,
  blogs: [],
  teamMembers: [],
  faqs: [],
  siteSettings: DEFAULT_SITE_SETTINGS,
  isLoading: true,
  isSettingsLoading: true,
  error: null,
  isAdmin: false,
  adminEmail: null,
  isDatabaseEmpty: false,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      if (isSupabaseConfigured) {
        const products = await fetchProductsFromSupabase();
        if (products.length > 0) {
          set({ products, isLoading: false, isDatabaseEmpty: false });
          return;
        } else {
          set({ products: initialProducts, isLoading: false, isDatabaseEmpty: true });
          return;
        }
      }
      set({ products: initialProducts, isLoading: false, isDatabaseEmpty: false });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      set({ products: initialProducts, isLoading: false, error: 'Failed to load products', isDatabaseEmpty: false });
    }
  },

  fetchSiteSettings: async () => {
    set({ isSettingsLoading: true });
    try {
      if (isSupabaseConfigured) {
        const settings = await fetchSiteSettingsFromSupabase();
        if (settings) { set({ siteSettings: { ...DEFAULT_SITE_SETTINGS, ...settings }, isSettingsLoading: false }); return; }
      }
      set({ isSettingsLoading: false });
    } catch (error) {
      console.error('Failed to fetch site settings:', error);
      set({ isSettingsLoading: false });
    }
  },

  addProduct: async (productInfo, imageFile) => {
    try {
      if (isSupabaseConfigured) {
        const newProduct = await addProductToSupabase(productInfo as any, imageFile);
        if (newProduct) {
          set((s) => ({ products: [newProduct, ...s.products], isDatabaseEmpty: false }));
          return true;
        }
        return false;
      }
      const id = Math.random().toString(36).substring(2, 9);
      let imageUrl = productInfo.imageUrl;
      if (imageFile) imageUrl = URL.createObjectURL(imageFile);
      const p: Product = { ...productInfo, id, imageUrl, createdAt: Date.now() };
      set((s) => ({ products: [p, ...s.products] }));
      return true;
    } catch (error) { console.error('Failed to add product:', error); return false; }
  },

  updateProduct: async (id, fields, imageFile) => {
    try {
      if (isSupabaseConfigured) {
        let imageUrl = fields.imageUrl;
        if (imageFile) {
          imageUrl = await uploadImageToSupabase(imageFile);
        }
        const success = await updateProductInSupabase(id, { ...fields, imageUrl }, undefined);
        if (success) {
          set((s) => ({
            products: s.products.map((p) => p.id === id ? { ...p, ...fields, ...(imageUrl ? { imageUrl } : {}) } : p)
          }));
          return true;
        }
        return false;
      }
      let uf = { ...fields };
      if (imageFile) uf.imageUrl = URL.createObjectURL(imageFile);
      set((s) => ({ products: s.products.map((p) => p.id === id ? { ...p, ...uf } : p) }));
      return true;
    } catch (error) { console.error('Failed to update product:', error); return false; }
  },

  deleteProduct: async (id) => {
    try {
      if (isSupabaseConfigured) {
        const success = await deleteProductFromSupabase(id);
        if (!success) return false;
      }
      set((s) => ({ products: s.products.filter((p) => p.id !== id) }));
      return true;
    } catch (error) { console.error('Failed to delete product:', error); return false; }
  },

  updateSiteSettings: async (settings, heroImageFile, logoImageFile, aboutImageFile) => {
    try {
      let us = { ...settings };
      if (heroImageFile) {
        if (isSupabaseConfigured) us.heroImage = await uploadImageToSupabase(heroImageFile);
        else us.heroImage = URL.createObjectURL(heroImageFile);
      }
      if (logoImageFile) {
        if (isSupabaseConfigured) us.logoImage = await uploadImageToSupabase(logoImageFile);
        else us.logoImage = URL.createObjectURL(logoImageFile);
      }
      if (aboutImageFile) {
        if (isSupabaseConfigured) us.aboutHeroImage = await uploadImageToSupabase(aboutImageFile);
        else us.aboutHeroImage = URL.createObjectURL(aboutImageFile);
      }
      if (isSupabaseConfigured) {
        await updateSiteSettingsInSupabase(us);
      }
      set((s) => ({ siteSettings: { ...s.siteSettings, ...us } }));
      return { success: true };
    } catch (error: any) {
      console.error('Failed to update site settings:', error);
      return { success: false, error: error?.message || 'Database error' };
    }
  },

  fetchBlogs: async () => {
    try {
      if (isSupabaseConfigured) {
        const blogs = await fetchBlogsFromSupabase();
        set({ blogs });
        return;
      }
      const local = localStorage.getItem('rachit_blogs_fallback');
      if (local) {
        set({ blogs: JSON.parse(local) });
      } else {
        set({ blogs: DEFAULT_BLOGS });
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      const local = localStorage.getItem('rachit_blogs_fallback');
      if (local) set({ blogs: JSON.parse(local) });
      else set({ blogs: DEFAULT_BLOGS });
    }
  },

  fetchTeamMembers: async () => {
    try {
      if (isSupabaseConfigured) {
        const teamMembers = await fetchTeamFromSupabase();
        set({ teamMembers: teamMembers.sort((a, b) => a.displayOrder - b.displayOrder) });
        return;
      }
      const local = localStorage.getItem('rachit_team_members_fallback');
      if (local) {
        set({ teamMembers: JSON.parse(local).sort((a: any, b: any) => a.displayOrder - b.displayOrder) });
      } else {
        set({ teamMembers: DEFAULT_TEAM_MEMBERS });
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      const local = localStorage.getItem('rachit_team_members_fallback');
      if (local) set({ teamMembers: JSON.parse(local).sort((a: any, b: any) => a.displayOrder - b.displayOrder) });
      else set({ teamMembers: DEFAULT_TEAM_MEMBERS });
    }
  },

  addBlogPost: async (postInfo, imageFile) => {
    try {
      if (isSupabaseConfigured) {
        const newPost = await addBlogPostToSupabase(postInfo, imageFile);
        if (newPost) {
          set((s) => ({ blogs: [newPost, ...s.blogs] }));
          return { success: true };
        }
        return { success: false, error: 'Database write failed' };
      } else {
        const id = Math.random().toString(36).substring(2, 9);
        let imageUrl = postInfo.imageUrl;
        if (imageFile) imageUrl = URL.createObjectURL(imageFile);
        const newPost: BlogPost = { ...postInfo, id, imageUrl, createdAt: postInfo.createdAt || Date.now() };
        set((s) => {
          const updated = [newPost, ...s.blogs];
          localStorage.setItem('rachit_blogs_fallback', JSON.stringify(updated));
          return { blogs: updated };
        });
        return { success: true };
      }
    } catch (error: any) {
      console.error('Failed to add blog post:', error);
      return { success: false, error: error?.message || 'Database error' };
    }
  },

  updateBlogPost: async (id, fields, imageFile) => {
    try {
      if (isSupabaseConfigured) {
        let imageUrl = fields.imageUrl;
        if (imageFile) {
          imageUrl = await uploadImageToSupabase(imageFile);
        }
        await updateBlogPostInSupabase(id, { ...fields, imageUrl });
        set((s) => ({
          blogs: s.blogs.map((b) => b.id === id ? { ...b, ...fields, ...(imageUrl ? { imageUrl } : {}) } : b)
        }));
        return { success: true };
      } else {
        let imageUrl = fields.imageUrl;
        if (imageFile) imageUrl = URL.createObjectURL(imageFile);
        set((s) => {
          const updated = s.blogs.map((b) => b.id === id ? { ...b, ...fields, ...(imageUrl ? { imageUrl } : {}) } : b);
          localStorage.setItem('rachit_blogs_fallback', JSON.stringify(updated));
          return { blogs: updated };
        });
        return { success: true };
      }
    } catch (error: any) {
      console.error('Failed to update blog post:', error);
      return { success: false, error: error?.message || 'Database error' };
    }
  },

  deleteBlogPost: async (id) => {
    try {
      if (isSupabaseConfigured) {
        await deleteBlogPostFromSupabase(id);
      }
      set((s) => {
        const updated = s.blogs.filter((b) => b.id !== id);
        if (!isSupabaseConfigured) {
          localStorage.setItem('rachit_blogs_fallback', JSON.stringify(updated));
        }
        return { blogs: updated };
      });
      return { success: true };
    } catch (error: any) {
      console.error('Failed to delete blog post:', error);
      return { success: false, error: error?.message || 'Database error' };
    }
  },

  addTeamMember: async (memberInfo, imageFile) => {
    try {
      if (isSupabaseConfigured) {
        const newMember = await addTeamMemberToSupabase(memberInfo, imageFile);
        if (newMember) {
          set((s) => ({ teamMembers: [...s.teamMembers, newMember].sort((a, b) => a.displayOrder - b.displayOrder) }));
          return { success: true };
        }
        return { success: false, error: 'Database write failed' };
      } else {
        const id = Math.random().toString(36).substring(2, 9);
        let imageUrl = memberInfo.imageUrl;
        if (imageFile) imageUrl = URL.createObjectURL(imageFile);
        const newMember: TeamMember = { ...memberInfo, id, imageUrl, createdAt: Date.now() };
        set((s) => {
          const updated = [...s.teamMembers, newMember].sort((a, b) => a.displayOrder - b.displayOrder);
          localStorage.setItem('rachit_team_members_fallback', JSON.stringify(updated));
          return { teamMembers: updated };
        });
        return { success: true };
      }
    } catch (error: any) {
      console.error('Failed to add team member:', error);
      return { success: false, error: error?.message || 'Database error' };
    }
  },

  updateTeamMember: async (id, fields, imageFile) => {
    try {
      if (isSupabaseConfigured) {
        let imageUrl = fields.imageUrl;
        if (imageFile) {
          imageUrl = await uploadImageToSupabase(imageFile);
        }
        await updateTeamMemberInSupabase(id, { ...fields, imageUrl });
        set((s) => ({
          teamMembers: s.teamMembers.map((m) => m.id === id ? { ...m, ...fields, ...(imageUrl ? { imageUrl } : {}) } : m).sort((a, b) => a.displayOrder - b.displayOrder)
        }));
        return { success: true };
      } else {
        let imageUrl = fields.imageUrl;
        if (imageFile) imageUrl = URL.createObjectURL(imageFile);
        set((s) => {
          const updated = s.teamMembers.map((m) => m.id === id ? { ...m, ...fields, ...(imageUrl ? { imageUrl } : {}) } : m).sort((a, b) => a.displayOrder - b.displayOrder);
          localStorage.setItem('rachit_team_members_fallback', JSON.stringify(updated));
          return { teamMembers: updated };
        });
        return { success: true };
      }
    } catch (error: any) {
      console.error('Failed to update team member:', error);
      return { success: false, error: error?.message || 'Database error' };
    }
  },

  deleteTeamMember: async (id) => {
    try {
      if (isSupabaseConfigured) {
        await deleteTeamMemberFromSupabase(id);
      }
      set((s) => {
        const updated = s.teamMembers.filter((m) => m.id !== id);
        if (!isSupabaseConfigured) {
          localStorage.setItem('rachit_team_members_fallback', JSON.stringify(updated));
        }
        return { teamMembers: updated };
      });
      return { success: true };
    } catch (error: any) {
      console.error('Failed to delete team member:', error);
      return { success: false, error: error?.message || 'Database error' };
    }
  },

  fetchFaqs: async () => {
    try {
      if (isSupabaseConfigured) {
        const faqs = await fetchFaqsFromSupabase();
        set({ faqs });
        return;
      }
      const local = localStorage.getItem('rachit_faqs_fallback');
      if (local) {
        set({ faqs: JSON.parse(local) });
      } else {
        set({ faqs: DEFAULT_FAQS });
      }
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
      const local = localStorage.getItem('rachit_faqs_fallback');
      if (local) set({ faqs: JSON.parse(local) });
      else set({ faqs: DEFAULT_FAQS });
    }
  },

  addFaq: async (faqInfo) => {
    try {
      if (isSupabaseConfigured) {
        const newFaq = await addFaqToSupabase(faqInfo);
        if (newFaq) {
          set((s) => ({ faqs: [...s.faqs, newFaq] }));
          return { success: true };
        }
        return { success: false, error: 'Database write failed' };
      } else {
        const id = Math.random().toString(36).substring(2, 9);
        const newFaq: FAQ = { ...faqInfo, id, createdAt: Date.now() };
        set((s) => {
          const updated = [...s.faqs, newFaq];
          localStorage.setItem('rachit_faqs_fallback', JSON.stringify(updated));
          return { faqs: updated };
        });
        return { success: true };
      }
    } catch (error: any) {
      console.error('Failed to add FAQ:', error);
      return { success: false, error: error?.message || 'Database error' };
    }
  },

  updateFaq: async (id, fields) => {
    try {
      if (isSupabaseConfigured) {
        await updateFaqInSupabase(id, fields);
      }
      set((s) => {
        const updated = s.faqs.map((f) => f.id === id ? { ...f, ...fields } : f);
        if (!isSupabaseConfigured) {
          localStorage.setItem('rachit_faqs_fallback', JSON.stringify(updated));
        }
        return { faqs: updated };
      });
      return { success: true };
    } catch (error: any) {
      console.error('Failed to update FAQ:', error);
      return { success: false, error: error?.message || 'Database error' };
    }
  },

  deleteFaq: async (id) => {
    try {
      if (isSupabaseConfigured) {
        await deleteFaqFromSupabase(id);
      }
      set((s) => {
        const updated = s.faqs.filter((f) => f.id !== id);
        if (!isSupabaseConfigured) {
          localStorage.setItem('rachit_faqs_fallback', JSON.stringify(updated));
        }
        return { faqs: updated };
      });
      return { success: true };
    } catch (error: any) {
      console.error('Failed to delete FAQ:', error);
      return { success: false, error: error?.message || 'Database error' };
    }
  },

  login: async (email, password) => {
    if (isSupabaseConfigured) {
      const user = await signInAdmin(email, password);
      if (user) {
        set({ isAdmin: true, adminEmail: user.email });
        
        // Ensure site settings main row exists in database
        await ensureSiteSettingsRowExists();
        
        // Auto-seed if database is empty!
        const state = get();
        if (state.isDatabaseEmpty) {
          console.log('Database is empty. Auto-seeding initial products...');
          const success = await seedProductsInSupabase(initialProducts);
          if (success) {
            await get().fetchProducts();
          }
        }
      }
    } else {
      if (password === 'admin123') set({ isAdmin: true, adminEmail: email || 'admin@local' });
      else throw new Error('Invalid credentials');
    }
  },

  logout: async () => {
    if (isSupabaseConfigured) await signOutAdmin();
    set({ isAdmin: false, adminEmail: null });
  },

  setAdmin: (isAdmin, email) => set({ isAdmin, adminEmail: email }),
}));

// Listen for auth changes
if (isSupabaseConfigured) {
  onAuthChanged((user: any) => {
    useStore.getState().setAdmin(!!user, user?.email || null);
  });
}
