import { useEffect, useRef, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import { Link as RouterLink } from 'react-router-dom';
import { SectionHeading } from '../components/layout/SectionHeading';
import { PageFrame } from '../components/layout/PageFrame';
import { SectionCard } from '../components/layout/SectionCard';
import { siteRouteMap } from '../constants/siteRoutes';
import { LoadingBars } from '../components/LoadingBars';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { usePhotographyData } from '../hooks/usePhotographyData';
import { useAppStyles } from '../styles/appStyles';
import { fallbackBackgroundImage } from '../data/photography';
import { BodyText } from '../components/text';
import {
  MotionSection,
  StaggerChildren,
  MotionItem,
  MotionCard,
  MotionImage,
  scaleIn,
} from '../motion';

export default function Photography() {
  const appStyles = useAppStyles();
  useDocumentMetadata({
    ...siteRouteMap.photography,
    canonicalPath: siteRouteMap.photography.path,
  });
  const { categories } = usePhotographyData();
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
              <BodyText sx={appStyles.secondaryTextSx}>{categories.length} albums</BodyText>
              {isLoading && (
                <Box sx={appStyles.sectionLoadingSx}>
                  <LoadingBars label="Loading photography albums" compact />
                </Box>
              )}
            </Stack>
          </SectionCard>
        </MotionSection>

        <Box sx={appStyles.photographyGridSx}>
          <StaggerChildren>
            {categories.map((card) => (
              <MotionItem key={card.name} variants={scaleIn} style={{ minWidth: 0 }}>
                <MotionCard style={{ height: '100%' }}>
                  <SectionCard delayMs={0} triggerOnView={false} sx={appStyles.photographyCardSx}>
                    <Box sx={appStyles.photographyMediaSx}>
                      <MotionImage
                        src={card.src}
                        alt={card.name}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => handleImageReady(card.src)}
                        onError={() => handleImageReady(card.src)}
                        style={{ position: 'absolute', inset: 0 }}
                      />
                    </Box>

                    <Stack spacing={0.5} sx={appStyles.photographyCardContentSx}>
                      <Typography variant="h6" sx={appStyles.primaryTextSx}>
                        {card.name}
                      </Typography>
                      <BodyText sx={appStyles.secondaryTextSx}>{card.description}</BodyText>
                      {(card.location || card.dateRange) && (
                        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
                          {card.location && (
                            <Stack direction="row" spacing={0.25} alignItems="center">
                              <PlaceIcon sx={{ color: 'text.secondary', fontSize: 14 }} />
                              <Typography variant="caption" color="text.secondary">
                                {card.location}
                              </Typography>
                            </Stack>
                          )}
                          {card.dateRange && (
                            <Typography variant="caption" color="text.secondary">
                              · {card.dateRange}
                            </Typography>
                          )}
                        </Stack>
                      )}
                      <BodyText sx={appStyles.secondaryTextSx}>{card.album.length} photos</BodyText>
                    </Stack>

                    <Button
                      component={RouterLink}
                      to={`/photography/${card.slug}`}
                      variant="outlined"
                      size="small"
                      sx={appStyles.inlineStartSx}
                    >
                      View album
                    </Button>
                  </SectionCard>
                </MotionCard>
              </MotionItem>
            ))}
          </StaggerChildren>
        </Box>
      </Stack>
    </PageFrame>
  );
}
