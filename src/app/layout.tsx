import type { Metadata } from "next";
import { Cabin } from "next/font/google";
import "./globals.css";
import { SITE_URL, pageMeta } from "@/lib/seo";

const cabin = Cabin({
  variable: "--font-cabin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const DESCRIPTION =
  "Shah Noori is an interior fit-out, MEP and civil contracting company in Doha, Qatar. See our completed projects and services, and request a consultation.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMeta({ description: DESCRIPTION, path: "/" }),
  title: {
    default: "Shah Noori | Interior Fit-out, MEP & Civil Contractor in Doha, Qatar",
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
      className={`${cabin.variable} h-full antialiased`}
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
