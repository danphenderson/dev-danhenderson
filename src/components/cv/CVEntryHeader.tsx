import { Fragment } from 'react';
import { Box, Chip, Stack } from '@mui/material';
import { useComponentStyles } from '../../styles/componentStyles';
import { CommonLink, COMMON_LINK_TOOLTIP_ID } from '../CommonLink';
import { Text } from '../text';

type CVEntryChip = {
  label: string;
};

type CVEntryHeaderProps = {
  title: string;
  organization: string;
  organizationUrl?: string;
  organizationTooltip?: string;
  dateRange?: string;
  chip?: CVEntryChip;
  chips?: CVEntryChip[];
  supportingMeta?: string[];
};

export const CVEntryHeader = ({
  title,
  organization,
  organizationUrl,
  organizationTooltip,
  dateRange,
  chip,
  chips,
  supportingMeta,
}: CVEntryHeaderProps) => {
  const {
    cvEntryTitleRowSx,
    cvEntryTitleTextSx,
    cvEntryDateRangeSx,
    cvEntryOrganizationRowSx,
    cvEntryChipGroupSx,
    cvEntryChipSx,
    cvEntrySupportingMetaSx,
    minWidthResetSx,
  } = useComponentStyles();
  const renderedChips = chips?.length ? chips : chip ? [chip] : [];

  return (
    <Stack spacing={0.75} width="100%">
      <Box sx={cvEntryTitleRowSx}>
        <Text role="cardTitle" sx={[cvEntryTitleTextSx, minWidthResetSx]}>
          {title}
        </Text>
        {dateRange && (
          <Text role="meta" sx={cvEntryDateRangeSx}>
            {dateRange}
          </Text>
        )}
      </Box>

      <Box sx={cvEntryOrganizationRowSx}>
        {organizationUrl ? (
          <CommonLink
            href={organizationUrl}
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            underline="hover"
            variant="subtitle2"
            data-tooltip-id={organizationTooltip ? COMMON_LINK_TOOLTIP_ID : undefined}
            data-tooltip-content={organizationTooltip}
            data-tooltip-place={organizationTooltip ? 'top' : undefined}
            sx={[{ color: 'secondary.main', fontWeight: 700 }, minWidthResetSx]}
          >
            {organization}
          </CommonLink>
        ) : (
          <Text role="metaStrong" tone="support" sx={minWidthResetSx}>
            {organization}
          </Text>
        )}

        {renderedChips.length > 0 && (
          <Box sx={cvEntryChipGroupSx}>
            {renderedChips.map((entryChip, index) => (
              <Chip
                key={`${entryChip.label}-${index}`}
                size="small"
                label={
                  <Text role="inlineLabel" component="span">
                    {entryChip.label}
                  </Text>
                }
                variant="outlined"
                sx={cvEntryChipSx}
              />
            ))}
          </Box>
        )}
      </Box>

      {supportingMeta && supportingMeta.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={cvEntrySupportingMetaSx}>
          {supportingMeta.map((meta, index) => (
            <Fragment key={`${meta}-${index}`}>
              {index > 0 && <Text role="meta">•</Text>}
              <Text role="meta">{meta}</Text>
            </Fragment>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
