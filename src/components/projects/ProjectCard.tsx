import React from 'react';
import Image from 'next/image';
import { LocaleLink as Link } from '@/components/shared/LocaleProvider';
import type { ProjectSummary } from '@/lib/sanity/types';
import { ProjectKind } from './ProjectKind';
import { ArrowUpRight } from '../shared/ui';

/** Photo card: zooms on hover and slides up client/year details (always shown on touch screens, which can't hover). Fills its parent's height. */
export const ProjectCard = ({
  project,
  sizes,
  large = false,
  index,
}: {
  project: ProjectSummary;
  sizes: string;
  large?: boolean;
  /** Optional running number shown in the corner ("01") */
  index?: number;
}) => {
  const details = [project.clientName, project.year].filter(Boolean).join(' · ');

  return (
    <Link
      href={`/projects/${encodeURIComponent(project.slug)}`}
      className="card-lift group relative block h-full min-h-[300px] overflow-clip rounded-[24px] bg-maroon shadow-[0_24px_48px_-20px_rgba(60,40,10,0.55)] focus-visible:outline-offset-4"
    >
      <Image
        src={project.imageUrl || '/assets/images/placeholder.webp'}
        alt={project.title}
        fill
        sizes={sizes}
        className="img-settle object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
      />
      {/* Readability fades: always at the bottom, fuller on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-maroon/95 via-maroon/30 to-transparent transition-opacity duration-500 group-hover:opacity-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-maroon via-maroon/70 to-maroon/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
        <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold backdrop-blur-md">
          <ProjectKind project={project} />
        </span>
        {index !== undefined && (
          <span className="text-sm font-medium text-white/70">{String(index + 1).padStart(2, '0')}</span>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
        <div className="min-w-0">
          <h3 className={`font-medium leading-tight text-white ${large ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
            {project.title}
          </h3>
          {project.location && <p className="mt-1 text-gold/90">{project.location}</p>}
          {details && (
            <p className="reveal-on-touch grid grid-rows-[0fr] text-sm text-white/80 transition-[grid-template-rows] duration-500 group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
              <span className="overflow-hidden">
                <span className="block pt-2">{details}</span>
              </span>
            </p>
          )}
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-maroon transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
};
