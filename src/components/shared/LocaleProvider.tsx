"use client";

import React, { createContext, useContext } from 'react';
import NextLink from 'next/link';
import { localePath, type Locale } from '@/lib/locale';
import { ui, type UiKey } from '@/lib/content/ui';

const LocaleContext = createContext<Locale>('en');

/** Tells every client component below it which language the page is in (set once in SiteShell). */
export const LocaleProvider = ({ locale, children }: { locale: Locale; children: React.ReactNode }) => (
  <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
);

export const useLocale = () => useContext(LocaleContext);

/** Looks up a label in the page's language: const t = useT(); t('nav.home') */
export const useT = () => {
  const locale = useLocale();
  return (key: UiKey) => ui[locale][key];
};

/**
 * next/link that stays in the current language: on an Arabic page, href="/about" goes to
 * /ar/about. Used everywhere on the site in place of next/link.
 */
export const LocaleLink = ({ href, ...rest }: Omit<React.ComponentProps<typeof NextLink>, 'href'> & { href: string }) => {
  const locale = useLocale();
  return <NextLink href={localePath(locale, href)} {...rest} />;
};
