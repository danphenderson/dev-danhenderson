const { execFileSync, spawnSync } = require('node:child_process');
const { readFileSync } = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const runtimeEnvArg = process.argv.find((arg) => arg.startsWith('--runtime-env='));
const runtimeEnv = runtimeEnvArg?.slice('--runtime-env='.length);

const readPackageVersion = () => {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
};

const resolveGitSha = () => {
  try {
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return process.env.GITHUB_SHA?.slice(0, 7) ?? 'unknown';
  }
};

const env = {
  ...process.env,
  REACT_APP_GIT_SHA: process.env.REACT_APP_GIT_SHA ?? resolveGitSha(),
  REACT_APP_BUILD_TIME: process.env.REACT_APP_BUILD_TIME ?? new Date().toISOString(),
  REACT_APP_VERSION: process.env.REACT_APP_VERSION ?? readPackageVersion(),
};

if (runtimeEnv) {
  env.REACT_APP_RUNTIME_ENV = runtimeEnv;
}

const result = spawnSync(npmCommand, ['exec', 'vite', 'build'], {
  cwd: rootDir,
  env,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
