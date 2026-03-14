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

  it('wraps the Paper shell with shellWrapper when showShell is true', () => {
    const shellWrapper = jest.fn((shell: React.ReactNode) => (
      <div data-testid="wrapped-shell">{shell}</div>
    ));

    render(
      <ThemeProvider>
        <BackgroundPaper image="assets/test.jpg" shellWrapper={shellWrapper}>
          <span>Wrapped shell content</span>
        </BackgroundPaper>
      </ThemeProvider>
    );

    expect(shellWrapper).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('wrapped-shell')).toBeInTheDocument();
    expect(screen.getByText('Wrapped shell content')).toBeInTheDocument();
  });

  it('does not call shellWrapper when showShell is false', () => {
    const shellWrapper = jest.fn((shell: React.ReactNode) => (
      <div data-testid="wrapped-shell">{shell}</div>
    ));

    render(
      <ThemeProvider>
        <BackgroundPaper image="assets/test.jpg" showShell={false} shellWrapper={shellWrapper}>
          <span>Unwrapped content</span>
        </BackgroundPaper>
      </ThemeProvider>
    );

    expect(shellWrapper).not.toHaveBeenCalled();
    expect(screen.queryByTestId('wrapped-shell')).not.toBeInTheDocument();
    expect(screen.getByText('Unwrapped content')).toBeInTheDocument();
  });
});
