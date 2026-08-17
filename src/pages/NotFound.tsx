import { useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { setMetaRobots, setPageTitle } from '../lib/seoService';

export default function NotFound() {
  useEffect(() => {
    setMetaRobots(true);
    setPageTitle('404 Page Not Found | Rachit Creation');
    return () => {
      setMetaRobots(false);
    };
  }, []);

  return (
    <div className="min-h-[70vh] bg-[#FCEEE9]/30 flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-md mx-auto">
        <span className="text-[#C5A059] font-serif text-6xl font-bold block mb-2">404</span>
        <h1 className="font-serif text-3xl text-[#3D3D3D] mb-3">Page Not Found</h1>
        <p className="text-[#3D3D3D]/60 text-sm font-sans mb-8 leading-relaxed">
          The page you are looking for doesn't exist, has been moved, or is no longer available.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#b08d47] text-white text-sm font-sans tracking-wider uppercase px-7 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
