import manifest from '../generated/displayImages.json';
import type { DisplayImageSet } from '../types/data';
import { readPublicUrl } from './appEnvironment';
import { resolvePublicAssetPath } from './assets';

const imagesBySource: Record<string, DisplayImageSet> = manifest;

/**
 * Recover a failed display derivative by loading the original photograph once.
 *
 * `srcSet` and `sizes` are removed first; otherwise responsive selection would
 * immediately override the assigned `src` with the derivative that just failed.
 * Returns `false` once the original itself has failed, which bounds the retry.
 */
export const applyOriginalImageFallback = (
  image: HTMLImageElement,
  source: string,
  publicUrl = readPublicUrl()
): boolean => {
  const original = resolvePublicAssetPath(source, publicUrl);

  if (image.getAttribute('src') === original) {
    return false;
  }

  image.removeAttribute('srcset');
  image.removeAttribute('sizes');
  image.setAttribute('src', original);

  return true;
};

/** Resolve display derivatives without changing the original download URL. */
export const getDisplayImage = (
  source: string,
  preferredWidth = 960,
  publicUrl = readPublicUrl()
) => {
  const resolvedSource = resolvePublicAssetPath(source, publicUrl);
  const base = publicUrl.replace(/\/+$/, '');
  const key = (
    base && resolvedSource.startsWith(`${base}/`)
      ? resolvedSource.slice(base.length)
      : resolvedSource
  ).split(/[?#]/)[0];
  const entry = imagesBySource[key];
  if (!entry) return { src: resolvedSource };

  const image =
    entry.images.find((candidate) => candidate.width >= preferredWidth) ??
    entry.images[entry.images.length - 1];
  return {
    src: resolvePublicAssetPath(image.src, publicUrl),
    srcSet: entry.images
      .map((candidate) => `${resolvePublicAssetPath(candidate.src, publicUrl)} ${candidate.width}w`)
      .join(', '),
    width: image.width,
    height: image.height,
  };
};
