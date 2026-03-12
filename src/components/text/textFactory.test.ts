import type { SxProps, Theme } from '@mui/material/styles';
import { mergeSx } from './textFactory';

describe('mergeSx', () => {
  it('returns the default when no caller sx is provided', () => {
    const defaults: SxProps<Theme> = { color: 'red' };
    const result = mergeSx(defaults, undefined) as Record<string, unknown>[];

    expect(result).toEqual([{ color: 'red' }]);
  });

  it('merges a single caller sx object with defaults', () => {
    const defaults: SxProps<Theme> = { color: 'red' };
    const callerSx: SxProps<Theme> = { fontWeight: 700 };
    const result = mergeSx(defaults, callerSx) as Record<string, unknown>[];

    expect(result).toEqual([{ color: 'red' }, { fontWeight: 700 }]);
  });

  it('merges an array of caller sx with defaults', () => {
    const defaults: SxProps<Theme> = [{ color: 'red' }, { fontSize: 16 }];
    const callerSx: SxProps<Theme> = [{ fontWeight: 700 }];
    const result = mergeSx(defaults, callerSx) as Record<string, unknown>[];

    expect(result).toEqual([{ color: 'red' }, { fontSize: 16 }, { fontWeight: 700 }]);
  });

  it('handles multiple default sx entries', () => {
    const defaults: SxProps<Theme>[] = [{ color: 'red' }, { mt: 2 }];
    const result = mergeSx(defaults, undefined) as Record<string, unknown>[];

    expect(result).toEqual([{ color: 'red' }, { mt: 2 }]);
  });
});
