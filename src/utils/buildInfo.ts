/**
 * Build-time metadata injected via the shared app-environment compatibility layer.
 *
 * npm run build and npm run build:e2e currently populate these values from
 * CRA-style REACT_APP_* environment variables before bundling.
 * The fallbacks below are intentionally explicit placeholders for local development
 * and test sessions that do not stamp build metadata.
 */

import { readBuildMetadata, readNodeEnvironment } from './appEnvironment';

export type BuildInfo = {
  gitSha: string;
  buildTime: string;
  version: string;
  nodeEnv: string;
};

const buildMetadata = readBuildMetadata();

export const buildInfo: BuildInfo = {
  gitSha: buildMetadata.gitSha ?? 'dev',
  buildTime: buildMetadata.buildTime ?? 'unknown',
  version: buildMetadata.version ?? 'dev',
  nodeEnv: readNodeEnvironment(),
};
