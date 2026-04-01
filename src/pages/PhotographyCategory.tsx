import { Link as RouterLink, Navigate, useLocation, useParams } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import { BackToTopButton } from '../components/BackToTopButton';
import { RouteRecoveryPanel } from '../components/RouteRecoveryPanel';
import { PageFrame } from '../components/layout/PageFrame';
import { SectionCard } from '../components/layout/SectionCard';
import { SectionHeading } from '../components/layout/SectionHeading';
import { QuiltedImageList } from '../components/PhotoAlbum';
import { ImmersiveLightbox } from '../components/photography/ImmersiveLightbox';
import { AlbumShareButton } from '../components/photography/AlbumShareButton';
import { AlbumLocationSummary } from '../components/photography/AlbumLocationSummary';
import { getRecoveryContext } from '../constants/recoveryContext';
import { recoveryRouteActions } from '../constants/routeActions';
import { siteRouteMap } from '../constants/siteRoutes';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { usePhotographyData } from '../hooks/usePhotographyData';
import { useAppStyles } from '../styles/appStyles';
import { fallbackBackgroundImage } from '../data/photography';
import { Text } from '../components/text';
import { MotionSection, MotionScaleIn, MotionImage } from '../motion';

const legacySlugMap: Record<string, string> = {
  'new mexico': 'new-mexico',
  'new%20mexico': 'new-mexico',
};

const recoveryActions = recoveryRouteActions.map((action) => ({
  ...action,
  routeStatusLabel: siteRouteMap[action.routeId].status?.label,
}));

export default function PhotographyCategory() {
  const appStyles = useAppStyles();
  const location = useLocation();
  const { slug } = useParams<{ slug?: string }>();
  const { categories } = usePhotographyData();
  const slugKey = slug?.toLowerCase();
  const canonicalSlug = slugKey ? legacySlugMap[slugKey] ?? slugKey : undefined;
  const shouldRedirect = Boolean(slugKey && legacySlugMap[slugKey]);
  const category = categories.find((item) => item.slug === canonicalSlug);
  const recoveryContext = getRecoveryContext(location.pathname);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handlePhotoClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    setLightboxOpen(false);
  };

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
          <MotionSection>
            <SectionCard delayMs={0} triggerOnView={false}>
              <Button
                component={RouterLink}
                to="/photography"
                startIcon={<ArrowBackIcon />}
                size="small"
                sx={appStyles.inlineStartSx}
              >
                Back to photography
              </Button>
            </SectionCard>
          </MotionSection>

          {category ? (
            <>
              <MotionSection>
                <Box sx={appStyles.photographyDetailCoverSx}>
                  <MotionImage
                    src={category.src}
                    alt={category.name}
                    loading="eager"
                    decoding="async"
                    style={{ position: 'absolute', inset: 0, zIndex: 0 }}
                  />
                  <Box sx={appStyles.photographyCardOverlaySx}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Text
                        role="pageTitle"
                        tone="inverse"
                        context="overlay"
                        component="h1"
                        sx={{
                          fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem' },
                          lineHeight: { xs: 1.05, md: 1 },
                          letterSpacing: '-0.04em',
                          textWrap: 'balance',
                        }}
                      >
                        {category.name}
                      </Text>
                      <AlbumShareButton
                        albumName={category.name}
                        albumSlug={category.slug}
                        albumDescription={category.description}
                      />
                    </Stack>
                    <Text role="body" tone="inverse" context="overlay" sx={{ opacity: 0.82 }}>
                      {category.description}
                    </Text>
                    <AlbumLocationSummary
                      albumLocation={category.location}
                      dateRange={category.dateRange}
                      photos={category.album}
                    />
                    <Text role="caption" tone="inverse" context="overlay" sx={{ opacity: 0.65 }}>
                      {category.album.length} photos
                    </Text>
                  </Box>
                </Box>
              </MotionSection>

              <MotionScaleIn>
                <SectionCard delayMs={0} triggerOnView={false} sx={appStyles.albumSectionSx}>
                  <QuiltedImageList
                    imageData={category.album}
                    albumLabel={category.name}
                    onPhotoClick={handlePhotoClick}
                  />
                </SectionCard>
              </MotionScaleIn>

              <ImmersiveLightbox
                photos={category.album}
                initialIndex={lightboxIndex}
                open={lightboxOpen}
                onClose={handleLightboxClose}
                albumLabel={category.name}
              />
            </>
          ) : (
            <MotionSection>
              <SectionCard delayMs={0} triggerOnView={false}>
                <Stack spacing={2.5}>
                  <SectionHeading
                    overline="Photography album"
                    title="Album not found"
                    sx={{ minWidth: 0, maxWidth: { md: 760 } }}
                  />
                  <Text role="bodyMuted">
                    This album does not exist or has been moved. The command palette opens with a
                    recovery search so you can jump to another gallery or route quickly.
                  </Text>
                  <RouteRecoveryPanel
                    attemptedPathLabel={recoveryContext.attemptedPathLabel}
                    routeHintLabel={recoveryContext.routeHintLabel}
                    contextualSuggestions={recoveryContext.contextualSuggestions}
                    recoveryActions={recoveryActions}
                    suggestedPaletteQuery={recoveryContext.suggestedPaletteQuery}
                  />
                </Stack>
              </SectionCard>
            </MotionSection>
          )}
        </Stack>
        <BackToTopButton />
      </>
    </PageFrame>
  );
}
