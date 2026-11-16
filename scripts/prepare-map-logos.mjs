import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const sourceDir = new URL('../public/logos/', import.meta.url);
const targetDir = new URL('../public/map-logos/', import.meta.url);
const manifestPath = new URL('../src/graph/logo-assets.json', import.meta.url);
const size = 256;
const originalSize = 512;
const optimizeOriginals = process.argv.includes('--optimize-originals');
const version = 1;
const backgroundVersion = 2;
let previous = {};
try { previous = JSON.parse(await readFile(manifestPath, 'utf8')); } catch { /* first build */ }
await mkdir(targetDir, { recursive: true });
const manifest = {};
let originalBytes = 0, mapBytes = 0;
let optimizedCount = 0, savedBytes = 0;
for (const name of (await readdir(sourceDir)).sort()) {
  if (!/\.(png|jpe?g|webp|gif|avif|svg)$/i.test(name)) continue;
  const sourcePath = new URL(encodeURIComponent(name), sourceDir);
  let input = await readFile(sourcePath);
  if (optimizeOriginals && !/\.svg$/i.test(name)) {
    try {
      const image = sharp(input);
      const metadata = await image.metadata();
      // Keep animations intact and only replace originals when this saves bytes.
      if ((metadata.pages ?? 1) === 1 && Math.max(metadata.width, metadata.height) > originalSize) {
        let resized = image.rotate().resize(originalSize, originalSize, { fit: 'inside', withoutEnlargement: true });
        if (metadata.format === 'jpeg') resized = resized.jpeg({ quality: 90, mozjpeg: true });
        if (metadata.format === 'png') resized = resized.png({ compressionLevel: 9 });
        if (metadata.format === 'webp') resized = resized.webp({ lossless: true });
        if (metadata.format === 'avif') resized = resized.avif({ quality: 90 });
        const output = await resized.toBuffer();
        if (output.length < input.length) {
          await writeFile(sourcePath, output);
          savedBytes += input.length - output.length;
          optimizedCount++;
          input = output;
        }
      }
    } catch (error) {
      console.warn(`Keeping original ${name}: ${error.message}`);
    }
  }
  const hash = createHash('sha256').update(input).update(`${version}:${size}`).digest('hex').slice(0, 16);
  const cached = previous[name];
  originalBytes += input.length;
  if (cached?.hash === hash && cached.backgroundVersion === backgroundVersion) {
    try {
      if (cached.file) await readFile(new URL(cached.file, targetDir));
      manifest[name] = cached;
      mapBytes += cached.bytes;
      continue;
    } catch { /* regenerate a missing thumbnail */ }
  }
  try {
    const image = sharp(input);
    const metadata = await image.metadata();
    // Read actual corner pixels, rather than averaging lettering into the background.
    // The most common corner wins; transparent corners use the white frame backing.
    const corners = await Promise.all([
      [0, 0], [metadata.width - 1, 0],
      [0, metadata.height - 1], [metadata.width - 1, metadata.height - 1],
    ].map(async ([left, top]) => {
      const data = await image.clone().extract({ left, top, width: 1, height: 1 })
        .toColourspace('srgb').ensureAlpha().raw().toBuffer();
      return data[3] < 200 ? '#ffffff' : `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    }));
    const counts = new Map();
    for (const colour of corners) counts.set(colour, (counts.get(colour) ?? 0) + 1);
    const background = [...counts].sort((a, b) => b[1] - a[1])[0][0];
    const output = await image.clone().resize(size, size, { fit: 'inside', withoutEnlargement: true })
      .webp({ lossless: true }).toBuffer();
    // Preserve vector sharpness and already-small assets when converting costs more.
    const useThumbnail = !/\.svg$/i.test(name) && (output.length < input.length || Math.max(metadata.width, metadata.height) > size);
    const file = useThumbnail ? `${hash}.webp` : null;
    if (file) await writeFile(new URL(file, targetDir), output);
    manifest[name] = { hash, backgroundVersion, file, ratio: metadata.width / metadata.height, background, bytes: file ? output.length : input.length };
    mapBytes += manifest[name].bytes;
  } catch (error) {
    // A few existing logo files are not decodable images; keep the normal
    // browser fallback rather than blocking dev/build for unrelated data.
    console.warn(`Keeping original ${name}: ${error.message}`);
    mapBytes += input.length;
  }
}
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
// Remove obsolete generated thumbnails so they aren't shipped with the site.
const activeFiles = new Set(Object.values(manifest).map(asset => asset.file));
for (const file of await readdir(targetDir)) {
  if (/^[a-f0-9]{16}\.webp$/.test(file) && !activeFiles.has(file)) {
    await unlink(new URL(file, targetDir));
  }
}
console.log(`Map logos: ${Object.keys(manifest).length} assets, ${(originalBytes / 1e6).toFixed(2)} MB → ${(mapBytes / 1e6).toFixed(2)} MB (originals preserved).`);
if (optimizeOriginals) console.log(`Optimized ${optimizedCount} originals to at most ${originalSize}px, saving ${(savedBytes / 1e6).toFixed(2)} MB.`);
