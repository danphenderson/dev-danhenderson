/** Offline display-image generation. Originals remain the download source. */
const { createHash } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const manifestPath = path.join(root, 'src/generated/displayImages.json');
const widths = [480, 960, 1600, 2400];
const recipe = 'webp-q80-budgeted-effort5-inside-autoOrient-v2';
const checkOnly = process.argv.includes('--check');

async function collectImages(relativePath) {
  const absolutePath = path.join(publicDir, relativePath);
  const stat = await fs.stat(absolutePath);
  if (!stat.isDirectory()) return /\.(jpe?g|png)$/i.test(relativePath) ? [relativePath] : [];
  const names = (await fs.readdir(absolutePath)).sort();
  return (
    await Promise.all(names.map((name) => collectImages(path.join(relativePath, name))))
  ).flat();
}

async function main() {
  const sources = (
    await Promise.all([
      collectImages('assets/photography'),
      collectImages('assets/climbing'),
      collectImages('assets/home.jpg'),
    ])
  )
    .flat()
    .sort();
  const previous = await fs
    .readFile(manifestPath, 'utf8')
    .then(JSON.parse)
    .catch(() => ({}));
  const manifest = {};
  let totalBytes = 0;
  for (const source of sources) {
    const input = await fs.readFile(path.join(publicDir, source));
    const sourceHash = createHash('sha256').update(input).update(recipe).digest('hex');
    const key = `/${source.split(path.sep).join('/')}`;
    const existing = previous[key];
    if (checkOnly) {
      if (!existing || existing.sourceHash !== sourceHash)
        throw new Error(`Stale derivatives: ${key}`);
      for (const image of existing.images) {
        const stat = await fs.stat(path.join(publicDir, image.src));
        const edge = Math.max(image.width, image.height);
        const budget = edge <= 960 ? 250_000 : edge <= 1600 ? 500_000 : 1_000_000;
        if (stat.size > budget) throw new Error(`Image budget exceeded: ${image.src}`);
        if (stat.size !== image.bytes)
          throw new Error(`Missing or changed derivative: ${image.src}`);
        totalBytes += stat.size;
      }
      manifest[key] = existing;
      continue;
    }
    const images = [];
    for (const width of widths) {
      const budget = width <= 960 ? 250_000 : width <= 1600 ? 500_000 : 1_000_000;
      let result;
      for (let quality = 80; quality >= 40; quality -= 10) {
        result = await sharp(input)
          .rotate()
          .resize({ width, height: width, fit: 'inside', withoutEnlargement: true })
          .webp({ quality, effort: 5 })
          .toBuffer({ resolveWithObject: true });
        if (result.info.size <= budget) break;
      }
      const { data, info } = result;
      if (info.size > budget) throw new Error(`Image budget exceeded: ${source} at ${width}`);
      if (images.some((image) => image.width === info.width)) continue;
      const stem = source.replace(/^assets\//, '').replace(/\.[^.]+$/, '');
      const src = `/assets/display/${stem}-${sourceHash.slice(0, 10)}-${info.width}.webp`;
      const target = path.join(publicDir, src);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, data);
      images.push({ src, width: info.width, height: info.height, bytes: info.size });
      totalBytes += info.size;
    }
    manifest[key] = { sourceHash, images };
    process.stdout.write(`Generated ${key}\n`);
  }
  if (checkOnly && Object.keys(previous).length !== sources.length)
    throw new Error('Manifest contains removed sources');
  if (!checkOnly) {
    await fs.mkdir(path.dirname(manifestPath), { recursive: true });
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    // Remove only obsolete files from this generator's own output directory.
    const keep = new Set(
      Object.values(manifest).flatMap((entry) => entry.images.map((image) => image.src))
    );
    async function prune(dir) {
      for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) await prune(file);
        else if (!keep.has(`/${path.relative(publicDir, file).split(path.sep).join('/')}`))
          await fs.unlink(file);
      }
    }
    await prune(path.join(publicDir, 'assets/display'));
  }
  process.stdout.write(
    `${checkOnly ? 'Verified' : 'Generated'} ${sources.length} sources; ${(
      totalBytes / 1e6
    ).toFixed(2)} MB display assets.\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
