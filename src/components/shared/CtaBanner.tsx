import React from 'react';
import Image from 'next/image';
import { CtaSigning } from './CtaSigning';
import { fetchSharedContent } from '@/lib/sanity/fetch';

/** "Ready to Elevate Your Space" banner shown above the footer on every page. */
export const CtaBanner = async () => {
  const { cta } = await fetchSharedContent();

  return (
    <section className="relative overflow-clip bg-ink">
      <Image src={cta.image} alt="" fill sizes="100vw" className="object-cover opacity-70" />
      <CtaSigning heading={cta.heading} text={cta.text} buttonLabel={cta.buttonLabel} />
    </section>
  );
};
