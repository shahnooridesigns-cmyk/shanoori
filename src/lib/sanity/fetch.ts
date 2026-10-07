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
import { isSampleProject } from '../seo';

/** Placeholder projects are not shown anywhere on the site (see isSampleProject). */
const withoutSamples = (projects: ProjectSummary[] | null) => (projects ?? []).filter((p) => !isSampleProject(p._id));

// cache() dedupes identical calls within a single request (e.g. layout, footer and page
// all needing site settings).
export const fetchSiteSettings = cache(
  async (): Promise<SiteSettings | null> => client.fetch(getSiteSettings)
);

export const fetchAllProjects = cache(
  async (): Promise<ProjectSummary[]> => withoutSamples(await client.fetch(getAllProjects))
);

export const fetchFeaturedProjects = cache(
  async (): Promise<ProjectSummary[]> => withoutSamples(await client.fetch(getFeaturedProjects))
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
    const project: ProjectDetail | null = await client.fetch(getProjectBySlug, { slug: plain });
    // A placeholder's address answers "page not found", like any project that does not exist
    return project && !isSampleProject(project._id) ? project : null;
  }
);

export const fetchClients = cache(
  async (): Promise<ClientLogo[]> => (await client.fetch(getAllClients)) ?? []
);

export const fetchFeaturedReviews = cache(
  async (): Promise<Review[]> =>
    // A review of a hidden placeholder project keeps its words but loses the link to that project
    ((await client.fetch(getFeaturedReviews)) ?? []).map((review: Review) =>
      review.projectId && isSampleProject(review.projectId) ? { ...review, projectSlug: undefined, projectName: undefined } : review
    )
);

/**
 * Page copy: the Studio document (a singleton whose _id is its type name) laid over the
 * built-in defaults. If Sanity can't be reached the page still renders with the defaults.
 */
const pageContent = <T>(id: string, defaults: T) =>
  cache(async (): Promise<T> => {
    try {
      return resolveContent(defaults, await client.fetch(`*[_id == $id][0]`, { id }));
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
