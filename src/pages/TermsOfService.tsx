import { useEffect } from 'react';
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
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#3D3D3D]">1. Services and Orders</h2>
            <p>Rachit Creation specializes in manufacturing premium, high-quality, handcrafted bridal, designer, girlish, and heavy lehengas. All products presented on our website are subject to availability.
            Orders initiated through our website are structured as catalogs of interest. Selecting "Order" or "Inquire" opens a communication link to finalize tailoring parameters, fabrics, sizing, and payment details directly on WhatsApp.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#3D3D3D]">2. Tailoring and Crafting Timelines</h2>
            <p>Our custom and hand-embroidered outfits require time-intensive craftsmanship. Bridal and heavy lehengas typically require **4 to 8 weeks** to tailor and assemble. We ask clients to plan and book orders well in advance of their ceremony dates to accommodate design schedules and transit windows.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#3D3D3D]">3. Fabric and Craft Handwork Variance</h2>
            <p>Many of our collections utilize natural fibers, hand-loomed textiles, and hand-embroidered stone, Zardozi, and Zari details. Slight variations in color tones, embroidery layout, and finishing details are inherent to hand-tailored garments and represent a celebration of authentic Indian craftsmanship rather than a product defect.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#3D3D3D]">4. Deliveries and Shipping</h2>
            <p>We provide domestic shipping within India and express international delivery. Delivery fees, transit timelines, and custom declarations are calculated during purchase checkout discussions on WhatsApp. International buyers are solely responsible for local custom duties, import taxes, or delivery clearance protocols requested in their home country.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#3D3D3D]">5. Returns, Cancellations, and Refunds</h2>
            <p>Because custom-tailored lehengas are individually crafted to unique customer body sizes and bespoke design choices, **customized lehengas cannot be canceled, returned, or refunded** once production or fabric sourcing has commenced. For standard off-the-shelf catalog items, return eligibility is governed by individual agreements reached during WhatsApp checkout confirmation.</p>
          </section>

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
