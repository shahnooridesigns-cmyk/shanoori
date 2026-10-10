"use client";

import { useT } from './LocaleProvider';
import React, { useEffect, useRef, useState } from 'react';

/** Asked for by the button; SmoothScrollProvider answers it when smooth scrolling is running. */
export const SCROLL_TOP_EVENT = 'sn:scroll-top';
/** How far down the page (px) before the button appears */
const SHOW_AFTER = 600;
/** Progress ring: radius and the length of its full circle, in the 48-unit viewBox */
const RING_RADIUS = 22;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/**
 * Round frosted-glass "back to top" button that sits just above the floating WhatsApp button. The ring
 * around it fills as the page is scrolled: empty at the top, a full circle at the bottom.
 */
export const BackToTop = () => {
  const t = useT();
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    // How far the page can scroll. Measuring it makes the browser lay the page out, so it is
    // done when the page's size changes, and the scroll handler only does arithmetic.
    let scrollable = 0;
    const measure = () => {
      scrollable = document.documentElement.scrollHeight - window.innerHeight;
      onScroll();
    };
    let frame = 0;
    const paint = () => {
      frame = 0;
      setVisible(window.scrollY > SHOW_AFTER);
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      // Written straight to the ring: no re-render on every scroll tick
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(RING_LENGTH * (1 - progress));
    };
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(paint);
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const toTop = () => {
    // The smooth scroller glides up if it is running; otherwise jump with the browser's own scroll
    const handled = !window.dispatchEvent(new Event(SCROLL_TOP_EVENT, { cancelable: true }));
    if (!handled) window.scrollTo({ top: 0 });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={t('action.backToTop')}
      data-cursor={t('action.top')}
      tabIndex={visible ? 0 : -1}
      className={`group fixed bottom-[84px] end-5 z-50 flex h-12 w-12 items-center md:bottom-24 md:end-6 md:h-14 md:w-14 justify-center rounded-full border border-white/35 bg-maroon/55 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-maroon/75 focus:outline-none focus-visible:ring-4 focus-visible:ring-gold ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      {/* Starts at 12 o'clock and runs clockwise */}
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r={RING_RADIUS} stroke="currentColor" strokeWidth="2.5" className="opacity-20" />
        <circle
          ref={ringRef}
          cx="24"
          cy="24"
          r={RING_RADIUS}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={RING_LENGTH}
          strokeDashoffset={RING_LENGTH}
        />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="relative h-5 w-5 transition-transform group-hover:-translate-y-0.5 md:h-6 md:w-6" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
};
