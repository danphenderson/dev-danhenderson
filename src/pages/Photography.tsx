import { useEffect, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { SectionHeading } from '../components/layout/SectionHeading';
import { PageFrame } from '../components/layout/PageFrame';
import { SectionCard } from '../components/layout/SectionCard';
import { siteRouteMap } from '../constants/siteRoutes';
import { LoadingBars } from '../components/LoadingBars';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { usePhotographyData } from '../hooks/usePhotographyData';
import { useAppStyles } from '../styles/appStyles';
import { fallbackBackgroundImage } from '../data/photography';
import { Text } from '../components/text';
import { AlbumCard } from '../components/photography/AlbumCard';
import { MotionSection, MotionItem, StaggerChildren, scaleIn, MotionTiltCard } from '../motion';

export default function Photography() {
  const appStyles = useAppStyles();
  useDocumentMetadata({
    ...siteRouteMap.photography,
    canonicalPath: siteRouteMap.photography.path,
  });
  const { categories, featuredCategory, totalPhotos } = usePhotographyData();
  const supportingCategories = categories.filter((c) => c !== featuredCategory);
  const loadedImagesRef = useRef<Set<string>>(new Set());
  const [loadedImages, setLoadedImages] = useState(0);
  const totalImages = categories.length;

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
    <PageFrame image={fallbackBackgroundImage}>
      <Stack spacing={2.5}>
        <MotionSection>
          <SectionCard delayMs={0} triggerOnView={false}>
            <Stack spacing={1}>
              <SectionHeading
                overline="Photography"
                subtitle="A selection of field work, climbing days, and stargazing nights."
                sx={appStyles.compactSectionHeadingSx}
              />
              <Text role="bodyMuted">
                {totalPhotos} photos · {categories.length} albums
              </Text>
              {isLoading && (
                <Box sx={appStyles.sectionLoadingSx}>
                  <LoadingBars label="Loading photography albums" compact />
                </Box>
              )}
            </Stack>
          </SectionCard>
        </MotionSection>

        {featuredCategory && (
          <MotionSection>
            <MotionItem variants={scaleIn} style={{ minWidth: 0 }}>
              <MotionTiltCard>
                <AlbumCard
                  category={featuredCategory}
                  variant="hero"
                  onImageReady={handleImageReady}
                />
              </MotionTiltCard>
            </MotionItem>
          </MotionSection>
        )}

        <StaggerChildren
          style={{
            display: 'grid',
            gap: '20px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            alignItems: 'stretch',
          }}
        >
          {supportingCategories.map((card) => (
            <MotionItem key={card.slug} variants={scaleIn} style={{ minWidth: 0 }}>
              <MotionTiltCard style={{ height: '100%' }}>
                <AlbumCard category={card} variant="grid" onImageReady={handleImageReady} />
              </MotionTiltCard>
            </MotionItem>
          ))}
        </StaggerChildren>
      </Stack>
    </PageFrame>
  );
}
