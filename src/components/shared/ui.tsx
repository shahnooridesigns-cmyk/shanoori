import React from 'react';
import Link from 'next/link';

/** "◆ About Us" style eyebrow label used at the top of most sections: a small diamond that turns over now and then. */
export const SectionLabel = ({
  children,
  tone = 'maroon',
  className = '',
}: {
  children: React.ReactNode;
  tone?: 'maroon' | 'gold' | 'ink';
  className?: string;
}) => {
  const dot = { maroon: 'bg-maroon', gold: 'bg-gold', ink: 'bg-ink' }[tone];
  const text = { maroon: 'text-ink/80', gold: 'text-gold', ink: 'text-ink/80' }[tone];
  return (
    <p className={`label-reveal flex h-fit items-center gap-2 self-start text-sm md:text-base ${text} ${className}`}>
      <span className={`label-mark ${dot}`} aria-hidden="true" />
      {children}
    </p>
  );
};

const ArrowUpRight = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * "Start a Project ↗" as a pill button. It takes its colour from the text colour it is given
 * (gold or white on dark sections, maroon on light ones); the styling is .btn-pill in globals.css.
 */
export const ArrowLink = ({
  href,
  children,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Link
    href={href}
    className={`btn-pill group ${className}`}
  >
    <span className="btn-pill-label">{children}</span>
    <span className="btn-pill-arrow">
      <ArrowUpRight className="h-4 w-4" />
    </span>
  </Link>
);

export { ArrowUpRight };
