"use client";

import type { UiKey } from '@/lib/content/ui';
import { useLocale, useT } from '@/components/shared/LocaleProvider';
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { whatsAppHref } from '@/lib/constants';

// value: what is sent to /api/contact and written in the email (always English, it is checked
// there against a fixed list). label: what the visitor sees, in the page's language.
const projectTypes: { value: string; label: UiKey }[] = [
  { value: 'Civil Construction', label: 'type.civil' },
  { value: 'Interior & Fit-Out', label: 'type.interior' },
  { value: 'Commercial Spaces', label: 'type.commercial' },
  { value: 'Retail Fit-Out', label: 'type.retail' },
  { value: 'Hospitality Spaces', label: 'type.hospitality' },
  { value: 'MEP Works', label: 'type.mep' },
  { value: 'Turnkey Contracting', label: 'type.turnkey' },
];

/** Dialling codes offered as suggestions; any other code can be typed */
const COUNTRY_CODES: [code: string, en: string, ar: string][] = [
  ['+974', 'Qatar', 'قطر'],
  ['+971', 'UAE', 'الإمارات'],
  ['+966', 'Saudi Arabia', 'السعودية'],
  ['+965', 'Kuwait', 'الكويت'],
  ['+973', 'Bahrain', 'البحرين'],
  ['+968', 'Oman', 'عُمان'],
  ['+91', 'India', 'الهند'],
  ['+92', 'Pakistan', 'باكستان'],
  ['+20', 'Egypt', 'مصر'],
  ['+44', 'United Kingdom', 'المملكة المتحدة'],
  ['+1', 'USA / Canada', 'الولايات المتحدة / كندا'],
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
  const t = useT();
  const locale = useLocale();
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
        t('form.waIntro'),
        '',
        `${t('form.waName')}: ${field('name')}`,
        `${t('form.waPhone')}: ${field('countryCode') || '+974'} ${field('phone')}`,
        `${t('form.waEmail')}: ${field('email')}`,
        `${t('form.waType')}: ${t(projectTypes.find((p) => p.value === projectType)?.label ?? 'type.interior')}`,
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
          countryCode: field('countryCode'),
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
      // The server's own messages are in English; the Arabic site shows its Arabic one instead
      if (!res.ok || !json.ok) throw new Error((locale === 'en' && json.error) || t('form.failed'));
      setSentTo(field('email'));
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('form.failed'));
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
          <h3 className="text-2xl md:text-3xl font-semibold text-maroon">{t('form.thanks')}</h3>
          <p className="max-w-md text-ink/75">
            {t('form.thanksText')}{' '}
            <span dir="ltr" className="font-semibold text-ink">{sentTo}</span>
          </p>
          <button type="button" onClick={reset} className="mt-2 font-semibold text-maroon underline underline-offset-4 hover:opacity-75">
            {t('form.another')}
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
          <div className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden" dir="ltr" aria-hidden="true">
            <label htmlFor="sn_trap">{t('form.trap')}</label>
            <input id="sn_trap" name="sn_trap" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className={labelClass}>{t('form.name')} <span className="text-rose">*</span></label>
              <input id="name" name="name" type="text" required maxLength={100} autoComplete="name" placeholder={t('form.namePlaceholder')} className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className={labelClass}>{t('form.phone')} <span className="text-rose">*</span></label>
              {/* Phone numbers read left to right in every language */}
              <div dir="ltr" className="flex gap-1.5">
                {/* Starts as Qatar; the visitor can pick or type their own country's code */}
                <input
                  name="countryCode"
                  type="tel"
                  defaultValue="+974"
                  required
                  maxLength={5}
                  pattern="\+[0-9]{1,4}"
                  title={t('form.codeTitle')}
                  aria-label={t('form.codeLabel')}
                  autoComplete="tel-country-code"
                  list="country-codes"
                  className="w-[5.5rem] shrink-0 rounded-2xl bg-[#EFE3D2] px-3 py-3.5 text-center text-ink focus:outline-none focus:ring-2 focus:ring-maroon/60 transition-shadow"
                />
                <datalist id="country-codes">
                  {COUNTRY_CODES.map(([code, en, ar]) => (
                    <option key={code} value={code}>{locale === 'ar' ? ar : en}</option>
                  ))}
                </datalist>
                <input id="phone" name="phone" type="tel" required maxLength={20} pattern="[0-9 ]{6,15}" title={t('form.phoneTitle')} autoComplete="tel-national" placeholder="3300 0000" className={inputClass} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className={labelClass}>{t('form.email')} <span className="text-rose">*</span></label>
            <input id="email" name="email" type="email" dir="ltr" required maxLength={150} autoComplete="email" placeholder="procurement@organization.qa" className={inputClass} />
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className={`${labelClass} mb-3`}>{t('form.projectType')} <span className="text-rose">*</span></legend>
            <div className="flex flex-wrap gap-2.5">
              {projectTypes.map(({ value: type, label }) => (
                <label
                  key={type}
                  className={`flex min-h-11 cursor-pointer items-center rounded-full px-4 py-2 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-maroon ${
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
                  {t(label)}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <label htmlFor="details" className={labelClass}>{t('form.details')} <span className="font-normal text-ink/60">{t('form.optional')}</span></label>
            <textarea id="details" name="details" rows={3} maxLength={2000} placeholder={t('form.detailsPlaceholder')} className={`${inputClass} resize-y`} />
          </div>

          <p className="flex items-start gap-3 rounded-2xl bg-cream px-4 py-4 text-sm text-ink/80">
            <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 fill-maroon" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5zm0 4a2 2 0 0 1 1 3.7V14h-2V9.7A2 2 0 0 1 12 6z" /></svg>
            {t('form.nda')}
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
                  {t('form.sending')}
                </>
              ) : (
                <>
                  {t('form.send')} <span aria-hidden="true" className="rtl:-scale-x-100">→</span>
                </>
              )}
            </button>
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(t('form.emailSubject'))}`}
              className="tap-area flex items-center gap-2 font-semibold text-maroon hover:opacity-75 md:px-8"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
              {t('form.byEmail')}
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
                    {t('form.byWhatsapp')}
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-ink/60 md:text-start">
            {t('form.reply')}
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
};
