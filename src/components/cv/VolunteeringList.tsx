import { Box, Link, Stack } from '@mui/material';
import type { VolunteeringEntry } from '../../types/cv';
import { AnimatedContentList } from '../AnimatedContentList';
import { useComponentStyles } from '../../styles/componentStyles';
import { EntrySubtitle, EntryTitle, StrongMetaText, BodyText, ListItemText } from '../text';

type VolunteeringListProps = {
  volunteering: VolunteeringEntry[];
  startDelayMs?: number;
};

export const VolunteeringList = ({ volunteering, startDelayMs = 0 }: VolunteeringListProps) => {
  const {
    contentListStackSpacing,
    getDetailListSx,
    secondaryItalicSx,
    sectionTitleSx,
    volunteeringMetaSx,
  } = useComponentStyles();

  if (volunteering.length === 0) {
    return null;
  }

  return (
    <AnimatedContentList
      items={volunteering}
      getItemKey={(entry, index) => `${entry.organization}-${entry.role}-${index}`}
      mountItemsOnView
      startDelayMs={startDelayMs}
      stackSpacing={contentListStackSpacing}
      itemSurface="panel"
      renderItem={(entry) => (
        <>
          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
              spacing={1.5}
              flexWrap="wrap"
            >
              <Box>
                {entry.organizationUrl ? (
                  <Link
                    href={entry.organizationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                    underline="hover"
                    sx={{ textDecorationColor: 'currentColor' }}
                  >
                    <EntryTitle component="span" sx={sectionTitleSx}>
                      {entry.organization}
                    </EntryTitle>
                  </Link>
                ) : (
                  <EntryTitle>
                    {entry.organization}
                  </EntryTitle>
                )}
                <EntrySubtitle sx={secondaryItalicSx}>
                  {entry.role}
                </EntrySubtitle>
              </Box>

              <Box sx={volunteeringMetaSx}>
                <StrongMetaText>
                  {entry.dateRange}
                </StrongMetaText>
                {entry.location && (
                  <BodyText sx={secondaryItalicSx}>
                    {entry.location}
                  </BodyText>
                )}
              </Box>
            </Stack>

            <BodyText>{entry.summary}</BodyText>

            <Box component="ul" sx={getDetailListSx(0, 0)}>
              {entry.highlights.map((highlight, highlightIndex) => (
                <ListItemText key={`${highlight}-${highlightIndex}`}>
                  {highlight}
                </ListItemText>
              ))}
            </Box>
          </Stack>
        </>
      )}
    />
  );
};
