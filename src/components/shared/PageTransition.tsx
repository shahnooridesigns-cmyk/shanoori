"use client";

import { ui, type UiKey } from '@/lib/content/ui';
import { localeOfPath, stripLocale } from '@/lib/locale';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

/**
 * Page change by shutters: when a link to another page is clicked, tall panels in the brand
 * colours rise from the bottom one after another until the screen is covered, the name of the
 * page being opened is written across them, the page loads underneath, and the panels carry on
 * upwards to uncover it.
 *
 * It lives in the site layout and listens for link clicks on the whole document, so every
 * ordinary link gets it without knowing about it. Left alone: new-tab and modified clicks,
 * links within the same page, the Studio, anything inside [data-no-transition] (the closing
 * banner has its own flood), browser back/forward, and reduced-motion users.
 */

const PANELS = 5;
/** Seconds each panel takes to travel, and the gap between one panel and the next */
const MOVE = 0.55;
const STAGGER = 0.07;
const EASE = [0.76, 0, 0.24, 1] as const;
/** Time for the whole set of panels to finish a move (ms) */
const SWEEP_MS = (MOVE + STAGGER * (PANELS - 1)) * 1000;
/** After the new page is in place, let it paint before uncovering it */
const SETTLE_MS = 380;
/** Never leave the screen covered: uncover whatever is there after this long */
const GIVE_UP_MS = 7000;

const PAGE_NAMES: Record<string, UiKey> = {
  '/': 'nav.home',
  '/about': 'nav.about',
  '/services': 'nav.services',
  '/projects': 'nav.projects',
  '/contact': 'nav.contact',
};
/** The label for an address, whichever language it is in ("/ar/about" and "/about" are the same page) */
const nameKeyFor = (fullPath: string): UiKey | null => {
  const path = stripLocale(fullPath);
  return PAGE_NAMES[path] ?? (path.startsWith('/projects/') ? 'page.project' : null);
};

/** idle: off screen below. cover: panels rising. hold: covered, waiting for the page. reveal: panels leaving upwards. */
type Phase = 'idle' | 'cover' | 'hold' | 'reveal';

export const PageTransition = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>('idle');
  const [target, setTarget] = useState<{ href: string; path: string } | null>(null);
  const busy = useRef(false);

  // Take over clicks on links that lead to another page of the site
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (busy.current || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a');
      if (!link || link.target === '_blank' || link.hasAttribute('download') || link.closest('[data-no-transition]')) return;
      const href = link.getAttribute('href');
      if (!href) return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      if (url.pathname.startsWith('/studio') || url.pathname.startsWith('/api')) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Before React and next/link see the click: this component does the navigating
      e.preventDefault();
      e.stopPropagation();
      busy.current = true;
      const next = url.pathname + url.search + url.hash;
      router.prefetch(next);
      // The new page's own entrance (titles rising, see globals.css) waits until it is uncovered
      document.documentElement.dataset.pageCover = 'on';
      setTarget({ href: next, path: url.pathname });
      setPhase('cover');
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  // Covered: go to the page
  useEffect(() => {
    if (phase !== 'cover' || !target) return;
    const timer = setTimeout(() => {
      router.push(target.href);
      setPhase('hold');
    }, SWEEP_MS);
    return () => clearTimeout(timer);
  }, [phase, target, router]);

  // The page has arrived (or is taking too long): uncover it
  useEffect(() => {
    if (phase !== 'hold' || !target) return;
    const arrived = pathname === target.path;
    const timer = setTimeout(() => setPhase('reveal'), arrived ? SETTLE_MS : GIVE_UP_MS);
    return () => clearTimeout(timer);
  }, [phase, target, pathname]);

  // Uncovering: let the page's entrance play, then get ready for the next click
  useEffect(() => {
    if (phase !== 'reveal') return;
    delete document.documentElement.dataset.pageCover;
    const timer = setTimeout(() => {
      setPhase('idle');
      setTarget(null);
      busy.current = false;
    }, SWEEP_MS + 80);
    return () => clearTimeout(timer);
  }, [phase]);

  const covering = phase === 'cover' || phase === 'hold';
  const y = phase === 'idle' ? '101%' : covering ? '0%' : '-101%';
  const nameKey = target ? nameKeyFor(target.path) : null;
  const name = nameKey ? ui[localeOfPath(target!.path)][nameKey] : '';

  return (
    <div
      className={`fixed inset-0 z-[90] ${phase === 'idle' ? 'pointer-events-none' : ''}`}
      aria-hidden="true"
      // Screen readers are told about the new page by the browser; this is decoration
    >
      <div className="absolute inset-0 flex">
        {Array.from({ length: PANELS }, (_, i) => (
          <motion.div
            key={i}
            // A hair wider than a fifth, so no page shows through between panels
            className="h-full flex-1 bg-gradient-to-b from-maroon to-[#7d1f47] will-change-transform"
            style={{ marginRight: i < PANELS - 1 ? -1 : 0 }}
            initial={false}
            animate={{ y }}
            transition={phase === 'idle' ? { duration: 0 } : { duration: MOVE, ease: EASE, delay: i * STAGGER }}
          />
        ))}
      </div>

      {/* Written across the panels while the screen is covered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 overflow-hidden">
        <motion.div
          initial={false}
          animate={covering ? { opacity: 1, y: 0 } : { opacity: 0, y: phase === 'reveal' ? -24 : 24 }}
          transition={covering ? { duration: 0.5, ease: EASE, delay: 0.32 } : { duration: phase === 'idle' ? 0 : 0.22 }}
        >
          <Image src="/assets/images/brand/logo-gold.webp" alt="" width={52} height={62} className="h-14 w-auto" />
        </motion.div>
        <div className="overflow-hidden pb-[0.14em]">
          <motion.p
            className="text-5xl font-medium leading-none text-gold md:text-8xl"
            initial={false}
            animate={covering ? { y: '0%' } : { y: phase === 'reveal' ? '-115%' : '115%' }}
            transition={covering ? { duration: 0.6, ease: EASE, delay: 0.38 } : { duration: phase === 'idle' ? 0 : 0.3, ease: EASE }}
          >
            {name}
          </motion.p>
        </div>
        <motion.span
          className="h-px w-40 origin-left bg-gold/70 md:w-64"
          initial={false}
          animate={covering ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={covering ? { duration: 0.7, ease: EASE, delay: 0.5 } : { duration: phase === 'idle' ? 0 : 0.2 }}
        />
      </div>
    </div>
  );
};
