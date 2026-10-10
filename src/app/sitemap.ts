import type { MetadataRoute } from 'next';
import { SITE_URL, isSampleProject } from '@/lib/seo';
import { fetchAllProjects } from '@/lib/sanity/fetch';
import { localePath } from '@/lib/locale';

// Built per request, so a project published in the Studio is listed straight away
export const dynamic = 'force-dynamic';

type Entry = MetadataRoute.Sitemap[number];

/** One page in both languages, each entry naming the other as its alternate */
const inBothLanguages = (path: string, rest: Pick<Entry, 'changeFrequency' | 'priority'>): Entry[] => {
  const address = (locale: 'en' | 'ar') => `${SITE_URL}${localePath(locale, path) === '/' ? '' : localePath(locale, path)}`;
  const languages = { en: address('en'), ar: address('ar') };
  return [
    { url: address('en'), ...rest, alternates: { languages } },
    { url: address('ar'), ...rest, alternates: { languages } },
  ];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = (await fetchAllProjects().catch(() => [])).filter((project) => !isSampleProject(project._id));
  return [
    ...inBothLanguages('/', { changeFrequency: 'weekly', priority: 1 }),
    ...inBothLanguages('/services', { changeFrequency: 'monthly', priority: 0.9 }),
    ...inBothLanguages('/projects', { changeFrequency: 'weekly', priority: 0.9 }),
    ...inBothLanguages('/about', { changeFrequency: 'monthly', priority: 0.7 }),
    ...inBothLanguages('/contact', { changeFrequency: 'yearly', priority: 0.7 }),
    ...projects.flatMap((project) =>
      inBothLanguages(`/projects/${encodeURIComponent(project.slug)}`, { changeFrequency: 'monthly', priority: 0.6 })
    ),
  ];
}
