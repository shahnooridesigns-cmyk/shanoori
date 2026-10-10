import { defineType, type FieldDefinition, type Rule } from 'sanity';
import { imageRules } from '../lib/imageRules';
import {
  SERVICE_ICONS,
  WHY_ICONS,
  aboutDefaults,
  contactDefaults,
  homeDefaults,
  projectsDefaults,
  servicesDefaults,
  sharedDefaults,
} from '../../src/lib/content/defaults';
import { aboutAr, contactAr, homeAr, projectsAr, servicesAr, sharedAr } from '../../src/lib/content/defaults.ar';
import { SHARED_KEY, localize } from '../../src/lib/content/localize';

/**
 * Editable page copy. Each document below is generated from the matching defaults object
 * in src/lib/content/defaults.ts: one tab per top-level key, one field per value, and the
 * form opens pre-filled with the current text. Add a key there and it appears here.
 * Each page is a singleton (one document whose _id is the type name; see ../structure.ts).
 */

type Json = string | readonly Json[] | { [key: string]: Json };

interface Hints {
  /** Field title by dotted path ("why.reasons") or by bare key ("eyebrow") */
  labels?: Record<string, string>;
  /** Help text under a field, by dotted path */
  notes?: Record<string, string>;
  /** Choices for fields named `icon` */
  icons?: readonly string[];
  /** Lists that must keep an exact number of items, by dotted path */
  fixed?: Record<string, number>;
  /** The shape each photo slot is designed for, by dotted path (default: landscape) */
  shapes?: Record<string, PhotoShape>;
}

type PhotoShape = 'landscape' | 'portrait' | 'square' | 'wide';

/** What to ask for in each kind of photo slot. Wrong shape or a small file only warns: the site crops to fit. */
const PHOTO_GUIDE: Record<PhotoShape, { note: string; shape: 'landscape' | 'portrait' | 'square'; minWidth: number }> = {
  wide: { note: 'Wide landscape photo, at least 2000 px wide. Best: 2400 × 1400 px.', shape: 'landscape', minWidth: 2000 },
  landscape: { note: 'Landscape photo (wider than tall), at least 1200 px wide. Best: 1600 × 1000 px.', shape: 'landscape', minWidth: 1200 },
  portrait: { note: 'Portrait photo (taller than wide), at least 800 px wide. Best: 1000 × 1400 px.', shape: 'portrait', minWidth: 800 },
  square: { note: 'Square photo, at least 800 × 800 px.', shape: 'square', minWidth: 800 },
};

const IMAGE_KEY = /^image\d*$/;

const COMMON_LABELS: Record<string, string> = {
  text: 'Text',
  q: 'Question',
  a: 'Answer',
  sub: 'Subtitle',
  cta: 'Link text',
  pill: 'Label on the photo',
  tag: 'Small label',
  eyebrow: 'Small label above the heading',
  image: 'Photo',
  image1: 'Photo 1',
  image2: 'Photo 2',
  items: 'Items',
};

const humanize = (key: string) =>
  key.replace(/([a-z])([A-Z0-9])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

const isObject = (value: Json): value is { [key: string]: Json } =>
  typeof value === 'object' && !Array.isArray(value);

const itemType = (key: string) => `${key}Item`;

const buildField = (key: string, value: Json, path: string, hints: Hints): FieldDefinition => {
  const title = hints.labels?.[path] ?? hints.labels?.[key] ?? COMMON_LABELS[key] ?? humanize(key);
  const base = { name: key, title, description: hints.notes?.[path] };

  if (IMAGE_KEY.test(key)) {
    const guide = PHOTO_GUIDE[hints.shapes?.[path] ?? 'landscape'];
    return {
      ...base,
      type: 'image',
      options: { hotspot: true, accept: 'image/jpeg,image/png,image/webp' },
      description: base.description ?? `${guide.note} Leave empty to keep the current photo.`,
      validation: imageRules({ requireMinWidth: 400, preferShape: guide.shape, preferMinWidth: guide.minWidth }),
    } as FieldDefinition;
  }

  if (typeof value === 'string') {
    if (key === 'icon' && hints.icons) {
      return {
        ...base,
        type: 'string',
        options: { list: hints.icons.map((icon) => ({ title: humanize(icon), value: icon })) },
      } as FieldDefinition;
    }
    const lineBreaks = value.includes('\n');
    if (lineBreaks || value.length > 70) {
      const heading = lineBreaks && value.length <= 70;
      return {
        ...base,
        type: 'text',
        rows: heading ? 2 : 4,
        description:
          base.description ??
          (heading ? 'Press Enter where the line should break.' : lineBreaks ? 'Leave an empty line between paragraphs.' : undefined),
      } as FieldDefinition;
    }
    return { ...base, type: 'string' } as FieldDefinition;
  }

  if (Array.isArray(value)) {
    const first = value[0] as Json | undefined;
    const exact = hints.fixed?.[path];
    const validation = exact
      ? (rule: Rule) => rule.length(exact).error(`This section needs exactly ${exact} items.`)
      : undefined;
    if (first === undefined || !isObject(first)) {
      return { ...base, type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' }, validation } as FieldDefinition;
    }
    const keys = Object.keys(first);
    const titleKey = ['title', 'q', 'place', 'value'].find((k) => keys.includes(k)) ?? keys[0];
    const subtitleKey = ['text', 'a', 'label', 'time'].find((k) => keys.includes(k) && k !== titleKey);
    return {
      ...base,
      type: 'array',
      validation,
      of: [
        {
          type: 'object',
          name: itemType(key),
          title: 'Item',
          fields: Object.entries(first).map(([k, v]) => buildField(k, v, `${path}.${k}`, hints)),
          preview: { select: { title: titleKey, ...(subtitleKey ? { subtitle: subtitleKey } : {}) } },
        },
      ],
    } as FieldDefinition;
  }

  return {
    ...base,
    type: 'object',
    fields: Object.entries(value as { [key: string]: Json }).map(([k, v]) => buildField(k, v, `${path}.${k}`, hints)),
  } as FieldDefinition;
};

/** The defaults as a Studio document. Photos are left out: the built-in ones stay until one is uploaded. */
const initialValue = (value: Json, key = ''): unknown => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return (value as readonly Json[]).map((item, i) =>
      isObject(item) ? { _type: itemType(key), _key: `${key}${i}`, ...(initialValue(item) as object) } : item
    );
  }
  return Object.fromEntries(
    Object.entries(value as { [key: string]: Json })
      .filter(([k]) => !IMAGE_KEY.test(k))
      .map(([k, v]) => [k, initialValue(v, k)])
  );
};

const page = (name: string, title: string, defaults: { [key: string]: Json }, hints: Hints = {}) =>
  defineType({
    name,
    title,
    type: 'document',
    groups: Object.keys(defaults).map((key, i) => ({
      name: key,
      title: hints.labels?.[key] ?? humanize(key),
      default: i === 0,
    })),
    fields: Object.entries(defaults).map(([key, value]) => ({ ...buildField(key, value, key, hints), group: key })),
    initialValue: initialValue(defaults) as Record<string, unknown>,
    preview: { prepare: () => ({ title }) },
  });

const divisionNotes = (key: string) => ({
  [`${key}.summary`]: 'Shown on the Home page service card.',
  [`${key}.tags`]: 'Small tags on the Home page service card.',
  [`${key}.tagline`]: 'Shown on the About page service card.',
  [`${key}.description`]: 'Shown on the About page service card.',
  [`${key}.highlights`]: 'Tick list on the About page service card.',
});

/** The wording of a page with photos and icons left out: what the Arabic form holds */
const textOnly = (value: Json): Json => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return (value as readonly Json[]).map(textOnly);
  return Object.fromEntries(
    Object.entries(value as { [key: string]: Json })
      .filter(([key]) => !SHARED_KEY.test(key))
      .map(([key, v]) => [key, textOnly(v)])
  );
};

/**
 * The Arabic twin of a page form: same tabs and fields, text only, opening pre-filled with the
 * Arabic wording the site already uses (src/lib/content/defaults.ar.ts). Its document id is the
 * page's name plus "Ar". Photos and icons are edited once, on the English form, for both languages.
 */
const arabicPage = (name: string, title: string, defaults: { [key: string]: Json }, arabic: unknown, hints: Hints = {}) =>
  page(`${name}Ar`, `${title} (Arabic)`, localize(textOnly(defaults), arabic) as { [key: string]: Json }, hints);

const englishPages = [
  page('homePage', 'Home Page', homeDefaults, {
    icons: WHY_ICONS,
    shapes: { 'hero.image': 'wide' },
    fixed: { 'process.steps': 4 },
    labels: {
      hero: 'Hero',
      about: 'About intro',
      work: 'Selected work',
      why: 'Why choose us',
      services: 'Services',
      process: 'How we work',
      testimonials: 'Testimonials',
      'hero.title': 'Big title',
      'about.stats': 'Numbers',
    },
    notes: {
      'hero.title': 'The very large word across the bottom of the hero.',
      'about.stats.value': 'e.g. 100+ or 98%. The number counts up on the page.',
      'process.steps': 'The scrolling animation is built for exactly 4 steps.',
      'work.heading': 'The projects shown here are the ones marked "Featured".',
      'testimonials.heading': 'The reviews shown here are the ones marked "Featured".',
      'services.heading': 'The three service cards are edited under Shared Content.',
    },
  }),
  page('aboutPage', 'About Page', aboutDefaults, {
    shapes: { 'hero.image': 'wide', 'story.image1': 'portrait', 'story.image2': 'square' },
    labels: {
      hero: 'Hero',
      story: 'Our story',
      approach: 'Our approach',
      stats: 'Numbers',
      mission: 'Mission',
      vision: 'Vision',
      services: 'Services',
      'stats.items': 'Numbers',
    },
    notes: {
      'stats.items.value': 'e.g. 15+ or 100+. The number counts up on the page.',
      'services.heading': 'The three service cards are edited under Shared Content.',
    },
  }),
  page('servicesPage', 'Services Page', servicesDefaults, {
    icons: SERVICE_ICONS,
    shapes: { 'hero.image': 'wide' },
    labels: {
      hero: 'Hero',
      civil: 'Civil',
      interior: 'Interior & Fit-Out',
      mep: 'MEP',
      handover: 'Single-point responsibility',
      features: 'Photo cards',
      linkLabel: 'Link text',
      listHeading: 'Heading above the list',
    },
  }),
  page('projectsPage', 'Projects Page', projectsDefaults, {
    labels: { hero: 'Hero', list: 'Project list' },
    notes: { 'hero.heading': 'The numbers beside this text are counted from your projects automatically.' },
  }),
  page('contactPage', 'Contact Page', contactDefaults, {
    labels: {
      hero: 'Hero',
      form: 'Enquiry form',
      location: 'Location',
      whatsapp: 'WhatsApp card',
      'hero.highlight': 'Heading (gold part)',
      'hero.lead': 'Bold line',
      'location.officeLabel': 'Office label',
      'location.officeNote': 'Office note',
    },
    notes: {
      'location.heading': 'The address from Site Settings is added after this automatically.',
      'location.travelTimes.time': 'e.g. 20 Mins',
    },
  }),
  page('sharedContent', 'Shared Content', sharedDefaults, {
    shapes: { 'cta.image': 'wide' },
    labels: {
      faq: 'FAQ',
      cta: 'Bottom banner',
      clients: 'Client logos',
      civil: 'Service: Civil',
      interior: 'Service: Interior',
      mep: 'Service: MEP',
      'faq.items': 'Questions',
    },
    notes: {
      'faq.items': 'Shown on the Home, About, Services and Contact pages.',
      'cta.heading': 'The banner above the footer on every page.',
      'clients.heading': 'The logos come from your Clients list.',
      'clients.note': 'The small line under the logos, e.g. 100+ Clients.',
      ...divisionNotes('civil'),
      ...divisionNotes('interior'),
      ...divisionNotes('mep'),
    },
  }),
];

/** Field names and help text are shared with the English forms; only the wording differs */
const ARABIC_NOTE = { labels: { hero: 'Hero' } };
const arabicPages = [
  arabicPage('homePage', 'Home Page', homeDefaults, homeAr, { ...ARABIC_NOTE, fixed: { 'process.steps': 4 } }),
  arabicPage('aboutPage', 'About Page', aboutDefaults, aboutAr, ARABIC_NOTE),
  arabicPage('servicesPage', 'Services Page', servicesDefaults, servicesAr, ARABIC_NOTE),
  arabicPage('projectsPage', 'Projects Page', projectsDefaults, projectsAr, ARABIC_NOTE),
  arabicPage('contactPage', 'Contact Page', contactDefaults, contactAr, ARABIC_NOTE),
  arabicPage('sharedContent', 'Shared Content', sharedDefaults, sharedAr, { labels: { faq: 'FAQ', cta: 'Bottom banner', clients: 'Client logos' } }),
];

export const pageTypes = [...englishPages, ...arabicPages];

export const PAGE_TYPE_NAMES = pageTypes.map((type) => type.name);
