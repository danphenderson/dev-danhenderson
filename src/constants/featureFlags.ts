export type AppRuntimeEnvironment = 'development' | 'test' | 'production';

export type FeatureFlagId = 'blog';

export type FeatureFlagDefinition = {
  id: FeatureFlagId;
  description: string;
  enabledIn: readonly AppRuntimeEnvironment[];
};

const runtimeEnvironmentValues: readonly AppRuntimeEnvironment[] = [
  'development',
  'test',
  'production',
];

const isRuntimeEnvironment = (value: string | undefined): value is AppRuntimeEnvironment =>
  Boolean(value && runtimeEnvironmentValues.includes(value as AppRuntimeEnvironment));

export const resolveAppRuntimeEnvironment = (): AppRuntimeEnvironment => {
  const runtimeOverride = process.env.REACT_APP_RUNTIME_ENV;
  if (isRuntimeEnvironment(runtimeOverride)) {
    return runtimeOverride;
  }

  const nodeEnvironment = process.env.NODE_ENV;
  if (nodeEnvironment === 'production') {
    return 'production';
  }

  if (nodeEnvironment === 'test') {
    return 'test';
  }

  return 'development';
};

export const appRuntimeEnvironment = resolveAppRuntimeEnvironment();

export const featureFlagMap: Record<FeatureFlagId, FeatureFlagDefinition> = {
  blog: {
    id: 'blog',
    description: 'Blog routes, navigation, and command-palette entries.',
    enabledIn: ['development', 'test'],
  },
};

export const isFeatureEnabled = (flagId: FeatureFlagId): boolean =>
  featureFlagMap[flagId].enabledIn.includes(appRuntimeEnvironment);
