"use client";

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { whatsAppHref } from '@/components/shared/WhatsAppButton';

const projectTypes = [
  'Civil Construction',
  'Interior & Fit-Out',
  'Commercial Spaces',
  'Retail Fit-Out',
  'Hospitality Spaces',
  'MEP Works',
  'Turnkey Contracting',
];

const inputClass =
  'w-full rounded-2xl bg-cream px-4 py-3.5 text-ink placeholder:text-ink/50 focus:outline-none focus:ring-2 focus:ring-maroon/60 transition-shadow';
const labelClass = 'text-sm font-semibold text-ink';
const ease = [0.16, 1, 0.3, 1] as const;

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Posts the enquiry to /api/contact, which emails it to the business inbox and sends the
 * visitor a confirmation. If sending fails, the visitor can pass the same details on WhatsApp.
 */
export const ContactForm = ({ phoneNumber, email }: { phoneNumber: string; email: string }) => {
  const [projectType, setProjectType] = useState('Interior & Fit-Out');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [whatsAppMessage, setWhatsAppMessage] = useState('');
  // When the form was shown; submissions faster than a person could type are treated as bots
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    const data = new FormData(e.currentTarget);
    const field = (name: string) => String(data.get(name) ?? '').trim();

    setWhatsAppMessage(
      [
        'Hello Shah Noori, I would like to request a project consultation.',
        '',
        `Name: ${field('name')}`,
        `Phone: +974 ${field('phone')}`,
        `Email: ${field('email')}`,
        `Project type: ${projectType}`,
        field('details') ? `\n${field('details')}` : null,
      ]
        .filter((line) => line !== null)
        .join('\n')
    );

    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: field('name'),
          phone: field('phone'),
          email: field('email'),
          projectType,
          details: field('details'),
          sn_trap: field('sn_trap'),
          // Elapsed time measured on this device, so a wrong clock can't make a person look like a bot
          elapsedMs: Date.now() - startedAt.current,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || 'We could not send your enquiry.');
      setSentTo(field('email'));
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not send your enquiry.');
      setStatus('error');
    }
  };

  const reset = () => {
    startedAt.current = Date.now();
    setStatus('idle');
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === 'sent' ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease } }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
          className="flex flex-col items-center gap-5 rounded-[24px] bg-cream px-6 py-14 text-center"
          role="status"
        >
          <motion.span
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0, transition: { delay: 0.2, type: 'spring', stiffness: 260, damping: 18 } }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-maroon text-gold"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-8 w-8">
              <motion.path
                d="M5 12.5l4.5 4.5L19 7.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1, transition: { delay: 0.45, duration: 0.5, ease } }}
              />
            </svg>
          </motion.span>
          <h3 className="text-2xl md:text-3xl font-semibold text-maroon">Thank you — your enquiry is in.</h3>
          <p className="max-w-md text-ink/75">
            Our team will get back to you shortly. A confirmation has been sent to{' '}
            <span className="font-semibold text-ink">{sentTo}</span>.
          </p>
          <button type="button" onClick={reset} className="mt-2 font-semibold text-maroon underline underline-offset-4 hover:opacity-75">
            Send another enquiry
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          className="relative flex flex-col gap-6"
          // Used only if someone submits before the page's JavaScript loads: a POST keeps their
          // details out of the URL, and the endpoint answers with a plain confirmation page
          method="post"
          action="/api/contact"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease } }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
        >
          {/* Spam trap: invisible to people, filled in by bots. A meaningless name so browser
              autofill and password managers don't fill it for real visitors. */}
          <div className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="sn_trap">Leave this field empty</label>
            <input id="sn_trap" name="sn_trap" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className={labelClass}>Name <span className="text-rose">*</span></label>
              <input id="name" name="name" type="text" required maxLength={100} autoComplete="name" placeholder="Sheikh Fahad Al-Thani / Eng. Karim" className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className={labelClass}>Phone <span className="text-rose">*</span></label>
              <div className="flex gap-1.5">
                <span className="flex items-center rounded-2xl bg-[#EFE3D2] px-4 text-ink" aria-hidden="true">+974</span>
                <input id="phone" name="phone" type="tel" required maxLength={20} pattern="[0-9 ]{7,15}" title="Qatar number, digits only" autoComplete="tel-national" placeholder="3300 0000" className={inputClass} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className={labelClass}>Email <span className="text-rose">*</span></label>
            <input id="email" name="email" type="email" required maxLength={150} autoComplete="email" placeholder="procurement@organization.qa" className={inputClass} />
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className={`${labelClass} mb-3`}>Project Type <span className="text-rose">*</span></legend>
            <div className="flex flex-wrap gap-2.5">
              {projectTypes.map((type) => (
                <label
                  key={type}
                  className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-maroon ${
                    projectType === type ? 'bg-maroon text-white' : 'bg-cream text-ink/80 hover:bg-[#EFE3D2]'
                  }`}
                >
                  <input
                    type="radio"
                    name="projectType"
                    value={type}
                    checked={projectType === type}
                    onChange={() => setProjectType(type)}
                    className="sr-only"
                  />
                  {type}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <label htmlFor="details" className={labelClass}>Project details <span className="font-normal text-ink/60">(optional)</span></label>
            <textarea id="details" name="details" rows={3} maxLength={2000} placeholder="Location, size, timeline…" className={`${inputClass} resize-y`} />
          </div>

          <p className="flex items-start gap-3 rounded-2xl bg-cream px-4 py-4 text-sm text-ink/80">
            <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 fill-maroon" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5zm0 4a2 2 0 0 1 1 3.7V14h-2V9.7A2 2 0 0 1 12 6z" /></svg>
            All drawings, BoQs, and commercial estimates are bound by strict mutual non-disclosure under Qatari Commercial Law.
          </p>

          <div className="flex flex-col items-center gap-5 md:flex-row">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-maroon px-8 py-4 font-semibold text-white shadow-[0_10px_20px_-8px_rgba(87,19,45,0.7)] transition-colors hover:bg-[#6d1a3a] disabled:cursor-wait disabled:opacity-80 md:flex-1"
            >
              {status === 'sending' ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                <>
                  Send Enquiry <span aria-hidden="true">→</span>
                </>
              )}
            </button>
            <a
              href={`mailto:${email}?subject=${encodeURIComponent('Project consultation request')}`}
              className="flex items-center gap-2 font-semibold text-maroon hover:opacity-75 md:px-8"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
              Request a Project Consultation
            </a>
          </div>

          <AnimatePresence initial={false}>
            {status === 'error' && (
              <motion.div
                key="error"
                role="alert"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto', transition: { duration: 0.4, ease } }}
                exit={{ opacity: 0, height: 0, transition: { duration: 0.25 } }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-3 rounded-2xl bg-rose/10 px-4 py-4 text-sm text-maroon sm:flex-row sm:items-center sm:justify-between">
                  <span>{error}</span>
                  <a
                    href={whatsAppHref(phoneNumber, whatsAppMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-full bg-maroon px-4 py-2 text-center font-semibold text-white hover:bg-[#6d1a3a]"
                  >
                    Send on WhatsApp instead
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-ink/60 md:text-left">
            We&apos;ll reply by email or phone, usually within one working day.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
};
