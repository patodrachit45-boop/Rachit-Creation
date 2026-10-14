import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { SiteSettings } from '../lib/siteConfig';
import { getWhatsAppLink } from '../lib/siteConfig';
import { MessageCircle, Phone, Instagram, Sparkles, Wrench, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface MaintenanceScreenProps {
  siteSettings: SiteSettings;
}

export default function MaintenanceScreen({ siteSettings }: MaintenanceScreenProps) {
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLogoError(false);
  }, [siteSettings.logoImage]);

  const whatsappUrl = getWhatsAppLink(
    siteSettings.whatsappNumber,
    'Hello Rachit Creation, I am inquiring while the website is currently under maintenance.'
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden selection:bg-[#C5A059] selection:text-white">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3 pt-4 z-10"
      >
        {!logoError && (
          <img
            src={siteSettings.logoImage || '/images/logo.webp'}
            alt="Rachit Creation"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#C5A059]/40 shadow-lg"
            onError={() => setLogoError(true)}
            width="48"
            height="48"
          />
        )}
        <div className="text-left">
          <span className="font-serif text-lg tracking-[0.15em] uppercase text-white block leading-tight">
            Rachit <span className="text-[#C5A059] font-semibold">Creation</span>
          </span>
          <span className="text-[10px] tracking-[0.25em] uppercase text-white/50 font-sans block">
            Surat, Gujarat
          </span>
        </div>
      </motion.div>

      {/* Center Maintenance Message Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="w-full max-w-xl mx-auto my-auto z-10 text-center py-8"
      >
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] text-xs font-sans uppercase tracking-[0.2em] font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Under Maintenance</span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-tight mb-4">
          We Are Updating Our Collections
        </h1>

        {/* Message */}
        <p className="text-white/70 font-sans text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8">
          {siteSettings.maintenanceMessage ||
            'We are currently curating our exclusive new Saree Collection and updating the website. Public browsing is temporarily paused, but our artisans remain at your service directly.'}
        </p>

        {/* Contact CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-7 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xl shadow-green-950/40 hover:scale-[1.02]"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Inquire on WhatsApp</span>
          </a>

          {siteSettings.phone && (
            <a
              href={`tel:${siteSettings.phone.replace(/\s/g, '')}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:border-[#C5A059] bg-white/5 hover:bg-white/10 text-white px-6 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-medium transition-all"
            >
              <Phone className="w-4 h-4 text-[#C5A059]" />
              <span>Call Showroom</span>
            </a>
          )}

          {siteSettings.instagramUrl && (
            <a
              href={siteSettings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:border-[#E1306C] bg-white/5 hover:bg-white/10 text-white px-5 py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-medium transition-all"
              title="Instagram"
            >
              <Instagram className="w-4 h-4 text-[#E1306C]" />
              <span className="sm:hidden">Instagram</span>
            </a>
          )}
        </div>

        {/* Showroom Hours & Address note */}
        <div className="mt-10 pt-8 border-t border-white/10 text-xs text-white/50 font-sans space-y-1">
          <p className="font-serif text-sm text-white/80">{siteSettings.address || 'Surat, Gujarat, India'}</p>
          <p>{siteSettings.showroomHours || 'Mon - Sat: 10:00 AM - 8:00 PM'}</p>
        </div>
      </motion.div>

      {/* Subtle Admin Link at the very bottom */}
      <div className="z-10 pt-4 pb-2 text-center">
        <Link
          to="/admin"
          className="text-gray-600 hover:text-[#C5A059] transition-colors text-[11px] font-sans uppercase tracking-widest inline-flex items-center gap-1.5 opacity-60 hover:opacity-100"
        >
          <Wrench className="w-3 h-3" />
          <span>Admin Portal</span>
        </Link>
      </div>
    </div>
  );
}
