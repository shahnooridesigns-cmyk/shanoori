import React from 'react';
import Image from 'next/image';
import { CtaSigning } from './CtaSigning';
import { CurtainHold } from './CurtainHold';
import { fetchSharedContent } from '@/lib/sanity/fetch';

/**
 * "Ready to Elevate Your Space" banner shown above the footer on every page. It slides up over
 * the section before it, which CurtainHold keeps in place while it is being covered.
 */
export const CtaBanner = async () => {
  const { cta } = await fetchSharedContent();

  return (
    <section className="relative z-10 overflow-clip bg-ink">
      <CurtainHold />
      <Image src={cta.image} alt="" fill sizes="100vw" className="object-cover opacity-70" />
      <CtaSigning heading={cta.heading} text={cta.text} buttonLabel={cta.buttonLabel} />
    </section>
  );
};
