/**
 * The site's two languages. English lives at the plain addresses (/about); Arabic is the same
 * site under /ar (/ar/about), laid out right to left.
 */
export type Locale = 'en' | 'ar';

export const AR_PREFIX = '/ar';

/** Which language an address belongs to */
export const localeOfPath = (pathname: string): Locale =>
  pathname === AR_PREFIX || pathname.startsWith(`${AR_PREFIX}/`) ? 'ar' : 'en';

/** The address without its language prefix: "/ar/about" → "/about", "/ar" → "/" */
export const stripLocale = (pathname: string) =>
  localeOfPath(pathname) === 'ar' ? pathname.slice(AR_PREFIX.length) || '/' : pathname;

/**
 * The same page in the given language. Only internal page addresses are changed; anything else
 * (https://…, mailto:, tel:, #anchor, files under /assets) is returned as it is.
 */
export const localePath = (locale: Locale, href: string) => {
  if (!href.startsWith('/') || href.startsWith('//') || /^\/(assets|api|studio|_next)\b/.test(href)) return href;
  const plain = stripLocale(href);
  if (locale === 'en') return plain;
  return plain === '/' ? AR_PREFIX : `${AR_PREFIX}${plain}`;
};

export const dirOf = (locale: Locale) => (locale === 'ar' ? 'rtl' : 'ltr');
