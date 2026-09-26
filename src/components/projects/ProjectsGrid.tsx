"use client";

import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import type { ProjectSummary } from '@/lib/sanity/types';

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
                  ? 'bg-primary-900 text-white shadow-md' 
                  : 'bg-primary-50 text-primary-900 hover:bg-primary-100'
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
          <AnimatePresence mode="popLayout">
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
                  className="group block relative rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 h-full flex flex-col"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={project.imageUrl || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-sm font-semibold text-accent-700 mb-2 uppercase tracking-wide">
                      {categories.find(c => c.value === project.category)?.label}
                    </div>
                    <h3 className="text-xl font-bold text-primary-900 mb-2">{project.title}</h3>
                    {project.year && <p className="text-foreground/60 text-sm mt-auto">Completed in {project.year}</p>}
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
          <p className="text-xl text-foreground/60">No projects in this category yet &mdash; check back soon.</p>
        </motion.div>
      )}
    </div>
  );
}

export function ProjectsGrid(props: ProjectsGridProps) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-foreground/60">Loading projects...</div>}>
      <ProjectsGridInner {...props} />
    </Suspense>
  );
}
