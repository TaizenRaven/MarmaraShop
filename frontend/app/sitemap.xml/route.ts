import { NextResponse } from 'next/server';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

/**
 * Generate sitemap.xml for SEO
 * GET /sitemap.xml
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marmara.shop';
  const today = new Date().toISOString().split('T')[0];

  const urls: SitemapUrl[] = [
    // Homepage
    {
      loc: `${baseUrl}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0,
    },
    // Products page
    {
      loc: `${baseUrl}/products`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9,
    },
    // Track order page
    {
      loc: `${baseUrl}/track-order`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.7,
    },
    // Static categories
    {
      loc: `${baseUrl}/categories/electronics`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      loc: `${baseUrl}/categories/clothing`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      loc: `${baseUrl}/categories/accessories`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      loc: `${baseUrl}/categories/home`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
    },
    // Sample product URLs (in real implementation, fetch from API)
    ...Array.from({ length: 10 }, (_, i) => ({
      loc: `${baseUrl}/products/${i + 1}`,
      lastmod: today,
      changefreq: 'weekly' as const,
      priority: 0.6,
    })),
  ];

  // Generate XML
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`
    )
    .join('')}
</urlset>`;

  return new NextResponse(xmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
