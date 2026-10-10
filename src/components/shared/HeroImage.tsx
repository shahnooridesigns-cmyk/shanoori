"use client";

import Image, { type ImageLoaderProps } from 'next/image';

/**
 * Ready-made widths kept next to each hero photo in public/assets/images/hero
 * ("hero-home.w828.webp"). A new hero photo needs the same set made for it; without them the
 * photo still shows, at its full size.
 */
const READY_WIDTHS = [640, 828, 1200, 1920];
const READY_PHOTOS = ['hero-home', 'hero-about-v2', 'hero-projects', 'hero-services-v5'];

/**
 * Where a hero photo is fetched from, by width. Not through the site's own image resizer: on a
 * first request that takes a second or two, and browsers hold back the page's "main content
 * shown" moment until the big photo at the top has arrived.
 *  - the site's own hero photos: the ready-made file of the nearest width
 *  - Studio photos: Sanity's image service resizes them, and answers from its own network
 */
const heroLoader = ({ src, width, quality }: ImageLoaderProps) => {
  if (src.startsWith('https://cdn.sanity.io/')) {
    const url = new URL(src);
    url.searchParams.set('w', String(width));
    url.searchParams.set('fit', 'max');
    url.searchParams.set('auto', 'format');
    url.searchParams.set('q', String(quality ?? 75));
    return url.toString();
  }
  const name = src.match(/^\/assets\/images\/hero\/(.+)\.webp$/)?.[1];
  const ready = READY_WIDTHS.find((w) => w >= width);
  // Wider than the largest ready-made file, or a photo without them: the original
  if (!name || !READY_PHOTOS.includes(name) || !ready) return src;
  return `/assets/images/hero/${name}.w${ready}.webp`;
};

/** The photo behind a page's hero: fills its box, and is fetched first. */
export const HeroImage = ({ src, className }: { src: string; className?: string }) => (
  <Image loader={heroLoader} src={src} alt="" fill priority sizes="100vw" className={className} />
);
