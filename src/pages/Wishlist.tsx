import { Link } from 'react-router';
import { useStore, useWishlistStore } from '../store';
import { formatPrice, getWhatsAppOrderLink } from '../lib/siteConfig';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo } from 'react';

export default function Wishlist() {
  const { products, siteSettings } = useStore();
  const { wishlistIds, toggleWishlist } = useWishlistStore();
  const wishlistProducts = useMemo(() => products.filter((p) => wishlistIds.includes(p.id)), [products, wishlistIds]);

  return (
    <div className="min-h-screen bg-[#FCEEE9]/30">
      <div className="bg-gradient-to-b from-[#FCEEE9] to-white border-b border-[#C5A059]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <nav className="flex items-center gap-1 text-xs font-sans text-[#3D3D3D]/50 mb-4"><Link to="/" className="hover:text-[#C5A059] transition-colors">Home</Link><span className="text-[#3D3D3D]/30">/</span><span className="text-[#3D3D3D]">Wishlist</span></nav>
          <h1 className="font-serif text-3xl md:text-4xl text-[#3D3D3D]">My Wishlist</h1>
          <p className="text-[#3D3D3D]/50 text-sm font-sans mt-1">{wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {wishlistProducts.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#FCEEE9] flex items-center justify-center mb-5"><Heart className="w-8 h-8 text-[#C5A059]" /></div>
            <h2 className="font-serif text-2xl text-[#3D3D3D] mb-2">Your Wishlist is Empty</h2>
            <p className="text-[#3D3D3D]/50 text-sm font-sans mb-6 max-w-sm mx-auto">Browse our exquisite collections and save the designs you love.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#b08d47] text-white text-sm font-sans tracking-wider uppercase px-6 py-3 rounded-full transition-colors"><ArrowLeft className="w-4 h-4" /> Explore Collections</Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.06 }} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#C5A059]/10 hover:shadow-md transition-shadow">
                <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden group">
                  <img src={product.imageUrl} alt={product.imageAlt || product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                  {product.isSoldOut && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="border-2 border-white text-white font-serif text-xs sm:text-sm tracking-[0.25em] uppercase px-4 py-2 rounded-sm font-semibold select-none shadow-lg">Sold Out</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#C5A059] font-sans text-xs font-semibold px-3 py-1 rounded-full shadow">{formatPrice(product.price)}</div>
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product.id}`}><h3 className="font-serif text-lg text-[#3D3D3D] hover:text-[#C5A059] transition-colors line-clamp-1">{product.name}</h3></Link>
                  <p className="text-[#C5A059] font-sans text-sm font-semibold mt-1">{formatPrice(product.price)}</p>
                  <div className="flex gap-2 mt-4">
                    {product.isSoldOut ? (
                      <a href={getWhatsAppOrderLink(siteSettings.whatsappNumber, `${product.name} (Inquire Availability)`, product.price)} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#C5A059] hover:bg-[#b08d47] text-white font-sans text-[10px] tracking-wider uppercase px-2 py-2.5 rounded-full transition-colors"><ShoppingBag className="w-3.5 h-3.5" /> Inquire</a>
                    ) : (
                      <a href={getWhatsAppOrderLink(siteSettings.whatsappNumber, product.name, product.price)} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-sans text-xs tracking-wider uppercase px-3 py-2.5 rounded-full transition-colors"><ShoppingBag className="w-3.5 h-3.5" /> Order</a>
                    )}
                    <button onClick={() => toggleWishlist(product.id)} className="inline-flex items-center justify-center gap-1.5 border-2 border-red-300 text-red-500 hover:bg-red-50 font-sans text-xs tracking-wider uppercase px-3 py-2.5 rounded-full transition-colors"><Heart className="w-3.5 h-3.5 fill-red-500" /> Remove</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
