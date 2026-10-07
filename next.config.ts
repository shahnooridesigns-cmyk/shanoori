import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // SAMEORIGIN (not DENY) so the embedded Sanity Studio can still preview this site in iframes
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Hide the round "N" badge Next.js shows in the corner while developing (it never appears on the live site)
  devIndicators: false,
  images: {
    // Dev only: this machine's network resolves cdn.sanity.io to a NAT64 address (64:ff9b::/96),
    // which Next's SSRF guard treats as private. Production keeps the guard on.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        // All paths under the CDN are allowed — this covers all projects, clients, reviews
        pathname: '/images/**',
      },
    ],
  },
  async redirects() {
    return [
      // One address for the site: www moves to the bare domain
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.sncreatives.com' }],
        destination: 'https://sncreatives.com/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Keep the CMS out of search results
      { source: '/studio/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();
