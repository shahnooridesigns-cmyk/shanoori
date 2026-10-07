"use client";

import { useEffect, useRef } from 'react';

/**
 * Placed inside a section: holds whatever section comes just before it in place once that one
 * has been scrolled through, so this section slides up over it like a curtain. The held section
 * pins the moment its bottom edge reaches the bottom of the screen (whether it is shorter or
 * taller than the screen), so nothing in it is skipped. The section using this must be
 * positioned (`relative`) so it paints above the held one. Reduced-motion users get ordinary
 * scrolling.
 */
export const CurtainHold = () => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const before = ref.current?.closest('section')?.previousElementSibling;
    if (!(before instanceof HTMLElement)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const place = () => {
      before.style.top = `${window.innerHeight - before.offsetHeight}px`;
    };
    before.style.position = 'sticky';
    place();
    // The height changes when an answer opens, a filter is chosen or the text reflows
    const observer = new ResizeObserver(place);
    observer.observe(before);
    window.addEventListener('resize', place);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', place);
      before.style.position = '';
      before.style.top = '';
    };
  }, []);

  return <span ref={ref} hidden />;
};
