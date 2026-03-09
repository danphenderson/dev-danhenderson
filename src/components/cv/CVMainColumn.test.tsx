import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../../ThemeProvider';
import { CVMainColumn } from './CVMainColumn';

const mockExperienceList = jest.fn((_: { startDelayMs?: number }) => <div data-testid="experience-list" />);
const mockEducationSection = jest.fn((_: { startDelayMs?: number }) => <div data-testid="education-section" />);
const mockVolunteeringList = jest.fn((_: { startDelayMs?: number }) => <div data-testid="volunteering-list" />);
const mockCodingExamplesSection = jest.fn((_: { startDelayMs?: number }) => (
  <div data-testid="coding-examples-section" />
));

jest.mock('../layout/SectionCard', () => ({
  SectionCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
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
  });

  it('passes the shared item offset to all repeatable main-column lists', () => {
    render(
      <ThemeProvider>
        <CVMainColumn
          sections={['experience', 'education', 'volunteering', 'coding']}
          experiences={[]}
          education={{ entries: [] }}
          volunteering={[]}
          codingExamples={[]}
          itemOffsetMs={120}
        />
      </ThemeProvider>
    );

    expect(mockExperienceList.mock.calls[0][0]).toEqual(expect.objectContaining({ startDelayMs: 120 }));
    expect(mockEducationSection.mock.calls[0][0]).toEqual(expect.objectContaining({ startDelayMs: 120 }));
    expect(mockVolunteeringList.mock.calls[0][0]).toEqual(expect.objectContaining({ startDelayMs: 120 }));
    expect(mockCodingExamplesSection.mock.calls[0][0]).toEqual(expect.objectContaining({ startDelayMs: 120 }));
  });
});
