import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import { CommonLink } from '../../../src/components/CommonLink';

describe('CommonLink', () => {
  it('forwards react-tooltip data attributes to the rendered anchor', () => {
    render(
      <ThemeProvider>
        <CommonLink
          href="https://example.com/work"
          data-tooltip-id="portfolio-link-tooltip"
          data-tooltip-content="Open project details"
          data-tooltip-place="top"
        >
          Example Project
        </CommonLink>
      </ThemeProvider>
    );

    const link = screen.getByRole('link', { name: 'Example Project' });

    expect(link).toHaveAttribute('href', 'https://example.com/work');
    expect(link).toHaveAttribute('data-tooltip-id', 'portfolio-link-tooltip');
    expect(link).toHaveAttribute('data-tooltip-content', 'Open project details');
    expect(link).toHaveAttribute('data-tooltip-place', 'top');
  });
});
