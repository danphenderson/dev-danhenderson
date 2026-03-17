import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { BlogCallout } from '../../../../src/components/blog/BlogCallout';

describe('BlogCallout', () => {
  it('renders the body text', () => {
    render(
      <ThemeProvider>
        <BlogCallout variant="note" text="This is a note callout." />
      </ThemeProvider>
    );

    expect(screen.getByText('This is a note callout.')).toBeInTheDocument();
  });

  it('renders the default title for the "note" variant', () => {
    render(
      <ThemeProvider>
        <BlogCallout variant="note" text="Note body." />
      </ThemeProvider>
    );

    expect(screen.getByText('Note')).toBeInTheDocument();
  });

  it('renders the default title for the "tip" variant', () => {
    render(
      <ThemeProvider>
        <BlogCallout variant="tip" text="Tip body." />
      </ThemeProvider>
    );

    expect(screen.getByText('Tip')).toBeInTheDocument();
  });

  it('renders the default title for the "warning" variant', () => {
    render(
      <ThemeProvider>
        <BlogCallout variant="warning" text="Warning body." />
      </ThemeProvider>
    );

    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('renders a custom title when provided', () => {
    render(
      <ThemeProvider>
        <BlogCallout variant="tip" title="Custom Tip Title" text="Custom tip body." />
      </ThemeProvider>
    );

    expect(screen.getByText('Custom Tip Title')).toBeInTheDocument();
    expect(screen.queryByText('Tip')).not.toBeInTheDocument();
  });

  it('has a "note" role for accessibility', () => {
    render(
      <ThemeProvider>
        <BlogCallout variant="note" text="Accessible callout." />
      </ThemeProvider>
    );

    expect(screen.getByRole('note')).toBeInTheDocument();
  });
});
