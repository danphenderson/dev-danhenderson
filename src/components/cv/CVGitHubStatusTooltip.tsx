import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Button, Stack, Tooltip } from '@mui/material';
import { BodyText, StrongMetaText } from '../text';
import type { SharedDataStatus } from '../../types/data';

const formatStatusTimestamp = (value?: string) => {
  if (!value) {
    return null;
  }

  const resolvedDate = new Date(value);
  if (Number.isNaN(resolvedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(resolvedDate);
};

const getGitHubStatusSummary = (status: SharedDataStatus) => {
  if (status.loading) {
    return 'Loading live GitHub activity while keeping bundled fallback highlights available.';
  }

  if (status.reason === 'bundled-content') {
    return 'Showing bundled GitHub highlights because live GitHub requests are disabled in this environment.';
  }

  if (status.reason === 'partial-fallback') {
    return 'Some GitHub data sources responded while others fell back to bundled highlights.';
  }

  if (status.isFallback) {
    return 'Showing bundled fallback highlights because the live GitHub response was incomplete or unavailable.';
  }

  if (status.source === 'cache') {
    return 'Showing recent cached GitHub data from an earlier successful fetch.';
  }

  return 'Showing live GitHub activity from the latest successful fetch.';
};

const getGitHubFreshnessLabel = (status: SharedDataStatus) => {
  if (status.freshness.isStale) {
    return 'Cached data may be outdated — a fresh fetch will run on the next visit.';
  }

  return status.freshness.label;
};

export const getGitHubStatusTooltipLines = (status: SharedDataStatus) => {
  const lines = [getGitHubStatusSummary(status), getGitHubFreshnessLabel(status)];
  const formattedStatusTimestamp = formatStatusTimestamp(status.freshness.lastUpdated);

  if (formattedStatusTimestamp) {
    lines.push(`Last refreshed ${formattedStatusTimestamp}.`);
  }

  if (status.error) {
    lines.push(status.error);
  }

  if (status.sourceDetail && status.sourceDetail.some((source) => !source.ok)) {
    lines.push(
      `Partial failure: ${status.sourceDetail
        .filter((source) => !source.ok)
        .map((source) => source.label)
        .join(', ')
        .toLowerCase()} did not respond.`
    );
  }

  return lines;
};

type CVGitHubStatusTooltipProps = {
  status: SharedDataStatus;
};

export const CVGitHubStatusTooltip = ({ status }: CVGitHubStatusTooltipProps) => {
  const statusLines = getGitHubStatusTooltipLines(status);

  return (
    <Tooltip
      arrow
      enterDelay={0}
      leaveDelay={0}
      title={
        <Stack spacing={0.75} sx={{ maxWidth: 320, py: 0.25 }}>
          <StrongMetaText sx={{ color: 'inherit' }}>Data status</StrongMetaText>
          {statusLines.map((line) => (
            <BodyText key={line} sx={{ color: 'inherit' }}>
              {line}
            </BodyText>
          ))}
        </Stack>
      }
    >
      <Button
        size="small"
        variant="text"
        color="inherit"
        aria-label="GitHub data status information"
        startIcon={<InfoOutlinedIcon fontSize="small" />}
        data-testid="cv-github-status-tooltip-trigger"
        sx={{ px: 0, minWidth: 0, textTransform: 'none' }}
      >
        Data status
      </Button>
    </Tooltip>
  );
};
