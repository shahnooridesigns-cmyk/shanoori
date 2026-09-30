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

        {count > 1 ? <SideCard project={at(1)} label={`Show ${at(1).title}`} onClick={() => go(1)} /> : <div className="hidden md:block" />}
      </div>

      {count > 1 && (
        <div className="flex items-center gap-4 md:hidden">
          <button type="button" onClick={() => go(-1)} aria-label="Previous project" className="rounded-full border border-maroon/40 px-4 py-2 text-maroon">←</button>
          <span className="text-sm text-ink/70">{index + 1} / {count}</span>
          <button type="button" onClick={() => go(1)} aria-label="Next project" className="rounded-full border border-maroon/40 px-4 py-2 text-maroon">→</button>
        </div>
      )}
    </div>
  );
};
