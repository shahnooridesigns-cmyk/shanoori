import React from 'react';
import Image from 'next/image';
import { Container } from './Container';
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
  <section className="relative overflow-hidden bg-maroon">
    {image && <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />}
    <div
      className="absolute inset-0 bg-gradient-to-r from-maroon/95 via-maroon/75 to-maroon/35"
      aria-hidden="true"
    />
    <Container className="relative flex min-h-[520px] md:min-h-[590px] flex-col justify-center gap-8 pt-32 pb-20">
      <SectionLabel tone="gold">{label}</SectionLabel>
      <h1 className="max-w-3xl text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] text-gold">{title}</h1>
      {children}
    </Container>
  </section>
);
