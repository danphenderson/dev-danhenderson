import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import BackgroundPaper from '../../../src/components/BackgroundPaper';

describe('BackgroundPaper', () => {
  it('renders children inside a Paper shell by default', () => {
    render(
      <ThemeProvider>
        <BackgroundPaper image="assets/test.jpg">
          <span>Shell content</span>
        </BackgroundPaper>
      </ThemeProvider>
    );

    expect(screen.getByText('Shell content')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders children without a Paper shell when showShell is false', () => {
    render(
      <ThemeProvider>
        <BackgroundPaper image="assets/test.jpg" showShell={false}>
          <span>Bare content</span>
        </BackgroundPaper>
      </ThemeProvider>
    );

    expect(screen.getByText('Bare content')).toBeInTheDocument();
  });
});
