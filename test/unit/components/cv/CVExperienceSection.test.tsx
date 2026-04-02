import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { CVExperienceSection } from '../../../../src/components/cv/CVExperienceSection';
import { cvSectionMetadata } from '../../../../src/components/cv/cvSectionMetadata';

const mockExperienceList = jest.fn(
  (_: { startDelayMs?: number; skipEntranceAnimation?: boolean }) => (
    <div data-testid="experience-list" />
  )
);

jest.mock('../../../../src/components/layout/SectionCard', () => ({
  SectionCard: ({
    children,
    id,
    delayMs,
    entranceDirection,
    triggerOnView,
  }: {
    children: ReactNode;
    id?: string;
    delayMs?: number;
    entranceDirection?: string;
    triggerOnView?: boolean;
  }) => (
    <div
      id={id}
      data-testid={id ? `section-card-${id}` : 'section-card'}
      data-delay-ms={delayMs ?? 0}
      data-entrance-direction={entranceDirection ?? 'zoom'}
      data-trigger-on-view={String(triggerOnView ?? true)}
    >
      {children}
    </div>
  ),
}));

jest.mock('../../../../src/components/cv/ExperienceList', () => ({
  ExperienceList: (props: { startDelayMs?: number; skipEntranceAnimation?: boolean }) =>
    mockExperienceList(props),
}));

describe('CVExperienceSection', () => {
  afterEach(() => {
    mockExperienceList.mockClear();
  });

  it('forwards motion props, section id, and item offset to the experience list', () => {
    render(
      <ThemeProvider>
        <CVExperienceSection
          experiences={[]}
          delayMs={120}
          entranceDirection="right"
          triggerOnView={false}
          itemOffsetMs={240}
          sectionId={cvSectionMetadata.experience.id}
        />
      </ThemeProvider>
    );

    expect(screen.getByTestId(`section-card-${cvSectionMetadata.experience.id}`)).toHaveAttribute(
      'data-entrance-direction',
      'right'
    );
    expect(mockExperienceList.mock.calls[0][0]).toEqual(
      expect.objectContaining({ startDelayMs: 240 })
    );
  });

  it('keeps section reveal persistence on the outer card without disabling inner list entrances', () => {
    render(
      <ThemeProvider>
        <CVExperienceSection experiences={[]} revealed onReveal={jest.fn()} />
      </ThemeProvider>
    );

    expect(mockExperienceList.mock.calls[0][0]).not.toEqual(
      expect.objectContaining({ skipEntranceAnimation: true })
    );
  });
});
