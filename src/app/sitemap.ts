import type { MetadataRoute } from 'next';
import { SITE_URL, isSampleProject } from '@/lib/seo';
import { fetchAllProjects } from '@/lib/sanity/fetch';

// Built per request, so a project published in the Studio is listed straight away
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = (await fetchAllProjects().catch(() => [])).filter((project) => !isSampleProject(project._id));
  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/services`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/projects`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.7 },
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${encodeURIComponent(project.slug)}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
