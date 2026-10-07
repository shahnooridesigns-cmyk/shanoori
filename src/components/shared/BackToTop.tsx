"use client";

import React, { useEffect, useRef, useState } from 'react';

/** Asked for by the button; SmoothScrollProvider answers it when smooth scrolling is running. */
export const SCROLL_TOP_EVENT = 'sn:scroll-top';
/** How far down the page (px) before the button appears */
const SHOW_AFTER = 600;
/** Progress ring: radius and the length of its full circle, in the 48-unit viewBox */
const RING_RADIUS = 22;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/**
 * Round "back to top" button that sits just above the floating WhatsApp button. The gold ring
 * around it fills as the page is scrolled: empty at the top, a full circle at the bottom.
 */
export const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      // Written straight to the ring: no re-render on every scroll tick
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(RING_LENGTH * (1 - progress));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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
      aria-label="Back to top"
      data-cursor="Top"
      tabIndex={visible ? 0 : -1}
      className={`group fixed bottom-24 right-7 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-maroon text-gold shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-gold ${
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="relative h-5 w-5 transition-transform group-hover:-translate-y-0.5" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
};
