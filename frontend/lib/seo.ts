/**
 * SEO Utilities for generating meta tags and structured data
 */

export interface SEOData {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

export interface ProductSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image: string;
  price: number;
  priceCurrency: string;
  availability: string;
  brand: {
    '@type': string;
    name: string;
  };
  offers: {
    '@type': string;
    price: number;
    priceCurrency: string;
    availability: string;
  };
}

export interface CategorySchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image: string;
  url: string;
}

export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
  contactPoint: {
    '@type': string;
    telephone: string;
    contactType: string;
  };
}

/**
 * Generate product schema for SEO
 */
export function generateProductSchema(product: any): ProductSchema {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image || '/placeholder.jpg',
    price: product.price,
    priceCurrency: 'USD',
    availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    brand: {
      '@type': 'Brand',
      name: 'MarmaraShop',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };
}

/**
 * Generate category schema for SEO
 */
export function generateCategorySchema(category: any): CategorySchema {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Category',
    name: category.name,
    description: category.description || `${category.name} products`,
    image: category.image || '/placeholder.jpg',
    url: `https://marmara.shop/categories/${category.slug}`,
  };
}

/**
 * Generate organization schema for SEO
 */
export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    name: 'MarmaraShop',
    url: 'https://marmara.shop',
    logo: 'https://marmara.shop/logo.png',
    description: 'Your trusted online marketplace for quality products',
    sameAs: [
      'https://www.facebook.com/marmara.shop',
      'https://twitter.com/marmara_shop',
      'https://instagram.com/marmara.shop',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-MARMARA',
      contactType: 'Customer Service',
    },
  };
}

/**
 * Generate breadcrumb schema for SEO
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Get canonical URL for a page
 */
export function getCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marmara.shop';
  return `${baseUrl}${path}`;
}

/**
 * Generate meta tags for a page
 */
export function generateMetaTags(seoData: SEOData) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marmara.shop';
  const url = seoData.url || baseUrl;
  const image = seoData.image || `${baseUrl}/og-image.jpg`;
  const type = seoData.type || 'website';

  return {
    title: seoData.title,
    description: seoData.description,
    canonical: url,
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      image: image,
      url: url,
      type: type,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      image: image,
    },
  };
}

/**
 * Generate product list schema
 */
export function generateProductListSchema(products: any[]) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://marmara.shop/products/${product.id}`,
      name: product.name,
      image: product.image,
      description: product.description,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
        availability: product.stock > 0 ? 'InStock' : 'OutOfStock',
      },
    })),
  };
}
