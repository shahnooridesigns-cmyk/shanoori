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
import { isSample, publicSlug } from '../seo';

/** Placeholder projects are not shown anywhere, and every project carries its published address. */
const forSite = (projects: ProjectSummary[] | null) =>
  (projects ?? []).filter((p) => !isSample(p._id)).map((p) => ({ ...p, slug: publicSlug(p.slug, p.title) }));

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
      ...project,
      slug: publicSlug(project.slug, project.title),
      // A placeholder review is not this project's
      review: project.review && !isSample(project.review._id) ? project.review : null,
    };
  }
);

export const fetchClients = cache(
  async (): Promise<ClientLogo[]> => ((await load(getAllClients)) ?? []).filter((c: ClientLogo) => !isSample(c._id))
);

export const fetchFeaturedReviews = cache(
  async (): Promise<Review[]> =>
    ((await load(getFeaturedReviews)) ?? [])
      .filter((review: Review) => !isSample(review._id))
      .map((review: Review) => {
        // A review never links to a hidden project, and links use the project's published address
        if (!review.projectSlug || (review.projectId && isSample(review.projectId))) return { ...review, projectSlug: undefined, projectName: undefined };
        return { ...review, projectSlug: publicSlug(review.projectSlug, review.projectName ?? '') };
      })
);

/**
 * Page copy: the Studio document (a singleton whose _id is its type name) laid over the
 * built-in defaults. If Sanity can't be reached the page still renders with the defaults.
 */
const pageContent = <T>(id: string, defaults: T) =>
  cache(async (): Promise<T> => {
    try {
      return resolveContent(defaults, await load(`*[_id == $id][0]`, { id }));
    } catch (error) {
      console.error(`Could not load "${id}" content from Sanity, using defaults`, error);
      return defaults;
    }
  });

export const fetchSharedContent = pageContent('sharedContent', sharedDefaults);
export const fetchHomeContent = pageContent('homePage', homeDefaults);
export const fetchAboutContent = pageContent('aboutPage', aboutDefaults);
export const fetchServicesContent = pageContent('servicesPage', servicesDefaults);
export const fetchProjectsContent = pageContent('projectsPage', projectsDefaults);
export const fetchContactContent = pageContent('contactPage', contactDefaults);
