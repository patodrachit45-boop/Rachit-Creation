import { useEffect } from 'react';
import { Link } from 'react-router';
import { useStore } from '../store';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { injectJSONLD, removeJSONLD, getBreadcrumbSchema } from '../lib/seoService';

export default function PrivacyPolicy() {
  const { siteSettings } = useStore();

  useEffect(() => {
    const breadcrumbSchema = getBreadcrumbSchema([
      { name: 'Home', item: '/' },
      { name: 'Privacy Policy', item: '/privacy-policy' }
    ]);
    injectJSONLD('privacy-breadcrumb-schema', breadcrumbSchema);
    return () => removeJSONLD('privacy-breadcrumb-schema');
  }, []);

  return (
    <div className="min-h-screen bg-[#FCEEE9]/30">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#FCEEE9] to-white border-b border-[#C5A059]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 text-center">
          <nav className="flex items-center justify-center gap-1 text-xs font-sans text-[#3D3D3D]/50 mb-4">
            <Link to="/" className="hover:text-[#C5A059] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#3D3D3D]">Privacy Policy</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl text-[#3D3D3D]">Privacy Policy</h1>
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
            <h2 className="font-serif text-xl sm:text-2xl text-[#3D3D3D]">1. Information We Collect</h2>
            <p>At Rachit Creation, we collect personal information necessary to process your custom orders and inquiries. This includes:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Contact details:</strong> Name, phone number, email address, and shipping address.</li>
              <li><strong>Order specifications:</strong> Design choices, measurement specifications, and customization requests.</li>
              <li><strong>Technical data:</strong> IP address and usage patterns tracked via analytics tools and cookies to optimize website performance.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#3D3D3D]">2. How We Use Your Information</h2>
            <p>We utilize the collected information to serve you better, specifically for:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Processing and finalizing your orders (which are routed and detailed via WhatsApp).</li>
              <li>Shipping your bespoke lehengas to your address.</li>
              <li>Providing customer support and order updates.</li>
              <li>Analyzing website traffic and running target optimization campaigns (e.g. through Facebook Pixel).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#3D3D3D]">3. Order Queries and Third Parties</h2>
            <p>Our ordering system routes queries from our catalog to a direct chat on WhatsApp. WhatsApp independently manages chat security and communication history according to their own privacy standards. We do not sell, trade, or transfer your personal data to outside parties, except for trusted logistics partners who assist in shipping your products.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#3D3D3D]">4. Security of Data</h2>
            <p>We implement robust administrative, physical, and technological security controls to ensure the confidentiality and integrity of your specifications and contact information. Your details are accessed only by authorized team members working on tailoring, quality checks, or deliveries.</p>
          </section>

          <section className="space-y-3 border-t border-[#C5A059]/10 pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#3D3D3D]">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or how we handle your personal data, feel free to reach out:</p>
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
