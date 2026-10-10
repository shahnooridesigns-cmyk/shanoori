import React from 'react';
import { HeroImage } from './HeroImage';
import { Container } from './Container';
import { RiseText } from './RiseText';
import { SectionLabel } from './ui';

/** Inner-page hero: photo with the maroon wash from the About/Services designs. */
export const PageHero = ({
  label,
  title,
  image,
  children,
}: {
  label: string;
  title: React.ReactNode;
  image?: string;
  children?: React.ReactNode;
}) => (
  <section className="relative overflow-clip bg-maroon">
    {/* The photo eases back from a slight zoom on load and drifts as the banner scrolls away */}
    {image && (
      <div className="hero-drift absolute inset-0">
        <HeroImage src={image} className="hero-zoom object-cover" />
      </div>
    )}
    <div
      className="absolute inset-0 bg-gradient-to-r from-maroon/95 via-maroon/75 to-maroon/35"
      aria-hidden="true"
    />
    <Container className="relative flex min-h-[520px] md:min-h-[590px] flex-col justify-center gap-8 pt-32 pb-20">
      <div className="hero-in">
        <SectionLabel tone="gold">{label}</SectionLabel>
      </div>
      <h1 className="max-w-3xl text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] text-gold">
        {typeof title === 'string' ? <RiseText text={title} /> : title}
      </h1>
      {children && <div className="hero-in" style={{ '--i': 5 } as React.CSSProperties}>{children}</div>}
    </Container>
  </section>
);
