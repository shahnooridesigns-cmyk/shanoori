/** Every field optional, at every depth: the shape of a translation file */
export type DeepPartial<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? DeepPartial<U>[]
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

/** Fields that are not wording: photos and icon names are shared by both languages */
export const SHARED_KEY = /^(image\d*|icon)$/;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Lays a translation over resolved content. Text is replaced; anything the translation does not
 * mention (photos, icons, numbers) is kept. Lists are matched item by item, but only while the
 * list still has the length the translation was written for: if items were added or removed in
 * the Studio, that list is left in its original language rather than paired up wrongly.
 */
export const localize = <T>(content: T, translation: unknown): T => {
  if (translation === undefined || translation === null) return content;
  if (typeof content === 'string') return (typeof translation === 'string' && translation ? translation : content) as T;
  if (Array.isArray(content)) {
    if (!Array.isArray(translation) || translation.length === 0) return content;
    if (translation.length === content.length) return content.map((item, i) => localize(item, translation[i])) as T;
    // Different length. A list of plain text (tags, questions and answers) can simply be the
    // translated list. A list whose items carry a photo or an icon cannot: those belong to the
    // original items, so it stays as it is until both lists have the same number of items.
    const sample = content[0];
    if (typeof sample === 'string') return translation.filter((item) => typeof item === 'string' && item.trim()) as T;
    if (!isPlainObject(sample) || Object.keys(sample).some((key) => SHARED_KEY.test(key))) return content;
    return translation
      .filter(isPlainObject)
      .map((item) => Object.fromEntries(Object.keys(sample).map((key) => [key, typeof item[key] === 'string' ? item[key] : '']))) as T;
  }
  if (isPlainObject(content) && isPlainObject(translation)) {
    return Object.fromEntries(Object.entries(content).map(([key, value]) => [key, localize(value, translation[key])])) as T;
  }
  return content;
};
