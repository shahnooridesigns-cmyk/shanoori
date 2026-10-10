import React from 'react';
import { HeroImage } from '@/components/shared/HeroImage';
import { Container } from '../shared/Container';
import { ArrowLink } from '../shared/ui';
import { HeroLift } from './HeroLift';
import { HeroTitle } from './HeroTitle';
import { fetchHomeContent } from '@/lib/sanity/fetch';

export const Hero = async () => {
  const { hero } = await fetchHomeContent();

  return (
    // Pinned (sticky) so the rest of the page, which the home page lifts above it, slides up over
    // it. On a screen shorter than the hero it pins once its bottom edge is reached.
    <section className="sticky top-[min(0px,calc(100svh-640px))] flex min-h-[640px] h-[100svh] max-h-[900px] flex-col overflow-hidden bg-ink motion-reduce:relative motion-reduce:top-0">
      <div className="absolute inset-0">
        <HeroImage src={hero.image} className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/50" aria-hidden="true" />

      {/* Stays with the photo */}
      <Container className="relative flex flex-1 flex-col justify-center pt-24">
        <p className="max-w-xs text-lg leading-snug text-gold">{hero.text}</p>
        <ArrowLink href="/contact" className="mt-8 w-fit text-white">{hero.buttonLabel}</ArrowLink>
      </Container>

      {/* Only the wordmark leaves with the scroll */}
      <HeroLift>
        <HeroTitle title={hero.title} />
      </HeroLift>
    </section>
  );
};
