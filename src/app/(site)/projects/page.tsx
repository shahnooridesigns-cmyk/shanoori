import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/shared/Container';
import { PageHero } from '@/components/shared/PageHero';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { fetchAllProjects } from '@/lib/sanity/fetch';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Civil, interior and MEP projects completed by Shah Noori across Qatar.',
};

export default async function ProjectsPage() {
  const projects = await fetchAllProjects();

  return (
    <main className="flex-1 w-full">
      <PageHero label="Projects" image="/images/story-2.jpg" title="Selected Work">
        <p className="max-w-xl text-lg text-gold/90">
          A collection of spaces shaped through precision, craftsmanship, and integrated execution across Qatar.
        </p>
      </PageHero>

      <section className="bg-beige py-20 md:py-28">
        <Container>
          <ProjectsGrid initialProjects={projects} />
        </Container>
      </section>

      <CtaBanner />
    </main>
  );
}
