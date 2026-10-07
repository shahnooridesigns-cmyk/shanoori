"use client";

import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import type { ProjectSummary } from '@/lib/sanity/types';
import { categories } from '@/lib/categories';
import { ProjectCard } from './ProjectCard';

interface ProjectsGridProps {
  initialProjects: ProjectSummary[];
}

/**
 * Mixed-size ("bento") layout that repeats every 6 cards on large screens:
 * a big feature tile, a tall tile and regular tiles, so the grid never looks uniform.
 */
const tileClass = (i: number) => {
  switch (i % 6) {
    case 0:
      return 'md:col-span-2 lg:row-span-2';
    case 4:
      return 'lg:row-span-2';
    default:
      return '';
  }
};

function ProjectsGridInner({ initialProjects }: ProjectsGridProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const activeFilter = categories.some((c) => c.value === categoryParam) ? categoryParam! : 'all';

  const handleFilterChange = (category: string) => {
    // Native history updates useSearchParams without a server round trip or scroll jump,
    // since all projects are already loaded and filtering is client-side.
    window.history.pushState(null, '', category === 'all' ? '/projects' : `/projects?category=${category}`);
  };

  const counts = initialProjects.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
  const filters = [{ label: 'All', value: 'all', count: initialProjects.length }].concat(
    categories.map((c) => ({ ...c, count: counts[c.value] ?? 0 }))
  );

  const filteredProjects =
    activeFilter === 'all' ? initialProjects : initialProjects.filter((p) => p.category === activeFilter);

  return (
    <div className="w-full">
      {/* Sticky filter bar, sits just under the fixed header */}
      <div className="sticky top-20 z-20 -mx-5 mb-12 px-5 py-4 md:-mx-10 md:px-10 lg:-mx-[60px] lg:px-[60px]">
        <div className="absolute inset-0 bg-beige/85 backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_70%,transparent)]" aria-hidden="true" />
        <div className="relative flex items-center justify-between gap-6">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]" role="group" aria-label="Filter projects by category">
            {filters.map((f) => {
              const isActive = activeFilter === f.value;
              return (
                <button
                  type="button"
                  key={f.value}
                  onClick={() => handleFilterChange(f.value)}
                  aria-pressed={isActive}
                  disabled={f.count === 0 && !isActive}
                  className={`relative shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    isActive
                      ? 'border-maroon text-gold'
                      : 'border-maroon/35 bg-white/45 text-maroon shadow-sm hover:border-maroon hover:bg-white/80'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-filter"
                      className="absolute inset-0 rounded-full bg-maroon shadow-md"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {f.label}
                    <span className={`text-xs ${isActive ? 'text-gold/70' : 'text-maroon/50'}`}>{f.count}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="hidden shrink-0 text-sm text-ink/60 md:block" aria-live="polite">
            Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <motion.ul layout className="grid grid-flow-dense auto-rows-[300px] gap-6 md:grid-cols-2 lg:auto-rows-[280px] lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredProjects.map((project, i) => (
              <motion.li
                key={project._id}
                layout
                className={tileClass(i)}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.06 }}
              >
                <ProjectCard
                  project={project}
                  index={i}
                  large={i % 6 === 0}
                  sizes={i % 6 === 0 ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="rounded-[28px] border border-dashed border-maroon/30 py-24 text-center">
          <p className="text-2xl text-maroon">No projects in this category yet</p>
          <button type="button" onClick={() => handleFilterChange('all')} className="mt-4 text-maroon underline underline-offset-4 hover:opacity-75">
            View all projects
          </button>
        </div>
      )}
    </div>
  );
}

export function ProjectsGrid(props: ProjectsGridProps) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-ink/60">Loading projects…</div>}>
      <ProjectsGridInner {...props} />
    </Suspense>
  );
}
