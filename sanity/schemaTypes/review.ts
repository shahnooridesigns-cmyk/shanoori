import { defineField, defineType } from 'sanity';
import { imageRules } from '../lib/imageRules';

export default defineType({
  name: 'review',
  title: 'Review / Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'client',
      title: 'Client',
      type: 'reference',
      to: [{ type: 'client' }],
      description:
        'Pick the client from the list. Their name and logo are used automatically. If they are not listed yet, create the Client first.',
    }),
    defineField({
      name: 'clientName',
      title: 'Person Name',
      type: 'string',
      description: 'Optional: the person who gave the review, e.g. "Ahmed Khan". Leave empty to show just the client.',
      // Reviews written before the Client dropdown existed only have this name
      validation: (Rule) =>
        Rule.custom((value, context) =>
          value || context.document?.client ? true : 'Pick a client above, or type a name here.'
        ),
    }),
    defineField({
      name: 'clientCompany',
      title: 'Client Company',
      type: 'string',
      description: 'Only needed when no client is picked above.',
      hidden: ({ document }) => Boolean(document?.client),
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
      title: 'Person Photo',
      type: 'image',
      description: "Optional. If empty, the client's logo is shown. Square photo of the person, at least 200 × 200 px.",
      options: {
        hotspot: true,
        accept: 'image/jpeg,image/png,image/webp',
      },
      validation: imageRules({ preferShape: 'square', preferMinWidth: 200 }),
    }),
    defineField({
      name: 'relatedProject',
      title: 'Related Project',
      type: 'reference',
      to: [{ type: 'project' }],
      description: 'The project this review is about. The review is shown on that project page.',
      // With a client picked, only list that client's projects
      options: {
        filter: ({ document }) => {
          const clientId = (document?.client as { _ref?: string } | undefined)?._ref;
          return clientId ? { filter: 'client._ref == $clientId', params: { clientId } } : {};
        },
      },
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
      personName: 'clientName',
      clientName: 'client.name',
      subtitle: 'reviewText',
      photo: 'clientPhoto',
      logo: 'client.logo',
    },
    prepare({ personName, clientName, subtitle, photo, logo }) {
      return {
        title: [personName, clientName].filter(Boolean).join(' · '),
        subtitle: subtitle ? (subtitle.length > 50 ? subtitle.substring(0, 50) + '...' : subtitle) : '',
        media: photo ?? logo,
      };
    },
  },
});
