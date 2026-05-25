import { Link } from 'react-router';
import { useStore } from '../store';
import { getWhatsAppLink } from '../lib/siteConfig';
import { Instagram, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

const categories = ['Bridal', 'Designer', 'Girlish', 'Heavy'] as const;

export default function Footer() {
  const { siteSettings } = useStore();
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <img src={siteSettings.logoImage || '/images/logo.jpg'} alt="Rachit Creation" className="w-11 h-11 rounded-full object-cover ring-1 ring-[#C5A059]/40 group-hover:ring-[#C5A059] transition-all" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <span className="font-serif text-xl tracking-[0.1em] uppercase text-white">Rachit <span className="font-semibold">Creation</span></span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">Crafting exquisite lehengas that blend timeless tradition with modern elegance. Every piece tells a story of artistry and passion.</p>
          </div>
          <div>
            <h4 className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#C5A059] mb-5 font-semibold">Collections</h4>
            <ul className="space-y-3">
              {categories.map((cat) => <li key={cat}><Link to={`/category/${cat}`} className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors inline-block">{cat} Lehenga</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#C5A059] mb-5 font-semibold">Quick Links</h4>
            <ul className="space-y-3">
              {[{ label: 'Home', to: '/' }, { label: 'About Us', to: '/about' }, { label: 'Contact', to: '/contact' }, { label: 'Wishlist', to: '/wishlist' }].map((l) => <li key={l.to}><Link to={l.to} className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors inline-block">{l.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#C5A059] mb-5 font-semibold">Connect With Us</h4>
            <div className="space-y-4">
              <a href={getWhatsAppLink(siteSettings.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 bg-[#25D366]/10 border border-[#25D366]/20 rounded-lg text-[#25D366] hover:bg-[#25D366]/20 transition-colors text-sm"><MessageCircle className="w-4 h-4 shrink-0" /><span className="text-xs uppercase tracking-wider font-medium">WhatsApp Us</span></a>
              {siteSettings.instagramUrl && <a href={siteSettings.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-[#E1306C] transition-colors"><Instagram className="w-4 h-4" /><span className="text-sm">Instagram</span></a>}
              {siteSettings.email && <a href={`mailto:${siteSettings.email}`} className="flex items-center gap-3 text-gray-400 hover:text-[#C5A059] transition-colors"><Mail className="w-4 h-4" /><span className="text-sm break-all">{siteSettings.email}</span></a>}
              {siteSettings.phone && <a href={`tel:${siteSettings.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-gray-400 hover:text-[#C5A059] transition-colors"><Phone className="w-4 h-4" /><span className="text-sm">{siteSettings.phone}</span></a>}
              {siteSettings.address && <div className="flex items-start gap-3 text-gray-400"><MapPin className="w-4 h-4 shrink-0 mt-0.5" /><span className="text-sm leading-relaxed">{siteSettings.address}</span></div>}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 tracking-wide">&copy; {new Date().getFullYear()} RACHIT CREATION. All rights reserved.</p>
          <p className="text-xs text-gray-600 tracking-wide">Crafted with <span className="text-[#C5A059]">&hearts;</span> in Surat, India</p>
        </div>
      </div>
    </footer>
  );
}
