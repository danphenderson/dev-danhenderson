import { buildInfo, hasBuildMetadata } from '../../../src/utils/buildInfo';
import type { BuildInfo } from '../../../src/utils/buildInfo';

describe('buildInfo', () => {
  it('exports an object that satisfies the BuildInfo shape', () => {
    const info: BuildInfo = buildInfo;
    expect(info).toBeDefined();
  });

  it('exposes stamped metadata fields as optional strings', () => {
    expect(buildInfo.gitSha === undefined || typeof buildInfo.gitSha === 'string').toBe(true);
    expect(buildInfo.buildTime === undefined || typeof buildInfo.buildTime === 'string').toBe(true);
    expect(buildInfo.version === undefined || typeof buildInfo.version === 'string').toBe(true);
  });

  it('has a non-empty nodeEnv string', () => {
    expect(typeof buildInfo.nodeEnv).toBe('string');
    expect(buildInfo.nodeEnv.length).toBeGreaterThan(0);
  });

  it('omits gitSha in a test environment when metadata is not stamped', () => {
    expect(buildInfo.gitSha).toBeUndefined();
  });

  it('omits buildTime in a test environment when metadata is not stamped', () => {
    expect(buildInfo.buildTime).toBeUndefined();
  });

  it('omits version in a test environment when metadata is not stamped', () => {
    expect(buildInfo.version).toBeUndefined();
  });

  it('defaults nodeEnv to "test" in a Jest environment', () => {
    expect(buildInfo.nodeEnv).toBe('test');
  });

  it('reports that stamped build metadata is unavailable in a Jest environment', () => {
    expect(hasBuildMetadata).toBe(false);
  });
});
