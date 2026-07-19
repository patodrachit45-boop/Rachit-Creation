import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useStore } from '../store';
import { motion } from 'motion/react';
import { injectJSONLD, removeJSONLD, getBreadcrumbSchema } from '../lib/seoService';
import { PageSkeleton } from '../components/LoadingSkeleton';

export default function About() {
  const { siteSettings, teamMembers, isSettingsLoading, fetchTeamMembers } = useStore();
  const [loading, setLoading] = useState(teamMembers.length === 0);

  useEffect(() => {
    if (teamMembers.length === 0) {
      fetchTeamMembers().finally(() => setLoading(false));
    }
  }, [teamMembers.length, fetchTeamMembers]);

  useEffect(() => {
    const breadcrumbSchema = getBreadcrumbSchema([
      { name: 'Home', item: '/' },
      { name: 'About Us', to: '/about' } as any // Using 'item' but keying correctly for builder
    ].map(item => ({ name: item.name, item: (item as any).to || item.item })));
    
    injectJSONLD('about-breadcrumb-schema', breadcrumbSchema);
    return () => removeJSONLD('about-breadcrumb-schema');
  }, []);
  if (loading || isSettingsLoading) {
    return <PageSkeleton />;
  }

  const paragraphs = siteSettings.aboutText.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FCEEE9]/30">
      {/* Top Banner */}
      <section className="relative h-[40vh] min-h-[280px] overflow-hidden bg-gray-950">
        {!isSettingsLoading && (
          <motion.img 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}
            src={siteSettings.heroImage || '/images/products/regenerated_image_1779296299562.png'} 
            alt="About Rachit Creation" 
            className="absolute inset-0 w-full h-full object-cover" 
            fetchPriority="high"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/70" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 mt-4">
          <nav className="flex items-center gap-1.5 text-xs font-sans text-white/60 mb-3">
            <Link to="/" className="hover:text-[#C5A059] transition-colors">Home</Link>
            <span className="text-white/30">/</span>
            <span className="text-white">Our Story</span>
          </nav>
          <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-[#C5A059] tracking-[0.35em] uppercase text-xs font-sans mb-3">Rachit Creation</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-serif text-white text-4xl sm:text-5xl md:text-6xl">Our Story</motion.h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FCEEE9]/30 to-transparent" />
      </section>

      {/* Main Content Area */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        {!isSettingsLoading && siteSettings.aboutHeroImage && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 rounded-2xl overflow-hidden shadow-lg border border-[#C5A059]/10 aspect-video bg-gray-100">
            <img src={siteSettings.aboutHeroImage} alt={siteSettings.aboutHeroImageAlt || "Rachit Creation Heritage Story"} className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </motion.div>
        )}
        <div className="space-y-6">
          {paragraphs.map((para, i) => (
            <motion.p key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-[#3D3D3D]/75 font-sans text-sm md:text-base leading-relaxed">{para}</motion.p>
          ))}
        </div>
      </section>

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="bg-white border-y border-[#C5A059]/10 py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="font-serif text-2xl md:text-4xl text-[#3D3D3D]">Our Team</h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {teamMembers.map((member, idx) => (
                <motion.div 
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-[#FCEEE9]/10 border border-[#C5A059]/10 rounded-2xl overflow-hidden p-6 flex flex-col items-center text-center shadow-sm group hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-[#FCEEE9] border-2 border-[#C5A059]/20 mb-5 flex items-center justify-center shadow-inner relative">
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    ) : (
                      <span className="text-[#C5A059] text-3xl font-serif font-bold uppercase">{member.name.charAt(0)}</span>
                    )}
                  </div>
                  <h3 className="font-serif text-[#3D3D3D] text-lg font-bold">{member.name}</h3>
                  <p className="text-xs text-[#C5A059] font-sans font-semibold uppercase tracking-wider mt-1">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-20 max-w-4xl mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 16 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h3 className="font-serif text-2xl md:text-3xl text-[#3D3D3D] mb-2">Explore Our Heritage Collections</h3>
          <p className="text-[#3D3D3D]/55 text-sm font-sans max-w-md mx-auto mb-8">Begin your bridal journey by exploring our carefully curated categories.</p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Bridal', 'Designer', 'Girlish', 'Heavy'].map((cat, idx) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Link 
                to={`/category/${cat}`}
                className="group block border border-[#C5A059]/25 rounded-2xl p-6 bg-white hover:border-[#C5A059] hover:bg-[#FCEEE9]/20 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <span className="block font-serif text-lg text-[#3D3D3D] group-hover:text-[#C5A059] transition-colors">{cat}</span>
                <span className="block text-[10px] uppercase tracking-widest text-[#3D3D3D]/40 mt-1 font-semibold">View Collection</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
