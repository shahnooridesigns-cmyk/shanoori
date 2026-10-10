import type { Metadata } from 'next';
import { tr, type UiKey } from './content/ui';
import { getLocale } from './locale.server';
import { pageMeta } from './seo';

/** Search and link-preview tags for one of the fixed pages, in the language being rendered */
export const metaFor = (page: 'home' | 'about' | 'services' | 'projects' | 'contact', path: string): Metadata => {
  const locale = getLocale();
  return pageMeta({
    title: tr(locale, `meta.${page}.title` as UiKey),
    description: tr(locale, `meta.${page}.description` as UiKey),
    path,
    locale,
    absoluteTitle: page === 'home',
  });
};
