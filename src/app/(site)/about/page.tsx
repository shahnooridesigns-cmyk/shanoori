import React from 'react';
import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import Image from 'next/image';
import { Container } from '@/components/shared/Container';
import { PageHero } from '@/components/shared/PageHero';
import { ArrowLink, SectionLabel } from '@/components/shared/ui';
import { DivisionCards } from '@/components/shared/DivisionCards';
import { TrustedBy } from '@/components/shared/TrustedBy';
import { FaqSection } from '@/components/shared/FaqSection';
import { CountUp } from '@/components/shared/CountUp';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { fetchAboutContent } from '@/lib/sanity/fetch';
import { paragraphs } from '@/lib/content/resolve';

export const metadata: Metadata = pageMeta({
  title: 'About Us | Interior Fit-out Company in Doha',
  description:
    'Shah Noori is an integrated construction and contracting company in Doha, Qatar, with 15+ years of experience in interior fit-out, MEP and civil works.',
  path: '/about',
});

export default async function AboutPage() {
  const { hero, story, approach, stats, mission, vision, services } = await fetchAboutContent();

  return (
    <main className="flex-1 w-full">
      <PageHero
        label="About Us"
        image={hero.image}
        title={hero.title}
      >
        <ArrowLink href="/contact" className="mt-6 w-fit text-gold">{hero.buttonLabel}</ArrowLink>
      </PageHero>

      {/* Our Story */}
      <section className="bg-beige py-24 md:py-32">
        <Container>
          <SectionLabel tone="ink">Our Story</SectionLabel>
          <div className="mt-8 grid gap-10 lg:grid-cols-[400px_1fr] lg:gap-28">
            <div className="card-reveal relative aspect-[443/644] overflow-clip rounded-[32px] lg:max-h-[470px]">
              <Image src={story.image1} alt="" fill sizes="(min-width: 1024px) 400px, 100vw" className="img-settle object-cover" />
            </div>
            <div className="flex flex-col gap-8">
              <div className="space-y-4 text-xl md:text-2xl leading-snug text-ink">
                {paragraphs(story.text).map((p, i) => <p key={i} className="text-reveal">{p}</p>)}
              </div>
              <div className="card-reveal relative aspect-square max-h-[440px] overflow-clip rounded-[32px] lg:-ml-8">
                <Image src={story.image2} alt="" fill sizes="(min-width: 1024px) 620px, 100vw" className="img-settle object-cover" />
              </div>
            </div>
          </div>

          <h2 className="mt-16 whitespace-pre-line text-3xl md:text-4xl font-semibold leading-tight text-maroon">{approach.heading}</h2>
          <div className="mt-5 max-w-5xl space-y-3 text-lg md:text-xl leading-relaxed text-ink">
            {paragraphs(approach.text).map((p, i) => <p key={i} className="text-reveal">{p}</p>)}
          </div>
        </Container>
      </section>

      {/* Stats, mission & vision, services */}
      <section className="bg-white py-24 md:py-32">
        <Container>
          <h2 className="text-brand-gradient w-fit whitespace-pre-line text-4xl md:text-5xl font-semibold leading-tight">{stats.heading}</h2>
          <dl className="mt-12 flex flex-col gap-10 lg:ml-[35%]">
            {stats.items.map((s, i) => (
              <div key={i} className="grid items-center gap-4 sm:grid-cols-[320px_1fr]">
                <dt className="text-reveal text-8xl md:text-[128px] font-medium leading-none tracking-tight text-ink"><CountUp value={s.value} /></dt>
                <dd className="text-reveal max-w-sm text-lg md:text-xl leading-snug text-ink/80">{s.text}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-28 grid gap-4 md:grid-cols-2">
            <div className="card-reveal card-lift bg-brand-gradient rounded-[28px] p-8 md:p-10 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.3)]">
              <h3 className="text-reveal text-center text-3xl text-gold">{mission.heading}</h3>
              <p className="text-reveal mt-6 whitespace-pre-line text-xl leading-snug text-gold">{mission.text}</p>
            </div>
            <div className="card-reveal card-lift rounded-[28px] bg-white p-8 md:p-10 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.3)]">
              <h3 className="text-reveal text-center text-3xl text-maroon">{vision.heading}</h3>
              <p className="text-reveal mt-6 whitespace-pre-line text-xl leading-snug text-maroon">{vision.text}</p>
            </div>
          </div>

          <SectionLabel className="mt-28">Our Services</SectionLabel>
          <h2 className="text-brand-gradient mt-10 w-fit text-3xl md:text-4xl font-semibold">{services.heading}</h2>
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
