import React from 'react';
import { Container } from './Container';
import { CurtainHold } from './CurtainHold';
import { SectionLabel } from './ui';
import { FaqAccordion } from './FaqAccordion';
import { fetchSharedContent } from '@/lib/sanity/fetch';

/** "Built on the Details." FAQ accordion shared by several pages. */
export const FaqSection = async () => {
  const { faq } = await fetchSharedContent();
  const faqs = faq.items.filter((item) => item.q && item.a);
  if (faqs.length === 0) return null;

  return (
  // Slides up over the section before it (CurtainHold), and is itself covered by the closing banner
  <section className="relative bg-white py-24 md:py-32">
    <CurtainHold />
    <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
      <div className="flex flex-col gap-6">
        <SectionLabel>FAQ</SectionLabel>
        <h2 className="whitespace-pre-line text-5xl md:text-6xl font-semibold leading-[1.05] text-ink">{faq.heading}</h2>
        <p className="text-reveal max-w-md text-lg text-ink/90">{faq.text}</p>
      </div>

      <FaqAccordion faqs={faqs} />
    </Container>
  </section>
  );
};
