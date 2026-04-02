import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { SectionHeading } from '../../../../src/components/layout/SectionHeading';

describe('SectionHeading', () => {
  it('renders overline text', () => {
    render(
      <ThemeProvider>
        <SectionHeading overline="EXPERIENCE" />
      </ThemeProvider>
    );

    expect(screen.getByText('EXPERIENCE')).toBeInTheDocument();
  });

  it('renders title and subtitle when provided', () => {
    render(
      <ThemeProvider>
        <SectionHeading overline="Photography" title="Collections" subtitle="A selection of work" />
      </ThemeProvider>
    );

    expect(screen.getByText('Photography')).toBeInTheDocument();
    expect(screen.getByText('Collections')).toBeInTheDocument();
    expect(screen.getByText('A selection of work')).toBeInTheDocument();
  });

  it('renders a subtitle node when provided', () => {
    render(
      <ThemeProvider>
        <SectionHeading
          overline="Photography"
          subtitle={<span data-testid="section-subtitle-node">A selection of work</span>}
        />
      </ThemeProvider>
    );

    expect(screen.getByTestId('section-subtitle-node')).toBeInTheDocument();
  });

  it('omits title and subtitle when not provided', () => {
    render(
      <ThemeProvider>
        <SectionHeading overline="TOOLS" />
      </ThemeProvider>
    );

    expect(screen.getByText('TOOLS')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
