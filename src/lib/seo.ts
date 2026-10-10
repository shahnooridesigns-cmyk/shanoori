import type { Metadata } from 'next';

export const SITE_URL = 'https://sncreatives.com';
export const SITE_NAME = 'Shah Noori';
import { localePath, type Locale } from './locale';
/** Picture shown when a link to the site is shared (1200x630, in /public/assets/images) */
export const SHARE_IMAGE = '/assets/images/og.jpg';

/**
 * Placeholder content seeded for the launch ("sample-…" ids: projects, clients, reviews) is hidden
 * from the whole site. The real project made from a sample document, and its client, are let
 * through. Delete this once the sample documents are gone from the dataset.
 */
const REAL_SAMPLE_IDS = ['sample-project-dunefield-cafe', 'sample-client-dunefield'];
/** Earlier test clients (alrawz, taiwofx, astron), made before the "sample-" naming */
const OLD_DUMMY_IDS = ['2d3a1a42-d08d-49cb-8dfb-1cf7f68b1c77', '447644fe-3b9f-481b-a81e-9fcd37c676ef', '724dcef7-f271-4b04-9a28-af89846abc69'];
export const isSample = (id: string) => (id.startsWith('sample-') && !REAL_SAMPLE_IDS.includes(id)) || OLD_DUMMY_IDS.includes(id);
export const isSampleProject = isSample;

const CLEAN_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * The address a project is published at. A slug typed by hand in the Studio can hold spaces or
 * capitals ("Fit out"); the site then uses one made from the title ("le-bebe") instead.
 */
export const publicSlug = (slug: string, title: string) => (CLEAN_SLUG.test(slug) ? slug : slugify(title) || slugify(slug) || slug);

/**
 * Search and link-preview tags for one page: its own address as the canonical link, and the
 * title, text and picture that WhatsApp, Facebook, LinkedIn and X show for a shared link.
 * `title` is the short page name (the layout adds "| Shah Noori"); leave it out on the home page.
 */
export const pageMeta = ({
  title,
  description,
  path: plainPath,
  image = SHARE_IMAGE,
  noIndex = false,
  locale = 'en',
  absoluteTitle = false,
}: {
  title?: string;
  description?: string;
  /** The page's English address, e.g. "/about"; the Arabic one is worked out from it */
  path: string;
  image?: string;
  /** true keeps the page out of search results */
  noIndex?: boolean;
  locale?: Locale;
  /** true when the title is already complete and must not get "| Shah Noori" added (home page) */
  absoluteTitle?: boolean;
}): Metadata => {
  const shareTitle = title ? (absoluteTitle ? title : `${title} | ${SITE_NAME}`) : undefined;
  const path = localePath(locale, plainPath);
  return {
    ...(title ? { title: absoluteTitle ? { absolute: title } : title } : {}),
    ...(description ? { description } : {}),
    // Each language names itself as the address to index, and points to the other one
    alternates: {
      canonical: path,
      languages: { en: localePath('en', plainPath), ar: localePath('ar', plainPath), 'x-default': localePath('en', plainPath) },
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: locale === 'ar' ? 'ar_QA' : 'en_QA',
      url: path,
      ...(shareTitle ? { title: shareTitle } : {}),
      ...(description ? { description } : {}),
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      ...(shareTitle ? { title: shareTitle } : {}),
      ...(description ? { description } : {}),
      images: [image],
    },
  };
};
