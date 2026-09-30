"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '../shared/Container';
import { WhatsAppButton } from '../shared/WhatsAppButton';
import { WHATSAPP_NUMBER, toTelHref } from '@/lib/constants';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
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
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Per the design, the home page shows the full nav + phones; inner pages use a menu button.
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock page scroll while the menu is open
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled && !menuOpen ? 'bg-ink/80 backdrop-blur-md' : 'bg-transparent'
      }`}
      // Keeps the header still while page content fades between routes
      style={{ viewTransitionName: 'site-header' }}
    >
      <Container className="flex h-20 items-center justify-between gap-6">
        <Link href="/" className="relative z-50 shrink-0" aria-label="Shah Noori home">
          <Image src="/logo-gold.png" alt="Shah Noori" width={42} height={50} className="h-11 w-auto" priority />
        </Link>

        {isHome && (
          <nav className="hidden lg:flex items-center gap-9" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(pathname, link.href) ? 'page' : undefined}
                className={`text-gold transition-opacity hover:opacity-80 ${
                  isActive(pathname, link.href) ? 'font-semibold underline underline-offset-4' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        )}

        {isHome && phones.length > 0 && (
          <div className="hidden lg:flex flex-col items-end text-gold leading-tight">
            {phones.slice(0, 2).map((phone) => (
              <a key={phone} href={toTelHref(phone)} className="hover:opacity-80">
                {phone}
              </a>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          className={`relative z-50 flex h-10 w-10 flex-col items-end justify-center gap-2 ${isHome ? 'lg:hidden' : ''}`}
        >
          <span className={`block h-0.5 w-8 bg-gold transition-transform duration-300 ${menuOpen ? 'translate-y-[5px] rotate-45' : ''}`} />
          <span className={`block h-0.5 w-8 bg-gold transition-transform duration-300 ${menuOpen ? '-translate-y-[5px] -rotate-45' : ''}`} />
        </button>
      </Container>

      {/* Full-screen menu */}
      <div
        id="site-menu"
        inert={!menuOpen}
        className={`fixed inset-0 z-40 bg-brand-gradient transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <Container className="flex h-full flex-col justify-center gap-12 pt-20 pb-10">
          <nav className="flex flex-col gap-3" aria-label="Menu">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(pathname, link.href) ? 'page' : undefined}
                className={`text-4xl md:text-6xl font-semibold text-gold transition-opacity hover:opacity-80 ${
                  isActive(pathname, link.href) ? 'underline underline-offset-8' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-4 text-gold/90">
            {phones.slice(0, 2).map((phone) => (
              <a key={phone} href={toTelHref(phone)} className="text-lg hover:opacity-80">
                {phone}
              </a>
            ))}
            <WhatsAppButton className="w-fit" phoneNumber={whatsapp} />
          </div>
        </Container>
      </div>
    </header>
  );
};
