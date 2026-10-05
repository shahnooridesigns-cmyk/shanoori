import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { ArrowLink, ArrowUpRight, SectionLabel } from '@/components/shared/ui';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { CountUp } from '@/components/shared/CountUp';
import { categoryLabel } from '@/lib/categories';
import { fetchAllProjects, fetchFeaturedProjects, fetchProjectsContent } from '@/lib/sanity/fetch';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Civil, interior and MEP projects completed by Shah Noori across Qatar.',
};

export default async function ProjectsPage() {
  const [projects, featured, content] = await Promise.all([fetchAllProjects(), fetchFeaturedProjects(), fetchProjectsContent()]);
  const spotlight = featured[0] ?? projects[0];
  const categoryCount = new Set(projects.map((p) => p.category)).size;
  const years = projects.map((p) => p.year).filter((y): y is number => typeof y === 'number');
  const since = years.length ? Math.min(...years) : undefined;

  const stats = [
    { value: String(projects.length).padStart(2, '0'), label: 'Projects showcased' },
    { value: String(categoryCount).padStart(2, '0'), label: 'Disciplines' },
    ...(since ? [{ value: String(since), label: 'Portfolio since' }] : []),
  ];

  return (
    <main className="flex-1 w-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-maroon">
        <Image src={spotlight?.imageUrl || '/images/story-2.webp'} alt="" fill priority sizes="100vw" className="scale-105 object-cover blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-maroon via-maroon/85 to-maroon/40" aria-hidden="true" />
        <Container className="relative flex min-h-[600px] flex-col justify-end gap-10 pt-36 pb-16">
          <SectionLabel tone="gold">Projects</SectionLabel>
          <h1 className="max-w-4xl whitespace-pre-line text-5xl sm:text-6xl md:text-8xl font-medium leading-[0.95] text-gold">
            {content.hero.heading}
          </h1>
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-lg text-white/80">{content.hero.text}</p>
            <dl className="flex gap-10 md:gap-14">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-sm text-white/60">{s.label}</dt>
                  <dd className="text-4xl md:text-5xl font-medium text-gold"><CountUp value={s.value} /></dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* Featured spotlight */}
      {spotlight && (
        <section className="bg-beige pt-20 md:pt-28">
          <Container>
            <Link
              href={`/projects/${encodeURIComponent(spotlight.slug)}`}
              className="group grid overflow-clip rounded-[32px] bg-maroon shadow-[0_30px_60px_-25px_rgba(60,40,10,0.6)] lg:grid-cols-[1.4fr_1fr]"
            >
              <div className="relative min-h-[320px] overflow-hidden lg:min-h-[460px]">
                <Image
                  src={spotlight.imageUrl || '/placeholder.svg'}
                  alt={spotlight.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-between gap-10 p-8 md:p-12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold/70">Featured Project</p>
                  <h2 className="mt-5 text-4xl md:text-5xl font-medium leading-tight text-gold">{spotlight.title}</h2>
                  {spotlight.location && <p className="mt-3 text-lg text-white/75">{spotlight.location}</p>}
                </div>
                <div className="flex items-end justify-between gap-6">
                  <dl className="grid grid-cols-2 gap-x-10 gap-y-4 text-white">
                    {[
                      { label: 'Category', value: categoryLabel(spotlight.category) },
                      { label: 'Client', value: spotlight.clientName },
                      { label: 'Year', value: spotlight.year?.toString() },
                    ]
                      .filter((f) => f.value)
                      .map((f) => (
                        <div key={f.label}>
                          <dt className="text-xs uppercase tracking-wider text-white/50">{f.label}</dt>
                          <dd className="mt-1">{f.value}</dd>
                        </div>
                      ))}
                  </dl>
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold text-maroon transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110">
                    <ArrowUpRight className="h-6 w-6" />
                  </span>
                </div>
              </div>
            </Link>
          </Container>
        </section>
      )}

      {/* All projects */}
      <section className="bg-beige pt-20 pb-24 md:pt-28 md:pb-32">
        <Container>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="text-brand-gradient w-fit text-5xl md:text-7xl font-medium leading-none">{content.list.heading}</h2>
            <ArrowLink href="/contact" className="w-fit text-maroon">{content.list.buttonLabel}</ArrowLink>
          </div>
          <ProjectsGrid initialProjects={projects} />
        </Container>
      </section>

      <CtaBanner />
    </main>
  );
}
