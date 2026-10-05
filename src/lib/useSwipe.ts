import { useRef, type TouchEvent } from 'react';

/** A horizontal drag shorter than this (px) is a tap, not a swipe */
const SWIPE_MIN = 40;

/**
 * Touch handlers for a slider: swiping left asks for the next item (1), right for the
 * previous one (-1). Mostly-vertical drags are ignored so the page still scrolls.
 * `onTouching` reports when a finger goes down and lifts, for pausing autoplay.
 */
export const useSwipe = (onSwipe: (direction: 1 | -1) => void, onTouching?: (touching: boolean) => void) => {
  const start = useRef<{ x: number; y: number } | null>(null);

  return {
    onTouchStart: (e: TouchEvent) => {
      start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      onTouching?.(true);
    },
    onTouchEnd: (e: TouchEvent) => {
      const from = start.current;
      start.current = null;
      onTouching?.(false);
      if (!from) return;
      const dx = e.changedTouches[0].clientX - from.x;
      const dy = e.changedTouches[0].clientY - from.y;
      if (Math.abs(dx) >= SWIPE_MIN && Math.abs(dx) > Math.abs(dy) * 1.5) onSwipe(dx < 0 ? 1 : -1);
    },
    onTouchCancel: () => {
      start.current = null;
      onTouching?.(false);
    },
  };
};
