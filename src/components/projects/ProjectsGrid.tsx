"use client";

import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import type { ProjectSummary } from '@/lib/sanity/types';
import { serviceLabel, services, spaceTypeLabel, spaceTypes } from '@/lib/categories';
import { localePath } from '@/lib/locale';
import { T } from '../shared/T';
import { useLocale, useT } from '../shared/LocaleProvider';
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

/** One filter button: a glass pill with a count badge; the chosen one is filled and its border carries a moving light. */
const Chip = ({
  label,
  count,
  active,
  group,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  /** Buttons of one group share the sliding highlight */
  group: string;
  onClick: () => void;
}) => (
  <button type="button" onClick={onClick} aria-pressed={active} disabled={count === 0 && !active} className="filter-chip" data-active={active || undefined}>
    {active && (
      <motion.span
        layoutId={`active-${group}`}
        className="filter-chip-fill bg-brand-gradient"
        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      />
    )}
    <span className="relative">{label}</span>
    <span className="filter-chip-count">{count}</span>
  </button>
);

function ProjectsGridInner({ initialProjects }: ProjectsGridProps) {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useT();
  const base = localePath(locale, '/projects');

  // Two filters that work together: the service (?service=mep) and the kind of place (?type=retail).
  // Links from the Services page still arrive as ?category=interior and pick that service.
  const categoryParam = searchParams.get('category');
  const serviceParam = searchParams.get('service') ?? services.find((sv) => sv.categories.some((c) => c === categoryParam))?.value;
  const activeService = services.some((sv) => sv.value === serviceParam) ? serviceParam! : 'all';
  const typeParam = searchParams.get('type');

  const inService = (p: ProjectSummary, service: string) =>
    service === 'all' || Boolean(services.find((sv) => sv.value === service)?.categories.includes(p.category));

  const ofService = initialProjects.filter((p) => inService(p, activeService));
  const typeCounts = ofService.reduce<Record<string, number>>((acc, p) => {
    if (p.spaceType) acc[p.spaceType] = (acc[p.spaceType] ?? 0) + 1;
    return acc;
  }, {});
  // Only kinds of place that have projects get a button
  const typeFilters = [{ label: t('projects.all'), value: 'all', count: ofService.length }].concat(
    spaceTypes.filter((s) => typeCounts[s.value]).map((s) => ({ label: spaceTypeLabel(s.value, locale), value: s.value, count: typeCounts[s.value] }))
  );
  const activeType = typeFilters.some((f) => f.value === typeParam) ? typeParam! : 'all';

  const ofType = activeType === 'all' ? initialProjects : initialProjects.filter((p) => p.spaceType === activeType);
  const serviceFilters = [{ label: t('projects.all'), value: 'all', count: ofType.length }].concat(
    services.map((sv) => ({ label: serviceLabel(sv.value, locale), value: sv.value, count: ofType.filter((p) => inService(p, sv.value)).length }))
  );

  const setFilters = (service: string, type: string) => {
    // Native history updates useSearchParams without a server round trip or scroll jump,
    // since all projects are already loaded and filtering is client-side.
    const params = new URLSearchParams();
    if (service !== 'all') params.set('service', service);
    if (type !== 'all') params.set('type', type);
    const query = params.toString();
    window.history.pushState(null, '', query ? `${base}?${query}` : base);
  };

  const filteredProjects = ofService.filter((p) => activeType === 'all' || p.spaceType === activeType);

  return (
    <div className="w-full">
      {/* Sticky filter bar, sits just under the fixed header */}
      <div className="sticky top-20 z-20 -mx-5 mb-12 px-5 py-4 md:-mx-10 md:px-10 lg:-mx-[60px] lg:px-[60px]">
        <div className="absolute inset-0 bg-beige/85 backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_70%,transparent)]" aria-hidden="true" />
        <div className="relative flex flex-col gap-3">
          {[
            { name: t('projects.space'), group: 'type', label: t('projects.filterSpace'), items: typeFilters, active: activeType, pick: (v: string) => setFilters(activeService, v) },
            { name: t('projects.service'), group: 'service', label: t('projects.filterService'), items: serviceFilters, active: activeService, pick: (v: string) => setFilters(v, activeType) },
          ].map((row) => (
            <div key={row.group} className="flex items-center gap-3">
              <span className="w-14 shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-maroon/60 md:w-16 md:text-xs">{row.name}</span>
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1.5 [scrollbar-width:none]" role="group" aria-label={row.label}>
                {row.items.map((item) => (
                  <Chip key={item.value} label={item.label} count={item.count} active={row.active === item.value} group={row.group} onClick={() => row.pick(item.value)} />
                ))}
              </div>
              {row.group === 'type' && (
                <p className="ms-auto hidden shrink-0 text-sm text-ink/60 lg:block" aria-live="polite">
                  {t('projects.showing')} {filteredProjects.length} {filteredProjects.length === 1 ? t('projects.one') : t('projects.many')}
                </p>
              )}
            </div>
          ))}
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
          <p className="text-2xl text-maroon">{t('projects.none')}</p>
          <button type="button" onClick={() => setFilters('all', 'all')} className="mt-4 text-maroon underline underline-offset-4 hover:opacity-75">
            {t('projects.viewAll')}
          </button>
        </div>
      )}
    </div>
  );
}

export function ProjectsGrid(props: ProjectsGridProps) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-ink/60"><T k="projects.loading" /></div>}>
      <ProjectsGridInner {...props} />
    </Suspense>
  );
}
