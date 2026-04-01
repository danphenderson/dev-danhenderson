import { mergeSx } from '../../../../src/components/text/textFactory';
import { mergeSx as canonicalMergeSx } from '../../../../src/utils/sx';

describe('textFactory mergeSx compatibility export', () => {
  it('re-exports the canonical utils mergeSx helper', () => {
    expect(mergeSx).toBe(canonicalMergeSx);
  });
});
