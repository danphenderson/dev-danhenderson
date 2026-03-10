import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { StackAndToolsSection } from './StackAndToolsSection';

type MockSx = { [key: string]: unknown } | Array<{ [key: string]: unknown }>;

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

jest.mock('../SkillsAccordion', () => ({
  SkillsAccordion: ({ title }: { title: string }) => <div data-testid="skills-accordion">{title}</div>,
}));

describe('StackAndToolsSection', () => {
  it('renders tool sections through the shared animated list with the provided offset', () => {
    render(
      <ThemeProvider>
        <StackAndToolsSection
          sections={[
            { title: 'Languages', items: ['TypeScript', 'Python'] },
            { title: 'Cloud', items: ['AWS'] },
          ]}
          startDelayMs={120}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Stack & Tools')).toBeInTheDocument();
    expect(screen.getAllByTestId('animated-content-item')[0]).toHaveAttribute('data-delay', '120');
    expect(screen.getAllByTestId('animated-content-item')[1]).toHaveAttribute('data-delay', '200');
    expect(screen.getAllByTestId('animated-content-item')[0]).toHaveAttribute('data-has-card-reset', 'true');
    expect(screen.getAllByTestId('animated-content-item')[0]).toHaveAttribute('data-has-panel-surface', 'false');
    expect(screen.getAllByTestId('skills-accordion')).toHaveLength(2);
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('Cloud')).toBeInTheDocument();
  });
});
