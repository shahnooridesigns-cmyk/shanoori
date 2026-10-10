"use client";

import { useEffect, useRef } from 'react';

/**
 * Placed inside a box of lazily loaded images: once the box comes within about a screen and a
 * half of the visible page, all its images are fetched at once. For rows that slide sideways
 * (the client logos): the browser by itself would only fetch each image as it slides into view,
 * leaving gaps, while fetching them all at the top of the page slows the first screen.
 */
export const LoadWhenNear = () => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const box = ref.current?.parentElement;
    if (!box) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        box.querySelectorAll('img').forEach((img) => {
          img.loading = 'eager';
        });
        observer.disconnect();
      },
      { rootMargin: '150% 0px' }
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return <span ref={ref} hidden />;
};
