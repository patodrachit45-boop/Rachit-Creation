import { Link } from 'react-router';
import { useStore } from '../store';
import { DEFAULT_TESTIMONIALS, formatPrice, CATEGORIES, getWhatsAppLink, getWhatsAppOrderLink } from '../lib/siteConfig';
import { Star, MessageCircle, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo, useEffect, useState } from 'react';
import { injectJSONLD, removeJSONLD, getLocalBusinessSchema, getBreadcrumbSchema } from '../lib/seoService';

export default function Home() {
  const { products, siteSettings, isSettingsLoading } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    if (siteSettings) {
      const schema = getLocalBusinessSchema(siteSettings);
      injectJSONLD('local-business-schema', schema);
    }
    const breadcrumbSchema = getBreadcrumbSchema([
      { name: 'Home', item: '/' },
      { name: 'Saree Collection', item: '/#sarees' }
    ]);
    injectJSONLD('home-breadcrumb-schema', breadcrumbSchema);

    return () => {
      removeJSONLD('local-business-schema');
      removeJSONLD('home-breadcrumb-schema');
    };
  }, [siteSettings]);

  // Filter products by selected category
  const filteredSarees = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [products, selectedCategory]);

  // Active category list that actually exists in products or default categories
  const filterTabs = useMemo(() => {
    const presentCats = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
    const tabs = ['All'];
    if (presentCats.length > 0) {
      tabs.push(...presentCats);
    } else {
      tabs.push('Saree', 'Silk Saree', 'Bridal Saree', 'Designer Saree');
    }
    return tabs;
  }, [products]);

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
            alt={siteSettings.heroImageAlt || "Rachit Creation — Luxury Sarees"} 
            className="absolute inset-0 w-full h-full object-cover" 
            fetchPriority="high"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-[#C5A059] tracking-[0.35em] uppercase text-xs sm:text-sm font-sans mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A059]" /> Rachit Creation <Sparkles className="w-4 h-4 text-[#C5A059]" />
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="font-serif text-white text-4xl sm:text-5xl md:text-7xl leading-tight">
            Discover Luxury Sarees
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.35 }} className="text-white/80 mt-4 max-w-lg text-sm sm:text-base font-sans">
            Exquisite handcrafted bridal & designer sarees woven for your timeless moments
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }} className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <a href="#sarees" className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#b08d47] text-white font-sans text-sm tracking-wider uppercase px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
              <span>Explore Sarees</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FCEEE9]/30 to-transparent" />
      </section>

      {/* Saree Section */}
      <section id="sarees" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 scroll-mt-20">
        <div className="text-center mb-10">
          <p className="text-[#C5A059] tracking-[0.3em] uppercase text-xs font-sans mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> Artisan Handcrafted <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-[#3D3D3D]">Saree Collection</h2>
          <p className="text-[#3D3D3D]/60 text-sm font-sans mt-3 max-w-xl mx-auto">
            From heritage Banarasi silks to bespoke bridal weaves, immerse yourself in our signature handloom creations.
          </p>
        </div>

        {/* Category Filter Pills (shown when products exist) */}
        {products.length > 0 && filterTabs.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedCategory(tab)}
                className={`px-4 sm:px-6 py-2 rounded-full text-xs font-sans uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedCategory === tab
                    ? 'bg-[#C5A059] text-white shadow-md'
                    : 'bg-white text-[#3D3D3D]/70 hover:text-[#C5A059] hover:bg-white/80 border border-[#C5A059]/20'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Products Display: strictly displays only uploaded products; if 0 products, shows zero product cards */}
        {products.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-10 md:p-16 text-center max-w-2xl mx-auto border border-[#C5A059]/15 shadow-sm"
          >
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#FCEEE9] flex items-center justify-center text-[#C5A059]">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-[#3D3D3D] mb-3">
              New Saree Collection Launching Soon
            </h3>
            <p className="text-[#3D3D3D]/65 text-sm font-sans leading-relaxed mb-8 max-w-md mx-auto">
              Our master artisans are curating brand-new handwoven sarees. Have a custom design or specific weave in mind? Contact us directly on WhatsApp.
            </p>
            <a
              href={getWhatsAppLink(siteSettings.whatsappNumber, 'Hi! I would like to inquire about your upcoming saree collection.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#C5A059] hover:bg-[#b08d47] text-white text-xs uppercase tracking-widest px-8 py-4 rounded-full font-medium transition-all shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-4 h-4" /> Inquire on WhatsApp
            </a>
          </motion.div>
        ) : filteredSarees.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm font-sans">No sarees found in this category.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-3 text-xs uppercase tracking-wider text-[#C5A059] font-semibold underline hover:text-[#b08d47] cursor-pointer"
            >
              View all sarees
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredSarees.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
              >
                <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#C5A059]/10 flex flex-col h-full">
                  <Link to={`/product/${product.id}`} className="relative aspect-[3/4] overflow-hidden bg-gray-100 block">
                    <img
                      src={product.imageUrl}
                      alt={product.imageAlt || product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    {product.isSoldOut && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="border-2 border-white text-white font-serif text-xs tracking-[0.25em] uppercase px-4 py-2 rounded-sm font-semibold select-none shadow-lg">
                          Sold Out
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[#C5A059] font-sans text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                      {formatPrice(product.price)}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white font-sans text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md">
                      {product.category}
                    </div>
                  </Link>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-serif text-base sm:text-lg text-[#3D3D3D] group-hover:text-[#C5A059] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-[#3D3D3D]/50 text-xs font-sans mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <span className="font-serif text-base font-semibold text-[#3D3D3D]">
                        {formatPrice(product.price)}
                      </span>
                      <a
                        href={getWhatsAppOrderLink(siteSettings.whatsappNumber, product.name, product.price)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm"
                        aria-label={`Order ${product.name} on WhatsApp`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Order</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <p className="text-[#C5A059] tracking-[0.3em] uppercase text-xs font-sans mb-2">Love Letters</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#3D3D3D]">What Our Clients Say</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DEFAULT_TESTIMONIALS.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="bg-white rounded-2xl p-6 shadow-sm border border-[#C5A059]/10 hover:shadow-md transition-shadow" itemScope itemType="https://schema.org/Review">
              <div className="flex gap-0.5 mb-3" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                <meta itemProp="ratingValue" content={String(t.rating)} />
                <meta itemProp="bestRating" content="5" />
                {Array.from({ length: t.rating }).map((_, idx) => <Star key={idx} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />)}
              </div>
              <div className="hidden" itemProp="itemReviewed" itemScope itemType="https://schema.org/LocalBusiness">
                <meta itemProp="name" content="Rachit Creation" />
                <meta itemProp="image" content="https://raccreation.com/images/logo.webp" />
                <meta itemProp="telephone" content={siteSettings.phone} />
                <meta itemProp="address" content={siteSettings.address} />
              </div>
              <p className="text-[#3D3D3D]/80 text-sm font-sans leading-relaxed mb-4" itemProp="reviewBody">"{t.text}"</p>
              <div>
                <p className="font-serif text-[#3D3D3D] text-base font-semibold" itemProp="author" itemScope itemType="https://schema.org/Person">
                  <span itemProp="name">{t.name}</span>
                </p>
                <p className="text-[#3D3D3D]/50 text-xs font-sans">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WhatsApp FAB */}
      <a href={getWhatsAppLink(siteSettings.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110" aria-label="Chat on WhatsApp"><MessageCircle className="w-6 h-6" /></a>
    </div>
  );
}
