import {
  parseCVSortDate,
  buildCVStoryItems,
  type CVStoryItem,
} from '../../../src/data/cvStoryItems';
import type {
  AboutMe,
  Certificate,
  CodingExample,
  EducationEntry,
  EducationInfo,
  Experience,
  VolunteeringEntry,
} from '../../../src/types/cv';

/* ── Fixtures ── */

const makeAbout = (overrides: Partial<AboutMe> = {}): AboutMe => ({
  name: 'Test User',
  title: 'Engineer',
  email: 'test@example.com',
  phone: '555-0000',
  location: 'Denver, CO',
  bio: 'A short bio.',
  ...overrides,
});

const makeExperience = (startDate: string, overrides: Partial<Experience> = {}): Experience => ({
  company: 'Acme',
  title: 'Engineer',
  startDate,
  endDate: 'Present',
  ...overrides,
});

const makeEducation = (
  dateRange: string,
  overrides: Partial<EducationEntry> = {}
): EducationEntry => ({
  university: 'State U',
  program: 'BS CS',
  summary: 'summary',
  dateRange,
  ...overrides,
});

const makeCertificate = (date: string, overrides: Partial<Certificate> = {}): Certificate => ({
  title: 'Cert',
  issuer: 'Issuer',
  date,
  ...overrides,
});

const makeVolunteering = (
  dateRange: string,
  overrides: Partial<VolunteeringEntry> = {}
): VolunteeringEntry => ({
  organization: 'Org',
  role: 'Volunteer',
  summary: 'summary',
  dateRange,
  highlights: [],
  ...overrides,
});

const makeCoding = (title = 'Project'): CodingExample => ({
  title,
  description: 'desc',
  links: [],
});

/* ── parseCVSortDate ── */

describe('parseCVSortDate', () => {
  it('parses a standard "Month Year" string', () => {
    const date = parseCVSortDate('May 2025');
    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(4); // May = 4
  });

  it('parses a full month name "August 2021"', () => {
    const date = parseCVSortDate('August 2021');
    expect(date.getFullYear()).toBe(2021);
    expect(date.getMonth()).toBe(7); // August = 7
  });

  it('parses "Present" as approximately today', () => {
    const now = Date.now();
    const date = parseCVSortDate('Present');
    // Should be within a few seconds of now
    expect(Math.abs(date.getTime() - now)).toBeLessThan(5000);
  });

  it('parses "Current" as approximately today (case-insensitive)', () => {
    const now = Date.now();
    const date = parseCVSortDate('current');
    expect(Math.abs(date.getTime() - now)).toBeLessThan(5000);
  });

  it('parses season-prefixed strings like "Fall 2024 – Present"', () => {
    const date = parseCVSortDate('Fall 2024 – Present');
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(8); // Sep = 8 (Fall → Sep)
  });

  it('parses season-prefixed strings like "Spring 2023"', () => {
    const date = parseCVSortDate('Spring 2023');
    expect(date.getFullYear()).toBe(2023);
    expect(date.getMonth()).toBe(2); // Mar = 2 (Spring → Mar)
  });

  it('parses season-prefixed strings like "Summer 2020"', () => {
    const date = parseCVSortDate('Summer 2020');
    expect(date.getFullYear()).toBe(2020);
    expect(date.getMonth()).toBe(5); // Jun = 5 (Summer → Jun)
  });

  it('parses season-prefixed strings like "Winter 2019"', () => {
    const date = parseCVSortDate('Winter 2019');
    expect(date.getFullYear()).toBe(2019);
    expect(date.getMonth()).toBe(11); // Dec = 11 (Winter → Dec)
  });

  it('strips ordinal suffixes from day numbers ("February 5th, 2024")', () => {
    const date = parseCVSortDate('February 5th, 2024');
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(1); // Feb = 1
    expect(date.getDate()).toBe(5);
  });

  it('strips 1st ordinal suffix', () => {
    const date = parseCVSortDate('March 1st, 2023');
    expect(date.getFullYear()).toBe(2023);
    expect(date.getDate()).toBe(1);
  });

  it('strips 2nd ordinal suffix', () => {
    const date = parseCVSortDate('April 2nd, 2022');
    expect(date.getFullYear()).toBe(2022);
    expect(date.getDate()).toBe(2);
  });

  it('strips 3rd ordinal suffix', () => {
    const date = parseCVSortDate('June 3rd, 2021');
    expect(date.getFullYear()).toBe(2021);
    expect(date.getDate()).toBe(3);
  });

  it('parses "Various Periods Starting YYYY"', () => {
    const date = parseCVSortDate('Various Periods Starting 2012');
    expect(date.getFullYear()).toBe(2012);
    expect(date.getMonth()).toBe(0); // Jan = 0
  });

  it('takes the left side of a range string "Feb 2013 – Feb 2015"', () => {
    const date = parseCVSortDate('Feb 2013 – Feb 2015');
    expect(date.getFullYear()).toBe(2013);
    expect(date.getMonth()).toBe(1); // Feb = 1
  });

  it('returns epoch for empty string', () => {
    expect(parseCVSortDate('').getTime()).toBe(0);
  });

  it('returns epoch for whitespace-only string', () => {
    expect(parseCVSortDate('   ').getTime()).toBe(0);
  });

  it('returns epoch for completely unparseable string', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();
    const date = parseCVSortDate('not a real date');
    expect(date.getTime()).toBe(0);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Could not parse date'));
    spy.mockRestore();
  });
});

/* ── buildCVStoryItems ── */

describe('buildCVStoryItems', () => {
  const defaultInput = {
    about: makeAbout(),
    experiences: [],
    education: { entries: [] } as EducationInfo,
    certificates: [],
    volunteering: [],
    codingExamples: [],
  };

  it('always places the about item first', () => {
    const items = buildCVStoryItems({
      ...defaultInput,
      experiences: [makeExperience('Jan 2020')],
      codingExamples: [makeCoding()],
    });

    expect(items[0].kind).toBe('about');
  });

  it('always places coding items after all time-bounded items', () => {
    const items = buildCVStoryItems({
      ...defaultInput,
      experiences: [makeExperience('Jan 2025')],
      codingExamples: [makeCoding('Alpha'), makeCoding('Beta')],
    });

    const kinds = items.map((i) => i.kind);
    const lastExperienceIdx = kinds.lastIndexOf('experience');
    const firstCodingIdx = kinds.indexOf('coding');
    expect(firstCodingIdx).toBeGreaterThan(lastExperienceIdx);
  });

  it('sorts time-bounded items chronologically oldest-first', () => {
    const items = buildCVStoryItems({
      ...defaultInput,
      experiences: [
        makeExperience('Aug 2022', { company: 'Later' }),
        makeExperience('Jan 2018', { company: 'Earlier' }),
      ],
    });

    const experienceItems = items.filter((i) => i.kind === 'experience');
    expect((experienceItems[0].data as Experience).company).toBe('Earlier');
    expect((experienceItems[1].data as Experience).company).toBe('Later');
  });

  it('interleaves different time-bounded kinds by date', () => {
    const items = buildCVStoryItems({
      ...defaultInput,
      experiences: [makeExperience('Jun 2020', { company: 'Middle' })],
      certificates: [makeCertificate('Jan 2019', { title: 'Early Cert' })],
      volunteering: [makeVolunteering('Dec 2021', { organization: 'Late Vol' })],
    });

    const timeBounded = items.filter((i) => i.kind !== 'about' && i.kind !== 'coding');
    expect(timeBounded[0].kind).toBe('certificate');
    expect(timeBounded[1].kind).toBe('experience');
    expect(timeBounded[2].kind).toBe('volunteering');
  });

  it('includes education entries with dateRange', () => {
    const items = buildCVStoryItems({
      ...defaultInput,
      education: {
        entries: [makeEducation('Aug 2016 – May 2020')],
      },
    });

    expect(items.some((i) => i.kind === 'education')).toBe(true);
  });

  it('uses expectedCompletion when dateRange is absent for education', () => {
    const items = buildCVStoryItems({
      ...defaultInput,
      education: {
        entries: [makeEducation('', { dateRange: undefined, expectedCompletion: 'May 2026' })],
      },
    });

    const educationItem = items.find((i) => i.kind === 'education');
    expect(educationItem).toBeDefined();
    expect(
      (educationItem as Extract<CVStoryItem, { kind: 'education' }>).sortDate.getFullYear()
    ).toBe(2026);
  });

  it('returns only about when all arrays are empty', () => {
    const items = buildCVStoryItems(defaultInput);
    expect(items).toHaveLength(1);
    expect(items[0].kind).toBe('about');
  });

  it('preserves the full item structure through the builder', () => {
    const about = makeAbout({ name: 'Jane' });
    const items = buildCVStoryItems({ ...defaultInput, about });

    expect(items[0].kind).toBe('about');
    expect((items[0].data as AboutMe).name).toBe('Jane');
  });
});
