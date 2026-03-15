import { renderHook } from '@testing-library/react';
import {
  formatClimbingLocation,
  normalizeGrade,
  useClimbingData,
} from '../../../src/hooks/useClimbingData';

jest.mock('../../../src/data/climbs', () => ({
  ticks: [
    {
      date: '2024-01-15',
      route: 'Alpha Wall',
      grade: '5.10a',
      location: 'Utah > Southeast Utah > Indian Creek > Cat Wall',
      url: 'https://example.com/alpha',
    },
    {
      date: '2024-06-20',
      route: 'Beta Crack',
      grade: '5.11b',
      location:
        'Nevada > Southern Nevada > Red Rocks > Calico Basin > Red Spring > Moderate Mecca > Upper Tier',
      url: 'https://example.com/beta',
    },
    {
      date: '2024-03-10',
      route: 'Gamma Slab',
      grade: '5.9',
      location:
        'Washington > Central-West Cascades & Seattle > Skykomish Valley > Index > The Cheeks > (2) Lower Cheeks',
      url: 'https://example.com/gamma',
    },
    {
      date: '2024-06-20',
      route: 'Delta Route',
      grade: '5.10c R',
      location: 'Utah > Southeast Utah > Indian Creek > Cat Wall',
      url: 'https://example.com/delta',
    },
  ],
  todos: [
    {
      route: 'Zebra Stripe',
      grade: '5.12a',
      location: 'Leavenworth',
      url: 'https://example.com/zebra',
    },
    {
      route: 'Apple Arete',
      grade: '5.10c',
      location:
        'Utah > South Central Utah > San Rafael Swell > San Rafael Swell - South > Eastern Reef Area.. AKA The Sandstone Alps > O Crags (Three Finger Canyon)',
      url: 'https://example.com/apple',
    },
    {
      route: 'Mango Move',
      grade: '5.11a',
      location: 'Smith Rock',
      url: 'https://example.com/mango',
    },
  ],
}));

describe('useClimbingData', () => {
  it('formats Mountain Project area paths into concise labels', () => {
    expect(
      formatClimbingLocation(
        'Utah > South Central Utah > San Rafael Swell > San Rafael Swell - South > Eastern Reef Area.. AKA The Sandstone Alps > O Crags (Three Finger Canyon)'
      )
    ).toBe('O Crags (Three Finger Canyon), Utah');
    expect(formatClimbingLocation('Utah > Southeast Utah > Indian Creek > Cat Wall')).toBe(
      'Cat Wall, Utah'
    );
    expect(
      formatClimbingLocation(
        'Nevada > Southern Nevada > Red Rocks > Calico Basin > Red Spring > Moderate Mecca > Upper Tier'
      )
    ).toBe('Upper Tier, Nevada');
    expect(
      formatClimbingLocation(
        'Washington > Central-West Cascades & Seattle > Skykomish Valley > Index > The Cheeks > (2) Lower Cheeks'
      )
    ).toBe('Lower Cheeks, Washington');
    expect(formatClimbingLocation('Leavenworth')).toBe('Leavenworth');
  });

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

    expect(ticks[0].location).toBe('Upper Tier, Nevada');
    expect(ticks[1].location).toBe('Cat Wall, Utah');
    expect(ticks[2].location).toBe('Lower Cheeks, Washington');
    expect(ticks[3].location).toBe('Cat Wall, Utah');
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

    expect(todos[0].location).toBe('O Crags (Three Finger Canyon), Utah');
    expect(todos[1].location).toBe('Smith Rock');
    expect(todos[2].location).toBe('Leavenworth');
  });

  it('reports bundled climbing dataset status and recency', () => {
    const { result } = renderHook(() => useClimbingData());

    expect(result.current.status).toMatchObject({
      source: 'static',
      loading: false,
      isFallback: false,
      reason: 'bundled-content',
      freshness: {
        lastUpdated: '2024-06-20',
        isStale: false,
      },
    });
    expect(result.current.status.freshness.label).toContain('updated through');
  });

  describe('analytics', () => {
    it('reports overview totals and most recent date', () => {
      const { result } = renderHook(() => useClimbingData());
      const { overview } = result.current.analytics;

      expect(overview.tickCount).toBe(4);
      expect(overview.todoCount).toBe(3);
      expect(overview.uniqueLocations).toBe(6);
      expect(overview.mostRecentDate).toBeTruthy();
      expect(overview.mostRecentDate).not.toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('builds grade buckets across tick and todo grades', () => {
      const { result } = renderHook(() => useClimbingData());
      const { gradeProfile } = result.current.analytics;

      const buckets = gradeProfile.map((grade) => grade.bucket);
      expect(buckets).toContain('5.9');
      expect(buckets).toContain('5.10');
      expect(buckets).toContain('5.11');
      expect(buckets).toContain('5.12');

      const fiveTen = gradeProfile.find((grade) => grade.bucket === '5.10');
      expect(fiveTen).toBeDefined();
      expect(fiveTen!.tickCount).toBe(2);
      expect(fiveTen!.todoCount).toBe(1);

      const fiveNine = gradeProfile.find((grade) => grade.bucket === '5.9');
      expect(fiveNine).toBeDefined();
      expect(fiveNine!.tickCount).toBe(1);
      expect(fiveNine!.todoCount).toBe(0);
    });

    it('sorts grade buckets in canonical climbing order', () => {
      const { result } = renderHook(() => useClimbingData());
      const { gradeProfile } = result.current.analytics;

      const bucketNames = gradeProfile.map((grade) => grade.bucket);
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
      expect(topTickLocations[0].location).toBe('Cat Wall, Utah');
      expect(topTickLocations[0].count).toBe(2);

      for (let i = 1; i < topTickLocations.length; i += 1) {
        expect(topTickLocations[i].count).toBeLessThanOrEqual(topTickLocations[i - 1].count);
      }
    });

    it('ranks top todo locations by frequency', () => {
      const { result } = renderHook(() => useClimbingData());
      const { topTodoLocations } = result.current.analytics.destinationProfile;

      expect(topTodoLocations.length).toBeGreaterThan(0);
      topTodoLocations.forEach((location) => {
        expect(location.count).toBe(1);
      });
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
