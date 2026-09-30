import React from 'react';
import Image from 'next/image';
import { Container } from './Container';
import { ArrowLink } from './ui';

/** "Ready to Elevate Your Space" banner shown above the footer on every page. */
export const CtaBanner = () => (
  <section className="relative overflow-clip bg-ink">
    <Image src="/images/cta.jpg" alt="" fill sizes="100vw" className="object-cover opacity-70" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" aria-hidden="true" />
    <Container className="relative flex min-h-[520px] md:min-h-[672px] flex-col items-center justify-center gap-6 py-24 text-center">
      <h2 className="text-5xl sm:text-6xl md:text-8xl font-medium leading-[0.95] text-gold">
        Ready to Elevate
        <br />
        Your Space
      </h2>
      <p className="text-lg text-gold/90">Let&apos;s create something memorable together</p>
      <ArrowLink href="/contact" className="text-white">Start a Project</ArrowLink>
    </Container>
  </section>
);
