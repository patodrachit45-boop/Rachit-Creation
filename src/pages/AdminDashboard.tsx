import { useState, useRef, useEffect, useCallback, type FormEvent, type DragEvent } from 'react';
import { useStore, type Product } from '../store';
import { isSupabaseConfigured } from '../lib/supabaseService';
import { CATEGORIES, formatPrice, type BlogPost, type TeamMember } from '../lib/siteConfig';
import {
  Package, Crown, Sparkles, Heart, Gem, Plus, Pencil, Trash2, X,
  Upload, Save, LogOut, LayoutDashboard, Settings, Image, Search,
  Loader2, ShieldCheck, AlertTriangle, Check, ChevronDown,
  Phone, Mail, MapPin, Clock, Instagram, MessageCircle, FileText, Users,
} from 'lucide-react';

type Tab = 'overview' | 'products' | 'blogs' | 'team' | 'settings';
type ProductCategory = Product['category'];
interface Toast { id: number; message: string; type: 'success' | 'error'; }
let toastCounter = 0;

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-sm text-sm font-medium ${t.type === 'success' ? 'bg-emerald-900/90 text-emerald-100 border border-emerald-700/50' : 'bg-red-900/90 text-red-100 border border-red-700/50'}`} style={{ animation: 'slideIn 0.3s ease-out' }}>
          {t.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
          {t.message}
          <button onClick={() => onDismiss(t.id)} className="ml-2 opacity-60 hover:opacity-100"><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const products = useStore((s) => s.products);
  const blogs = useStore((s) => s.blogs);
  const teamMembers = useStore((s) => s.teamMembers);
  const siteSettings = useStore((s) => s.siteSettings);
  const isAdmin = useStore((s) => s.isAdmin);
  const adminEmail = useStore((s) => s.adminEmail);
  const login = useStore((s) => s.login);
  const logout = useStore((s) => s.logout);
  const addProduct = useStore((s) => s.addProduct);
  const updateProduct = useStore((s) => s.updateProduct);
  const deleteProduct = useStore((s) => s.deleteProduct);
  const addBlogPost = useStore((s) => s.addBlogPost);
  const updateBlogPost = useStore((s) => s.updateBlogPost);
  const deleteBlogPost = useStore((s) => s.deleteBlogPost);
  const addTeamMember = useStore((s) => s.addTeamMember);
  const updateTeamMember = useStore((s) => s.updateTeamMember);
  const deleteTeamMember = useStore((s) => s.deleteTeamMember);
  const updateSiteSettings = useStore((s) => s.updateSiteSettings);
  const fetchProducts = useStore((s) => s.fetchProducts);
  const fetchBlogs = useStore((s) => s.fetchBlogs);
  const fetchTeamMembers = useStore((s) => s.fetchTeamMembers);
  const fetchSiteSettings = useStore((s) => s.fetchSiteSettings);
  const isLoading = useStore((s) => s.isLoading);

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => { setLogoError(false); }, [siteSettings.logoImage]);
  useEffect(() => { 
    fetchProducts(); 
    fetchBlogs();
    fetchTeamMembers();
    fetchSiteSettings(); 
  }, [fetchProducts, fetchBlogs, fetchTeamMembers, fetchSiteSettings]);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  const dismissToast = useCallback((id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  if (!isAdmin) return (<><ToastContainer toasts={toasts} onDismiss={dismissToast} /><LoginScreen onLogin={login} showToast={showToast} /></>);

  const navItems: { id: Tab; icon: typeof LayoutDashboard; label: string }[] = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'products', icon: Package, label: 'Products' },
    { id: 'blogs', icon: FileText, label: 'Blog Posts' },
    { id: 'team', icon: Users, label: 'Our Team' },
    { id: 'settings', icon: Settings, label: 'Site Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col lg:flex-row">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between bg-gray-900 border-b border-gray-800 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {!logoError && (
            <img src={siteSettings.logoImage || '/images/logo.jpg'} alt="Logo" className="w-8 h-8 rounded-lg object-cover" onError={() => setLogoError(true)} />
          )}
          <span className="font-serif text-sm text-white tracking-widest">RACHIT CREATION</span>
        </div>
      </div>
      <div className="lg:hidden flex gap-1 px-4 py-2 bg-gray-900 border-b border-gray-800 overflow-x-auto">
        {navItems.map((item) => { const Icon = item.icon; return (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${activeTab === item.id ? 'bg-[#C5A059]/10 text-[#C5A059]' : 'text-gray-400'}`}><Icon size={16} />{item.label}</button>
        ); })}
        <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs text-red-400 whitespace-nowrap"><LogOut size={16} />Sign Out</button>
      </div>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800 z-30">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            {!logoError && (
              <img src={siteSettings.logoImage || '/images/logo.jpg'} alt="Logo" className="w-10 h-10 rounded-xl object-cover shadow-md" onError={() => setLogoError(true)} />
            )}
            <div><h2 className="font-serif text-sm text-white tracking-widest leading-tight">RACHIT</h2><h2 className="font-serif text-sm text-[#C5A059] tracking-widest leading-tight">CREATION</h2></div>
          </div>
          <p className="text-[10px] text-gray-500 mt-3 uppercase tracking-widest">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => { const Icon = item.icon; const isActive = activeTab === item.id; return (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-[#C5A059]/10 text-[#C5A059] shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}><Icon size={18} />{item.label}{isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C5A059]" />}</button>
          ); })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C5A059] to-[#A8864A] flex items-center justify-center text-white text-xs font-bold uppercase">{adminEmail?.charAt(0) || 'A'}</div>
            <div className="flex-1 min-w-0"><p className="text-xs text-white font-medium truncate">{adminEmail || 'Admin'}</p><p className="text-[10px] text-gray-500">Administrator</p></div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-900/10 transition-all"><LogOut size={16} /> Sign Out</button>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
          {activeTab === 'overview' && <OverviewTab products={products} isLoading={isLoading} />}
          {activeTab === 'products' && <ProductsTab products={products} isLoading={isLoading} onAdd={addProduct} onUpdate={updateProduct} onDelete={deleteProduct} showToast={showToast} />}
          {activeTab === 'blogs' && <BlogsTab blogs={blogs} onAdd={addBlogPost} onUpdate={updateBlogPost} onDelete={deleteBlogPost} showToast={showToast} />}
          {activeTab === 'team' && <TeamTab team={teamMembers} onAdd={addTeamMember} onUpdate={updateTeamMember} onDelete={deleteTeamMember} showToast={showToast} />}
          {activeTab === 'settings' && <SettingsTab siteSettings={siteSettings} onUpdate={updateSiteSettings} showToast={showToast} />}
        </div>
      </main>
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
}

// ── LOGIN ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, showToast }: { onLogin: (email: string, password: string) => Promise<void>; showToast: (msg: string, type: 'success' | 'error') => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await onLogin(email, password); showToast('Welcome back!', 'success'); }
    catch (err: any) { setError(err?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#A8864A] mb-5 shadow-lg shadow-[#C5A059]/20"><ShieldCheck size={28} className="text-white" /></div>
          <h1 className="font-serif text-3xl text-white tracking-wide">RACHIT CREATION</h1>
          <p className="text-gray-500 text-sm mt-2 tracking-wide uppercase">Admin Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-1">Sign In</h2>
          <p className="text-gray-500 text-sm mb-8">Enter your credentials to access the admin panel</p>
          {error && <div className="mb-6 flex items-center gap-2 p-3.5 rounded-xl bg-red-900/30 border border-red-800/50 text-red-300 text-sm"><AlertTriangle size={16} className="flex-shrink-0" />{error}</div>}
          <div className="space-y-5">
            <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Email Address</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 focus:border-[#C5A059] transition-all" placeholder="admin@rachitcreation.com" /></div>
            <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 focus:border-[#C5A059] transition-all" placeholder="••••••••" /></div>
          </div>
          <button type="submit" disabled={loading} className="mt-8 w-full bg-gradient-to-r from-[#C5A059] to-[#A8864A] text-white py-3.5 rounded-xl text-sm font-semibold uppercase tracking-widest hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20">
            {loading ? <><Loader2 size={16} className="animate-spin" />Authenticating...</> : 'Sign In'}
          </button>
          {!isSupabaseConfigured && <div className="mt-6 p-3.5 rounded-xl bg-amber-900/20 border border-amber-800/40 text-amber-300/80 text-xs text-center leading-relaxed"><span className="font-semibold">Dev Mode</span> — Supabase not configured. Use any email with password <code className="bg-amber-800/30 px-1.5 py-0.5 rounded font-mono">admin123</code></div>}
        </form>
      </div>
    </div>
  );
}

// ── OVERVIEW ──────────────────────────────────────────────────────────
function OverviewTab({ products, isLoading }: { products: Product[]; isLoading: boolean }) {
  const stats = [
    { label: 'Total Products', count: products.length, icon: Package, bg: 'bg-violet-500/10' },
    { label: 'Bridal', count: products.filter((p) => p.category === 'Bridal').length, icon: Crown, bg: 'bg-rose-500/10' },
    { label: 'Designer', count: products.filter((p) => p.category === 'Designer').length, icon: Sparkles, bg: 'bg-amber-500/10' },
    { label: 'Girlish', count: products.filter((p) => p.category === 'Girlish').length, icon: Heart, bg: 'bg-pink-500/10' },
    { label: 'Heavy', count: products.filter((p) => p.category === 'Heavy').length, icon: Gem, bg: 'bg-emerald-500/10' },
  ];
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-semibold text-white">Dashboard Overview</h1><p className="text-gray-500 text-sm mt-1">Welcome back — here's a summary of your catalog</p></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => { const Icon = stat.icon; return (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all">
            <div className={`${stat.bg} p-2.5 rounded-xl w-fit mb-4`}><Icon size={20} className="text-gray-300" /></div>
            {isLoading ? <div className="h-8 w-16 bg-gray-800 rounded-lg animate-pulse" /> : <p className="text-3xl font-bold text-white">{stat.count}</p>}
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</p>
          </div>
        ); })}
      </div>
      <div className="mt-10"><h2 className="text-lg font-semibold text-white mb-4">Recent Products</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {products.length === 0 ? <div className="p-12 text-center text-gray-500"><Package size={40} className="mx-auto mb-3 opacity-30" /><p>No products yet.</p></div> : (
            <div className="divide-y divide-gray-800">{products.slice(0, 8).map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-gray-800/30 transition-colors"><img src={p.imageUrl} alt={p.name} className="w-12 h-14 object-cover rounded-lg flex-shrink-0" /><div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">{p.name}</p><p className="text-xs text-gray-500">{p.category}</p></div><span className="text-sm font-semibold text-[#C5A059]">{formatPrice(p.price)}</span></div>
            ))}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── PRODUCTS ──────────────────────────────────────────────────────────
function ProductsTab({ products, isLoading, onAdd, onUpdate, onDelete, showToast }: {
  products: Product[]; isLoading: boolean;
  onAdd: (p: Omit<Product, 'id'>, f?: File) => Promise<boolean>;
  onUpdate: (id: string, f: Partial<Product>, img?: File) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  showToast: (m: string, t: 'success' | 'error') => void;
}) {
  const [categoryFilter, setCategoryFilter] = useState<'All' | ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const filtered = products.filter((p) => {
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const success = await onDelete(deleteTarget.id);
    setDeleteLoading(false);
    showToast(success ? `"${deleteTarget.name}" deleted` : 'Failed to delete', success ? 'success' : 'error');
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-semibold text-white">Products</h1><p className="text-gray-500 text-sm mt-1">{products.length} total products</p></div>
        <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C5A059] to-[#A8864A] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:brightness-110 transition-all shadow-lg shadow-[#C5A059]/20"><Plus size={18} /> Add Product</button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex flex-wrap gap-2 flex-1">
          {(['All', ...CATEGORIES] as const).map((cat) => (
            <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${categoryFilter === cat ? 'bg-[#C5A059] text-white shadow-md' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>{cat} <span className="ml-1 opacity-70">({cat === 'All' ? products.length : products.filter((p) => p.category === cat).length})</span></button>
          ))}
        </div>
        <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full sm:w-64 bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 transition-all" /></div>
      </div>
      {isLoading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{[...Array(8)].map((_, i) => <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-pulse"><div className="aspect-[3/4] bg-gray-800" /><div className="p-4 space-y-3"><div className="h-4 w-3/4 bg-gray-800 rounded" /><div className="h-3 w-1/2 bg-gray-800 rounded" /></div></div>)}</div>
      : filtered.length === 0 ? <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center"><Package size={48} className="mx-auto mb-4 text-gray-700" /><p className="text-gray-400 text-lg font-medium">No products found</p></div>
      : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <div key={product.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden group hover:border-gray-700 transition-all">
              <div className="aspect-[3/4] relative overflow-hidden bg-gray-800">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="w-10 h-10 bg-white/90 text-gray-900 rounded-xl flex items-center justify-center hover:bg-[#C5A059] hover:text-white transition-all shadow-lg"><Pencil size={16} /></button>
                  <button onClick={() => setDeleteTarget(product)} className="w-10 h-10 bg-white/90 text-gray-900 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg"><Trash2 size={16} /></button>
                </div>
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-lg">{product.category}</span>
                  {product.isSoldOut && <span className="px-2.5 py-1 bg-red-950/80 border border-red-700/50 backdrop-blur-md text-red-300 text-[10px] font-bold uppercase tracking-widest rounded-lg">Sold Out</span>}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-white truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-3"><span className="text-lg font-bold text-[#C5A059]">{formatPrice(product.price)}</span>
                  <div className="flex gap-1"><button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="p-1.5 text-gray-500 hover:text-[#C5A059] transition-colors"><Pencil size={14} /></button><button onClick={() => setDeleteTarget(product)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isModalOpen && <ProductModal product={editingProduct} onClose={() => { setIsModalOpen(false); setEditingProduct(null); }} onAdd={onAdd} onUpdate={onUpdate} showToast={showToast} />}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><Trash2 size={20} className="text-red-400" /></div><h3 className="text-lg font-semibold text-white">Delete Product</h3></div>
            <p className="text-gray-400 text-sm mb-2">Are you sure you want to delete <span className="text-white font-medium">"{deleteTarget.name}"</span>?</p>
            <p className="text-gray-600 text-xs mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700 transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">{deleteLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PRODUCT MODAL ─────────────────────────────────────────────────────
function ProductModal({ product, onClose, onAdd, onUpdate, showToast }: {
  product: Product | null; onClose: () => void;
  onAdd: (p: Omit<Product, 'id'>, f?: File) => Promise<boolean>;
  onUpdate: (id: string, f: Partial<Product>, img?: File) => Promise<boolean>;
  showToast: (m: string, t: 'success' | 'error') => void;
}) {
  const isEditing = !!product;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState<ProductCategory>(product?.category || 'Bridal');
  const [price, setPrice] = useState<number>(product?.price || 0);
  const [description, setDescription] = useState(product?.description || '');
  const [highlights, setHighlights] = useState(product?.highlights || '');
  const [isSoldOut, setIsSoldOut] = useState(product?.isSoldOut || false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || '');
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleImageSelect = (file: File) => { setImageFile(file); const r = new FileReader(); r.onloadend = () => setImagePreview(r.result as string); r.readAsDataURL(file); };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragOver(false); const f = e.dataTransfer.files?.[0]; if (f?.type.startsWith('image/')) handleImageSelect(f); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const success = isEditing && product
        ? await onUpdate(product.id, { name, category, price, description, highlights, isSoldOut, imageUrl: product.imageUrl }, imageFile || undefined)
        : await onAdd({ name, category, price, description, highlights, isSoldOut, imageUrl: imagePreview }, imageFile || undefined);
      showToast(success ? `"${name}" ${isEditing ? 'updated' : 'added'}` : `Failed to ${isEditing ? 'update' : 'add'}`, success ? 'success' : 'error');
      if (success) onClose();
    } catch { showToast('An error occurred', 'error'); }
    finally { setLoading(false); }
  };

  const inputClass = 'w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 focus:border-[#C5A059] transition-all';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[5vh] bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div><h2 className="text-xl font-semibold text-white">{isEditing ? 'Edit Product' : 'Add New Product'}</h2><p className="text-gray-500 text-sm mt-0.5">{isEditing ? 'Update the product details' : 'Fill in details to add a new product'}</p></div>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1"><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Product Image</label>
            <div onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragOver ? 'border-[#C5A059] bg-[#C5A059]/5' : 'border-gray-700 hover:border-gray-600 bg-gray-800/30'}`}>
              {imagePreview ? <div className="flex items-center gap-4"><img src={imagePreview} alt="Preview" className="w-20 h-24 object-cover rounded-lg" /><div className="text-left"><p className="text-sm text-white font-medium">{imageFile ? imageFile.name : 'Current image'}</p><p className="text-xs text-gray-500 mt-1">Click or drag to replace</p></div></div>
              : <div><Upload size={32} className="mx-auto text-gray-600 mb-3" /><p className="text-sm text-gray-400"><span className="text-[#C5A059] font-medium">Click to upload</span> or drag and drop</p></div>}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageSelect(f); }} />
            </div>
          </div>
          <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Product Name</label><input required type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="e.g., Royal Bridal Lehenga" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Category</label><div className="relative"><select value={category} onChange={(e) => setCategory(e.target.value as ProductCategory)} className={`${inputClass} appearance-none`}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select><ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" /></div></div>
            <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Price (₹)</label><input required type="number" min={0} value={price || ''} onChange={(e) => setPrice(Number(e.target.value))} className={inputClass} placeholder="15000" /></div>
          </div>
          <div className="flex items-center gap-3 bg-gray-800/20 border border-gray-800/50 rounded-xl px-4 py-3.5">
            <input 
              id="isSoldOut" 
              type="checkbox" 
              checked={isSoldOut} 
              onChange={(e) => setIsSoldOut(e.target.checked)} 
              className="w-4.5 h-4.5 rounded border-gray-700 bg-gray-850 text-[#C5A059] focus:ring-offset-gray-950 focus:ring-[#C5A059]/50 transition-all cursor-pointer"
            />
            <label htmlFor="isSoldOut" className="text-sm font-medium text-gray-300 cursor-pointer select-none">
              Mark this product as Sold Out
            </label>
          </div>
          <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Description</label><textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} resize-none`} placeholder="Describe the product..." /></div>
          <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Highlights <span className="normal-case tracking-normal text-gray-600">(optional)</span></label><textarea rows={3} value={highlights} onChange={(e) => setHighlights(e.target.value)} className={`${inputClass} resize-none`} placeholder="Enter highlights separated by newlines..." /></div>
          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#A8864A] text-white text-sm font-semibold hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20">{loading ? <><Loader2 size={16} className="animate-spin" />Saving...</> : <><Save size={16} />{isEditing ? 'Save Changes' : 'Add Product'}</>}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── SETTINGS ──────────────────────────────────────────────────────────
function SettingsTab({ siteSettings, onUpdate, showToast }: {
  siteSettings: ReturnType<typeof useStore.getState>['siteSettings'];
  onUpdate: (s: Partial<typeof siteSettings>, hero?: File, logo?: File, about?: File) => Promise<boolean>;
  showToast: (m: string, t: 'success' | 'error') => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const aboutInputRef = useRef<HTMLInputElement>(null);

  const [whatsappNumber, setWhatsappNumber] = useState(siteSettings.whatsappNumber);
  const [phone, setPhone] = useState(siteSettings.phone);
  const [email, setEmail] = useState(siteSettings.email);
  const [address, setAddress] = useState(siteSettings.address);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(siteSettings.googleMapsUrl);
  const [facebookPixelId, setFacebookPixelId] = useState(siteSettings.facebookPixelId);
  const [pinterestUrl, setPinterestUrl] = useState(siteSettings.pinterestUrl);
  const [twitterUrl, setTwitterUrl] = useState(siteSettings.twitterUrl);
  const [showroomHours, setShowroomHours] = useState(siteSettings.showroomHours);
  const [instagramUrl, setInstagramUrl] = useState(siteSettings.instagramUrl);
  const [aboutText, setAboutText] = useState(siteSettings.aboutText);

  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState(siteSettings.heroImage);
  const [logoImageFile, setLogoImageFile] = useState<File | null>(null);
  const [logoImagePreview, setLogoImagePreview] = useState(siteSettings.logoImage);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [aboutImagePreview, setAboutImagePreview] = useState(siteSettings.aboutHeroImage);

  const [heroImageRemoved, setHeroImageRemoved] = useState(false);
  const [logoImageRemoved, setLogoImageRemoved] = useState(false);
  const [aboutImageRemoved, setAboutImageRemoved] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setWhatsappNumber(siteSettings.whatsappNumber); setPhone(siteSettings.phone); setEmail(siteSettings.email);
    setAddress(siteSettings.address); setGoogleMapsUrl(siteSettings.googleMapsUrl); setShowroomHours(siteSettings.showroomHours); setInstagramUrl(siteSettings.instagramUrl);
    setFacebookPixelId(siteSettings.facebookPixelId || ''); setPinterestUrl(siteSettings.pinterestUrl || ''); setTwitterUrl(siteSettings.twitterUrl || '');
    setAboutText(siteSettings.aboutText); setHeroImagePreview(siteSettings.heroImage);
    setLogoImagePreview(siteSettings.logoImage); setAboutImagePreview(siteSettings.aboutHeroImage);
    setHeroImageRemoved(false); setLogoImageRemoved(false); setAboutImageRemoved(false);
  }, [siteSettings]);

  const handleHeroImage = (file: File) => { setHeroImageFile(file); setHeroImageRemoved(false); const r = new FileReader(); r.onloadend = () => setHeroImagePreview(r.result as string); r.readAsDataURL(file); };
  const handleLogoImage = (file: File) => { setLogoImageFile(file); setLogoImageRemoved(false); const r = new FileReader(); r.onloadend = () => setLogoImagePreview(r.result as string); r.readAsDataURL(file); };
  const handleAboutImage = (file: File) => { setAboutImageFile(file); setAboutImageRemoved(false); const r = new FileReader(); r.onloadend = () => setAboutImagePreview(r.result as string); r.readAsDataURL(file); };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault(); setLoading(true);
    
    const settingsPayload: Partial<typeof siteSettings> = { 
      whatsappNumber, 
      phone, 
      email, 
      address, 
      googleMapsUrl,
      facebookPixelId,
      pinterestUrl,
      twitterUrl,
      showroomHours, 
      instagramUrl, 
      aboutText 
    };

    if (heroImageRemoved) settingsPayload.heroImage = '';
    if (logoImageRemoved) settingsPayload.logoImage = '';
    if (aboutImageRemoved) settingsPayload.aboutHeroImage = '';

    const success = await onUpdate(
      settingsPayload,
      heroImageFile || undefined,
      logoImageFile || undefined,
      aboutImageFile || undefined
    );
    setLoading(false);
    showToast(success ? 'Site settings saved' : 'Failed to save', success ? 'success' : 'error');
    if (success) {
      setHeroImageFile(null);
      setLogoImageFile(null);
      setAboutImageFile(null);
      setHeroImageRemoved(false);
      setLogoImageRemoved(false);
      setAboutImageRemoved(false);
    }
  };

  const inputClass = 'w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 focus:border-[#C5A059] transition-all';

  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-semibold text-white">Site Settings</h1><p className="text-gray-500 text-sm mt-1">Manage your website content and contact information</p></div>
      <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5"><div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center"><Image size={18} className="text-violet-400" /></div><div><h3 className="text-sm font-semibold text-white">Hero Image</h3><p className="text-xs text-gray-500">The main banner image on your homepage</p></div></div>
              {heroImagePreview ? (
                <div className="relative border-2 border-dashed border-gray-700 rounded-xl overflow-hidden group h-40 bg-gray-850">
                  <img src={heroImagePreview} alt="Hero" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 transition-all flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3.5 py-2 bg-white/95 text-gray-900 rounded-xl text-xs font-semibold hover:bg-[#C5A059] hover:text-white transition-all flex items-center gap-1.5 shadow-lg"><Upload size={13} /> Change</button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setHeroImagePreview(''); setHeroImageFile(null); setHeroImageRemoved(true); }} className="px-3.5 py-2 bg-red-650/95 text-white rounded-xl text-xs font-semibold hover:bg-red-500 transition-all flex items-center gap-1.5 shadow-lg"><Trash2 size={13} /> Remove</button>
                  </div>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()} className="relative border-2 border-dashed border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:border-gray-600 transition-all group h-40 flex items-center justify-center bg-gray-850">
                  <div className="p-4 text-center">
                    <Upload size={24} className="mx-auto text-gray-600 mb-1" />
                    <p className="text-xs text-gray-400">Click to upload hero image</p>
                  </div>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleHeroImage(f); }} />
            </div>
          </section>

          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5"><div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center"><Crown size={18} className="text-indigo-400" /></div><div><h3 className="text-sm font-semibold text-white">Brand Logo</h3><p className="text-xs text-gray-500">The logo image displayed in the header</p></div></div>
              <div className="relative w-28 h-28 border-2 border-dashed border-gray-700 rounded-full overflow-hidden group mx-auto flex items-center justify-center bg-gray-800/35">
                {logoImagePreview ? (
                  <div className="relative w-full h-full">
                    <img src={logoImagePreview} alt="Logo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 transition-all flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                      <button type="button" onClick={() => logoInputRef.current?.click()} className="text-white hover:text-[#C5A059] transition-colors" title="Change logo"><Upload size={14} /></button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setLogoImagePreview(''); setLogoImageFile(null); setLogoImageRemoved(true); }} className="text-red-400 hover:text-red-500 transition-colors" title="Remove logo"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => logoInputRef.current?.click()} className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:border-gray-600 transition-all">
                    <Upload size={22} className="text-gray-600 mb-1" />
                    <span className="text-[10px] text-gray-400 font-medium">Upload</span>
                  </div>
                )}
              </div>
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoImage(f); }} />
            </div>
          </section>
        </div>

        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5"><div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Phone size={18} className="text-emerald-400" /></div><div><h3 className="text-sm font-semibold text-white">Contact Information</h3><p className="text-xs text-gray-500">How customers can reach you</p></div></div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium"><MessageCircle size={12} className="inline mr-1.5" />WhatsApp Number</label><input type="text" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className={inputClass} placeholder="917359747911" /></div>
              <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium"><Phone size={12} className="inline mr-1.5" />Phone</label><input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+91 73597 47911" /></div>
            </div>
            <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium"><Mail size={12} className="inline mr-1.5" />Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="rachitcreation@gmail.com" /></div>
            <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium"><MapPin size={12} className="inline mr-1.5" />Address</label><input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} placeholder="Full address" /></div>
            <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium"><MapPin size={12} className="inline mr-1.5" />Google Maps Link (Redirect URL)</label><input type="text" value={googleMapsUrl} onChange={(e) => setGoogleMapsUrl(e.target.value)} className={inputClass} placeholder="https://maps.app.goo.gl/ndARWqQaobT93CUb7" /></div>
            <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium"><Clock size={12} className="inline mr-1.5" />Showroom Hours</label><input type="text" value={showroomHours} onChange={(e) => setShowroomHours(e.target.value)} className={inputClass} placeholder="Mon - Sat: 10:00 AM - 8:00 PM" /></div>
            <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Facebook Pixel ID</label><input type="text" value={facebookPixelId} onChange={(e) => setFacebookPixelId(e.target.value)} className={inputClass} placeholder="e.g. 1234567890" /></div>
          </div>
        </section>

        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5"><div className="w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center"><Instagram size={18} className="text-pink-400" /></div><div><h3 className="text-sm font-semibold text-white">Social Media</h3><p className="text-xs text-gray-500">Your social media presence</p></div></div>
          <div className="space-y-4">
            <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Instagram URL</label><input type="url" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} className={inputClass} placeholder="https://www.instagram.com/rachit__creation/" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Pinterest URL</label><input type="url" value={pinterestUrl} onChange={(e) => setPinterestUrl(e.target.value)} className={inputClass} placeholder="https://www.pinterest.com/..." /></div>
              <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Twitter (X) URL</label><input type="url" value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} className={inputClass} placeholder="https://x.com/..." /></div>
            </div>
          </div>
        </section>

        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5"><div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center"><FileText size={18} className="text-amber-400" /></div><div><h3 className="text-sm font-semibold text-white">About Page</h3><p className="text-xs text-gray-500">Your brand story content and photo</p></div></div>
          <div className="space-y-5">
            <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Story Photo</label>
              {aboutImagePreview ? (
                <div className="relative border-2 border-dashed border-gray-700 rounded-xl overflow-hidden group h-44 bg-gray-850">
                  <img src={aboutImagePreview} alt="Story" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 transition-all flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                    <button type="button" onClick={() => aboutInputRef.current?.click()} className="px-3.5 py-2 bg-white/95 text-gray-900 rounded-xl text-xs font-semibold hover:bg-[#C5A059] hover:text-white transition-all flex items-center gap-1.5 shadow-lg"><Upload size={13} /> Change</button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setAboutImagePreview(''); setAboutImageFile(null); setAboutImageRemoved(true); }} className="px-3.5 py-2 bg-red-650/95 text-white rounded-xl text-xs font-semibold hover:bg-red-500 transition-all flex items-center gap-1.5 shadow-lg"><Trash2 size={13} /> Remove</button>
                  </div>
                </div>
              ) : (
                <div onClick={() => aboutInputRef.current?.click()} className="relative border-2 border-dashed border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:border-gray-600 transition-all group h-44 flex items-center justify-center bg-gray-850">
                  <div className="p-4 text-center">
                    <Upload size={24} className="mx-auto text-gray-600 mb-1" />
                    <p className="text-xs text-gray-400">Click to upload story photo</p>
                  </div>
                </div>
              )}
              <input ref={aboutInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAboutImage(f); }} />
            </div>
            <div><label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">About Text</label><textarea rows={6} value={aboutText} onChange={(e) => setAboutText(e.target.value)} className={`${inputClass} resize-none`} placeholder="Tell your brand story..." /></div>
          </div>
        </section>

        <div className="flex justify-end pb-8">
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C5A059] to-[#A8864A] text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:brightness-110 disabled:opacity-50 transition-all shadow-lg shadow-[#C5A059]/20">{loading ? <><Loader2 size={16} className="animate-spin" />Saving...</> : <><Save size={16} />Save Settings</>}</button>
        </div>
      </form>
    </div>
  );
}

// ── BLOGS TAB ──────────────────────────────────────────────────────────

interface BlogsTabProps {
  blogs: BlogPost[];
  onAdd: (post: Omit<BlogPost, 'id' | 'createdAt'>, imageFile?: File) => Promise<boolean>;
  onUpdate: (id: string, fields: Partial<BlogPost>, imageFile?: File) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  showToast: (m: string, t: 'success' | 'error') => void;
}

function BlogsTab({ blogs, onAdd, onUpdate, onDelete, showToast }: BlogsTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddModal = () => {
    setEditingPost(null);
    setTitle('');
    setExcerpt('');
    setContent('');
    setImageUrl('');
    setImageFile(null);
    setImagePreview('');
    setModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setImageUrl(post.imageUrl);
    setImageFile(null);
    setImagePreview(post.imageUrl);
    setModalOpen(true);
  };

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const r = new FileReader();
    r.onloadend = () => setImagePreview(r.result as string);
    r.readAsDataURL(file);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    setLoading(true);

    const payload = { title, excerpt, content, imageUrl };
    let success = false;

    if (editingPost) {
      success = await onUpdate(editingPost.id, payload, imageFile || undefined);
    } else {
      success = await onAdd(payload, imageFile || undefined);
    }

    setLoading(false);
    if (success) {
      showToast(editingPost ? 'Blog post updated' : 'Blog post created', 'success');
      setModalOpen(false);
    } else {
      showToast('Failed to save blog post', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    const success = await onDelete(deleteId);
    setLoading(false);
    setDeleteId(null);
    if (success) {
      showToast('Blog post deleted', 'success');
    } else {
      showToast('Failed to delete blog post', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><FileText className="text-[#C5A059]" /> Blog Posts</h2>
          <p className="text-xs text-gray-500">Manage luxury collection stories, fashion trends, and articles</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#b08d47] text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"><Plus size={15} /> Add Blog Post</button>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <FileText className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white">No Blog Posts Yet</h3>
          <p className="text-xs text-gray-500 mt-1">Start writing design ideas and bridal fashion guides.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((post) => (
            <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col group">
              <div className="relative h-48 bg-gray-950 overflow-hidden">
                <img src={post.imageUrl || '/images/products/regenerated_image_1779296299562.png'} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => openEditModal(post)} className="w-8 h-8 rounded-lg bg-gray-900/90 hover:bg-[#C5A059] text-gray-300 hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer"><Pencil size={14} /></button>
                  <button onClick={() => setDeleteId(post.id)} className="w-8 h-8 rounded-lg bg-gray-900/90 hover:bg-red-650 text-gray-300 hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer"><Trash2 size={14} /></button>
                </div>
                <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm text-[10px] text-gray-400 px-2.5 py-1 rounded-md">{new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg text-white group-hover:text-[#C5A059] transition-all line-clamp-1">{post.title}</h3>
                  <p className="text-xs text-gray-400 font-sans mt-2 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">{editingPost ? 'Edit Blog Post' : 'Add Blog Post'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-white transition-all cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Post Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-850 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50" placeholder="e.g. 5 Lehenga Trends for the Wedding Season" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Short Excerpt *</label>
                <input type="text" required value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full bg-gray-850 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50" placeholder="A brief one-sentence summary of the post..." />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Featured Image</label>
                <div onClick={() => fileInputRef.current?.click()} className="relative border-2 border-dashed border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:border-gray-600 transition-all group h-44 flex items-center justify-center bg-gray-850">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <span className="px-3.5 py-2 bg-white/95 text-gray-900 rounded-xl text-xs font-semibold shadow-lg">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 text-center">
                      <Upload size={24} className="mx-auto text-gray-600 mb-1" />
                      <p className="text-xs text-gray-400">Click to upload cover photo</p>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Content *</label>
                <textarea required rows={8} value={content} onChange={(e) => setContent(e.target.value)} className="w-full bg-gray-850 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 font-sans resize-none" placeholder="Write your article details here. You can use markdown like ### Headings or bullet points..." />
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-800 justify-end">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 border border-gray-700 hover:bg-gray-800 text-gray-300 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#A8864A] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer">{loading ? <><Loader2 size={12} className="animate-spin" />Saving...</> : 'Save Post'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="font-serif text-lg text-white">Delete Blog Post?</h3>
            <p className="text-xs text-gray-400 mt-2">Are you sure you want to permanently delete this article? This action cannot be undone.</p>
            <div className="flex gap-3 mt-6 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-850 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer">Cancel</button>
              <button onClick={handleDelete} disabled={loading} className="px-4 py-2 bg-red-650 hover:bg-red-550 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1 cursor-pointer">{loading ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── TEAM TAB ───────────────────────────────────────────────────────────

interface TeamTabProps {
  team: TeamMember[];
  onAdd: (member: Omit<TeamMember, 'id' | 'createdAt'>, imageFile?: File) => Promise<boolean>;
  onUpdate: (id: string, fields: Partial<TeamMember>, imageFile?: File) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  showToast: (m: string, t: 'success' | 'error') => void;
}

function TeamTab({ team, onAdd, onUpdate, onDelete, showToast }: TeamTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddModal = () => {
    setEditingMember(null);
    setName('');
    setRole('');
    setDisplayOrder(team.length + 1);
    setImageUrl('');
    setImageFile(null);
    setImagePreview('');
    setModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setRole(member.role);
    setDisplayOrder(member.displayOrder);
    setImageUrl(member.imageUrl);
    setImageFile(null);
    setImagePreview(member.imageUrl);
    setModalOpen(true);
  };

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const r = new FileReader();
    r.onloadend = () => setImagePreview(r.result as string);
    r.readAsDataURL(file);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !role) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    setLoading(true);

    const payload = { name, role, displayOrder: Number(displayOrder), imageUrl };
    let success = false;

    if (editingMember) {
      success = await onUpdate(editingMember.id, payload, imageFile || undefined);
    } else {
      success = await onAdd(payload, imageFile || undefined);
    }

    setLoading(false);
    if (success) {
      showToast(editingMember ? 'Team member updated' : 'Team member added', 'success');
      setModalOpen(false);
    } else {
      showToast('Failed to save team member', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    const success = await onDelete(deleteId);
    setLoading(false);
    setDeleteId(null);
    if (success) {
      showToast('Team member deleted', 'success');
    } else {
      showToast('Failed to delete team member', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Users className="text-[#C5A059]" /> Our Team</h2>
          <p className="text-xs text-gray-500">Manage designers, master artisans, and showroom directors</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#b08d47] text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"><Plus size={15} /> Add Team Member</button>
      </div>

      {team.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <Users className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white">No Team Members Yet</h3>
          <p className="text-xs text-gray-500 mt-1">Add profiles of designers and master artisans.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {team.map((member) => (
            <div key={member.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden p-5 flex flex-col items-center text-center group relative">
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(member)} className="w-7 h-7 rounded-lg bg-gray-800 hover:bg-[#C5A059] text-gray-300 hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer"><Pencil size={12} /></button>
                <button onClick={() => setDeleteId(member.id)} className="w-7 h-7 rounded-lg bg-gray-800 hover:bg-red-650 text-gray-300 hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer"><Trash2 size={12} /></button>
              </div>
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 border border-gray-700 mb-4 flex items-center justify-center shadow-inner">
                {member.imageUrl ? (
                  <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#C5A059] text-2xl font-bold uppercase">{member.name.charAt(0)}</span>
                )}
              </div>
              <h3 className="font-serif text-white text-base font-semibold">{member.name}</h3>
              <p className="text-xs text-[#C5A059] font-sans mt-0.5">{member.role}</p>
              <div className="mt-3 bg-gray-800 text-[10px] text-gray-400 px-2 py-0.5 rounded-full font-sans">Order: {member.displayOrder}</div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">{editingMember ? 'Edit Team Member' : 'Add Team Member'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-white transition-all cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Full Name *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-850 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" placeholder="e.g. Master Ramesh" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Role/Designation *</label>
                <input type="text" required value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-gray-850 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" placeholder="e.g. Lead Embroiderer" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Display Order</label>
                <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} className="w-full bg-gray-850 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" placeholder="e.g. 1" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Photo</label>
                <div onClick={() => fileInputRef.current?.click()} className="relative border-2 border-dashed border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:border-gray-600 transition-all group h-36 flex items-center justify-center bg-gray-850">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <span className="px-3 py-1.5 bg-white/95 text-gray-900 rounded-lg text-xs font-semibold shadow-lg">Change Photo</span>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 text-center">
                      <Upload size={20} className="mx-auto text-gray-600 mb-1" />
                      <p className="text-xs text-gray-400">Click to upload photo</p>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-800 justify-end">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 border border-gray-700 hover:bg-gray-800 text-gray-300 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#A8864A] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer">{loading ? <><Loader2 size={12} className="animate-spin" />Saving...</> : 'Save Member'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="font-serif text-lg text-white">Remove Team Member?</h3>
            <p className="text-xs text-gray-400 mt-2">Are you sure you want to remove this team member? This action cannot be undone.</p>
            <div className="flex gap-3 mt-6 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-850 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer">Cancel</button>
              <button onClick={handleDelete} disabled={loading} className="px-4 py-2 bg-red-650 hover:bg-red-550 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1 cursor-pointer">{loading ? 'Removing...' : 'Remove'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
