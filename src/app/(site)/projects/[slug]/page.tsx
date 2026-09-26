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
import { CtaBanner } from '@/components/shared/CtaBanner';
import { SectionLabel } from '@/components/shared/ui';

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
  const gallery = (project.gallery ?? []).filter((img): img is { _key?: string; url: string } => Boolean(img?.url));

  const categoryLabel = project.category?.charAt(0).toUpperCase() + project.category?.slice(1);
  const facts = [
    { label: 'Category', value: categoryLabel },
    { label: 'Client', value: project.client?.name },
    { label: 'Location', value: project.location },
    { label: 'Year', value: project.year?.toString() },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

  return (
    <main className="flex-1 w-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-maroon">
        <Image src={project.imageUrl || '/placeholder.svg'} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon via-maroon/60 to-maroon/20" aria-hidden="true" />
        <Container className="relative flex min-h-[560px] flex-col justify-end gap-6 pt-32 pb-16">
          <nav aria-label="Breadcrumb" className="text-sm text-gold/80">
            <Link href="/projects" className="hover:text-gold">Projects</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span aria-current="page">{project.title}</span>
          </nav>
          <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-gold">{project.title}</h1>
          <div className="flex flex-wrap items-center gap-6">
            <WhatsAppButton
              message={`Hello Shah Noori, I am interested in learning more about the project: ${project.title}`}
              phoneNumber={phoneNumber}
            />
          </div>
        </Container>
      </section>

      {/* Overview */}
      <section className="bg-beige py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-20">
          <div>
            <SectionLabel>Project Overview</SectionLabel>
            <p className="mt-6 whitespace-pre-wrap text-xl md:text-2xl leading-snug text-ink">
              {description || 'Description coming soon.'}
            </p>
          </div>
          {facts.length > 0 && (
            <dl className="h-fit rounded-[28px] bg-white/70 p-8 shadow-[0_16px_32px_-16px_rgba(90,70,20,0.4)]">
              {facts.map((f) => (
                <div key={f.label} className="border-b border-maroon/15 py-4 first:pt-0 last:border-0 last:pb-0">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-maroon/70">{f.label}</dt>
                  <dd className="mt-1 text-lg text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </Container>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="bg-white py-20 md:py-28">
          <Container>
            <h2 className="text-brand-gradient w-fit text-4xl md:text-5xl font-medium">Project Gallery</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((img, idx) => (
                <div key={img._key ?? `${idx}-${img.url}`} className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_16px_32px_-16px_rgba(0,0,0,0.4)]">
                  <Image
                    src={img.url}
                    alt={`${project.title} gallery image ${idx + 1}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBanner />
    </main>
  );
}
