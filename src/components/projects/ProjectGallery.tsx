"use client";

import { useT } from '../shared/LocaleProvider';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

interface GalleryImage {
  key: string;
  url: string;
}

/** Bento-style grid pattern that repeats every 5 photos on large screens. */
const tileClass = (i: number) => (i % 5 === 0 ? 'md:col-span-2 md:row-span-2' : i % 5 === 3 ? 'md:row-span-2' : '');

const ArrowIcon = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
    {dir === 'left' ? <path d="M15 18 9 12l6-6" /> : <path d="m9 18 6-6-6-6" />}
  </svg>
);

export const ProjectGallery = ({ images, title }: { images: GalleryImage[]; title: string }) => {
  const t = useT();
  const [open, setOpen] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  // The viewer is added to the page (at the end of <body>) the first time a photo is opened
  const [viewerUsed, setViewerUsed] = useState(false);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = images.length;

  const go = useCallback(
    (offset: number) => {
      setDirection(offset);
      setOpen((i) => (i === null ? i : (i + offset + count) % count));
    },
    [count]
  );

  const close = useCallback(() => {
    if (open === null) return;
    const last = open;
    setOpen(null);
    // Return focus to the thumbnail of the photo being viewed
    requestAnimationFrame(() => triggerRefs.current[last]?.focus());
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [open, close, go]);

  // Keep the current photo's thumbnail on screen as the viewer moves through a long set
  useEffect(() => {
    if (open !== null) thumbRefs.current[open]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [open]);

  return (
    <>
      <ul className="grid grid-flow-dense auto-rows-[220px] gap-4 sm:grid-cols-2 md:auto-rows-[240px] md:grid-cols-4">
        {images.map((img, i) => (
          <motion.li
            key={img.key}
            className={tileClass(i)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.05 }}
          >
            <button
              type="button"
              ref={(el) => { triggerRefs.current[i] = el; }}
              onClick={() => { setDirection(0); setViewerUsed(true); setOpen(i); }}
              className="group relative block h-full w-full overflow-hidden rounded-[20px] bg-maroon/10"
              aria-label={`${t('gallery.open')} ${i + 1} ${t('gallery.of')} ${count}`}
            >
              <Image
                src={img.url}
                alt={`${title}, photo ${i + 1}`}
                fill
                sizes={i % 5 === 0 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, (min-width: 640px) 50vw, 100vw'}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-maroon/0 transition-colors duration-300 group-hover:bg-maroon/35" aria-hidden="true">
                <span className="flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-gold text-maroon opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                </span>
              </span>
            </button>
          </motion.li>
        ))}
      </ul>

      {/* Outside the page's sections, so it always covers the header and every section */}
      {viewerUsed && createPortal(
      <AnimatePresence>
        {open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title}: ${t('gallery.viewer')}`}
            data-lenis-prevent
            className="fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between px-5 py-4 text-white md:px-8">
              <p className="text-sm text-white/70">
                <span className="text-gold">{String(open + 1).padStart(2, '0')}</span> / {String(count).padStart(2, '0')}
                <span className="ms-3 hidden sm:inline">{title}</span>
              </p>
              <button
                type="button"
                ref={closeRef}
                onClick={close}
                aria-label={t('gallery.close')}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </div>

            <div className="relative flex-1 overflow-hidden" onClick={(e) => e.target === e.currentTarget && close()}>
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={open}
                  custom={direction}
                  className="absolute inset-4 md:inset-x-24 md:inset-y-6"
                  initial={{ opacity: 0, x: direction * 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -80 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  drag={count > 1 ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) go(1);
                    else if (info.offset.x > 80) go(-1);
                  }}
                >
                  <Image src={images[open].url} alt={`${title}, photo ${open + 1}`} fill sizes="100vw" className="pointer-events-none select-none object-contain" />
                </motion.div>
              </AnimatePresence>

              {count > 1 && (
                <>
                  <button type="button" onClick={() => go(-1)} aria-label={t('gallery.previous')} className="absolute left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-gold hover:text-maroon md:flex">
                    <ArrowIcon dir="left" />
                  </button>
                  <button type="button" onClick={() => go(1)} aria-label={t('gallery.next')} className="absolute right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-gold hover:text-maroon md:flex">
                    <ArrowIcon dir="right" />
                  </button>
                </>
              )}
            </div>

            {count > 1 && (
              // The strip scrolls sideways; the inner row is centred only while it fits, because
              // centring an overflowing row would push its first thumbnails out of reach
              <div className="overflow-x-auto px-5 py-4 [scrollbar-width:none]">
                <div className="mx-auto flex w-max gap-2">
                {images.map((img, i) => (
                  <button
                    key={img.key}
                    ref={(el) => { thumbRefs.current[i] = el; }}
                    type="button"
                    onClick={() => { setDirection(i > open ? 1 : -1); setOpen(i); }}
                    aria-label={`${t('gallery.show')} ${i + 1}`}
                    aria-current={i === open ? 'true' : undefined}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-all ${i === open ? 'ring-2 ring-gold' : 'opacity-50 hover:opacity-90'}`}
                  >
                    <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </>
  );
};
