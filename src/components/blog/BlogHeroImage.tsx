import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { getDisplayImage } from '../../utils/displayImages';

type BlogHeroImageProps = {
  src: string;
  alt?: string;
  height: { xs: number; sm: number; md: number };
  overlayOpacity: number;
  overlayFadeStop: string;
  borderRadius?: number;
  loading?: 'eager' | 'lazy';
};

export function BlogHeroImage({
  src,
  alt = '',
  height,
  overlayOpacity,
  overlayFadeStop,
  borderRadius,
  loading = 'eager',
}: BlogHeroImageProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius,
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        {...getDisplayImage(src, 1600)}
        sizes="(min-width: 1200px) 1200px, 100vw"
        alt={alt}
        loading={loading}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: (theme) =>
            `linear-gradient(to top, ${alpha(
              theme.palette.background.default,
              overlayOpacity
            )} 0%, transparent ${overlayFadeStop})`,
        }}
      />
    </Box>
  );
}
