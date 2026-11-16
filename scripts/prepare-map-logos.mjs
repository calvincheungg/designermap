import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const sourceDir = new URL('../public/logos/', import.meta.url);
const targetDir = new URL('../public/map-logos/', import.meta.url);
const manifestPath = new URL('../src/graph/logo-assets.json', import.meta.url);
const size = 256;
const version = 1;
let previous = {};
try { previous = JSON.parse(await readFile(manifestPath, 'utf8')); } catch { /* first build */ }
await mkdir(targetDir, { recursive: true });
const manifest = {};
let originalBytes = 0, mapBytes = 0;
for (const name of (await readdir(sourceDir)).sort()) {
  if (!/\.(png|jpe?g|webp|gif|avif|svg)$/i.test(name)) continue;
  const input = await readFile(new URL(encodeURIComponent(name), sourceDir));
  const hash = createHash('sha256').update(input).update(`${version}:${size}`).digest('hex').slice(0, 16);
  const cached = previous[name];
  originalBytes += input.length;
  if (cached?.hash === hash) {
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
    const { data } = await image.clone().resize(1, 1, { fit: 'fill' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const background = data[3] < 200 ? '#ffffff' : `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    const output = await image.clone().resize(size, size, { fit: 'inside', withoutEnlargement: true })
      .webp({ lossless: true }).toBuffer();
    // Preserve vector sharpness and already-small assets when converting costs more.
    const useThumbnail = !/\.svg$/i.test(name) && (output.length < input.length || Math.max(metadata.width, metadata.height) > size);
    const file = useThumbnail ? `${hash}.webp` : null;
    if (file) await writeFile(new URL(file, targetDir), output);
    manifest[name] = { hash, file, ratio: metadata.width / metadata.height, background, bytes: file ? output.length : input.length };
    mapBytes += manifest[name].bytes;
  } catch (error) {
    // A few existing logo files are not decodable images; keep the normal
    // browser fallback rather than blocking dev/build for unrelated data.
    console.warn(`Keeping original ${name}: ${error.message}`);
    mapBytes += input.length;
  }
}
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Map logos: ${Object.keys(manifest).length} assets, ${(originalBytes / 1e6).toFixed(2)} MB → ${(mapBytes / 1e6).toFixed(2)} MB (originals preserved).`);
