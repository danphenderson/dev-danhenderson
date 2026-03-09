import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { StackAndToolsSection } from './StackAndToolsSection';

jest.mock('../AnimatedContentCard', () => ({
  AnimatedContentCard: ({
    children,
    delayMs,
  }: {
    children: ReactNode;
    delayMs: number;
  }) => (
    <div data-testid="animated-content-item" data-delay={String(delayMs)}>
      {children}
    </div>
  ),
}));

jest.mock('../ToolsAccordion', () => ({
  ToolsAccordion: ({ title }: { title: string }) => <div data-testid="tools-accordion">{title}</div>,
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
    expect(screen.getAllByTestId('tools-accordion')).toHaveLength(2);
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('Cloud')).toBeInTheDocument();
  });
});
