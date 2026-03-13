import { act, render, screen } from '@testing-library/react';
import ThemeProvider from '../../ThemeProvider';
import { cvSectionMetadata } from './cvSectionMetadata';
import { CVSectionNavigator } from './CVSectionNavigator';

describe('CVSectionNavigator', () => {
  const appendedSections: HTMLElement[] = [];
  const sectionRects = new Map<string, { top: number; height: number }>();

  const appendSection = (
    sectionId: string,
    { top, height }: { top: number; height: number }
  ) => {
    sectionRects.set(sectionId, { top, height });
    const section = document.createElement('section');
    section.id = sectionId;
    Object.defineProperty(section, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        x: 0,
        y: sectionRects.get(sectionId)?.top ?? 0,
        width: 320,
        height: sectionRects.get(sectionId)?.height ?? 0,
        top: sectionRects.get(sectionId)?.top ?? 0,
        right: 320,
        bottom: (sectionRects.get(sectionId)?.top ?? 0) + (sectionRects.get(sectionId)?.height ?? 0),
        left: 0,
        toJSON: () => undefined,
      }),
    });
    document.body.appendChild(section);
    appendedSections.push(section);
    return section;
  };

  afterEach(() => {
    sectionRects.clear();
    while (appendedSections.length > 0) {
      appendedSections.pop()?.remove();
    }
  });

  it('keeps the sections label and pills in a shared wrapping row', () => {
    render(
      <ThemeProvider>
        <CVSectionNavigator sections={['experience', 'education', 'github']} testId="cv-section-navigator" />
      </ThemeProvider>
    );

    const navigator = screen.getByTestId('cv-section-navigator');
    const chipRail = navigator.querySelector('.MuiStack-root');
    const label = screen.getByText('Sections');

    expect(chipRail).not.toBeNull();
    expect(window.getComputedStyle(navigator).flexDirection).toBe('row');
    expect(window.getComputedStyle(navigator).flexWrap).toBe('wrap');
    expect(window.getComputedStyle(navigator).alignItems).toBe('center');
    expect(window.getComputedStyle(label).display).toBe('inline-flex');
    expect(window.getComputedStyle(label).alignItems).toBe('center');
    expect(window.getComputedStyle(label).minHeight).toBe('30px');
    expect(window.getComputedStyle(chipRail as HTMLElement).flexWrap).toBe('wrap');
    expect(window.getComputedStyle(chipRail as HTMLElement).flexGrow).toBe('1');
  });

  it('highlights the section whose card is closest to the sticky guide while scrolling', () => {
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 900,
    });
    appendSection(cvSectionMetadata.experience.id, { top: 108, height: 420 });
    appendSection(cvSectionMetadata.education.id, { top: 620, height: 320 });
    appendSection(cvSectionMetadata.github.id, { top: 512, height: 260 });

    render(
      <ThemeProvider>
        <CVSectionNavigator sections={['experience', 'education', 'github']} testId="cv-section-navigator" />
      </ThemeProvider>
    );

    const experienceButton = screen.getByRole('button', { name: 'Experience' });
    const educationButton = screen.getByRole('button', { name: 'Education' });
    const githubButton = screen.getByRole('button', { name: 'GitHub' });

    expect(experienceButton).toHaveAttribute('aria-pressed', 'true');
    expect(educationButton).toHaveAttribute('aria-pressed', 'false');
    expect(githubButton).toHaveAttribute('aria-pressed', 'false');

    sectionRects.set(cvSectionMetadata.experience.id, { top: -340, height: 420 });
    sectionRects.set(cvSectionMetadata.education.id, { top: 126, height: 320 });
    sectionRects.set(cvSectionMetadata.github.id, { top: 448, height: 260 });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(experienceButton).toHaveAttribute('aria-pressed', 'false');
    expect(educationButton).toHaveAttribute('aria-pressed', 'true');
    expect(githubButton).toHaveAttribute('aria-pressed', 'false');
  });
});
