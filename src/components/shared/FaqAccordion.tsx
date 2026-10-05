"use client";

import React, { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Accordion whose answers glide open and closed. Only one is open at a time: opening a
 * question closes the previous one. The first one starts open.
 */
export const FaqAccordion = ({ faqs }: { faqs: { q: string; a: string }[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const id = useId();

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <div className="border-b border-ink/70">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="border-t border-ink/70">
            <h3>
              <button
                type="button"
                id={`${id}-q${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-a${i}`}
                onClick={() => toggle(i)}
                className="flex w-full cursor-pointer items-center justify-between gap-6 py-8 text-left text-lg text-ink/80 transition-colors hover:text-ink"
              >
                {faq.q}
                <span className="relative h-4 w-4 shrink-0" aria-hidden="true">
                  <span className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'rotate-45' : ''}`} />
                  <span className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'rotate-45' : ''}`} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${id}-a${i}`}
                  role="region"
                  aria-labelledby={`${id}-q${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1, transition: { height: { duration: 0.5, ease }, opacity: { duration: 0.35, delay: 0.1 } } }}
                  exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.4, ease }, opacity: { duration: 0.2 } } }}
                  className="overflow-hidden"
                >
                  <motion.p
                    initial={{ y: -8 }}
                    animate={{ y: 0, transition: { duration: 0.5, ease } }}
                    exit={{ y: -8, transition: { duration: 0.3 } }}
                    className="-mt-2 pb-8 pr-10 text-lg text-ink/75"
                  >
                    {faq.a}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
