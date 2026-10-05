import { defineField, defineType } from 'sanity';
import { imageRules } from '../lib/imageRules';

export default defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'PNG file, square (same width and height), at least 400 × 400 px. Best: 800 × 800 px with the logo centred and some empty space around it.',
      options: {
        // The file picker only offers PNG files; the rules below catch anything dragged in
        accept: 'image/png',
      },
      validation: (Rule) => [
        Rule.required(),
        ...imageRules({ formats: ['png'], requireShape: 'square', requireMinSide: 400 })(Rule),
      ],
    }),
  ],
});
