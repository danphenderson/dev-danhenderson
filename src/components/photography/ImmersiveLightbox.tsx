import CloseIcon from '@mui/icons-material/Close';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PlaceIcon from '@mui/icons-material/Place';
import { Box, Dialog, IconButton, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import type { PhotoItem } from '../../types/data';
import { EntryTitle, SecondaryBodyText } from '../text';

type ImmersiveLightboxProps = {
  photos: PhotoItem[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
  albumLabel?: string;
};

function getDownloadFilename(image: string) {
  const sanitizedPath = image.split('?')[0].split('#')[0];
  const segments = sanitizedPath.split('/');
  return decodeURIComponent(segments[segments.length - 1] || 'photo');
}

export function ImmersiveLightbox({
  photos,
  initialIndex,
  open,
  onClose,
  albumLabel,
}: ImmersiveLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
    }
  }, [open, initialIndex]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          goPrev();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, goNext, goPrev]);

  if (photos.length === 0) return null;

  const photo = photos[currentIndex];
  const normalizedTitle = photo.title.trim();
  const hasMeaningfulTitle =
    normalizedTitle.length > 0 && normalizedTitle.toLowerCase() !== 'missing';
  const displayTitle = hasMeaningfulTitle
    ? normalizedTitle
    : `${albumLabel ?? 'Photo'} ${currentIndex + 1}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      aria-label={`Immersive photo viewer: ${displayTitle}`}
      PaperProps={{
        sx: {
          bgcolor: 'common.black',
          backgroundImage: 'none',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top toolbar */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 1.5, md: 3 },
            py: { xs: 1, md: 1.5 },
            background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
          }}
        >
          <SecondaryBodyText sx={{ color: 'common.white', opacity: 0.8 }}>
            {currentIndex + 1} / {photos.length}
          </SecondaryBodyText>
          <Stack direction="row" spacing={0.5}>
            <IconButton
              component="a"
              href={photo.img}
              download={getDownloadFilename(photo.img)}
              aria-label={`Download ${displayTitle}`}
              size="small"
              sx={{ color: 'common.white', opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              <DownloadRoundedIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={onClose}
              aria-label="Close lightbox"
              size="small"
              sx={{ color: 'common.white', opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>

        {/* Main image area */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            userSelect: 'none',
          }}
        >
          {photos.length > 1 && (
            <IconButton
              onClick={goPrev}
              aria-label="Previous photo"
              sx={{
                position: 'absolute',
                left: { xs: 4, md: 16 },
                zIndex: 1,
                color: 'common.white',
                bgcolor: 'rgba(0,0,0,0.3)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
              }}
            >
              <NavigateBeforeIcon fontSize="large" />
            </IconButton>
          )}

          <Box
            component="img"
            src={photo.img}
            alt={displayTitle}
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              p: { xs: 1, md: 2 },
            }}
          />

          {photos.length > 1 && (
            <IconButton
              onClick={goNext}
              aria-label="Next photo"
              sx={{
                position: 'absolute',
                right: { xs: 4, md: 16 },
                zIndex: 1,
                color: 'common.white',
                bgcolor: 'rgba(0,0,0,0.3)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
              }}
            >
              <NavigateNextIcon fontSize="large" />
            </IconButton>
          )}
        </Box>

        {/* Bottom metadata bar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            px: { xs: 2, md: 3 },
            py: { xs: 1.5, md: 2 },
            background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
          }}
        >
          <Stack spacing={0.25}>
            <EntryTitle
              component="p"
              sx={{ color: 'common.white', fontSize: '1rem', fontWeight: 600, lineHeight: 1.3 }}
            >
              {displayTitle}
            </EntryTitle>
            {photo.location && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <PlaceIcon sx={{ color: 'common.white', opacity: 0.7, fontSize: 16 }} />
                <SecondaryBodyText sx={{ color: 'common.white', opacity: 0.7 }}>
                  {photo.location}
                </SecondaryBodyText>
              </Stack>
            )}
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
}
