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

// cache() dedupes identical calls within a single request (e.g. layout, footer and page
// all needing site settings).
export const fetchSiteSettings = cache(
  async (): Promise<SiteSettings | null> => client.fetch(getSiteSettings)
);

export const fetchAllProjects = cache(
  async (): Promise<ProjectSummary[]> => forSite(await client.fetch(getAllProjects))
);

export const fetchFeaturedProjects = cache(
  async (): Promise<ProjectSummary[]> => forSite(await client.fetch(getFeaturedProjects))
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
    let project: ProjectDetail | null = await client.fetch(getProjectBySlug, { slug: plain });
    if (!project) {
      // The address may be the tidy one the site made for a project whose stored slug is not usable
      const all: ProjectSummary[] = (await client.fetch(getAllProjects)) ?? [];
      const match = all.find((p) => publicSlug(p.slug, p.title) === plain);
      if (match) project = await client.fetch(getProjectBySlug, { slug: match.slug });
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
  async (): Promise<ClientLogo[]> => ((await client.fetch(getAllClients)) ?? []).filter((c: ClientLogo) => !isSample(c._id))
);

export const fetchFeaturedReviews = cache(
  async (): Promise<Review[]> =>
    ((await client.fetch(getFeaturedReviews)) ?? [])
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
