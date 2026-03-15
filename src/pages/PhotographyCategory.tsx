import { Link as RouterLink, Navigate, useLocation, useParams } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCallback, useMemo, useState } from 'react';
import { BackToTopButton } from '../components/BackToTopButton';
import { RouteRecoveryPanel } from '../components/RouteRecoveryPanel';
import { PageFrame } from '../components/layout/PageFrame';
import { SectionCard } from '../components/layout/SectionCard';
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
import { BodyText } from '../components/text';
import { MotionSection, MotionScaleIn } from '../motion';

const legacySlugMap: Record<string, string> = {
  'new mexico': 'new-mexico',
  'new%20mexico': 'new-mexico',
};

export default function PhotographyCategory() {
  const appStyles = useAppStyles();
  const location = useLocation();
  const { slug } = useParams<{ slug?: string }>();
  const { categories } = usePhotographyData();
  const slugKey = slug?.toLowerCase();
  const canonicalSlug = slugKey ? legacySlugMap[slugKey] ?? slugKey : undefined;
  const shouldRedirect = Boolean(slugKey && legacySlugMap[slugKey]);
  const category = categories.find((item) => item.slug === canonicalSlug);
  const recoveryContext = useMemo(() => getRecoveryContext(location.pathname), [location.pathname]);
  const recoveryActions = useMemo(
    () =>
      recoveryRouteActions.map((action) => ({
        ...action,
        routeStatusLabel: siteRouteMap[action.routeId].status?.label,
      })),
    []
  );

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handlePhotoClick = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const handleLightboxClose = useCallback(() => {
    setLightboxOpen(false);
  }, []);

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
              <Stack spacing={{ xs: 2, md: 2.5 }}>
                <Button
                  component={RouterLink}
                  to="/photography"
                  startIcon={<ArrowBackIcon />}
                  size="small"
                  sx={appStyles.inlineStartSx}
                >
                  Back to photography
                </Button>
                {category ? (
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 2, md: 3 }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', md: 'flex-end' }}
                  >
                    <Stack spacing={1} sx={{ minWidth: 0, maxWidth: { md: 760 } }}>
                      <Typography
                        component="p"
                        variant="overline"
                        sx={{
                          display: 'block',
                          color: 'primary.main',
                          fontWeight: 700,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Photography album
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography
                          component="h1"
                          variant="h2"
                          sx={{
                            color: 'text.primary',
                            fontSize: { xs: '2.125rem', sm: '2.5rem', md: '3.25rem' },
                            lineHeight: { xs: 1.05, md: 1 },
                            letterSpacing: '-0.04em',
                            textWrap: 'balance',
                          }}
                        >
                          {category.name}
                        </Typography>
                        <AlbumShareButton
                          albumName={category.name}
                          albumSlug={category.slug}
                          albumDescription={category.description}
                        />
                      </Stack>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.secondary',
                          fontSize: { xs: '1rem', md: '1.075rem' },
                          lineHeight: 1.65,
                          maxWidth: { md: 620 },
                        }}
                      >
                        {category.description}
                      </Typography>
                      <AlbumLocationSummary
                        albumLocation={category.location}
                        dateRange={category.dateRange}
                        photos={category.album}
                      />
                    </Stack>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 1.5,
                        py: 1,
                        borderRadius: 999,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        flexShrink: 0,
                      }}
                    >
                      <BodyText sx={appStyles.secondaryTextSx}>
                        {category.album.length} photos
                      </BodyText>
                    </Box>
                  </Stack>
                ) : (
                  <Stack spacing={2.5}>
                    <Stack spacing={1} sx={{ minWidth: 0, maxWidth: { md: 760 } }}>
                      <Typography
                        component="p"
                        variant="overline"
                        sx={{
                          display: 'block',
                          color: 'primary.main',
                          fontWeight: 700,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Photography album
                      </Typography>
                      <Typography
                        component="h1"
                        variant="h3"
                        sx={{
                          color: 'text.primary',
                          fontSize: { xs: '2rem', md: '2.5rem' },
                          lineHeight: 1.05,
                          letterSpacing: '-0.03em',
                        }}
                      >
                        Album not found
                      </Typography>
                    </Stack>
                    <BodyText sx={appStyles.secondaryTextSx}>
                      This album does not exist or has been moved. The command palette opens with a
                      recovery search so you can jump to another gallery or route quickly.
                    </BodyText>
                    <RouteRecoveryPanel
                      attemptedPathLabel={recoveryContext.attemptedPathLabel}
                      routeHintLabel={recoveryContext.routeHintLabel}
                      contextualSuggestions={recoveryContext.contextualSuggestions}
                      recoveryActions={recoveryActions}
                      suggestedPaletteQuery={recoveryContext.suggestedPaletteQuery}
                    />
                  </Stack>
                )}
              </Stack>
            </SectionCard>
          </MotionSection>

          {category && (
            <MotionScaleIn>
              <SectionCard delayMs={0} triggerOnView={false} sx={appStyles.albumSectionSx}>
                <QuiltedImageList
                  imageData={category.album}
                  albumLabel={category.name}
                  onPhotoClick={handlePhotoClick}
                />
              </SectionCard>
            </MotionScaleIn>
          )}

          {category && (
            <ImmersiveLightbox
              photos={category.album}
              initialIndex={lightboxIndex}
              open={lightboxOpen}
              onClose={handleLightboxClose}
              albumLabel={category.name}
            />
          )}
        </Stack>
        <BackToTopButton />
      </>
    </PageFrame>
  );
}
