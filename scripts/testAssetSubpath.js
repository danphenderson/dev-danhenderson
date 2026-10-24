const { spawnSync } = require('node:child_process');
const { cp, mkdtemp, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(script, env, args = []) {
  const result = spawnSync(npm, ['run', script, '--', ...args], {
    cwd: root,
    env,
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

async function main() {
  const deployment = await mkdtemp(path.join(tmpdir(), 'portfolio-asset-regression-'));
  const env = { ...process.env, PUBLIC_URL: '/portfolio', PLAYWRIGHT_SERVE_DIR: deployment };
  let status = 1;
  try {
    status = run('build', env);
    if (status === 0) {
      await cp(path.join(root, 'build'), path.join(deployment, 'portfolio'), { recursive: true });
      // serve's SPA fallback lives at the server root; its asset URLs retain /portfolio.
      await cp(path.join(root, 'build/index.html'), path.join(deployment, 'index.html'));
      status = run('test:e2e:assets', env, process.argv.slice(2));
    }
  } finally {
    await rm(deployment, { recursive: true, force: true });
    const restoreStatus = run('build', process.env);
    if (restoreStatus !== 0) status = restoreStatus;
  }
  process.exitCode = status;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
