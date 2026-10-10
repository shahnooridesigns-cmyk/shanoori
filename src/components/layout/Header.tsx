"use client";

import React, { useEffect, useRef, useState } from 'react';
import { LocaleLink as Link } from '@/components/shared/LocaleProvider';
import { usePathname } from 'next/navigation';
import { Container } from '../shared/Container';
import { WhatsAppButton } from '../shared/WhatsAppButton';
import { WHATSAPP_NUMBER, toTelHref } from '@/lib/constants';
import { isOnDark } from '@/lib/backgroundTone';
import { localePath, stripLocale } from '@/lib/locale';
import type { UiKey } from '@/lib/content/ui';
import { useLocale, useT } from '../shared/LocaleProvider';

const navLinks: { key: UiKey; href: string }[] = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.about', href: '/about' },
  { key: 'nav.projects', href: '/projects' },
  { key: 'nav.services', href: '/services' },
  { key: 'nav.contact', href: '/contact' },
];

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

export const Header = ({
  whatsapp = WHATSAPP_NUMBER,
  phones = [],
}: {
  whatsapp?: string;
  phones?: string[];
}) => {
  const fullPath = usePathname();
  const locale = useLocale();
  const t = useT();
  // The page's address without the language prefix: the menu and its "current page" mark use this
  const pathname = stripLocale(fullPath);
  // The same page in the other language (a plain link: the whole page shell changes direction)
  const otherLanguage = localePath(locale === 'ar' ? 'en' : 'ar', pathname);
  // The menu remembers which page it was opened on, so it closes by itself as soon as the page
  // changes, however the change was started (a menu link, the page-change shutters, back/forward)
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null);
  const menuOpen = menuOpenOn === pathname;
  const setMenuOpen = (open: boolean) => setMenuOpenOn(open ? pathname : null);

  // The bar is clear glass, so its text takes the colour that reads on whatever is behind it:
  // gold over dark sections and photos, maroon over light ones. Checked as the page scrolls.
  const barRef = useRef<HTMLDivElement>(null);
  const [tone, setTone] = useState<'dark' | 'light'>('dark');
  useEffect(() => {
    let timer = 0;
    let again = false;
    const read = () => {
      timer = 0;
      const bar = barRef.current;
      const header = bar?.closest('header');
      if (bar && header) {
        const box = bar.getBoundingClientRect();
        const x = box.left + box.width / 2;
        const y = box.top + box.height / 2;
        const under = document.elementsFromPoint(x, y).find((el) => !header.contains(el));
        setTone(isOnDark(under ?? null, x, y) ? 'dark' : 'light');
      }
      if (again) {
        again = false;
        timer = window.setTimeout(read, 140);
      }
    };
    // Reading what is behind the bar makes the browser lay the page out, so while scrolling it
    // is done a few times a second (and once more when the scroll stops), never on every frame
    const queue = () => {
      if (timer) again = true;
      else timer = window.setTimeout(read, 140);
    };
    queue();
    // A moment later too: a new page's sections are in place only after it has rendered
    const settle = window.setTimeout(queue, 500);
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(settle);
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    };
  }, [pathname]);

  // Escape closes the menu
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpenOn(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    // A floating bar of clear glass: it only blurs what is behind it
    <header data-tone={tone} className="site-bar pointer-events-none fixed inset-x-0 top-3 z-40 md:top-4">
      {/* Anywhere outside the open menu closes it */}
      {menuOpen && <button type="button" aria-label={t('nav.closeMenu')} tabIndex={-1} onClick={() => setMenuOpen(false)} className="pointer-events-auto fixed inset-0 cursor-default" />}

      <Container className="relative">
        <div ref={barRef} className="glass-bar pointer-events-auto flex h-14 items-center justify-between gap-6 rounded-full ps-5 pe-3 md:h-16 md:ps-7 md:pe-4">
          <Link href="/" className="shrink-0" aria-label={t('nav.homeLink')}>
            {/* The mark, painted in the bar's text colour so it changes with it */}
            <span className="bar-logo block h-8 w-[27px] md:h-9 md:w-[30px]" aria-hidden="true" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label={t('nav.main')}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(pathname, link.href) ? 'page' : undefined}
                className={`nav-underline bar-text text-[15px] tracking-wide ${isActive(pathname, link.href) ? 'is-active' : 'opacity-85 hover:opacity-100'}`}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-2 lg:ms-0">
            <a
              href={otherLanguage}
              hrefLang={locale === 'ar' ? 'en' : 'ar'}
              lang={locale === 'ar' ? 'en' : 'ar'}
              aria-label={t('nav.switchLanguageLabel')}
              data-no-transition
              className="bar-pill lang-switch rounded-full border px-3.5 py-2 text-sm transition-colors"
            >
              {t('nav.switchLanguage')}
            </a>
            {phones.length > 0 && (
              <a href={toTelHref(phones[0])} dir="ltr" className="bar-pill hidden rounded-full border px-4 py-2 text-sm transition-colors lg:block">
                {phones[0]}
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className="flex h-10 w-10 flex-col items-center justify-center gap-[7px] rounded-full transition-colors hover:bg-white/10 lg:hidden"
          >
            <span className={`bar-line block h-px w-6 transition-transform duration-300 ${menuOpen ? 'translate-y-1 rotate-45' : ''}`} />
            <span className={`bar-line block h-px w-6 transition-transform duration-300 ${menuOpen ? '-translate-y-1 -rotate-45' : ''}`} />
          </button>
        </div>

        {/* The menu: a small glass panel that drops from the bar (phones and tablets) */}
        <div
          id="site-menu"
          inert={!menuOpen}
          className={`glass-bar absolute inset-x-5 top-full mt-3 origin-top rounded-[28px] p-6 transition-all duration-300 md:inset-x-10 lg:hidden ${
            menuOpen ? 'pointer-events-auto translate-y-0 scale-100 opacity-100' : 'pointer-events-none -translate-y-2 scale-[0.98] opacity-0'
          }`}
        >
          <nav className="flex flex-col" aria-label={t('nav.menu')}>
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(pathname, link.href) ? 'page' : undefined}
                className="bar-text bar-rule group flex items-center justify-between border-b py-4 text-2xl last:border-b-0"
              >
                <span className={`nav-underline ${isActive(pathname, link.href) ? 'is-active' : ''}`}>{t(link.key)}</span>
                <span className="text-xs tabular-nums opacity-50 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">{String(i + 1).padStart(2, '0')}</span>
              </Link>
            ))}
          </nav>
          <div className="bar-text mt-6 flex flex-wrap items-center justify-between gap-4">
            {phones.slice(0, 1).map((phone) => (
              <a key={phone} href={toTelHref(phone)} dir="ltr" className="tap-area hover:opacity-80">
                {phone}
              </a>
            ))}
            <WhatsAppButton className="!px-5 !py-2.5 text-sm" phoneNumber={whatsapp} />
          </div>
        </div>
      </Container>
    </header>
  );
};
