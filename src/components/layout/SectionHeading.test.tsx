import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../ThemeProvider';
import { SectionHeading } from './SectionHeading';

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
