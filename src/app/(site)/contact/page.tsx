import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/shared/Container';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { ContactForm } from '@/components/contact/ContactForm';
import { resolveContact, toTelHref } from '@/lib/constants';
import { fetchSiteSettings } from '@/lib/sanity/fetch';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Shah Noori for enquiries and project consultations in Doha, Qatar.',
};

export default async function ContactPage() {
  const { address, phone: primaryPhone, email, whatsapp } = resolveContact(await fetchSiteSettings());
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <main className="flex-1 py-20 w-full overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-6">Contact Us</h1>
          <p className="text-lg text-foreground/80">
            Get in touch with our team for enquiries, project consultations, or any information you may need.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information & Map */}
          <div className="flex flex-col gap-10">
            <div className="bg-primary-50 p-8 rounded-2xl border border-primary-100 flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-primary-900">Get In Touch</h2>

              <div className="flex flex-col gap-4 text-foreground/80">
                <div>
                  <strong className="block text-primary-900 mb-1">Address:</strong>
                  <span className="whitespace-pre-line">{address}</span>
                </div>
                <div>
                  <strong className="block text-primary-900 mb-1">Phone:</strong>
                  <a href={toTelHref(primaryPhone)} className="hover:text-primary-700 transition-colors">{primaryPhone}</a>
                </div>
                <div>
                  <strong className="block text-primary-900 mb-1">Email:</strong>
                  <a href={`mailto:${email}`} className="hover:text-primary-700 transition-colors">{email}</a>
                </div>
              </div>

              <div className="pt-4">
                <WhatsAppButton
                  message="Hello Shah Noori, I would like to get in touch regarding a new project."
                  phoneNumber={whatsapp}
                />
              </div>
            </div>

            {/* Location */}
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full h-64 bg-primary-900 rounded-2xl flex flex-col items-center justify-center gap-3 text-center p-8 transition-colors hover:bg-primary-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10 fill-accent-300" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
              <span className="text-white font-semibold text-lg">View our location on Google Maps</span>
              <span className="text-accent-300 text-sm group-hover:underline">Open in a new tab &rarr;</span>
            </a>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-200 shadow-sm h-fit">
            <h2 className="text-2xl font-bold text-primary-900 mb-6">Send us a Message</h2>
            <ContactForm phoneNumber={whatsapp} />
          </div>
        </div>
      </Container>
    </main>
  );
}
