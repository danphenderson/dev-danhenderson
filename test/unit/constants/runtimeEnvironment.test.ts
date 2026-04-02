export {};

const loadRuntimeEnvironmentModuleForEnv = (env: {
  REACT_APP_RUNTIME_ENV?: string;
  NODE_ENV?: string;
}) => {
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

  let moduleUnderTest!: typeof import('../../../src/constants/runtimeEnvironment');

  jest.isolateModules(() => {
    moduleUnderTest =
      require('../../../src/constants/runtimeEnvironment') as typeof import('../../../src/constants/runtimeEnvironment');
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

describe('runtimeEnvironment', () => {
  it('uses the explicit runtime override when provided', () => {
    const runtimeEnvironmentModule = loadRuntimeEnvironmentModuleForEnv({
      REACT_APP_RUNTIME_ENV: 'production',
      NODE_ENV: 'test',
    });

    expect(runtimeEnvironmentModule.appRuntimeEnvironment).toBe('production');
  });

  it('falls back to NODE_ENV when no runtime override is set', () => {
    const runtimeEnvironmentModule = loadRuntimeEnvironmentModuleForEnv({ NODE_ENV: 'test' });

    expect(runtimeEnvironmentModule.appRuntimeEnvironment).toBe('test');
  });

  it('defaults to development for unknown environments', () => {
    const runtimeEnvironmentModule = loadRuntimeEnvironmentModuleForEnv({ NODE_ENV: 'staging' });

    expect(runtimeEnvironmentModule.appRuntimeEnvironment).toBe('development');
  });
});
