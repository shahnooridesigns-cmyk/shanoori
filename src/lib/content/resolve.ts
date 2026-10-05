import { createImageUrlBuilder } from '@sanity/image-url';
import { dataset, projectId } from '../sanity/client';

const builder = createImageUrlBuilder({ projectId, dataset });

type SanityImage = { _type: 'image'; asset?: { _ref?: string } };

const isImage = (value: unknown): value is SanityImage =>
  typeof value === 'object' && value !== null && (value as { _type?: unknown })._type === 'image';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Uploaded photo → CDN URL (respects the crop/hotspot set in Studio), capped at a sensible size. */
const imageUrl = (image: SanityImage) =>
  image.asset?._ref ? builder.image(image).width(2400).fit('max').auto('format').url() : undefined;

/** Same shape as `value` with every leaf emptied: the template for list items added in Studio. */
const blank = (value: unknown): unknown => {
  if (Array.isArray(value)) return [];
  if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, blank(v)]));
  return '';
};

/**
 * Lays the Sanity document over the built-in defaults: anything left empty in Studio keeps
 * its default, uploaded photos become URLs, and the result always has the defaults' shape.
 * A list edited in Studio replaces the default list whole (so items can be removed), with
 * each item's missing fields left blank rather than borrowed from another item.
 */
export const resolveContent = <T>(defaults: T, data: unknown): T => {
  if (data === null || data === undefined || data === '') return defaults;
  if (typeof defaults === 'string') {
    if (isImage(data)) return (imageUrl(data) ?? defaults) as T;
    return (typeof data === 'string' ? data : defaults) as T;
  }
  if (Array.isArray(defaults)) {
    if (!Array.isArray(data) || data.length === 0) return defaults;
    const template = defaults[0];
    return (isPlainObject(template) ? data.map((item) => resolveContent(blank(template), item)) : data.filter((item) => typeof item === 'string' && item.trim())) as T;
  }
  if (isPlainObject(defaults)) {
    const source = isPlainObject(data) ? data : {};
    return Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, resolveContent(value, source[key])])) as T;
  }
  return defaults;
};

/** Splits editor text into paragraphs on blank lines. */
export const paragraphs = (text: string) => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
