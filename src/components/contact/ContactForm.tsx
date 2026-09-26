"use client";

import React, { useState } from 'react';
import { whatsAppHref } from '@/components/shared/WhatsAppButton';

const inputClass =
  'w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all';

/**
 * There is no mail backend, so submitting opens WhatsApp with the enquiry pre-filled.
 * Nothing is stored or sent anywhere by the site itself.
 */
export const ContactForm = ({ phoneNumber }: { phoneNumber: string }) => {
  const [opened, setOpened] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const field = (name: string) => String(data.get(name) ?? '').trim();

    const message = [
      'Hello Shah Noori, I would like to get in touch.',
      '',
      `Name: ${field('name')}`,
      field('email') ? `Email: ${field('email')}` : null,
      field('phone') ? `Phone: ${field('phone')}` : null,
      '',
      field('message'),
    ]
      .filter((line) => line !== null)
      .join('\n');

    window.open(whatsAppHref(phoneNumber, message), '_blank', 'noopener,noreferrer');
    setOpened(true);
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-semibold text-primary-900">Full Name</label>
        <input type="text" id="name" name="name" required maxLength={100} autoComplete="name" placeholder="John Doe" className={inputClass} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-semibold text-primary-900">Email Address</label>
        <input type="email" id="email" name="email" maxLength={150} autoComplete="email" placeholder="john@example.com" className={inputClass} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="text-sm font-semibold text-primary-900">Phone Number</label>
        <input type="tel" id="phone" name="phone" maxLength={30} autoComplete="tel" placeholder="+974 0000 0000" className={inputClass} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-semibold text-primary-900">Message</label>
        <textarea id="message" name="message" required maxLength={2000} rows={5} placeholder="How can we help you?" className={`${inputClass} resize-y`}></textarea>
      </div>

      <button
        type="submit"
        className="w-full py-4 rounded-lg bg-primary-900 text-white font-bold hover:bg-primary-800 transition-colors mt-2"
      >
        Send via WhatsApp
      </button>
      <p className="text-sm text-foreground/60 text-center" aria-live="polite">
        {opened
          ? 'WhatsApp opened in a new tab — press send there to deliver your message.'
          : 'Your message opens in WhatsApp, ready to send to our team.'}
      </p>
    </form>
  );
};
