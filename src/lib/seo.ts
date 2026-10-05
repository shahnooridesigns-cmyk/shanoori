import type { Metadata } from 'next';

export const SITE_URL = 'https://sncreatives.com';
export const SITE_NAME = 'Shah Noori';
/** Picture shown when a link to the site is shared (1200x630, in /public/assets/images) */
export const SHARE_IMAGE = '/assets/images/og.jpg';

/**
 * Search and link-preview tags for one page: its own address as the canonical link, and the
 * title, text and picture that WhatsApp, Facebook, LinkedIn and X show for a shared link.
 * `title` is the short page name (the layout adds "| Shah Noori"); leave it out on the home page.
 */
export const pageMeta = ({
  title,
  description,
  path,
  image = SHARE_IMAGE,
}: {
  title?: string;
  description?: string;
  path: string;
  image?: string;
}): Metadata => {
  const shareTitle = title ? `${title} | ${SITE_NAME}` : undefined;
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_QA',
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
