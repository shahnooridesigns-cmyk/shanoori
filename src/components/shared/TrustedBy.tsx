import React from 'react';
import Image from 'next/image';
import { Container } from './Container';
import { SectionLabel } from './ui';
import { fetchClients, fetchSharedContent } from '@/lib/sanity/fetch';
import type { ClientLogo } from '@/lib/sanity/types';

/** From this many logos they glide past in rows (four on phones, two on larger screens); fewer sit still, centred. */
const MARQUEE_FROM = 6;
/** Logos needed in a row to fill the widest monitors without a gap in the loop. */
const MARQUEE_FILL = 20;

/**
 * One logo in a frosted-glass circle: a see-through, blurred ring with a light edge, and a white
 * disc inside so any logo stays readable. In the moving rows a phone shows four across (the
 * width is a quarter of the screen less the gaps); larger screens use a fixed size.
 */
const Logo = ({ client, className = '' }: { client: ClientLogo; className?: string }) => (
  <li
    className={`flex aspect-square w-[calc((100vw-60px)/4)] shrink-0 rounded-full border border-white/35 bg-white/15 p-1.5 backdrop-blur-md transition-transform duration-500 hover:-translate-y-1 sm:w-28 md:w-36 md:p-2.5 ${className}`}
    title={client.name}
  >
    <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white/95">
      {client.logoUrl ? (
        // Eager: the rows repeat each logo many times and keep moving, so lazy loading would leave gaps
        <Image src={client.logoUrl} alt={client.name} fill sizes="(min-width: 768px) 144px, 25vw" loading="eager" className="object-contain p-3 md:p-5" />
      ) : (
        <span className="px-2 text-center text-xs font-semibold text-maroon md:text-sm">{client.name}</span>
      )}
    </span>
  </li>
);

/** A strip of logos that slides without end: the list is repeated and moves by one copy. */
const Row = ({ clients, reverse = false }: { clients: ClientLogo[]; reverse?: boolean }) => {
  const copies = Math.ceil(MARQUEE_FILL / clients.length) + 1;
  return (
    <div
      className={`logo-marquee flex w-max ${reverse ? 'logo-marquee-reverse' : ''}`}
      style={{ '--marquee-duration': `${clients.length * 4}s`, '--marquee-shift': `${-100 / copies}%` } as React.CSSProperties}
    >
      {Array.from({ length: copies }, (_, copy) => (
        <ul key={copy} aria-hidden={copy > 0 || undefined} className="flex shrink-0">
          {clients.map((c) => <Logo key={c._id} client={c} className="mr-3 md:mr-6" />)}
        </ul>
      ))}
    </div>
  );
};

/** "Trusted by Businesses & Brands": client logos from Sanity, gliding past in rows. */
export const TrustedBy = async () => {
  const [clients, shared] = await Promise.all([fetchClients(), fetchSharedContent()]);
  if (clients.length === 0) return null;
  // Deal the logos out across the rows in turn, so every row stays balanced as clients are added
  const rows = (count: number) =>
    Array.from({ length: count }, (_, row) => clients.filter((_, i) => i % count === row)).filter((row) => row.length > 0);
  const strip = 'relative mt-14 flex-col gap-3 overflow-hidden py-2 motion-reduce:overflow-x-auto md:mt-16 md:gap-6';

  return (
    <section className="bg-brand-gradient relative overflow-hidden py-24 md:py-32">
      {/* Soft glow behind the logos */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[820px] max-w-[120vw] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gold/15 blur-[110px]" aria-hidden="true" />

      <Container className="relative flex flex-col items-center">
        <SectionLabel tone="gold" className="!self-center">Our Clients</SectionLabel>
        <h2 className="mt-5 text-center text-4xl md:text-5xl font-semibold text-gold">{shared.clients.heading}</h2>
      </Container>

      {clients.length < MARQUEE_FROM ? (
        <Container className="relative">
          <ul className="mt-14 flex flex-wrap justify-center gap-3 md:mt-16 md:gap-6">
            {clients.map((c) => <Logo key={c._id} client={c} className="card-reveal" />)}
          </ul>
        </Container>
      ) : (
        // Phones stack four rows; tablets and desktops show two. Neighbouring rows travel opposite ways.
        // Reduced motion: no sliding, the rows scroll sideways by hand instead
        <>
          <div className={`${strip} flex md:hidden`}>
            {rows(4).map((row, i) => <Row key={i} clients={row} reverse={i % 2 === 1} />)}
          </div>
          <div className={`${strip} hidden md:flex md:[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]`}>
            {rows(2).map((row, i) => <Row key={i} clients={row} reverse={i % 2 === 1} />)}
          </div>
        </>
      )}
    </section>
  );
};
