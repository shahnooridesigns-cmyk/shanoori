import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../shared/Container';
import { resolveContact, toTelHref } from '@/lib/constants';
import { fetchSiteSettings } from '@/lib/sanity/fetch';

export const Footer = async () => {
  const { address, phone: primaryPhone, email } = resolveContact(await fetchSiteSettings());

  return (
    <footer className="bg-primary-950 text-white pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.webp" 
                alt="Shah Noori Logo" 
                width={150} 
                height={50} 
                className="object-contain w-auto h-12 brightness-0 invert"
              />
            </Link>
            <p className="text-white/70 max-w-sm">
              Premium Interior & Fit-out services based in Doha, Qatar. Building excellence through precision and passion.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-accent-300">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-white/70 hover:text-white transition-colors w-fit">Home</Link>
              <Link href="/about" className="text-white/70 hover:text-white transition-colors w-fit">About Us</Link>
              <Link href="/services" className="text-white/70 hover:text-white transition-colors w-fit">Services</Link>
              <Link href="/projects" className="text-white/70 hover:text-white transition-colors w-fit">Projects</Link>
              <Link href="/contact" className="text-white/70 hover:text-white transition-colors w-fit">Contact</Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-accent-300">Contact Us</h3>
            <div className="flex flex-col gap-2 text-white/70">
              <p className="whitespace-pre-line">{address}</p>
              <p>
                <a href={toTelHref(primaryPhone)} className="hover:text-white transition-colors">{primaryPhone}</a>
              </p>
              <p>
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Shah Noori Interior & Fit-out. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};
