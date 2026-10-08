"use client";

import React from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/**
 * The hero's wordmark. The hero itself stays pinned (photo, intro text and button) while the
 * next section slides up over it, so the wordmark is moved up by exactly the distance scrolled:
 * it leaves with the page, as it would in ordinary scrolling, and the rest stays behind.
 */
export const HeroLift = ({ children }: { children: React.ReactNode }) => {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  // Past two screens it is long gone under the page, so it is left where it is
  const y = useTransform(scrollY, (value) => -Math.min(value, 2400));

  return (
    <motion.div className="relative will-change-transform" style={{ y: reduceMotion ? 0 : y }}>
      {children}
    </motion.div>
  );
};
