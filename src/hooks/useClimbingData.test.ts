import { renderHook } from '@testing-library/react';
import { formatClimbingLocation, useClimbingData } from './useClimbingData';

jest.mock('../data/climbs', () => ({
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

    expect(ticks).toHaveLength(3);
    expect(ticks[0].route).toBe('Beta Crack');
    expect(ticks[1].route).toBe('Gamma Slab');
    expect(ticks[2].route).toBe('Alpha Wall');

    ticks.forEach((tick) => {
      expect(tick.id).toBeDefined();
      expect(typeof tick.id).toBe('string');
      expect(tick.id.length).toBeGreaterThan(0);
    });

    expect(ticks[0].location).toBe('Upper Tier, Nevada');
    expect(ticks[1].location).toBe('Lower Cheeks, Washington');
    expect(ticks[2].location).toBe('Cat Wall, Utah');
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
});
