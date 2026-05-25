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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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

export default function App() {
  return (
    <Router>
      <AppInit />
      <ScrollToTop />
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
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
