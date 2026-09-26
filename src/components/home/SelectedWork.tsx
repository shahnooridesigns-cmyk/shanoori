import React from 'react';
import { Container } from '../shared/Container';
import { ArrowLink, SectionLabel } from '../shared/ui';
import { WorkCarousel } from '../projects/WorkCarousel';
import { fetchFeaturedProjects } from '@/lib/sanity/fetch';

export const SelectedWork = async () => {
  const projects = await fetchFeaturedProjects();

  return (
    <section className="bg-beige py-24 md:py-40">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <SectionLabel>Projects</SectionLabel>
            <h2 className="text-brand-gradient w-fit text-5xl md:text-7xl font-medium leading-none">Selected Work</h2>
          </div>
          <p className="max-w-xs text-lg leading-snug text-maroon">
            A collection of spaces shaped through precision, craftsmanship, and integrated execution.
          </p>
        </div>

        <div className="mt-16 md:mt-28">
          <WorkCarousel projects={projects} />
        </div>

        <div className="mt-16 md:mt-24 flex justify-center">
          <ArrowLink href="/contact" className="text-maroon">Start a Project</ArrowLink>
        </div>
      </Container>
    </section>
  );
};
