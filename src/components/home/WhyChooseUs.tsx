import React from 'react';
import { Container } from '../shared/Container';

const iconProps = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, className: 'h-5 w-5', 'aria-hidden': true } as const;

const reasons = [
  {
    title: 'Integrated Capability',
    text: 'Civil Construction, Interior & Fit-Out and MEP works under one company. Eliminates sub-contractor friction.',
    tag: 'Single Responsibility',
    icon: (
      <svg {...iconProps}><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /><rect x="15" y="3" width="6" height="6" rx="1" /><path d="M9 6h6M18 9v6" /></svg>
    ),
  },
  {
    title: 'Direct MEP Execution',
    text: 'Complete Mechanical, Electrical and Plumbing works, including installation, testing and commissioning without third-party delay.',
    tag: 'Direct Force',
    icon: (
      <svg {...iconProps}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" /></svg>
    ),
  },
  {
    title: 'Quality Workmanship',
    text: 'Professional execution with a focus on quality and consistency, abiding strictly by Qatar Construction Specifications (QCS).',
    tag: 'ISO & QCS Compliant',
    icon: (
      <svg {...iconProps}><circle cx="12" cy="9" r="6" /><path d="m9 14.5-1.5 7L12 19l4.5 2.5-1.5-7" /><path d="m12 6 .9 1.9 2.1.3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1-1.5-1.4 2.1-.3z" /></svg>
    ),
  },
  {
    title: 'End-to-End Execution',
    text: 'One reliable point of responsibility throughout the project life cycle, from early BIM spatial planning to final municipal sign-off.',
    tag: 'Turnkey Assurance',
    icon: (
      <svg {...iconProps}><path d="M12 12c-2-2.5-3.5-4-6-4a4 4 0 0 0 0 8c2.5 0 4-1.5 6-4zm0 0c2 2.5 3.5 4 6 4a4 4 0 0 0 0-8c-2.5 0-4 1.5-6 4z" /></svg>
    ),
  },
];

export const WhyChooseUs = () => (
  <section className="bg-beige pb-24 md:pb-32">
    <Container>
      <h2 className="text-brand-gradient w-fit text-4xl md:text-5xl font-semibold">Why Choose Us?</h2>
      <p className="mt-8 max-w-md text-lg leading-relaxed text-ink/70">
        End-to-end reliability in Qatar through sovereign-level quality control, unified responsibility, and localized engineering governance.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((reason) => (
          <article
            key={reason.title}
            className="flex flex-col rounded-[28px] bg-gradient-to-b from-[#E9DBA4] to-[#FDF8A6] p-8 shadow-[0_18px_30px_-12px_rgba(90,70,20,0.45)]"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-cream text-maroon shadow-sm">{reason.icon}</span>
            <h3 className="mt-6 text-xl font-semibold leading-tight text-maroon">{reason.title}</h3>
            <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink/75">{reason.text}</p>
            <p className="mt-6 flex items-center gap-2 border-t border-[#C9B274] pt-5 text-xs font-bold uppercase tracking-wider text-maroon">
              {reason.tag}
              <span aria-hidden="true">›</span>
            </p>
          </article>
        ))}
      </div>
    </Container>
  </section>
);
