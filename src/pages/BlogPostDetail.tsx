import { useMemo, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useStore } from '../store';
import { motion } from 'motion/react';
import { Calendar, ArrowLeft, Share2, Facebook, Twitter, ShieldCheck, ChevronRight } from 'lucide-react';
import { injectJSONLD, removeJSONLD, getBreadcrumbSchema } from '../lib/seoService';
import { PageSkeleton } from '../components/LoadingSkeleton';

export default function BlogPostDetail() {
  const { id } = useParams<{ id: string }>();
  const { blogs, fetchBlogs } = useStore();
  const [loading, setLoading] = useState(blogs.length === 0);

  useEffect(() => {
    if (blogs.length === 0) {
      fetchBlogs().finally(() => setLoading(false));
    }
  }, [blogs.length, fetchBlogs]);

  const blog = useMemo(() => {
    const found = blogs.find((b) => b.id === id);
    if (found && found.createdAt > Date.now()) {
      return undefined;
    }
    return found;
  }, [blogs, id]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://raccreation.com/blog/${id}`;

  useEffect(() => {
    if (blog) {
      const breadcrumbSchema = getBreadcrumbSchema([
        { name: 'Home', item: '/' },
        { name: 'Blog', item: '/blog' },
        { name: blog.title, item: `/blog/${blog.id}` }
      ]);
      injectJSONLD('blog-breadcrumb-schema', breadcrumbSchema);
    }
    return () => removeJSONLD('blog-breadcrumb-schema');
  }, [blog]);

  const parsedContent = useMemo(() => {
    if (!blog?.content) return null;
    return blog.content.split('\n\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (trimmed.startsWith('###')) {
        return (
          <h3 key={index} className="font-serif text-xl md:text-2xl text-[#3D3D3D] mt-8 mb-4 font-semibold">
            {trimmed.replace(/^###\s*/, '')}
          </h3>
        );
      }
      if (trimmed.startsWith('##')) {
        return (
          <h2 key={index} className="font-serif text-2xl md:text-3xl text-[#3D3D3D] mt-8 mb-4 font-semibold border-b border-[#C5A059]/10 pb-2">
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
  }, [blog]);

  if (loading) {
    return <PageSkeleton />;
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#FCEEE9]/30 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-[#3D3D3D] mb-3">Article Not Found</h1>
          <p className="text-[#3D3D3D]/50 text-sm font-sans mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#b08d47] text-white text-sm font-sans tracking-wider uppercase px-6 py-3 rounded-full transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Article Cover */}
      <div className="relative h-[45vh] min-h-[300px] overflow-hidden bg-gray-950">
        <img 
          src={blog.imageUrl || '/images/products/regenerated_image_1779296299562.png'} 
          alt={blog.imageAlt || blog.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-black/30 to-black/50" />
        <div className="absolute bottom-6 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-white/95 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold mb-6 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </Link>
        </div>
      </div>

      {/* Breadcrumb section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        <nav className="flex items-center gap-1.5 text-xs font-sans text-[#3D3D3D]/50 mb-4 animate-fadeIn">
          <Link to="/" className="hover:text-[#C5A059] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#3D3D3D]/30" />
          <Link to="/blog" className="hover:text-[#C5A059] transition-colors">Blogs</Link>
          <ChevronRight className="w-3 h-3 text-[#3D3D3D]/30" />
          <span className="text-[#3D3D3D] truncate max-w-[200px] sm:max-w-xs">{blog.title}</span>
        </nav>
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-xs font-sans text-[#3D3D3D]/50 hover:text-[#C5A059] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </Link>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-16" itemScope itemType="https://schema.org/BlogPosting">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-[#C5A059] font-sans mb-4">
          <Calendar className="w-4 h-4" />
          <time dateTime={new Date(blog.createdAt).toISOString()} itemProp="datePublished">
            {new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
          </time>
          <meta itemProp="dateModified" content={new Date(blog.createdAt).toISOString()} />
          <span className="text-[#C5A059]/20">•</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Verified Atelier Designer</span>
          <span className="text-[#C5A059]/20">•</span>
          <span className="font-semibold" itemProp="author" itemScope itemType="https://schema.org/Person">
            By <span itemProp="name">Mahesh Patodiya</span> (Founder & Master Craftsman)
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#3D3D3D] leading-tight mb-8">
          {blog.title}
        </h1>

        {/* Share buttons */}
        <div className="flex flex-wrap items-center gap-3 border-y border-[#C5A059]/15 py-4 mb-10">
          <span className="text-xs uppercase tracking-wider font-sans text-[#3D3D3D]/50 flex items-center gap-1.5"><Share2 className="w-3.5 h-3.5" /> Share Story:</span>
          
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-[#3D3D3D]/5 hover:bg-[#C5A059] hover:text-white text-[#3D3D3D] flex items-center justify-center transition-colors"
            title="Share on Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>

          <a 
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(blog.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-[#3D3D3D]/5 hover:bg-[#C5A059] hover:text-white text-[#3D3D3D] flex items-center justify-center transition-colors"
            title="Share on Twitter"
          >
            <Twitter className="w-4 h-4" />
          </a>

          <a 
            href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&description=${encodeURIComponent(blog.title)}&media=${encodeURIComponent(blog.imageUrl || '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-[#3D3D3D]/5 hover:bg-[#C5A059] hover:text-white text-[#3D3D3D] flex items-center justify-center transition-colors font-bold text-xs"
            title="Pin on Pinterest"
          >
            P
          </a>
        </div>

        {/* Atelier Insights (TL;DR Summary) */}
        <div className="mb-8 p-5 bg-[#FCEEE9]/20 border-l-4 border-[#C5A059] rounded-r-2xl shadow-sm">
          <h4 className="text-xs uppercase tracking-wider font-sans text-[#C5A059] font-bold mb-2">Atelier Insights (TL;DR)</h4>
          <p className="text-sm font-sans text-[#3D3D3D]/80 italic leading-relaxed">
            {blog.excerpt}
          </p>
        </div>

        {/* Content Body */}
        <article className="prose max-w-none text-[#3D3D3D]" itemProp="articleBody">
          {parsedContent}
        </article>



        {/* Recommended Collections Internal Links */}
        <div className="mt-16 pt-10 border-t border-[#C5A059]/15">
          <h3 className="font-serif text-2xl text-[#3D3D3D] text-center mb-6">Explore Our Heritage Collections</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Bridal', 'Designer', 'Girlish', 'Heavy'].map((cat) => (
              <Link 
                key={cat} 
                to={`/category/${cat}`}
                className="group border border-[#C5A059]/15 hover:border-[#C5A059] rounded-2xl p-5 text-center bg-[#FCEEE9]/10 hover:bg-[#FCEEE9]/20 transition-all duration-300 shadow-sm"
              >
                <span className="block font-serif text-base text-[#3D3D3D] group-hover:text-[#C5A059] transition-colors">{cat}</span>
                <span className="block text-[10px] uppercase tracking-wider text-[#3D3D3D]/40 mt-1 font-medium">Explore Collection</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#b08d47] text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blogs Index
          </Link>
        </div>
      </div>
    </div>
  );
}
