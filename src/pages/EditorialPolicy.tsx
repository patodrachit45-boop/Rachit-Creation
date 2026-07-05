import { useEffect } from 'react';
import { Link } from 'react-router';
import { useStore } from '../store';
import { motion } from 'motion/react';
import { ChevronRight, FileText, CheckCircle, Shield } from 'lucide-react';
import { injectJSONLD, removeJSONLD, getBreadcrumbSchema } from '../lib/seoService';

export default function EditorialPolicy() {
  const { siteSettings } = useStore();

  useEffect(() => {
    const breadcrumbSchema = getBreadcrumbSchema([
      { name: 'Home', item: '/' },
      { name: 'Editorial Policy', item: '/editorial-policy' }
    ]);
    injectJSONLD('editorial-breadcrumb-schema', breadcrumbSchema);
    return () => removeJSONLD('editorial-breadcrumb-schema');
  }, []);

  return (
    <div className="min-h-screen bg-[#FCEEE9]/30">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#FCEEE9] to-white border-b border-[#C5A059]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 text-center">
          <nav className="flex items-center justify-center gap-1 text-xs font-sans text-[#3D3D3D]/50 mb-4">
            <Link to="/" className="hover:text-[#C5A059] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#3D3D3D]">Editorial Policy</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl text-[#3D3D3D]">Editorial Policy</h1>
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
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FCEEE9]/15 border border-[#C5A059]/20 p-5 rounded-xl">
            <Shield className="w-10 h-10 text-[#C5A059] shrink-0" />
            <div>
              <h3 className="font-serif text-lg text-[#3D3D3D] font-medium">Our E-E-A-T Commitment</h3>
              <p className="text-xs sm:text-sm text-[#3D3D3D]/60 mt-0.5 font-sans">We hold ourselves to the highest standards of Experience, Expertise, Authoritativeness, and Trustworthiness. All historical reference guides and style journals are reviewed by expert textile designers.</p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#3D3D3D] flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#C5A059]" /> 1. Accuracy & Fact-Checking
            </h2>
            <p>Every article published on Rachit Creation is extensively researched and fact-checked. We cover topics like bridal fashion, traditional hand-embroidery methods (including Zardozi, Zari, and Kundan work), and styling guides. We consult master weavers and designers to confirm historical dates, regional origins, and fabric descriptions before publishing.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#3D3D3D] flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#C5A059]" /> 2. Content Creator Expertise
            </h2>
            <p>Our articles are created and reviewed by experienced professionals in the textile industry. Our chief reviewer is **Mahesh Patodiya (Founder & Master Craftsman of Rachit Creation)**, who has over **15 years of industry experience** in handloom textiles and bridal apparel design. This ensures that every piece of style advice is grounded in solid design experience.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#3D3D3D] flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#C5A059]" /> 3. Independence and Editorial Integrity
            </h2>
            <p>Rachit Creation's blog is completely independent and funded directly by our brand. We do not accept sponsored posts or outside advertising. This guarantees that all designer collections and craft reviews are neutral, honest, and aimed solely at celebrating fine artisan craftsmanship.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#3D3D3D] flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#C5A059]" /> 4. Corrections and Updates
            </h2>
            <p>If you identify any technical inaccuracies or mislabeled details in our blog posts or catalogs, please contact us. We review and update articles promptly, and indicate when a modification has been made to preserve transparency.</p>
          </section>

          <section className="space-y-3 border-t border-[#C5A059]/10 pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#3D3D3D]">Contact Our Editorial Team</h2>
            <p>For questions or editorial feedback, you can contact us at:</p>
            <div className="mt-4 p-4 bg-[#FCEEE9]/20 rounded-xl border border-[#C5A059]/10 space-y-1.5 text-xs sm:text-sm font-sans">
              <p><strong>Lead Reviewer:</strong> Mahesh Patodiya (Founder)</p>
              {siteSettings.address && <p><strong>Address:</strong> {siteSettings.address}</p>}
              {siteSettings.email && <p><strong>Editorial Email:</strong> <a href={`mailto:${siteSettings.email}`} className="text-[#C5A059] hover:underline">{siteSettings.email}</a></p>}
              {siteSettings.phone && <p><strong>Phone:</strong> <a href={`tel:${siteSettings.phone.replace(/\s/g, '')}`} className="text-[#C5A059] hover:underline">{siteSettings.phone}</a></p>}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
