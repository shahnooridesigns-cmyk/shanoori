import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schema } from './sanity/schemaTypes';

export default defineConfig({
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ewurok0d',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  title: 'Shah Noori Studio',

  plugins: [structureTool()],

  schema: {
    types: schema.types,
  },
});
