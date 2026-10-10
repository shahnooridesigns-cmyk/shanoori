"use client";

import { T } from '@/components/shared/T';
import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Container } from '../shared/Container';
import { SectionLabel } from '../shared/ui';

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
/** Quick off the mark but not instant, so the backdrop is seen travelling up */
const SWEEP = [0.3, 0.7, 0.2, 1] as const;

/** Each piece of copy rises into place (`custom` is its position in the sequence) and drops away quickly on the way out. */
const rise = {
  hidden: { opacity: 0, y: 48, transition: { duration: 0.25, ease: 'easeIn' as const } },
  shown: (order: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EXPO_OUT, delay: 0.3 + order * 0.1 },
  }),
};

/**
 * The "What we deliver" section's entrance. It starts as a continuation of the beige section
 * above; once its top is well into view, the black backdrop sweeps up from below the screen,
 * and the copy and service cards follow it in. Scrolling back up plays it in reverse (content
 * out, backdrop down), so it runs again on every visit to the section.
 */
export const ServicesReveal = ({
  heading,
  text,
  children,
}: {
  heading: string;
  text: string;
  /** The service cards */
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  // On whenever the section's top edge is above a line 40% up the screen (so there is a tall
  // strip of beige for the backdrop to sweep across), off again when it drops back below.
  // The huge top margin keeps it on while the section is scrolled past, not just while on screen.
  const inView = useInView(ref, { margin: '100000px 0px -40% 0px' });
  const shown = inView || Boolean(reduceMotion);
  const state = shown ? 'shown' : 'hidden';

  return (
    // overflow-clip (not hidden) trims the glows without breaking the sticky cards
    <section ref={ref} className="relative overflow-clip bg-beige py-24 md:py-32">
      {/* Black backdrop: hidden below a line 60vh down the section (off-screen at the moment
          it fires), then that line races up to the section's top */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black"
        initial={false}
        animate={{ clipPath: shown ? 'inset(0vh 0px 0px 0px)' : 'inset(60vh 0px 0px 0px)' }}
        // In: straight away. Out: after the content has cleared.
        transition={
          reduceMotion
            ? { duration: 0 }
            : shown
              ? { duration: 0.6, ease: SWEEP }
              : { duration: 0.5, ease: [0.7, 0, 0.84, 0], delay: 0.15 }
        }
      >
        {/* Soft brand-coloured glows for the glass service cards to sit over */}
        <div className="absolute right-[-10%] top-[8%] h-[520px] w-[520px] rounded-full bg-rose/45 blur-[120px]" />
        <div className="absolute right-[22%] top-[38%] h-[420px] w-[420px] rounded-full bg-gold/25 blur-[130px]" />
        <div className="absolute bottom-[6%] right-[-6%] h-[560px] w-[560px] rounded-full bg-maroon/70 blur-[120px]" />
      </motion.div>

      <Container className="relative grid gap-16 lg:grid-cols-[1fr_1.1fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <motion.div variants={rise} custom={0} initial={false} animate={state}>
            <SectionLabel tone="gold"><T k="label.services" /></SectionLabel>
          </motion.div>
          {/* The rise goes on a wrapper: section headings already carry the site's own scroll
              reveal (.scroll-titles in globals.css), which would override it on the h2 itself */}
          <motion.div variants={rise} custom={1} initial={false} animate={state}>
            <h2 className="mt-6 whitespace-pre-line text-5xl md:text-7xl font-medium leading-[0.95] text-gold">{heading}</h2>
          </motion.div>
          <motion.p variants={rise} custom={2} initial={false} animate={state} className="mt-10 max-w-md text-lg text-white/75">
            {text}
          </motion.p>
        </div>

        {/* Opacity only: a transform here would change what the sticky cards measure against */}
        <motion.div
          initial={false}
          animate={{ opacity: shown ? 1 : 0 }}
          transition={
            reduceMotion ? { duration: 0 } : shown ? { duration: 0.8, ease: 'easeOut', delay: 0.55 } : { duration: 0.25, ease: 'easeIn' }
          }
        >
          {children}
        </motion.div>
      </Container>
    </section>
  );
};
