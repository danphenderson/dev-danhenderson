/** Gate actual entry + static-import bytes, so moving code between chunks cannot hide growth. */
const fs = require('node:fs');
const path = require('node:path');
const { gzipSync } = require('node:zlib');
const buildDir = path.resolve(__dirname, '../build');
const manifest = JSON.parse(fs.readFileSync(path.join(buildDir, '.vite/manifest.json'), 'utf8'));
const entry = Object.keys(manifest).find((key) => manifest[key].isEntry);
if (!entry) throw new Error('No bundle entry found; run npm run build first.');
const visited = new Set();
function visit(key) {
  if (visited.has(key)) return;
  visited.add(key);
  for (const imported of manifest[key].imports ?? []) visit(imported);
}
visit(entry);
let rawBytes = 0;
let gzipBytes = 0;
for (const key of visited) {
  const code = fs.readFileSync(path.join(buildDir, manifest[key].file));
  rawBytes += code.length;
  gzipBytes += gzipSync(code).length;
}
// October 2026 baseline: ~0.86 MB raw / 0.27 MB gzip. Includes framework + shared chrome,
// excludes route-specific dynamic imports. Keep headroom small and review intentional changes.
const limits = { raw: 950_000, gzip: 300_000 };
console.log(
  `Eager JavaScript: ${rawBytes} bytes; ${gzipBytes} bytes gzip across ${visited.size} chunks.`
);
if (rawBytes > limits.raw || gzipBytes > limits.gzip) {
  throw new Error(`Eager JS budget exceeded (${limits.raw} raw / ${limits.gzip} gzip).`);
}
