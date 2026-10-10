import React from 'react';
import Image from 'next/image';
import { ArrowLink } from './ui';
import { toDivisions } from '@/lib/services';
import { fetchSharedContent } from '@/lib/sanity/fetch';

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 shrink-0 text-[#B39A4C]" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 3 3 5-6" />
  </svg>
);

/** "Complete Solutions Under One Roof" cards (About page). */
export const DivisionCards = async () => {
  const divisions = toDivisions(await fetchSharedContent());

  return (
  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
    {divisions.map((d) => (
      <article key={d.id} className="card-reveal card-lift flex flex-col overflow-clip rounded-[32px] bg-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)]">
        <div className="relative aspect-[340/220] overflow-clip">
          <Image src={d.image || '/assets/images/placeholder.webp'} alt={d.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="img-settle object-cover" />
          <span className="absolute start-5 top-5 rounded-full bg-maroon px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
            {d.pill}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-8">
          <h3 className="text-2xl font-semibold text-ink">{d.title}</h3>
          <p className="mt-3 font-medium text-maroon">{d.tagline}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/70">{d.description}</p>
          <ul className="mt-6 flex flex-col gap-2.5">
            {d.highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 text-[15px] text-maroon">
                <Check />
                {h}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            <ArrowLink href={`/services#${d.id}`} className="text-maroon">{d.cta}</ArrowLink>
          </div>
        </div>
      </article>
    ))}
  </div>
  );
};
