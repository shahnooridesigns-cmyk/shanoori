"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { LocaleLink as Link } from '@/components/shared/LocaleProvider';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { ProjectSummary } from '@/lib/sanity/types';
import { ArrowUpRight } from '../shared/ui';
import { useSwipe } from '@/lib/useSwipe';
import { projectKind } from '@/lib/categories';
import type { Locale } from '@/lib/locale';
import { useLocale, useT } from '../shared/LocaleProvider';

/** The facts shown under the title when the card is hovered: kind of work, client, place, year */
const facts = (p: ProjectSummary, locale: Locale) =>
  [projectKind(p, locale), p.clientName !== p.title && p.clientName, p.location, p.year].filter(Boolean).join(' · ');
/** First paragraph of the description, when it is plain text */
const excerpt = (p: ProjectSummary) => (typeof p.excerpt === 'string' ? p.excerpt.split(/\n/)[0].trim() : '');

const MAIN_SIZES = '(min-width: 768px) 45vw, 100vw';
const SIDE_SIZES = '25vw';
/** Long, soft deceleration: the photo glides in and settles rather than snapping */
const GLIDE = [0.32, 0.72, 0, 1] as const;
/** How long each project stays before the next slides in */
const AUTOPLAY_MS = 4000;

/**
 * The three frames stay where they are, like screens; only what they show moves. Going forward
 * every frame's photo leaves to the left as the next one comes in from the right, and the
 * reverse going back.
 */
const slide = {
  enter: (direction: number) => ({ x: `${direction * 100}%` }),
  center: { x: '0%' },
  exit: (direction: number) => ({ x: `${direction * -100}%` }),
};
const fade = { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } };

/** What one frame shows: slides out and in whenever the project in it changes. */
const Screen = ({
  project,
  direction,
  reduceMotion,
  children,
}: {
  project: ProjectSummary;
  direction: number;
  reduceMotion: boolean;
  children: React.ReactNode;
}) => (
  <AnimatePresence initial={false} custom={direction}>
    <motion.div
      key={project._id}
      custom={direction}
      variants={reduceMotion ? fade : slide}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: reduceMotion ? 0.3 : 0.75, ease: GLIDE }}
      className="absolute inset-0 will-change-transform"
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

/** Small fixed frame showing the neighbouring project. */
const SideCard = ({
  project,
  direction,
  reduceMotion,
  label,
  cursor,
  onClick,
}: {
  project: ProjectSummary;
  direction: number;
  reduceMotion: boolean;
  label: string;
  /** The word the custom cursor shows over the card */
  cursor: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    data-cursor={cursor}
    data-cursor-tone="ink"
    className="relative hidden aspect-[275/225] w-full overflow-hidden rounded-2xl bg-maroon shadow-[0_24px_40px_-12px_rgba(60,40,10,0.45)] md:block"
  >
    <Screen project={project} direction={direction} reduceMotion={reduceMotion}>
      <Image src={project.imageUrl || '/assets/images/placeholder.webp'} alt="" fill sizes={SIDE_SIZES} className="object-cover" />
    </Screen>
  </button>
);

/** Large round arrow on the outer edge of the carousel (over the photo's edge on phones, where there are no side cards). */
const EdgeArrow = ({ dir, label, onClick }: { dir: 'prev' | 'next'; label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-maroon shadow-[0_10px_30px_-8px_rgba(60,40,10,0.55)] transition-all hover:scale-110 hover:bg-maroon hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon md:h-16 md:w-16 ${
      dir === 'prev' ? 'start-2 md:-start-8' : 'end-2 md:-end-8'
    }`}
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 rtl:-scale-x-100 md:h-7 md:w-7" aria-hidden="true">
      {dir === 'prev' ? <path d="m15 5-7 7 7 7" /> : <path d="m9 5 7 7-7 7" />}
    </svg>
  </button>
);

export const WorkCarousel = ({ projects }: { projects: ProjectSummary[] }) => {
  const [[index, direction], setSlide] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const reduceMotion = Boolean(useReducedMotion());
  const locale = useLocale();
  const t = useT();
  const count = projects.length;
  // Swipe left for the next project, right for the previous one
  const swipe = useSwipe((dir) => count > 1 && setSlide(([i]) => [(i + dir + count) % count, dir]), setPaused);

  // Advance on its own (contents move to the left); waits while the pointer, keyboard focus or
  // a finger is on the carousel, and restarts the wait whenever the project changes
  useEffect(() => {
    if (count < 2 || paused || reduceMotion) return;
    const timer = setTimeout(() => setSlide(([i]) => [(i + 1) % count, 1]), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, count, paused, reduceMotion]);

  if (count === 0) {
    return <p className="py-16 text-center text-ink/60">{t('projects.noFeatured')}</p>;
  }

  const at = (offset: number) => projects[(index + offset + count) % count];
  const go = (offset: number) => setSlide(([i]) => [(i + offset + count) % count, offset]);
  const current = projects[index];
  // Right to left, "next" arrives from the left: the slide direction is mirrored
  const flow = locale === 'ar' ? -direction : direction;
  // Photos that could be asked for next, fetched ahead so they are ready when they slide in
  const upcoming = count > 1 ? [...new Map([at(1), at(-1), at(2)].map((p) => [p._id, p])).values()].filter((p) => p._id !== current._id) : [];

  return (
    <div
      className="flex flex-col items-center gap-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      {...swipe}
    >
      <div className="relative grid w-full items-center gap-8 md:grid-cols-[1fr_1.65fr_1fr]">
        {count > 1 && <EdgeArrow dir="prev" label={t('action.previousProject')} onClick={() => go(-1)} />}
        {count > 1 && <EdgeArrow dir="next" label={t('action.nextProject')} onClick={() => go(1)} />}
        {count > 1 ? (
          <SideCard project={at(-1)} direction={flow} reduceMotion={reduceMotion} cursor={t('action.show')} label={`${t('action.show')} ${at(-1).title}`} onClick={() => go(-1)} />
        ) : (
          <div className="hidden md:block" />
        )}

        {/* Fixed frame: it keeps its size and shadow while the photos slide through it */}
        <div
          data-cursor-tone="ink"
          className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-maroon shadow-[0_30px_50px_-15px_rgba(60,40,10,0.55)]"
        >
          {/* Out of sight, but loaded at the size the main photo uses, once the frame nears the screen */}
          <div className="absolute inset-0 opacity-0" aria-hidden="true">
            {upcoming.map((p) => (
              <Image key={p._id} src={p.imageUrl || '/assets/images/placeholder.webp'} alt="" fill sizes={MAIN_SIZES} className="object-cover" />
            ))}
          </div>

          <Screen project={current} direction={flow} reduceMotion={reduceMotion}>
            <Link href={`/projects/${encodeURIComponent(current.slug)}`} data-cursor={t('action.viewProject')} className="group relative block h-full w-full">
              <Image
                src={current.imageUrl || '/assets/images/placeholder.webp'}
                alt={current.title}
                fill
                sizes={MAIN_SIZES}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon/95 via-maroon/60 to-transparent p-5 pt-16 transition-[padding] duration-500 group-hover:pt-28 group-focus-visible:pt-28">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-lg text-white">{current.title}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/90 text-ink">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                {/* Opens under the title on hover or keyboard focus; always open where there is no hover (touch) */}
                <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100 [@media(hover:none)]:grid-rows-[1fr] [@media(hover:none)]:opacity-100">
                  <div className="overflow-hidden">
                    <p className="pt-2 text-[11px] uppercase tracking-[0.18em] text-gold md:pt-3 md:text-xs">{facts(current, locale)}</p>
                    {excerpt(current) && (
                      <p className="mt-2 hidden max-w-[52ch] text-sm leading-relaxed text-white/85 line-clamp-2 md:block">{excerpt(current)}</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </Screen>
        </div>

        {count > 1 ? (
          <SideCard project={at(1)} direction={flow} reduceMotion={reduceMotion} cursor={t('action.show')} label={`${t('action.show')} ${at(1).title}`} onClick={() => go(1)} />
        ) : (
          <div className="hidden md:block" />
        )}
      </div>

      {count > 1 && (
        <p dir="ltr" className="text-sm tabular-nums text-ink/70" aria-live={paused ? 'polite' : 'off'}>
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </p>
      )}
    </div>
  );
};
