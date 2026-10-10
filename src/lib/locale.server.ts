import { cache } from 'react';
import type { Locale } from './locale';

/**
 * The language of the page being rendered, for server components. React's cache() gives one
 * holder per request, so a value set at the top of a page or layout is seen by everything
 * rendered below it in that request, without passing a prop through every component.
 *
 * English is the default. The Arabic pages and layout (src/app/(ar)) call setLocale('ar')
 * before they render anything.
 */
const holder = cache((): { locale: Locale } => ({ locale: 'en' }));

export const setLocale = (locale: Locale) => {
  holder().locale = locale;
};

export const getLocale = (): Locale => holder().locale;
