import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useWebVitals, type WebVitalEntry } from '../hooks/useWebVitals';
import { buildInfo } from '../utils/buildInfo';

const ratingColor: Record<WebVitalEntry['rating'], 'success' | 'warning' | 'error'> = {
  good: 'success',
  'needs-improvement': 'warning',
  poor: 'error',
};

const vitalLabels: Record<string, { label: string; unit: string; description: string }> = {
  CLS: {
    label: 'Cumulative Layout Shift',
    unit: '',
    description: 'Measures visual stability. Lower is better.',
  },
  INP: {
    label: 'Interaction to Next Paint',
    unit: 'ms',
    description: 'Measures responsiveness. Lower is better.',
  },
  LCP: {
    label: 'Largest Contentful Paint',
    unit: 'ms',
    description: 'Measures loading performance. Lower is better.',
  },
  TTFB: {
    label: 'Time to First Byte',
    unit: 'ms',
    description: 'Measures server responsiveness. Lower is better.',
  },
};

const EXPECTED_VITALS = ['LCP', 'CLS', 'INP', 'TTFB'];

const formatValue = (name: string, value: number): string => {
  if (name === 'CLS') return value.toFixed(3);
  return `${Math.round(value)} ms`;
};

const formatBuildTime = (iso: string): string => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

function VitalRow({ entry }: { entry: WebVitalEntry }) {
  const meta = vitalLabels[entry.name];
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75 }}>
      <Tooltip title={meta?.description ?? ''} placement="left" arrow>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {entry.name}
          <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.75 }}>
            {meta?.label ?? ''}
          </Typography>
        </Typography>
      </Tooltip>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
          {formatValue(entry.name, entry.value)}
        </Typography>
        <Chip label={entry.rating} color={ratingColor[entry.rating]} size="small" variant="outlined" />
      </Box>
    </Box>
  );
}

function VitalPlaceholder({ name }: { name: string }) {
  const meta = vitalLabels[name];
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75 }}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {name}
        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.75 }}>
          {meta?.label ?? ''}
        </Typography>
      </Typography>
      <Skeleton width={80} height={24} />
    </Box>
  );
}

export function PerformanceScorecard() {
  const [open, setOpen] = useState(false);
  const { metrics } = useWebVitals();

  return (
    <>
      <Tooltip title="Performance & build info" arrow>
        <IconButton
          onClick={() => setOpen(true)}
          size="small"
          aria-label="Open performance scorecard"
          sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="performance-scorecard-title"
      >
        <DialogTitle id="performance-scorecard-title">Performance & Build Info</DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 }, pb: 3 }}>
          {/* Build info section */}
          <Typography variant="overline" color="text.secondary">
            Build
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
            <InfoRow label="Version" value={buildInfo.version} />
            <InfoRow label="Commit" value={buildInfo.gitSha} mono />
            <InfoRow label="Built" value={formatBuildTime(buildInfo.buildTime)} />
            <InfoRow label="Environment" value={buildInfo.nodeEnv} />
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Web Vitals section */}
          <Typography variant="overline" color="text.secondary">
            Core Web Vitals
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            {EXPECTED_VITALS.map((name) => {
              const entry = metrics.get(name);
              return entry ? (
                <VitalRow key={name} entry={entry} />
              ) : (
                <VitalPlaceholder key={name} name={name} />
              );
            })}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
            Vitals are measured in real time for this session. Some metrics (INP) require user
            interaction before they appear.
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.25 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontWeight: 500, ...(mono ? { fontFamily: 'monospace' } : {}) }}
      >
        {value}
      </Typography>
    </Box>
  );
}
