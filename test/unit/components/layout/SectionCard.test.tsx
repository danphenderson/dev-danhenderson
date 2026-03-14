import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { SectionCard } from '../../../../src/components/layout/SectionCard';

jest.mock('../../../../src/components/AnimatedContentCard', () => ({
  AnimatedContentCard: ({ children, delayMs }: { children: ReactNode; delayMs?: number }) => (
    <div data-testid="animated-card" data-delay={String(delayMs ?? 0)}>
      {children}
    </div>
  ),
}));

describe('SectionCard', () => {
  it('forwards props to AnimatedContentCard', () => {
    render(
      <ThemeProvider>
        <SectionCard delayMs={200}>Section content</SectionCard>
      </ThemeProvider>
    );

    const card = screen.getByTestId('animated-card');
    expect(card).toHaveAttribute('data-delay', '200');
    expect(screen.getByText('Section content')).toBeInTheDocument();
  });
});
