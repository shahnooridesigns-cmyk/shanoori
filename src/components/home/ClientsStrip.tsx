import React from 'react';
import Image from 'next/image';
import { Container } from '../shared/Container';
import { fetchClients } from '@/lib/sanity/fetch';

export const ClientsStrip = async () => {
  const clients = await fetchClients();

  if (clients.length === 0) return null;

  return (
    <section className="py-12 bg-accent-100 border-y border-accent-200">
      <Container>
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-accent-800 mb-8">
          Trusted by leading companies
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale">
          {clients.map((c) => (
            <div key={c._id} className="relative w-32 h-12 flex-shrink-0">
              <Image
                src={c.logoUrl || '/placeholder.svg'}
                alt={c.name}
                fill
                sizes="128px"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
