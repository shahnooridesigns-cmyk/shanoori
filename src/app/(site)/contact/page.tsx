import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/shared/Container';
import { SectionLabel } from '@/components/shared/ui';
import { ContactForm } from '@/components/contact/ContactForm';
import { whatsAppHref } from '@/components/shared/WhatsAppButton';
import { FaqSection } from '@/components/shared/FaqSection';
import { CountUp } from '@/components/shared/CountUp';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { resolveContact, toTelHref } from '@/lib/constants';
import { fetchSiteSettings } from '@/lib/sanity/fetch';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Request a project consultation with Shah Noori: civil construction, interior fit-out and MEP works in Doha, Qatar.',
};

const badges = ['Grade-A Classified', 'Turnkey Delivery Under One Roof', 'Rapid 24-Hour Tender Response'];

const travelTimes = [
  { place: "Hamad Int'l Airport", time: '20 Mins', via: 'Via G-Ring Expressway' },
  { place: 'West Bay & Corniche', time: '25 Mins', via: 'Via Sabah Al-Ahmad Corridor' },
  { place: 'Lusail Marina District', time: '28 Mins', via: 'Via Al Majd Orbital' },
];

export default async function ContactPage() {
  const { address, phone, email, whatsapp } = resolveContact(await fetchSiteSettings());
  const mapsQuery = encodeURIComponent(address);
  const displayPhone = `+${whatsapp.slice(0, 3)} ${whatsapp.slice(3, 7)} ${whatsapp.slice(7)}`.trim();

  return (
    <main className="flex-1 w-full">
      {/* Hero + form */}
      <section className="bg-brand-gradient pt-32 pb-20">
        <Container>
          <SectionLabel tone="gold">Contact Us</SectionLabel>
          <h1 className="mt-8 text-center text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-white">
            Let&apos;s Build Your Next <span className="text-[#FFE59E]">Project Together.</span>
          </h1>
          <p className="mt-8 text-center text-lg font-medium text-white">
            Looking for a reliable construction, interior fit-out or MEP company in Qatar?
          </p>
          <p className="mt-2 text-center text-white/70">
            Talk to Shah Noori about your project requirements and work with one integrated project partner.
          </p>
          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {badges.map((b) => (
              <li key={b} className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">{b}</li>
            ))}
          </ul>

          <div className="card-reveal mt-16 rounded-[32px] bg-[#F4ECEE] p-6 sm:p-10 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/70">Direct Tender Submission &amp; RFQ</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-maroon">Request a Project Consultation</h2>
            <p className="mt-2 mb-10 text-ink/70">Submit your tender documents or project specifications for confidential evaluation.</p>
            <ContactForm phoneNumber={whatsapp} email={email} />
          </div>
        </Container>
      </section>

      <FaqSection />

      {/* Location */}
      <section className="bg-brand-gradient py-24">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-wider text-white">Operational Center &amp; Production Plant</p>
          <h2 className="mt-4 max-w-3xl whitespace-pre-line text-3xl md:text-5xl font-semibold leading-tight text-gold">
            Find Our Location — {address}
          </h2>
          <p className="mt-6 max-w-2xl text-white/90">
            Strategically located in Birkat Awamer logistics and manufacturing hub with integrated joinery workshop, MEP testing yard, and administrative engineering offices.
          </p>

          <div className="mt-12 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
            <div className="card-reveal overflow-hidden rounded-[32px] bg-white">
              <iframe
                title="Shah Noori location map"
                src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
                className="h-80 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <ul className="grid gap-3 p-4 sm:grid-cols-3">
                {travelTimes.map((t) => (
                  <li key={t.place} className="card-lift rounded-2xl bg-cream p-3">
                    <p className="text-xs font-semibold text-ink/80">{t.place}</p>
                    <p className="text-2xl font-semibold text-ink"><CountUp value={t.time} /></p>
                    <p className="text-xs text-ink/70">{t.via}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-5">
              <div className="card-reveal card-lift overflow-hidden rounded-[32px] bg-white">
                <div className="flex gap-5 p-8">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cream text-maroon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#8A6D1F]">Corporate Headquarters</p>
                    <p className="mt-1 whitespace-pre-line text-xl font-semibold text-ink">{address}</p>
                    <p className="mt-2 text-sm text-ink/70">Central Engineering Yard, Joinery Complex &amp; Executive Boardroom</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 bg-cream px-8 py-4">
                  <a href={toTelHref(phone)} className="text-sm text-ink/80 hover:text-ink">{phone}</a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-maroon px-5 py-2 text-sm font-semibold text-white hover:bg-[#6d1a3a]"
                  >
                    Map: Find Our Location →
                  </a>
                </div>
              </div>

              <div className="card-reveal card-lift rounded-[32px] bg-gradient-to-br from-white via-white to-[#F2D4DD] p-8">
                <div className="flex items-center justify-between gap-4">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A6D1F]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#E0B83A]" aria-hidden="true" />
                    Immediate Technical Channel
                  </p>
                  <span className="rounded-full bg-[#FFF1B8] px-3 py-1 text-xs font-semibold text-[#8A6D1F]">Active Now</span>
                </div>
                <h3 className="mt-4 text-3xl font-semibold text-ink">WhatsApp: Direct Enquiry</h3>
                <p className="mt-3 text-ink/75">Instant chat with our senior project estimator &amp; engineering directors.</p>
                <a
                  href={whatsAppHref(whatsapp, 'Hello Shah Noori, I would like to discuss a project.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center gap-3 rounded-full bg-maroon px-6 py-3.5 font-semibold text-white hover:bg-[#6d1a3a]"
                >
                  {displayPhone} (Open WhatsApp)
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <CtaBanner />
    </main>
  );
}
