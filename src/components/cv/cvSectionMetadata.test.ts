import { cvSectionMetadata, cvProductivitySectionOrder } from './cvSectionMetadata';
import type { CVSectionKey } from './cvSectionMetadata';

describe('cvSectionMetadata', () => {
  it('defines IDs and labels for all expected CV sections', () => {
    const expectedKeys: CVSectionKey[] = [
      'about',
      'experience',
      'education',
      'volunteering',
      'github',
      'certificates',
      'tools',
      'coding',
    ];

    expectedKeys.forEach((key) => {
      expect(cvSectionMetadata[key]).toBeDefined();
      expect(cvSectionMetadata[key].id).toBeTruthy();
      expect(cvSectionMetadata[key].label).toBeTruthy();
    });
  });

  it('uses unique section IDs', () => {
    const ids = Object.values(cvSectionMetadata).map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('exports a productivity section order that includes all section keys', () => {
    const allKeys = Object.keys(cvSectionMetadata) as CVSectionKey[];
    expect(cvProductivitySectionOrder).toEqual(expect.arrayContaining(allKeys));
    expect(cvProductivitySectionOrder).toHaveLength(allKeys.length);
  });
});
