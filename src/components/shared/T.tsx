"use client";

import type { UiKey } from '@/lib/content/ui';
import { useT } from './LocaleProvider';

/** One label from lib/content/ui.ts in the page's language: <T k="label.about" /> */
export const T = ({ k }: { k: UiKey }) => useT()(k);
