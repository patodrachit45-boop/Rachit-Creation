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
  googleMapsUrl: string;
  facebookPixelId: string;
  pinterestUrl: string;
  twitterUrl: string;
  defaultCraftingTime?: string;
  defaultOrigin?: string;
  defaultCustomization?: string;
  defaultEmbroidery?: string;
  defaultShipping?: string;
  quickFactsTitle?: string;
  labelCraftingTime?: string;
  labelOrigin?: string;
  labelCustomization?: string;
  labelEmbroidery?: string;
  labelShipping?: string;
  backlinksText?: string;
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
  googleMapsUrl: 'https://maps.app.goo.gl/ndARWqQaobT93CUb7',
  facebookPixelId: '',
  pinterestUrl: '',
  twitterUrl: '',
  defaultCraftingTime: '4 - 8 Weeks',
  defaultOrigin: 'Surat, Gujarat, India',
  defaultCustomization: 'Available on Request',
  defaultEmbroidery: 'Zari, Zardozi, Resham & Stones',
  defaultShipping: 'Worldwide Express Delivery',
  quickFactsTitle: 'Atelier Quick Facts',
  labelCraftingTime: 'Crafting Time',
  labelOrigin: 'Origin',
  labelCustomization: 'Customization',
  labelEmbroidery: 'Embroidery Handwork',
  labelShipping: 'Shipping',
  backlinksText: 'Rachit Creation | https://raccreation.com/\nBridal Lehengas Surat | https://raccreation.com/category/Bridal\nDesigner Lehengas Surat | https://raccreation.com/category/Designer',
};

// ── Blogs ─────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  createdAt: number;
}

export const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: 'blog1',
    title: 'How to Choose the Perfect Bridal Lehenga for Your Big Day',
    excerpt: 'Selecting a bridal lehenga is a monumental decision. Discover our curation guide on choosing colors, styles, and embroideries that highlight your personality.',
    content: `Selecting your bridal lehenga is one of the most exciting yet monumental styling decisions you will make for your wedding. With countless styles, fabrics, and embroideries available, it is easy to feel overwhelmed. Here is our master curation guide to help you find the lehenga of your dreams.

### 1. Identify Your Style
Are you a classic traditionalist who loves opulent, heavy embroidery, or do you prefer contemporary silhouettes with minimalist detailing? Clarifying your personal aesthetic is the first and most crucial step. Traditional brides often lean towards classic Zardozi and Kundan work, while modern brides may opt for metallic thread embroidery, lighter fabrics, and pastel shades.

### 2. Choose the Right Silhouette
Lehengas come in various cuts, including A-line, mermaid, flared, and panelled:
- **A-Line**: Fits at the waist and flares out gradually. Works beautifully on almost all body types.
- **Flared**: Features dramatic volume and multiple gathers. Ideal for brides who want a royal look.
- **Mermaid/Fish-cut**: Fitted from the waist to the knees and flares out at the bottom. Accentuates curves.

### 3. Select a Harmonious Color Palette
While classic crimson and maroon remain timeless choices, contemporary weddings feature diverse colors. Pastel pinks, blush gold, mint green, and deep jewel tones like royal blue and emerald have gained massive popularity. Choose a color that complements your skin undertones and the venue lighting.

### 4. Fabric Matters
The fabric of your lehenga dictates its drape and comfort. Heavy silk and velvet are perfect for winter weddings and create a structured, grand aesthetic. Lightweight fabrics like georgette, chiffon, and net drape gracefully, making them ideal for summer or destination weddings.

At Rachit Creation, we specialize in customizing lehengas to fit your body type, color preferences, and wedding theme. Drop us a message on WhatsApp or visit our showroom to begin designing your dream lehenga!`,
    imageUrl: '/images/products/regenerated_image_1779296299562.png',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
  },
  {
    id: 'blog2',
    title: 'The Exquisite Art of Zardozi and Zari Embroidery',
    excerpt: 'Explore the rich history and meticulous craftsmanship behind Zari and Zardozi work, the gold embroideries that adorn luxury lehengas.',
    content: `Indian bridal luxury is incomplete without the shimmering gold and silver details of Zari and Zardozi embroidery. These crafts have adorned royal garments for centuries, representing the peak of Indian textile craftsmanship.

### History of the Art
Zardozi, an ancient Persian craft meaning "gold sewing," was brought to India and flourished under the patronage of the Mughal emperors. Originally, genuine gold and silver wires (Zari) were woven onto rich silks, velvets, and brocades, and decorated with precious pearls and emeralds.

### The Crafting Process
Today, master artisans continue to practice this craft by hand. The fabric is stretched tightly over a large wooden frame, known as the *Adda*. Using specialized hooks, the artisan guides metallic threads, dabka, sequins, and stones onto the fabric. 

Every single flower petal, border pattern, and motif is hand-stitched. It takes multiple artisans anywhere from 100 to over 500 hours to complete a single heavy bridal lehenga at Rachit Creation.

### How to Maintain Zari and Zardozi Lehengas
Because metallic threads can tarnish when exposed to moisture and air:
- **Storage**: Never store your lehenga in a plastic bag. Wrap it in a pure white cotton muslin cloth.
- **Folding**: Fold the embroidery inward to prevent threads from catching.
- **Cleaning**: Only dry-clean when absolutely necessary, and ensure they specialize in luxury bridal wear.`,
    imageUrl: '/images/products/regenerated_image_1779377157645.png',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12, // 12 days ago
  }
];

// ── Team Members ──────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  displayOrder: number;
  createdAt: number;
}

export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team1',
    name: 'Mahesh Patodiya',
    role: 'FOUNDER & OWNER',
    imageUrl: 'https://zffuxuykmxnaedjokddm.supabase.co/storage/v1/object/public/product-images/products/1781108838743_e57tpv.png',
    displayOrder: 1,
    createdAt: Date.now(),
  },
  {
    id: 'team2',
    name: 'Rachit Patodiya',
    role: 'CO-OWNER & DIGITAL MARKETER',
    imageUrl: 'https://zffuxuykmxnaedjokddm.supabase.co/storage/v1/object/public/product-images/products/1781108879941_mxmmm6.jpeg',
    displayOrder: 2,
    createdAt: Date.now(),
  }
];

// ── FAQs ──────────────────────────────────────────────────────────────

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  createdAt: number;
}

export const DEFAULT_FAQS: FAQ[] = [
  {
    id: 'faq1',
    question: "Do you offer customization on lehengas?",
    answer: "Yes! At Rachit Creation, we specialize in high-end customization. We can modify color schemes, embroidery density, sleeve lengths, neckline cuts, and blouse sizes to fit your specific requests.",
    createdAt: Date.now()
  },
  {
    id: 'faq2',
    question: "How long does it take to deliver a custom bridal lehenga?",
    answer: "Custom bridal lehengas take approximately 4 to 8 weeks to craft, depending on the complexity of the hand embroidery (Zari, Zardozi, and hand stone work). We recommend placing orders well in advance of your wedding date.",
    createdAt: Date.now()
  },
  {
    id: 'faq3',
    question: "Do you ship worldwide?",
    answer: "Yes, we ship our luxury lehengas internationally to the US, UK, Canada, Australia, UAE, and other global destinations with trusted express shipping partners.",
    createdAt: Date.now()
  },
  {
    id: 'faq4',
    question: "Where is your showroom located in Surat?",
    answer: "Our physical showroom is located at Millennium Textile Market, Ring Road, Surat, Gujarat, India. You can find detailed directions using the Google Maps section below.",
    createdAt: Date.now()
  }
];

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
