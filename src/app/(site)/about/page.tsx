import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/shared/Container';
import { PageHero } from '@/components/shared/PageHero';
import { ArrowLink, SectionLabel } from '@/components/shared/ui';
import { DivisionCards } from '@/components/shared/DivisionCards';
import { TrustedBy } from '@/components/shared/TrustedBy';
import { FaqSection } from '@/components/shared/FaqSection';
import { CountUp } from '@/components/shared/CountUp';
import { CtaBanner } from '@/components/shared/CtaBanner';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Shah Noori is an integrated construction and contracting company in Qatar, founded in 2022 with 15 years of experience and 100+ completed projects.',
};

const stats = [
  { value: '15+', text: '15 years of construction experience in Qatar, bringing proven expertise and industry knowledge to every project.' },
  { value: '100+', text: 'With 100+ completed projects, Shah Noori delivers reliable construction solutions with consistency and quality.' },
];

export default function AboutPage() {
  return (
    <main className="flex-1 w-full">
      <PageHero
        label="About Us"
        image="/images/hero-about.jpg"
        title={<>Integrated Construction &amp; Contracting Company in Qatar</>}
      >
        <ArrowLink href="/contact" className="mt-6 w-fit text-gold">Start a Project</ArrowLink>
      </PageHero>

      {/* Our Story */}
      <section className="bg-beige py-24 md:py-32">
        <Container>
          <SectionLabel tone="ink">Our Story</SectionLabel>
          <div className="mt-8 grid gap-10 lg:grid-cols-[400px_1fr] lg:gap-28">
            <div className="relative aspect-[443/644] overflow-hidden rounded-[32px] lg:max-h-[470px]">
              <Image src="/images/story-1.jpg" alt="Café interior fit-out by Shah Noori" fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col gap-8">
              <div className="space-y-4 text-xl md:text-2xl leading-snug text-ink">
                <p>
                  Established on 11 September 2022, Shah Noori brings together a strong foundation of construction expertise
                  and 15 years of professional experience in Qatar. Founded by Riyas N, the company has grown with a clear
                  focus on delivering reliable, high-quality construction solutions.
                </p>
                <p>
                  With 100+ projects completed, our experience spans the demands of diverse construction environments,
                  combining practical knowledge with disciplined project execution.
                </p>
              </div>
              <div className="relative aspect-square max-h-[440px] overflow-hidden rounded-[32px] lg:-ml-8">
                <Image src="/images/story-2.jpg" alt="Exhibition stand built by Shah Noori" fill sizes="(min-width: 1024px) 620px, 100vw" className="object-cover" />
              </div>
            </div>
          </div>

          <h2 className="mt-16 text-3xl md:text-4xl leading-tight text-maroon">
            Precision in Planning.
            <br />
            Excellence in Execution.
          </h2>
          <div className="mt-5 max-w-5xl space-y-3 text-lg md:text-xl leading-relaxed text-ink">
            <p>
              Every project begins with understanding its requirements, context, and objectives. At Shah Noori, we believe
              successful construction is built long before the first structure takes shape.
            </p>
            <p>
              Our approach is centred around precision planning, proactive communication, and uncompromising quality control.
              By maintaining close coordination throughout every stage, we ensure that decisions are clear, processes remain
              efficient, and every detail receives the attention it deserves.
            </p>
          </div>
        </Container>
      </section>

      {/* Stats, mission & vision, services */}
      <section className="bg-white py-24 md:py-32">
        <Container>
          <h2 className="text-brand-gradient w-fit text-4xl md:text-5xl leading-tight">
            Measured by
            <br />
            experience and trust
          </h2>
          <dl className="mt-12 flex flex-col gap-10 lg:ml-[35%]">
            {stats.map((s) => (
              <div key={s.value} className="grid items-center gap-4 sm:grid-cols-[320px_1fr]">
                <dt className="text-8xl md:text-[128px] font-medium leading-none tracking-tight text-ink"><CountUp value={s.value} /></dt>
                <dd className="max-w-sm text-lg md:text-xl leading-snug text-ink/80">{s.text}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-28 grid gap-4 md:grid-cols-2">
            <div className="bg-brand-gradient rounded-[28px] p-8 md:p-10 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.3)]">
              <h3 className="text-center text-3xl text-gold">Our Mission</h3>
              <p className="mt-6 text-xl leading-snug text-gold">
                To deliver high-quality and cost-effective services and products through a motivated and focused team, guided
                by sound engineering principles and ethical business practices.
              </p>
            </div>
            <div className="rounded-[28px] bg-white p-8 md:p-10 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.3)]">
              <h3 className="text-center text-3xl text-maroon">Our Vision</h3>
              <p className="mt-6 text-xl leading-snug text-maroon">
                To create new concepts of living, build lasting client trust and provide personalized solutions while becoming
                a leading provider of quality Electro-Mechanical and Engineering services globally.
              </p>
            </div>
          </div>

          <SectionLabel className="mt-28">Our Services</SectionLabel>
          <h2 className="text-brand-gradient mt-10 w-fit text-3xl md:text-4xl font-semibold">Complete Solutions Under One Roof</h2>
          <div className="mt-14">
            <DivisionCards />
          </div>
        </Container>
      </section>

      <TrustedBy />
      <FaqSection />
      <CtaBanner />
    </main>
  );
}
