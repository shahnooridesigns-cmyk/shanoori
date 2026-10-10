import { SiteShell } from "@/components/layout/SiteShell";

// Render per request so Sanity edits appear without a redeploy. Without this, the Sanity
// fetches run once at build time and the pages stay frozen. Responses come from the Sanity
// CDN in production, so this stays cheap and needs no ISR cache on Cloudflare.
export const dynamic = 'force-dynamic';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
