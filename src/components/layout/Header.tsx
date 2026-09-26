"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../shared/Container';
import { WhatsAppButton } from '../shared/WhatsAppButton';
import { WHATSAPP_NUMBER } from '@/lib/constants';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Projects', href: '/projects' },
  { name: 'Contact', href: '/contact' },
];

export const Header = ({ whatsapp = WHATSAPP_NUMBER }: { whatsapp?: string }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur shadow-sm">
      <Container className="flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.webp" 
            alt="Shah Noori Logo" 
            width={120} 
            height={40} 
            className="object-contain w-auto h-12"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-foreground/80 hover:text-primary-700 font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <WhatsAppButton className="!py-2 !px-4 !text-sm" phoneNumber={whatsapp} />
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          className="md:hidden flex flex-col items-center justify-center w-10 h-10 space-y-1.5 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className={`block w-6 h-0.5 bg-foreground transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-foreground transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-foreground transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </Container>

      {/* Mobile Nav Menu */}
      <div
        id="mobile-menu"
        // Collapsed menu must not be reachable by keyboard or screen readers
        inert={!isMobileMenuOpen}
        className={`md:hidden absolute top-20 left-0 w-full bg-background shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[400px] opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0'
        }`}
      >
        <Container className="flex flex-col py-4 gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-medium text-foreground/90 hover:text-primary-700 py-2"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 pb-2">
             <WhatsAppButton className="w-full justify-center" phoneNumber={whatsapp} />
          </div>
        </Container>
      </div>
    </header>
  );
};
