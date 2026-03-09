import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { IconButton, ImageList, ImageListItem } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { PhotoItem } from '../types/data';

type QuiltedImageListProps = {
  imageData: PhotoItem[];
  albumLabel?: string;
};

function srcset(image: string, size: number, rows = 1, cols = 1) {
  const correctPath = image.startsWith('./') ? image.substring(1) : image;
  return {
    src: `${correctPath}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${correctPath}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
  };
}

function getDownloadFilename(image: string) {
  const sanitizedPath = image.split('?')[0].split('#')[0];
  const segments = sanitizedPath.split('/');
  return decodeURIComponent(segments[segments.length - 1] || 'photo');
}

export function QuiltedImageList({ imageData, albumLabel }: QuiltedImageListProps) {
  return (
    <ImageList aria-label={albumLabel ? `${albumLabel} photo gallery` : undefined}>
      {imageData.map((item, index) => {
        const normalizedTitle = item.title.trim();
        const hasMeaningfulTitle =
          normalizedTitle.length > 0 && normalizedTitle.toLowerCase() !== 'missing';
        const altText = hasMeaningfulTitle
          ? normalizedTitle
          : `${albumLabel ?? 'Photo'} ${index + 1}`;

        return (
          <ImageListItem
            key={item.img}
            cols={item.cols || 1}
            rows={item.rows || 1}
            sx={(theme) => ({
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 3,
              '& img': {
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 180ms ease',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(180deg, ${alpha(theme.palette.common.black, 0.58)} 0%, ${alpha(theme.palette.common.black, 0.18)} 34%, ${alpha(theme.palette.common.black, 0)} 64%)`,
                opacity: 0,
                pointerEvents: 'none',
                transition: 'opacity 180ms ease',
              },
              '& .photo-download-action': {
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 1,
                opacity: 0,
                transform: 'translateY(-8px)',
                transition: 'opacity 180ms ease, transform 180ms ease',
              },
              '&:hover img, &:focus-within img': {
                transform: 'scale(1.02)',
              },
              '&:hover::after, &:focus-within::after': {
                opacity: 1,
              },
              '&:hover .photo-download-action, &:focus-within .photo-download-action': {
                opacity: 1,
                transform: 'translateY(0)',
              },
              '@media (hover: none), (pointer: coarse)': {
                '&::after': {
                  opacity: 0.74,
                },
                '& .photo-download-action': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            })}
          >
            <img
              {...srcset(item.img, 121, item.rows, item.cols)}
              alt={altText}
              loading="lazy"
              decoding="async"
            />
            <IconButton
              className="photo-download-action"
              component="a"
              href={item.img}
              download={getDownloadFilename(item.img)}
              aria-label={`Download ${altText}`}
              size="small"
              sx={(theme) => ({
                color: theme.palette.text.primary,
                backgroundColor: alpha(
                  theme.palette.background.paper,
                  theme.palette.mode === 'light' ? 0.9 : 0.82
                ),
                border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.28 : 0.5)}`,
                boxShadow: `0 10px 24px ${alpha(theme.palette.common.black, theme.palette.mode === 'light' ? 0.18 : 0.42)}`,
                backdropFilter: 'blur(12px)',
                '&:hover': {
                  backgroundColor: alpha(
                    theme.palette.background.paper,
                    theme.palette.mode === 'light' ? 0.98 : 0.92
                  ),
                },
                '&:focus-visible': {
                  outline: `2px solid ${alpha(theme.palette.primary.light, 0.7)}`,
                  outlineOffset: 2,
                },
              })}
            >
              <DownloadRoundedIcon fontSize="small" />
            </IconButton>
          </ImageListItem>
        );
      })}
    </ImageList>
  );
}
