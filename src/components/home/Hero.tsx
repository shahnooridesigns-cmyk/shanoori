import React from 'react';
import Image from 'next/image';
import { Container } from '../shared/Container';
import { ArrowLink } from '../shared/ui';

export const Hero = () => (
  <section className="relative flex min-h-[640px] h-[100svh] max-h-[900px] flex-col overflow-hidden bg-ink">
    <Image src="/images/hero-home.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/50" aria-hidden="true" />

    <Container className="relative flex flex-1 flex-col justify-center pt-24">
      <p className="max-w-xs text-lg leading-snug text-gold">
        Integrated construction and fit-out solutions, thoughtfully executed from concept to completion.
      </p>
      <ArrowLink href="/contact" className="mt-8 w-fit text-white">Start a Project</ArrowLink>
    </Container>

    <h1 className="relative select-none whitespace-nowrap px-4 text-center font-medium leading-[0.78] text-gold text-[19vw] 2xl:text-[280px]">
      Shah Noori
    </h1>
  </section>
);
