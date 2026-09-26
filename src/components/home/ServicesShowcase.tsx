import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../shared/Container';
import { SectionLabel } from '../shared/ui';
import { divisions } from '@/lib/services';

export const ServicesShowcase = () => (
  <section className="bg-black py-24 md:py-32">
    <Container className="grid gap-16 lg:grid-cols-[1fr_1.1fr]">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <SectionLabel tone="gold">Services</SectionLabel>
        <h2 className="mt-6 text-5xl md:text-7xl font-medium leading-[0.95] text-gold">
          What we
          <br />
          deliver
        </h2>
        <p className="mt-10 max-w-md text-lg text-white/75">
          We bring every stage of your project together — from construction and fit-out to complete MEP execution.
        </p>
      </div>

      <div className="flex flex-col gap-20 md:gap-32">
        {divisions.map((d) => (
          <Link
            key={d.id}
            href={`/services#${d.id}`}
            className="group grid gap-6 sm:grid-cols-[1fr_260px] sm:gap-4"
          >
            <div className="flex flex-col">
              <span className="text-white/80">/{d.number}</span>
              <h3 className="mt-6 text-3xl md:text-4xl text-gold transition-opacity group-hover:opacity-80">{d.title}</h3>
              <p className="mt-6 max-w-xs text-white/75">{d.summary}</p>
              <p className="mt-auto pt-8 text-white/75">{d.tags.join(' · ')}</p>
            </div>
            <div className="relative aspect-[261/337] overflow-hidden">
              <Image src={d.image} alt={d.title} fill sizes="(min-width: 640px) 260px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </Link>
        ))}
      </div>
    </Container>
  </section>
);
