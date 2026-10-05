import React from 'react';
import { Container } from '../shared/Container';
import { SectionLabel } from '../shared/ui';
import { StackedServices } from './StackedServices';
import { toDivisions } from '@/lib/services';
import { fetchHomeContent, fetchSharedContent } from '@/lib/sanity/fetch';

export const ServicesShowcase = async () => {
  const [{ services }, shared] = await Promise.all([fetchHomeContent(), fetchSharedContent()]);

  return (
    // overflow-clip (not hidden) trims the glows without breaking the sticky cards
    <section className="relative overflow-clip bg-black py-24 md:py-32">
      {/* Soft brand-coloured glows for the glass service cards to sit over */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-10%] top-[8%] h-[520px] w-[520px] rounded-full bg-rose/45 blur-[120px]" />
        <div className="absolute right-[22%] top-[38%] h-[420px] w-[420px] rounded-full bg-gold/25 blur-[130px]" />
        <div className="absolute bottom-[6%] right-[-6%] h-[560px] w-[560px] rounded-full bg-maroon/70 blur-[120px]" />
      </div>
      <Container className="relative grid gap-16 lg:grid-cols-[1fr_1.1fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionLabel tone="gold">Services</SectionLabel>
          <h2 className="mt-6 whitespace-pre-line text-5xl md:text-7xl font-medium leading-[0.95] text-gold">{services.heading}</h2>
          <p className="mt-10 max-w-md text-lg text-white/75">{services.text}</p>
        </div>

        <StackedServices divisions={toDivisions(shared)} />
      </Container>
    </section>
  );
};
