import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'phoneNumbers',
      title: 'Phone Numbers',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'Include country code, digits only, e.g., 97433494880',
      validation: (Rule) =>
        Rule.regex(/^\+?[\d\s-]{8,20}$/, { name: 'phone number' }).warning('Use digits with country code, e.g. 97433494880'),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'address',
      title: 'Physical Address',
      type: 'text',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      description: 'Shown in the footer. Leave blank to hide.',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
      description: 'Shown in the footer. Leave blank to hide.',
    }),
    defineField({
      name: 'serviceContacts',
      title: 'Service-Specific WhatsApp Numbers (Optional)',
      description: 'Leave blank to use the main WhatsApp number above for that service. Only fill in if a specific service should route to a different number.',
      type: 'object',
      fields: [
        defineField({ name: 'civil', title: 'Civil Construction WhatsApp', type: 'string' }),
        defineField({ name: 'interior', title: 'Interior & Fit-out WhatsApp', type: 'string' }),
        defineField({ name: 'mechanical', title: 'Mechanical Works WhatsApp', type: 'string' }),
        defineField({ name: 'electrical', title: 'Electrical Works WhatsApp', type: 'string' }),
        defineField({ name: 'plumbing', title: 'Plumbing Works WhatsApp', type: 'string' }),
      ],
    }),
  ],
});
