import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/shared/Container';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { resolveWhatsAppNumber } from '@/lib/constants';
import { fetchProjectBySlug, fetchSiteSettings } from '@/lib/sanity/fetch';
import type { ProjectDetail } from '@/lib/sanity/types';

type Props = { params: Promise<{ slug: string }> };

/** The schema stores plain text, but older imported documents hold Portable Text blocks. */
const descriptionToText = (description: ProjectDetail['description']) => {
  if (!description) return '';
  if (typeof description === 'string') return description;
  return description
    .filter((block) => block._type === 'block')
    .map((block) => block.children?.map((child) => child.text ?? '').join('') ?? '')
    .join('\n\n');
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);
  if (!project) return {};

  const description = descriptionToText(project.description).slice(0, 160) || undefined;
  return {
    title: project.title,
    description,
    openGraph: project.imageUrl ? { images: [project.imageUrl] } : undefined,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;

  const [project, settings] = await Promise.all([
    fetchProjectBySlug(slug),
    fetchSiteSettings(),
  ]);

  if (!project) {
    notFound();
  }

  const phoneNumber = resolveWhatsAppNumber(settings, project.category);
  const description = descriptionToText(project.description);
  const gallery = (project.gallery ?? []).filter((img): img is { url: string } => Boolean(img?.url));

  return (
    <main className="flex-1 py-12 md:py-20 w-full overflow-hidden">
      <Container>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-foreground/60">
          <Link href="/projects" className="hover:text-primary-700 transition-colors">Projects</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-foreground/90 capitalize" aria-current="page">{project.title}</span>
        </nav>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
          <div className="max-w-3xl">
            <div className="text-sm font-semibold text-accent-700 mb-3 uppercase tracking-wide">{project.category}</div>
            <h1 className="text-3xl md:text-5xl font-bold text-primary-900 mb-4 capitalize">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-foreground/70">
              {project.client?.name && (
                <p><span className="font-semibold text-primary-900">Client:</span> {project.client.name}</p>
              )}
              {project.year && (
                <p><span className="font-semibold text-primary-900">Year:</span> {project.year}</p>
              )}
            </div>
          </div>
          <div>
            <WhatsAppButton
              message={`Hello Shah Noori, I am interested in learning more about the project: ${project.title}`}
              phoneNumber={phoneNumber}
            />
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-gray-100 mb-16">
          <Image
            src={project.imageUrl || '/placeholder.svg'}
            alt={project.title}
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-16">
          {/* Project Overview */}
          <div>
            <h2 className="text-2xl font-bold text-primary-900 mb-6">Project Overview</h2>
            <div className="max-w-none text-lg text-foreground/80 leading-relaxed">
              <p className="whitespace-pre-wrap">{description || 'Description coming soon.'}</p>
            </div>
          </div>

          {/* Project Gallery */}
          {gallery.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-primary-900 mb-6">Project Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {gallery.map((img, idx) => (
                  <div key={img.url} className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={img.url}
                      alt={`${project.title} gallery image ${idx + 1}`}
                      fill
                      sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
