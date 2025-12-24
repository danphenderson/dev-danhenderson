import { useMemo } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BackgroundPaper from '../components/BackgroundPaper';
import { ContentCard } from '../components/ContentCard';
import { SectionHeading } from '../components/cv/SectionHeading';
import { QuiltedImageList } from '../components/PhotoAlbum';
import { usePhotographyData } from '../hooks/usePhotographyData';

const fallbackBackgroundImage = 'assets/photography/landscape/landscape-lime-kiln.jpg';

export default function PhotographyCategory() {
  const { slug } = useParams<{ slug?: string }>();
  const { categories } = usePhotographyData();

  const category = useMemo(
    () => categories.find((item) => item.slug === slug),
    [categories, slug]
  );

  const backgroundImage = category?.src ?? fallbackBackgroundImage;

  return (
    <BackgroundPaper image={backgroundImage} showShell={false}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 1.5, md: 3 }, py: { xs: 2, md: 3 } }}>
        <Stack spacing={2.5}>
          <ContentCard>
            <Stack spacing={1.5}>
              <Button
                component={RouterLink}
                to="/photography"
                startIcon={<ArrowBackIcon />}
                size="small"
                sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
              >
                Back to photography
              </Button>
              <SectionHeading
                overline="Photography"
                title={category?.name ?? 'Album not found'}
                subtitle={category?.description}
                sx={{ mb: 0 }}
              />
              {category ? (
                <Typography variant="body2" color="text.secondary">
                  {category.album.length} photos
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  This album does not exist or has been moved.
                </Typography>
              )}
            </Stack>
          </ContentCard>

          {category && (
            <ContentCard sx={{ p: { xs: 1.5, md: 2 } }}>
              <QuiltedImageList ImageData={category.album} />
            </ContentCard>
          )}
        </Stack>
      </Box>
    </BackgroundPaper>
  );
}
