import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { SectionCard } from '../../../../src/components/layout/SectionCard';

jest.mock('../../../../src/components/AnimatedContentCard', () => ({
  AnimatedContentCard: ({
    children,
    delayMs,
    entranceDirection,
  }: {
    children: ReactNode;
    delayMs?: number;
    entranceDirection?: string;
  }) => (
    <div
      data-testid="animated-card"
      data-delay={String(delayMs ?? 0)}
      data-entrance-direction={entranceDirection ?? 'zoom'}
    >
      {children}
    </div>
  ),
}));

describe('SectionCard', () => {
  it('forwards props to AnimatedContentCard', () => {
    render(
      <ThemeProvider>
        <SectionCard delayMs={200} entranceDirection="left">
          Section content
        </SectionCard>
      </ThemeProvider>
    );

    const card = screen.getByTestId('animated-card');
    expect(card).toHaveAttribute('data-delay', '200');
    expect(card).toHaveAttribute('data-entrance-direction', 'left');
    expect(screen.getByText('Section content')).toBeInTheDocument();
  });
});
