const { spawnSync } = require('node:child_process');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const projects = [
  {
    label: 'chromium',
    buildScript: 'build:e2e',
    testScript: 'test:e2e:chromium',
  },
  {
    label: 'smoke',
    buildScript: 'build',
    testScript: 'test:e2e:smoke',
  },
];

const runNpmScript = (scriptName, description) => {
  console.log(`\n> ${description}`);
  const result = spawnSync(npmCommand, ['run', scriptName], {
    stdio: 'inherit',
  });

  return result.status ?? 1;
};

let hasFailure = false;

for (const project of projects) {
  const buildExitCode = runNpmScript(project.buildScript, `Building ${project.label} Playwright bundle`);

  if (buildExitCode !== 0) {
    hasFailure = true;
    continue;
  }

  const testExitCode = runNpmScript(project.testScript, `Running ${project.label} Playwright project`);

  if (testExitCode !== 0) {
    hasFailure = true;
  }
}

process.exit(hasFailure ? 1 : 0);