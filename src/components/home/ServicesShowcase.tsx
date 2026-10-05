import React from 'react';
import { Container } from '../shared/Container';
import { SectionLabel } from '../shared/ui';
import { StackedServices } from './StackedServices';
import { toDivisions } from '@/lib/services';
import { fetchHomeContent, fetchSharedContent } from '@/lib/sanity/fetch';

export const ServicesShowcase = async () => {
  const [{ services }, shared] = await Promise.all([fetchHomeContent(), fetchSharedContent()]);

  return (
    <section className="bg-black py-24 md:py-32">
      <Container className="grid gap-16 lg:grid-cols-[1fr_1.1fr]">
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
