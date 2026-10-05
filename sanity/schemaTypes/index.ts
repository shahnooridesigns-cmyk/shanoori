import { type SchemaTypeDefinition } from 'sanity';

import project from './project';
import client from './client';
import siteSettings from './siteSettings';
import review from './review';
import { pageTypes } from './pages';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, client, siteSettings, review, ...pageTypes],
};
