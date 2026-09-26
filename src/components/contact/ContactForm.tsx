"use client";

import React, { useState } from 'react';
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

/**
 * There is no mail backend, so submitting opens WhatsApp with the enquiry pre-filled.
 * Nothing is stored or sent anywhere by the site itself.
 */
export const ContactForm = ({ phoneNumber, email }: { phoneNumber: string; email: string }) => {
  const [projectType, setProjectType] = useState('Interior & Fit-Out');
  const [opened, setOpened] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const field = (name: string) => String(data.get(name) ?? '').trim();

    const message = [
      'Hello Shah Noori, I would like to request a project consultation.',
      '',
      `Name: ${field('name')}`,
      `Phone: +974 ${field('phone')}`,
      `Email: ${field('email')}`,
      `Project type: ${projectType}`,
      field('details') ? `\n${field('details')}` : null,
    ]
      .filter((line) => line !== null)
      .join('\n');

    window.open(whatsAppHref(phoneNumber, message), '_blank', 'noopener,noreferrer');
    setOpened(true);
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
          className="flex w-full items-center justify-center gap-3 rounded-full bg-maroon px-8 py-4 font-semibold text-white shadow-[0_10px_20px_-8px_rgba(87,19,45,0.7)] transition-colors hover:bg-[#6d1a3a] md:flex-1"
        >
          Send Enquiry <span aria-hidden="true">→</span>
        </button>
        <a
          href={`mailto:${email}?subject=${encodeURIComponent('Project consultation request')}`}
          className="flex items-center gap-2 font-semibold text-maroon hover:opacity-75 md:px-8"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
          Request a Project Consultation
        </a>
      </div>
      <p className="text-center text-sm text-ink/60 md:text-left" aria-live="polite">
        {opened
          ? 'WhatsApp opened in a new tab — press send there to deliver your enquiry.'
          : 'Send Enquiry opens WhatsApp with your details ready to send.'}
      </p>
    </form>
  );
};
