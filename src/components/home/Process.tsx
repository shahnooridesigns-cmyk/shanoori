import React from 'react';
import Image from 'next/image';
import { Container } from '../shared/Container';
import { ArrowLink, SectionLabel } from '../shared/ui';

const steps = [
  { title: 'Understand', sub: 'Brief · Site · Scope', text: 'We begin by understanding your vision, site conditions, and project objectives in detail.' },
  { title: 'Coordinate', sub: 'Planning · Engineering · Materials', text: 'We coordinate planning, engineering, and material selection to create a clear and efficient execution strategy.' },
  { title: 'Execute', sub: 'Civil · Fit-Out · MEP', text: 'Our teams execute with precision across civil construction, interior fit-out, and MEP works with strict quality control.' },
  { title: 'Handover', sub: 'Testing · Commissioning · Completion', text: 'We ensure everything is tested, commissioned, and completed to deliver a safe, functional, and ready-to-use space.' },
];

export const Process = () => (
  <section className="bg-black pb-24 md:pb-32">
    <Container>
      <SectionLabel tone="gold">Process</SectionLabel>
      <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-5xl md:text-7xl font-medium text-gold">How We Work</h2>
          <p className="mt-10 max-w-md text-lg text-white/75">A structured approach from the first conversation to final handover.</p>
        </div>
        <ArrowLink href="/contact" className="w-fit text-white">Start a Project</ArrowLink>
      </div>

      <ol className="mx-auto mt-20 flex max-w-[864px] flex-col gap-1">
        {steps.map((step, i) => {
          const dark = i % 2 === 1;
          const bg = dark ? '#111111' : '#E9E7E3';
          return (
            <li
              key={step.title}
              className={`relative grid overflow-hidden md:min-h-[445px] md:grid-cols-[1fr_1.3fr] ${dark ? 'text-white' : 'text-ink'}`}
              style={{ backgroundColor: bg }}
            >
              <div className="relative z-10 flex gap-8 p-8 md:p-10 md:pr-0">
                <span className={`relative mt-2 w-px shrink-0 ${dark ? 'bg-white/50' : 'bg-ink/50'}`} aria-hidden="true">
                  <span className={`absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full ${dark ? 'bg-white' : 'bg-ink'}`} />
                </span>
                <div className="flex flex-col justify-center py-6">
                  <span className="text-8xl font-bold leading-none tracking-tighter">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-8 text-2xl font-medium uppercase tracking-[0.3em]">{step.title}</h3>
                  <p className="mt-4 text-lg">{step.sub}</p>
                  <p className={`mt-6 max-w-[230px] text-sm leading-relaxed ${dark ? 'text-white/75' : 'text-ink/70'}`}>{step.text}</p>
                </div>
              </div>
              <div className="relative min-h-[260px]">
                <Image src={`/images/process-${i + 1}.jpg`} alt="" fill sizes="(min-width: 768px) 490px, 100vw" className="object-cover" />
                {/* Blend the photo into the panel colour, as in the design */}
                <div
                  className="absolute inset-0 md:bg-[linear-gradient(90deg,var(--panel)_0%,transparent_35%)] bg-[linear-gradient(180deg,var(--panel)_0%,transparent_30%)]"
                  style={{ '--panel': bg } as React.CSSProperties}
                  aria-hidden="true"
                />
              </div>
            </li>
          );
        })}
      </ol>
    </Container>
  </section>
);
