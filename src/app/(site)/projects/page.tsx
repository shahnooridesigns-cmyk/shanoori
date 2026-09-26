import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/shared/Container';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import { fetchAllProjects } from '@/lib/sanity/fetch';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Civil, interior and MEP projects completed by Shah Noori across Qatar.',
};

export default async function ProjectsPage() {
  const projects = await fetchAllProjects();

  return (
    <main className="flex-1 py-20 w-full overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-6">Our Portfolio</h1>
          <p className="text-lg text-foreground/80">
            Explore our diverse range of successful projects completed across various sectors in Qatar.
          </p>
        </div>

        <ProjectsGrid initialProjects={projects} />
      </Container>
    </main>
  );
}
