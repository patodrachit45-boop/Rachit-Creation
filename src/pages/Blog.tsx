import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import { useStore } from '../store';
import { motion } from 'motion/react';
import { Calendar, Search, ArrowRight, BookOpen } from 'lucide-react';
import { injectJSONLD, removeJSONLD, getBreadcrumbSchema } from '../lib/seoService';

export default function Blog() {
  const { blogs } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const breadcrumbSchema = getBreadcrumbSchema([
      { name: 'Home', item: '/' },
      { name: 'Blogs', item: '/blog' }
    ]);
    injectJSONLD('blog-index-breadcrumb-schema', breadcrumbSchema);
    return () => removeJSONLD('blog-index-breadcrumb-schema');
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) || 
      blog.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [blogs, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FCEEE9]/30">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-[#FCEEE9] to-white border-b border-[#C5A059]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
          <motion.p 
            initial={{ opacity: 0, y: -8 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-[#C5A059] tracking-[0.3em] uppercase text-xs font-sans mb-2"
          >
            The Atelier Blogs
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            className="font-serif text-3xl md:text-5xl text-[#3D3D3D]"
          >
            Stories & Style Guides
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }} 
            className="text-[#3D3D3D]/50 text-sm font-sans mt-3 max-w-md mx-auto"
          >
            Explore our design inspirations, history of Indian craftsmanship, and wedding fashion advice.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..." 
              className="w-full bg-white border border-[#C5A059]/20 rounded-full pl-11 pr-4 py-3 text-sm font-sans text-[#3D3D3D] placeholder:text-[#3D3D3D]/30 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 transition shadow-sm"
            />
          </div>
        </motion.div>

        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-[#C5A059]/40 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-[#3D3D3D]">No Articles Found</h3>
            <p className="text-[#3D3D3D]/50 text-sm font-sans mt-2">Try checking other keywords or categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, idx) => (
              <motion.article 
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#C5A059]/10 flex flex-col h-full group hover:shadow-md transition-all duration-300"
              >
                <Link to={`/blog/${blog.id}`} className="block relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img 
                    src={blog.imageUrl || '/images/products/regenerated_image_1779296299562.png'} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </Link>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-[#C5A059] font-sans uppercase tracking-wider mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    </div>
                    <Link to={`/blog/${blog.id}`}>
                      <h2 className="font-serif text-xl text-[#3D3D3D] group-hover:text-[#C5A059] transition-colors line-clamp-2 leading-snug">
                        {blog.title}
                      </h2>
                    </Link>
                    <p className="text-[#3D3D3D]/60 text-sm font-sans mt-3 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                  <div className="mt-6 pt-5 border-t border-[#C5A059]/5">
                    <Link 
                      to={`/blog/${blog.id}`} 
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-sans font-semibold text-[#C5A059] group-hover:text-[#b08d47] transition-colors"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
