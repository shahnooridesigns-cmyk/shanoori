import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
