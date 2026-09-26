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

// cache() dedupes identical calls within a single request (e.g. layout, footer and page
// all needing site settings).
export const fetchSiteSettings = cache(
  async (): Promise<SiteSettings | null> => client.fetch(getSiteSettings)
);

export const fetchAllProjects = cache(
  async (): Promise<ProjectSummary[]> => (await client.fetch(getAllProjects)) ?? []
);

export const fetchFeaturedProjects = cache(
  async (): Promise<ProjectSummary[]> => (await client.fetch(getFeaturedProjects)) ?? []
);

export const fetchProjectBySlug = cache(
  async (slug: string): Promise<ProjectDetail | null> => client.fetch(getProjectBySlug, { slug })
);

export const fetchClients = cache(
  async (): Promise<ClientLogo[]> => (await client.fetch(getAllClients)) ?? []
);

export const fetchFeaturedReviews = cache(
  async (): Promise<Review[]> => (await client.fetch(getFeaturedReviews)) ?? []
);
