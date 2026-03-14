import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { CVExperienceSection } from './CVExperienceSection';
import { cvSectionMetadata } from './cvSectionMetadata';

const mockExperienceList = jest.fn((_: { startDelayMs?: number }) => (
  <div data-testid="experience-list" />
));

jest.mock('../layout/SectionCard', () => ({
  SectionCard: ({
    children,
    id,
    delayMs,
    triggerOnView,
  }: {
    children: ReactNode;
    id?: string;
    delayMs?: number;
    triggerOnView?: boolean;
  }) => (
    <div
      id={id}
      data-testid={id ? `section-card-${id}` : 'section-card'}
      data-delay-ms={delayMs ?? 0}
      data-trigger-on-view={String(triggerOnView ?? true)}
    >
      {children}
    </div>
  ),
}));

jest.mock('./ExperienceList', () => ({
  ExperienceList: (props: { startDelayMs?: number }) => mockExperienceList(props),
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
          triggerOnView={false}
          itemOffsetMs={240}
          sectionId={cvSectionMetadata.experience.id}
        />
      </ThemeProvider>
    );

    expect(mockExperienceList.mock.calls[0][0]).toEqual(
      expect.objectContaining({ startDelayMs: 240 })
    );
  });
});
