import React from 'react';
import { Container } from './Container';
import { SectionLabel } from './ui';
import { FaqAccordion } from './FaqAccordion';

const faqs = [
  {
    q: 'What comes together in a Shah Noori project?',
    a: 'Civil construction, interior & fit-out, and MEP works are coordinated as one integrated project scope.',
  },
  {
    q: 'Where does a project begin?',
    a: 'With a conversation about your brief, site and budget. We then visit the site, review drawings and prepare a clear scope and estimate before any work starts.',
  },
  {
    q: 'How do the disciplines work together?',
    a: 'Our civil, fit-out and MEP teams plan together from day one, so structure, services and finishes are coordinated before execution, avoiding clashes, rework and delays.',
  },
  {
    q: 'What happens before handover?',
    a: 'Every system is tested and commissioned, snag items are closed out, and authority approvals are completed so you receive a safe, functional, ready-to-use space.',
  },
];

/** "Built on the Details." FAQ accordion shared by several pages. */
export const FaqSection = () => (
  <section className="bg-white py-24 md:py-32">
    <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
      <div className="flex flex-col gap-6">
        <SectionLabel>FAQ</SectionLabel>
        <h2 className="text-5xl md:text-6xl font-semibold leading-[1.05] text-ink">
          Built on
          <br />
          the Details.
        </h2>
        <p className="max-w-md text-lg text-ink/90">
          Every project is a balance of structure, systems, materials and execution. Here&apos;s how we bring the details together.
        </p>
      </div>

      <FaqAccordion faqs={faqs} />
    </Container>
  </section>
);
