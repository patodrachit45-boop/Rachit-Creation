/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useStore } from './store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { PageSkeleton } from './components/LoadingSkeleton';
import { useCanonicalURL } from './lib/seoService';

const Home = lazy(() => import('./pages/Home'));
const Category = lazy(() => import('./pages/Category'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const EditorialPolicy = lazy(() => import('./pages/EditorialPolicy'));

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
          <Suspense fallback={<PageSkeleton />}>
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
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/editorial-policy" element={<EditorialPolicy />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
