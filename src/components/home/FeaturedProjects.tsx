import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../shared/Container';
import { fetchFeaturedProjects } from '@/lib/sanity/fetch';

export const FeaturedProjects = async () => {
  const featured = await fetchFeaturedProjects();

  return (
    <section className="py-24 bg-primary-50">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">Featured Projects</h2>
            <p className="text-foreground/70 text-lg">
              A glimpse into our recent successful completions across Doha.
            </p>
          </div>
          <Link href="/projects" className="text-primary-700 font-semibold hover:text-primary-900 flex items-center gap-2 whitespace-nowrap">
            View Portfolio &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featured.length > 0 ? featured.map((project) => (
            <Link key={project._id} href={`/projects/${encodeURIComponent(project.slug)}`} className="group block relative overflow-hidden rounded-2xl bg-white border border-primary-100 shadow-sm transition-shadow hover:shadow-md">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-primary-900">
                <Image
                  src={project.imageUrl || '/placeholder.svg'}
                  alt={project.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                />
              </div>
              <div className="p-6">
                <div className="text-sm font-semibold text-accent-700 mb-2 uppercase tracking-wide">{project.category}</div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">{project.title}</h3>
                {project.year && <p className="text-foreground/70">Completed in {project.year}</p>}
              </div>
            </Link>
          )) : (
            <p className="text-foreground/60 col-span-2 text-center py-12">No featured projects yet — mark a project as featured in Sanity Studio to display it here.</p>
          )}
        </div>
      </Container>
    </section>
  );
};
