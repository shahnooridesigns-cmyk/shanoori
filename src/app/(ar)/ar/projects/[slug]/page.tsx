import type { Metadata } from 'next';
import Page, { generateMetadata as pageMetadata } from '../../../../(site)/projects/[slug]/page';
import { setLocale } from '@/lib/locale.server';

// The Arabic address of this page: it sets the language, then renders the same page as English.
type Props = Parameters<typeof Page>[0];

export async function generateMetadata(props: Props): Promise<Metadata> {
  setLocale('ar');
  return pageMetadata(props);
}

export default function ArabicPage(props: Props) {
  setLocale('ar');
  return <Page {...props} />;
}
