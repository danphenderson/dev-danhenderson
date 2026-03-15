/**
 * Build-time metadata injected via CRA's REACT_APP_* environment variables.
 *
 * Populate at build time by setting environment variables, e.g.:
 *   REACT_APP_GIT_SHA=$(git rev-parse --short HEAD) \
 *   REACT_APP_BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ") \
 *   npm run build
 */

export type BuildInfo = {
  gitSha: string;
  buildTime: string;
  version: string;
  nodeEnv: string;
};

export const buildInfo: BuildInfo = {
  gitSha: process.env.REACT_APP_GIT_SHA ?? 'dev',
  buildTime: process.env.REACT_APP_BUILD_TIME ?? new Date().toISOString(),
  version: process.env.REACT_APP_VERSION ?? '1.0.0',
  nodeEnv: process.env.NODE_ENV ?? 'development',
};
