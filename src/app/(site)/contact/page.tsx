import { RiseText, wordCount } from '@/components/shared/RiseText';
import React from 'react';
import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { Container } from '@/components/shared/Container';
import { SectionLabel } from '@/components/shared/ui';
import { ContactForm } from '@/components/contact/ContactForm';
import { whatsAppHref } from '@/components/shared/WhatsAppButton';
import { FaqSection } from '@/components/shared/FaqSection';
import { CountUp } from '@/components/shared/CountUp';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { BalancedGrid } from '@/components/shared/BalancedGrid';
import { resolveContact, toTelHref } from '@/lib/constants';
import { fetchContactContent, fetchSiteSettings } from '@/lib/sanity/fetch';

export const metadata: Metadata = pageMeta({
  title: 'Contact | Fit-out Contractor in Doha, Qatar',
  description:
    'Request a project consultation with Shah Noori: interior fit-out, MEP and civil works in Doha, Qatar. Call, WhatsApp or send us a message.',
  path: '/contact',
});

export default async function ContactPage() {
  const [settings, { hero, form, location, whatsapp: chat }] = await Promise.all([fetchSiteSettings(), fetchContactContent()]);
  const { address, phone, email, whatsapp } = resolveContact(settings);
  const mapsQuery = encodeURIComponent(address);
  const displayPhone = `+${whatsapp.slice(0, 3)} ${whatsapp.slice(3, 7)} ${whatsapp.slice(7)}`.trim();

  return (
    <main className="flex-1 w-full">
      {/* Hero + form */}
      <section className="bg-brand-gradient pt-32 pb-20">
        <Container>
          <div className="hero-in">
            <SectionLabel tone="gold">Contact Us</SectionLabel>
          </div>
          <h1 className="mt-8 text-center text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-white">
            <RiseText text={hero.heading} /> <RiseText text={hero.highlight} start={wordCount(hero.heading)} className="text-[#FFE59E]" />
          </h1>
          <p className="hero-in mt-8 text-center text-lg font-medium text-white" style={{ '--i': 4 } as React.CSSProperties}>{hero.lead}</p>
          <p className="hero-in mt-2 text-center text-white/70" style={{ '--i': 5 } as React.CSSProperties}>{hero.text}</p>
          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {hero.badges.map((b, i) => (
              <li key={b} className="pop-in rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white" style={{ '--i': i } as React.CSSProperties}>{b}</li>
            ))}
          </ul>

          <div className="card-reveal mt-16 rounded-[32px] bg-[#F4ECEE] p-6 sm:p-10 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/70">{form.eyebrow}</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-maroon">{form.heading}</h2>
            <p className="text-reveal mt-2 mb-10 text-ink/70">{form.text}</p>
            <ContactForm phoneNumber={whatsapp} email={email} />
          </div>
        </Container>
      </section>

      <FaqSection />

      {/* Location */}
      <section className="bg-brand-gradient py-24 md:py-32">
        <Container>
          <p className="label-reveal text-xs font-semibold uppercase tracking-wider text-white">{location.eyebrow}</p>
          <h2 className="mt-4 max-w-3xl whitespace-pre-line text-3xl md:text-5xl font-semibold leading-tight text-gold">
            {location.heading} — {address}
          </h2>
          <p className="text-reveal mt-6 max-w-2xl text-white/90">{location.text}</p>

          <div className="mt-12 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
            <div className="card-reveal overflow-hidden rounded-[32px] bg-white">
              <iframe
                title="Shah Noori location map"
                src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
                className="h-80 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <BalancedGrid as="ul" compact count={location.travelTimes.length} max={3} gap="0.75rem" className="p-4">
                {location.travelTimes.map((t, i) => (
                  <li key={i} className="card-lift rounded-2xl bg-cream p-3">
                    <p className="text-xs font-semibold text-ink/80">{t.place}</p>
                    <p className="text-2xl font-semibold text-ink"><CountUp value={t.time} /></p>
                    <p className="text-xs text-ink/70">{t.via}</p>
                  </li>
                ))}
              </BalancedGrid>
            </div>

            <div className="flex flex-col gap-5">
              <div className="card-reveal card-lift overflow-hidden rounded-[32px] bg-white">
                <div className="flex gap-5 p-8">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cream text-maroon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#8A6D1F]">{location.officeLabel}</p>
                    <p className="mt-1 whitespace-pre-line text-xl font-semibold text-ink">{address}</p>
                    <p className="mt-2 text-sm text-ink/70">{location.officeNote}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 bg-cream px-8 py-4">
                  <a href={toTelHref(phone)} className="tap-area text-sm text-ink/80 hover:text-ink">{phone}</a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-maroon px-5 py-3 text-sm font-semibold text-white hover:bg-[#6d1a3a]"
                  >
                    Map: Find Our Location →
                  </a>
                </div>
              </div>

              <div className="card-reveal card-lift rounded-[32px] bg-gradient-to-br from-white via-white to-[#F2D4DD] p-8">
                <div className="flex items-center justify-between gap-4">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A6D1F]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#E0B83A]" aria-hidden="true" />
                    {chat.eyebrow}
                  </p>
                  <span className="rounded-full bg-[#FFF1B8] px-3 py-1 text-xs font-semibold text-[#8A6D1F]">{chat.badge}</span>
                </div>
                <h3 className="mt-4 text-3xl font-semibold text-ink">{chat.heading}</h3>
                <p className="mt-3 text-ink/75">{chat.text}</p>
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
