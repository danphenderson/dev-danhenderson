/**
 * Build-time metadata injected via CRA's REACT_APP_* environment variables.
 *
 * npm run build and npm run build:e2e populate these values for bundled artifacts.
 * The fallbacks below are intentionally explicit placeholders for local development
 * and test sessions that do not stamp build metadata.
 */

export type BuildInfo = {
  gitSha: string;
  buildTime: string;
  version: string;
  nodeEnv: string;
};

export const buildInfo: BuildInfo = {
  gitSha: process.env.REACT_APP_GIT_SHA ?? 'dev',
  buildTime: process.env.REACT_APP_BUILD_TIME ?? 'unknown',
  version: process.env.REACT_APP_VERSION ?? 'dev',
  nodeEnv: process.env.NODE_ENV ?? 'development',
};
