"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/** The intro's "already seen" note (components/shared/Preloader.tsx): cleared so the intro plays */
const INTRO_SEEN_KEY = 'sn_preloaded';
/** How long the cut, the falling ribbon and the confetti play before the site opens */
const OPEN_AFTER_MS = 2600;

const SATIN = 'linear-gradient(180deg, #7a1838 0%, #c23a6a 22%, #e0789c 38%, #b13160 55%, #7a1838 100%)';
const GOLD_EDGE = 'linear-gradient(90deg, #b99a52, #f4e8c2, #cdb573, #f4e8c2, #b99a52)';

/** One half of the ribbon: from the screen edge to where it was cut */
const RibbonHalf = ({ side, cutAt, cut, reduceMotion }: { side: 'left' | 'right'; cutAt: number; cut: boolean; reduceMotion: boolean }) => {
  const left = side === 'left';
  return (
    <motion.div
      className="absolute top-1/2 h-16 -translate-y-1/2 md:h-24"
      style={{
        left: left ? 0 : `${cutAt}%`,
        right: left ? `${100 - cutAt}%` : 0,
        background: SATIN,
        transformOrigin: left ? '0% 50%' : '100% 50%',
        boxShadow: '0 18px 30px -12px rgba(0,0,0,0.6)',
      }}
      animate={
        cut && !reduceMotion
          ? { rotate: left ? 28 : -28, y: '70vh', opacity: [1, 1, 0] }
          : cut
            ? { opacity: 0 }
            : { rotate: 0, y: 0, opacity: 1 }
      }
      transition={{ duration: 1.6, ease: [0.55, 0, 0.75, 0.25], delay: 0.15 }}
    >
      <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: GOLD_EDGE }} />
      <div className="absolute inset-x-0 bottom-0 h-1.5" style={{ background: GOLD_EDGE }} />
      {/* A soft sheen gliding along the satin while it waits */}
      {!cut && !reduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-y-0 w-40 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          animate={{ left: ['-20%', '110%'] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: left ? 0 : 1.6 }}
        />
      )}
    </motion.div>
  );
};

/** The bow in the middle of the ribbon */
const Bow = () => (
  <svg viewBox="0 0 220 160" className="h-full w-full drop-shadow-[0_18px_22px_rgba(0,0,0,0.55)]" aria-hidden="true">
    <defs>
      <linearGradient id="bow-satin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e0789c" />
        <stop offset="0.45" stopColor="#b13160" />
        <stop offset="1" stopColor="#6d1532" />
      </linearGradient>
    </defs>
    {/* Tails */}
    <path d="M100 82 L62 152 L80 146 L92 158 L108 88 Z" fill="url(#bow-satin)" stroke="#E4D4A3" strokeWidth="2" />
    <path d="M120 82 L158 152 L140 146 L128 158 L112 88 Z" fill="url(#bow-satin)" stroke="#E4D4A3" strokeWidth="2" />
    {/* Loops */}
    <path d="M108 74 C70 20 12 22 14 70 C16 112 70 106 108 84 Z" fill="url(#bow-satin)" stroke="#E4D4A3" strokeWidth="2.5" />
    <path d="M112 74 C150 20 208 22 206 70 C204 112 150 106 112 84 Z" fill="url(#bow-satin)" stroke="#E4D4A3" strokeWidth="2.5" />
    {/* Knot */}
    <rect x="94" y="62" width="32" height="34" rx="10" fill="#8f2147" stroke="#E4D4A3" strokeWidth="2.5" />
  </svg>
);

/** A fixed "random" number from 0 to 1 for piece i, so every render draws the same burst */
const spread = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Gold paper pieces bursting from where the ribbon was cut */
const Confetti = ({ x }: { x: number }) => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => {
        const angle = (spread(i, 1) * 2 - 1) * Math.PI;
        const power = 180 + spread(i, 2) * 420;
        return {
          id: i,
          dx: Math.cos(angle) * power,
          dy: Math.sin(angle) * power - 160,
          fall: 380 + spread(i, 3) * 380,
          spin: (spread(i, 4) * 2 - 1) * 720,
          size: 6 + spread(i, 5) * 8,
          color: ['#E4D4A3', '#f4e8c2', '#cdb573', '#B13160', '#ffffff'][i % 5],
          round: i % 3 === 0,
        };
      }),
    []
  );
  return (
    <div className="pointer-events-none absolute top-1/2 z-30" style={{ left: `${x}%` }} aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute block"
          style={{ width: p.size, height: p.round ? p.size : p.size * 0.45, background: p.color, borderRadius: p.round ? 999 : 1 }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: p.dx, y: [0, p.dy, p.dy + p.fall], rotate: p.spin, opacity: [1, 1, 0] }}
          transition={{ duration: 2.2, ease: 'easeOut', times: [0, 0.35, 1] }}
        />
      ))}
    </div>
  );
};

/**
 * The opening ceremony: a satin ribbon with a bow across the screen. Clicking (or tapping) the
 * ribbon cuts it where it was touched; the halves fall away, gold confetti bursts, and the site
 * opens with its intro, as on a first visit.
 */
export const RibbonCutting = () => {
  const reduceMotion = Boolean(useReducedMotion());
  const [cutAt, setCutAt] = useState<number | null>(null);
  const cut = cutAt !== null;

  const doCut = (percent: number) => {
    if (cut) return;
    setCutAt(Math.min(85, Math.max(15, percent)));
    window.setTimeout(() => {
      try {
        sessionStorage.removeItem(INTRO_SEEN_KEY);
      } catch {}
      // A full page load (not the router), so the intro's start-up script runs
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign('/');
    }, reduceMotion ? 900 : OPEN_AFTER_MS);
  };

  return (
    <main
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-between overflow-hidden bg-[#0f0408] px-5 py-12 text-gold"
      style={{ cursor: cut ? 'default' : undefined }}
    >
      {/* Warm glow behind everything */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(177,49,96,0.45),transparent_60%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[120px]" aria-hidden="true" />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/images/brand/logo-gold.webp" alt="Shah Noori" className="h-16 w-auto md:h-20" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.45em] text-gold/80 md:text-sm">Grand Opening</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">
          The new Shah Noori website
        </h1>
        <p className="mt-3 text-lg text-gold/80 md:text-xl" dir="rtl" lang="ar" style={{ fontFamily: 'var(--font-arabic), sans-serif' }}>
          الافتتاح الرسمي لموقع Shah Noori الجديد
        </p>
      </motion.div>

      {/* The ribbon across the screen; anywhere on it can be cut */}
      <div
        className="absolute inset-x-0 top-1/2 z-20 h-28 -translate-y-1/2 md:h-36"
        style={{ cursor: cut ? 'default' : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 24 24' fill='none' stroke='%23E4D4A3' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='6' cy='6' r='3'/%3E%3Ccircle cx='6' cy='18' r='3'/%3E%3Cpath d='M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12'/%3E%3C/svg%3E\") 22 22, pointer" }}
        onClick={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          doCut(((e.clientX - box.left) / box.width) * 100);
        }}
      >
        <RibbonHalf side="left" cutAt={cutAt ?? 50} cut={cut} reduceMotion={reduceMotion} />
        <RibbonHalf side="right" cutAt={cutAt ?? 50} cut={cut} reduceMotion={reduceMotion} />
        <motion.div
          className="absolute left-1/2 top-1/2 h-36 w-48 -translate-x-1/2 -translate-y-1/2 md:h-48 md:w-64"
          animate={cut ? (reduceMotion ? { opacity: 0 } : { y: '75vh', rotate: 35, opacity: [1, 1, 0] }) : { y: [0, -4, 0] }}
          transition={cut ? { duration: 1.5, ease: [0.55, 0, 0.75, 0.25], delay: 0.25 } : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Bow />
        </motion.div>
        {cut && !reduceMotion && <Confetti x={cutAt!} />}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <AnimatePresence mode="wait">
          {!cut ? (
            <motion.div key="ask" className="flex flex-col items-center gap-4" exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <motion.p
                className="text-base text-gold/85 md:text-lg"
                animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                Click the ribbon to cut it and open the website
              </motion.p>
              <button
                type="button"
                onClick={() => doCut(50)}
                className="rounded-full border border-gold/50 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.25em] text-gold transition hover:bg-gold hover:text-[#57132D]"
              >
                ✂ Cut the ribbon
              </button>
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <p className="text-2xl font-semibold md:text-4xl">The website is open!</p>
              <p className="mt-2 text-lg text-gold/80" dir="rtl" lang="ar" style={{ fontFamily: 'var(--font-arabic), sans-serif' }}>
                تم افتتاح الموقع
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="text-xs uppercase tracking-[0.3em] text-gold/50">sncreatives.com</p>
      </div>
    </main>
  );
};
