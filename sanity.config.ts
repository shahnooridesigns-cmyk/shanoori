import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schema } from './sanity/schemaTypes';
import { PAGE_TYPE_NAMES } from './sanity/schemaTypes/pages';
import { structure } from './sanity/structure';

export default defineConfig({
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ewurok0d',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  title: 'Shah Noori Studio',

  plugins: [structureTool({ structure })],

  schema: {
    types: schema.types,
  },

  // Page documents are singletons: opened from the sidebar, never created, copied or deleted
  document: {
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global' ? prev.filter((option) => !PAGE_TYPE_NAMES.includes(option.templateId)) : prev,
    actions: (prev, { schemaType }) =>
      PAGE_TYPE_NAMES.includes(schemaType)
        ? prev.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : prev,
  },
});
