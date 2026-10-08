/**
 * Works out whether what is painted at a point on the page is dark or light, for things that sit
 * on top of the page and must stay readable: the custom cursor and the glass menu bar.
 */

/**
 * Reads a computed background colour: null if it's (mostly) see-through, otherwise whether
 * it's dark. Tailwind v4 opacity colours (bg-ink/80) compute as oklab()/oklch().
 */
const readBackground = (color: string): boolean | null => {
  const nums = color.match(/-?[\d.]+%?/g)?.map((n) => (n.endsWith('%') ? parseFloat(n) / 100 : parseFloat(n)));
  if (!nums || nums.length < 3) return null;
  const alpha = nums[3] ?? 1;
  if (alpha <= 0.5) return null;
  if (color.startsWith('ok')) return nums[0] < 0.5; // lightness 0–1
  if (color.startsWith('lab') || color.startsWith('lch')) return nums[0] < 50; // lightness 0–100
  if (color.startsWith('color(')) return 0.2126 * nums[0] + 0.7152 * nums[1] + 0.0722 * nums[2] < 0.35; // channels 0–1
  return 0.2126 * nums[0] + 0.7152 * nums[1] + 0.0722 * nums[2] < 90;
};

/**
 * Tone of what an element itself paints: its background colour, or the first colour of a
 * background gradient (bg-brand-gradient sections, the menu overlay). Gradient *text*
 * (background-clip: text) paints no backdrop and is skipped. null = see-through.
 */
const paintedTone = (style: CSSStyleDeclaration): boolean | null => {
  const color = readBackground(style.backgroundColor);
  if (color !== null) return color;
  if (style.backgroundImage.includes('gradient') && !style.backgroundClip.includes('text')) {
    const first = style.backgroundImage.match(/(?:rgba?|oklab|oklch|lab|lch|color)\([^)]*\)/);
    if (first) return readBackground(first[0]);
  }
  return null;
};

/**
 * Whether the nearest painted background under the pointer is dark. A see-through fixed
 * layer (the header over the hero) is looked through to whatever is behind it at (x, y).
 * Not cached: backgrounds change with state (selected chips, the header after scrolling);
 * callers only re-check when the element under the pointer changes.
 * `seen` holds the fixed layers already looked through: two see-through layers stacked at the
 * same point (the header and the page-change shutters) must not send the search back and forth.
 */
export const isOnDark = (el: Element | null, x: number, y: number, seen: Element[] = []): boolean => {
  let node: Element | null = el;
  while (node) {
    const style = getComputedStyle(node);
    const tone = paintedTone(style);
    if (tone !== null) return tone;
    if (style.position === 'fixed') {
      const layer = node;
      const layers = [...seen, layer];
      // Only what lies under this layer: skip everything stacked above it, and other layers already tried
      const stack = document.elementsFromPoint(x, y);
      const from = stack.findIndex((e) => layer.contains(e));
      const behind = stack
        .slice(from + 1)
        .find((e) => !layers.some((tried) => tried.contains(e) || e.contains(tried)));
      return behind ? isOnDark(behind, x, y, layers) : false;
    }
    node = node.parentElement;
  }
  return false;
};
