import { Box } from '@mui/material';
import type { VolunteeringEntry } from '../../types/cv';
import { AnimatedContentList } from '../AnimatedContentList';
import { useComponentStyles } from '../../styles/componentStyles';
import { BodyText, ListItemText } from '../text';
import { CVEntryHeader } from './CVEntryHeader';

type VolunteeringListProps = {
  volunteering: VolunteeringEntry[];
  startDelayMs?: number;
};

export const VolunteeringList = ({ volunteering, startDelayMs = 0 }: VolunteeringListProps) => {
  const { contentListStackSpacing, getDetailListSx } = useComponentStyles();

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
          <CVEntryHeader
            title={entry.role}
            organization={entry.organization}
            organizationUrl={entry.organizationUrl}
            organizationTooltip={entry.organizationTooltip}
            dateRange={entry.dateRange}
            supportingMeta={entry.location ? [entry.location] : undefined}
          />

          <BodyText>{entry.summary}</BodyText>

          <Box component="ul" sx={getDetailListSx(0, 0)}>
            {entry.highlights.map((highlight, highlightIndex) => (
              <ListItemText key={`${highlight}-${highlightIndex}`}>{highlight}</ListItemText>
            ))}
          </Box>
        </>
      )}
    />
  );
};
