import { cvSectionMetadata, cvSectionNavigationOrder } from '../../../../src/components/cv/cvSectionMetadata';
import type { CVSectionKey } from '../../../../src/components/cv/cvSectionMetadata';

describe('cvSectionMetadata', () => {
  it('defines IDs, labels, and navLabels for all expected CV sections', () => {
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
      expect(cvSectionMetadata[key].navLabel).toBeTruthy();
    });
  });

  it('uses unique section IDs', () => {
    const ids = Object.values(cvSectionMetadata).map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('exports a navigation order that covers navigable sections', () => {
    const allKeys = Object.keys(cvSectionMetadata) as CVSectionKey[];
    cvSectionNavigationOrder.forEach((key) => {
      expect(allKeys).toContain(key);
    });
    expect(cvSectionNavigationOrder.length).toBeGreaterThan(0);
  });
});
