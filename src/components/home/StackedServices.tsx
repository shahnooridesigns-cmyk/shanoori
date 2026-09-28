"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import type { Division } from '@/lib/services';
import { ArrowUpRight } from '../shared/ui';

/** Where the first card sticks (below the fixed header) and how far each later card sits below it. */
const STICK_TOP = 128;
const STACK_OFFSET = 28;

const StackCard = ({
  division,
  index,
  total,
  progress,
}: {
  division: Division;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) => {
  const reduceMotion = useReducedMotion();
  // Once the next card starts arriving, this one shrinks and dims; earlier cards end up smaller.
  // Stops cover the full 0–1 range (the native scroll timeline needs that).
  const start = (index + 1) / total;
  const depth = total - index - 1;
  const stops = start < 1 ? [0, start - 0.001, 1] : [0, 1];
  const scale = useTransform(progress, stops, start < 1 ? [1, 1, 1 - depth * 0.06] : [1, 1]);
  const shade = useTransform(progress, stops, start < 1 ? [0, 0, Math.min(0.55, depth * 0.3)] : [0, 0]);

  return (
    <motion.div
      className="sticky origin-top"
      style={{ top: STICK_TOP + index * STACK_OFFSET, scale: reduceMotion ? 1 : scale }}
    >
      <Link
        href={`/services#${division.id}`}
        className="group relative grid overflow-hidden rounded-[28px] border border-gold/15 bg-[#0f0d0b] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.9)] sm:grid-cols-[1fr_240px]"
      >
        <div className="flex min-h-[340px] flex-col p-7 md:p-9">
          <div className="flex items-center justify-between">
            <span className="text-white/60">/{division.number}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold transition-all duration-500 group-hover:rotate-45 group-hover:bg-gold group-hover:text-maroon">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <h3 className="mt-6 text-3xl md:text-4xl text-gold">{division.title}</h3>
          <p className="mt-5 max-w-sm text-white/75">{division.summary}</p>
          <ul className="mt-auto flex flex-wrap gap-2 pt-8">
            {division.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/75">{tag}</li>
            ))}
          </ul>
        </div>
        <div className="relative min-h-[240px] overflow-hidden sm:min-h-0">
          <Image
            src={division.image}
            alt={division.title}
            fill
            sizes="(min-width: 640px) 240px, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Darkens the card as it gets buried under the next one */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: reduceMotion ? 0 : shade }}
        />
      </Link>
    </motion.div>
  );
};

/** Service cards that pin one over another as the page scrolls. */
export const StackedServices = ({ divisions }: { divisions: Division[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  return (
    // Bottom padding gives the last card room to settle before the stack scrolls away
    <div ref={containerRef} className="flex flex-col gap-[38vh] pb-[12vh]">
      {divisions.map((d, i) => (
        <StackCard key={d.id} division={d} index={i} total={divisions.length} progress={scrollYProgress} />
      ))}
    </div>
  );
};
