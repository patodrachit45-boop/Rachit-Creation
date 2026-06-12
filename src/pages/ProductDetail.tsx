import { useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { useStore, useWishlistStore } from '../store';
import { formatPrice, getWhatsAppOrderLink } from '../lib/siteConfig';
import { Heart, ShoppingBag, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { injectJSONLD, removeJSONLD, getProductSchema, getBreadcrumbSchema } from '../lib/seoService';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { products, siteSettings } = useStore();
  const { wishlistIds, toggleWishlist } = useWishlistStore();
  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);
  
  useEffect(() => {
    if (product && siteSettings) {
      const productSchema = getProductSchema(product, siteSettings);
      const breadcrumbSchema = getBreadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: product.category, item: `/category/${product.category}` },
        { name: product.name, item: `/product/${product.id}` }
      ]);
      injectJSONLD('product-schema', productSchema);
      injectJSONLD('product-breadcrumb-schema', breadcrumbSchema);
    }
    return () => {
      removeJSONLD('product-schema');
      removeJSONLD('product-breadcrumb-schema');
    };
  }, [product, siteSettings]);

  const isWishlisted = product ? wishlistIds.includes(product.id) : false;
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [products, product]);
  const highlights = useMemo(() => {
    if (!product?.highlights) return [];
    return product.highlights.split('\n').map((h) => h.trim()).filter(Boolean);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FCEEE9]/30 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-[#3D3D3D] mb-3">Product Not Found</h1>
          <p className="text-[#3D3D3D]/50 text-sm font-sans mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#b08d47] text-white text-sm font-sans tracking-wider uppercase px-6 py-3 rounded-full transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCEEE9]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-1 text-xs font-sans text-[#3D3D3D]/50 flex-wrap">
          <Link to="/" className="hover:text-[#C5A059] transition-colors">Home</Link><ChevronRight className="w-3 h-3 shrink-0" />
          <Link to={`/category/${product.category}`} className="hover:text-[#C5A059] transition-colors">{product.category}</Link><ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-[#3D3D3D] line-clamp-1">{product.name}</span>
        </nav>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-white group cursor-zoom-in relative">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              {product.isSoldOut && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="border-2 border-white text-white font-serif text-sm tracking-[0.25em] uppercase px-6 py-3 rounded-sm font-semibold select-none shadow-lg">Sold Out</span>
                </div>
              )}
            </div>
            <button onClick={() => toggleWishlist(product.id)} className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-transform hover:scale-110" aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
              <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-[#3D3D3D]/40 hover:text-red-400'}`} />
            </button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col">
            <span className="inline-block self-start bg-[#FCEEE9] text-[#C5A059] text-xs font-sans tracking-wider uppercase px-3 py-1 rounded-full mb-4">{product.category}</span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3D3D3D] leading-tight">{product.name}</h1>
            <div className="mt-4 inline-flex self-start items-center bg-gradient-to-r from-[#C5A059] to-[#d4b56e] text-white font-sans text-lg md:text-xl font-semibold px-5 py-2 rounded-full shadow">{formatPrice(product.price)}</div>
            <p className="mt-6 text-[#3D3D3D]/70 font-sans text-sm md:text-base leading-relaxed">{product.description}</p>
            {highlights.length > 0 && (
              <div className="mt-6">
                <h3 className="font-serif text-lg text-[#3D3D3D] mb-3">Highlights</h3>
                <ul className="space-y-2">{highlights.map((h, i) => <li key={i} className="flex items-start gap-2 text-sm font-sans text-[#3D3D3D]/70"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0" />{h}</li>)}</ul>
              </div>
            )}

            {/* Atelier Quick Facts (GEO / Structured Retrieval Grid) */}
            <div className="mt-8 border border-[#C5A059]/15 rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="font-serif text-xs text-[#3D3D3D] mb-4 font-semibold tracking-wider uppercase text-center border-b border-[#C5A059]/10 pb-2">{siteSettings?.quickFactsTitle || 'Atelier Quick Facts'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs font-sans">
                <div className="flex justify-between border-b border-[#C5A059]/5 pb-2">
                  <span className="text-[#3D3D3D]/50 uppercase tracking-wider">Category</span>
                  <span className="text-[#3D3D3D] font-medium">{product.category} Lehenga</span>
                </div>
                <div className="flex justify-between border-b border-[#C5A059]/5 pb-2">
                  <span className="text-[#3D3D3D]/50 uppercase tracking-wider">{siteSettings?.labelCraftingTime || 'Crafting Time'}</span>
                  <span className="text-[#3D3D3D] font-medium">{product.craftingTime || siteSettings?.defaultCraftingTime || '4 - 8 Weeks'}</span>
                </div>
                <div className="flex justify-between border-b border-[#C5A059]/5 pb-2">
                  <span className="text-[#3D3D3D]/50 uppercase tracking-wider">{siteSettings?.labelOrigin || 'Origin'}</span>
                  <span className="text-[#3D3D3D] font-medium">{product.origin || siteSettings?.defaultOrigin || 'Surat, Gujarat, India'}</span>
                </div>
                <div className="flex justify-between border-b border-[#C5A059]/5 pb-2">
                  <span className="text-[#3D3D3D]/50 uppercase tracking-wider">{siteSettings?.labelCustomization || 'Customization'}</span>
                  <span className="text-[#C5A059] font-semibold">{product.customization || siteSettings?.defaultCustomization || 'Available on Request'}</span>
                </div>
                <div className="flex justify-between border-b border-[#C5A059]/5 pb-2 sm:border-0 sm:pb-0">
                  <span className="text-[#3D3D3D]/50 uppercase tracking-wider">{siteSettings?.labelEmbroidery || 'Embroidery Handwork'}</span>
                  <span className="text-[#3D3D3D] font-medium truncate max-w-[150px]" title={product.embroidery || siteSettings?.defaultEmbroidery || 'Zari, Zardozi, Resham & Stones'}>{product.embroidery || siteSettings?.defaultEmbroidery || 'Zari, Zardozi, Resham & Stones'}</span>
                </div>
                <div className="flex justify-between pb-0">
                  <span className="text-[#3D3D3D]/50 uppercase tracking-wider">{siteSettings?.labelShipping || 'Shipping'}</span>
                  <span className="text-[#3D3D3D] font-medium">{product.shipping || siteSettings?.defaultShipping || 'Worldwide Express Delivery'}</span>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {product.isSoldOut ? (
                <a href={getWhatsAppOrderLink(siteSettings.whatsappNumber, `${product.name} (Inquire Availability - Sold Out)`, product.price)} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-[#b08d47] text-white font-sans text-sm tracking-wider uppercase px-6 py-3.5 rounded-full transition-colors shadow-md"><ShoppingBag className="w-4 h-4" /> Inquire Availability (Sold Out)</a>
              ) : (
                <a href={getWhatsAppOrderLink(siteSettings.whatsappNumber, product.name, product.price)} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-sans text-sm tracking-wider uppercase px-6 py-3.5 rounded-full transition-colors shadow-md"><ShoppingBag className="w-4 h-4" /> Order on WhatsApp</a>
              )}
              <button onClick={() => toggleWishlist(product.id)} className={`inline-flex items-center justify-center gap-2 font-sans text-sm tracking-wider uppercase px-6 py-3.5 rounded-full border-2 transition-colors ${isWishlisted ? 'border-red-400 text-red-500 bg-red-50 hover:bg-red-100' : 'border-[#C5A059]/30 text-[#C5A059] hover:bg-[#FCEEE9]'}`}>
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} /> {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="border-t border-[#C5A059]/10 pt-12">
            <h2 className="font-serif text-2xl md:text-3xl text-[#3D3D3D] mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((rp, i) => (
                <motion.div key={rp.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                  <Link to={`/product/${rp.id}`} className="group block">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md bg-white">
                      <img src={rp.imageUrl} alt={rp.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      {rp.isSoldOut && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="border-2 border-white text-white font-serif text-xs tracking-[0.2em] uppercase px-3 py-1.5 rounded-sm font-semibold select-none shadow-lg">Sold Out</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#C5A059] font-sans text-xs font-semibold px-3 py-1 rounded-full shadow">{formatPrice(rp.price)}</div>
                    </div>
                    <div className="mt-3 px-1">
                      <h3 className="font-serif text-base text-[#3D3D3D] group-hover:text-[#C5A059] transition-colors line-clamp-1">{rp.name}</h3>
                      <p className="text-[#C5A059] font-sans text-sm font-semibold mt-0.5">{formatPrice(rp.price)}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
