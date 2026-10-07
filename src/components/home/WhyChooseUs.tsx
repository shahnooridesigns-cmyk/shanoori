import React from 'react';
import { Container } from '../shared/Container';
import { BalancedGrid } from '../shared/BalancedGrid';
import { fetchHomeContent } from '@/lib/sanity/fetch';

const iconProps = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, className: 'h-5 w-5', 'aria-hidden': true } as const;

/** Icon choices offered in Studio (WHY_ICONS in lib/content/defaults.ts) */
const icons: Record<string, React.ReactNode> = {
  blocks: (
    <svg {...iconProps}><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /><rect x="15" y="3" width="6" height="6" rx="1" /><path d="M9 6h6M18 9v6" /></svg>
  ),
  wrench: (
    <svg {...iconProps}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" /></svg>
  ),
  award: (
    <svg {...iconProps}><circle cx="12" cy="9" r="6" /><path d="m9 14.5-1.5 7L12 19l4.5 2.5-1.5-7" /><path d="m12 6 .9 1.9 2.1.3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1-1.5-1.4 2.1-.3z" /></svg>
  ),
  infinity: (
    <svg {...iconProps}><path d="M12 12c-2-2.5-3.5-4-6-4a4 4 0 0 0 0 8c2.5 0 4-1.5 6-4zm0 0c2 2.5 3.5 4 6 4a4 4 0 0 0 0-8c-2.5 0-4 1.5-6 4z" /></svg>
  ),
};

export const WhyChooseUs = async () => {
  const { why } = await fetchHomeContent();

  return (
  <section className="bg-beige pb-24 md:pb-32">
    <Container>
      <h2 className="text-brand-gradient w-fit text-4xl md:text-5xl font-semibold">{why.heading}</h2>
      <p className="text-reveal mt-8 max-w-md text-lg leading-relaxed text-ink/70">{why.text}</p>

      <BalancedGrid count={why.reasons.length} className="mt-14">
        {why.reasons.map((reason, i) => (
          <article
            key={i}
            className="card-reveal card-lift flex flex-col rounded-[28px] bg-gradient-to-b from-[#E9DBA4] to-[#FDF8A6] p-8 shadow-[0_18px_30px_-12px_rgba(90,70,20,0.45)]"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-cream text-maroon shadow-sm">{icons[reason.icon] ?? icons.blocks}</span>
            <h3 className="mt-6 text-xl font-semibold leading-tight text-maroon">{reason.title}</h3>
            <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink/75">{reason.text}</p>
            <p className="mt-6 flex items-center gap-2 border-t border-[#C9B274] pt-5 text-xs font-bold uppercase tracking-wider text-maroon">
              {reason.tag}
              <span aria-hidden="true">›</span>
            </p>
          </article>
        ))}
      </BalancedGrid>
    </Container>
  </section>
  );
};
