import { Tajawal } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";

// The Arabic font, fetched ahead on Arabic pages only (the root layout declares it without that)
const arabic = Tajawal({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
});

// The Arabic site: the same pages as src/app/(site), served under /ar and laid out right to left.
export const dynamic = 'force-dynamic';

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  // "contents": the box itself takes no part in the layout, it only hands the font down
  return (
    <div className={`${arabic.variable} contents`}>
      <SiteShell locale="ar">{children}</SiteShell>
    </div>
  );
}
