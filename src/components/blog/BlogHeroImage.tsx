import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';

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
        src={src}
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
            `linear-gradient(to top, ${alpha(theme.palette.background.default, overlayOpacity)} 0%, transparent ${overlayFadeStop})`,
        }}
      />
    </Box>
  );
}
