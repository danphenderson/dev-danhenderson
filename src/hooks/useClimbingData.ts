import { useMemo } from 'react';
import { ticks as tickData, todos as todoData } from '../data/climbs';
import type { Tick, Todo } from '../types/data';
import { formatIsoDateAsUtcCalendar, getIsoDateUtcTimestamp } from '../utils/date';

export type TickRow = Tick & { id: string };
export type TodoRow = Todo & { id: string };

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

  return {
    ticks,
    todos,
  };
}
