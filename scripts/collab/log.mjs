/**
 * Adds research-log entries from batch.mjs logs, at their alphabetical position.
 *   node scripts/collab/log.mjs <logDir> houseId=slug … [houseId=none for no archive]
 *
 * Leaves existing entries alone (update those by hand). Only writes complete crawls;
 * unfinished ones need the comment line described in docs/brand-research.md.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { dataPath, loadData } from './data.mjs';

const [dir, ...pairs] = process.argv.slice(2);
if (!dir || !pairs.length) {
  console.error('Usage: node scripts/collab/log.mjs <logDir> houseId=slug …');
  process.exit(1);
}
const { houses } = await loadData();
const path = dataPath('research-log.ts');
const lines = readFileSync(path, 'utf8').split('\n');
const start = lines.findIndex((line) => line.startsWith('export const collabSearches'));
const now = new Date();
const date = [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((part) => String(part).padStart(2, '0')).join('-');
for (const pair of pairs) {
  const [id, slug] = pair.split('=');
  if (!Object.hasOwn(houses, id)) { console.log(`${id}: unknown house, skipped`); continue; }
  if (lines.some((line, i) => i > start && line.startsWith(`  ${id}:`))) { console.log(`${id}: already logged, skipped`); continue; }
  const entry = [];
  if (slug === 'none') entry.push(`  ${id}: { date: '${date}', complete: true, noArchive: true },`);
  else {
    const tag = existsSync(join(dir, `${slug}.tag.log`));
    const log = join(dir, `${slug}${tag ? '.tag' : ''}.log`);
    const result = existsSync(log) && readFileSync(log, 'utf8').match(/^COMPLETE: last page (\d+), oldest article (\d{4})/m);
    if (!result) { console.log(`${id}: no complete crawl for ${slug}, skipped`); continue; }
    if (tag) entry.push(`  // No /brands/ archive; crawled /tags/${slug}.`);
    entry.push(`  ${id}: { date: '${date}', complete: true, lastPage: ${result[1]}, oldestYear: ${result[2]} },`);
  }
  let at = lines.findIndex((line, i) => {
    const key = i > start && line.match(/^  (\w+):/);
    return (key && key[1].toLowerCase() > id.toLowerCase()) || (i > start && line.startsWith('}'));
  });
  while (lines[at - 1].trim().startsWith('//')) at--;
  lines.splice(at, 0, ...entry);
  console.log(`${id}: added`);
}
writeFileSync(path, lines.join('\n'));
