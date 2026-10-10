"use client";

import React from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/** Scroll distance (px) over which the title reaches its full stretch */
const STRETCH_DISTANCE = 600;
/** How tall the letters get at full stretch (1 = the design's size) */
const MAX_STRETCH = 2;
/**
 * Empty space the font leaves under the letters, as a share of the font size. The title is
 * pushed down by this much so the letters rest on the hero's bottom edge.
 */
const BASELINE_GAP = '0.075em';

/**
 * The hero's giant wordmark. As the page scrolls, the letters stretch vertically, anchored
 * at their baseline on the hero's bottom edge, then hold at MAX_STRETCH.
 */
export const HeroTitle = ({ title }: { title: string }) => {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scaleY = useTransform(scrollY, [0, STRETCH_DISTANCE], [1, MAX_STRETCH], { clamp: true });
  // 20vw runs a 10-character title edge to edge with a sliver to spare (wider would be cut
  // off by the scrollbar); longer titles scale down to fit
  const size = Math.min(20, 200 / Math.max(title.length, 1));

  return (
    <motion.h1
      dir="ltr"
      className="relative select-none whitespace-nowrap text-center font-medium leading-[0.78] text-gold will-change-transform"
      style={{
        fontSize: `min(${size}vw, ${Math.round(14.75 * size)}px)`,
        marginBottom: `-${BASELINE_GAP}`,
        scaleY: reduceMotion ? 1 : scaleY,
        // Stretch from the hero's edge (not the box's own bottom) so the letters stay resting on it
        transformOrigin: `50% calc(100% - ${BASELINE_GAP})`,
      }}
    >
      {title}
    </motion.h1>
  );
};
