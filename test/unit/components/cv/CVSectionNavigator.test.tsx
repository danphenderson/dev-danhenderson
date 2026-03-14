import { act, render, screen } from '@testing-library/react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import ThemeProvider from '../../../../src/ThemeProvider';
import {
  cvSectionMetadata,
  cvSectionViewportMetrics,
  cvSectionNavigationOrder,
} from '../../../../src/components/cv/cvSectionMetadata';
import { CVSectionNavigator } from '../../../../src/components/cv/CVSectionNavigator';

jest.mock('@mui/material/useScrollTrigger', () => jest.fn());

jest.mock('../../../../src/components/AppSpeedDial', () => ({
  AppSpeedDial: ({
    ariaLabel,
    actions,
  }: {
    ariaLabel: string;
    actions: Array<{
      id: string;
      label: string;
      onClick?: () => void;
    }>;
  }) => (
    <section data-testid={`speed-dial-${ariaLabel.toLowerCase().replace(/\s+/g, '-')}`}>
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          data-testid={`dial-action-${action.id}`}
          aria-label={action.label}
          onClick={() => action.onClick?.()}
        >
          {action.label}
        </button>
      ))}
    </section>
  ),
}));

const mockUseScrollTrigger = useScrollTrigger as jest.MockedFunction<typeof useScrollTrigger>;

describe('CVSectionNavigator', () => {
  const appendedSections: HTMLElement[] = [];
  const sectionRects = new Map<string, { top: number; height: number }>();
  const scrollIntoViewMock = jest.fn();
  let getElementByIdSpy: jest.SpyInstance;

  const appendSection = (sectionId: string, { top, height }: { top: number; height: number }) => {
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
        bottom:
          (sectionRects.get(sectionId)?.top ?? 0) + (sectionRects.get(sectionId)?.height ?? 0),
        left: 0,
        toJSON: () => undefined,
      }),
    });
    Object.defineProperty(section, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoViewMock,
    });
    document.body.appendChild(section);
    appendedSections.push(section);
    return section;
  };

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoViewMock,
    });
  });

  beforeEach(() => {
    mockUseScrollTrigger.mockReturnValue(true);
    scrollIntoViewMock.mockClear();
    getElementByIdSpy = jest.spyOn(document, 'getElementById');
  });

  afterEach(() => {
    sectionRects.clear();
    while (appendedSections.length > 0) {
      appendedSections.pop()?.remove();
    }
    jest.clearAllMocks();
    getElementByIdSpy.mockRestore();
  });

  it('renders the floating dial with back-to-top and section actions when scrolled past threshold', () => {
    render(
      <ThemeProvider>
        <CVSectionNavigator
          sections={['experience', 'education', 'github']}
          testId="cv-section-navigator"
        />
      </ThemeProvider>
    );

    const navigator = screen.getByTestId('cv-section-navigator');
    const dial = screen.getByTestId('speed-dial-cv-section-navigation');

    expect(navigator).toBeInTheDocument();
    expect(dial).toBeInTheDocument();
    expect(screen.getByTestId('dial-action-back-to-top')).toBeInTheDocument();
    expect(screen.getByTestId('dial-action-section-experience')).toBeInTheDocument();
    expect(screen.getByTestId('dial-action-section-education')).toBeInTheDocument();
    expect(screen.getByTestId('dial-action-section-github')).toBeInTheDocument();
  });

  it('is not visible when scroll threshold is not met', () => {
    mockUseScrollTrigger.mockReturnValue(false);

    render(
      <ThemeProvider>
        <CVSectionNavigator sections={['experience', 'education']} testId="cv-section-navigator" />
      </ThemeProvider>
    );

    expect(screen.queryByTestId('cv-section-navigator')).not.toBeInTheDocument();
  });

  it('includes a back-to-top action as the first action and section jump actions in order', () => {
    render(
      <ThemeProvider>
        <CVSectionNavigator sections={cvSectionNavigationOrder} testId="cv-section-navigator" />
      </ThemeProvider>
    );

    const actions = screen.getAllByRole('button');
    const actionLabels = actions.map((action) => action.getAttribute('aria-label'));

    expect(actionLabels[0]).toBe('Back to top');
    expect(actionLabels.slice(1)).toEqual(
      cvSectionNavigationOrder.map((key) => cvSectionMetadata[key].navLabel)
    );
  });

  it('jumps to the correct section when a section action is clicked', () => {
    appendSection(cvSectionMetadata.experience.id, { top: 200, height: 400 });
    appendSection(cvSectionMetadata.education.id, { top: 700, height: 300 });

    render(
      <ThemeProvider>
        <CVSectionNavigator sections={['experience', 'education']} testId="cv-section-navigator" />
      </ThemeProvider>
    );

    const educationAction = screen.getByTestId('dial-action-section-education');

    act(() => {
      educationAction.click();
    });

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(getElementByIdSpy).toHaveBeenCalledWith(cvSectionMetadata.education.id);
  });

  it('scrolls to top when back-to-top action is clicked', () => {
    const scrollToMock = jest.fn();
    Object.defineProperty(window, 'scrollTo', {
      configurable: true,
      value: scrollToMock,
    });

    render(
      <ThemeProvider>
        <CVSectionNavigator sections={['experience']} testId="cv-section-navigator" />
      </ThemeProvider>
    );

    const backToTopAction = screen.getByTestId('dial-action-back-to-top');

    act(() => {
      backToTopAction.click();
    });

    expect(scrollToMock).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
  });

  it('updates active section based on scroll position', () => {
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 900,
    });
    const activeLinePx = cvSectionViewportMetrics.desktop.activeLinePx;

    appendSection(cvSectionMetadata.experience.id, { top: activeLinePx - 16, height: 420 });
    appendSection(cvSectionMetadata.education.id, { top: activeLinePx + 360, height: 320 });

    render(
      <ThemeProvider>
        <CVSectionNavigator sections={['experience', 'education']} testId="cv-section-navigator" />
      </ThemeProvider>
    );

    expect(screen.getByTestId('cv-section-navigator')).toBeInTheDocument();

    sectionRects.set(cvSectionMetadata.experience.id, { top: -340, height: 420 });
    sectionRects.set(cvSectionMetadata.education.id, { top: activeLinePx - 8, height: 320 });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByTestId('cv-section-navigator')).toBeInTheDocument();
  });
});
