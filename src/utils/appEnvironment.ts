export type AppEnvironmentVariable =
  | 'PUBLIC_URL'
  | 'NODE_ENV'
  | 'REACT_APP_RUNTIME_ENV'
  | 'REACT_APP_ENABLE_GITHUB_API_IN_DEV'
  | 'REACT_APP_GIT_SHA'
  | 'REACT_APP_BUILD_TIME'
  | 'REACT_APP_VERSION';

export type AppEnvironmentSource =
  | NodeJS.ProcessEnv
  | Partial<Record<AppEnvironmentVariable, string | undefined>>;

export type BuildMetadataEnvironment = {
  gitSha?: string;
  buildTime?: string;
  version?: string;
};

declare const __APP_ENV__: Partial<Record<AppEnvironmentVariable, string | undefined>> | undefined;

const readDefaultEnvironmentSource = (): AppEnvironmentSource => {
  if (typeof __APP_ENV__ !== 'undefined') {
    return __APP_ENV__;
  }

  if (typeof process !== 'undefined') {
    return process.env;
  }

  return {};
};

export const readPublicUrl = (env: AppEnvironmentSource = readDefaultEnvironmentSource()): string =>
  env.PUBLIC_URL ?? '';

export const readNodeEnvironment = (
  env: AppEnvironmentSource = readDefaultEnvironmentSource()
): string => env.NODE_ENV ?? 'development';

export const readRuntimeEnvironmentOverride = (
  env: AppEnvironmentSource = readDefaultEnvironmentSource()
): string | undefined => env.REACT_APP_RUNTIME_ENV;

export const isGitHubApiEnabledInDevelopment = (
  env: AppEnvironmentSource = readDefaultEnvironmentSource()
): boolean => env.REACT_APP_ENABLE_GITHUB_API_IN_DEV === 'true';

export const readBuildMetadata = (
  env: AppEnvironmentSource = readDefaultEnvironmentSource()
): BuildMetadataEnvironment => ({
  gitSha: env.REACT_APP_GIT_SHA,
  buildTime: env.REACT_APP_BUILD_TIME,
  version: env.REACT_APP_VERSION,
});
