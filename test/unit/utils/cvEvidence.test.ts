import {
  codingExamples,
  currentWorkflowEvidence,
  currentWorkflowTools,
  experiences,
} from '../../../src/data/cv';
import { getCVEntryAnchor, resolveCVEntryTarget } from '../../../src/utils/cvEvidence';

describe('CV evidence destinations', () => {
  it('assigns unique stable IDs to production records', () => {
    for (const records of [codingExamples, experiences]) {
      const ids = records.map((entry) => entry.id);
      expect(ids.every((id) => id && /^[a-z0-9-]+$/.test(id))).toBe(true);
      expect(new Set(ids).size).toBe(records.length);
    }
  });

  it('resolves every linked skill to supporting content regardless of record order', () => {
    expect(Object.keys(currentWorkflowEvidence)).toHaveLength(8);
    for (const [skill, evidence] of Object.entries(currentWorkflowEvidence)) {
      expect(currentWorkflowTools).toContain(skill);
      expect(evidence?.accessibleLabel.startsWith(skill)).toBe(true);
      const target = evidence!.target;
      expect(
        resolveCVEntryTarget(
          `#${getCVEntryAnchor(target.kind, target.entryId)}`,
          [...codingExamples].reverse(),
          [...experiences].reverse()
        )
      ).toEqual(target);
      if (target.kind === 'coding') {
        expect(codingExamples.find((entry) => entry.id === target.entryId)?.tabs).toEqual(
          expect.arrayContaining([expect.objectContaining({ value: 'approach' })])
        );
      } else {
        expect(
          experiences.find((entry) => entry.id === target.entryId)?.projects?.length
        ).toBeGreaterThan(0);
      }
    }
  });

  it('leaves unsupported skills plain and rejects unknown or inferred targets', () => {
    for (const skill of ['Julia', 'Docker', 'Docker Compose']) {
      expect(currentWorkflowEvidence[skill]).toBeUndefined();
    }
    for (const hash of [
      '',
      '#cv-coding',
      '#cv-coding-0',
      '#cv-coding-missing',
      '#cv-coding-typewriter%20',
    ]) {
      expect(resolveCVEntryTarget(hash, codingExamples, experiences)).toBeUndefined();
    }
  });
});
