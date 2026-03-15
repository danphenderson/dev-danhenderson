import { useMemo } from 'react';
import { ticks as tickData, todos as todoData } from '../data/climbs';
import type { SharedDataStatus, Tick, Todo } from '../types/data';
import { formatIsoDateAsUtcCalendar, getIsoDateUtcTimestamp } from '../utils/date';

export type TickRow = Tick & { id: string };
export type TodoRow = Todo & { id: string };

const CLIMBING_LOCATION_SEPARATOR = '>';
const CLIMBING_LOCATION_INDEX_PREFIX = /^\([^)]+\)\s*/;

function cleanClimbingLocationSegment(segment: string) {
  return segment.replace(CLIMBING_LOCATION_INDEX_PREFIX, '').trim();
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
    status,
  };
}
