"use client";

import React, { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

/**
 * Counts the number inside a stat string up from zero when it scrolls into view, keeping any
 * text around it: "100+", "98%", "5.0/5", "20 Mins", "03" (leading zeros kept).
 * Years (e.g. "2010") count up from 25 years earlier rather than from zero.
 */
export const CountUp = ({ value, duration = 1.8, className = '' }: { value: string; duration?: number; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduceMotion = useReducedMotion();

  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const prefix = match?.[1] ?? '';
  const digits = match?.[2] ?? '';
  const suffix = match?.[3] ?? '';
  const target = Number(digits);
  const decimals = digits.includes('.') ? digits.split('.')[1].length : 0;
  const pad = !decimals && digits.startsWith('0') ? digits.length : 0;
  const isYear = !decimals && target >= 1900 && target <= 2100;
  const from = isYear ? target - 25 : 0;

  const format = (v: number) => {
    const text = v.toFixed(decimals);
    return pad ? text.padStart(pad, '0') : text;
  };

  useEffect(() => {
    const el = numberRef.current;
    if (!match || !el) return;
    if (reduceMotion) {
      el.textContent = digits;
      return;
    }
    if (!inView) return;
    const controls = animate(from, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
    // format/match derive from `value`, which is covered by digits/target
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion, digits, target, from, duration]);

  if (!match) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      <span className="sr-only">{value}</span>
      {/* Invisible final value reserves the width, so the layout doesn't shift while counting */}
      <span aria-hidden="true" className="invisible">{value}</span>
      <span aria-hidden="true" className="absolute inset-0 whitespace-nowrap">
        {prefix}
        <span ref={numberRef}>{format(from)}</span>
        {suffix}
      </span>
    </span>
  );
};
