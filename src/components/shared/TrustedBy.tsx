import { T } from '@/components/shared/T';
import React from 'react';
import Image from 'next/image';
import { Container } from './Container';
import { CurtainHold } from './CurtainHold';
import { SectionLabel } from './ui';
import { fetchClients, fetchSharedContent } from '@/lib/sanity/fetch';
import type { ClientLogo } from '@/lib/sanity/types';

/** From this many logos they glide past in one line; fewer sit still, centred. */
const MARQUEE_FROM = 4;
/** Logos needed in the line to fill the widest monitors without a gap in the loop. */
const MARQUEE_FILL = 14;

/**
 * One logo, large and on its own (no tile behind it), shown in white so every brand reads on the
 * maroon background. The uploaded logos are square with transparent backgrounds.
 */
const Logo = ({ client, className = '' }: { client: ClientLogo; className?: string }) => (
  <li className={`relative flex h-[34vw] w-[43vw] shrink-0 items-center justify-center sm:h-44 sm:w-60 md:h-60 md:w-80 ${className}`} title={client.name}>
    {client.logoUrl ? (
      // Eager: the line repeats each logo many times and keeps moving, so lazy loading would leave gaps
      <Image src={client.logoUrl} alt={client.name} fill sizes="(min-width: 768px) 320px, 45vw" loading="eager" className="object-contain brightness-0 invert" />
    ) : (
      <span className="px-2 text-center text-base font-semibold text-white md:text-xl">{client.name}</span>
    )}
  </li>
);

/** A strip of logos that slides without end: the list is repeated and moves by one copy. */
const Row = ({ clients, reverse = false }: { clients: ClientLogo[]; reverse?: boolean }) => {
  const copies = Math.ceil(MARQUEE_FILL / clients.length) + 1;
  return (
    <div
      className={`logo-marquee flex w-max ${reverse ? 'logo-marquee-reverse' : ''}`}
      dir="ltr"
      style={{ '--marquee-duration': `${clients.length * 5}s`, '--marquee-shift': `${-100 / copies}%` } as React.CSSProperties}
    >
      {Array.from({ length: copies }, (_, copy) => (
        <ul key={copy} aria-hidden={copy > 0 || undefined} className="flex shrink-0">
          {clients.map((c) => <Logo key={c._id} client={c} className="mr-3 md:mr-16" />)}
        </ul>
      ))}
    </div>
  );
};

/** "Trusted by Businesses & Brands": client logos from Sanity in one line, with the client count under it. */
export const TrustedBy = async () => {
  const [clients, shared] = await Promise.all([fetchClients(), fetchSharedContent()]);
  if (clients.length === 0) return null;

  return (
    // Slides up over the section before it (CurtainHold)
    <section className="bg-brand-gradient relative overflow-hidden py-24 md:py-32">
      <CurtainHold />
      {/* Soft glow behind the logos */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[820px] max-w-[120vw] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gold/15 blur-[110px]" aria-hidden="true" />

      <Container className="relative flex flex-col items-center">
        <SectionLabel tone="gold" className="!self-center"><T k="label.ourClients" /></SectionLabel>
        <h2 className="mt-5 text-center text-4xl md:text-5xl font-semibold text-gold">{shared.clients.heading}</h2>
      </Container>

      {clients.length < MARQUEE_FROM ? (
        <Container className="relative">
          <ul className="mt-6 flex items-center justify-center gap-x-3 md:mt-8 md:gap-x-16">
            {clients.map((c) => <Logo key={c._id} client={c} className="card-reveal" />)}
          </ul>
        </Container>
      ) : (
        // Reduced motion: no sliding, the line scrolls sideways by hand instead.
        // Left to right in both languages: the strip is wider than the screen and scrolls leftwards;
        // in a right-to-left box it would start from its far end, with the logos off screen.
        <div dir="ltr" className="relative mt-10 overflow-hidden motion-reduce:overflow-x-auto md:mt-12 md:[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <Row clients={clients} />
        </div>
      )}

      <p className="relative mt-4 text-center text-sm font-medium uppercase tracking-[0.3em] text-gold/80 md:mt-6">{shared.clients.note}</p>
    </section>
  );
};
