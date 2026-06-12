import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { useStore } from '../store';
import { getWhatsAppLink } from '../lib/siteConfig';
import { Instagram, MessageCircle, Mail, Phone, MapPin, Twitter, Facebook } from 'lucide-react';

const categories = ['Bridal', 'Designer', 'Girlish', 'Heavy'] as const;

export default function Footer() {
  const { siteSettings } = useStore();
  const [logoError, setLogoError] = useState(false);

  useEffect(() => { setLogoError(false); }, [siteSettings.logoImage]);

  const parsedBacklinks = useMemo(() => {
    if (!siteSettings.backlinksText) return [];
    return siteSettings.backlinksText
      .split('\n')
      .map((line) => {
        const parts = line.split('|');
        if (parts.length >= 2) {
          return { anchor: parts[0].trim(), url: parts[1].trim() };
        }
        return null;
      })
      .filter(Boolean) as { anchor: string; url: string }[];
  }, [siteSettings.backlinksText]);

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              {!logoError && (
                <img src={siteSettings.logoImage || '/images/logo.jpg'} alt="Rachit Creation" className="w-11 h-11 rounded-full object-cover ring-1 ring-[#C5A059]/40 group-hover:ring-[#C5A059] transition-all" onError={() => setLogoError(true)} />
              )}
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
              {[
                { label: 'Home', to: '/' },
                { label: 'About Us', to: '/about' },
                { label: 'Blogs', to: '/blog' },
                { label: 'Contact', to: '/contact' },
                { label: 'Wishlist', to: '/wishlist' }
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors inline-block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#C5A059] mb-5 font-semibold">Connect With Us</h4>
            <div className="space-y-4">
              <a href={getWhatsAppLink(siteSettings.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 bg-[#25D366]/10 border border-[#25D366]/20 rounded-lg text-[#25D366] hover:bg-[#25D366]/20 transition-colors text-sm"><MessageCircle className="w-4 h-4 shrink-0" /><span className="text-xs uppercase tracking-wider font-medium">WhatsApp Us</span></a>
              {siteSettings.instagramUrl && <a href={siteSettings.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-[#E1306C] transition-colors"><Instagram className="w-4 h-4" /><span className="text-sm">Instagram</span></a>}
              {siteSettings.facebookUrl && <a href={siteSettings.facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-[#1877F2] transition-colors"><Facebook className="w-4 h-4" /><span className="text-sm">Facebook</span></a>}
              {siteSettings.twitterUrl && <a href={siteSettings.twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-[#1DA1F2] transition-colors"><Twitter className="w-4 h-4" /><span className="text-sm">Twitter (X)</span></a>}
              {siteSettings.pinterestUrl && (
                <a href={siteSettings.pinterestUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-[#BD081C] transition-colors">
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.002 2C6.479 2 2 6.479 2 12.002c0 4.225 2.622 7.839 6.326 9.317-.088-.79-.166-2.003.034-2.868.181-.78 1.165-4.938 1.165-4.938s-.297-.595-.297-1.476c0-1.383.801-2.415 1.8-2.415.849 0 1.258.637 1.258 1.402 0 .853-.543 2.129-.823 3.31-.234.99.497 1.796 1.472 1.796 1.767 0 3.125-1.864 3.125-4.555 0-2.381-1.711-4.047-4.156-4.047-2.83 0-4.49 2.122-4.49 4.316 0 .855.33 1.77.741 2.271a.3.3 0 01.069.287l-.274 1.12c-.044.183-.146.223-.338.135-1.263-.588-2.054-2.435-2.054-3.918 0-3.19 2.317-6.12 6.682-6.12 3.508 0 6.233 2.499 6.233 5.84 0 3.486-2.198 6.294-5.25 6.294-1.025 0-1.99-.533-2.32-1.16l-.63 2.399c-.228.877-.843 1.979-1.257 2.648 1.126.348 2.32.535 3.558.535 6.523 0 11.802-5.279 11.802-11.802C23.804 6.479 18.525 2 12.002 2z"/>
                  </svg>
                  <span className="text-sm">Pinterest</span>
                </a>
              )}
              {siteSettings.email && <a href={`mailto:${siteSettings.email}`} className="flex items-center gap-3 text-gray-400 hover:text-[#C5A059] transition-colors"><Mail className="w-4 h-4" /><span className="text-sm break-all">{siteSettings.email}</span></a>}
              {siteSettings.phone && <a href={`tel:${siteSettings.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-gray-400 hover:text-[#C5A059] transition-colors"><Phone className="w-4 h-4" /><span className="text-sm">{siteSettings.phone}</span></a>}
              {siteSettings.address && <div className="flex items-start gap-3 text-gray-400"><MapPin className="w-4 h-4 shrink-0 mt-0.5" /><span className="text-sm leading-relaxed">{siteSettings.address}</span></div>}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2.5">
            <p className="text-xs text-gray-500 tracking-wide">
              &copy; {new Date().getFullYear()}{' '}
              <a href="https://raccreation.com/" className="hover:text-[#C5A059] transition-colors">
                RACHIT CREATION
              </a>
              . All rights reserved.
            </p>
            {parsedBacklinks.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-gray-500">
                {parsedBacklinks.map((link, idx) => (
                  <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A059] transition-colors">
                    {link.anchor}
                  </a>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 tracking-wide md:text-right">
            Crafted with <span className="text-[#C5A059]">&hearts;</span> in{' '}
            <a href="https://raccreation.com/" className="hover:text-[#C5A059] transition-colors">
              Surat, India
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
