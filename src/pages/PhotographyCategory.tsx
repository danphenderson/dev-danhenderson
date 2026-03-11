import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SectionHeading } from '../components/layout/SectionHeading';
import { PageFrame } from '../components/layout/PageFrame';
import { SectionCard } from '../components/layout/SectionCard';
import { QuiltedImageList } from '../components/PhotoAlbum';
import { usePhotographyData } from '../hooks/usePhotographyData';
import { useAppStyles } from '../styles/appStyles';

const fallbackBackgroundImage = 'assets/photography/landscape/landscape-lime-kiln.jpg';
const legacySlugMap: Record<string, string> = {
  'new mexico': 'new-mexico',
  'new%20mexico': 'new-mexico',
};

export default function PhotographyCategory() {
  const appStyles = useAppStyles();
  const { slug } = useParams<{ slug?: string }>();
  const { categories } = usePhotographyData();
  const slugKey = slug?.toLowerCase();
  const canonicalSlug = slugKey ? legacySlugMap[slugKey] ?? slugKey : undefined;
  const shouldRedirect = Boolean(slugKey && legacySlugMap[slugKey]);

  if (shouldRedirect && canonicalSlug) {
    return <Navigate to={`/photography/${canonicalSlug}`} replace />;
  }

  const category = categories.find((item) => item.slug === canonicalSlug);

  const backgroundImage = category?.src ?? fallbackBackgroundImage;

  return (
    <PageFrame image={backgroundImage}>
      <Stack spacing={2.5}>
        <SectionCard delayMs={0}>
          <Stack spacing={1.5}>
            <Button
              component={RouterLink}
              to="/photography"
              startIcon={<ArrowBackIcon />}
              size="small"
              sx={appStyles.inlineStartSx}
            >
              Back to photography
            </Button>
            <SectionHeading
              overline="Photography"
              title={category?.name ?? 'Album not found'}
              subtitle={category?.description}
              sx={appStyles.compactSectionHeadingSx}
            />
            {category ? (
              <Typography variant="body2" sx={appStyles.secondaryTextSx}>
                {category.album.length} photos
              </Typography>
            ) : (
              <Typography variant="body2" sx={appStyles.secondaryTextSx}>
                This album does not exist or has been moved.
              </Typography>
            )}
          </Stack>
        </SectionCard>

        {category && (
          <SectionCard delayMs={140} sx={appStyles.albumSectionSx}>
            <QuiltedImageList imageData={category.album} albumLabel={category.name} />
          </SectionCard>
        )}
      </Stack>
    </PageFrame>
  );
}
