import DoneIcon from '@mui/icons-material/Done';
import ShareIcon from '@mui/icons-material/Share';
import { IconButton, Tooltip } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { siteRouteMap } from '../../constants/siteRoutes';
import { readPublicUrl } from '../../utils/appEnvironment';
import { resolvePublicAssetPath } from '../../utils/assets';

type AlbumShareButtonProps = {
  albumName: string;
  albumSlug: string;
  albumDescription: string;
};

function getCanonicalAlbumUrl(slug: string): string {
  const origin = window.location.origin;
  const albumPath = `${siteRouteMap.photography.path}/${slug}`;
  return `${origin}${resolvePublicAssetPath(albumPath, readPublicUrl())}`;
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
    const shareData = {
      title: `${albumName} Photography | Daniel Henderson`,
      text: albumDescription,
      url: canonicalUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
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
