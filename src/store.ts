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
} from './lib/supabaseService';
import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
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
}

interface StoreState {
  products: Product[];
  siteSettings: SiteSettings;
  isLoading: boolean;
  isSettingsLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  adminEmail: string | null;
  fetchProducts: () => Promise<void>;
  fetchSiteSettings: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>, imageFile?: File) => Promise<boolean>;
  updateProduct: (id: string, fields: Partial<Product>, imageFile?: File) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateSiteSettings: (settings: Partial<SiteSettings>, imageFile?: File) => Promise<boolean>;
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
  siteSettings: DEFAULT_SITE_SETTINGS,
  isLoading: true,
  isSettingsLoading: true,
  error: null,
  isAdmin: false,
  adminEmail: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      if (isSupabaseConfigured) {
        const products = await fetchProductsFromSupabase();
        if (products.length > 0) { set({ products, isLoading: false }); return; }
      }
      set({ products: initialProducts, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      set({ products: initialProducts, isLoading: false, error: 'Failed to load products' });
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
        if (newProduct) { set((s) => ({ products: [newProduct, ...s.products] })); return true; }
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
        const success = await updateProductInSupabase(id, fields as any, imageFile);
        if (success) {
          const products = await fetchProductsFromSupabase();
          if (products.length > 0) set({ products });
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

  updateSiteSettings: async (settings, imageFile) => {
    try {
      let us = { ...settings };
      if (imageFile && isSupabaseConfigured) {
        us.heroImage = await uploadImageToSupabase(imageFile);
      } else if (imageFile) {
        us.heroImage = URL.createObjectURL(imageFile);
      }
      if (isSupabaseConfigured) {
        const success = await updateSiteSettingsInSupabase(us);
        if (!success) return false;
      }
      set((s) => ({ siteSettings: { ...s.siteSettings, ...us } }));
      return true;
    } catch (error) { console.error('Failed to update site settings:', error); return false; }
  },

  login: async (email, password) => {
    if (isSupabaseConfigured) {
      const user = await signInAdmin(email, password);
      if (user) set({ isAdmin: true, adminEmail: user.email });
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
