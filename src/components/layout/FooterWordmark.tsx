"use client";

import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/** Letter size: a little smaller than the hero title, leaving a margin either side */
const FONT_SIZE = '17vw';
/** Where the letters rest: nudged down so the footer's bottom edge crops them, as in the design */
const REST_Y = '8%';
/** Fully below the footer's edge (the footer clips them there) */
const BELOW_Y = '115%';

/**
 * Oversized wordmark from the design, cropped by the footer's bottom edge. Each time the
 * footer comes into view the letters rise up out of that edge one after another; they drop
 * back when it leaves, so the entrance plays on every visit.
 */
export const FooterWordmark = ({ children }: { children: string }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  // Watched on the line itself, which stays put: the letters start outside the footer's
  // clipped area, where an observer on them would never fire
  const inView = useInView(ref, { amount: 0.4 });
  const shown = inView || Boolean(reduceMotion);

  return (
    <p
      ref={ref}
      aria-hidden="true"
      className="mt-6 select-none whitespace-nowrap text-center font-medium leading-[0.8] text-white"
      style={{ fontSize: FONT_SIZE }}
    >
      {Array.from(children).map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block will-change-transform"
          initial={false}
          animate={{ y: shown ? REST_Y : BELOW_Y }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : shown
                ? { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.045 }
                : { duration: 0.3, ease: 'easeIn' }
          }
        >
          {/* A plain space collapses inside an inline-block */}
          {letter === ' ' ? ' ' : letter}
        </motion.span>
      ))}
    </p>
  );
};
