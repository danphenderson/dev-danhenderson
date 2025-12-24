import { useEffect, useRef, useState } from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BackgroundPaper from '../components/BackgroundPaper';
import { AnimatedContentCard } from '../components/AnimatedContentCard';
import { SectionHeading } from '../components/cv/SectionHeading';
import { LoadingBars } from '../components/LoadingBars';
import { usePhotographyData } from '../hooks/usePhotographyData';

const fallbackBackgroundImage = 'assets/photography/landscape/landscape-lime-kiln.jpg';

export default function Photography() {
  const { categories } = usePhotographyData();
  const loadedImagesRef = useRef<Set<string>>(new Set());
  const [loadedImages, setLoadedImages] = useState(0);
  const totalImages = categories.length;
  const baseDelay = 120;
  const staggerDelay = 90;

  useEffect(() => {
    loadedImagesRef.current.clear();
    setLoadedImages(0);
  }, [categories]);

  const handleImageReady = (src: string) => {
    if (loadedImagesRef.current.has(src)) return;
    loadedImagesRef.current.add(src);
    setLoadedImages((prev) => prev + 1);
  };

  const isLoading = totalImages > 0 && loadedImages < totalImages;

  return (
    <BackgroundPaper image={fallbackBackgroundImage} showShell={false}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 1.5, md: 3 }, py: { xs: 2, md: 3 } }}>
        <Stack spacing={2.5}>
          <AnimatedContentCard delayMs={0}>
            <Stack spacing={1}>
              <SectionHeading
                overline="Photography"
                title="Collections"
                subtitle="A selection of field work, climbing days, and stargazing nights."
                sx={{ mb: 0 }}
              />
              <Typography variant="body2" color="text.secondary">
                {categories.length} albums
              </Typography>
              {isLoading && (
                <Box sx={{ mt: 1 }}>
                  <LoadingBars label="Loading photography albums" compact />
                </Box>
              )}
            </Stack>
          </AnimatedContentCard>

          <Grid container spacing={2.5}>
            {categories.map((card, index) => (
              <Grid item key={card.name} xs={12} sm={6} md={4}>
                <AnimatedContentCard
                  delayMs={baseDelay + index * staggerDelay}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: 1.5,
                      overflow: 'hidden',
                      pt: '70%',
                      backgroundColor: 'rgba(15, 23, 42, 0.08)',
                    }}
                  >
                    <Box
                      component="img"
                      src={card.src}
                      alt={card.name}
                      loading="lazy"
                      decoding="async"
                      onLoad={() => handleImageReady(card.src)}
                      onError={() => handleImageReady(card.src)}
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>

                  <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ color: 'text.primary' }}>
                      {card.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </Stack>

                  <Button
                    component={RouterLink}
                    to={`/photography/${card.slug}`}
                    variant="outlined"
                    size="small"
                    sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
                  >
                    View album
                  </Button>
                </AnimatedContentCard>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>
    </BackgroundPaper>
  );
}
