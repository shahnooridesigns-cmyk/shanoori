import type { Category } from './sanity/types';

export const categories: { label: string; value: Category }[] = [
  { label: 'Interior', value: 'interior' },
  { label: 'Mechanical', value: 'mechanical' },
  { label: 'Electrical', value: 'electrical' },
  { label: 'Plumbing', value: 'plumbing' },
  { label: 'Civil', value: 'civil' },
];

export const categoryLabel = (value?: string) => categories.find((c) => c.value === value)?.label ?? value ?? '';
