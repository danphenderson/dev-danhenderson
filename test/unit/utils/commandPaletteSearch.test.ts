import {
  matchesCommandPaletteAction,
  normalizeCommandPaletteSearchValue,
} from '../../../src/utils/commandPaletteSearch';

type MinimalAction = { label: string; description: string; keywords: string[] };

const action = (label: string, description: string, keywords: string[] = []): MinimalAction => ({
  label,
  description,
  keywords,
});

describe('normalizeCommandPaletteSearchValue', () => {
  it('trims leading and trailing whitespace', () => {
    expect(normalizeCommandPaletteSearchValue('  hello  ')).toBe('hello');
  });

  it('lowercases the value', () => {
    expect(normalizeCommandPaletteSearchValue('PHOTO')).toBe('photo');
  });

  it('returns empty string for blank input', () => {
    expect(normalizeCommandPaletteSearchValue('   ')).toBe('');
  });

  it('handles empty string', () => {
    expect(normalizeCommandPaletteSearchValue('')).toBe('');
  });
});

describe('matchesCommandPaletteAction', () => {
  it('returns true for an empty query (show all)', () => {
    expect(matchesCommandPaletteAction(action('Photography', 'Browse photos', []), '')).toBe(true);
  });

  it('returns true for a whitespace-only query (normalizes to empty)', () => {
    expect(matchesCommandPaletteAction(action('Photography', 'Browse photos', []), '   ')).toBe(
      true
    );
  });

  it('matches on label', () => {
    expect(matchesCommandPaletteAction(action('Photography', 'Browse photos', []), 'photo')).toBe(
      true
    );
  });

  it('matches on description', () => {
    expect(
      matchesCommandPaletteAction(action('CV', 'My résumé and career history', []), 'career')
    ).toBe(true);
  });

  it('matches on a keyword', () => {
    expect(
      matchesCommandPaletteAction(
        action('CV', 'Resume', ['curriculum vitae', 'experience']),
        'vitae'
      )
    ).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(
      matchesCommandPaletteAction(action('Photography', 'Browse photos', []), 'PHOTOGRAPHY')
    ).toBe(true);
  });

  it('returns false when query does not match label, description, or keywords', () => {
    expect(
      matchesCommandPaletteAction(
        action('Home', 'Go to the home page', ['landing', 'start']),
        'climbing'
      )
    ).toBe(false);
  });

  it('matches partial string within a field', () => {
    expect(matchesCommandPaletteAction(action('Climbing', 'Rock climbing logs', []), 'climb')).toBe(
      true
    );
  });

  it('does not match when only the query is a superset of the haystack', () => {
    // 'photography section' is longer than any single haystack entry
    expect(
      matchesCommandPaletteAction(action('Photo', 'Gallery', ['pictures']), 'photography section')
    ).toBe(false);
  });
});
