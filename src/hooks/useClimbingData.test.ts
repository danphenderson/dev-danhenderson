import { renderHook } from '@testing-library/react';
import { useClimbingData } from './useClimbingData';

jest.mock('../data/climbs', () => ({
  ticks: [
    { date: '2024-01-15', route: 'Alpha Wall', grade: '5.10a', location: 'Smith Rock', url: 'https://example.com/alpha' },
    { date: '2024-06-20', route: 'Beta Crack', grade: '5.11b', location: 'Red River', url: 'https://example.com/beta' },
    { date: '2024-03-10', route: 'Gamma Slab', grade: '5.9', location: 'Joshua Tree', url: 'https://example.com/gamma' },
  ],
  todos: [
    { route: 'Zebra Stripe', grade: '5.12a', location: 'Yosemite', url: 'https://example.com/zebra' },
    { route: 'Apple Arete', grade: '5.10c', location: 'Smith Rock', url: 'https://example.com/apple' },
    { route: 'Mango Move', grade: '5.11a', location: 'Red River', url: 'https://example.com/mango' },
  ],
}));

describe('useClimbingData', () => {
  it('sorts ticks descending by date and generates IDs', () => {
    const { result } = renderHook(() => useClimbingData());
    const { ticks } = result.current;

    expect(ticks).toHaveLength(3);
    expect(ticks[0].route).toBe('Beta Crack');
    expect(ticks[1].route).toBe('Gamma Slab');
    expect(ticks[2].route).toBe('Alpha Wall');

    ticks.forEach((tick) => {
      expect(tick.id).toBeDefined();
      expect(typeof tick.id).toBe('string');
      expect(tick.id.length).toBeGreaterThan(0);
    });
  });

  it('formats tick dates as UTC calendar strings', () => {
    const { result } = renderHook(() => useClimbingData());
    const { ticks } = result.current;

    ticks.forEach((tick) => {
      expect(tick.date).not.toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  it('sorts todos alphabetically by route and generates IDs', () => {
    const { result } = renderHook(() => useClimbingData());
    const { todos } = result.current;

    expect(todos).toHaveLength(3);
    expect(todos[0].route).toBe('Apple Arete');
    expect(todos[1].route).toBe('Mango Move');
    expect(todos[2].route).toBe('Zebra Stripe');

    todos.forEach((todo) => {
      expect(todo.id).toBeDefined();
      expect(typeof todo.id).toBe('string');
      expect(todo.id.length).toBeGreaterThan(0);
    });
  });
});
