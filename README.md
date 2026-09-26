# shah-noori-website
Portfolio website for Shah Noori Interior &amp; Fit-out (Doha, Qatar) — Next.js + Sanity CMS

## Getting Started

Copy `.env.local.example` to `.env.local` and fill in the Sanity project ID, then run the development server (Node.js 20.9+):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site and [http://localhost:3000/studio](http://localhost:3000/studio) for Sanity Studio.

## Project structure

- `src/app/(site)/` — public pages; `(site)/layout.tsx` adds the header, footer and WhatsApp button
- `src/app/studio/` — embedded Sanity Studio (no site chrome)
- `src/lib/sanity/` — client, GROQ queries, typed fetchers and types
- `sanity/schemaTypes/` — content schemas (project, client, review, siteSettings)

## Deployment Notes

- **Hosting**: deployed to Cloudflare Workers via OpenNext (`npm run cf:deploy`).
- **Content freshness**: site pages render per request (`dynamic = 'force-dynamic'` in `src/app/(site)/layout.tsx`), so Sanity edits appear without a redeploy.
- **Sanity CDN**: `useCdn` is on in production and off in development — the latter works around a local Windows DNS issue (ENOTFOUND on apicdn.sanity.io). Published edits can take up to ~60s to appear because of the CDN.
- **Sanity CORS**: add every site origin (e.g. `http://localhost:3000` and the production domain) under CORS origins with credentials in [sanity.io/manage](https://www.sanity.io/manage), or Studio login will fail.
