"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Caveat } from 'next/font/google';
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion } from 'framer-motion';

const hand = Caveat({ subsets: ['latin'], weight: ['500', '600'] });

/**
 * First-visit preloader: a pencil sketch of a room (arched window, plant, armchair, pendant
 * lamp) draws itself while handwritten notes change underneath, then the lamp switches on
 * and the sheet lifts away to reveal the page.
 *
 * Shown once per browser session. The inline script below runs before first paint: it
 * turns the overlay on (it's display:none in CSS otherwise, so no-JS visitors and repeat
 * visits never see it) and locks scrolling. If hydration never happens, a timer in the
 * script removes the overlay so the site can't get stuck behind it.
 */

const SEEN_KEY = 'sn_preloaded';
const MIN_MS = 2400; // long enough for the sketch to finish drawing
const MAX_MS = 6000; // stop waiting for slow images after this

const NOTES = ['Marhaba!', 'Measuring twice…', 'Picking the fabrics…', 'Hanging the lamp…'];
const FINAL_NOTE = 'Welcome in.';

// Each stroke of the sketch, with when it starts drawing (s) and how long it takes.
const STROKES: { d: string; at: number; dur: number }[] = [
  // floor
  { d: 'M8 182 C70 179 150 185 252 181', at: 0, dur: 0.6 },
  // arched window, sill and glazing bars
  { d: 'M62 150 L62 96 C62 70 82 56 104 56 C126 56 146 70 146 96 L146 150 Z', at: 0.25, dur: 0.9 },
  { d: 'M56 153 C80 151 120 154 152 152', at: 0.9, dur: 0.35 },
  { d: 'M104 57 L104 150', at: 1.05, dur: 0.3 },
  { d: 'M63 108 C90 107 120 109 145 108', at: 1.15, dur: 0.3 },
  // plant in a pot
  { d: 'M16 182 L20 160 L42 160 L46 182', at: 0.7, dur: 0.4 },
  { d: 'M31 160 C29 145 22 136 14 128', at: 1.0, dur: 0.3 },
  { d: 'M31 160 C33 142 40 132 50 126', at: 1.1, dur: 0.3 },
  { d: 'M31 160 C31 146 30 136 32 116', at: 1.2, dur: 0.3 },
  { d: 'M14 128 C9 122 11 115 18 113 C20 119 19 125 14 128 Z', at: 1.3, dur: 0.25 },
  { d: 'M50 126 C56 122 58 115 53 110 C48 114 46 121 50 126 Z', at: 1.38, dur: 0.25 },
  { d: 'M32 116 C27 110 28 103 33 99 C38 104 37 111 32 116 Z', at: 1.46, dur: 0.25 },
  // armchair
  { d: 'M172 152 C170 128 177 118 200 118 C223 118 230 128 228 152', at: 1.3, dur: 0.5 },
  { d: 'M162 182 L162 158 C162 147 177 147 177 158 L177 170', at: 1.55, dur: 0.35 },
  { d: 'M238 182 L238 158 C238 147 223 147 223 158 L223 170', at: 1.65, dur: 0.35 },
  { d: 'M177 168 C192 163 208 163 223 168', at: 1.8, dur: 0.3 },
  // pendant lamp
  { d: 'M200 0 L200 46', at: 1.85, dur: 0.3 },
  { d: 'M183 66 C185 54 191 46 200 46 C209 46 215 54 217 66 Z', at: 2.0, dur: 0.35 },
  { d: 'M195 67 C195 73 205 73 205 67', at: 2.2, dur: 0.15 },
];

const loaded = () =>
  new Promise<void>((resolve) => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', () => resolve(), { once: true });
  });

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

type Phase = 'drawing' | 'lit' | 'leaving' | 'done';

const BOOT_SCRIPT = `(function(){var h=document.documentElement,s=0;try{s=sessionStorage.getItem('${SEEN_KEY}')}catch(e){}
if(s){h.dataset.snPreload='skip';return}h.dataset.snPreload='on';
window.__snPreloadFailsafe=setTimeout(function(){if(h.dataset.snPreload==='on')h.dataset.snPreload='skip'},10000)})()`;

/** Runs during HTML parsing on full page loads; inert when React renders it on the client. */
const InlineScript = ({ html }: { html: string }) => (
  <script
    type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
    suppressHydrationWarning
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

export const Preloader = () => {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('drawing');
  const [note, setNote] = useState(0);
  const progress = useMotionValue(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const unblockRef = useRef(() => {});
  const finishRef = useRef(() => {});

  useMotionValueEvent(progress, 'change', (v) => {
    if (countRef.current) countRef.current.textContent = String(Math.round(v)).padStart(3, '0');
  });

  useEffect(() => {
    const html = document.documentElement;
    const w = window as Window & { __snPreloadFailsafe?: number };
    clearTimeout(w.__snPreloadFailsafe);

    // Repeat visit this session (or a client-side render without the boot script):
    // the overlay stays display:none, so there's nothing to run
    if (html.dataset.snPreload !== 'on') return;

    // Keep Lenis from scrolling the page underneath. Capture on window runs before
    // Lenis's own wheel listener, and stopping it there keeps the event from reaching it.
    // The component stays mounted after finishing, so finish() must remove these too.
    const block = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener('wheel', block, { capture: true, passive: false });
    window.addEventListener('touchmove', block, { capture: true, passive: false });
    unblockRef.current = () => {
      window.removeEventListener('wheel', block, { capture: true });
      window.removeEventListener('touchmove', block, { capture: true });
    };

    let cancelled = false;
    const ticker = setInterval(() => setNote((n) => Math.min(n + 1, NOTES.length - 1)), 620);
    const counting = animate(progress, 90, { duration: reduceMotion ? 0.6 : 2.2, ease: [0.22, 1, 0.36, 1] });

    (async () => {
      await Promise.race([Promise.all([loaded(), document.fonts.ready, wait(reduceMotion ? 600 : MIN_MS)]), wait(MAX_MS)]);
      if (cancelled) return;
      counting.stop();
      await animate(progress, 100, { duration: 0.35, ease: 'easeOut' });
      if (cancelled) return;
      clearInterval(ticker);
      setPhase('lit');
      await wait(reduceMotion ? 300 : 750);
      if (cancelled) return;
      setPhase('leaving');
      // Backup in case the lift animation's completion callback never fires
      await wait(1500);
      if (!cancelled) finishRef.current();
    })();

    return () => {
      cancelled = true;
      clearInterval(ticker);
      counting.stop();
      unblockRef.current();
    };
  }, [progress, reduceMotion]);

  const finish = () => {
    unblockRef.current();
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {}
    document.documentElement.dataset.snPreload = 'skip';
    setPhase('done');
  };

  useEffect(() => {
    finishRef.current = finish;
  });

  if (phase === 'done') return null;

  const lit = phase !== 'drawing';
  const leaving = phase === 'leaving';

  return (
    <>
      <motion.div
        className="sn-preloader fixed inset-0 z-[200] flex-col items-center justify-center bg-ink text-gold"
        role="status"
        aria-live="polite"
        aria-label="Loading Shah Noori"
        initial={false}
        animate={{ clipPath: leaving ? 'inset(0% 0% 100% 0%)' : 'inset(0% 0% 0% 0%)' }}
        transition={{ duration: reduceMotion ? 0.3 : 0.95, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={() => leaving && finish()}
      >
        {/* Faint paper grain so it reads like a sheet, not a screen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-screen"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <motion.div
          className="relative flex flex-col items-center"
          animate={leaving ? { y: -60, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <svg viewBox="0 0 260 200" className="w-[min(72vw,400px)] overflow-visible" aria-hidden="true">
            <defs>
              {/* Pencil wobble; the seed flicks a few times a second so lines "boil" like a hand-drawn cartoon */}
              <filter id="sn-pencil" x="-5%" y="-5%" width="110%" height="110%">
                <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="1">
                  {!reduceMotion && (
                    <animate attributeName="seed" values="1;4;7;2" dur="0.5s" calcMode="discrete" repeatCount="indefinite" />
                  )}
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" scale="2.6" />
              </filter>
              <linearGradient id="sn-cone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F3EBA8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#F3EBA8" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="sn-bulb">
                <stop offset="0%" stopColor="#F3EBA8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#F3EBA8" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Lamp light, switched on once loading is done, with a little bulb flicker */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: lit ? (reduceMotion ? 1 : [0, 0.9, 0.2, 0.7, 0.35, 1]) : 0 }}
              transition={
                lit && !reduceMotion
                  ? { duration: 0.6, times: [0, 0.15, 0.3, 0.5, 0.65, 1], ease: 'linear' }
                  : { duration: 0.2 }
              }
            >
              <path d="M184 67 L146 182 L254 182 L216 67 Z" fill="url(#sn-cone)" />
              <circle cx="200" cy="70" r="26" fill="url(#sn-bulb)" />
            </motion.g>

            <g
              filter="url(#sn-pencil)"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {STROKES.map((s) => (
                <motion.path
                  key={s.d}
                  d={s.d}
                  initial={{ pathLength: reduceMotion ? 1 : 0, opacity: reduceMotion ? 1 : 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { delay: s.at, duration: s.dur, ease: [0.45, 0, 0.3, 1] },
                    opacity: { delay: s.at, duration: 0.01 },
                  }}
                />
              ))}
            </g>
          </svg>

          {/* Handwritten note with a scribbled underline that redraws for each one */}
          <div className={`${hand.className} relative mt-8 h-12 text-[30px] leading-none sm:text-[34px]`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={lit ? 'final' : note}
                className="whitespace-nowrap text-center"
                initial={{ opacity: 0, y: 10, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: -1.5 }}
                exit={{ opacity: 0, y: -8, rotate: -1 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                {lit ? FINAL_NOTE : NOTES[note]}
                <svg viewBox="0 0 140 10" preserveAspectRatio="none" className="mx-auto mt-1 h-2.5 w-[85%]" aria-hidden="true">
                  <motion.path
                    d="M2 6 C30 2 60 9 95 5 C110 3 125 5 138 4"
                    fill="none"
                    stroke="#B13160"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.1, duration: 0.35, ease: 'easeOut' }}
                  />
                </svg>
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Studio credit and counter in the corners, like the title block on a drawing */}
        <motion.div
          className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-6 text-xs uppercase tracking-[0.25em] text-gold/60 sm:px-10 sm:pb-8"
          animate={{ opacity: leaving ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <span>
            Shah Noori
            <span className="hidden sm:inline"> · Interior &amp; Fit-out · Doha</span>
          </span>
          <span className="text-2xl font-medium tracking-normal tabular-nums text-gold sm:text-3xl">
            <span ref={countRef}>000</span>
            <span className="text-gold/50">%</span>
          </span>
        </motion.div>
      </motion.div>
      <InlineScript html={BOOT_SCRIPT} />
    </>
  );
};
