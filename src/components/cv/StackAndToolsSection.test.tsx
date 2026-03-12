import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { ANIMATED_CARD_DURATION_MS } from '../AnimatedContentCard';
import { StackAndToolsSection } from './StackAndToolsSection';

type MockSx = { [key: string]: unknown } | Array<{ [key: string]: unknown }>;
const mockTabPanel = jest.fn();

const hasSxEntry = (sx?: MockSx, predicate?: (entry: { [key: string]: unknown }) => boolean) => {
  const sxEntries = Array.isArray(sx) ? sx : sx ? [sx] : [];

  return predicate ? sxEntries.some((entry) => predicate(entry)) : false;
};

jest.mock('../AnimatedContentCard', () => ({
  AnimatedContentCard: ({
    children,
    delayMs,
    sx,
  }: {
    children: ReactNode;
    delayMs: number;
    sx?: MockSx;
  }) => (
    <div
      data-testid="animated-content-item"
      data-delay={String(delayMs)}
      data-has-card-reset={String(
        hasSxEntry(
          sx,
          (entry) =>
            entry.background === 'none' &&
            entry.backgroundColor === 'transparent' &&
            entry.border === 'none' &&
            entry.boxShadow === 'none'
        )
      )}
      data-has-panel-surface={String(
        hasSxEntry(sx, (entry) => entry.borderRadius === 1.5 && entry.p === 1)
      )}
    >
      {children}
    </div>
  ),
}));

jest.mock('../TabPanel', () => {
  const actual = jest.requireActual('../TabPanel');

  return {
    ...actual,
    TabPanel: (props: Record<string, unknown>) => {
      mockTabPanel(props);
      const { initialPanelGrowDelayMs: _initialPanelGrowDelayMs, ...rest } = props;

      return actual.TabPanel(rest);
    },
  };
});

describe('StackAndToolsSection', () => {
  beforeEach(() => {
    mockTabPanel.mockClear();
  });

  it('renders the shared tab panel through the animated list with the provided offset', () => {
    render(
      <ThemeProvider>
        <StackAndToolsSection
          sections={[
            { title: 'Programming Languages', tabLabel: 'Languages', items: ['TypeScript', 'Python'] },
            { title: 'Cloud Services', tabLabel: 'Cloud', items: ['AWS'] },
          ]}
          lead="Daily development environment, languages, platform tooling, and services used across software, research, and data work."
          startDelayMs={120}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Stack & Tools')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Daily development environment, languages, platform tooling, and services used across software, research, and data work.'
      )
    ).toBeVisible();
    expect(screen.getAllByTestId('animated-content-item')[0]).toHaveAttribute('data-delay', '120');
    expect(screen.getAllByTestId('animated-content-item')[0]).toHaveAttribute('data-has-card-reset', 'true');
    expect(screen.getAllByTestId('animated-content-item')[0]).toHaveAttribute('data-has-panel-surface', 'false');
    expect(mockTabPanel.mock.calls[0][0]).toEqual(expect.objectContaining({
      initialPanelGrowDelayMs: 120 + ANIMATED_CARD_DURATION_MS + 60,
    }));
    expect(screen.getByRole('tab', { name: 'Programming Languages' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Cloud Services' })).toBeInTheDocument();
    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
    expect(screen.queryByText('AWS')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Cloud Services' }));

    expect(screen.getByText('AWS')).toBeVisible();
    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
  });
});
