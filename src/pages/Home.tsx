import { Link } from 'react-router';
import { useStore } from '../store';
import { DEFAULT_TESTIMONIALS, formatPrice, CATEGORIES, getWhatsAppLink, getWhatsAppOrderLink, type ReelItem } from '../lib/siteConfig';
import { Star, MessageCircle, ArrowRight, ChevronRight, ChevronLeft, Play, Pause, Volume2, VolumeX, Sparkles, ShoppingBag, X, Instagram, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMemo, useEffect, useState, useRef } from 'react';
import { injectJSONLD, removeJSONLD, getLocalBusinessSchema, getBreadcrumbSchema } from '../lib/seoService';

export default function Home() {
  const { products, siteSettings, isSettingsLoading, reels, fetchReels } = useStore();
  const [heroMuted, setHeroMuted] = useState(true);
  const [heroPlaying, setHeroPlaying] = useState(true);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  // Reel Lightbox Modal state
  const [activeReelModal, setActiveReelModal] = useState<ReelItem | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [modalMuted, setModalMuted] = useState(false);

  const handleToggleSound = () => {
    const nextMuted = !modalMuted;
    setModalMuted(nextMuted);
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = nextMuted;
      if (!nextMuted) {
        modalVideoRef.current.play().catch((err) => console.warn('Play audio prevented:', err));
      }
    }
  };

  useEffect(() => {
    if (activeReelModal && modalVideoRef.current) {
      modalVideoRef.current.currentTime = 0;
      modalVideoRef.current.muted = modalMuted;
      const p = modalVideoRef.current.play();
      if (p !== undefined) {
        p.catch((err) => {
          console.warn('Autoplay with sound prevented by browser policy. Retrying muted...', err);
          if (modalVideoRef.current) {
            modalVideoRef.current.muted = true;
            setModalMuted(true);
            modalVideoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [activeReelModal]);

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  useEffect(() => {
    if (siteSettings) {
      const schema = getLocalBusinessSchema(siteSettings);
      injectJSONLD('local-business-schema', schema);
    }
    const breadcrumbSchema = getBreadcrumbSchema([
      { name: 'Home', item: '/' },
      { name: 'Luxury Collections', item: '/#collections' }
    ]);
    injectJSONLD('home-breadcrumb-schema', breadcrumbSchema);

    return () => {
      removeJSONLD('local-business-schema');
      removeJSONLD('home-breadcrumb-schema');
    };
  }, [siteSettings]);

  const categoryData = useMemo(() => CATEGORIES.map((cat) => {
    const cp = products.filter((p) => p.category === cat);
    return { name: cat, count: cp.length, image: cp[0]?.imageUrl || '/images/logo.jpg' };
  }), [products]);
  const newArrivals = useMemo(() => [...products].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)).slice(0, 8), [products]);

  const toggleHeroPlay = () => {
    if (heroVideoRef.current) {
      if (heroPlaying) {
        heroVideoRef.current.pause();
      } else {
        heroVideoRef.current.play();
      }
      setHeroPlaying(!heroPlaying);
    }
  };

  const toggleHeroMute = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = !heroMuted;
      setHeroMuted(!heroMuted);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCEEE9]/30">
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[540px] overflow-hidden bg-gray-950">
        {/* Background AI Video / Poster Image */}
        {siteSettings.heroVideoUrl ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <video
              ref={heroVideoRef}
              src={siteSettings.heroVideoUrl}
              poster={siteSettings.heroImage || '/images/products/regenerated_image_1779296299562.png'}
              autoPlay
              loop
              muted={heroMuted}
              playsInline
              className="w-full h-full object-cover transition-opacity duration-700"
            />
          </div>
        ) : (
          !isSettingsLoading && (
            <motion.img 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.5 }}
              src={siteSettings.heroImage || '/images/products/regenerated_image_1779296299562.png'} 
              alt={siteSettings.heroImageAlt || "Rachit Creation — Luxury Lehengas"} 
              className="absolute inset-0 w-full h-full object-cover" 
              fetchPriority="high"
            />
          )
        )}

        {/* Video Overlay controls */}
        {siteSettings.heroVideoUrl && (
          <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-sans uppercase tracking-widest text-white/90 border border-white/20">
              <Sparkles className="w-3 h-3 text-[#C5A059]" /> AI Couture Motion
            </span>
            <button
              onClick={toggleHeroPlay}
              className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-[#C5A059] transition-colors border border-white/20"
              title={heroPlaying ? 'Pause Video' : 'Play Video'}
            >
              {heroPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button
              onClick={toggleHeroMute}
              className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-[#C5A059] transition-colors border border-white/20"
              title={heroMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {heroMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
            </button>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-[#C5A059] tracking-[0.35em] uppercase text-xs sm:text-sm font-sans mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A059]" /> Rachit Creation <Sparkles className="w-4 h-4 text-[#C5A059]" />
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="font-serif text-white text-4xl sm:text-5xl md:text-7xl leading-tight">Discover Luxury</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.35 }} className="text-white/80 mt-4 max-w-lg text-sm sm:text-base font-sans">Exquisite handcrafted bridal & designer lehengas for your royal moments</motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }} className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link to="/category/Bridal" className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#b08d47] text-white font-sans text-sm tracking-wider uppercase px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"><span>Explore Collection</span><ArrowRight className="w-4 h-4" /></Link>
            <a href="#reels" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-sans text-sm tracking-wider uppercase px-7 py-3.5 rounded-full transition-all duration-300"><span>Watch Reels</span><Play className="w-3.5 h-3.5 fill-current" /></a>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FCEEE9]/30 to-transparent" />
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <p className="text-[#C5A059] tracking-[0.3em] uppercase text-xs font-sans mb-2">Curated For You</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#3D3D3D]">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categoryData.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <Link to={`/category/${cat.name}`} className="group block">
                <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                  <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <h3 className="font-serif text-white text-xl md:text-2xl">{cat.name}</h3>
                    <p className="text-white/70 text-xs font-sans mt-1">{cat.count} {cat.count === 1 ? 'Design' : 'Designs'}</p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Couture Reels Showcase (Instagram 9:16 Video Section) */}
      <section id="reels" className="py-16 md:py-24 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden relative border-y border-[#C5A059]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-[#C5A059] tracking-[0.3em] uppercase text-xs font-sans mb-2 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> Couture In Motion
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white">Instagram Reels & AI Video Showcase</h2>
              <p className="text-white/60 text-sm font-sans mt-2 max-w-xl">
                Experience the twirl, royal handwork, and drape of Rachit Creation luxury lehengas in 9:16 high-definition video.
              </p>
            </div>
            <a
              href={siteSettings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#C5A059]/20 hover:bg-[#C5A059] text-[#C5A059] hover:text-white border border-[#C5A059]/40 text-xs font-sans uppercase tracking-widest px-5 py-2.5 rounded-full transition-all duration-300 self-start md:self-auto"
            >
              <Instagram className="w-4 h-4" /> Follow @rachit__creation
            </a>
          </div>

          {/* 9:16 Reels Vertical Grid / Horizontal Scroll */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {reels.map((reel, index) => (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-black/40 rounded-2xl overflow-hidden border border-[#C5A059]/20 hover:border-[#C5A059]/70 transition-all duration-500 shadow-xl"
              >
                {/* 9:16 Vertical Video Frame */}
                <div
                  className="relative aspect-[9/16] w-full overflow-hidden cursor-pointer"
                  onClick={() => { setActiveReelModal(reel); setModalMuted(false); }}
                >
                  <video
                    src={reel.videoUrl}
                    poster={reel.posterUrl}
                    loop
                    muted
                    playsInline
                    autoPlay
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 opacity-80 group-hover:opacity-70 transition-opacity" />

                  {/* Category Tag */}
                  {reel.category && (
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[#C5A059] border border-[#C5A059]/40 font-sans text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full shadow">
                      {reel.category}
                    </div>
                  )}

                  {/* Play Overlay Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#C5A059]/90 text-white flex items-center justify-center shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:bg-[#C5A059]">
                      <Play className="w-6 h-6 fill-current ml-1 text-white" />
                    </div>
                  </div>

                  {/* Bottom Caption & Action */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                    <h3 className="font-serif text-white text-base leading-snug line-clamp-2 group-hover:text-[#C5A059] transition-colors">
                      {reel.title}
                    </h3>
                    {reel.productName && (
                      <p className="text-white/70 text-xs font-sans mt-1 line-clamp-1">
                        {reel.productName}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <a
                        href={getWhatsAppOrderLink(
                          siteSettings.whatsappNumber,
                          reel.productName || reel.title,
                          reel.price
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-[10px] font-sans font-semibold uppercase tracking-wider px-3 py-2 rounded-full transition-colors shadow"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Inquire
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveReelModal(reel);
                          setModalMuted(false);
                        }}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
                        title="Watch Fullscreen"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16 md:py-24 bg-white/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[#C5A059] tracking-[0.3em] uppercase text-xs font-sans mb-2">Just In</p>
                <h2 className="font-serif text-3xl md:text-4xl text-[#3D3D3D]">New Arrivals</h2>
              </div>
              <Link to="/category/Bridal" className="hidden sm:inline-flex items-center gap-1 text-[#C5A059] hover:text-[#b08d47] text-sm font-sans tracking-wide transition-colors">View All <ChevronRight className="w-4 h-4" /></Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible md:pb-0 scrollbar-hide">
              {newArrivals.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07 }} className="min-w-[70vw] sm:min-w-[45vw] md:min-w-0 snap-start">
                  <Link to={`/product/${product.id}`} className="group block">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md">
                      <img src={product.imageUrl} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                      {product.isSoldOut && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="border-2 border-white text-white font-serif text-xs sm:text-sm tracking-[0.25em] uppercase px-4 py-2 rounded-sm font-semibold select-none shadow-lg">Sold Out</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#C5A059] font-sans text-xs font-semibold px-3 py-1.5 rounded-full shadow">{formatPrice(product.price)}</div>
                    </div>
                    <div className="mt-3 px-1">
                      <h3 className="font-serif text-lg text-[#3D3D3D] group-hover:text-[#C5A059] transition-colors line-clamp-1">{product.name}</h3>
                      <p className="text-[#3D3D3D]/50 text-xs font-sans mt-0.5">{product.category}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <p className="text-[#C5A059] tracking-[0.3em] uppercase text-xs font-sans mb-2">Love Letters</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#3D3D3D]">What Our Brides Say</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DEFAULT_TESTIMONIALS.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="bg-white rounded-2xl p-6 shadow-sm border border-[#C5A059]/10 hover:shadow-md transition-shadow" itemScope itemType="https://schema.org/Review">
              <div className="flex gap-0.5 mb-3" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                <meta itemProp="ratingValue" content={String(t.rating)} />
                <meta itemProp="bestRating" content="5" />
                {Array.from({ length: t.rating }).map((_, idx) => <Star key={idx} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />)}
              </div>
              <div className="hidden" itemProp="itemReviewed" itemScope itemType="https://schema.org/LocalBusiness">
                <meta itemProp="name" content="Rachit Creation" />
                <meta itemProp="image" content="https://raccreation.com/images/logo.webp" />
                <meta itemProp="telephone" content={siteSettings.phone} />
                <meta itemProp="address" content={siteSettings.address} />
              </div>
              <p className="text-[#3D3D3D]/80 text-sm font-sans leading-relaxed mb-4" itemProp="reviewBody">"{t.text}"</p>
              <div>
                <p className="font-serif text-[#3D3D3D] text-base font-semibold" itemProp="author" itemScope itemType="https://schema.org/Person">
                  <span itemProp="name">{t.name}</span>
                </p>
                <p className="text-[#3D3D3D]/50 text-xs font-sans">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WhatsApp FAB */}
      <a href={getWhatsAppLink(siteSettings.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110" aria-label="Chat on WhatsApp"><MessageCircle className="w-6 h-6" /></a>

      {/* Reel Lightbox Modal */}
      <AnimatePresence>
        {activeReelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6"
            onClick={() => setActiveReelModal(null)}
          >
            <div
              className="relative w-full max-w-md h-[85vh] max-h-[780px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-[#C5A059]/40 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveReelModal(null)}
                className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 text-white hover:bg-[#C5A059] transition-colors border border-white/20 shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Sound Toggle Button */}
              <button
                onClick={handleToggleSound}
                className="absolute top-4 left-4 z-30 p-2.5 rounded-full bg-black/60 text-white hover:bg-[#C5A059] transition-colors border border-white/20 shadow-lg flex items-center gap-1.5 text-xs font-sans"
              >
                {modalMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
                <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-widest">{modalMuted ? 'Muted' : 'Sound On'}</span>
              </button>

              {/* 9:16 Video Player */}
              <div className="relative w-full h-full">
                <video
                  ref={modalVideoRef}
                  src={activeReelModal.videoUrl}
                  poster={activeReelModal.posterUrl}
                  autoPlay
                  loop
                  muted={modalMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Modal Bottom Information */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent text-white z-20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-[#C5A059] text-white text-[10px] font-sans uppercase font-bold tracking-widest rounded-full">
                    {activeReelModal.category || 'Luxury Couture'}
                  </span>
                </div>

                <h3 className="font-serif text-white text-xl sm:text-2xl font-medium leading-snug mb-2">
                  {activeReelModal.title}
                </h3>

                {activeReelModal.productName && (
                  <p className="text-white/80 text-xs sm:text-sm font-sans mb-4">
                    Featured: <span className="text-[#C5A059] font-medium">{activeReelModal.productName}</span>
                  </p>
                )}

                <div className="flex gap-3">
                  <a
                    href={getWhatsAppOrderLink(
                      siteSettings.whatsappNumber,
                      activeReelModal.productName || activeReelModal.title,
                      activeReelModal.price
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-sans text-xs uppercase tracking-widest font-semibold px-4 py-3 rounded-full transition-all duration-300 shadow-lg"
                  >
                    <ShoppingBag className="w-4 h-4" /> Order on WhatsApp
                  </a>
                  <a
                    href={activeReelModal.instagramUrl || siteSettings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/30 transition-colors flex items-center justify-center"
                    title="View on Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
