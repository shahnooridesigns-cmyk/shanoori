import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { divisions } from '@/lib/services';

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 shrink-0 text-[#B39A4C]" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 3 3 5-6" />
  </svg>
);

/** "Complete Solutions Under One Roof" cards (About page). */
export const DivisionCards = () => (
  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
    {divisions.map((d) => (
      <article key={d.id} className="flex flex-col overflow-hidden rounded-[32px] bg-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)]">
        <div className="relative aspect-[340/220]">
          <Image src={d.image} alt={d.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
          <span className="absolute left-5 top-5 rounded-full bg-maroon px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
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
          <Link
            href={`/services#${d.id}`}
            className="mt-auto flex items-center gap-2 pt-8 text-sm font-bold uppercase tracking-wider text-maroon hover:opacity-75"
          >
            {d.cta} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>
    ))}
  </div>
);
