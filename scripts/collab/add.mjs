/**
 * Adds collaboration records from a list, skipping any already recorded.
 *   node scripts/collab/add.mjs candidates.txt [--write] [--include-review]
 *
 * One line per set of brands: house ids, then release years.
 *   goodhood vans 2017 2018
 *   ramidus diasporaSkateboards beamsT 2022
 * Blank lines and lines starting with # are ignored. Nothing is written without
 * --write. REVIEW rows may repeat a release under another label of the same
 * family or with fewer brands; they're held back until --include-review.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dataPath, loadData, rootOf } from './data.mjs';

const file = process.argv[2];
if (!file || file.startsWith('--')) {
  console.error('Usage: node scripts/collab/add.mjs candidates.txt [--write] [--include-review]');
  process.exit(1);
}
const write = process.argv.includes('--write');
const includeReview = process.argv.includes('--include-review');
const { houses, collaborations } = await loadData();
const root = (id) => rootOf(houses, id);
const signature = (ids, year) => `${[...ids].sort().join('+')}@${year}`;
const records = Object.values(collaborations).map(({ houses: ids, year }) => ({ ids: [...ids], year }));
const recorded = new Set(records.map(({ ids, year }) => signature(ids, year)));
const keys = new Set(Object.keys(collaborations));

/** Same year, and two or more brand families in common. */
function similar(ids, year) {
  const families = new Set(ids.map(root));
  return records.filter((record) => {
    if (record.year !== year) return false;
    return new Set(record.ids.map(root).filter((family) => families.has(family))).size >= 2;
  });
}

const problems = [];
const ready = [];
const review = [];
let skipped = 0;
readFileSync(file, 'utf8').split('\n').forEach((raw, index) => {
  const line = raw.trim();
  if (!line || line.startsWith('#')) return;
  const words = line.split(/\s+/);
  const years = words.filter((word) => /^\d{4}$/.test(word)).map(Number);
  const ids = words.filter((word) => !/^\d{4}$/.test(word));
  const unknown = ids.filter((id) => !Object.hasOwn(houses, id));
  if (unknown.length) problems.push(`line ${index + 1}: unknown house ${unknown.join(', ')}`);
  if (new Set(ids).size !== ids.length || ids.length < 2) problems.push(`line ${index + 1}: needs two or more different houses`);
  if (!years.length) problems.push(`line ${index + 1}: no year`);
  if (unknown.length) return;
  for (const year of years) {
    if (recorded.has(signature(ids, year))) {
      skipped++;
      continue;
    }
    const near = similar(ids, year);
    (near.length ? review : ready).push({ ids, year, near });
    recorded.add(signature(ids, year));
    records.push({ ids, year });
  }
});
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

for (const { ids, year, near } of review) {
  console.log(`REVIEW ${ids.join('+')} ${year} | recorded: ${near.map((record) => record.ids.join('+')).join('; ')}`);
}
const adding = includeReview ? [...ready, ...review] : ready;
const lines = adding.map(({ ids, year }) => {
  const stem = ids.map((id, index) => (index ? id[0].toUpperCase() + id.slice(1) : id)).join('') + year;
  let key = stem;
  for (let n = 2; keys.has(key); n++) key = `${stem}No${n}`;
  keys.add(key);
  return `  ${key}: { houses: [${ids.map((id) => `'${id}'`).join(', ')}], year: ${year} },`;
});
console.log(`${lines.length} ${write ? 'added' : 'to add'}, ${skipped} already recorded, ${review.length} to review${includeReview ? ' (included)' : ''}`);
if (write && lines.length) {
  const path = dataPath('collaborations.ts');
  const source = readFileSync(path, 'utf8');
  const marker = '\n} satisfies Record<string, CollaborationData';
  if (source.split(marker).length !== 2) throw new Error('Could not find the end of the collaborations list.');
  writeFileSync(path, source.replace(marker, () => `\n${lines.join('\n')}${marker}`));
} else if (lines.length) {
  console.log(lines.join('\n'));
}
