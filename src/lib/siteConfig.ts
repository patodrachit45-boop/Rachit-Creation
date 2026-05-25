/**
 * Site-wide configuration defaults and utility functions.
 * These are used as fallbacks when Supabase is not configured.
 */

// ── Categories ────────────────────────────────────────────────────────

export const CATEGORIES = ['Bridal', 'Designer', 'Girlish', 'Heavy'] as const;
export type Category = (typeof CATEGORIES)[number];

// ── Site Settings ─────────────────────────────────────────────────────

export interface SiteSettings {
  heroImage: string;
  logoImage: string;
  whatsappNumber: string;
  instagramUrl: string;
  email: string;
  phone: string;
  address: string;
  showroomHours: string;
  aboutText: string;
  aboutHeroImage: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroImage: '/images/products/regenerated_image_1779296299562.png',
  logoImage: '/images/logo.jpg',
  whatsappNumber: '917359747911',
  instagramUrl: 'https://www.instagram.com/rachit__creation/',
  email: 'rachitcreation@gmail.com',
  phone: '+91 73597 47911',
  address: 'Surat, Gujarat, India',
  showroomHours: 'Mon - Sat: 10:00 AM - 8:00 PM',
  aboutText: `RACHIT CREATION is a premier luxury lehenga brand based in Surat, Gujarat. We specialize in crafting exquisite bridal, designer, girlish, and heavy lehengas that celebrate the artistry of Indian craftsmanship.

Each piece is meticulously handcrafted using premium fabrics and adorned with intricate Zari, Zardozi, Kundan, and stone work. Our master artisans pour their heart and soul into every stitch, ensuring that each lehenga is a masterpiece worthy of your most special celebrations.

From opulent bridal ensembles to contemporary designer pieces, our collections are curated to help every woman feel like royalty on her special day.`,
  aboutHeroImage: '/images/products/regenerated_image_1779377157645.png',
};

// ── Testimonials ──────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
}

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Priya Sharma',
    location: 'Mumbai',
    text: 'Absolutely stunning bridal lehenga! The craftsmanship is beyond anything I\'ve seen. Rachit Creation made my wedding day truly special.',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Ananya Patel',
    location: 'Ahmedabad',
    text: 'The designer lehenga I ordered was even more beautiful in person. The attention to detail and the quality of embroidery is exceptional.',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Sneha Reddy',
    location: 'Hyderabad',
    text: 'I ordered a heavy lehenga for my sister\'s wedding and the entire family was in awe. The colors, the fabric, the work — everything was perfect.',
    rating: 5,
  },
  {
    id: 't4',
    name: 'Riya Mehta',
    location: 'Surat',
    text: 'Being local to Surat, I visited their showroom and the collection blew me away. The staff was incredibly helpful.',
    rating: 5,
  },
  {
    id: 't5',
    name: 'Kavya Singh',
    location: 'Delhi',
    text: 'Ordered online and was nervous, but the lehenga arrived exactly as shown. Fast WhatsApp communication and timely delivery. Highly recommend!',
    rating: 5,
  },
  {
    id: 't6',
    name: 'Divya Joshi',
    location: 'Bangalore',
    text: 'The girlish collection is perfect for young women. My daughter loved her lehenga for the engagement ceremony. Elegant yet modern.',
    rating: 5,
  },
];

// ── Utility Functions ─────────────────────────────────────────────────

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function getWhatsAppLink(number: string, message?: string): string {
  const cleanNumber = number.replace(/[^0-9]/g, '');
  const encodedMsg = message ? `&text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${cleanNumber}?${encodedMsg}`;
}

export function getWhatsAppOrderLink(
  number: string,
  productName: string,
  price: number
): string {
  const msg = `Hi! I'm interested in ordering:\n\n*${productName}*\nPrice: ${formatPrice(price)}\n\nPlease share more details.`;
  return getWhatsAppLink(number, msg);
}
