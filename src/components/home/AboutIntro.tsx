import React from 'react';
import { Container } from '../shared/Container';
import { SectionLabel } from '../shared/ui';

const stats = [
  { value: '100+', label: 'Completed Projects' },
  { value: '98%', label: 'Client Satisfaction' },
];

export const AboutIntro = () => (
  <section className="bg-beige pt-24 md:pt-32">
    <Container className="grid gap-10 lg:grid-cols-[250px_1fr]">
      <SectionLabel className="pt-2">About Us</SectionLabel>
      <div>
        <p className="max-w-3xl text-3xl md:text-[40px] leading-[1.1] text-ink">
          We are an integrated construction and contracting company delivering civil, interior &amp; fit-out, and complete
          MEP solutions with precision, reliability, and a commitment to quality.
        </p>
        <dl className="mt-16 md:mt-24 grid grid-cols-2 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2 text-center">
              <dt className="order-2 text-base md:text-lg text-ink/90">{stat.label}</dt>
              <dd className="order-1 text-6xl sm:text-8xl md:text-[140px] font-medium leading-none text-ink">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Container>
  </section>
);
