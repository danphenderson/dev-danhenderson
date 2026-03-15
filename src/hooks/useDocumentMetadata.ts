import { useEffect } from 'react';
import { resolvePublicAssetPath } from '../utils/assets';

type DocumentMetadata = {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  canonicalPath?: string;
  noIndex?: boolean;
};

const ensureMetaTag = (attribute: 'name' | 'property', value: string): HTMLMetaElement => {
  const selector = `meta[${attribute}="${value}"]`;
  const existing = document.head.querySelector<HTMLMetaElement>(selector);

  if (existing) {
    return existing;
  }

  const meta = document.createElement('meta');
  meta.setAttribute(attribute, value);
  document.head.appendChild(meta);
  return meta;
};

const ensureLinkTag = (rel: string): HTMLLinkElement => {
  const selector = `link[rel="${rel}"]`;
  const existing = document.head.querySelector<HTMLLinkElement>(selector);

  if (existing) {
    return existing;
  }

  const link = document.createElement('link');
  link.setAttribute('rel', rel);
  document.head.appendChild(link);
  return link;
};

const toAbsoluteUrl = (value: string): string => {
  if (!value || typeof window === 'undefined') {
    return value;
  }

  const resolvedPath = resolvePublicAssetPath(value);

  try {
    return new URL(resolvedPath, window.location.origin).toString();
  } catch {
    return resolvedPath;
  }
};

const getCurrentAbsoluteUrl = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }

  return new URL(`${window.location.pathname}${window.location.search}`, window.location.origin).toString();
};

export const useDocumentMetadata = ({
  title,
  description,
  image,
  type = 'website',
  canonicalPath,
  noIndex = false,
}: DocumentMetadata) => {
  useEffect(() => {
    document.title = title;

    ensureMetaTag('name', 'description').content = description;
    ensureMetaTag('property', 'og:title').content = title;
    ensureMetaTag('property', 'og:description').content = description;
    ensureMetaTag('property', 'og:type').content = type;
    ensureMetaTag('name', 'twitter:card').content = image ? 'summary_large_image' : 'summary';
    ensureMetaTag('name', 'twitter:title').content = title;
    ensureMetaTag('name', 'twitter:description').content = description;
    ensureMetaTag('name', 'robots').content = noIndex ? 'noindex, nofollow' : 'index, follow';

    const canonicalHref = canonicalPath ? toAbsoluteUrl(canonicalPath) : getCurrentAbsoluteUrl();

    if (image) {
      const absoluteImageUrl = toAbsoluteUrl(image);
      ensureMetaTag('property', 'og:image').content = absoluteImageUrl;
      ensureMetaTag('name', 'twitter:image').content = absoluteImageUrl;
    }

    ensureLinkTag('canonical').href = canonicalHref;
    ensureMetaTag('property', 'og:url').content = canonicalHref;
  }, [canonicalPath, description, image, noIndex, title, type]);
};
