import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { getWhatsAppLink } from '../lib/siteConfig';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { injectJSONLD, removeJSONLD, getFAQSchema } from '../lib/seoService';

const PRODUCT_INTERESTS = ['Bridal Lehenga', 'Designer Lehenga', 'Girlish Lehenga', 'Heavy Lehenga', 'Custom Design', 'Other'];

export default function Contact() {
  const { siteSettings, faqs } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [interest, setInterest] = useState('');
  const [message, setMessage] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    if (faqs && faqs.length > 0) {
      const schema = getFAQSchema(faqs.map((f) => ({ q: f.question, a: f.answer })));
      injectJSONLD('faq-schema', schema);
    }
    return () => removeJSONLD('faq-schema');
  }, [faqs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [`Hi Rachit Creation! 👋`, '', `*Name:* ${name}`, `*Phone:* ${phone}`, `*City:* ${city}`, interest ? `*Interested in:* ${interest}` : '', message ? `*Message:* ${message}` : ''].filter(Boolean).join('\n');
    window.open(getWhatsAppLink(siteSettings.whatsappNumber, lines), '_blank', 'noopener,noreferrer');
  };

  const contactCards = [
    { icon: MapPin, title: 'Visit Our Showroom', detail: siteSettings.address },
    { icon: Phone, title: 'Call Us', detail: siteSettings.phone },
    { icon: Mail, title: 'Email', detail: siteSettings.email },
    { icon: Clock, title: 'Showroom Hours', detail: siteSettings.showroomHours },
  ];

  return (
    <div className="min-h-screen bg-[#FCEEE9]/30">
      <div className="bg-gradient-to-b from-[#FCEEE9] to-white border-b border-[#C5A059]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
          <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-[#C5A059] tracking-[0.3em] uppercase text-xs font-sans mb-2">Get in Touch</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-serif text-3xl md:text-5xl text-[#3D3D3D]">Contact Us</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-[#3D3D3D]/50 text-sm font-sans mt-3 max-w-md mx-auto">We'd love to help you find the perfect lehenga for your special occasion.</motion.p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          <div className="lg:col-span-2 space-y-5">
            {contactCards.map((card, i) => (
              <motion.div key={card.title} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="bg-white rounded-xl p-5 shadow-sm border border-[#C5A059]/10 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#FCEEE9] flex items-center justify-center shrink-0"><card.icon className="w-5 h-5 text-[#C5A059]" /></div>
                <div><h3 className="font-serif text-base text-[#3D3D3D] mb-0.5">{card.title}</h3><p className="text-[#3D3D3D]/60 text-sm font-sans leading-relaxed">{card.detail}</p></div>
              </motion.div>
            ))}
            <a href={getWhatsAppLink(siteSettings.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-sans text-sm tracking-wider uppercase px-6 py-3.5 rounded-full transition-colors shadow-md w-full"><MessageCircle className="w-4 h-4" /> Chat on WhatsApp</a>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#C5A059]/10">
              <h2 className="font-serif text-2xl text-[#3D3D3D] mb-1">Send an Inquiry</h2>
              <p className="text-[#3D3D3D]/50 text-sm font-sans mb-6">Fill in your details and we'll get back to you via WhatsApp.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-sans text-[#3D3D3D]/60 uppercase tracking-wider mb-1.5">Your Name *</label><input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Sharma" className="w-full border border-[#C5A059]/20 rounded-lg px-4 py-2.5 text-sm font-sans text-[#3D3D3D] placeholder:text-[#3D3D3D]/30 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 transition" /></div>
                  <div><label className="block text-xs font-sans text-[#3D3D3D]/60 uppercase tracking-wider mb-1.5">Phone Number *</label><input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full border border-[#C5A059]/20 rounded-lg px-4 py-2.5 text-sm font-sans text-[#3D3D3D] placeholder:text-[#3D3D3D]/30 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 transition" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-sans text-[#3D3D3D]/60 uppercase tracking-wider mb-1.5">City</label><input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai" className="w-full border border-[#C5A059]/20 rounded-lg px-4 py-2.5 text-sm font-sans text-[#3D3D3D] placeholder:text-[#3D3D3D]/30 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 transition" /></div>
                  <div><label className="block text-xs font-sans text-[#3D3D3D]/60 uppercase tracking-wider mb-1.5">Product Interest</label><select value={interest} onChange={(e) => setInterest(e.target.value)} className="w-full border border-[#C5A059]/20 rounded-lg px-4 py-2.5 text-sm font-sans text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 transition bg-white cursor-pointer"><option value="">Select an option</option>{PRODUCT_INTERESTS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                </div>
                <div><label className="block text-xs font-sans text-[#3D3D3D]/60 uppercase tracking-wider mb-1.5">Message</label><textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about your requirements, preferred colours, budget, occasion date…" className="w-full border border-[#C5A059]/20 rounded-lg px-4 py-2.5 text-sm font-sans text-[#3D3D3D] placeholder:text-[#3D3D3D]/30 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 transition resize-none" /></div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-[#b08d47] text-white font-sans text-sm tracking-wider uppercase px-6 py-3.5 rounded-full transition-colors shadow-md"><Send className="w-4 h-4" /> Send via WhatsApp</button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-2xl md:text-3xl text-[#3D3D3D] mb-2">Frequently Asked Questions</h2>
          <p className="text-[#3D3D3D]/50 text-sm font-sans max-w-md mx-auto">Common questions regarding our customizations, orders, and showroom location.</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <motion.div 
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white rounded-xl border border-[#C5A059]/10 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left font-serif text-base md:text-lg text-[#3D3D3D] hover:bg-[#FCEEE9]/10 transition-colors cursor-pointer focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[#C5A059]"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-[#C5A059]/5 bg-[#FCEEE9]/5"
                    >
                      <div className="p-5 font-sans text-sm text-[#3D3D3D]/70 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Google Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-[#C5A059]/10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="font-serif text-2xl text-[#3D3D3D]">Find Us on Google Maps</h2>
              <p className="text-[#3D3D3D]/50 text-sm font-sans mt-1">Visit our showroom at Millennium Textile Market, Surat</p>
            </div>
            <a 
              href={siteSettings.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteSettings.address || 'Rachit Creation, Surat')}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center gap-2 border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-white px-5 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-full transition-all"
            >
              <MapPin className="w-4 h-4" /> Open in Google Maps
            </a>
          </div>
          
          <a
            href={siteSettings.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteSettings.address || 'Rachit Creation, Surat')}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Click to open in Google Maps"
            className="block relative w-full h-[350px] md:h-[450px] rounded-xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50 group cursor-pointer"
          >
            <iframe
              title="Rachit Creation Store Location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(siteSettings.address || 'Rachit Creation, Surat')}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              className="absolute inset-0 w-full h-full border-0 pointer-events-none"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Elegant glassmorphism click-to-open overlay */}
            <div className="absolute inset-0 bg-[#3D3D3D]/0 group-hover:bg-[#3D3D3D]/25 transition-all duration-300 flex items-center justify-center">
              <span className="bg-white/95 backdrop-blur-sm text-[#3D3D3D] border border-[#C5A059]/20 font-sans text-xs uppercase tracking-wider font-semibold px-5 py-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059]" /> Open in Google Maps
              </span>
            </div>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
