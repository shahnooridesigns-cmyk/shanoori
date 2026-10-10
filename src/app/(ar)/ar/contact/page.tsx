import type { Metadata } from 'next';
import Page, * as page from '../../../(site)/contact/page';
import { setLocale } from '@/lib/locale.server';

// The Arabic address of this page: it sets the language, then renders the same page as English.
export async function generateMetadata(): Promise<Metadata> {
  setLocale('ar');
  return page.generateMetadata();
}

export default function ArabicPage() {
  setLocale('ar');
  return <Page />;
}
