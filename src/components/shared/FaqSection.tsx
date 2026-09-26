import React from 'react';
import { Container } from './Container';
import { SectionLabel } from './ui';

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

      <div className="border-b border-ink/70">
        {faqs.map((faq, i) => (
          <details key={faq.q} open={i === 0} className="group border-t border-ink/70">
            <summary className="flex cursor-pointer items-center justify-between gap-6 py-8 text-lg text-ink/80 hover:text-ink">
              {faq.q}
              <span className="relative h-4 w-4 shrink-0" aria-hidden="true">
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current transition-transform group-open:rotate-45" />
                <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform group-open:rotate-45" />
              </span>
            </summary>
            <p className="-mt-2 pb-8 pr-10 text-lg text-ink/75">{faq.a}</p>
          </details>
        ))}
      </div>
    </Container>
  </section>
);
