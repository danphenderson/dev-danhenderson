import { readNodeEnvironment, readRuntimeEnvironmentOverride } from '../utils/appEnvironment';

export type AppRuntimeEnvironment = 'development' | 'test' | 'production';

const runtimeEnvironmentValues: readonly AppRuntimeEnvironment[] = [
  'development',
  'test',
  'production',
];

const isRuntimeEnvironment = (value: string | undefined): value is AppRuntimeEnvironment =>
  Boolean(value && runtimeEnvironmentValues.includes(value as AppRuntimeEnvironment));

export const resolveAppRuntimeEnvironment = (): AppRuntimeEnvironment => {
  const runtimeOverride = readRuntimeEnvironmentOverride();
  if (isRuntimeEnvironment(runtimeOverride)) {
    return runtimeOverride;
  }

  const nodeEnvironment = readNodeEnvironment();
  if (nodeEnvironment === 'production') {
    return 'production';
  }

  if (nodeEnvironment === 'test') {
    return 'test';
  }

  return 'development';
};

export const appRuntimeEnvironment = resolveAppRuntimeEnvironment();
