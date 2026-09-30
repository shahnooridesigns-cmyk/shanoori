import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from '../shared/ui';

/** Division heading: eyebrow, two-tone uppercase title, intro and "Explore …" link. */
export const DivisionHeader = ({
  eyebrow,
  title,
  intro,
  linkLabel,
  href,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  linkLabel: string;
  href: string;
}) => (
  <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/70">{eyebrow}</p>
      <h2 className="text-brand-gradient mt-2 w-fit text-3xl md:text-[40px] font-bold uppercase leading-tight">{title}</h2>
      <p className="mt-3 text-lg leading-relaxed text-ink/75">{intro}</p>
    </div>
    <Link
      href={href}
      className="group flex w-fit shrink-0 items-center gap-3 border-b-2 border-maroon pb-1 text-lg font-semibold text-maroon hover:opacity-80"
    >
      {linkLabel}
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  </div>
);

export interface FeatureCardData {
  image: string;
  pill: string;
  title: string;
  text: string;
}

/** Photo card with the maroon fade and caption at the bottom. */
export const FeatureCard = ({ card, sizes, className = '' }: { card: FeatureCardData; sizes: string; className?: string }) => (
  <article className={`card-reveal card-lift group relative min-h-[380px] overflow-hidden rounded-[28px] shadow-[0_16px_32px_-12px_rgba(0,0,0,0.4)] ${className}`}>
    <Image src={card.image} alt={card.title} fill sizes={sizes} className="object-cover transition-transform duration-700 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-maroon via-maroon/35 to-transparent" aria-hidden="true" />
    <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-6">
      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold backdrop-blur-sm">
        {card.pill}
      </span>
      <h3 className="text-xl font-semibold text-white">{card.title}</h3>
      <p className="max-w-lg text-sm text-white/85">{card.text}</p>
    </div>
  </article>
);

/** Small cream card with an icon, used for competencies. */
export const MiniCard = ({ icon, title, text, tag }: { icon: React.ReactNode; title: string; text: string; tag: string }) => (
  <article className="card-reveal card-lift rounded-2xl bg-gradient-to-br from-white to-cream p-4 shadow-[0_10px_24px_-10px_rgba(90,70,20,0.35)]">
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream text-maroon">{icon}</span>
    <h4 className="mt-3 font-semibold text-maroon">{title}</h4>
    <p className="mt-1 text-sm text-ink">{text}</p>
    <p className="mt-1 text-xs text-maroon/80">{tag}</p>
  </article>
);

/** White card with a list of chips (fit-out specialties). */
export const ChipCard = ({ icon, title, text, chips }: { icon: React.ReactNode; title: string; text: string; chips: string[] }) => (
  <article className="card-reveal card-lift rounded-[24px] bg-white p-6 shadow-[0_10px_24px_-12px_rgba(90,70,20,0.35)]">
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-maroon">{icon}</span>
    <h4 className="mt-4 text-lg text-ink">{title}</h4>
    <p className="mt-1 text-sm text-ink/70">{text}</p>
    <ul className="mt-4 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <li key={chip} className="rounded-md bg-cream px-2.5 py-1 text-xs text-ink/80">{chip}</li>
      ))}
    </ul>
  </article>
);

const iconProps = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, className: 'h-4 w-4', 'aria-hidden': true } as const;

export const Icons = {
  terrain: <svg {...iconProps}><path d="m3 19 6-8 4 5 3-4 5 7z" /></svg>,
  batch: <svg {...iconProps}><rect x="3" y="6" width="18" height="12" rx="1" /><path d="M3 11h18M9 11v7" /></svg>,
  building: <svg {...iconProps}><path d="M4 21V5l8-2v18M12 9h8v12M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2" /></svg>,
  shield: <svg {...iconProps}><path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z" /><path d="M12 9v4" /></svg>,
  grid: <svg {...iconProps}><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></svg>,
  roller: <svg {...iconProps}><rect x="5" y="3" width="14" height="6" rx="1" /><path d="M19 6h2v5h-9v3M11 14h2v7h-2z" /></svg>,
  compass: <svg {...iconProps}><circle cx="12" cy="5" r="2" /><path d="m11 7-5 14M13 7l5 14M8 15h8" /></svg>,
  cone: <svg {...iconProps}><path d="M12 3 5 21h14zM8.5 13h7M7 17h10" /></svg>,
  store: <svg {...iconProps}><path d="M4 9h16l-1-5H5zM5 9v11h14V9M9 20v-6h6v6" /></svg>,
  layout: <svg {...iconProps}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 10h18M10 10v11" /></svg>,
  stripes: <svg {...iconProps}><path d="M4 14 14 4M4 20 20 4M10 20 20 10" /></svg>,
  pen: <svg {...iconProps}><path d="m14 4 6 6-10 10H4v-6zM12 6l6 6" /></svg>,
};
