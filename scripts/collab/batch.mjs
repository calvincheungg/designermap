/**
 * Crawls several Hypebeast archives one after another.
 *   node scripts/collab/batch.mjs <outDir> slug1 slug2 …
 *
 * Tries /brands/<slug>, then /tags/<slug> when that has no archive, redirects or
 * doesn't paginate. Writes <slug>.tsv and <slug>.log (and <slug>.tag.log) to outDir.
 * Finished slugs are skipped on a rerun. Stops when Hypebeast throttles.
 * Run it in the background, smallest archives first.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const [outDir, ...slugs] = process.argv.slice(2);
if (!outDir || !slugs.length) {
  console.error('Usage: node scripts/collab/batch.mjs <outDir> slug1 slug2 …');
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });
const crawler = fileURLToPath(new URL('crawl.mjs', import.meta.url));
const finished = (path) => existsSync(path) && /^COMPLETE/m.test(readFileSync(path, 'utf8'));
function crawl(kind, slug, log) {
  const run = spawnSync('node', [crawler, `https://hypebeast.com/${kind}/${slug}`, join(outDir, `${slug}.tsv`)], { encoding: 'utf8' });
  const text = run.stdout + run.stderr;
  writeFileSync(log, text);
  console.log(`${slug} (${kind}): ${text.trim().split('\n').at(-1)}`);
  return text;
}
for (const slug of slugs) {
  const brandLog = join(outDir, `${slug}.log`);
  const tagLog = join(outDir, `${slug}.tag.log`);
  if (finished(brandLog) || finished(tagLog)) continue;
  let text = crawl('brands', slug, brandLog);
  if (/No archive at|redirects to|same articles/.test(text)) text = crawl('tags', slug, tagLog);
  if (/throttled pages in a row/.test(text)) {
    console.log(`Throttled at ${slug}. Wait, then resume it with crawl.mjs --from <page>; rerun this for the rest.`);
    process.exit(2);
  }
}
console.log('ALL DONE');
