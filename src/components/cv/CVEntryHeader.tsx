import { Box, Chip, Stack } from '@mui/material';
import { useComponentStyles } from '../../styles/componentStyles';
import { CommonLink, COMMON_LINK_TOOLTIP_ID } from '../CommonLink';
import { EntryTitle, MetaText, StrongMetaText, ChipLabel } from '../text';

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
    cvEntryOrganizationRowSx,
    cvEntryChipGroupSx,
    cvEntryChipSx,
    minWidthResetSx,
    supportAccentStrongTextSx,
  } = useComponentStyles();
  const renderedChips = [...(chips?.length ? chips : chip ? [chip] : []), ...(
    (supportingMeta ?? []).map((label) => ({ label }))
  )].filter(({ label }) => label.trim().length > 0);

  return (
    <Stack spacing={0.75} width="100%">
      <Box sx={cvEntryTitleRowSx}>
        <EntryTitle sx={minWidthResetSx}>{title}</EntryTitle>
        {dateRange && <MetaText>{dateRange}</MetaText>}
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
            sx={[supportAccentStrongTextSx, minWidthResetSx]}
          >
            {organization}
          </CommonLink>
        ) : (
          <StrongMetaText sx={[supportAccentStrongTextSx, minWidthResetSx]}>
            {organization}
          </StrongMetaText>
        )}

        {renderedChips.length > 0 && (
          <Box sx={cvEntryChipGroupSx}>
            {renderedChips.map((entryChip, index) => (
              <Chip
                key={`${entryChip.label}-${index}`}
                size="small"
                label={<ChipLabel>{entryChip.label}</ChipLabel>}
                variant="outlined"
                sx={cvEntryChipSx}
              />
            ))}
          </Box>
        )}
      </Box>

    </Stack>
  );
};
