import { easeOutCubic } from '../../../src/utils/easing';

describe('easeOutCubic', () => {
  it('returns 0 at progress 0', () => {
    expect(easeOutCubic(0)).toBe(0);
  });

  it('returns 1 at progress 1', () => {
    expect(easeOutCubic(1)).toBe(1);
  });

  it('returns 0.5 at progress 0.5 is greater than 0.5 (ease-out curve front-loaded)', () => {
    // ease-out: 1 - (1 - 0.5)^3 = 1 - 0.125 = 0.875
    expect(easeOutCubic(0.5)).toBeCloseTo(0.875);
  });

  it('returns values between 0 and 1 for inputs in [0, 1]', () => {
    const samples = [0.1, 0.25, 0.5, 0.75, 0.9];
    for (const t of samples) {
      const result = easeOutCubic(t);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(1);
    }
  });

  it('is monotonically increasing over [0, 1]', () => {
    let prev = easeOutCubic(0);
    for (let t = 0.01; t <= 1; t += 0.01) {
      const current = easeOutCubic(t);
      expect(current).toBeGreaterThanOrEqual(prev);
      prev = current;
    }
  });

  it('decelerates: later progress increments produce smaller value changes', () => {
    const earlyDelta = easeOutCubic(0.2) - easeOutCubic(0.1);
    const lateDelta = easeOutCubic(0.9) - easeOutCubic(0.8);
    expect(earlyDelta).toBeGreaterThan(lateDelta);
  });
});
