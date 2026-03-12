import { createAppTheme } from '../theme/createAppTheme';
import { createComponentStyleMap } from './componentStyleBuilders';

describe('createComponentStyleMap', () => {
  it('uses the updated tab hover shimmer duration', () => {
    const theme = createAppTheme('light');
    const { getTabSx } = createComponentStyleMap(theme);
    const tabSx = getTabSx(false) as Record<string, unknown>;
    const hoverAfterSx = tabSx['&:hover::after'] as Record<string, unknown>;

    expect(hoverAfterSx.animation).toEqual(expect.stringContaining('400ms linear'));
  });
});
