import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { CVMainColumn } from './CVMainColumn';
import { cvSectionMetadata } from './cvSectionMetadata';

const mockExperienceList = jest.fn((_: { startDelayMs?: number }) => <div data-testid="experience-list" />);
const mockEducationSection = jest.fn((_: { startDelayMs?: number }) => <div data-testid="education-section" />);
const mockVolunteeringList = jest.fn((_: { startDelayMs?: number }) => <div data-testid="volunteering-list" />);
const mockCodingExamplesSection = jest.fn((_: { startDelayMs?: number }) => (
  <div data-testid="coding-examples-section" />
));
const renderedSectionCardIds: string[] = [];

jest.mock('../layout/SectionCard', () => ({
  SectionCard: ({ children, id }: { children: ReactNode; id?: string }) => {
    if (id) {
      renderedSectionCardIds.push(id);
    }

    return (
      <div data-testid={id ? `section-card-${id}` : 'section-card'} id={id}>
        {children}
      </div>
    );
  },
}));

jest.mock('./ExperienceList', () => ({
  ExperienceList: (props: { startDelayMs?: number }) => mockExperienceList(props),
}));

jest.mock('./EducationSection', () => ({
  EducationSection: (props: { startDelayMs?: number }) => mockEducationSection(props),
}));

jest.mock('./VolunteeringList', () => ({
  VolunteeringList: (props: { startDelayMs?: number }) => mockVolunteeringList(props),
}));

jest.mock('./CodingExamplesSection', () => ({
  CodingExamplesSection: (props: { startDelayMs?: number }) => mockCodingExamplesSection(props),
}));

describe('CVMainColumn', () => {
  afterEach(() => {
    mockExperienceList.mockClear();
    mockEducationSection.mockClear();
    mockVolunteeringList.mockClear();
    mockCodingExamplesSection.mockClear();
    renderedSectionCardIds.length = 0;
  });

  it('passes the shared item offset and section ids to all repeatable main-column lists', () => {
    render(
      <ThemeProvider>
        <CVMainColumn
          sections={['experience', 'education', 'volunteering', 'coding']}
          experiences={[]}
          education={{ entries: [] }}
          volunteering={[]}
          codingExamples={[]}
          itemOffsetMs={120}
          sectionIds={{
            experience: cvSectionMetadata.experience.id,
            education: cvSectionMetadata.education.id,
            volunteering: cvSectionMetadata.volunteering.id,
            coding: cvSectionMetadata.coding.id,
          }}
        />
      </ThemeProvider>
    );

    expect(renderedSectionCardIds).toEqual([
      cvSectionMetadata.experience.id,
      cvSectionMetadata.education.id,
      cvSectionMetadata.volunteering.id,
      cvSectionMetadata.coding.id,
    ]);
    expect(screen.getByTestId(`section-card-${cvSectionMetadata.experience.id}`)).toBeInTheDocument();
    expect(screen.getByTestId(`section-card-${cvSectionMetadata.education.id}`)).toBeInTheDocument();
    expect(screen.getByTestId(`section-card-${cvSectionMetadata.volunteering.id}`)).toBeInTheDocument();
    expect(screen.getByTestId(`section-card-${cvSectionMetadata.coding.id}`)).toBeInTheDocument();
    expect(mockExperienceList.mock.calls[0][0]).toEqual(expect.objectContaining({ startDelayMs: 120 }));
    expect(mockEducationSection.mock.calls[0][0]).toEqual(expect.objectContaining({ startDelayMs: 120 }));
    expect(mockVolunteeringList.mock.calls[0][0]).toEqual(expect.objectContaining({ startDelayMs: 120 }));
    expect(mockCodingExamplesSection.mock.calls[0][0]).toEqual(expect.objectContaining({ startDelayMs: 120 }));
  });
});
