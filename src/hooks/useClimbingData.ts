import { useMemo } from 'react';
import { ticks as tickData, todos as todoData } from '../data/climbs';
import type { Tick, Todo } from '../types/data';
import { formatIsoDateAsUtcCalendar, getIsoDateUtcTimestamp } from '../utils/date';

export type TickRow = Tick & { id: string };
export type TodoRow = Todo & { id: string };

export type GradeBucket = {
  bucket: string;
  tickCount: number;
  todoCount: number;
};

export type LocationCount = {
  location: string;
  count: number;
};

export type ClimbingAnalytics = {
  overview: {
    tickCount: number;
    todoCount: number;
    uniqueLocations: number;
    mostRecentDate: string;
  };
  gradeProfile: GradeBucket[];
  destinationProfile: {
    topTickLocations: LocationCount[];
    topTodoLocations: LocationCount[];
  };
};

export type ClimbingStatus = {
  dataFreshness: string;
};

/* ── helpers ─────────────────────────────────────────────── */

const GRADE_ORDER = [
  '5.6', '5.7', '5.8', '5.9', '5.10', '5.11', '5.12', '5.13', '5.14',
  'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10',
];

const YDS_RE = /^(5\.\d+)/;
const V_RE = /^(V\d+)/;

export function normalizeGrade(raw: string): string {
  const yds = YDS_RE.exec(raw);
  if (yds) return yds[1];
  const v = V_RE.exec(raw);
  if (v) return v[1];
  return raw;
}

function topLocations(items: { location: string }[], limit: number): LocationCount[] {
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    counts[item.location] = (counts[item.location] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([location, count]) => ({ location, count }));
}

function buildGradeProfile(
  ticks: readonly { grade: string }[],
  todos: readonly { grade: string }[],
): GradeBucket[] {
  const tickCounts: Record<string, number> = {};
  const todoCounts: Record<string, number> = {};

  ticks.forEach((t) => {
    const bucket = normalizeGrade(t.grade);
    tickCounts[bucket] = (tickCounts[bucket] || 0) + 1;
  });
  todos.forEach((t) => {
    const bucket = normalizeGrade(t.grade);
    todoCounts[bucket] = (todoCounts[bucket] || 0) + 1;
  });

  const allBuckets = new Set([...Object.keys(tickCounts), ...Object.keys(todoCounts)]);
  return Array.from(allBuckets)
    .sort((a, b) => {
      const ai = GRADE_ORDER.indexOf(a);
      const bi = GRADE_ORDER.indexOf(b);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.localeCompare(b);
    })
    .map((bucket) => ({
      bucket,
      tickCount: tickCounts[bucket] || 0,
      todoCount: todoCounts[bucket] || 0,
    }));
}

const TOP_LOCATIONS_LIMIT = 5;

/* ── hook ────────────────────────────────────────────────── */

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
      }));
  }, []);

  const todos = useMemo<TodoRow[]>(() => {
    return todoData
      .slice()
      .sort((a, b) => a.route.localeCompare(b.route))
      .map((todo, idx) => ({
        ...todo,
        id: `${todo.route}-${idx}`,
      }));
  }, []);

  const analytics = useMemo<ClimbingAnalytics>(() => {
    const allLocations = new Set([
      ...tickData.map((t) => t.location),
      ...todoData.map((t) => t.location),
    ]);

    const sortedDates = tickData
      .map((t) => t.date)
      .filter(Boolean)
      .sort((a, b) => getIsoDateUtcTimestamp(b) - getIsoDateUtcTimestamp(a));

    const mostRecentDate = sortedDates.length > 0
      ? formatIsoDateAsUtcCalendar(sortedDates[0])
      : '';

    return {
      overview: {
        tickCount: tickData.length,
        todoCount: todoData.length,
        uniqueLocations: allLocations.size,
        mostRecentDate,
      },
      gradeProfile: buildGradeProfile(tickData, todoData),
      destinationProfile: {
        topTickLocations: topLocations(tickData, TOP_LOCATIONS_LIMIT),
        topTodoLocations: topLocations(todoData, TOP_LOCATIONS_LIMIT),
      },
    };
  }, []);

  const status = useMemo<ClimbingStatus>(() => {
    const sortedDates = tickData
      .map((t) => t.date)
      .filter(Boolean)
      .sort((a, b) => getIsoDateUtcTimestamp(b) - getIsoDateUtcTimestamp(a));

    const latestDate = sortedDates[0];
    if (!latestDate) return { dataFreshness: 'No tick data available.' };

    return {
      dataFreshness: `Tick data current through ${formatIsoDateAsUtcCalendar(latestDate)}.`,
    };
  }, []);

  return {
    ticks,
    todos,
    analytics,
    status,
  };
}
