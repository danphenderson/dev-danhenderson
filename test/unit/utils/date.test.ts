import { getIsoDateUtcTimestamp, formatIsoDateAsUtcCalendar } from '../../../src/utils/date';

describe('getIsoDateUtcTimestamp', () => {
  it('returns correct UTC timestamp for valid dates', () => {
    expect(getIsoDateUtcTimestamp('2024-01-15')).toBe(Date.UTC(2024, 0, 15));
    expect(getIsoDateUtcTimestamp('2000-06-30')).toBe(Date.UTC(2000, 5, 30));
  });

  it('returns 0 for null', () => {
    expect(getIsoDateUtcTimestamp(null)).toBe(0);
  });

  it('returns 0 for undefined', () => {
    expect(getIsoDateUtcTimestamp(undefined)).toBe(0);
  });

  it('returns 0 for invalid date strings', () => {
    expect(getIsoDateUtcTimestamp('not-a-date')).toBe(0);
    expect(getIsoDateUtcTimestamp('2024-13-01')).toBe(0);
    expect(getIsoDateUtcTimestamp('2024-02-30')).toBe(0);
  });

  it('returns 0 for empty string', () => {
    expect(getIsoDateUtcTimestamp('')).toBe(0);
  });
});

describe('formatIsoDateAsUtcCalendar', () => {
  it('returns a formatted string for valid dates', () => {
    const result = formatIsoDateAsUtcCalendar('2024-01-15');
    expect(result).toBeTruthy();
    expect(result).not.toBe('2024-01-15');
  });

  it('returns empty string for null', () => {
    expect(formatIsoDateAsUtcCalendar(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatIsoDateAsUtcCalendar(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(formatIsoDateAsUtcCalendar('')).toBe('');
  });

  it('returns input string for invalid format', () => {
    expect(formatIsoDateAsUtcCalendar('not-a-date')).toBe('not-a-date');
    expect(formatIsoDateAsUtcCalendar('Jan 15 2024')).toBe('Jan 15 2024');
  });
});
