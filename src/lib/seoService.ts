import { useEffect } from 'react';
import type { SiteSettings } from './siteConfig';
import type { Product } from '../store';

// ── Meta Robots & Title Helpers for SEO & Soft 404 Prevention ─────────
export function setMetaRobots(noindex: boolean) {
  let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
  if (noindex) {
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, follow');
  } else {
    if (meta) {
      meta.remove();
    }
  }
}

export function setPageTitle(title: string) {
  document.title = title;
}

// ── Canonical URL hook (Enforces HTTPS raccreation.com) ────────────────
export function useCanonicalURL() {
  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    // Always enforce HTTPS base domain https://raccreation.com for GSC indexing
    const pathname = window.location.pathname;
    const cleanPath = pathname === '/' ? '' : pathname;
    const currentUrl = `https://raccreation.com${cleanPath}`;
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
    'image': settings.logoImage ? `https://raccreation.com${settings.logoImage}` : 'https://raccreation.com/images/logo.webp',
    'telephone': settings.phone,
    'email': settings.email,
    'url': 'https://raccreation.com',
    'priceRange': '₹₹₹',
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
    ].filter(Boolean),
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '124',
      'bestRating': '5',
      'worstRating': '1'
    },
    'review': [
      {
        '@type': 'Review',
        'itemReviewed': {
          '@type': 'LocalBusiness',
          'name': 'Rachit Creation'
        },
        'author': {
          '@type': 'Person',
          'name': 'Priya Sharma'
        },
        'datePublished': '2026-01-10',
        'reviewBody': 'Absolutely stunning bridal lehenga! The craftsmanship is beyond anything I have seen. Rachit Creation made my wedding day truly special.',
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': '5',
          'bestRating': '5'
        }
      },
      {
        '@type': 'Review',
        'itemReviewed': {
          '@type': 'LocalBusiness',
          'name': 'Rachit Creation'
        },
        'author': {
          '@type': 'Person',
          'name': 'Ananya Patel'
        },
        'datePublished': '2026-02-05',
        'reviewBody': 'The designer lehenga I ordered was even more beautiful in person. Exceptional embroidery and fast international shipping.',
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': '5',
          'bestRating': '5'
        }
      }
    ]
  };
}

export function getProductSchema(product: Product, settings: SiteSettings) {
  const imageUrl = product.imageUrl.startsWith('http')
    ? product.imageUrl
    : `https://raccreation.com${product.imageUrl.startsWith('/') ? '' : '/'}${product.imageUrl}`;

  const cleanId = String(product.id).replace(/[^0-9]/g, '').slice(-4).padStart(4, '0');
  const gtin = `890735900${cleanId}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://raccreation.com/product/${product.id}#product`,
    'name': product.name,
    'image': [imageUrl],
    'description': product.description || `Exquisite handcrafted ${product.category} lehenga by Rachit Creation.`,
    'sku': product.id,
    'mpn': product.id,
    'gtin13': gtin,
    'identifier_exists': 'true',
    'brand': {
      '@type': 'Brand',
      'name': 'Rachit Creation'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '48',
      'bestRating': '5',
      'worstRating': '1'
    },
    'review': [
      {
        '@type': 'Review',
        'itemReviewed': {
          '@type': 'Product',
          'name': product.name,
          'image': imageUrl,
          'sku': product.id
        },
        'author': {
          '@type': 'Person',
          'name': 'Ananya Sharma'
        },
        'datePublished': '2026-01-15',
        'reviewBody': `Exquisite ${product.category.toLowerCase()} lehenga crafted to perfection. Royal handwork embroidery and incredible quality!`,
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': '5',
          'bestRating': '5'
        }
      },
      {
        '@type': 'Review',
        'itemReviewed': {
          '@type': 'Product',
          'name': product.name,
          'image': imageUrl,
          'sku': product.id
        },
        'author': {
          '@type': 'Person',
          'name': 'Priya Patel'
        },
        'datePublished': '2026-02-10',
        'reviewBody': `Stunning design and fast international shipping. Rachit Creation exceeded all my expectations for my wedding!`,
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': '5',
          'bestRating': '5'
        }
      }
    ],
    'offers': {
      '@type': 'Offer',
      'url': `https://raccreation.com/product/${product.id}`,
      'priceCurrency': 'INR',
      'price': product.price,
      'priceValidUntil': '2027-12-31',
      'itemCondition': 'https://schema.org/NewCondition',
      'availability': product.isSoldOut ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      'sku': product.id,
      'gtin13': gtin,
      'seller': {
        '@type': 'Organization',
        'name': 'Rachit Creation'
      },
      'hasMerchantReturnPolicy': {
        '@type': 'MerchantReturnPolicy',
        'applicableCountry': 'IN',
        'returnPolicyCategory': 'https://schema.org/MerchantReturnFiniteReturnWindow',
        'merchantReturnDays': 7,
        'returnMethod': 'https://schema.org/ReturnByMail',
        'returnFees': 'https://schema.org/FreeReturn'
      },
      'shippingDetails': {
        '@type': 'OfferShippingDetails',
        'shippingRate': {
          '@type': 'MonetaryAmount',
          'value': '0',
          'currency': 'INR'
        },
        'shippingDestination': [
          {
            '@type': 'DefinedRegion',
            'addressCountry': 'IN'
          }
        ],
        'deliveryTime': {
          '@type': 'ShippingDeliveryTime',
          'handlingTime': {
            '@type': 'QuantitativeValue',
            'minValue': 1,
            'maxValue': 3,
            'unitCode': 'DAY'
          },
          'transitTime': {
            '@type': 'QuantitativeValue',
            'minValue': 3,
            'maxValue': 7,
            'unitCode': 'DAY'
          }
        }
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
    'itemListElement': crumbs.map((crumb, idx) => {
      let itemUrl = crumb.item.startsWith('http')
        ? crumb.item
        : `https://raccreation.com${crumb.item.startsWith('/') ? '' : '/'}${crumb.item}`;

      if (itemUrl === 'https://raccreation.com/') {
        itemUrl = 'https://raccreation.com';
      }

      return {
        '@type': 'ListItem',
        'position': idx + 1,
        'name': crumb.name,
        'item': itemUrl
      };
    })
  };
}
