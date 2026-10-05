import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    // The Studio (content editor) and the form endpoint are not pages for search results
    rules: { userAgent: '*', allow: '/', disallow: ['/studio', '/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
