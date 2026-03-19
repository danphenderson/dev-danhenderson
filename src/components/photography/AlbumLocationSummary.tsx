import PlaceIcon from '@mui/icons-material/Place';
import { Chip, Stack } from '@mui/material';
import type { PhotoItem } from '../../types/data';
import { SecondaryBodyText } from '../text';

type AlbumLocationSummaryProps = {
  albumLocation?: string;
  dateRange?: string;
  photos: PhotoItem[];
};

function getUniqueLocations(photos: PhotoItem[]): string[] {
  const seen = new Set<string>();
  const locations: string[] = [];

  for (const photo of photos) {
    if (photo.location && !seen.has(photo.location)) {
      seen.add(photo.location);
      locations.push(photo.location);
    }
  }

  return locations;
}

export function AlbumLocationSummary({
  albumLocation,
  dateRange,
  photos,
}: AlbumLocationSummaryProps) {
  const uniqueLocations = getUniqueLocations(photos);

  if (!albumLocation && !dateRange && uniqueLocations.length === 0) {
    return null;
  }

  return (
    <Stack spacing={1}>
      {(albumLocation || dateRange) && (
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          {albumLocation && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PlaceIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <SecondaryBodyText>{albumLocation}</SecondaryBodyText>
            </Stack>
          )}
          {dateRange && <SecondaryBodyText>· {dateRange}</SecondaryBodyText>}
        </Stack>
      )}
      {uniqueLocations.length > 1 && (
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          {uniqueLocations.map((location) => (
            <Chip
              key={location}
              label={location}
              size="small"
              variant="outlined"
              icon={<PlaceIcon />}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
