import { createClient } from 'next-sanity';

// Public identifier (not a secret); the fallback keeps builds working when the env var isn't set.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ewurok0d';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2026-09-10';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // The Sanity CDN caches published content (~60s) and keeps per-request rendering cheap.
  // It is disabled in development only, as a workaround for a local Windows DNS issue
  // (ENOTFOUND on apicdn.sanity.io).
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
});
