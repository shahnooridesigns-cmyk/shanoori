"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

/**
 * Page change by flood: a sheet of the brand gradient grows as a circle from a point (the
 * button that was clicked) until it covers the screen, the destination loads underneath, and
 * only once that page is on screen does the sheet fade away.
 *
 * It lives in the site layout, not in the page that starts it: pages are swapped out during
 * the change, and anything inside the old one would vanish before the new one had painted.
 * Start one from anywhere with startPageFlood().
 */

const EVENT = 'sn:page-flood';

interface FloodOrigin {
  /** Centre and radius of the starting circle, in viewport px */
  x: number;
  y: number;
  r: number;
  /** Where to go once the screen is covered */
  href: string;
}

export const startPageFlood = (origin: FloodOrigin) => {
  window.dispatchEvent(new CustomEvent<FloodOrigin>(EVENT, { detail: origin }));
};

/** grow: the circle is spreading. cover: screen covered, waiting for the destination. fade: revealing it. */
type Phase = 'grow' | 'cover' | 'fade';

/**
 * After the destination has rendered, wait out its own entrance (the page-in view transition
 * (titles rising, see globals.css) and let images and fonts settle, so the reveal shows a still page
 */
const SETTLE_MS = 900;
/** Never leave the screen covered: reveal whatever is there after this long */
const GIVE_UP_MS = 6000;

export const PageFlood = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [flood, setFlood] = useState<(FloodOrigin & { full: number }) | null>(null);
  const [phase, setPhase] = useState<Phase>('grow');

  useEffect(() => {
    const onStart = (e: Event) => {
      const { x, y, r, href } = (e as CustomEvent<FloodOrigin>).detail;
      // Far enough to reach the screen's furthest corner
      const full = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 24;
      setPhase('grow');
      setFlood((current) => current ?? { x, y, r, href, full });
    };
    window.addEventListener(EVENT, onStart);
    return () => window.removeEventListener(EVENT, onStart);
  }, []);

  // Covered and the destination is the current page: give it two frames to paint and a
  // moment to settle, then start the reveal
  useEffect(() => {
    if (!flood || phase !== 'cover' || pathname !== flood.href) return;
    let timer: ReturnType<typeof setTimeout>;
    // Already there (the button was used on its own page): the reveal lands at the top
    window.scrollTo({ top: 0, behavior: 'instant' });
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        timer = setTimeout(() => setPhase('fade'), SETTLE_MS);
      })
    );
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [flood, phase, pathname]);

  useEffect(() => {
    if (!flood) return;
    const timer = setTimeout(() => setPhase('fade'), GIVE_UP_MS);
    return () => clearTimeout(timer);
  }, [flood]);

  if (!flood) return null;

  const circle = (radius: number) => `circle(${radius}px at ${flood.x}px ${flood.y}px)`;

  return (
    <motion.div
      className="bg-brand-gradient fixed inset-0"
      // Its own view-transition layer, kept on top (see globals.css). Without a name it is part
      // of the root snapshot, and the outgoing page's snapshot, which the browser draws above
      // the root, would flash over the sheet as it fades out.
      style={{ zIndex: 90, viewTransitionName: 'page-flood' }}
      aria-hidden="true"
      initial={{ clipPath: circle(flood.r), opacity: 1 }}
      animate={{ clipPath: circle(flood.full), opacity: phase === 'fade' ? 0 : 1 }}
      transition={{
        clipPath: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
        opacity: { duration: 0.7, ease: 'easeInOut' },
      }}
      onAnimationComplete={() => {
        if (phase === 'grow') {
          setPhase('cover');
          if (pathname !== flood.href) router.push(flood.href);
        } else if (phase === 'fade') {
          setFlood(null);
        }
      }}
    />
  );
};
