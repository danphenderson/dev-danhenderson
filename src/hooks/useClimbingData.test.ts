import { renderHook } from '@testing-library/react';
import { useClimbingData, normalizeGrade } from './useClimbingData';

jest.mock('../data/climbs', () => ({
  ticks: [
    { date: '2024-01-15', route: 'Alpha Wall', grade: '5.10a', location: 'Smith Rock', url: 'https://example.com/alpha' },
    { date: '2024-06-20', route: 'Beta Crack', grade: '5.11b', location: 'Red River', url: 'https://example.com/beta' },
    { date: '2024-03-10', route: 'Gamma Slab', grade: '5.9', location: 'Joshua Tree', url: 'https://example.com/gamma' },
    { date: '2024-06-20', route: 'Delta Route', grade: '5.10c R', location: 'Smith Rock', url: 'https://example.com/delta' },
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

    expect(ticks).toHaveLength(4);
    expect(ticks[0].route).toBe('Beta Crack');
    expect(ticks[1].route).toBe('Delta Route');
    expect(ticks[ticks.length - 1].route).toBe('Alpha Wall');

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

  describe('analytics', () => {
    it('reports correct overview totals', () => {
      const { result } = renderHook(() => useClimbingData());
      const { overview } = result.current.analytics;

      expect(overview.tickCount).toBe(4);
      expect(overview.todoCount).toBe(3);
      expect(overview.uniqueLocations).toBeGreaterThanOrEqual(3);
      expect(overview.mostRecentDate).toBeTruthy();
      // Most recent is 2024-06-20 formatted
      expect(overview.mostRecentDate).not.toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('builds grade buckets that cover all tick and todo grades', () => {
      const { result } = renderHook(() => useClimbingData());
      const { gradeProfile } = result.current.analytics;

      // Ticks have 5.10a, 5.11b, 5.9, 5.10c R → buckets 5.9, 5.10, 5.11
      // Todos have 5.12a, 5.10c, 5.11a → buckets 5.10, 5.11, 5.12
      const bucketNames = gradeProfile.map((g) => g.bucket);
      expect(bucketNames).toContain('5.9');
      expect(bucketNames).toContain('5.10');
      expect(bucketNames).toContain('5.11');
      expect(bucketNames).toContain('5.12');

      // Verify counts
      const b510 = gradeProfile.find((g) => g.bucket === '5.10');
      expect(b510).toBeDefined();
      expect(b510!.tickCount).toBe(2); // 5.10a + 5.10c R
      expect(b510!.todoCount).toBe(1); // 5.10c

      const b59 = gradeProfile.find((g) => g.bucket === '5.9');
      expect(b59).toBeDefined();
      expect(b59!.tickCount).toBe(1);
      expect(b59!.todoCount).toBe(0);
    });

    it('sorts grade buckets in canonical climbing order', () => {
      const { result } = renderHook(() => useClimbingData());
      const { gradeProfile } = result.current.analytics;

      const bucketNames = gradeProfile.map((g) => g.bucket);
      const idx59 = bucketNames.indexOf('5.9');
      const idx510 = bucketNames.indexOf('5.10');
      const idx511 = bucketNames.indexOf('5.11');
      const idx512 = bucketNames.indexOf('5.12');
      expect(idx59).toBeLessThan(idx510);
      expect(idx510).toBeLessThan(idx511);
      expect(idx511).toBeLessThan(idx512);
    });

    it('ranks top tick locations by frequency', () => {
      const { result } = renderHook(() => useClimbingData());
      const { topTickLocations } = result.current.analytics.destinationProfile;

      expect(topTickLocations.length).toBeGreaterThan(0);
      // Smith Rock has 2 ticks, others have 1
      expect(topTickLocations[0].location).toBe('Smith Rock');
      expect(topTickLocations[0].count).toBe(2);

      // Verify descending order
      for (let i = 1; i < topTickLocations.length; i++) {
        expect(topTickLocations[i].count).toBeLessThanOrEqual(topTickLocations[i - 1].count);
      }
    });

    it('ranks top todo locations by frequency', () => {
      const { result } = renderHook(() => useClimbingData());
      const { topTodoLocations } = result.current.analytics.destinationProfile;

      expect(topTodoLocations.length).toBeGreaterThan(0);
      // All todo locations appear once, so sorted alphabetically as tiebreaker
      topTodoLocations.forEach((loc) => {
        expect(loc.count).toBe(1);
      });
    });
  });

  describe('status', () => {
    it('reports data freshness from the most recent tick date', () => {
      const { result } = renderHook(() => useClimbingData());
      const { status } = result.current;

      expect(status.dataFreshness).toContain('Tick data current through');
      // Should not contain raw ISO format
      expect(status.dataFreshness).not.toMatch(/\d{4}-\d{2}-\d{2}/);
    });
  });
});

describe('normalizeGrade', () => {
  it('extracts YDS base grade', () => {
    expect(normalizeGrade('5.10a')).toBe('5.10');
    expect(normalizeGrade('5.11b/c')).toBe('5.11');
    expect(normalizeGrade('5.12+ PG13')).toBe('5.12');
    expect(normalizeGrade('5.9 R')).toBe('5.9');
  });

  it('extracts V-scale base grade', () => {
    expect(normalizeGrade('V3')).toBe('V3');
    expect(normalizeGrade('V7-')).toBe('V7');
    expect(normalizeGrade('V0')).toBe('V0');
  });

  it('returns raw value for unrecognized grades', () => {
    expect(normalizeGrade('unknown')).toBe('unknown');
  });
});
