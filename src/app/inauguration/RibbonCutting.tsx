"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/** The intro's "already seen" note (components/shared/Preloader.tsx): cleared so the intro plays */
const INTRO_SEEN_KEY = 'sn_preloaded';
/** How long the cut, the falling ribbon and the celebration play before the site opens */
const OPEN_AFTER_MS = 3800;
/** The screen fades to the intro's black this long before the site opens, so one flows into the other */
const FADE_MS = 1000;
/** Where the two gold posts stand, as a share of the screen width */
const POST_LEFT = 7;
const POST_RIGHT = 93;

/** A fixed "random" number from 0 to 1, so every render draws the same pattern */
const spread = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const GOLD_TEXT = 'linear-gradient(100deg, #b99a52 0%, #f8eecf 22%, #d9c07f 40%, #fff6dc 52%, #c9ab62 70%, #f4e8c2 100%)';
const ARABIC = { fontFamily: 'var(--font-arabic), sans-serif' };

/** Gold art-deco corners framing the screen */
const Corner = ({ className }: { className: string }) => (
  <svg viewBox="0 0 120 120" className={`pointer-events-none absolute h-16 w-16 md:h-28 md:w-28 ${className}`} aria-hidden="true">
    <path d="M4 116 V4 H116" fill="none" stroke="#cdb573" strokeWidth="1.5" />
    <path d="M14 116 V14 H116" fill="none" stroke="#cdb573" strokeOpacity="0.45" strokeWidth="1" />
    <path d="M4 4 L26 26" stroke="#cdb573" strokeWidth="1" />
    <rect x="21" y="21" width="10" height="10" transform="rotate(45 26 26)" fill="#e4d4a3" />
  </svg>
);

/** Small gold lights drifting upwards in the dark */
const Sparkles = () => {
  const dots = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => ({
        id: i,
        left: Math.round(spread(i, 1) * 1000) / 10,
        top: Math.round(spread(i, 2) * 1000) / 10,
        size: Math.round((1.5 + spread(i, 3) * 3) * 10) / 10,
        delay: spread(i, 4) * 6,
        duration: 5 + spread(i, 5) * 6,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-[#f4e8c2]"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size, boxShadow: 'rgba(244, 232, 194, 0.55) 0px 0px 8px 2px' }}
          animate={{ y: [0, -40, -80], opacity: [0, 1, 0] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

/** One gold post holding an end of the ribbon */
const Post = ({ side, top }: { side: 'left' | 'right'; top: string }) => (
  <div
    className="pointer-events-none absolute bottom-0 z-20 -mt-14 flex w-6 -translate-x-1/2 flex-col items-center md:-mt-[4.5rem] md:w-8"
    style={{ left: `${side === 'left' ? POST_LEFT : POST_RIGHT}%`, top }}
    aria-hidden="true"
  >
    {/* Ball on top */}
    <div
      className="-mt-3 h-6 w-6 shrink-0 rounded-full md:-mt-4 md:h-8 md:w-8"
      style={{ background: 'radial-gradient(circle at 35% 30%, #fff6dc, #d9c07f 45%, #8a6d2f 100%)', boxShadow: '0 6px 14px rgba(0,0,0,0.5)' }}
    />
    {/* Pole */}
    <div className="w-2 flex-1 md:w-3" style={{ background: 'linear-gradient(90deg, #6b5222, #f4e8c2 45%, #b99a52 70%, #5e461b)' }} />
    {/* Base */}
    <div className="h-3 w-14 shrink-0 rounded-t-full md:w-20" style={{ background: 'linear-gradient(180deg, #e4d4a3, #8a6d2f)' }} />
  </div>
);

/** Where the ribbon is knotted round a post: a gathered band of satin over the ribbon's end */
const Tie = ({ side, top }: { side: 'left' | 'right'; top: string }) => (
  <div
    className="pointer-events-none absolute z-40 h-[62px] w-4 -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[84px] md:w-5"
    style={{
      left: `${side === 'left' ? POST_LEFT : POST_RIGHT}%`,
      top,
      background: 'linear-gradient(90deg, #4f0b21, #c63d6e 35%, #f7b9cd 50%, #c63d6e 65%, #4f0b21)',
      boxShadow: '0 0 0 1.5px #cdb573, 0 6px 10px rgba(0,0,0,0.5)',
    }}
    aria-hidden="true"
  >
    {/* Creases of the gathered satin */}
    <span className="absolute inset-x-0 top-[30%] h-px bg-black/30" />
    <span className="absolute inset-x-0 top-[55%] h-px bg-white/30" />
    <span className="absolute inset-x-0 top-[75%] h-px bg-black/25" />
  </div>
);

/** The satin ribbon from post to post: a gentle sag, woven texture, a glossy highlight and fine gold trim */
const RIBBON_TOP_EDGE = 'M0 34 Q500 70 1000 34';
const RIBBON_BOTTOM_EDGE = 'M0 106 Q500 142 1000 106';
const RibbonArt = () => (
  <svg viewBox="0 0 1000 140" preserveAspectRatio="none" className="h-full w-full overflow-visible" aria-hidden="true">
    <defs>
      <linearGradient id="rb-satin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4f0b21" />
        <stop offset="0.2" stopColor="#9c2148" />
        <stop offset="0.33" stopColor="#e47a9d" />
        <stop offset="0.4" stopColor="#f7b9cd" />
        <stop offset="0.48" stopColor="#c63d6e" />
        <stop offset="0.68" stopColor="#8a1b40" />
        <stop offset="0.84" stopColor="#b8406a" />
        <stop offset="1" stopColor="#4f0b21" />
      </linearGradient>
      <linearGradient id="rb-gold" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#a8873f" />
        <stop offset="0.25" stopColor="#fff6dc" />
        <stop offset="0.5" stopColor="#cdb573" />
        <stop offset="0.75" stopColor="#fff6dc" />
        <stop offset="1" stopColor="#a8873f" />
      </linearGradient>
      {/* Fine lengthwise threads of the weave */}
      <pattern id="rb-weave" width="8" height="4" patternUnits="userSpaceOnUse">
        <rect width="8" height="1" fill="#ffffff" opacity="0.07" />
        <rect y="2" width="8" height="1" fill="#000000" opacity="0.08" />
      </pattern>
    </defs>
    <path d="M0 34 Q500 70 1000 34 L1000 106 Q500 142 0 106 Z" fill="url(#rb-satin)" />
    <path d="M0 34 Q500 70 1000 34 L1000 106 Q500 142 0 106 Z" fill="url(#rb-weave)" />
    {/* Gloss along the top third, and the soft shade of a fold below it */}
    <path d="M0 50 Q500 86 1000 50" fill="none" stroke="#ffffff" strokeOpacity="0.32" strokeWidth="6" strokeLinecap="round" />
    <path d="M0 55 Q500 91 1000 55" fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="12" />
    <path d="M0 86 Q500 122 1000 86" fill="none" stroke="#2e0410" strokeOpacity="0.22" strokeWidth="10" />
    {/* Double gold trim on both edges */}
    <path d={RIBBON_TOP_EDGE} fill="none" stroke="url(#rb-gold)" strokeWidth="4.5" />
    <path d="M0 40 Q500 76 1000 40" fill="none" stroke="#e4d4a3" strokeOpacity="0.55" strokeWidth="1.2" />
    <path d={RIBBON_BOTTOM_EDGE} fill="none" stroke="url(#rb-gold)" strokeWidth="4.5" />
    <path d="M0 100 Q500 136 1000 100" fill="none" stroke="#e4d4a3" strokeOpacity="0.55" strokeWidth="1.2" />
  </svg>
);

/** The large bow at the middle of the ribbon */
const Bow = () => (
  <svg viewBox="0 0 260 200" className="h-full w-full drop-shadow-[0_20px_24px_rgba(0,0,0,0.6)]" aria-hidden="true">
    <defs>
      <linearGradient id="bw-satin" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stopColor="#f19ab6" />
        <stop offset="0.35" stopColor="#c0386a" />
        <stop offset="1" stopColor="#5e0f28" />
      </linearGradient>
      <linearGradient id="bw-inner" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#5e0f28" />
        <stop offset="1" stopColor="#a8264f" />
      </linearGradient>
    </defs>
    {/* Tails, cut in a V at the ends */}
    <path d="M118 104 L74 190 L92 180 L104 198 L134 112 Z" fill="url(#bw-satin)" stroke="#e4d4a3" strokeWidth="2" />
    <path d="M142 104 L186 190 L168 180 L156 198 L126 112 Z" fill="url(#bw-satin)" stroke="#e4d4a3" strokeWidth="2" />
    {/* Loops, with their inner shadow */}
    <path d="M124 92 C80 22 10 26 14 86 C18 140 84 130 124 104 Z" fill="url(#bw-satin)" stroke="#e4d4a3" strokeWidth="2.5" />
    <path d="M118 94 C88 50 44 50 42 84 C42 110 84 108 118 100 Z" fill="url(#bw-inner)" opacity="0.55" />
    <path d="M136 92 C180 22 250 26 246 86 C242 140 176 130 136 104 Z" fill="url(#bw-satin)" stroke="#e4d4a3" strokeWidth="2.5" />
    <path d="M142 94 C172 50 216 50 218 84 C218 110 176 108 142 100 Z" fill="url(#bw-inner)" opacity="0.55" />
    {/* Highlights along the top of the loops */}
    <path d="M30 60 C50 36 90 40 112 74" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
    <path d="M230 60 C210 36 170 40 148 74" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
    {/* Knot */}
    <rect x="112" y="76" width="36" height="42" rx="12" fill="#8d1d42" stroke="#e4d4a3" strokeWidth="2.5" />
    <path d="M120 84 Q130 96 140 84" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="2" />
  </svg>
);

/** Gold scissors pointing right; they snip gently while waiting, and `closed` snaps the blades shut */
const Scissors = ({ closed, idle }: { closed: boolean; idle: boolean }) => (
  <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible drop-shadow-[0_8px_10px_rgba(0,0,0,0.65)]" aria-hidden="true">
    <defs>
      {/* Polished gold, lit from above */}
      <linearGradient id="sc-metal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff8e2" />
        <stop offset="0.35" stopColor="#e9d18f" />
        <stop offset="0.6" stopColor="#b8923f" />
        <stop offset="1" stopColor="#6e521c" />
      </linearGradient>
      <linearGradient id="sc-blade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#c9a95a" />
        <stop offset="0.5" stopColor="#fff6dc" />
        <stop offset="1" stopColor="#d9c07f" />
      </linearGradient>
    </defs>
    {/* Two halves crossing at the screw; each is one blade and the opposite handle */}
    {[-1, 1].map((dir) => (
      <motion.g
        key={dir}
        style={{ originX: '56px', originY: '50px' }}
        animate={{ rotate: closed ? 0 : idle ? [dir * 15, dir * 5, dir * 15] : dir * 15 }}
        transition={closed ? { type: 'spring', stiffness: 900, damping: 20 } : { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Blade: wide at the screw, tapering to a fine point, with a bright cutting edge */}
        <path
          d={dir < 0 ? 'M54 46 C70 44 86 45 99 49 C86 50 70 51 56 52 Z' : 'M54 54 C70 56 86 55 99 51 C86 50 70 49 56 48 Z'}
          fill="url(#sc-blade)"
          stroke="#7a5c22"
          strokeWidth="0.8"
        />
        <path d={dir < 0 ? 'M58 50.6 C72 50.2 86 49.8 98 49.4' : 'M58 49.4 C72 49.8 86 50.2 98 50.6'} stroke="#ffffff" strokeOpacity="0.8" strokeWidth="0.8" fill="none" />
        {/* Shank from the screw to the finger ring */}
        <path
          d={dir < 0 ? 'M57 52 C48 56 40 62 33 66' : 'M57 48 C48 44 40 38 33 34'}
          stroke="url(#sc-metal)"
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Finger ring */}
        <ellipse cx="22" cy={dir < 0 ? 71 : 29} rx="13" ry="10" transform={`rotate(${dir < 0 ? -20 : 20} 22 ${dir < 0 ? 71 : 29})`} fill="none" stroke="url(#sc-metal)" strokeWidth="6" />
        <ellipse cx="22" cy={dir < 0 ? 71 : 29} rx="13" ry="10" transform={`rotate(${dir < 0 ? -20 : 20} 22 ${dir < 0 ? 71 : 29})`} fill="none" stroke="#fff8e2" strokeOpacity="0.5" strokeWidth="1.2" />
      </motion.g>
    ))}
    {/* The screw */}
    <circle cx="56" cy="50" r="4.2" fill="url(#sc-metal)" stroke="#6e521c" strokeWidth="1" />
    <path d="M53.6 50 H58.4" stroke="#6e521c" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

/** Gold and rose pieces bursting from the cut, then a soft shower from above */
const Celebration = ({ x, y }: { x: number; y: string }) => {
  const burst = useMemo(
    () =>
      Array.from({ length: 110 }, (_, i) => {
        const angle = (spread(i, 11) * 2 - 1) * Math.PI;
        const power = 160 + spread(i, 12) * 460;
        return {
          id: i,
          dx: Math.cos(angle) * power,
          dy: Math.sin(angle) * power - 200,
          fall: 420 + spread(i, 13) * 400,
          spin: (spread(i, 14) * 2 - 1) * 900,
          size: 6 + spread(i, 15) * 9,
          color: ['#E4D4A3', '#fff6dc', '#cdb573', '#e0789c', '#B13160', '#ffffff'][i % 6],
          round: i % 4 === 0,
        };
      }),
    []
  );
  const shower = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        left: spread(i, 21) * 100,
        delay: 0.3 + spread(i, 22) * 1.4,
        duration: 2.2 + spread(i, 23) * 1.6,
        drift: (spread(i, 24) * 2 - 1) * 80,
        size: 5 + spread(i, 25) * 7,
        color: ['#E4D4A3', '#fff6dc', '#cdb573', '#e0789c'][i % 4],
      })),
    []
  );
  return (
    <>
      <div className="pointer-events-none absolute z-40" style={{ left: `${x}%`, top: y }} aria-hidden="true">
        {/* Flash of light where the blades met */}
        <motion.span
          className="absolute -left-24 -top-24 block h-48 w-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,246,220,0.95), rgba(255,246,220,0) 65%)' }}
          initial={{ scale: 0.2, opacity: 1 }}
          animate={{ scale: 2.6, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        {burst.map((p) => (
          <motion.span
            key={p.id}
            className="absolute block"
            style={{ width: p.size, height: p.round ? p.size : p.size * 0.45, background: p.color, borderRadius: p.round ? 999 : 1 }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{ x: p.dx, y: [0, p.dy, p.dy + p.fall], rotate: p.spin, opacity: [1, 1, 0] }}
            transition={{ duration: 2.4, ease: 'easeOut', times: [0, 0.35, 1] }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden" aria-hidden="true">
        {shower.map((p) => (
          <motion.span
            key={p.id}
            className="absolute -top-6 block"
            style={{ left: `${p.left}%`, width: p.size, height: p.size * 0.5, background: p.color, borderRadius: 1 }}
            initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
            animate={{ y: '110vh', x: p.drift, rotate: 540, opacity: [0, 1, 1, 0] }}
            transition={{ duration: p.duration, delay: p.delay, ease: 'linear' }}
          />
        ))}
      </div>
    </>
  );
};

/** One half of the ribbon: stays tied to its post and swings down when cut */
const RibbonHalf = ({ side, cutAt, cut, reduceMotion }: { side: 'left' | 'right'; cutAt: number; cut: boolean; reduceMotion: boolean }) => {
  const left = side === 'left';
  // The ribbon runs from post to post; this half keeps the part on its side of the cut
  const cutInRibbon = ((cutAt - POST_LEFT) / (POST_RIGHT - POST_LEFT)) * 100;
  return (
    <motion.div
      className="absolute inset-y-0"
      style={{
        left: `${POST_LEFT}%`,
        right: `${100 - POST_RIGHT}%`,
        // Cut with a small V notch, like a ribbon end trimmed by scissors
        clipPath: left
          ? `polygon(-5% -50%, ${cutInRibbon}% -50%, ${cutInRibbon}% 22%, ${cutInRibbon - 1.6}% 50%, ${cutInRibbon}% 78%, ${cutInRibbon}% 150%, -5% 150%)`
          : `polygon(105% -50%, ${cutInRibbon}% -50%, ${cutInRibbon}% 22%, ${cutInRibbon + 1.6}% 50%, ${cutInRibbon}% 78%, ${cutInRibbon}% 150%, 105% 150%)`,
        transformOrigin: left ? '0% 50%' : '100% 50%',
        filter: 'drop-shadow(0 14px 14px rgba(0,0,0,0.55))',
      }}
      animate={
        cut
          ? reduceMotion
            ? { opacity: 0 }
            : // Swings down past hanging, back, and settles; the satin narrows a little as it turns edge-on
              { rotate: [0, 96, 79, 89, 83, 86, 85].map((r) => (left ? r : -r)), scaleY: [1, 0.86, 0.94, 0.9, 0.92, 0.91, 0.91] }
          : { rotate: 0, y: [0, -2, 0] }
      }
      transition={cut ? { duration: 2.4, ease: 'easeOut', times: [0, 0.3, 0.5, 0.66, 0.8, 0.9, 1], delay: 0.12 } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <RibbonArt />
      {/* A soft sheen gliding along the satin while it waits */}
      {!cut && !reduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-y-[25%] w-48 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ left: ['-15%', '105%'] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
        />
      )}
    </motion.div>
  );
};

/** Height of the ribbon's middle line on the screen */
const RIBBON_TOP = '60%';

/**
 * The opening ceremony: a satin ribbon with a bow, tied between two gold posts. Clicking (or
 * tapping) the ribbon cuts it there with a pair of gold scissors; the halves swing down from
 * their posts, the bow falls, confetti bursts, and the site opens with its intro, as on a first
 * visit.
 */
export const RibbonCutting = () => {
  const reduceMotion = Boolean(useReducedMotion());
  const [cutAt, setCutAt] = useState<number | null>(null);
  const [snipping, setSnipping] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [fading, setFading] = useState(false);
  const cut = cutAt !== null;

  // The mouse pointer is a pair of gold scissors anywhere on the page
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const scissorsX = useSpring(pointerX, { stiffness: 600, damping: 40 });
  const scissorsY = useSpring(pointerY, { stiffness: 600, damping: 40 });

  const doCut = (percent: number) => {
    if (cut || snipping) return;
    const at = Math.min(POST_RIGHT - 12, Math.max(POST_LEFT + 12, percent));
    setSnipping(true);
    // The blades close first, then the ribbon parts
    window.setTimeout(() => setCutAt(at), reduceMotion ? 0 : 180);
    window.setTimeout(() => setFading(true), (reduceMotion ? 1000 : OPEN_AFTER_MS) - FADE_MS);
    window.setTimeout(() => {
      try {
        sessionStorage.removeItem(INTRO_SEEN_KEY);
      } catch {}
      // A full page load (not the router), so the intro's start-up script runs
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign('/');
    }, reduceMotion ? 1000 : OPEN_AFTER_MS);
  };

  return (
    <main
      className="relative flex min-h-[100svh] w-full select-none flex-col items-center overflow-hidden bg-[#0d0307] px-5 pb-10 pt-12 text-gold md:pt-16 [&_*]:cursor-[inherit]"
      style={{ cursor: hovering ? 'none' : undefined }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return;
        if (!hovering) {
          // First move: put the scissors straight under the pointer instead of sliding in
          pointerX.jump(e.clientX);
          pointerY.jump(e.clientY);
          scissorsX.jump(e.clientX);
          scissorsY.jump(e.clientY);
          setHovering(true);
        }
        pointerX.set(e.clientX);
        pointerY.set(e.clientY);
      }}
      onPointerLeave={() => setHovering(false)}
    >
      {/* A warm glow and a dark edge */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_58%,rgba(177,49,96,0.5),transparent_62%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_160px_60px_rgba(0,0,0,0.85)]" aria-hidden="true" />
      {!reduceMotion && <Sparkles />}
      <Corner className="left-4 top-4 md:left-8 md:top-8" />
      <Corner className="right-4 top-4 rotate-90 md:right-8 md:top-8" />
      <Corner className="bottom-4 left-4 -rotate-90 md:bottom-8 md:left-8" />
      <Corner className="bottom-4 right-4 rotate-180 md:bottom-8 md:right-8" />

      {/* Heading */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/images/brand/logo-gold.webp" alt="Shah Noori" className="h-14 w-auto md:h-20" />
        <p className="mt-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.5em] text-gold/85 md:text-sm">
          <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
          Grand Opening
          <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
        </p>
        <motion.h1
          className="mt-4 bg-clip-text pb-1 text-4xl font-semibold leading-[1.1] text-transparent md:text-7xl"
          style={{ backgroundImage: GOLD_TEXT, backgroundSize: '200% 100%' }}
          animate={reduceMotion ? undefined : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          The New Shah Noori
          <br />
          Website
        </motion.h1>
        <p className="mt-4 text-lg text-gold/85 md:text-2xl" dir="rtl" lang="ar" style={ARABIC}>
          الافتتاح الرسمي لموقع Shah Noori الجديد
        </p>
      </motion.div>

      <Post side="left" top={RIBBON_TOP} />
      <Post side="right" top={RIBBON_TOP} />
      <Tie side="left" top={RIBBON_TOP} />
      <Tie side="right" top={RIBBON_TOP} />

      {/* The ribbon between its posts; anywhere on it can be cut */}
      <div
        className="absolute inset-x-0 z-30 h-24 -translate-y-1/2 md:h-32"
        style={{ top: RIBBON_TOP, cursor: cut || hovering ? undefined : 'pointer' }}
        onClick={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          // The scissors snap to the exact spot (on touch screens they appear there)
          pointerX.jump(e.clientX);
          pointerY.jump(e.clientY);
          scissorsX.jump(e.clientX);
          scissorsY.jump(e.clientY);
          doCut(((e.clientX - box.left) / box.width) * 100);
        }}
      >
        <RibbonHalf side="left" cutAt={cutAt ?? 50} cut={cut} reduceMotion={reduceMotion} />
        <RibbonHalf side="right" cutAt={cutAt ?? 50} cut={cut} reduceMotion={reduceMotion} />

        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-52 -translate-x-1/2 -translate-y-1/2 md:h-56 md:w-72"
          animate={cut ? (reduceMotion ? { opacity: 0 } : { y: '80vh', rotate: 40, opacity: [1, 1, 0] }) : { y: [0, -5, 0], rotate: [0, -1.5, 0] }}
          transition={cut ? { duration: 1.6, ease: [0.55, 0, 0.75, 0.25], delay: 0.2 } : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Bow />
        </motion.div>

      </div>

      {cut && !reduceMotion && <Celebration x={cutAt!} y={RIBBON_TOP} />}

      {/* The scissors pointer: the tips of the blades are the point that cuts */}
      {(hovering || snipping) && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[45] -ml-[79px] -mt-10 h-20 w-20 md:-ml-[111px] md:-mt-14 md:h-28 md:w-28"
          style={{ x: scissorsX, y: scissorsY }}
          animate={cut ? { opacity: 0, scale: 1.2 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: cut ? 0.5 : 0 }}
        >
          <Scissors closed={snipping} idle={!reduceMotion} />
        </motion.div>
      )}

      {/* Bottom: the invitation, then the welcome */}
      <div className="relative z-30 mt-auto flex flex-col items-center gap-4 text-center">
        <AnimatePresence mode="wait">
          {!cut ? (
            <motion.div key="ask" className="flex flex-col items-center gap-4" exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
              <motion.p
                className="text-sm text-gold/85 md:text-lg"
                animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              >
                Cut the ribbon to open the website
              </motion.p>
              <button
                type="button"
                onClick={() => doCut(50)}
                className="group relative overflow-hidden rounded-full border border-gold/60 bg-black/30 px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold backdrop-blur-sm transition-colors duration-300 hover:text-[#57132D] md:text-sm"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-r from-[#d9c07f] via-[#fff6dc] to-[#d9c07f] transition-transform duration-500 group-hover:scale-y-100" />
                <span className="relative">✂&nbsp; Cut the ribbon</span>
              </button>
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ opacity: 0, scale: 0.85, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <p className="bg-clip-text text-3xl font-semibold text-transparent md:text-5xl" style={{ backgroundImage: GOLD_TEXT }}>
                Welcome! The website is open.
              </p>
              <p className="mt-2 text-lg text-gold/85 md:text-2xl" dir="rtl" lang="ar" style={ARABIC}>
                أهلًا وسهلًا، تم افتتاح الموقع
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold/45 md:text-xs">sncreatives.com</p>
      </div>

      {/* Fade to the intro's black (bg-ink), which the home page opens on */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-50 bg-[#0A0A0A]"
        initial={false}
        animate={{ opacity: fading ? 1 : 0 }}
        transition={{ duration: FADE_MS / 1000 - 0.1, ease: 'easeInOut' }}
        aria-hidden="true"
      />
    </main>
  );
};
