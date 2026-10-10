"use client";

import { projectKind } from '@/lib/categories';
import { useLocale } from '../shared/LocaleProvider';

/** What a project is ("Retail", "Exhibition"…) in the page's language */
export const ProjectKind = ({ project }: { project: { spaceType?: string | null; category?: string } }) => projectKind(project, useLocale());
