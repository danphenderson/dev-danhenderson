import type { CommandPaletteAction } from '../constants/commandPaletteActions';

type SearchableCommandPaletteAction = Pick<
  CommandPaletteAction,
  'label' | 'description' | 'keywords'
>;

export const normalizeCommandPaletteSearchValue = (value: string): string =>
  value.trim().toLowerCase();

export const matchesCommandPaletteAction = (
  action: SearchableCommandPaletteAction,
  rawQuery: string
): boolean => {
  const query = normalizeCommandPaletteSearchValue(rawQuery);

  if (!query) {
    return true;
  }

  const haystacks = [action.label, action.description, ...action.keywords].map((value) =>
    value.toLowerCase()
  );

  return haystacks.some((value) => value.includes(query));
};
