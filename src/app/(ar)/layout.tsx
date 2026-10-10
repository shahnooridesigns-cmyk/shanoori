import { SiteShell } from "@/components/layout/SiteShell";

// The Arabic site: the same pages as src/app/(site), served under /ar and laid out right to left.
export const dynamic = 'force-dynamic';

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="ar">{children}</SiteShell>;
}
