import type {
  AboutMe,
  CVStoryEndData,
  CVStoryItem,
  Certificate,
  CodingExample,
  EducationInfo,
  Experience,
  VolunteeringEntry,
} from '../types/cv';

export type { CVStoryItem };

/* ── Date parser ── */

const SEASON_MAP: Record<string, string> = {
  fall: 'Sep',
  spring: 'Mar',
  summer: 'Jun',
  winter: 'Dec',
};

/**
 * Parse a human-readable date string from CV data into a Date for sorting.
 *
 * Handles formats found in src/data/cv.ts:
 *  - "May 2025", "Jan 2025", "August 2021"
 *  - "Fall 2024 – Present", "Fall 2024 – Dec 2024"
 *  - "February 5th, 2024"
 *  - "Various Periods Starting 2012"
 *  - "Present" / "Current"
 */
export const parseCVSortDate = (str: string): Date => {
  if (!str || !str.trim()) return new Date(0);

  const trimmed = str.trim();

  // "Present" / "Current" → today
  if (/^(present|current)$/i.test(trimmed)) {
    return new Date();
  }

  // "Various Periods Starting YYYY"
  const variousMatch = trimmed.match(/various\s+periods\s+starting\s+(\d{4})/i);
  if (variousMatch) {
    return new Date(`Jan ${variousMatch[1]}`);
  }

  // Season prefixed: "Fall 2024 – Present" → extract "Fall 2024"
  const seasonMatch = trimmed.match(/^(fall|spring|summer|winter)\s+(\d{4})/i);
  if (seasonMatch) {
    const month = SEASON_MAP[seasonMatch[1].toLowerCase()];
    return new Date(`${month} ${seasonMatch[2]}`);
  }

  // Strip ordinal suffixes: "5th" → "5", "1st" → "1"
  const cleaned = trimmed.replace(/(\d+)(st|nd|rd|th)/gi, '$1');

  // For range strings like "Feb 2013 – Feb 2015", take the left side
  const leftSide = cleaned.split(/\s*[–—-]\s*/)[0].trim();

  const parsed = new Date(leftSide);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  console.warn(`[cvStoryItems] Could not parse date: "${str}" — using epoch fallback`);
  return new Date(0);
};

/* ── Builder ── */

type CVStoryInput = {
  about: AboutMe;
  experiences: Experience[];
  education: EducationInfo;
  certificates: Certificate[];
  volunteering: VolunteeringEntry[];
  codingExamples: CodingExample[];
  endData: CVStoryEndData;
};

type NarrativeChapterKind = 'experience' | 'education' | 'volunteering' | 'certificate';
type SortableItem = Extract<CVStoryItem, { kind: NarrativeChapterKind }>;

// Story mode follows the existing CV section flow without the GitHub sidebar section.
const STORY_CHAPTER_ORDER: NarrativeChapterKind[] = [
  'experience',
  'education',
  'volunteering',
  'certificate',
];

const sortStoryChapterItems = (left: SortableItem, right: SortableItem) =>
  left.sortDate.getTime() - right.sortDate.getTime();

export const buildCVStoryItems = (input: CVStoryInput): CVStoryItem[] => {
  const items: CVStoryItem[] = [];

  // 1. About — always first
  items.push({ kind: 'about', data: input.about });

  // 2. Time-bounded items — grouped by narrative chapter and sorted within each chapter
  const chapters: Record<NarrativeChapterKind, SortableItem[]> = {
    experience: [],
    education: [],
    volunteering: [],
    certificate: [],
  };

  for (const exp of input.experiences) {
    chapters.experience.push({
      kind: 'experience',
      data: exp,
      sortDate: parseCVSortDate(exp.startDate),
    });
  }
  for (const entry of input.education.entries) {
    chapters.education.push({
      kind: 'education',
      data: entry,
      sortDate: parseCVSortDate(entry.dateRange ?? entry.expectedCompletion ?? ''),
    });
  }
  for (const cert of input.certificates) {
    chapters.certificate.push({
      kind: 'certificate',
      data: cert,
      sortDate: parseCVSortDate(cert.date),
    });
  }
  for (const vol of input.volunteering) {
    chapters.volunteering.push({
      kind: 'volunteering',
      data: vol,
      sortDate: parseCVSortDate(vol.dateRange),
    });
  }

  for (const kind of STORY_CHAPTER_ORDER) {
    items.push(...chapters[kind].sort(sortStoryChapterItems));
  }

  // 3. Coding — appended after date-sorted items
  for (const example of input.codingExamples) {
    items.push({ kind: 'coding', data: example });
  }

  // 4. End / contact — always last
  items.push({ kind: 'end', data: input.endData });

  return items;
};
