import { useMemo } from 'react';
import { ticks as tickData, todos as todoData } from '../data/climbs';
import type {
  ClimbingAnalytics,
  GradeBucket,
  LocationCount,
  SharedDataStatus,
  TickRow,
  TodoRow,
} from '../types/data';
import { formatIsoDateAsUtcCalendar, getIsoDateUtcTimestamp } from '../utils/date';

export type { ClimbingAnalytics, GradeBucket, LocationCount, TickRow, TodoRow };

const GRADE_ORDER = [
  '5.6',
  '5.7',
  '5.8',
  '5.9',
  '5.10',
  '5.11',
  '5.12',
  '5.13',
  '5.14',
  'V0',
  'V1',
  'V2',
  'V3',
  'V4',
  'V5',
  'V6',
  'V7',
  'V8',
  'V9',
  'V10',
];

const YDS_RE = /^(5\.\d+)/;
const V_RE = /^(V\d+)/;

const TOP_LOCATIONS_LIMIT = 5;

const CLIMBING_LOCATION_SEPARATOR = '>';
const CLIMBING_LOCATION_INDEX_PREFIX = /^\([^)]+\)\s*/;

function cleanClimbingLocationSegment(segment: string) {
  return segment.replace(CLIMBING_LOCATION_INDEX_PREFIX, '').trim();
}

export function normalizeGrade(raw: string): string {
  const yds = YDS_RE.exec(raw);
  if (yds) {
    return yds[1];
  }

  const boulder = V_RE.exec(raw);
  if (boulder) {
    return boulder[1];
  }

  return raw;
}

function topLocations(items: readonly { location: string }[], limit: number): LocationCount[] {
  const counts: Record<string, number> = {};

  items.forEach((item) => {
    const location = formatClimbingLocation(item.location);
    counts[location] = (counts[location] ?? 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([location, count]) => ({ location, count }));
}

function buildGradeProfile(
  ticks: readonly { grade: string }[],
  todos: readonly { grade: string }[]
): GradeBucket[] {
  const tickCounts: Record<string, number> = {};
  const todoCounts: Record<string, number> = {};

  ticks.forEach((tick) => {
    const bucket = normalizeGrade(tick.grade);
    tickCounts[bucket] = (tickCounts[bucket] ?? 0) + 1;
  });

  todos.forEach((todo) => {
    const bucket = normalizeGrade(todo.grade);
    todoCounts[bucket] = (todoCounts[bucket] ?? 0) + 1;
  });

  const allBuckets = new Set([...Object.keys(tickCounts), ...Object.keys(todoCounts)]);

  return Array.from(allBuckets)
    .sort((a, b) => {
      const aIndex = GRADE_ORDER.indexOf(a);
      const bIndex = GRADE_ORDER.indexOf(b);

      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }

      if (aIndex !== -1) {
        return -1;
      }

      if (bIndex !== -1) {
        return 1;
      }

      return a.localeCompare(b);
    })
    .map((bucket) => ({
      bucket,
      tickCount: tickCounts[bucket] ?? 0,
      todoCount: todoCounts[bucket] ?? 0,
    }));
}

export function formatClimbingLocation(location: string) {
  const parts = location
    .split(CLIMBING_LOCATION_SEPARATOR)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return location.trim();
  }

  const state = cleanClimbingLocationSegment(parts[0]);
  const area = cleanClimbingLocationSegment(parts[parts.length - 1]);

  if (parts.length === 1 || area.length === 0 || area === state) {
    return area || state || location.trim();
  }

  return `${area}, ${state}`;
}

export function useClimbingData() {
  const ticks = useMemo<TickRow[]>(() => {
    return tickData
      .slice()
      .sort((a, b) => {
        const aDate = getIsoDateUtcTimestamp(a.date);
        const bDate = getIsoDateUtcTimestamp(b.date);
        return bDate - aDate;
      })
      .map((tick, idx) => ({
        ...tick,
        id: `${tick.date}-${tick.route}-${idx}`,
        date: formatIsoDateAsUtcCalendar(tick.date),
        location: formatClimbingLocation(tick.location),
      }));
  }, []);

  const todos = useMemo<TodoRow[]>(() => {
    return todoData
      .slice()
      .sort((a, b) => a.route.localeCompare(b.route))
      .map((todo, idx) => ({
        ...todo,
        id: `${todo.route}-${idx}`,
        location: formatClimbingLocation(todo.location),
      }));
  }, []);

  const analytics = useMemo<ClimbingAnalytics>(() => {
    const allLocations = new Set([
      ...tickData.map((tick) => formatClimbingLocation(tick.location)),
      ...todoData.map((todo) => formatClimbingLocation(todo.location)),
    ]);

    const mostRecentTick = tickData.reduce<string | undefined>((latest, tick) => {
      if (!latest) {
        return tick.date;
      }

      return getIsoDateUtcTimestamp(tick.date) > getIsoDateUtcTimestamp(latest)
        ? tick.date
        : latest;
    }, undefined);

    return {
      overview: {
        tickCount: tickData.length,
        todoCount: todoData.length,
        uniqueLocations: allLocations.size,
        mostRecentDate: mostRecentTick ? formatIsoDateAsUtcCalendar(mostRecentTick) : '',
      },
      gradeProfile: buildGradeProfile(tickData, todoData),
      destinationProfile: {
        topTickLocations: topLocations(tickData, TOP_LOCATIONS_LIMIT),
        topTodoLocations: topLocations(todoData, TOP_LOCATIONS_LIMIT),
      },
    };
  }, []);

  const status = useMemo<SharedDataStatus>(() => {
    const mostRecentTick = tickData.reduce<string | undefined>((latest, tick) => {
      if (!latest) {
        return tick.date;
      }

      return getIsoDateUtcTimestamp(tick.date) > getIsoDateUtcTimestamp(latest)
        ? tick.date
        : latest;
    }, undefined);

    return {
      source: 'static',
      loading: false,
      error: null,
      isFallback: false,
      reason: 'bundled-content',
      freshness: {
        label: mostRecentTick
          ? `Bundled climbing log updated through ${formatIsoDateAsUtcCalendar(mostRecentTick)}.`
          : 'Bundled climbing log data is available in the client build.',
        lastUpdated: mostRecentTick,
        isStale: false,
      },
    };
  }, []);

  return {
    ticks,
    todos,
    analytics,
    status,
  };
}
