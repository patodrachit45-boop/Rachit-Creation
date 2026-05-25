import { Link } from 'react-router';
import { useStore } from '../store';
import { motion } from 'motion/react';

export default function About() {
  const { siteSettings } = useStore();
  const paragraphs = siteSettings.aboutText.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FCEEE9]/30">
      <section className="relative h-[50vh] min-h-[340px] overflow-hidden">
        <img src={siteSettings.aboutHeroImage} alt="About Rachit Creation" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-[#C5A059] tracking-[0.35em] uppercase text-xs font-sans mb-3">Rachit Creation</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-serif text-white text-4xl sm:text-5xl md:text-6xl">Our Story</motion.h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FCEEE9]/30 to-transparent" />
      </section>
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="space-y-6">
          {paragraphs.map((para, i) => (
            <motion.p key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-[#3D3D3D]/75 font-sans text-sm md:text-base leading-relaxed">{para}</motion.p>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="text-center mt-12">
          <Link to="/category/Bridal" className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#b08d47] text-white font-sans text-sm tracking-wider uppercase px-8 py-3.5 rounded-full transition-colors shadow-md">Explore Our Collection</Link>
        </motion.div>
      </section>
    </div>
  );
}
