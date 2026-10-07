import React from 'react';
import Image from 'next/image';
import { Container } from './Container';
import { fetchClients, fetchSharedContent } from '@/lib/sanity/fetch';
import type { ClientLogo } from '@/lib/sanity/types';

/** Up to this many logos sit in a centred row; more than that glide past in a strip. */
const MARQUEE_FROM = 7;
/** Logos needed on screen at once to fill the widest monitors without a gap in the loop. */
const MARQUEE_FILL = 24;

const Logo = ({ client, className = '' }: { client: ClientLogo; className?: string }) => (
  <li
    className={`relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white md:h-36 md:w-36 ${className}`}
    title={client.name}
  >
    {client.logoUrl ? (
      <Image src={client.logoUrl} alt={client.name} fill sizes="144px" className="object-contain p-6" />
    ) : (
      <span className="px-3 text-center text-sm font-semibold text-maroon">{client.name}</span>
    )}
  </li>
);

/** "Trusted by Businesses & Brands": client logos from Sanity in white circles. */
export const TrustedBy = async () => {
  const [clients, shared] = await Promise.all([fetchClients(), fetchSharedContent()]);
  if (clients.length === 0) return null;
  // The list is repeated and the strip slides left by one copy, so the loop is seamless
  const copies = Math.ceil(MARQUEE_FILL / clients.length) + 1;

  return (
    <section className="bg-brand-gradient py-24 md:py-32">
      <Container>
        <h2 className="text-center text-4xl md:text-5xl font-semibold text-gold">{shared.clients.heading}</h2>
      </Container>

      {clients.length < MARQUEE_FROM ? (
        <Container>
          <ul className="mt-16 flex flex-wrap justify-center gap-6 md:gap-9">
            {clients.map((c) => <Logo key={c._id} client={c} className="card-reveal card-lift" />)}
          </ul>
        </Container>
      ) : (
        // Reduced motion: no sliding, the strip scrolls sideways by hand instead
        <div className="mt-16 overflow-hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="logo-marquee flex w-max" style={{ '--marquee-duration': `${clients.length * 4}s`, '--marquee-shift': `${-100 / copies}%` } as React.CSSProperties}>
            {Array.from({ length: copies }, (_, copy) => (
              <ul key={copy} aria-hidden={copy > 0 || undefined} className="flex shrink-0">
                {clients.map((c) => <Logo key={c._id} client={c} className="mr-6 md:mr-9" />)}
              </ul>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
