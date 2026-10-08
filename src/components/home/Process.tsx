import React from 'react';
import { Container } from '../shared/Container';
import { ArrowLink, SectionLabel } from '../shared/ui';
import { ProcessScroll } from './ProcessScroll';
import { homeDefaults } from '@/lib/content/defaults';
import { fetchHomeContent } from '@/lib/sanity/fetch';

export const Process = async () => {
  const { process, hero } = await fetchHomeContent();
  // The scroll-scrubbed sequence is cut for exactly four steps (see BOUNDARIES in ProcessScroll)
  const steps = process.steps.length === homeDefaults.process.steps.length ? process.steps : homeDefaults.process.steps;

  return (
    // Overlaps the section above by a pixel: on some screens its black backdrop stops a hair short
    // of its own edge, which showed as a thin beige line between the two
    <section className="relative -mt-px bg-black" aria-labelledby="process-heading">
      <Container>
        <SectionLabel tone="gold">Process</SectionLabel>
        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="process-heading" className="whitespace-pre-line text-5xl md:text-7xl font-medium text-gold">{process.heading}</h2>
            <p className="text-reveal mt-10 max-w-md text-lg text-white/75">{process.text}</p>
          </div>
          <ArrowLink href="/contact" className="w-fit text-white">{hero.buttonLabel}</ArrowLink>
        </div>
      </Container>

      {/* Scroll-scrubbed frame sequence: pins to the screen while the four steps play through */}
      <div className="mt-16 md:mt-20">
        <ProcessScroll steps={steps} />
      </div>
    </section>
  );
};
