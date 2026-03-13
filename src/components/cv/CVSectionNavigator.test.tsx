import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../ThemeProvider';
import { CVSectionNavigator } from './CVSectionNavigator';

describe('CVSectionNavigator', () => {
  it('keeps the jump label and section chips in a shared wrapping row', () => {
    render(
      <ThemeProvider>
        <CVSectionNavigator sections={['experience', 'education', 'github']} testId="cv-section-navigator" />
      </ThemeProvider>
    );

    const navigator = screen.getByTestId('cv-section-navigator');
    const chipRail = navigator.querySelector('.MuiStack-root');
    const label = screen.getByText('Jump to');

    expect(chipRail).not.toBeNull();
    expect(window.getComputedStyle(navigator).flexDirection).toBe('row');
    expect(window.getComputedStyle(navigator).flexWrap).toBe('wrap');
    expect(window.getComputedStyle(navigator).alignItems).toBe('flex-start');
    expect(window.getComputedStyle(label).display).toBe('inline-flex');
    expect(window.getComputedStyle(label).alignItems).toBe('center');
    expect(window.getComputedStyle(label).minHeight).toBe('32px');
    expect(window.getComputedStyle(chipRail as HTMLElement).flexWrap).toBe('wrap');
    expect(window.getComputedStyle(chipRail as HTMLElement).flexGrow).toBe('1');
  });
});
