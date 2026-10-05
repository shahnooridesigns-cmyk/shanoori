import React from 'react';

/**
 * Columns that fill rows evenly for however many items the Studio holds:
 * 5 items with room for 4 become 3 + 2 rather than 4 + 1, 7 become 4 + 3.
 * Never fewer than 2, so one or two items don't stretch across the whole page.
 */
export const balancedColumns = (count: number, max: number) =>
  Math.max(2, count <= max ? count : Math.ceil(count / Math.ceil(count / max)));

// Item widths come from --cols / --gap so one static class list serves every count
const WIDE = '[&>*]:w-full sm:[&>*]:w-[calc((100%_-_var(--gap))_/_2_-_0.1px)] lg:[&>*]:w-[calc((100%_-_(var(--cols)_-_1)_*_var(--gap))_/_var(--cols)_-_0.1px)]';
const COMPACT = '[&>*]:w-full sm:[&>*]:w-[calc((100%_-_(var(--cols)_-_1)_*_var(--gap))_/_var(--cols)_-_0.1px)]';

/**
 * A row of equal cards that stays tidy as items are added or removed in Studio: rows are
 * balanced and a short last row is centred instead of left hanging.
 */
export const BalancedGrid = ({
  as: Tag = 'div',
  count,
  max = 4,
  gap = '1.5rem',
  compact = false,
  className = '',
  children,
}: {
  as?: 'div' | 'ul' | 'ol';
  count: number;
  /** Most cards per row on large screens */
  max?: number;
  gap?: string;
  /** Small cards: use the full column count from tablet width up instead of two per row */
  compact?: boolean;
  className?: string;
  children: React.ReactNode;
}) => (
  <Tag
    style={{ '--cols': balancedColumns(count, max), '--gap': gap } as React.CSSProperties}
    className={`flex flex-wrap justify-center gap-[var(--gap)] ${compact ? COMPACT : WIDE} ${className}`}
  >
    {children}
  </Tag>
);
