"use client";

import { useEffect, useRef } from 'react';

/**
 * Placed inside a section: makes it wait at the bottom of the screen behind the section before
 * it, which then scrolls away and uncovers it (the opposite of CurtainHold, where the later
 * section slides over the earlier one).
 *
 * The section is only fixed to the screen once the one before it covers the whole place where it
 * waits; until then it stays where it is in the page, far below the screen. That keeps it from
 * showing through anything further up the page. Where the effect cannot work (the section is
 * taller than the screen, or the one before it is too short to hide it), and for reduced-motion
 * users, scrolling stays ordinary.
 */
export const RevealBehind = () => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = ref.current?.closest('section');
    const before = section?.previousElementSibling;
    if (!section || !(before instanceof HTMLElement)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // The covering section has to paint above this one, which comes after it in the page
    const wasStatic = getComputedStyle(before).position === 'static';
    if (wasStatic) before.style.position = 'relative';
    before.style.zIndex = '1';

    let frame = 0;
    const place = () => {
      frame = 0;
      const height = section.offsetHeight;
      const wait = window.innerHeight - height;
      const covered = wait >= 0 && before.offsetHeight >= height && before.getBoundingClientRect().top <= wait;
      section.style.position = covered ? 'sticky' : '';
      section.style.bottom = covered ? '0px' : '';
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(place);
    };
    place();
    const observer = new ResizeObserver(queue);
    observer.observe(before);
    observer.observe(section);
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      section.style.position = '';
      section.style.bottom = '';
      before.style.zIndex = '';
      if (wasStatic) before.style.position = '';
    };
  }, []);

  return <span ref={ref} hidden />;
};
