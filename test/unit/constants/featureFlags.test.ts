const loadFeatureFlagsForEnv = (env: { REACT_APP_RUNTIME_ENV?: string; NODE_ENV?: string }) => {
  const previousRuntimeEnv = process.env.REACT_APP_RUNTIME_ENV;
  const previousNodeEnv = process.env.NODE_ENV;

  if (env.REACT_APP_RUNTIME_ENV === undefined) {
    delete process.env.REACT_APP_RUNTIME_ENV;
  } else {
    process.env.REACT_APP_RUNTIME_ENV = env.REACT_APP_RUNTIME_ENV;
  }

  if (env.NODE_ENV === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = env.NODE_ENV;
  }

  jest.resetModules();

  let moduleUnderTest!: typeof import('../../../src/constants/featureFlags');

  jest.isolateModules(() => {
    moduleUnderTest =
      require('../../../src/constants/featureFlags') as typeof import('../../../src/constants/featureFlags');
  });

  if (previousRuntimeEnv === undefined) {
    delete process.env.REACT_APP_RUNTIME_ENV;
  } else {
    process.env.REACT_APP_RUNTIME_ENV = previousRuntimeEnv;
  }

  if (previousNodeEnv === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = previousNodeEnv;
  }

  jest.resetModules();

  return moduleUnderTest;
};

describe('featureFlags', () => {
  it('uses the explicit runtime override when provided', () => {
    const featureFlags = loadFeatureFlagsForEnv({
      REACT_APP_RUNTIME_ENV: 'production',
      NODE_ENV: 'test',
    });

    expect(featureFlags.appRuntimeEnvironment).toBe('production');
  });

  it('falls back to NODE_ENV when no runtime override is set', () => {
    const featureFlags = loadFeatureFlagsForEnv({ NODE_ENV: 'test' });

    expect(featureFlags.appRuntimeEnvironment).toBe('test');
  });

  it('defaults to development for unknown environments', () => {
    const featureFlags = loadFeatureFlagsForEnv({ NODE_ENV: 'staging' });

    expect(featureFlags.appRuntimeEnvironment).toBe('development');
  });

  it('enables the blog in development and test', () => {
    const developmentFlags = loadFeatureFlagsForEnv({ NODE_ENV: 'development' });
    const testFlags = loadFeatureFlagsForEnv({ NODE_ENV: 'test' });

    expect(developmentFlags.isFeatureEnabled('blog')).toBe(true);
    expect(testFlags.isFeatureEnabled('blog')).toBe(true);
  });

  it('disables the blog in production', () => {
    const featureFlags = loadFeatureFlagsForEnv({ NODE_ENV: 'production' });

    expect(featureFlags.isFeatureEnabled('blog')).toBe(false);
  });
});
