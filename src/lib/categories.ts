import type { Category } from './sanity/types';

export const categories: { label: string; value: Category }[] = [
  { label: 'Interior', value: 'interior' },
  { label: 'Mechanical', value: 'mechanical' },
  { label: 'Electrical', value: 'electrical' },
  { label: 'Plumbing', value: 'plumbing' },
  { label: 'Civil', value: 'civil' },
];

/** Kinds of place a project can be, in the order the filter shows them. Keep in step with the Studio list (sanity/schemaTypes/project.ts). */
export const spaceTypes: { label: string; value: string }[] = [
  { label: 'Retail', value: 'retail' },
  { label: 'Office', value: 'office' },
  { label: 'Exhibition', value: 'exhibition' },
  { label: 'Café & Restaurant', value: 'cafe' },
  { label: 'Hospitality', value: 'hospitality' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Residential', value: 'residential' },
];

/** The word shown on a project for what it is: its kind of place when set, else its discipline */
export const projectKind = (p: { spaceType?: string | null; category?: string }) =>
  spaceTypes.find((t) => t.value === p.spaceType)?.label ?? categoryLabel(p.category);

export const categoryLabel = (value?: string) => categories.find((c) => c.value === value)?.label ?? value ?? '';
