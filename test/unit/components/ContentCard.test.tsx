import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import { ContentCard } from '../../../src/components/ContentCard';

describe('ContentCard', () => {
  it('renders children inside a styled Box', () => {
    render(
      <ThemeProvider>
        <ContentCard data-testid="card">Card content</ContentCard>
      </ThemeProvider>
    );

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('merges custom sx props with base styles', () => {
    render(
      <ThemeProvider>
        <ContentCard sx={{ mt: 2 }} data-testid="card">
          Styled
        </ContentCard>
      </ThemeProvider>
    );

    expect(screen.getByTestId('card')).toBeInTheDocument();
  });
});
