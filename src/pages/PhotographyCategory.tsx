import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BackToTopButton } from '../components/BackToTopButton';
import { SectionHeading } from '../components/layout/SectionHeading';
import { PageFrame } from '../components/layout/PageFrame';
import { SectionCard } from '../components/layout/SectionCard';
import { QuiltedImageList } from '../components/PhotoAlbum';
import { siteRouteMap } from '../constants/siteRoutes';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { usePhotographyData } from '../hooks/usePhotographyData';
import { useAppStyles } from '../styles/appStyles';
import { fallbackBackgroundImage } from '../data/photography';
import { BodyText } from '../components/text';

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
  const category = categories.find((item) => item.slug === canonicalSlug);

  useDocumentMetadata(
    shouldRedirect
      ? {
          ...siteRouteMap.photography,
          canonicalPath: siteRouteMap.photography.path,
        }
      : category
        ? {
            title: `${category.name} Photography | Daniel Henderson`,
            description: `${category.description} Browse ${
              category.album.length
            } photos from the ${category.name.toLowerCase()} album.`,
            image: category.src,
            canonicalPath: `/photography/${category.slug}`,
          }
        : {
            ...siteRouteMap['not-found'],
            description:
              'This photography album does not exist or has moved. Browse the photography index to continue exploring the gallery.',
            image: siteRouteMap.photography.image,
            canonicalPath: siteRouteMap.photography.path,
            noIndex: true,
          }
  );

  if (shouldRedirect && canonicalSlug) {
    return <Navigate to={`/photography/${canonicalSlug}`} replace />;
  }

  const backgroundImage = category?.src ?? fallbackBackgroundImage;

  return (
    <PageFrame image={backgroundImage}>
      <>
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
                <BodyText sx={appStyles.secondaryTextSx}>{category.album.length} photos</BodyText>
              ) : (
                <BodyText sx={appStyles.secondaryTextSx}>
                  This album does not exist or has been moved.
                </BodyText>
              )}
            </Stack>
          </SectionCard>

          {category && (
            <SectionCard delayMs={140} sx={appStyles.albumSectionSx}>
              <QuiltedImageList imageData={category.album} albumLabel={category.name} />
            </SectionCard>
          )}
        </Stack>
        <BackToTopButton />
      </>
    </PageFrame>
  );
}
