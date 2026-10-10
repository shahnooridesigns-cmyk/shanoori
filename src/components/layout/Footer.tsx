import React from 'react';
import Image from 'next/image';
import { LocaleLink as Link } from '@/components/shared/LocaleProvider';
import { Container } from '../shared/Container';
import { FooterWordmark } from './FooterWordmark';
import { resolveContact, toTelHref } from '@/lib/constants';
import { fetchSiteSettings } from '@/lib/sanity/fetch';
import { tr, type UiKey } from '@/lib/content/ui';
import { getLocale } from '@/lib/locale.server';

const navLinks: { key: UiKey; href: string }[] = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.about', href: '/about' },
  { key: 'nav.projects', href: '/projects' },
  { key: 'nav.services', href: '/services' },
  { key: 'nav.contact', href: '/contact' },
];

const badgeIcon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'h-3 w-3' } as const;

/** Small badges that pop up beside a credit on hover, one per craft */
const badges = {
  // Pen tool: a nib with its anchor point
  design: (
    <svg {...badgeIcon}><path d="m12 19 7-7 3 3-7 7z" /><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18z" /><path d="m2 2 7.6 7.6" /><circle cx="11" cy="11" r="2" /></svg>
  ),
  // </>
  code: (
    <svg {...badgeIcon}><path d="m8 7-5 5 5 5" /><path d="m16 7 5 5-5 5" /><path d="m14 4-4 16" /></svg>
  ),
  // Megaphone, for the advertising agency
  advertising: (
    <svg {...badgeIcon}><path d="m3 11 18-5v12L3 14z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
  ),
};

/** Who made the site, shown beside the copyright line */
const credits: { role: UiKey; name: string; href: string; badge?: keyof typeof badges; flowing?: boolean }[] = [
  { role: 'footer.designedBy', name: 'Aadhil', href: 'https://www.linkedin.com/in/aaaadhileyyy', badge: 'design' },
  { role: 'footer.developedBy', name: 'Arshak P', href: 'https://www.linkedin.com/in/arshak-p', badge: 'code' },
  // flowing: the name is painted with the moving parrot-colour gradient (.flowing-colours in globals.css)
  { role: 'footer.poweredBy', name: 'Colourparrot', href: 'https://colourparrot.com/', badge: 'advertising', flowing: true },
];

export const Footer = async () => {
  const settings = await fetchSiteSettings();
  const locale = getLocale();
  const t = (key: UiKey) => tr(locale, key);
  const contact = resolveContact(settings);
  const { phone, email } = contact;
  // The built-in address ("Doha, Qatar") has an Arabic form; an address typed in the Studio is shown as typed
  const address = settings?.address?.trim() ? contact.address : t('footer.address');
  const socials = [
    { name: 'Instagram', href: settings?.instagramUrl },
    { name: 'Facebook', href: settings?.facebookUrl },
  ].filter((s): s is { name: string; href: string } => Boolean(s.href));

  return (
    // Fills the screen (see .footer-fill): links at the top, the wordmark and then the copyright line at the bottom
    <footer className="footer-fill flex flex-col overflow-hidden bg-black text-gold">
      <Container className="flex flex-1 flex-col pt-20">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <Link href="/" aria-label={t('nav.homeLink')} className="w-fit">
            <Image src="/assets/images/brand/logo-gold.webp" alt="Shah Noori" width={104} height={124} className="h-28 w-auto" />
          </Link>

          <div className="grid grid-cols-2 gap-x-16 gap-y-10 sm:grid-cols-3">
            <nav className="flex flex-col gap-2 text-lg" aria-label={t('nav.footer')}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="tap-area w-fit hover:opacity-75">
                  {t(link.key)}
                </Link>
              ))}
            </nav>

            {socials.length > 0 && (
              <div className="flex flex-col gap-2 text-lg">
                {socials.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="tap-area w-fit hover:opacity-75">
                    {s.name}
                  </a>
                ))}
              </div>
            )}

            <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
              <a href={`mailto:${email}`} className="tap-area w-fit text-lg hover:opacity-75">{email}</a>
              <a href={toTelHref(phone)} dir="ltr" className="tap-area w-fit hover:opacity-75">{phone}</a>
              <p className="whitespace-pre-line text-gold/80">{address}</p>
            </div>
          </div>
        </div>

      </Container>

      {/* Clips the wordmark at its own bottom edge: the letters rise out of it, and rest slightly cropped */}
      <div className="overflow-hidden">
        <FooterWordmark>Shah Noori</FooterWordmark>
      </div>

      {/* Copyright and credits close the footer on a strip in the wordmark's white */}
      <div className="bg-white">
      <Container className="py-5">
        {/* Phones: the right side stays clear for the floating buttons */}
        <div className="flex flex-col gap-3 pe-16 text-sm text-ink/70 md:flex-row md:pe-0 md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Shah Noori. {t('footer.rights')}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {credits.map((credit) => (
              <li key={credit.role}>
                {t(credit.role)}{' '}
                <a
                  href={credit.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`credit-link tap-area underline-offset-4 hover:underline ${
                    credit.flowing ? 'flowing-colours font-semibold decoration-maroon' : 'font-semibold text-maroon'
                  }`}
                >
                  {credit.name}
                  {credit.badge && (
                    <span className="credit-badge pointer-events-none absolute -end-5 -top-5 flex h-6 w-6 items-center justify-center rounded-full bg-maroon text-gold shadow-lg" aria-hidden="true">
                      {badges[credit.badge]}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      </div>
    </footer>
  );
};
