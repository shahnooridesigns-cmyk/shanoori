import React from 'react';
import Image from 'next/image';
import { Container } from './Container';
import { fetchClients } from '@/lib/sanity/fetch';

/** "Trusted by Businesses & Brands": client logos from Sanity in white circles. */
export const TrustedBy = async () => {
  const clients = await fetchClients();
  if (clients.length === 0) return null;

  return (
    <section className="bg-brand-gradient py-24 md:py-32">
      <Container>
        <h2 className="text-center text-4xl md:text-5xl text-gold">Trusted by Businesses &amp; Brands</h2>
        <ul className="mt-16 flex flex-wrap justify-center gap-6 md:gap-9">
          {clients.map((c) => (
            <li
              key={c._id}
              className="card-reveal card-lift relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-white md:h-36 md:w-36"
              title={c.name}
            >
              {c.logoUrl ? (
                <Image src={c.logoUrl} alt={c.name} fill sizes="144px" className="object-contain p-6" />
              ) : (
                <span className="px-3 text-center text-sm font-semibold text-maroon">{c.name}</span>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};
