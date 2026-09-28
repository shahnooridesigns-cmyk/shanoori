import React from 'react';
import { Container } from '../shared/Container';
import { SectionLabel } from '../shared/ui';
import { StackedServices } from './StackedServices';
import { divisions } from '@/lib/services';

export const ServicesShowcase = () => (
  <section className="bg-black py-24 md:py-32">
    <Container className="grid gap-16 lg:grid-cols-[1fr_1.1fr]">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <SectionLabel tone="gold">Services</SectionLabel>
        <h2 className="mt-6 text-5xl md:text-7xl font-medium leading-[0.95] text-gold">
          What we
          <br />
          deliver
        </h2>
        <p className="mt-10 max-w-md text-lg text-white/75">
          We bring every stage of your project together — from construction and fit-out to complete MEP execution.
        </p>
      </div>

      <StackedServices divisions={divisions} />
    </Container>
  </section>
);
