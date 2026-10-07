"use client";

import { useEffect, useRef } from 'react';

/**
 * Placed inside the closing banner: holds whatever section comes just before the banner in
 * place once it has been scrolled through, so the banner slides up over it like a curtain.
 * A section shorter than the screen pins at the top; a taller one pins once its bottom edge
 * reaches the bottom of the screen, so nothing in it is skipped. Works on any page without
 * that section knowing about it. Reduced-motion users get ordinary scrolling.
 */
export const CurtainHold = () => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const before = ref.current?.closest('section')?.previousElementSibling;
    if (!(before instanceof HTMLElement)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const place = () => {
      before.style.top = `${Math.min(0, window.innerHeight - before.offsetHeight)}px`;
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
