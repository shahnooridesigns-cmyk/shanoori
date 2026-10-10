import { defineField, defineType } from 'sanity';
import { imageRules } from '../lib/imageRules';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Web address (slug)',
      description: 'The end of this project\'s link, e.g. sncreatives.com/projects/le-bebe. Do not type here: press "Generate" and it is made from the title.',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) =>
        Rule.required().custom((slug) =>
          !slug?.current || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug.current)
            ? true
            : 'Use small letters, numbers and dashes only (no spaces). Press "Generate" to fix it.'
        ),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Interior', value: 'interior' },
          { title: 'Mechanical', value: 'mechanical' },
          { title: 'Electrical', value: 'electrical' },
          { title: 'Plumbing', value: 'plumbing' },
          { title: 'Civil', value: 'civil' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'spaceType',
      title: 'Type of space',
      type: 'string',
      description: 'What kind of place it is. Visitors use this to filter the Projects page.',
      options: {
        list: [
          { title: 'Retail', value: 'retail' },
          { title: 'Office', value: 'office' },
          { title: 'Exhibition', value: 'exhibition' },
          { title: 'Café & Restaurant', value: 'cafe' },
          { title: 'Hospitality', value: 'hospitality' },
          { title: 'Healthcare', value: 'healthcare' },
          { title: 'Residential', value: 'residential' },
        ],
      },
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'reference',
      to: [{ type: 'client' }],
      description: 'Select an existing client from the list, or create a new Client document first if they are not listed yet.',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Shown on project cards, e.g. "West Bay, Doha".',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Landscape photo (wider than tall), at least 1600 px wide. Best: 1920 × 1280 px. JPG, PNG or WebP.',
      options: {
        hotspot: true,
        accept: 'image/jpeg,image/png,image/webp',
      },
      validation: (Rule) => [
        Rule.required(),
        ...imageRules({ requireMinWidth: 400, preferShape: 'landscape', preferMinWidth: 1600 })(Rule),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      description: 'Any shape works here. Each photo should be at least 1200 px wide. JPG, PNG or WebP.',
      of: [
        {
          type: 'image',
          options: { hotspot: true, accept: 'image/jpeg,image/png,image/webp' },
          validation: imageRules({ requireMinWidth: 400, preferMinWidth: 1200 }),
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Display this project on the homepage?',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'spaceType',
      media: 'coverImage',
    },
  },
});
