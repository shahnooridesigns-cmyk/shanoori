"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import type { Review } from '@/lib/sanity/types';

/** Shown when a review has no photo of its own */
const FALLBACK_IMAGE = '/assets/images/testimonials/note-4.webp';
/** How each card settles on the pile: a small turn and a nudge, so the cards under it still show */
const REST = [
  { rotate: -4, x: -10 },
  { rotate: 3, x: 12 },
  { rotate: -2, x: -4 },
  { rotate: 5, x: 8 },
  { rotate: -5, x: -12 },
];

const Stars = ({ rating }: { rating: number }) => (
  <span className="flex shrink-0 gap-1 text-maroon" role="img" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, i) => (
      <svg key={i} viewBox="0 0 24 24" className={`h-4 w-4 md:h-5 md:w-5 ${i < rating ? '' : 'opacity-20'}`} fill="currentColor" aria-hidden="true">
        <path d="M12 2.5l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.4 6.1 20.7l1.3-6.6L2.5 9.5l6.6-.8L12 2.5z" />
      </svg>
    ))}
  </span>
);

/**
 * Beside the name: the client's logo, drawn in the brand maroon whatever colour the file is (the
 * logo is used as a mask), or the person's photo when the review has one. Nothing when neither.
 */
const AuthorMark = ({ review }: { review: Review }) => {
  if (!review.photoUrl) return null;
  if (!review.photoIsLogo) {
    return (
      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-maroon/10 md:h-12 md:w-12">
        <Image src={review.photoUrl} alt="" fill sizes="48px" className="object-cover" />
      </span>
    );
  }
  const mask = `url("${review.photoUrl}?w=160&fit=max&auto=format") center / contain no-repeat`;
  return <span aria-hidden="true" className="h-12 w-12 shrink-0 bg-maroon md:h-14 md:w-14" style={{ mask, WebkitMask: mask }} />;
};

/** One testimonial as a photo card: picture on top, the client's words, then name and stars. */
const NoteCard = ({ review }: { review: Review }) => (
  <figure className="w-[min(86vw,540px)] rounded-[22px] bg-cream p-3 shadow-[0_30px_60px_-20px_rgba(40,10,20,0.55)] md:p-4">
    <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-maroon/10">
      <Image src={review.imageUrl || FALLBACK_IMAGE} alt="" fill sizes="(min-width: 768px) 540px, 86vw" className="object-cover" />
    </div>
    <blockquote className="px-2 pt-5 text-base leading-snug text-ink md:px-3 md:pt-6 md:text-lg">&ldquo;{review.reviewText}&rdquo;</blockquote>
    <figcaption className="flex items-end justify-between gap-4 px-2 pb-2 pt-5 md:px-3 md:pb-3 md:pt-6">
      <span className="flex min-w-0 items-center gap-3">
        <AuthorMark review={review} />
        <span className="min-w-0">
          <span className="block text-lg font-medium text-ink md:text-xl">{review.clientName}</span>
          {review.clientCompany && <span className="mt-0.5 block text-sm text-ink/60">{review.clientCompany}</span>}
        </span>
      </span>
      <Stars rating={review.rating ?? 5} />
    </figcaption>
  </figure>
);

/** A card that rises from below the screen onto the pile during its own stretch of the scroll. */
const StackedCard = ({ review, index, count, progress }: { review: Review; index: number; count: number; progress: MotionValue<number> }) => {
  const rest = REST[index % REST.length];
  const start = index / count;
  const end = (index + 0.8) / count;
  // The first card already peeks in under the title; the others come from fully below
  const y = useTransform(progress, [start, end], [index === 0 ? '62vh' : '115vh', '0vh'], { clamp: true });
  const rotate = useTransform(progress, [start, end], [rest.rotate * -1.5, rest.rotate], { clamp: true });

  return (
    // The list item centres the card on the screen; the card inside it does the moving
    <li className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ zIndex: index + 1 }}>
      <motion.div className="pointer-events-auto will-change-transform" style={{ x: rest.x, y, rotate }}>
        <NoteCard review={review} />
      </motion.div>
    </li>
  );
};

/**
 * "Client Notes": the title fills the screen and stays put while the testimonials arrive one by
 * one as photo cards, each landing on the pile with its own slight turn, driven by the scroll.
 * Reduced-motion users get the cards as a plain grid.
 */
export const ClientNotes = ({ title, reviews }: { title: string; reviews: Review[] }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });

  const heading = (
    <h2
      data-no-scroll-anim
      className="select-none whitespace-nowrap text-center font-medium uppercase leading-none tracking-tight text-maroon"
      style={{ fontSize: `min(${Math.min(15, 170 / Math.max(title.length, 1))}vw, 230px)` }}
    >
      {title}
    </h2>
  );

  if (reduceMotion) {
    return (
      <div className="px-5 py-24 md:px-10">
        {heading}
        <ul className="mt-14 flex flex-wrap justify-center gap-8">
          {reviews.map((review) => (
            <li key={review._id}><NoteCard review={review} /></li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    // One screen of scrolling per card, plus one to rest on the finished pile
    <div ref={trackRef} className="relative" style={{ height: `${(reviews.length + 1) * 100}svh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        {heading}
        <ul className="absolute inset-0">
          {reviews.map((review, i) => (
            <StackedCard key={review._id} review={review} index={i} count={reviews.length} progress={scrollYProgress} />
          ))}
        </ul>
      </div>
    </div>
  );
};
