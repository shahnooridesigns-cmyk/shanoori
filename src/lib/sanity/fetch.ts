import { cache } from 'react';
import { client } from './client';
import {
  getAllClients,
  getAllProjects,
  getFeaturedProjects,
  getFeaturedReviews,
  getProjectBySlug,
  getSiteSettings,
} from './queries';
import type { ClientLogo, ProjectDetail, ProjectSummary, Review, SiteSettings } from './types';
import {
  aboutDefaults,
  contactDefaults,
  homeDefaults,
  projectsDefaults,
  servicesDefaults,
  sharedDefaults,
} from '../content/defaults';
import { resolveContent } from '../content/resolve';
import { localize } from '../content/localize';
import { aboutAr, contactAr, homeAr, projectsAr, servicesAr, sharedAr } from '../content/defaults.ar';
import { getLocale } from '../locale.server';
import { isSample, publicSlug } from '../seo';

/** Placeholder projects are not shown anywhere, and every project carries its published address. */
const forSite = (projects: ProjectSummary[] | null) =>
  (projects ?? []).filter((p) => !isSample(p._id)).map((p) => inLanguage({ ...p, slug: publicSlug(p.slug, p.title) }));

/** On the Arabic site a testimonial shows its Arabic text and name where the Studio has them */
const reviewInLanguage = (review: Review): Review =>
  getLocale() !== 'ar'
    ? review
    : { ...review, reviewText: review.reviewTextAr?.trim() || review.reviewText, clientName: review.clientNameAr?.trim() || review.clientName };

/** On the Arabic site a project shows its Arabic title, location and description where the Studio has them */
const inLanguage = <P extends ProjectSummary>(project: P): P => {
  if (getLocale() !== 'ar') return project;
  const description = project.descriptionAr?.trim();
  return {
    ...project,
    title: project.titleAr?.trim() || project.title,
    location: project.locationAr?.trim() || project.location,
    ...(description ? { excerpt: description, description } : {}),
  };
};

/**
 * Sanity answers are kept in memory for a minute, so a visit usually needs no trip to Sanity
 * at all. An edit published in the Studio therefore shows on the site within about a minute.
 * Only finished answers are kept, never a request still in flight: on Cloudflare a request
 * must not wait on work started by a different one.
 */
const KEEP_MS = 60_000;
const kept = new Map<string, { at: number; value: unknown }>();
// As loosely typed as the Sanity client's own answer: each caller names the shape it expects
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loaded = any;
const load = async (query: string, params: Record<string, unknown> = {}): Promise<Loaded> => {
  const key = query + JSON.stringify(params);
  const hit = kept.get(key);
  if (hit && Date.now() - hit.at < KEEP_MS) return hit.value as Loaded;
  const value = await client.fetch(query, params);
  // A site this size asks a few dozen different questions; this only guards against runaway growth
  if (kept.size > 300) kept.clear();
  kept.set(key, { at: Date.now(), value });
  return value;
};

// cache() dedupes identical calls within a single request (e.g. layout, footer and page
// all needing site settings).
export const fetchSiteSettings = cache(
  async (): Promise<SiteSettings | null> => load(getSiteSettings)
);

export const fetchAllProjects = cache(
  async (): Promise<ProjectSummary[]> => forSite(await load(getAllProjects))
);

export const fetchFeaturedProjects = cache(
  async (): Promise<ProjectSummary[]> => forSite(await load(getFeaturedProjects))
);

export const fetchProjectBySlug = cache(
  async (slug: string): Promise<ProjectDetail | null> => {
    // Route params arrive as written in the address ("Fit%20out"); the stored slug is the plain text
    let plain = slug;
    try {
      plain = decodeURIComponent(slug);
    } catch {
      // Not valid encoding: look it up as given
    }
    let project: ProjectDetail | null = await load(getProjectBySlug, { slug: plain });
    if (!project) {
      // The address may be the tidy one the site made for a project whose stored slug is not usable
      const all: ProjectSummary[] = (await load(getAllProjects)) ?? [];
      const match = all.find((p) => publicSlug(p.slug, p.title) === plain);
      if (match) project = await load(getProjectBySlug, { slug: match.slug });
    }
    // A placeholder's address answers "page not found", like any project that does not exist
    if (!project || isSample(project._id)) return null;
    return {
      ...inLanguage(project),
      slug: publicSlug(project.slug, project.title),
      // A placeholder review is not this project's
      review: project.review && !isSample(project.review._id) ? reviewInLanguage(project.review) : null,
    };
  }
);

export const fetchClients = cache(
  async (): Promise<ClientLogo[]> => ((await load(getAllClients)) ?? []).filter((c: ClientLogo) => !isSample(c._id))
);

export const fetchFeaturedReviews = cache(
  async (): Promise<Review[]> =>
    ((await load(getFeaturedReviews)) ?? []).filter((review: Review) => !isSample(review._id)).map(reviewInLanguage)
);

/**
 * Page copy: the Studio document (a singleton whose _id is its type name) laid over the
 * built-in defaults. If Sanity can't be reached the page still renders with the defaults.
 */
const pageContent = <T>(id: string, defaults: T, arabic: unknown) => {
  const english = cache(async (): Promise<T> => {
    try {
      return resolveContent(defaults, await load(`*[_id == $id][0]`, { id }));
    } catch (error) {
      console.error(`Could not load "${id}" content from Sanity, using defaults`, error);
      return defaults;
    }
  });
  // The Arabic form in the Studio (same id plus "Ar"); nothing there yet is not an error
  const arabicDoc = cache(async (): Promise<unknown> => {
    try {
      return await load(`*[_id == $id][0]`, { id: `${id}Ar` });
    } catch (error) {
      console.error(`Could not load "${id}Ar" content from Sanity, using the built-in Arabic`, error);
      return null;
    }
  });
  // On the Arabic site: the built-in Arabic wording (defaults.ar.ts) over the page, then the
  // Studio's Arabic form over that. Photos and icons stay as resolved for the English page.
  return async (): Promise<T> => {
    if (getLocale() !== 'ar') return english();
    const [content, studioArabic] = await Promise.all([english(), arabicDoc()]);
    return localize(localize(content, arabic), studioArabic);
  };
};

export const fetchSharedContent = pageContent('sharedContent', sharedDefaults, sharedAr);
export const fetchHomeContent = pageContent('homePage', homeDefaults, homeAr);
export const fetchAboutContent = pageContent('aboutPage', aboutDefaults, aboutAr);
export const fetchServicesContent = pageContent('servicesPage', servicesDefaults, servicesAr);
export const fetchProjectsContent = pageContent('projectsPage', projectsDefaults, projectsAr);
export const fetchContactContent = pageContent('contactPage', contactDefaults, contactAr);
