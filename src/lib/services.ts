import type { SharedContent } from './content/defaults';

/** The three service divisions, shared by the Home, About and Services pages. */
export interface Division {
  id: 'civil' | 'interior' | 'mep';
  number: string;
  title: string;
  /** Home "What we deliver" list */
  summary: string;
  tags: string[];
  image: string;
  /** About "Complete Solutions Under One Roof" cards */
  pill: string;
  tagline: string;
  description: string;
  highlights: string[];
  cta: string;
}

const ids = ['interior', 'mep', 'civil'] as const;

/** The divisions' copy is edited under Shared Content in Studio; their order and anchors are fixed. */
export const toDivisions = (shared: SharedContent): Division[] =>
  ids.map((id, i) => ({ id, number: String(i + 1).padStart(2, '0'), ...shared[id] }));
