import { normalizeSxProp } from './sx';

describe('normalizeSxProp', () => {
  it('returns an empty array for undefined', () => {
    expect(normalizeSxProp(undefined)).toEqual([]);
  });

  it('wraps a single object in an array', () => {
    const sx = { color: 'red' };
    expect(normalizeSxProp(sx)).toEqual([{ color: 'red' }]);
  });

  it('returns an existing array as-is', () => {
    const sx = [{ color: 'red' }, { margin: 1 }] as const;
    expect(normalizeSxProp(sx)).toBe(sx);
  });

  it('wraps a function in an array', () => {
    const fn = () => ({ color: 'blue' });
    const result = normalizeSxProp(fn);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(fn);
  });
});
