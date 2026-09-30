"use client";

import React, { useEffect, useRef } from 'react';

/**
 * Mouse-only "drafting table" interaction layer, driven by what's under the pointer so no
 * section needs extra markup:
 * - a CAD-style crosshair with a live X · Y coordinate readout
 * - viewfinder corner brackets that trail the crosshair and snap around anything clickable,
 *   with a tag ("View project", "Chat", "Call"…) on the corner
 * - a gold blueprint grid revealed around the pointer in dark sections
 * - pill buttons lean magnetically toward the pointer; project cards tilt in 3D
 * Gold on dark sections, maroon on light ones. Touch devices and reduced-motion users get
 * none of this and keep the native cursor.
 * Override the tag with data-cursor="Label", or data-cursor="none" to skip an element.
 */

const INTERACTIVE = 'a, button, label, summary, select, [role="button"], [data-cursor]';
const TEXT_ENTRY = 'input:not([type="radio"]):not([type="checkbox"]):not([type="submit"]):not([type="button"]), textarea, [contenteditable="true"], iframe';
const MAGNETIC = 'a.rounded-full, button.rounded-full';
const TILT = 'a[href^="/projects/"]';
const IDLE_SIZE = 34;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** The corner tag for an element, or '' for none. */
const labelFor = (el: Element): string => {
  const explicit = el.getAttribute('data-cursor');
  if (explicit) return explicit === 'none' ? '' : explicit;
  const href = el.getAttribute('href') ?? '';
  if (href.includes('wa.me')) return 'Chat';
  if (href.startsWith('tel:')) return 'Call';
  if (href.startsWith('mailto:')) return 'Email';
  if (href.includes('maps')) return 'Directions';
  if (el.querySelector('img')) return href.startsWith('/projects/') ? 'View project' : 'Open';
  return '';
};

/**
 * Reads a computed background colour: null if it's (mostly) see-through, otherwise whether
 * it's dark. Tailwind v4 opacity colours (bg-ink/80) compute as oklab()/oklch().
 */
const readBackground = (color: string): boolean | null => {
  const nums = color.match(/-?[\d.]+%?/g)?.map((n) => (n.endsWith('%') ? parseFloat(n) / 100 : parseFloat(n)));
  if (!nums || nums.length < 3) return null;
  const alpha = nums[3] ?? 1;
  if (alpha <= 0.5) return null;
  if (color.startsWith('ok')) return nums[0] < 0.5; // lightness 0–1
  if (color.startsWith('lab') || color.startsWith('lch')) return nums[0] < 50; // lightness 0–100
  if (color.startsWith('color(')) return 0.2126 * nums[0] + 0.7152 * nums[1] + 0.0722 * nums[2] < 0.35; // channels 0–1
  return 0.2126 * nums[0] + 0.7152 * nums[1] + 0.0722 * nums[2] < 90;
};

/**
 * Tone of what an element itself paints: its background colour, or the first colour of a
 * background gradient (bg-brand-gradient sections, the menu overlay). Gradient *text*
 * (background-clip: text) paints no backdrop and is skipped. null = see-through.
 */
const paintedTone = (style: CSSStyleDeclaration): boolean | null => {
  const color = readBackground(style.backgroundColor);
  if (color !== null) return color;
  if (style.backgroundImage.includes('gradient') && !style.backgroundClip.includes('text')) {
    const first = style.backgroundImage.match(/(?:rgba?|oklab|oklch|lab|lch|color)\([^)]*\)/);
    if (first) return readBackground(first[0]);
  }
  return null;
};

/**
 * Whether the nearest painted background under the pointer is dark. A see-through fixed
 * layer (the header over the hero) is looked through to whatever is behind it at (x, y).
 * Not cached: backgrounds change with state (selected chips, the header after scrolling);
 * callers only re-check when the element under the pointer changes.
 */
const isOnDark = (el: Element | null, x: number, y: number): boolean => {
  let node: Element | null = el;
  while (node) {
    const style = getComputedStyle(node);
    const tone = paintedTone(style);
    if (tone !== null) return tone;
    if (style.position === 'fixed') {
      const layer = node;
      const behind = document.elementsFromPoint(x, y).find((e) => !layer.contains(e) && !e.contains(layer));
      return behind ? isOnDark(behind, x, y) : false;
    }
    node = node.parentElement;
  }
  return false;
};

const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, '0');

export const CursorEffects = () => {
  const layerRef = useRef<HTMLDivElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduce.matches) return;

    const layer = layerRef.current!;
    const cross = crossRef.current!;
    const coords = coordsRef.current!;
    const frame = frameRef.current!;
    const tag = tagRef.current!;
    const grid = gridRef.current!;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    const mouse = { x: -100, y: -100 };
    const box = { x: -100, y: -100, w: IDLE_SIZE, h: IDLE_SIZE };
    const gridPos = { x: -100, y: -100 };
    let visible = false;
    let pressed = false;
    let snapTo: Element | null = null;
    let magnet: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;
    let lastCoords = '';
    let lastTarget: Element | null = null;
    let rafId = 0;
    let running = false;

    const release = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = '';
      window.setTimeout(() => {
        if (el !== magnet && el !== tilt) el.style.transition = '';
      }, 600);
    };

    // Only take over elements whose transform nobody else (e.g. framer-motion) is driving
    const canDrive = (el: HTMLElement) => !el.style.transform || el === magnet || el === tilt;

    // Everything here depends only on the element under the pointer, so it's skipped while the
    // pointer moves within the same element. `force` re-reads after a scroll or click, which
    // can change backgrounds (the header, a selected chip) without changing the element.
    const update = (target: Element | null, force = false) => {
      if (!target || (target === lastTarget && !force)) return;
      lastTarget = target;
      const textEntry = target.closest(TEXT_ENTRY);
      let interactive = textEntry ? null : target.closest(INTERACTIVE);
      if (interactive?.getAttribute('data-cursor') === 'none') interactive = null;
      const text = interactive ? labelFor(interactive) : '';

      layer.dataset.mode = textEntry ? 'text' : interactive ? 'snap' : 'idle';
      layer.dataset.tone = isOnDark(target, mouse.x, mouse.y) ? 'dark' : 'light';
      snapTo = interactive;
      if (tag.textContent !== text) tag.textContent = text;

      const nextMagnet = target.closest(MAGNETIC) as HTMLElement | null;
      if (nextMagnet !== magnet) {
        release(magnet);
        magnet = nextMagnet && canDrive(nextMagnet) ? nextMagnet : null;
        if (magnet) magnet.style.transition = 'transform 0.2s ease-out';
      }

      const card = target.closest(TILT) as HTMLElement | null;
      const nextTilt = card && card.querySelector('img') && !card.closest(MAGNETIC) ? card : null;
      if (nextTilt !== tilt) {
        release(tilt);
        tilt = nextTilt && canDrive(nextTilt) ? nextTilt : null;
        if (tilt) tilt.style.transition = 'transform 0.15s ease-out';
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        visible = true;
        box.x = gridPos.x = mouse.x;
        box.y = gridPos.y = mouse.y;
        root.classList.add('cursor-visible');
      }
      update(e.target as Element);
      wake();

      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        magnet.style.transform = `translate(${dx * 0.25}px, ${dy * 0.3}px)`;
      }
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.transform = `perspective(1000px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg)`;
      }
    };

    // Scrolling moves content under a still pointer, so re-read what's there
    const onScroll = () => {
      if (!visible) return;
      update(document.elementFromPoint(mouse.x, mouse.y), true);
      wake();
    };
    const onDown = () => {
      pressed = true;
      wake();
    };
    const onUp = () => {
      pressed = false;
      // Let the click's state change (e.g. a chip turning maroon) render before re-reading
      requestAnimationFrame(() => update(document.elementFromPoint(mouse.x, mouse.y), true));
      wake();
    };
    const onLeave = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      visible = false;
      lastTarget = null;
      root.classList.remove('cursor-visible');
      release(magnet);
      release(tilt);
      magnet = tilt = null;
      snapTo = null;
    };

    // The frame loop only runs while something is moving; it stops once the viewfinder has
    // settled and restarts on the next pointer move, scroll or click.
    const wake = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    };

    const loop = () => {
      // Target box: the hovered element's outline, or a small viewfinder around the pointer
      let tx: number, ty: number, tw: number, th: number;
      if (snapTo && snapTo.isConnected) {
        const r = snapTo.getBoundingClientRect();
        const p = r.width > 200 ? 10 : 6;
        tx = r.left + r.width / 2;
        ty = r.top + r.height / 2;
        tw = r.width + p * 2;
        th = r.height + p * 2;
      } else {
        tx = mouse.x;
        ty = mouse.y;
        tw = th = IDLE_SIZE;
      }
      if (pressed) {
        tw *= 0.9;
        th *= 0.9;
      }
      const ease = snapTo ? 0.22 : 0.16;
      box.x = lerp(box.x, tx, ease);
      box.y = lerp(box.y, ty, ease);
      box.w = lerp(box.w, tw, ease);
      box.h = lerp(box.h, th, ease);
      gridPos.x = lerp(gridPos.x, mouse.x, 0.12);
      gridPos.y = lerp(gridPos.y, mouse.y, 0.12);

      cross.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      frame.style.transform = `translate3d(${box.x - box.w / 2}px, ${box.y - box.h / 2}px, 0)`;
      frame.style.width = `${box.w}px`;
      frame.style.height = `${box.h}px`;
      grid.style.setProperty('--gx', `${gridPos.x}px`);
      grid.style.setProperty('--gy', `${gridPos.y}px`);

      const text = `X ${pad(mouse.x)} · Y ${pad(mouse.y + window.scrollY)}`;
      if (text !== lastCoords) {
        coords.textContent = text;
        lastCoords = text;
      }

      const settled =
        Math.abs(box.x - tx) < 0.1 &&
        Math.abs(box.y - ty) < 0.1 &&
        Math.abs(box.w - tw) < 0.1 &&
        Math.abs(box.h - th) < 0.1 &&
        Math.abs(gridPos.x - mouse.x) < 0.1 &&
        Math.abs(gridPos.y - mouse.y) < 0.1;
      if (settled) {
        running = false;
        return;
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('mouseout', onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseout', onLeave);
      release(magnet);
      release(tilt);
      root.classList.remove('has-custom-cursor', 'cursor-visible');
    };
  }, []);

  return (
    <div ref={layerRef} aria-hidden="true" className="cursor-layer" data-mode="idle" data-tone="light">
      <div ref={gridRef} className="cursor-grid" />
      <div ref={frameRef} className="cursor-frame">
        <i className="tl" />
        <i className="tr" />
        <i className="bl" />
        <i className="br" />
        <span ref={tagRef} className="cursor-tag" />
      </div>
      <div ref={crossRef} className="cursor-cross">
        <i className="n" />
        <i className="s" />
        <i className="e" />
        <i className="w" />
        <b className="diamond" />
        <span ref={coordsRef} className="cursor-coords" />
      </div>
    </div>
  );
};
