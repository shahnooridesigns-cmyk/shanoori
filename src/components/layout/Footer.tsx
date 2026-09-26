import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../shared/Container';
import { resolveContact, toTelHref } from '@/lib/constants';
import { fetchSiteSettings } from '@/lib/sanity/fetch';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
];

export const Footer = async () => {
  const settings = await fetchSiteSettings();
  const { address, phone, email } = resolveContact(settings);
  const socials = [
    { name: 'Instagram', href: settings?.instagramUrl },
    { name: 'Facebook', href: settings?.facebookUrl },
  ].filter((s): s is { name: string; href: string } => Boolean(s.href));

  return (
    <footer className="overflow-hidden bg-black text-gold">
      <Container className="pt-20">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <Link href="/" aria-label="Shah Noori home" className="w-fit">
            <Image src="/logo-gold.png" alt="Shah Noori" width={104} height={124} className="h-28 w-auto" />
          </Link>

          <div className="grid grid-cols-2 gap-x-16 gap-y-10 sm:grid-cols-3">
            <nav className="flex flex-col gap-2 text-lg" aria-label="Footer">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="w-fit hover:opacity-75">
                  {link.name}
                </Link>
              ))}
            </nav>

            {socials.length > 0 && (
              <div className="flex flex-col gap-2 text-lg">
                {socials.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="w-fit hover:opacity-75">
                    {s.name}
                  </a>
                ))}
              </div>
            )}

            <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
              <a href={`mailto:${email}`} className="w-fit text-lg hover:opacity-75">{email}</a>
              <a href={toTelHref(phone)} className="w-fit hover:opacity-75">{phone}</a>
              <p className="whitespace-pre-line text-gold/80">{address}</p>
            </div>
          </div>
        </div>

        <p className="mt-16 text-sm text-gold/60">
          &copy; {new Date().getFullYear()} Shah Noori. All rights reserved.
        </p>
      </Container>

      {/* Oversized wordmark from the design, cropped by the bottom edge */}
      <p
        aria-hidden="true"
        className="mt-6 select-none whitespace-nowrap text-center font-medium leading-[0.8] text-white text-[19vw] translate-y-[8%]"
      >
        Shah Noori
      </p>
    </footer>
  );
};
