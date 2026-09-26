'use client';

import dynamic from 'next/dynamic';

// Load the Studio (and the large `sanity` package) in the browser only. Server-rendering it
// adds ~1 MB to the Cloudflare worker, pushing it past the free plan's 3 MB limit, and the
// Studio renders nothing useful on the server anyway.
export const Studio = dynamic(
  async () => {
    const [{ NextStudio }, { default: config }] = await Promise.all([
      import('next-sanity/studio'),
      import('../../../../sanity.config'),
    ]);
    return function StudioClient() {
      return <NextStudio config={config} />;
    };
  },
  { ssr: false }
);
