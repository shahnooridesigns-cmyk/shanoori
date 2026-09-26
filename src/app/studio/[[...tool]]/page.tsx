import type { Metadata, Viewport } from 'next';
import { Studio } from './Studio';

export const dynamic = 'force-static';

// Inlined from next-sanity/studio's exports: importing them here would pull the whole
// Studio package into the server bundle.
export const metadata: Metadata = {
  title: 'Shah Noori Studio',
  robots: 'noindex',
  referrer: 'same-origin',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function StudioPage() {
  return <Studio />;
}
