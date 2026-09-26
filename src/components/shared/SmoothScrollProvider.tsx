"use client";

import React, { useEffect } from 'react';
import Lenis from 'lenis';

export const SmoothScrollProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Check reduced motion to respect OS settings
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Initialize Lenis with standard config (matching Farwaygo feel)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch devices can sometimes have jank, but Lenis disables touch smoothing by default.
      // We rely on native touch scroll for better mobile performance.
    });

    // Run requestAnimationFrame loop (cancelled on unmount so it doesn't outlive Lenis)
    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Global listener for anchor links to handle smooth scrolling with offset
    const handleAnchorClick = (e: MouseEvent) => {
      // Leave modified clicks (new tab/window) and already-handled events alone
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor || anchor.target === '_blank') return;

      const href = anchor.getAttribute('href');
      if (!href?.includes('#')) return;

      try {
        const url = new URL(anchor.href);
        // Only intercept hash links pointing at an element on the current page
        if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.hash.length < 2) return;
        const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (!target) return;

        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 }); // Offset for sticky header
        history.pushState(null, '', url.hash);
      } catch {
        // Ignore invalid URLs
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
