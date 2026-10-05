"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import type { ProjectSummary } from '@/lib/sanity/types';
import { ArrowUpRight } from '../shared/ui';

const caption = (p: ProjectSummary) => [p.title, p.location].filter(Boolean).join(' - ');

const SideCard = ({ project, label, onClick }: { project: ProjectSummary; label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="relative hidden aspect-[275/225] w-full overflow-hidden rounded-2xl shadow-[0_24px_40px_-12px_rgba(60,40,10,0.45)] transition-transform hover:scale-[1.02] md:block"
  >
    <Image src={project.imageUrl || '/placeholder.svg'} alt="" fill sizes="25vw" className="object-cover" />
  </button>
);

/** Round arrow sitting on the left or right edge of the main photo. */
const EdgeArrow = ({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={dir === 'prev' ? 'Previous project' : 'Next project'}
    className={`absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-maroon shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon md:h-12 md:w-12 ${
      dir === 'prev' ? 'left-3 md:-left-6' : 'right-3 md:-right-6'
    }`}
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      {dir === 'prev' ? <path d="m15 5-7 7 7 7" /> : <path d="m9 5 7 7-7 7" />}
    </svg>
  </button>
);

export const WorkCarousel = ({ projects }: { projects: ProjectSummary[] }) => {
  const [index, setIndex] = useState(0);
  const count = projects.length;
  if (count === 0) {
    return <p className="py-16 text-center text-ink/60">Featured projects will appear here once they are marked as featured in the Studio.</p>;
  }

  const at = (offset: number) => projects[(index + offset + count) % count];
  const go = (offset: number) => setIndex((i) => (i + offset + count) % count);
  const current = projects[index];

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid w-full items-center gap-8 md:grid-cols-[1fr_1.65fr_1fr]">
        {count > 1 ? <SideCard project={at(-1)} label={`Show ${at(-1).title}`} onClick={() => go(-1)} /> : <div className="hidden md:block" />}

        <div className="relative">
          {count > 1 && <EdgeArrow dir="prev" onClick={() => go(-1)} />}
          {count > 1 && <EdgeArrow dir="next" onClick={() => go(1)} />}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current._id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/projects/${encodeURIComponent(current.slug)}`}
                className="card-lift group relative block aspect-[3/2] w-full overflow-hidden rounded-2xl shadow-[0_30px_50px_-15px_rgba(60,40,10,0.55)]"
              >
                <Image
                  src={current.imageUrl || '/placeholder.svg'}
                  alt={current.title}
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-maroon/90 via-maroon/50 to-transparent p-5 pt-16">
                  <span className="text-lg text-white">{caption(current)}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/90 text-ink">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {count > 1 ? <SideCard project={at(1)} label={`Show ${at(1).title}`} onClick={() => go(1)} /> : <div className="hidden md:block" />}
      </div>

      {count > 1 && (
        <p className="text-sm tabular-nums text-ink/70" aria-live="polite">
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </p>
      )}
    </div>
  );
};
