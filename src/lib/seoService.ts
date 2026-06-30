import { useEffect } from 'react';
import type { SiteSettings } from './siteConfig';
import type { Product } from '../store';

// ── Canonical URL hook ────────────────────────────────────────────────
export function useCanonicalURL() {
  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    // Set canonical link based on the current window location to ensure it is valid for all pages
    const currentUrl = window.location.origin + window.location.pathname;
    link.setAttribute('href', currentUrl);
  }, []);
}

// ── JSON-LD Injection Helpers ─────────────────────────────────────────
export function injectJSONLD(id: string, schema: object) {
  let script = document.getElementById(id) as HTMLScriptElement;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(schema);
}

export function removeJSONLD(id: string) {
  const script = document.getElementById(id);
  if (script) {
    script.remove();
  }
}

// ── Schema Builders ───────────────────────────────────────────────────

export function getLocalBusinessSchema(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://raccreation.com/#store',
    'name': 'Rachit Creation',
    'image': settings.logoImage ? `https://raccreation.com${settings.logoImage}` : 'https://raccreation.com/images/logo.jpg',
    'telephone': settings.phone,
    'email': settings.email,
    'url': 'https://raccreation.com',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': settings.address,
      'addressLocality': 'Surat',
      'addressRegion': 'Gujarat',
      'postalCode': '395002',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '21.1901', // Surat coordinates
      'longitude': '72.8139'
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      'opens': '10:00',
      'closes': '20:00'
    },
    'sameAs': [
      settings.instagramUrl,
      settings.pinterestUrl,
      settings.twitterUrl
    ].filter(Boolean)
  };
}

export function getProductSchema(product: Product, settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'image': product.imageUrl,
    'description': product.description,
    'offers': {
      '@type': 'Offer',
      'url': `https://raccreation.com/product/${product.id}`,
      'priceCurrency': 'INR',
      'price': product.price,
      'availability': product.isSoldOut ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      'seller': {
        '@type': 'Organization',
        'name': 'Rachit Creation'
      }
    }
  };
}

export function getFAQSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.a
      }
    }))
  };
}

export function getBreadcrumbSchema(crumbs: { name: string; item: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': crumb.name,
      'item': crumb.item.startsWith('http') ? crumb.item : `https://raccreation.com${crumb.item}`
    }))
  };
}
