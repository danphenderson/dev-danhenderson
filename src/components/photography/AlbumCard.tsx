import { Box, Button, Stack } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import { Link as RouterLink } from 'react-router-dom';
import type { SxProps, Theme } from '@mui/material/styles';
import type { PhotoCategory } from '../../types/data';
import { useAppStyles } from '../../styles/appStyles';
import { MotionImage } from '../../motion';
import { Text } from '../text';

type AlbumCardVariant = 'hero' | 'grid';

interface AlbumCardProps {
  category: PhotoCategory;
  variant: AlbumCardVariant;
  onImageReady?: (src: string) => void;
  sx?: SxProps<Theme>;
}

export function AlbumCard({ category, variant, onImageReady, sx }: AlbumCardProps) {
  const appStyles = useAppStyles();
  const containerSx =
    variant === 'hero' ? appStyles.photographyHeroSx : appStyles.photographyImmersiveCardSx;

  return (
    <Box sx={[containerSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      <MotionImage
        src={category.src}
        alt={category.name}
        loading="lazy"
        decoding="async"
        onLoad={onImageReady ? () => onImageReady(category.src) : undefined}
        onError={onImageReady ? () => onImageReady(category.src) : undefined}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      />
      <Box sx={appStyles.photographyCardOverlaySx}>
        <Text
          role="cardTitle"
          tone="inverse"
          context="overlay"
          component="h3"
          sx={{
            fontSize: variant === 'hero' ? { xs: '1.5rem', md: '2rem' } : undefined,
          }}
        >
          {category.name}
        </Text>

        <Text role="body" tone="inverse" context="overlay" sx={{ opacity: 0.82 }}>
          {category.description}
        </Text>

        {(category.location || category.dateRange) && (
          <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
            {category.location && (
              <Stack direction="row" spacing={0.25} alignItems="center">
                <PlaceIcon sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }} />
                <Text role="caption" tone="inverse" context="overlay" sx={{ opacity: 0.7 }}>
                  {category.location}
                </Text>
              </Stack>
            )}
            {category.dateRange && (
              <Text role="caption" tone="inverse" context="overlay" sx={{ opacity: 0.7 }}>
                · {category.dateRange}
              </Text>
            )}
          </Stack>
        )}

        <Text role="caption" tone="inverse" context="overlay" sx={{ opacity: 0.6 }}>
          {category.album.length} photos
        </Text>

        <Button
          component={RouterLink}
          to={`/photography/${category.slug}`}
          variant="outlined"
          size="small"
          sx={{
            alignSelf: 'flex-start',
            color: 'common.white',
            borderColor: 'rgba(255,255,255,0.4)',
            mt: 0.5,
            '&:hover': {
              borderColor: 'common.white',
              backgroundColor: 'rgba(255,255,255,0.08)',
            },
          }}
        >
          View album
        </Button>
      </Box>
    </Box>
  );
}
