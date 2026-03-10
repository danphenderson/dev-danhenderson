import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { IconButton, ImageList, ImageListItem } from '@mui/material';
import { useAppStyles } from '../styles/appStyles';
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
  const appStyles = useAppStyles();

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
            sx={appStyles.quiltedImageItemSx}
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
              sx={appStyles.photoDownloadButtonSx}
            >
              <DownloadRoundedIcon fontSize="small" />
            </IconButton>
          </ImageListItem>
        );
      })}
    </ImageList>
  );
}
