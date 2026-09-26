import React from 'react';
import { Container } from '../shared/Container';
import { ArrowLink, SectionLabel } from '../shared/ui';
import { ProcessScroll, type ProcessStep } from './ProcessScroll';

const steps: ProcessStep[] = [
  { title: 'Understand', sub: 'Brief · Site · Scope', text: 'We begin by understanding your vision, site conditions, and project objectives in detail.' },
  { title: 'Coordinate', sub: 'Planning · Engineering · Materials', text: 'We coordinate planning, engineering, and material selection to create a clear and efficient execution strategy.' },
  { title: 'Execute', sub: 'Civil · Fit-Out · MEP', text: 'Our teams execute with precision across civil construction, interior fit-out, and MEP works with strict quality control.' },
  { title: 'Handover', sub: 'Testing · Commissioning · Completion', text: 'We ensure everything is tested, commissioned, and completed to deliver a safe, functional, and ready-to-use space.' },
];

export const Process = () => (
  <section className="bg-black pb-24 md:pb-32" aria-labelledby="process-heading">
    <Container>
      <SectionLabel tone="gold">Process</SectionLabel>
      <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="process-heading" className="text-5xl md:text-7xl font-medium text-gold">How We Work</h2>
          <p className="mt-10 max-w-md text-lg text-white/75">A structured approach from the first conversation to final handover.</p>
        </div>
        <ArrowLink href="/contact" className="w-fit text-white">Start a Project</ArrowLink>
      </div>
    </Container>

    {/* Scroll-scrubbed frame sequence: pins to the screen while the four steps play through */}
    <div className="mt-16 md:mt-20">
      <ProcessScroll steps={steps} />
    </div>
  </section>
);
