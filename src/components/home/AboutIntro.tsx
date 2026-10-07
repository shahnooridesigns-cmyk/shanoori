import React from 'react';
import { Container } from '../shared/Container';
import { SectionLabel } from '../shared/ui';
import { CountUp } from '../shared/CountUp';
import { fetchHomeContent } from '@/lib/sanity/fetch';

/** Columns and number size for however many stats the Studio holds (the design shows two). */
const statLayout = (count: number) => {
  if (count <= 1) return { grid: 'grid-cols-1', number: 'text-7xl sm:text-8xl md:text-[140px]' };
  if (count === 2) return { grid: 'grid-cols-2', number: 'text-6xl sm:text-8xl md:text-[140px]' };
  if (count === 3) return { grid: 'grid-cols-3', number: 'text-4xl sm:text-7xl md:text-[104px]' };
  return { grid: 'grid-cols-2 lg:grid-cols-4', number: 'text-6xl sm:text-7xl lg:text-[84px]' };
};

export const AboutIntro = async () => {
  const { about } = await fetchHomeContent();
  const layout = statLayout(about.stats.length);

  return (
  <section className="bg-beige pt-24 md:pt-32">
    <Container className="grid gap-10 lg:grid-cols-[250px_1fr]">
      <SectionLabel className="pt-2">About Us</SectionLabel>
      <div>
        <p className="text-reveal max-w-3xl text-3xl md:text-[40px] leading-[1.1] text-ink">{about.text}</p>
        <dl className={`mt-16 md:mt-24 grid gap-x-8 gap-y-14 ${layout.grid}`}>
          {about.stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-start gap-2 text-left">
              <dt className="order-2 text-base md:text-lg text-ink/90">{stat.label}</dt>
              <dd className={`order-1 font-medium leading-none text-ink ${layout.number}`}><CountUp value={stat.value} /></dd>
            </div>
          ))}
        </dl>
      </div>
    </Container>
  </section>
  );
};
