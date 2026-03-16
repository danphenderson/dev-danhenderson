import DoneIcon from '@mui/icons-material/Done';
import ShareIcon from '@mui/icons-material/Share';
import { IconButton, Tooltip } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';

type AlbumShareButtonProps = {
  albumName: string;
  albumSlug: string;
  albumDescription: string;
};

function getCanonicalAlbumUrl(slug: string): string {
  const origin = window.location.origin;
  const base = process.env.PUBLIC_URL || '';
  return `${origin}${base}/photography/${slug}`;
}

export function AlbumShareButton({
  albumName,
  albumSlug,
  albumDescription,
}: AlbumShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef<number>();
  const canonicalUrl = getCanonicalAlbumUrl(albumSlug);

  useEffect(
    () => () => {
      window.clearTimeout(copiedTimerRef.current);
    },
    []
  );

  const handleShare = useCallback(async () => {
    const title = `${albumName} Photography | Daniel Henderson`;
    // Some browsers (e.g. Chrome desktop) reject shareData that includes a
    // plain-text `text` field alongside a `url`.  Try with the full payload
    // first; if the browser signals it cannot share that data, retry with
    // just title + url before falling through to the clipboard fallback.
    const candidates: ShareData[] = [
      { title, text: albumDescription, url: canonicalUrl },
      { title, url: canonicalUrl },
    ];

    if (navigator.share) {
      for (const data of candidates) {
        if (navigator.canShare && !navigator.canShare(data)) continue;
        try {
          await navigator.share(data);
          return;
        } catch (err) {
          if (err instanceof DOMException && err.name === 'AbortError') {
            // User dismissed the share sheet — do not copy to clipboard.
            return;
          }
          // Other error (e.g. TypeError for unsupported data) — try next candidate.
        }
      }
    }

    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      window.clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  }, [albumName, albumDescription, canonicalUrl]);

  return (
    <Tooltip title={copied ? 'Link copied!' : 'Share album'}>
      <IconButton
        onClick={handleShare}
        aria-label={copied ? 'Album link copied to clipboard' : `Share ${albumName} album`}
        size="small"
        sx={{
          color: 'text.secondary',
          '&:hover': { color: 'text.primary' },
        }}
      >
        {copied ? <DoneIcon fontSize="small" /> : <ShareIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}
