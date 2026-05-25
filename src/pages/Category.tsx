import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { useStore } from '../store';
import { formatPrice } from '../lib/siteConfig';
import { motion } from 'motion/react';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'name-asc';
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name-asc', label: 'Name: A → Z' },
];

export default function Category() {
  const { type } = useParams<{ type: string }>();
  const { products, isLoading } = useStore();
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const categoryName = type || 'All';

  const filtered = useMemo(() => {
    const base = products.filter((p) => p.category.toLowerCase() === categoryName.toLowerCase());
    const sorted = [...base];
    switch (sortBy) {
      case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
      case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
      case 'name-asc': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: sorted.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    }
    return sorted;
  }, [products, categoryName, sortBy]);

  return (
    <div className="min-h-screen bg-[#FCEEE9]/30">
      <div className="bg-gradient-to-b from-[#FCEEE9] to-white border-b border-[#C5A059]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <nav className="flex items-center gap-1 text-xs font-sans text-[#3D3D3D]/50 mb-4"><Link to="/" className="hover:text-[#C5A059] transition-colors">Home</Link><ChevronRight className="w-3 h-3" /><span className="text-[#3D3D3D]">{categoryName}</span></nav>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-[#3D3D3D]">{categoryName} Collection</h1>
              <p className="text-[#3D3D3D]/50 text-sm font-sans mt-1">{filtered.length} {filtered.length === 1 ? 'design' : 'designs'} available</p>
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#3D3D3D]/40" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)} className="bg-white border border-[#C5A059]/20 text-[#3D3D3D] text-sm font-sans rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 cursor-pointer">
                {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#FCEEE9] flex items-center justify-center mb-5"><SlidersHorizontal className="w-8 h-8 text-[#C5A059]" /></div>
            <h2 className="font-serif text-2xl text-[#3D3D3D] mb-2">No Designs Yet</h2>
            <p className="text-[#3D3D3D]/50 text-sm font-sans mb-6">We're curating the {categoryName} collection. Check back soon!</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#b08d47] text-white text-sm font-sans tracking-wider uppercase px-6 py-3 rounded-full transition-colors">Back to Home</Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                <Link to={`/product/${product.id}`} className="group block">
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md bg-white">
                    <img src={product.imageUrl} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {product.isSoldOut && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="border-2 border-white text-white font-serif text-xs sm:text-sm tracking-[0.25em] uppercase px-4 py-2 rounded-sm font-semibold select-none shadow-lg">Sold Out</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#C5A059] font-sans text-xs font-semibold px-3 py-1 rounded-full shadow">{formatPrice(product.price)}</div>
                    <div className="absolute bottom-3 left-3 bg-[#C5A059]/90 backdrop-blur-sm text-white font-sans text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full">{product.category}</div>
                  </motion.div>
                  <div className="mt-3 px-1">
                    <h3 className="font-serif text-base md:text-lg text-[#3D3D3D] group-hover:text-[#C5A059] transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-[#C5A059] font-sans text-sm font-semibold mt-0.5">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
