import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'review',
  title: 'Review / Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientCompany',
      title: 'Client Company',
      type: 'string',
      description: 'Company name if different from client name.',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Rating from 1 to 5',
      validation: (Rule) => Rule.min(1).max(5),
      options: {
        list: [1, 2, 3, 4, 5],
      }
    }),
    defineField({
      name: 'reviewText',
      title: 'Review Text',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientPhoto',
      title: 'Client Photo / Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'relatedProject',
      title: 'Related Project',
      type: 'reference',
      to: [{ type: 'project' }],
      description: 'Optional reference to a specific project.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Display this review on the homepage?',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'clientName',
      subtitle: 'reviewText',
      media: 'clientPhoto',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? (subtitle.length > 50 ? subtitle.substring(0, 50) + '...' : subtitle) : '',
        media,
      };
    },
  },
});
