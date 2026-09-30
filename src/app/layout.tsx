import type { Metadata } from "next";
import { Cabin } from "next/font/google";
import "./globals.css";

const cabin = Cabin({
  variable: "--font-cabin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Shah Noori Interior & Fit-out | Doha, Qatar",
    template: "%s | Shah Noori",
  },
  description:
    "Civil construction, interior fit-out and MEP works in Doha, Qatar. Explore Shah Noori's projects and services.",
};

// Site chrome (header, footer, WhatsApp button, smooth scroll) lives in (site)/layout.tsx
// so that the embedded Sanity Studio at /studio renders without it.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cabin.variable} h-full antialiased`}
    >
      {/* Extensions like Grammarly add attributes to <body> before React hydrates; ignore those
          (only this element's own attributes, not anything inside it) */}
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
