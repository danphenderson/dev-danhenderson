import {
  isGitHubApiEnabledInDevelopment,
  readBuildMetadata,
  readNodeEnvironment,
  readPublicUrl,
  readRuntimeEnvironmentOverride,
  type AppEnvironmentSource,
} from '../../../src/utils/appEnvironment';

describe('appEnvironment', () => {
  it('reads PUBLIC_URL and falls back to an empty string', () => {
    expect(readPublicUrl({ PUBLIC_URL: '/portfolio' })).toBe('/portfolio');
    expect(readPublicUrl({})).toBe('');
  });

  it('reads NODE_ENV and falls back to development', () => {
    expect(readNodeEnvironment({ NODE_ENV: 'test' })).toBe('test');
    expect(readNodeEnvironment({})).toBe('development');
  });

  it('reads the runtime environment override when present', () => {
    const env: AppEnvironmentSource = { REACT_APP_RUNTIME_ENV: 'production' };

    expect(readRuntimeEnvironmentOverride(env)).toBe('production');
    expect(readRuntimeEnvironmentOverride({})).toBeUndefined();
  });

  it('detects whether live GitHub requests are enabled outside production', () => {
    expect(isGitHubApiEnabledInDevelopment({ REACT_APP_ENABLE_GITHUB_API_IN_DEV: 'true' })).toBe(
      true
    );
    expect(isGitHubApiEnabledInDevelopment({ REACT_APP_ENABLE_GITHUB_API_IN_DEV: 'false' })).toBe(
      false
    );
    expect(isGitHubApiEnabledInDevelopment({})).toBe(false);
  });

  it('reads build metadata values without applying app-level fallbacks', () => {
    expect(
      readBuildMetadata({
        REACT_APP_GIT_SHA: 'abc1234',
        REACT_APP_BUILD_TIME: '2026-03-22T10:00:00.000Z',
        REACT_APP_VERSION: '1.2.3',
      })
    ).toEqual({
      gitSha: 'abc1234',
      buildTime: '2026-03-22T10:00:00.000Z',
      version: '1.2.3',
    });

    expect(readBuildMetadata({})).toEqual({
      gitSha: undefined,
      buildTime: undefined,
      version: undefined,
    });
  });
});
