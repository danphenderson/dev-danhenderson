import { Box } from '@mui/material';
import type { VolunteeringEntry } from '../../types/cv';
import { AnimatedSlideList } from '../AnimatedSlideList';
import { AnimatedContentList } from '../AnimatedContentList';
import { TabPanel } from '../TabPanel';
import type { TabPanelItem, TabPanelRenderContext } from '../TabPanel';
import { useComponentStyles } from '../../styles/componentStyles';
import { BodyText, ListItemText } from '../text';
import { CVEntryHeader } from './CVEntryHeader';

type VolunteeringListProps = {
  volunteering: VolunteeringEntry[];
  startDelayMs?: number;
};

const VolunteeringDetailList = ({
  items,
  selected,
  renderContext,
}: {
  items: string[];
  selected: boolean;
  renderContext: TabPanelRenderContext;
}) => {
  const { getDetailListSx } = useComponentStyles();

  return (
    <AnimatedSlideList
      items={items}
      getItemKey={(item, index) => `${item}-${index}`}
      in={selected}
      container={renderContext.getDrawerContainer}
      containerComponent="ul"
      containerSx={getDetailListSx(0, 0)}
      itemComponent="li"
      renderItem={(item) => <ListItemText component="span">{item}</ListItemText>}
    />
  );
};

export const VolunteeringList = ({ volunteering, startDelayMs = 0 }: VolunteeringListProps) => {
  const { contentListStackSpacing, detailBlockSx } = useComponentStyles();

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
      renderItem={(entry, index) => {
        const volunteeringTabs: TabPanelItem[] = entry.highlights.length
          ? [
              {
                value: 'details',
                label: 'Details',
                renderContent: (selected, renderContext) => (
                  <VolunteeringDetailList
                    items={entry.highlights}
                    selected={selected}
                    renderContext={renderContext}
                  />
                ),
              },
            ]
          : [];

        return (
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

            {volunteeringTabs.length ? (
              <Box sx={detailBlockSx}>
                <TabPanel
                  id={`volunteering-details-${index}`}
                  ariaLabel={`${entry.role} details`}
                  items={volunteeringTabs}
                  dense
                  tabsVariant="fullWidth"
                />
              </Box>
            ) : null}
          </>
        );
      }}
    />
  );
};
