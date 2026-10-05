import React from 'react';
import Link from 'next/link';

/** "● About Us" style eyebrow label used at the top of most sections. */
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
    <p className={`flex h-fit items-center gap-2 self-start text-sm md:text-base ${text} ${className}`}>
      <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
      {children}
    </p>
  );
};

const ArrowUpRight = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Underlined "Start a Project ↗" text link from the designs. */
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
    className={`tap-area group inline-flex items-center gap-2 border-b border-current pb-0.5 text-lg transition-opacity hover:opacity-80 ${className}`}
  >
    {children}
    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
  </Link>
);

export { ArrowUpRight };
