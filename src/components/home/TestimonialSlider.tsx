"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import type { Review } from '@/lib/sanity/types';
import { CountUp } from '../shared/CountUp';

const Star = () => (
  <svg viewBox="0 0 20 20" className="h-6 w-6 fill-current" aria-hidden="true">
    <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 0 0 .95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 0 0-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12l-2.8-2.03a1 1 0 0 0-1.18 0l-2.8 2.03c-.78.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 0 0-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 0 0 .95-.69z" />
  </svg>
);

const ArrowButton = ({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={dir === 'prev' ? 'Previous review' : 'Next review'}
    className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-ink text-ink transition-colors hover:bg-ink hover:text-white"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-5 w-5" aria-hidden="true">
      {dir === 'prev' ? <path d="M19 12H5m6-6-6 6 6 6" /> : <path d="M5 12h14m-6-6 6 6-6 6" />}
    </svg>
  </button>
);

export const TestimonialSlider = ({ reviews }: { reviews: Review[] }) => {
  const [index, setIndex] = useState(0);
  const count = reviews.length;
  const review = reviews[index];
  const rated = reviews.filter((r) => r.rating);
  const average = rated.length ? rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length : 5;
  const go = (offset: number) => setIndex((i) => (i + offset + count) % count);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-full bg-maroon text-gold">
            {review.photoUrl ? (
              <Image src={review.photoUrl} alt="" fill sizes="40px" className="object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-semibold" aria-hidden="true">
                {review.clientName?.charAt(0) || '?'}
              </span>
            )}
          </span>
          <div className="leading-tight">
            <p className="text-lg text-ink">{review.clientName}</p>
            {review.clientCompany && <p className="text-sm text-ink/80">{review.clientCompany}</p>}
          </div>
        </div>
        <div className="flex items-center gap-4 text-lg text-ink" aria-label={`Average rating ${average.toFixed(1)} out of 5`}>
          <CountUp value={`${average.toFixed(1)}/5`} />
          <span className="flex">{Array.from({ length: 5 }, (_, i) => <Star key={i} />)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="min-h-[220px] max-w-3xl md:pl-5" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.blockquote
              key={review._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="text-2xl md:text-4xl leading-snug text-ink"
            >
              &ldquo;{review.reviewText}&rdquo;
            </motion.blockquote>
          </AnimatePresence>
        </div>
        {count > 1 && (
          <div className="flex gap-5">
            <ArrowButton dir="prev" onClick={() => go(-1)} />
            <ArrowButton dir="next" onClick={() => go(1)} />
          </div>
        )}
      </div>
    </div>
  );
};
