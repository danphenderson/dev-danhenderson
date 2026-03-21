import { buildInfo } from '../../../src/utils/buildInfo';
import type { BuildInfo } from '../../../src/utils/buildInfo';

describe('buildInfo', () => {
  it('exports an object that satisfies the BuildInfo shape', () => {
    const info: BuildInfo = buildInfo;
    expect(info).toBeDefined();
  });

  it('has a non-empty gitSha string', () => {
    expect(typeof buildInfo.gitSha).toBe('string');
    expect(buildInfo.gitSha.length).toBeGreaterThan(0);
  });

  it('has a non-empty buildTime string', () => {
    expect(typeof buildInfo.buildTime).toBe('string');
    expect(buildInfo.buildTime.length).toBeGreaterThan(0);
  });

  it('has a non-empty version string', () => {
    expect(typeof buildInfo.version).toBe('string');
    expect(buildInfo.version.length).toBeGreaterThan(0);
  });

  it('has a non-empty nodeEnv string', () => {
    expect(typeof buildInfo.nodeEnv).toBe('string');
    expect(buildInfo.nodeEnv.length).toBeGreaterThan(0);
  });

  it('defaults gitSha to "dev" in a test environment', () => {
    // In tests REACT_APP_GIT_SHA is not set, so the fallback applies
    expect(buildInfo.gitSha).toBe('dev');
  });

  it('defaults buildTime to "unknown" in a test environment', () => {
    expect(buildInfo.buildTime).toBe('unknown');
  });

  it('defaults version to "dev" in a test environment', () => {
    expect(buildInfo.version).toBe('dev');
  });

  it('defaults nodeEnv to "test" in a Jest environment', () => {
    expect(buildInfo.nodeEnv).toBe('test');
  });
});
