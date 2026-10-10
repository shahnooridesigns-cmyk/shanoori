import { T } from '@/components/shared/T';
import React from 'react';
import { Container } from '../shared/Container';
import { ArrowLink, SectionLabel } from '../shared/ui';
import { WorkCarousel } from '../projects/WorkCarousel';
import { fetchFeaturedProjects, fetchHomeContent } from '@/lib/sanity/fetch';

export const SelectedWork = async () => {
  const [projects, { work, hero }] = await Promise.all([fetchFeaturedProjects(), fetchHomeContent()]);

  return (
    <section className="bg-beige py-24 md:py-32">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <SectionLabel><T k="label.projects" /></SectionLabel>
            <h2 className="text-brand-gradient w-fit whitespace-pre-line text-5xl md:text-7xl font-medium leading-none">{work.heading}</h2>
          </div>
          <p className="text-reveal max-w-xs text-lg leading-snug text-maroon">{work.text}</p>
        </div>

        <div className="mt-16 md:mt-28">
          <WorkCarousel projects={projects} />
        </div>

        <div className="mt-16 md:mt-24 flex justify-center">
          <ArrowLink href="/contact" className="text-maroon">{hero.buttonLabel}</ArrowLink>
        </div>
      </Container>
    </section>
  );
};
