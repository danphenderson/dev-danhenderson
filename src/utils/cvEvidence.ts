import type { CodingExample, CVEvidenceTarget, Experience } from '../types/cv';

export const getCVEntryAnchor = (kind: CVEvidenceTarget['kind'], id: string) => `cv-${kind}-${id}`;

export const resolveCVEntryTarget = (
  hash: string,
  examples: CodingExample[],
  experiences: Experience[]
): CVEvidenceTarget | undefined => {
  const anchor = hash.replace(/^#/, '');
  for (const example of examples) {
    if (example.id && getCVEntryAnchor('coding', example.id) === anchor) {
      return { kind: 'coding', entryId: example.id };
    }
  }
  for (const experience of experiences) {
    if (experience.id && getCVEntryAnchor('experience', experience.id) === anchor) {
      return { kind: 'experience', entryId: experience.id };
    }
  }
  return undefined;
};
