/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useStore } from './store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import { useCanonicalURL } from './lib/seoService';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnalyticsTracker() {
  useCanonicalURL();
  const { siteSettings } = useStore();
  const { pathname } = useLocation();

  useEffect(() => {
    if (siteSettings.facebookPixelId && typeof window !== 'undefined') {
      const fb = (window as any).fbq;
      if (fb) {
        fb('track', 'PageView');
      } else {
        (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
          if (f.fbq) return;
          n = f.fbq = function() {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
          };
          if (!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = !0;
          n.version = '2.0';
          n.queue = [];
          t = b.createElement(e);
          t.async = !0;
          t.src = v;
          s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        (window as any).fbq('init', siteSettings.facebookPixelId);
        (window as any).fbq('track', 'PageView');
      }
    }
  }, [siteSettings.facebookPixelId, pathname]);

  return null;
}

function AppInit() {
  const fetchProducts = useStore((s) => s.fetchProducts);
  const fetchBlogs = useStore((s) => s.fetchBlogs);
  const fetchTeamMembers = useStore((s) => s.fetchTeamMembers);
  const fetchFaqs = useStore((s) => s.fetchFaqs);
  const fetchSiteSettings = useStore((s) => s.fetchSiteSettings);
  
  useEffect(() => {
    fetchProducts();
    fetchBlogs();
    fetchTeamMembers();
    fetchFaqs();
    fetchSiteSettings();
  }, [fetchProducts, fetchBlogs, fetchTeamMembers, fetchFaqs, fetchSiteSettings]);
  return null;
}

export default function App() {
  return (
    <Router>
      <AppInit />
      <ScrollToTop />
      <AnalyticsTracker />
      <div className="flex flex-col min-h-screen font-sans antialiased text-[#3D3D3D] selection:bg-[#C5A059] selection:text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:type" element={<Category />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPostDetail />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
