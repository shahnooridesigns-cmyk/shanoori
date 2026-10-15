import type { Metadata } from 'next';
import { RibbonCutting } from './RibbonCutting';

// TEMPORARY (for the website's opening, October 2026): a ribbon the owner cuts to open the site.
// Not linked from anywhere and kept out of search results. To remove it, delete this folder.
export const metadata: Metadata = {
  title: 'Grand Opening',
  robots: { index: false, follow: false },
};

export default function InaugurationPage() {
  return <RibbonCutting />;
}
