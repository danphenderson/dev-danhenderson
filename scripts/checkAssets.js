const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const path = require('node:path');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const contentTypes = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

async function collectAssetPaths() {
  const paths = new Set();
  for (const name of ['cv', 'photography']) {
    const file = path.join(root, `src/data/${name}.ts`);
    const source = ts.createSourceFile(file, await readFile(file, 'utf8'), ts.ScriptTarget.Latest);
    const visit = (node) => {
      if (ts.isStringLiteral(node) && /^\/?assets\//.test(node.text)) {
        paths.add(`/${node.text.replace(/^\/+/, '')}`);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  const manifest = JSON.parse(await readFile(path.join(root, 'src/generated/displayImages.json')));
  for (const [source, entry] of Object.entries(manifest)) {
    paths.add(source);
    for (const image of entry.images) paths.add(image.src);
  }
  return [...paths].sort();
}

function assertSignature(body, asset) {
  const extension = path.extname(asset);
  const valid =
    (extension === '.pdf' && body.subarray(0, 5).toString() === '%PDF-') ||
    (['.jpg', '.jpeg'].includes(extension) && body.subarray(0, 3).equals(Buffer.from([255, 216, 255]))) ||
    (extension === '.png' && body.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ||
    (extension === '.webp' &&
      body.subarray(0, 4).toString() === 'RIFF' &&
      body.subarray(8, 12).toString() === 'WEBP');
  assert(valid, `${asset}: invalid ${extension} payload (possibly an HTML rewrite or Git LFS pointer)`);
}

function assertResponse(response, body, asset) {
  assert.equal(response.status, 200, `${asset}: HTTP ${response.status}`);
  const type = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  assert.equal(type, contentTypes[path.extname(asset)], `${asset}: wrong Content-Type ${type}`);
  assertSignature(body, asset);
}

async function checkAssets({ directory = 'build', url } = {}) {
  const assets = await collectAssetPaths();
  const base = url ? new URL(`${url.replace(/\/+$/, '')}/`) : undefined;
  if (base) assert(['http:', 'https:'].includes(base.protocol), 'Expected an HTTP(S) deployment URL');
  for (const asset of assets) {
    const source = await readFile(path.join(root, 'public', asset));
    assertSignature(source, asset);
    if (base) {
      const response = await fetch(new URL(asset.slice(1), base), {
        signal: AbortSignal.timeout(30_000),
      });
      const body = Buffer.from(await response.arrayBuffer());
      assertResponse(response, body, asset);
      assert(body.equals(source), `${asset}: deployed file differs from this checkout`);
      if (asset.endsWith('.pdf')) {
        const range = await fetch(new URL(asset.slice(1), base), {
          headers: { Range: 'bytes=0-4' },
          signal: AbortSignal.timeout(30_000),
        });
        assert.equal(range.status, 206, `${asset}: host must support PDF byte ranges`);
        assert.match(range.headers.get('content-range') ?? '', /^bytes 0-4\/\d+$/);
        assert.equal(range.headers.get('content-type')?.split(';')[0], 'application/pdf');
        assert.equal(await range.text(), '%PDF-', `${asset}: invalid PDF range payload`);
      }
    } else {
      const body = await readFile(path.join(root, directory, asset));
      assertSignature(body, asset);
      assert(body.equals(source), `${asset}: build differs from public source`);
    }
  }
  console.log(`Verified ${assets.length} CV and media assets in ${url ?? directory}.`);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index];
    if (!['--directory', '--url'].includes(name) || !args[index + 1]) {
      throw new Error('Usage: checkAssets.js [--directory build] [--url https://host/base]');
    }
    options[name.slice(2)] = args[index + 1];
  }
  checkAssets(options).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { assertSignature, assertResponse, collectAssetPaths };
