"use client";

import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import type { ProjectSummary } from "@/lib/sanity/types";
import { ArrowUpRight } from "../shared/ui";

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Civil', value: 'civil' },
  { label: 'Interior', value: 'interior' },
  { label: 'Mechanical', value: 'mechanical' },
  { label: 'Electrical', value: 'electrical' },
  { label: 'Plumbing', value: 'plumbing' }
];

interface ProjectsGridProps {
  initialProjects: ProjectSummary[];
}

function ProjectsGridInner({ initialProjects }: ProjectsGridProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const activeFilter = categories.some(c => c.value === categoryParam) ? categoryParam! : 'all';

  const handleFilterChange = (category: string) => {
    // Native history updates useSearchParams without a server round trip or scroll jump,
    // since all projects are already loaded and filtering is client-side.
    window.history.pushState(null, '', category === 'all' ? '/projects' : `/projects?category=${category}`);
  };

  const filteredProjects = activeFilter === 'all' 
    ? initialProjects 
    : initialProjects.filter(p => p.category === activeFilter);

  return (
    <div className="w-full">
      {/* Filter Buttons - Flex wrap handles mobile cleanly */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16">
        {categories.map((cat) => {
          const isActive = activeFilter === cat.value;
          return (
            <button
              type="button"
              key={cat.value}
              onClick={() => handleFilterChange(cat.value)}
              aria-pressed={isActive}
              className={`px-6 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                isActive 
                  ? "bg-maroon text-white shadow-md"
                  : "bg-cream text-maroon hover:bg-white"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filteredProjects.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredProjects.map((project) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
              >
                <Link 
                  href={`/projects/${encodeURIComponent(project.slug)}`} 
                  className="group relative block aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_20px_40px_-15px_rgba(60,40,10,0.5)] transition-transform hover:-translate-y-1"
                >
                  <Image
                    src={project.imageUrl || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-maroon/95 via-maroon/60 to-transparent p-5 pt-20">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                        {categories.find(c => c.value === project.category)?.label}
                        {project.year ? ` · ${project.year}` : ''}
                      </p>
                      <h3 className="mt-1 text-xl text-white">{[project.title, project.location].filter(Boolean).join(' - ')}</h3>
                    </div>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/90 text-ink">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 text-center"
        >
          <p className="text-xl text-ink/60">No projects in this category yet &mdash; check back soon.</p>
        </motion.div>
      )}
    </div>
  );
}

export function ProjectsGrid(props: ProjectsGridProps) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-ink/60">Loading projects...</div>}>
      <ProjectsGridInner {...props} />
    </Suspense>
  );
}
