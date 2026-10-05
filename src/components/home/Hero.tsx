import React from 'react';
import Image from 'next/image';
import { Container } from '../shared/Container';
import { ArrowLink } from '../shared/ui';
import { fetchHomeContent } from '@/lib/sanity/fetch';

export const Hero = async () => {
  const { hero } = await fetchHomeContent();
  // The design's 19vw fits a 10-character title edge to edge; longer titles scale down to fit
  const titleSize = Math.min(19, 190 / Math.max(hero.title.length, 1));

  return (
    <section className="relative flex min-h-[640px] h-[100svh] max-h-[900px] flex-col overflow-hidden bg-ink">
      <Image src={hero.image} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/50" aria-hidden="true" />

      <Container className="relative flex flex-1 flex-col justify-center pt-24">
        <p className="max-w-xs text-lg leading-snug text-gold">{hero.text}</p>
        <ArrowLink href="/contact" className="mt-8 w-fit text-white">{hero.buttonLabel}</ArrowLink>
      </Container>

      <h1
        className="relative select-none whitespace-nowrap px-4 text-center font-medium leading-[0.78] text-gold"
        style={{ fontSize: `min(${titleSize}vw, ${Math.round((280 * titleSize) / 19)}px)` }}
      >
        {hero.title}
      </h1>
    </section>
  );
};
