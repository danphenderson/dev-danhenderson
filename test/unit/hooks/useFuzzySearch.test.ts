import { renderHook, act } from '@testing-library/react';
import { useFuzzySearch } from '../../../src/hooks/useFuzzySearch';

const rows = [
  { id: '1', route: 'Hyperspace', location: 'Leavenworth, Washington' },
  { id: '2', route: 'Angel', location: 'Tumwater Canyon, Washington' },
  { id: '3', route: 'The Tooth', location: 'Alpental, Washington' },
  { id: '4', route: 'Outer Space', location: 'Snow Creek Wall, Washington' },
  { id: '5', route: 'Damnation Crack', location: 'Cat Wall, Utah' },
];

const keys = ['route', 'location'];

describe('useFuzzySearch', () => {
  it('returns all rows when search is empty', () => {
    const { result } = renderHook(() => useFuzzySearch(rows, keys));
    expect(result.current.filtered).toEqual(rows);
    expect(result.current.search).toBe('');
  });

  it('filters by route name with exact substring', () => {
    const { result } = renderHook(() => useFuzzySearch(rows, keys));

    act(() => result.current.setSearch('Angel'));

    expect(result.current.filtered.length).toBeGreaterThanOrEqual(1);
    expect(result.current.filtered.some((r) => r.route === 'Angel')).toBe(true);
  });

  it('is case-insensitive', () => {
    const { result } = renderHook(() => useFuzzySearch(rows, keys));

    act(() => result.current.setSearch('hyperspace'));

    expect(result.current.filtered.length).toBeGreaterThanOrEqual(1);
    expect(result.current.filtered.some((r) => r.route === 'Hyperspace')).toBe(true);
  });

  it('filters by location', () => {
    const { result } = renderHook(() => useFuzzySearch(rows, keys));

    act(() => result.current.setSearch('Utah'));

    expect(result.current.filtered.length).toBeGreaterThanOrEqual(1);
    expect(result.current.filtered.some((r) => r.location.includes('Utah'))).toBe(true);
  });

  it('supports partial matches', () => {
    const { result } = renderHook(() => useFuzzySearch(rows, keys));

    act(() => result.current.setSearch('Outer'));

    expect(result.current.filtered.length).toBeGreaterThanOrEqual(1);
    expect(result.current.filtered.some((r) => r.route === 'Outer Space')).toBe(true);
  });

  it('supports fuzzy matches with minor typos', () => {
    const { result } = renderHook(() => useFuzzySearch(rows, keys));

    act(() => result.current.setSearch('Hyperspce'));

    expect(result.current.filtered.length).toBeGreaterThanOrEqual(1);
    expect(result.current.filtered.some((r) => r.route === 'Hyperspace')).toBe(true);
  });

  it('returns all rows when search is cleared', () => {
    const { result } = renderHook(() => useFuzzySearch(rows, keys));

    act(() => result.current.setSearch('Angel'));
    expect(result.current.filtered.length).toBeLessThan(rows.length);

    act(() => result.current.setSearch(''));
    expect(result.current.filtered).toEqual(rows);
  });

  it('returns empty results for non-matching query', () => {
    const { result } = renderHook(() => useFuzzySearch(rows, keys));

    act(() => result.current.setSearch('zzzznotfound'));

    expect(result.current.filtered).toHaveLength(0);
  });

  it('maintains independent state per hook instance', () => {
    const otherRows = [{ id: '10', route: 'Solo Route', location: 'Nowhere' }];
    const { result } = renderHook(() => ({
      a: useFuzzySearch(rows, keys),
      b: useFuzzySearch(otherRows, keys),
    }));

    act(() => result.current.a.setSearch('Angel'));

    expect(result.current.a.filtered.length).toBeGreaterThanOrEqual(1);
    expect(result.current.b.filtered).toEqual(otherRows);
    expect(result.current.b.search).toBe('');
  });
});
