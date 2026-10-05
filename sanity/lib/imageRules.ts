import type { CustomValidator, CustomValidatorResult } from 'sanity';

/**
 * Upload rules for image fields: what shape, size and file type each slot needs.
 * Hard requirements block publishing; recommendations only show a warning.
 *
 * A Sanity image asset id carries everything needed, so no lookup is required:
 * "image-<hash>-<width>x<height>-<format>".
 */

interface ImageInfo {
  width: number;
  height: number;
  format: string;
}

export const readImageInfo = (ref?: string): ImageInfo | null => {
  const match = ref?.match(/^image-[a-zA-Z0-9]+-(\d+)x(\d+)-([a-z0-9]+)$/);
  return match ? { width: Number(match[1]), height: Number(match[2]), format: match[3] } : null;
};

type Shape = 'square' | 'landscape' | 'portrait';

interface ImageRequirements {
  /** File types allowed, e.g. ['png']. Anything else blocks publishing. */
  formats?: string[];
  /** Shape that blocks publishing when wrong */
  requireShape?: Shape;
  /** Shape that only warns when wrong */
  preferShape?: Shape;
  /** Shortest side below this blocks publishing (for square images such as logos) */
  requireMinSide?: number;
  /** Width below this blocks publishing: too small to show anywhere without looking broken */
  requireMinWidth?: number;
  /** Width below this only warns */
  preferMinWidth?: number;
}

/** How far from 1:1 still counts as square (a 500 × 510 logo is fine). */
const SQUARE_TOLERANCE = 0.03;

const shapeProblem = ({ width, height }: ImageInfo, shape: Shape): string | null => {
  const ratio = width / height;
  const size = `${width} × ${height} px`;
  if (shape === 'square' && Math.abs(ratio - 1) > SQUARE_TOLERANCE) {
    return `This image is ${size}. It needs to be square (same width and height), e.g. 800 × 800 px.`;
  }
  if (shape === 'landscape' && ratio < 1.1) {
    return `This image is ${size}. A landscape photo (wider than it is tall) fits this spot, e.g. 1920 × 1280 px.`;
  }
  if (shape === 'portrait' && ratio > 0.9) {
    return `This image is ${size}. A portrait photo (taller than it is wide) fits this spot, e.g. 1000 × 1400 px.`;
  }
  return null;
};

type ImageValue = { asset?: { _ref?: string } } | undefined;

const check =
  (problem: (info: ImageInfo) => string | null) =>
  (value: unknown): CustomValidatorResult => {
    const info = readImageInfo((value as ImageValue)?.asset?._ref);
    return (info && problem(info)) || true;
  };

/** The part of Sanity's rule builders used here; lets one helper serve typed and untyped image fields. */
interface RuleBuilder<R> {
  custom: (fn: CustomValidator<unknown>) => R;
  error: (message?: string) => R;
  warning: (message?: string) => R;
}

/** `validation` for an image field. Add `.required()` separately where the image is mandatory. */
export const imageRules = (requirements: ImageRequirements) => <R extends RuleBuilder<R>>(rule: R): R[] => {
  const { formats, requireShape, preferShape, requireMinSide, requireMinWidth, preferMinWidth } = requirements;
  return [
    rule
      .custom(
        check((info) => {
          if (formats && !formats.includes(info.format)) {
            return `This is a ${info.format.toUpperCase()} file. Please upload a ${formats.map((f) => f.toUpperCase()).join(' or ')} file.`;
          }
          if (requireShape) {
            const problem = shapeProblem(info, requireShape);
            if (problem) return problem;
          }
          if (requireMinSide && Math.min(info.width, info.height) < requireMinSide) {
            return `This image is ${info.width} × ${info.height} px, which is too small. It needs at least ${requireMinSide} × ${requireMinSide} px.`;
          }
          if (requireMinWidth && info.width < requireMinWidth) {
            return `This image is only ${info.width} px wide, which is too small to use. It needs to be at least ${requireMinWidth} px wide.`;
          }
          return null;
        })
      )
      .error(),
    rule
      .custom(
        check((info) => {
          if (preferShape) {
            const problem = shapeProblem(info, preferShape);
            if (problem) return problem;
          }
          const tooSmallToUse = requireMinWidth !== undefined && info.width < requireMinWidth;
          if (preferMinWidth && info.width < preferMinWidth && !tooSmallToUse) {
            return `This image is only ${info.width} px wide and may look blurry. At least ${preferMinWidth} px wide is recommended.`;
          }
          return null;
        })
      )
      .warning(),
  ];
};
