import { Fragment } from 'react';
import { Box, Chip, Link, Stack } from '@mui/material';
import { useComponentStyles } from '../../styles/componentStyles';
import { EntryTitle, MetaText, StrongMetaText, ChipLabel } from '../text';

type CVEntryHeaderProps = {
  title: string;
  organization: string;
  organizationUrl?: string;
  dateRange?: string;
  chip?: { label: string };
  supportingMeta?: string[];
};

export const CVEntryHeader = ({
  title,
  organization,
  organizationUrl,
  dateRange,
  chip,
  supportingMeta,
}: CVEntryHeaderProps) => {
  const {
    cvEntryHeaderRowSx,
    cvEntryChipSx,
    cvEntrySupportingMetaSx,
    minWidthResetSx,
    secondaryStrongSx,
  } = useComponentStyles();

  return (
    <Stack spacing={0.75} width="100%">
      <Box sx={cvEntryHeaderRowSx}>
        <EntryTitle sx={minWidthResetSx}>{title}</EntryTitle>
        {dateRange && <MetaText>{dateRange}</MetaText>}
      </Box>

      <Box sx={cvEntryHeaderRowSx}>
        {organizationUrl ? (
          <Link
            href={organizationUrl}
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            underline="hover"
            variant="subtitle2"
            sx={secondaryStrongSx}
          >
            {organization}
          </Link>
        ) : (
          <StrongMetaText>{organization}</StrongMetaText>
        )}
        {chip && (
          <Chip
            size="small"
            label={<ChipLabel>{chip.label}</ChipLabel>}
            variant="outlined"
            sx={cvEntryChipSx}
          />
        )}
      </Box>

      {supportingMeta && supportingMeta.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={cvEntrySupportingMetaSx}>
          {supportingMeta.map((meta, index) => (
            <Fragment key={index}>
              {index > 0 && <MetaText>•</MetaText>}
              <MetaText>{meta}</MetaText>
            </Fragment>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
