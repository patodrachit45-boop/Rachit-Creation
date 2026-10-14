import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useStore, useWishlistStore } from '../store';
import { getWhatsAppLink } from '../lib/siteConfig';
import { Menu, X, Heart, MessageCircle } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { siteSettings } = useStore();
  const wishlistCount = useWishlistStore((s) => s.wishlistIds.length);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => { setLogoError(false); }, [siteSettings.logoImage]);

  useEffect(() => { setIsOpen(false); }, [location.pathname, location.hash]);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-18 sm:h-20 px-4 sm:px-6 lg:px-10">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            {!logoError && (
              <img 
                src={siteSettings.logoImage || '/images/logo.webp'} 
                srcSet={`${siteSettings.logoImage || '/images/logo.webp'} 1x, ${siteSettings.logoImage || '/images/logo.webp'} 2x`} 
                alt="Rachit Creation" 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-1 ring-[#C5A059]/30 group-hover:ring-[#C5A059] transition-all" 
                onError={() => setLogoError(true)} 
                fetchPriority="high" 
                decoding="async" 
                width="44" 
                height="44" 
              />
            )}
            <span className="font-serif text-base sm:text-xl tracking-[0.1em] sm:tracking-[0.12em] uppercase text-[#3D3D3D]">
              Rachit <span className="font-semibold">Creation</span>
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-8 text-[11px] font-sans uppercase tracking-[0.18em] text-[#3D3D3D]/70">
            <a href="/#sarees" className="hover:text-[#C5A059] transition-colors">Sarees</a>
            <Link to="/about" className="hover:text-[#C5A059] transition-colors">The Story</Link>
            <Link to="/blog" className="hover:text-[#C5A059] transition-colors">Blogs</Link>
            <Link to="/contact#faqs" className="hover:text-[#C5A059] transition-colors">FAQs</Link>
            <Link to="/contact" className="hover:text-[#C5A059] transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/wishlist" className="relative p-2 text-[#3D3D3D]/70 hover:text-[#C5A059] transition-colors" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center bg-[#C5A059] text-white text-[9px] font-bold rounded-full min-w-[18px] min-h-[18px]">{wishlistCount > 9 ? '9+' : wishlistCount}</span>}
            </Link>
            <a href={getWhatsAppLink(siteSettings.whatsappNumber, 'Hi! I would like to inquire about your saree collection.')} target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 border border-[#C5A059] text-[#C5A059] px-5 py-2 text-[10px] uppercase tracking-[0.18em] hover:bg-[#C5A059] hover:text-white transition-all rounded-sm">
              <MessageCircle className="w-3.5 h-3.5" /> Inquire
            </a>
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-[#3D3D3D] hover:text-[#C5A059] transition-colors" aria-label={isOpen ? 'Close menu' : 'Open menu'}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsOpen(false)} />
        <div className={`absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between h-18 px-6 border-b border-gray-100">
            <span className="font-serif text-lg tracking-[0.1em] uppercase text-[#3D3D3D]">Menu</span>
            <button onClick={() => setIsOpen(false)} className="p-2 text-[#3D3D3D] hover:text-[#C5A059]"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex flex-col px-6 py-8 gap-1 overflow-y-auto h-[calc(100%-4.5rem)]">
            <a href="/#sarees" onClick={() => setIsOpen(false)} className="py-3 text-[12px] uppercase tracking-[0.18em] text-[#3D3D3D] hover:text-[#C5A059] transition-colors">
              Sarees
            </a>
            <div className="w-full h-px bg-gray-100 my-2" />
            <Link to="/about" className="py-3 text-[12px] uppercase tracking-[0.18em] text-[#3D3D3D] hover:text-[#C5A059]">The Story</Link>
            <Link to="/blog" className="py-3 text-[12px] uppercase tracking-[0.18em] text-[#3D3D3D] hover:text-[#C5A059]">Blogs</Link>
            <Link to="/contact#faqs" className="py-3 text-[12px] uppercase tracking-[0.18em] text-[#3D3D3D] hover:text-[#C5A059]">FAQs</Link>
            <Link to="/contact" className="py-3 text-[12px] uppercase tracking-[0.18em] text-[#3D3D3D] hover:text-[#C5A059]">Contact</Link>
            <Link to="/wishlist" className="py-3 text-[12px] uppercase tracking-[0.18em] text-[#3D3D3D] hover:text-[#C5A059] flex items-center gap-3">
              <Heart className="w-4 h-4" /> Wishlist {wishlistCount > 0 && <span className="bg-[#C5A059] text-white text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{wishlistCount}</span>}
            </Link>
            <div className="w-full h-px bg-gray-100 my-2" />
            <a href={getWhatsAppLink(siteSettings.whatsappNumber, 'Hi! I would like to inquire about your saree collection.')} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2.5 bg-[#C5A059] text-white py-3.5 rounded-md text-[11px] uppercase tracking-[0.18em] font-medium hover:bg-[#b08d47] transition-colors">
              <MessageCircle className="w-4 h-4" /> Inquire on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
