import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { IconButton, ImageList, ImageListItem, useMediaQuery, useTheme } from '@mui/material';
import { useAppStyles } from '../styles/appStyles';
import type { PhotoItem } from '../types/data';
import { getDisplayImage } from '../utils/displayImages';
import { resolvePublicAssetPath } from '../utils/assets';
import { TiltCard } from './photography/TiltCard';
import { useMotionScale } from '../motion';

type QuiltedImageListProps = {
  imageData: PhotoItem[];
  albumLabel?: string;
  onPhotoClick?: (index: number) => void;
};

function getDownloadFilename(image: string) {
  const sanitizedPath = image.split('?')[0].split('#')[0];
  const segments = sanitizedPath.split('/');
  return decodeURIComponent(segments[segments.length - 1] || 'photo');
}

export function QuiltedImageList({ imageData, albumLabel, onPhotoClick }: QuiltedImageListProps) {
  const appStyles = useAppStyles();
  const { duration: motionScale } = useMotionScale();

  const theme = useTheme();
  const medium = useMediaQuery(theme.breakpoints.up('md'));
  const small = useMediaQuery(theme.breakpoints.up('sm'));
  const columns = medium ? 4 : small ? 2 : 1;

  return (
    <ImageList
      variant="quilted"
      cols={columns}
      rowHeight={medium ? 200 : 260}
      aria-label={albumLabel ? `${albumLabel} photo gallery` : undefined}
    >
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
            cols={Math.min(item.cols || 1, columns)}
            rows={medium ? item.rows || 1 : 1}
            sx={[
              appStyles.quiltedImageItemSx,
              ...(motionScale === 0
                ? [
                    {
                      '& img, &::after, & .photo-download-action': { transition: 'none' },
                      '&:hover img, &:focus-within img': { transform: 'none' },
                    },
                  ]
                : []),
            ]}
          >
            <TiltCard intensity={0.5} style={{ height: '100%', width: '100%' }}>
              <img
                {...getDisplayImage(item.img)}
                sizes={
                  medium && (item.cols || 1) > 1
                    ? '(min-width: 1200px) 600px, (min-width: 900px) 50vw, (min-width: 600px) 50vw, 100vw'
                    : '(min-width: 1200px) 300px, (min-width: 900px) 25vw, (min-width: 600px) 50vw, 100vw'
                }
                alt={altText}
                loading="lazy"
                decoding="async"
                onClick={onPhotoClick ? () => onPhotoClick(index) : undefined}
                role={onPhotoClick ? 'button' : undefined}
                tabIndex={onPhotoClick ? 0 : undefined}
                onKeyDown={
                  onPhotoClick
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onPhotoClick(index);
                        }
                      }
                    : undefined
                }
                style={onPhotoClick ? { cursor: 'pointer' } : undefined}
              />
              <IconButton
                className="photo-download-action"
                component="a"
                href={resolvePublicAssetPath(item.img)}
                download={getDownloadFilename(item.img)}
                aria-label={`Download ${altText}`}
                size="small"
                sx={appStyles.photoDownloadButtonSx}
              >
                <DownloadRoundedIcon fontSize="small" />
              </IconButton>
            </TiltCard>
          </ImageListItem>
        );
      })}
    </ImageList>
  );
}
