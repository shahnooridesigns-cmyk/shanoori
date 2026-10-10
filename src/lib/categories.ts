import type { Category } from './sanity/types';
import { tr, type UiKey } from './content/ui';
import type { Locale } from './locale';

export const categories: { label: string; value: Category }[] = [
  { label: 'Interior', value: 'interior' },
  { label: 'Mechanical', value: 'mechanical' },
  { label: 'Electrical', value: 'electrical' },
  { label: 'Plumbing', value: 'plumbing' },
  { label: 'Civil', value: 'civil' },
];

/** The three services the company sells, and which disciplines each one covers */
export const services: { label: string; value: string; categories: Category[] }[] = [
  { label: 'Interior & Fit-out', value: 'interior', categories: ['interior'] },
  { label: 'MEP', value: 'mep', categories: ['mechanical', 'electrical', 'plumbing'] },
  { label: 'Civil', value: 'civil', categories: ['civil'] },
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
export const projectKind = (p: { spaceType?: string | null; category?: string }, locale: Locale = 'en') => {
  if (spaceTypes.some((t) => t.value === p.spaceType)) return tr(locale, `space.${p.spaceType}` as UiKey);
  return categories.some((c) => c.value === p.category) ? tr(locale, `category.${p.category}` as UiKey) : (p.category ?? '');
};

export const spaceTypeLabel = (value: string, locale: Locale) => tr(locale, `space.${value}` as UiKey);
export const serviceLabel = (value: string, locale: Locale) => tr(locale, `service.${value}` as UiKey);

export const categoryLabel = (value?: string) => categories.find((c) => c.value === value)?.label ?? value ?? '';
