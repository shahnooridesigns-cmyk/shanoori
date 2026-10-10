import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { Container } from '@/components/shared/Container';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { resolveWhatsAppNumber } from '@/lib/constants';
import { fetchAllProjects, fetchProjectBySlug, fetchSiteSettings } from '@/lib/sanity/fetch';
import type { ProjectDetail } from '@/lib/sanity/types';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { ArrowLink, SectionLabel } from '@/components/shared/ui';
import { ProjectGallery } from '@/components/projects/ProjectGallery';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { RiseText } from '@/components/shared/RiseText';
import { categoryLabel, projectKind } from '@/lib/categories';
import { SITE_NAME, SITE_URL, isSampleProject, pageMeta } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

/** The schema stores plain text, but older imported documents hold Portable Text blocks. */
/** Narrower than this, a photo looks soft when it fills the screen */
const FEATURE_MIN_WIDTH = 1500;

const descriptionToText = (description: ProjectDetail['description']) => {
  if (!description) return '';
  const text =
    typeof description === 'string'
      ? description
      : description
          .filter((block) => block._type === 'block')
          .map((block) => block.children?.map((child) => child.text ?? '').join('') ?? '')
          .join('\n\n');
  // Text left over from a seeded placeholder is not this project's story: show none until it is written
  return /^\s*sample project\b/i.test(text) ? '' : text;
};

/** The text search results show under the link: whole words only, ending on a sentence where one fits */
const metaDescription = (text: string) => {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (flat.length <= 158) return flat;
  const cut = flat.slice(0, 158);
  const sentenceEnd = cut.lastIndexOf('. ');
  return sentenceEnd > 80 ? cut.slice(0, sentenceEnd + 1) : `${cut.slice(0, cut.lastIndexOf(' '))}…`;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);
  if (!project) return {};

  const description = metaDescription(descriptionToText(project.description)) || undefined;
  return pageMeta({
    // The name alone says little to a search engine: add what kind of work it is and where
    title: `${project.title} | ${categoryLabel(project.category)} Project in ${project.location || 'Qatar'}`,
    description,
    path: `/projects/${encodeURIComponent(project.slug)}`,
    // A 1200x630 crop of the cover photo, the shape link previews use
    image: project.imageUrl ? `${project.imageUrl}?w=1200&h=630&fit=crop&auto=format` : undefined,
    noIndex: isSampleProject(project._id),
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;

  const [project, settings, all] = await Promise.all([
    fetchProjectBySlug(slug),
    fetchSiteSettings(),
    fetchAllProjects(),
  ]);

  if (!project) {
    notFound();
  }
  // An old or hand-typed address ("Fit%20out") moves to the project's published one
  let asked = slug;
  try {
    asked = decodeURIComponent(slug);
  } catch {
    // Not valid encoding: compare as given
  }
  if (asked !== project.slug) {
    permanentRedirect(`/projects/${encodeURIComponent(project.slug)}`);
  }

  const phoneNumber = resolveWhatsAppNumber(settings, project.category);
  const description = descriptionToText(project.description);
  const photos = (project.gallery ?? []).filter((img): img is { _key?: string; url: string; width?: number; height?: number } => Boolean(img?.url));
  const gallery = photos.map((img, i) => ({ key: img._key ?? `${i}-${img.url}`, url: img.url }));
  // The photo given the whole screen: the sharpest wide one. A tall or small photo would be
  // cropped hard or look soft at that size, so without a suitable one the section is left out.
  const feature = photos
    .filter((img) => (img.width ?? 0) >= FEATURE_MIN_WIDTH && (img.width ?? 0) / (img.height || 1) >= 1.2)
    .sort((a, b) => (b.width ?? 0) * (b.height ?? 0) - (a.width ?? 0) * (a.height ?? 0))[0];

  const facts = [
    { label: 'Category', value: projectKind(project) },
    { label: 'Client', value: project.client?.name, logoUrl: project.client?.logoUrl },
    { label: 'Location', value: project.location },
    { label: 'Year', value: project.year?.toString() },
  ].filter((f): f is { label: string; value: string; logoUrl?: string } => Boolean(f.value));
  const review = project.review;

  // Neighbours in portfolio order (wraps around) and related work from the same discipline
  const index = all.findIndex((p) => p._id === project._id);
  const prev = all.length > 1 && index !== -1 ? all[(index - 1 + all.length) % all.length] : undefined;
  const next = all.length > 1 && index !== -1 ? all[(index + 1) % all.length] : undefined;
  const related = all.filter((p) => p._id !== project._id && p.category === project.category).slice(0, 3);
  const discipline = categoryLabel(project.category);

  // Tells search engines what this page is: a piece of work by the company, and where it sits in the site
  const url = `${SITE_URL}/projects/${encodeURIComponent(project.slug)}`;
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      url,
      ...(description ? { description: description.slice(0, 300) } : {}),
      ...(project.imageUrl ? { image: [project.imageUrl, ...gallery.slice(0, 5).map((img) => img.url)] } : {}),
      ...(project.location ? { locationCreated: { '@type': 'Place', name: project.location } } : {}),
      ...(project.year ? { dateCreated: String(project.year) } : {}),
      genre: discipline,
      creator: { '@type': 'GeneralContractor', '@id': `${SITE_URL}/#business`, name: SITE_NAME },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE_URL}/projects` },
        { '@type': 'ListItem', position: 3, name: project.title, item: url },
      ],
    },
  ];

  return (
    <main className="flex-1 w-full">
      {!isSampleProject(project._id) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
        />
      )}
      {/* Full-screen hero with fact strip */}
      <section className="relative flex h-[100svh] min-h-[620px] max-h-[960px] flex-col overflow-clip bg-maroon">
        <div className="hero-drift absolute inset-0">
          <Image src={project.imageUrl || '/assets/images/placeholder.webp'} alt="" fill priority sizes="100vw" className="hero-zoom object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-maroon via-maroon/40 to-black/40" aria-hidden="true" />

        <Container className="relative flex flex-1 flex-col justify-end pt-32 pb-10">
          <nav aria-label="Breadcrumb" className="hero-in flex items-center gap-2 text-sm text-gold/80">
            <Link href="/projects" className="tap-area hover:text-gold">Projects</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="truncate">{project.title}</span>
          </nav>
          <h1 className="mt-6 max-w-5xl text-5xl sm:text-6xl md:text-8xl font-medium leading-[0.95] text-gold"><RiseText text={project.title} /></h1>

          {facts.length > 0 && (
            <dl className="hero-in mt-12 grid grid-cols-2 border-t border-gold/25 pt-6 md:grid-cols-4" style={{ '--i': 5 } as React.CSSProperties}>
              {facts.map((f) => (
                <div key={f.label} className="py-2 pr-6 md:border-l md:border-gold/25 md:pl-6 md:first:border-l-0 md:first:pl-0">
                  <dt className="text-xs uppercase tracking-[0.2em] text-white/55">{f.label}</dt>
                  <dd className="mt-2 flex items-center gap-3 text-lg text-white">
                    {f.logoUrl && (
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white">
                        <Image src={f.logoUrl} alt="" fill sizes="40px" className="object-contain p-1" />
                      </span>
                    )}
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </Container>
      </section>

      {/* Overview */}
      <section className="bg-beige py-24 md:py-32">
        <Container className="grid gap-14 lg:grid-cols-[1fr_360px] lg:gap-24">
          <div>
            <SectionLabel>Project Overview</SectionLabel>
            <p className="text-reveal mt-8 whitespace-pre-wrap text-2xl md:text-4xl leading-snug text-ink">
              {description || 'Full project details are coming soon.'}
            </p>
          </div>
          <aside className="h-fit lg:sticky lg:top-28">
            <div className="card-reveal bg-brand-gradient rounded-[28px] p-8 shadow-[0_24px_48px_-20px_rgba(87,19,45,0.6)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/70">Planning something similar?</p>
              <p className="mt-4 text-2xl leading-snug text-gold">
                Talk to our team about your {discipline.toLowerCase()} project.
              </p>
              <WhatsAppButton
                className="mt-8 w-full justify-center"
                message={`Hello Shah Noori, I saw your project "${project.title}" and would like to discuss something similar.`}
                phoneNumber={phoneNumber}
              />
              <ArrowLink href="/contact" className="mt-4 w-full justify-between text-gold">Request a consultation</ArrowLink>
            </div>
          </aside>
        </Container>
      </section>

      {/* One photo across the whole screen, easing back from a slight zoom as it scrolls in.
          overflow-clip (not hidden) keeps the zoom tied to the page's scroll. */}
      {feature && (
        <section className="relative h-[100svh] min-h-[480px] overflow-clip bg-black" aria-label="Featured photo">
          <Image src={feature.url} alt={`${project.title}, featured photo`} fill sizes="100vw" className="img-settle object-cover" />
        </section>
      )}

      {/* What the client said about this project */}
      {review && (
        <section className="bg-brand-gradient py-24 md:py-32">
          <Container>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/70">From the client</p>
            <blockquote className="mt-8 max-w-4xl text-2xl md:text-4xl leading-snug text-gold">
              &ldquo;{review.reviewText}&rdquo;
            </blockquote>
            <div className="mt-10 flex items-center gap-4">
              {review.photoUrl && (
                <span
                  className={`relative h-14 w-14 shrink-0 overflow-hidden bg-white ${review.photoIsLogo ? 'rounded-xl' : 'rounded-full'}`}
                >
                  <Image
                    src={review.photoUrl}
                    alt=""
                    fill
                    sizes="56px"
                    className={review.photoIsLogo ? 'object-contain p-1.5' : 'object-cover'}
                  />
                </span>
              )}
              <div className="leading-tight">
                <p className="text-lg text-white">{review.clientName}</p>
                {review.clientCompany && <p className="mt-1 text-sm text-white/70">{review.clientCompany}</p>}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="bg-white py-24 md:py-32">
          <Container>
            <div className="mb-12 flex items-end justify-between gap-6">
              <h2 className="text-brand-gradient w-fit text-5xl md:text-7xl font-medium leading-none">Gallery</h2>
              <p className="text-ink/60">
                {gallery.length} {gallery.length === 1 ? 'photo' : 'photos'} · click to enlarge
              </p>
            </div>
            <ProjectGallery images={gallery} title={project.title} />
            {/* Asked at the moment someone has just looked through the photos; the message names this project */}
            <div className="card-reveal mt-16 flex flex-col items-start justify-between gap-6 rounded-[28px] bg-cream p-8 md:flex-row md:items-center md:p-10">
              <div>
                <p className="text-2xl font-medium text-maroon md:text-3xl">Like what you see?</p>
                <p className="mt-2 text-ink/70">Ask us about {project.title} on WhatsApp. We usually reply the same day.</p>
              </div>
              <WhatsAppButton
                className="shrink-0"
                message={`Hello Shah Noori, I just looked at your project "${project.title}" on your website and would like to know more.`}
                phoneNumber={phoneNumber}
              />
            </div>
          </Container>
        </section>
      )}

      {/* Previous / next */}
      {prev && next && (
        <nav aria-label="More projects" className="grid bg-black md:grid-cols-2">
          {[
            { p: prev, label: '← Previous project', alignEnd: false },
            { p: next, label: 'Next project →', alignEnd: true },
          ].map(({ p, label, alignEnd }) => (
            <Link
              key={label}
              href={`/projects/${encodeURIComponent(p.slug)}`}
              className={`group relative flex min-h-[260px] flex-col justify-end overflow-hidden p-8 md:min-h-[340px] md:p-12 ${alignEnd ? 'md:items-end md:text-right' : ''}`}
            >
              <Image
                src={p.imageUrl || '/assets/images/placeholder.webp'}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover opacity-40 transition-all duration-700 group-hover:scale-105 group-hover:opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" aria-hidden="true" />
              <span className="relative text-xs uppercase tracking-[0.25em] text-gold/70">{label}</span>
              <span className="relative mt-3 text-3xl md:text-4xl font-medium text-gold">{p.title}</span>
              {p.location && <span className="relative mt-1 text-white/70">{p.location}</span>}
            </Link>
          ))}
        </nav>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-beige py-24 md:py-32">
          <Container>
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <SectionLabel>More {discipline} Work</SectionLabel>
                <h2 className="mt-4 text-4xl md:text-5xl font-semibold text-maroon">Related Projects</h2>
              </div>
              <ArrowLink href={`/projects?category=${project.category}`} className="w-fit text-maroon">
                View all {discipline.toLowerCase()} projects
              </ArrowLink>
            </div>
            <div className="grid auto-rows-[340px] gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProjectCard key={p._id} project={p} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBanner />
    </main>
  );
}
