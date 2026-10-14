/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router';
import { useEffect } from 'react';
import { useStore } from './store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MaintenanceScreen from './components/MaintenanceScreen';
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
const NotFound = lazy(() => import('./pages/NotFound'));

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
  const fetchSiteSettings = useStore((s) => s.fetchSiteSettings);
  
  useEffect(() => {
    fetchProducts();
    fetchSiteSettings();
  }, [fetchProducts, fetchSiteSettings]);
  return null;
}

function MainContent() {
  const { siteSettings, isAdmin } = useStore();
  const location = useLocation();

  const isMaintenanceActive = Boolean(siteSettings.isUnderMaintenance) && location.pathname !== '/admin' && !isAdmin;

  if (isMaintenanceActive) {
    return <MaintenanceScreen siteSettings={siteSettings} />;
  }

  return (
    <div className="flex flex-col min-h-screen font-sans antialiased text-[#3D3D3D] selection:bg-[#C5A059] selection:text-white">
      {siteSettings.isUnderMaintenance && isAdmin && (
        <div className="bg-amber-600 text-white px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-2 sticky top-0 z-[100] shadow-md">
          <span>⚠️ Website is currently in Maintenance Mode (Visitors are blocked from browsing).</span>
          <Link to="/admin" className="underline font-bold hover:text-amber-100">Manage in Admin Panel</Link>
        </div>
      )}
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppInit />
      <ScrollToTop />
      <AnalyticsTracker />
      <MainContent />
    </Router>
  );
}
