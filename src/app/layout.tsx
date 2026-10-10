import type { Metadata } from "next";
import { Cabin, Tajawal } from "next/font/google";
import "./globals.css";
import { SITE_URL, pageMeta } from "@/lib/seo";

const cabin = Cabin({
  variable: "--font-cabin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Not fetched ahead: four font files at the top of every page held back everything else, and
// English pages only show a word or two of Arabic (the language switch). The browser fetches a
// weight when Arabic text needs it. (Declaring it again with preload in the Arabic layout did
// not help: its files were then fetched ahead on English pages too.)
const arabic = Tajawal({
  variable: "--font-arabic",
  subsets: ["arabic"],
  // Tajawal has no 600: semibold text uses its 700
  weight: ["400", "500", "700", "800"],
  preload: false,
});

const DESCRIPTION =
  "Shah Noori is an interior fit-out, MEP and civil contracting company in Doha, Qatar. See our completed projects and services, and request a consultation.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMeta({ description: DESCRIPTION, path: "/" }),
  title: {
    default: "Shah Noori | Interior Fit-out & MEP Contractor in Doha",
    template: "%s | Shah Noori",
  },
  applicationName: "Shah Noori",
  keywords: [
    "interior fit-out Qatar",
    "fit-out contractor Doha",
    "MEP contractor Qatar",
    "civil construction Qatar",
    "interior design Doha",
    "contracting company Qatar",
    "Shah Noori",
  ],
  formatDetection: { telephone: false },
};

// Site chrome (header, footer, WhatsApp button, smooth scroll) lives in (site)/layout.tsx
// so that the embedded Sanity Studio at /studio renders without it.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the preloader's boot script sets data-sn-preload on <html> before hydration
    <html
      lang="en"
      className={`${cabin.variable} ${arabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* Extensions like Grammarly add attributes to <body> before React hydrates; ignore those
          (only this element's own attributes, not anything inside it) */}
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
