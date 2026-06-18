import { Link } from 'react-router';
import { useStore } from '../store';
import { DEFAULT_TESTIMONIALS, formatPrice, CATEGORIES, getWhatsAppLink } from '../lib/siteConfig';
import { Star, MessageCircle, ArrowRight, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo, useEffect } from 'react';
import { injectJSONLD, removeJSONLD, getLocalBusinessSchema } from '../lib/seoService';

export default function Home() {
  const { products, siteSettings, isSettingsLoading } = useStore();
  
  useEffect(() => {
    if (siteSettings) {
      const schema = getLocalBusinessSchema(siteSettings);
      injectJSONLD('local-business-schema', schema);
    }
    return () => removeJSONLD('local-business-schema');
  }, [siteSettings]);

  const categoryData = useMemo(() => CATEGORIES.map((cat) => {
    const cp = products.filter((p) => p.category === cat);
    return { name: cat, count: cp.length, image: cp[0]?.imageUrl || '/images/logo.jpg' };
  }), [products]);
  const newArrivals = useMemo(() => [...products].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)).slice(0, 8), [products]);

  return (
    <div className="min-h-screen bg-[#FCEEE9]/30">
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[540px] overflow-hidden bg-gray-950">
        {!isSettingsLoading && (
          <motion.img 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
            src={siteSettings.heroImage || '/images/products/regenerated_image_1779296299562.png'} 
            alt="Rachit Creation — Luxury Lehengas" 
            className="absolute inset-0 w-full h-full object-cover" 
            fetchPriority="high"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-[#C5A059] tracking-[0.35em] uppercase text-xs sm:text-sm font-sans mb-4">Rachit Creation</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="font-serif text-white text-4xl sm:text-5xl md:text-7xl leading-tight">Discover Luxury</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.35 }} className="text-white/80 mt-4 max-w-lg text-sm sm:text-base font-sans">Exquisite handcrafted lehengas for every celebration</motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}>
            <Link to="/category/Bridal" className="mt-8 inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#b08d47] text-white font-sans text-sm tracking-wider uppercase px-8 py-3.5 rounded-full transition-colors duration-300"><span>Explore Collection</span><ArrowRight className="w-4 h-4" /></Link>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FCEEE9]/30 to-transparent" />
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <p className="text-[#C5A059] tracking-[0.3em] uppercase text-xs font-sans mb-2">Curated For You</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#3D3D3D]">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categoryData.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <Link to={`/category/${cat.name}`} className="group block">
                <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                  <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <h3 className="font-serif text-white text-xl md:text-2xl">{cat.name}</h3>
                    <p className="text-white/70 text-xs font-sans mt-1">{cat.count} {cat.count === 1 ? 'Design' : 'Designs'}</p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16 md:py-24 bg-white/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[#C5A059] tracking-[0.3em] uppercase text-xs font-sans mb-2">Just In</p>
                <h2 className="font-serif text-3xl md:text-4xl text-[#3D3D3D]">New Arrivals</h2>
              </div>
              <Link to="/category/Bridal" className="hidden sm:inline-flex items-center gap-1 text-[#C5A059] hover:text-[#b08d47] text-sm font-sans tracking-wide transition-colors">View All <ChevronRight className="w-4 h-4" /></Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible md:pb-0 scrollbar-hide">
              {newArrivals.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07 }} className="min-w-[70vw] sm:min-w-[45vw] md:min-w-0 snap-start">
                  <Link to={`/product/${product.id}`} className="group block">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md">
                      <img src={product.imageUrl} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                      {product.isSoldOut && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="border-2 border-white text-white font-serif text-xs sm:text-sm tracking-[0.25em] uppercase px-4 py-2 rounded-sm font-semibold select-none shadow-lg">Sold Out</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#C5A059] font-sans text-xs font-semibold px-3 py-1.5 rounded-full shadow">{formatPrice(product.price)}</div>
                    </div>
                    <div className="mt-3 px-1">
                      <h3 className="font-serif text-lg text-[#3D3D3D] group-hover:text-[#C5A059] transition-colors line-clamp-1">{product.name}</h3>
                      <p className="text-[#3D3D3D]/50 text-xs font-sans mt-0.5">{product.category}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <p className="text-[#C5A059] tracking-[0.3em] uppercase text-xs font-sans mb-2">Love Letters</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#3D3D3D]">What Our Brides Say</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DEFAULT_TESTIMONIALS.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="bg-white rounded-2xl p-6 shadow-sm border border-[#C5A059]/10 hover:shadow-md transition-shadow">
              <div className="flex gap-0.5 mb-3">{Array.from({ length: t.rating }).map((_, idx) => <Star key={idx} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />)}</div>
              <p className="text-[#3D3D3D]/80 text-sm font-sans leading-relaxed mb-4">"{t.text}"</p>
              <div><p className="font-serif text-[#3D3D3D] text-base font-semibold">{t.name}</p><p className="text-[#3D3D3D]/50 text-xs font-sans">{t.location}</p></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WhatsApp FAB */}
      <a href={getWhatsAppLink(siteSettings.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110" aria-label="Chat on WhatsApp"><MessageCircle className="w-6 h-6" /></a>
    </div>
  );
}
