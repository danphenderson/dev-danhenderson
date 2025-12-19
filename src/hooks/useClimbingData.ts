import { useMemo } from 'react';
import { ticks as tickData, todos as todoData } from '../data/climbs';
import type { Tick, Todo } from '../types/data';

export type TickRow = Tick & { id: string };
export type TodoRow = Todo & { id: string };

export function useClimbingData() {
  const ticks = useMemo<TickRow[]>(() => {
    return tickData
      .slice()
      .sort((a, b) => {
        const aDate = a.date ? new Date(a.date).getTime() : 0;
        const bDate = b.date ? new Date(b.date).getTime() : 0;
        return bDate - aDate;
      })
      .map((tick, idx) => ({
        ...tick,
        id: `${tick.date}-${tick.route}-${idx}`,
        date: tick.date ? new Date(tick.date).toLocaleDateString() : '',
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
    loading: false,
    todosLoading: false,
    error: null as string | null,
    todosError: null as string | null,
  };
}
