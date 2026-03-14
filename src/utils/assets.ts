const ABSOLUTE_OR_PROTOCOL_RELATIVE_URL_REGEX = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;
const INLINE_DATA_REGEX = /^(?:data|blob):/i;

const normalizePublicBase = (value: string): string => value.replace(/\/+$/, '');

const normalizeAssetPath = (value: string): string => {
  const sanitized = value.replace(/^\.\//, '');
  return sanitized.startsWith('/') ? sanitized : `/${sanitized.replace(/^\/+/, '')}`;
};

export const resolvePublicAssetPath = (
  src: string,
  publicUrl: string = process.env.PUBLIC_URL || ''
): string => {
  if (!src || ABSOLUTE_OR_PROTOCOL_RELATIVE_URL_REGEX.test(src) || INLINE_DATA_REGEX.test(src)) {
    return src;
  }

  const base = normalizePublicBase(publicUrl);
  const normalizedSrc = normalizeAssetPath(src);

  if (!base || normalizedSrc === base || normalizedSrc.startsWith(`${base}/`)) {
    return normalizedSrc;
  }

  return `${base}${normalizedSrc}`;
};
