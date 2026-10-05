"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Container } from './Container';
import Link from 'next/link';
import { ArrowUpRight } from './ui';
import { startPageFlood } from './PageFlood';

/**
 * The closing banner's copy over a scene set into its backdrop: a hand holding a contract comes
 * in from the left and a hand with a pen from the right, stopping short of each other.
 * Hovering (or focusing) "Start a Project" brings them together and the pen signs the page.
 * Touch screens can't hover, so there the signing plays by itself once the scene is in view.
 *
 * The points below are measured on the two photos (see PHOTO); `layout` turns them into screen positions, so if a photo is replaced only
 * its size and these numbers need re-measuring.
 */

/**
 * The two photos: file name (under public/images, without extension) and pixel size, which
 * is also the coordinate space every point below is measured in.
 * Give a replacement photo a NEW file name: the image optimiser and browsers cache by URL,
 * so reusing a name keeps serving the old picture inside the new one's box.
 */
const PHOTO = { paper: { file: 'hand-paper-v5', w: 1279, h: 672 }, pen: { file: 'hand-pen-v3', w: 1584, h: 672 } };
/** Signature line on the paper photo: where the pen starts and where it finishes */
const SIGN_START = { x: 914, y: 407 };
const SIGN_END = { x: 1046, y: 366 };
/** How far down the paper photo the signature line is (0 = top, 1 = bottom): the scene's centre point */
const MEET_Y = (SIGN_START.y + SIGN_END.y) / 2 / PHOTO.paper.h;
/** Tip of the nib on the pen photo */
const PEN_TIP = { x: 156, y: 607 };
/**
 * Screen size of one paper-photo pixel relative to one pen-photo pixel, chosen so the two
 * hands come out the same size (the hand is 218px tall in the paper photo, 372px in the pen's)
 */
const PAPER_SCALE = 372 / 218;
/** How long the stretched sleeve strips are: far past any screen edge */
const SLEEVE_PX = 3000;

const EASE = [0.16, 1, 0.3, 1] as const;
const MEET_S = 0.65;
const WRITE_S = 1.1;

/** Sizes and offsets in px for the current screen width. */
const layout = (vw: number) => {
  // Big enough to fill the banner as a backdrop: on desktop the paper photo stands about 90% of the
  // banner's height (the wash over it hides the photos' modest resolution)
  const penW = Math.min(Math.max(vw * 0.75, 340), 950);
  const pen = penW / PHOTO.pen.w; // screen px per photo px
  const paper = pen * PAPER_SCALE;
  const paperW = PHOTO.paper.w * paper;
  // When signing, the middle of the signature line sits on the screen's centre line
  const paperX = -((SIGN_START.x + SIGN_END.x) / 2) * paper;
  return {
    penW,
    penH: PHOTO.pen.h * pen,
    paperW,
    paperH: PHOTO.paper.h * paper,
    // Resting gap: each hand stands this far back from where it signs
    apart: Math.max(vw * 0.22, 80),
    // Fully off its side of the screen
    away: vw * 0.5 + paperW,
    paperX,
    // Puts the nib on the start of the signature line
    penX: paperX + SIGN_START.x * paper - PEN_TIP.x * pen,
    penY: SIGN_START.y * paper - PEN_TIP.y * pen,
    writeX: (SIGN_END.x - SIGN_START.x) * paper,
    writeY: (SIGN_END.y - SIGN_START.y) * paper,
  };
};

/** A photo plus its sleeve continued off-screen, so the arm never shows an end. */
const Arm = ({ photo, side }: { photo: 'paper' | 'pen'; side: 'left' | 'right' }) => (
  <>
    {/* The few columns of sleeve at the photo's edge, stretched sideways (overlapping it by 1px to hide the join) */}
    <Image
      src={`/images/${PHOTO[photo].file}-sleeve.png`}
      alt=""
      width={4}
      height={PHOTO[photo].h}
      unoptimized
      className="absolute top-0 max-w-none"
      style={{ width: SLEEVE_PX, height: '100%', [side === 'left' ? 'right' : 'left']: 'calc(100% - 1px)' }}
    />
    <Image
      src={`/images/${PHOTO[photo].file}.webp`}
      alt=""
      width={PHOTO[photo].w}
      height={PHOTO[photo].h}
      sizes="(min-width: 1024px) 1300px, 100vw"
      className="relative block max-w-none select-none"
      style={{ width: '100%', height: '100%' }}
      draggable={false}
    />
  </>
);

export const CtaSigning = ({ heading, text, buttonLabel }: { heading: string; text: string; buttonLabel: string }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const inView = useInView(sceneRef, { amount: 0.3 });
  const [hovered, setHovered] = useState(false);
  const [vw, setVw] = useState(0);
  const [autoSign, setAutoSign] = useState(false);

  useEffect(() => {
    const measure = () => setVw(document.documentElement.clientWidth);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // No hover on touch screens: sign once the hands have arrived, and reset when the scene leaves
  useEffect(() => {
    if (!inView || !window.matchMedia('(hover: none)').matches) return;
    const timer = setTimeout(() => setAutoSign(true), 1400);
    return () => {
      clearTimeout(timer);
      setAutoSign(false);
    };
  }, [inView]);

  const signing = inView && (hovered || autoSign);
  const l = layout(vw);
  const offset = !inView ? l.away : signing ? 0 : l.apart;
  const move = reduceMotion ? { duration: 0 } : { duration: signing ? MEET_S : 0.8, ease: EASE };
  const sceneH = l.paperH || 160;

  // Click: the Contact page's colour floods the screen from the button, Contact loads under
  // it, and the colour fades off once that page is ready (see PageFlood, in the site layout)
  const startFlood = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Leave new-tab clicks alone, and skip the show for visitors who asked for less motion
    if (reduceMotion || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const box = e.currentTarget.getBoundingClientRect();
    startPageFlood({ x: box.left + box.width / 2, y: box.top + box.height / 2, r: box.width / 2, href: '/contact' });
  };

  return (
    <>
      {/* The scene: centred on the banner, between the photo and its dark wash so it reads as part of the backdrop */}
      <div
        ref={sceneRef}
        className="pointer-events-none absolute inset-x-0"
        // Hung so the signature line, where the two hands meet, is exactly on the banner's centre line
        style={{ height: sceneH, top: '50%', marginTop: -sceneH * MEET_Y }}
        aria-hidden="true"
      >
        {vw > 0 && (
          <>
            <motion.div
              className="absolute left-1/2 top-0"
              style={{ width: l.paperW, height: l.paperH }}
              initial={{ x: l.paperX - l.away }}
              animate={{ x: l.paperX - offset }}
              transition={move}
            >
              <Arm photo="paper" side="left" />
              {/* The signature, written as the pen travels (drawn in the photo's own coordinates) */}
              <svg viewBox={`0 0 ${PHOTO.paper.w} ${PHOTO.paper.h}`} className="absolute inset-0 h-full w-full">
                <motion.path
                  d="M916 404 c5 -16 15 -18 16 -5 c2 11 11 -20 18 -9 c5 9 13 -15 20 -5 c5 7 15 -11 24 -5 c11 7 24 0 50 -16"
                  fill="none"
                  stroke="#1b1f4a"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={false}
                  animate={{ pathLength: signing ? 1 : 0, opacity: signing ? 1 : 0 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : signing
                        ? { pathLength: { duration: WRITE_S, ease: 'linear', delay: MEET_S }, opacity: { duration: 0.01, delay: MEET_S } }
                        : { duration: 0.2 }
                  }
                />
              </svg>
            </motion.div>

            <motion.div
              className="absolute left-1/2 top-0"
              style={{ width: l.penW, height: l.penH }}
              initial={{ x: l.penX + l.away, y: l.penY }}
              animate={{ x: l.penX + offset, y: l.penY }}
              transition={move}
            >
              {/* The writing stroke: across the line with a small up-and-down scribble */}
              <motion.div
                className="relative h-full w-full"
                initial={false}
                animate={
                  signing
                    ? { x: l.writeX, y: [0, -l.penH * 0.05, l.penH * 0.015, -l.penH * 0.05, 0, -l.penH * 0.04, l.writeY] }
                    : { x: 0, y: 0 }
                }
                transition={reduceMotion ? { duration: 0 } : signing ? { duration: WRITE_S, ease: 'linear', delay: MEET_S } : { duration: 0.25 }}
              >
                <Arm photo="pen" side="right" />
              </motion.div>
            </motion.div>
          </>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" aria-hidden="true" />

    <Container className="relative flex min-h-[520px] md:min-h-[672px] flex-col items-center justify-center gap-6 py-24 text-center">
      <h2 className="whitespace-pre-line text-5xl sm:text-6xl md:text-8xl font-medium leading-[0.95] text-gold">{heading}</h2>
      <p className="text-lg text-gold/90">{text}</p>
      <span
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        {/* A solid round button here (text links elsewhere): this is the page's closing call to action */}
        <Link
          href="/contact"
          onClick={startFlood}
          // No viewfinder brackets from the cursor layer: square corners around a round button read as a frame
          data-cursor="none"
          className="group relative flex h-32 w-32 flex-col items-center justify-center gap-2 overflow-hidden rounded-full bg-gold p-5 text-center text-base font-semibold leading-tight text-maroon shadow-xl transition-all duration-300 hover:scale-110 hover:text-gold hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/50 md:h-36 md:w-36 md:text-lg"
        >
          {/* The Contact page's gradient, growing from the centre as a circle on hover: a small
              preview of the flood that a click sets off. It overshoots the button by 4px (clipped)
              so none of the gold underneath is left showing as a rim. */}
          <span
            className="bg-brand-gradient absolute -inset-1 scale-0 rounded-full transition-transform duration-500 ease-out group-hover:scale-100 group-focus-visible:scale-100"
            aria-hidden="true"
          />
          <span className="relative">{buttonLabel}</span>
          <ArrowUpRight className="relative h-6 w-6 transition-transform duration-300 group-hover:rotate-45" />
        </Link>
      </span>
    </Container>
    </>
  );
};
