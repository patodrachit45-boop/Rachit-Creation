import { useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { useStore } from '../store';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { injectJSONLD, removeJSONLD, getBreadcrumbSchema } from '../lib/seoService';

export default function TermsOfService() {
  const { siteSettings } = useStore();

  useEffect(() => {
    const breadcrumbSchema = getBreadcrumbSchema([
      { name: 'Home', item: '/' },
      { name: 'Terms of Service', item: '/terms-of-service' }
    ]);
    injectJSONLD('terms-breadcrumb-schema', breadcrumbSchema);
    return () => removeJSONLD('terms-breadcrumb-schema');
  }, []);

  const parsedContent = useMemo(() => {
    const termsText = siteSettings.termsOfServiceText || '';
    if (!termsText) return null;
    return termsText.split('\n\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (trimmed.startsWith('###')) {
        return (
          <h3 key={index} className="font-serif text-lg md:text-xl text-[#3D3D3D] mt-6 mb-3 font-semibold">
            {trimmed.replace(/^###\s*/, '')}
          </h3>
        );
      }
      if (trimmed.startsWith('##')) {
        return (
          <h2 key={index} className="font-serif text-xl sm:text-2xl text-[#3D3D3D] mt-8 mb-4 font-semibold border-b border-[#C5A059]/10 pb-2">
            {trimmed.replace(/^##\s*/, '')}
          </h2>
        );
      }
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const items = trimmed.split('\n').map((item) => item.replace(/^[-*]\s*/, '').trim());
        return (
          <ul key={index} className="list-disc pl-6 my-4 space-y-2 text-[#3D3D3D]/80 text-sm md:text-base leading-relaxed font-sans">
            {items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index} className="text-[#3D3D3D]/80 text-sm md:text-base leading-relaxed my-4 font-sans">
          {trimmed}
        </p>
      );
    });
  }, [siteSettings.termsOfServiceText]);

  return (
    <div className="min-h-screen bg-[#FCEEE9]/30">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#FCEEE9] to-white border-b border-[#C5A059]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 text-center">
          <nav className="flex items-center justify-center gap-1 text-xs font-sans text-[#3D3D3D]/50 mb-4">
            <Link to="/" className="hover:text-[#C5A059] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#3D3D3D]">Terms of Service</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl text-[#3D3D3D]">Terms of Service</h1>
          <p className="text-[#3D3D3D]/50 text-xs sm:text-sm font-sans mt-2">Last updated: {new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-[#C5A059]/10 space-y-8 text-[#3D3D3D]/80 font-sans text-sm sm:text-base leading-relaxed"
        >
          {parsedContent}

          <section className="space-y-3 border-t border-[#C5A059]/10 pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#3D3D3D]">Legal Info & Contact</h2>
            <p>Our services are subject to the jurisdiction of the courts of Surat, Gujarat, India. For inquiries regarding our terms, you may contact us using the details below:</p>
            <div className="mt-4 p-4 bg-[#FCEEE9]/20 rounded-xl border border-[#C5A059]/10 space-y-1.5 text-xs sm:text-sm font-sans">
              <p><strong>Brand Name:</strong> Rachit Creation</p>
              {siteSettings.address && <p><strong>Showroom Address:</strong> {siteSettings.address}</p>}
              {siteSettings.email && <p><strong>Email Address:</strong> <a href={`mailto:${siteSettings.email}`} className="text-[#C5A059] hover:underline">{siteSettings.email}</a></p>}
              {siteSettings.phone && <p><strong>Phone Number:</strong> <a href={`tel:${siteSettings.phone.replace(/\s/g, '')}`} className="text-[#C5A059] hover:underline">{siteSettings.phone}</a></p>}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
