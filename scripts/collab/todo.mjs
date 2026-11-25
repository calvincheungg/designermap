/**
 * Lists brands by number of collaborations, marking those without a full search.
 *   node scripts/collab/todo.mjs [--from 1] [--to 250] [--all]
 *
 * Ties are in name order. Without --all, only unsearched brands are shown.
 */
import { runnerImport } from 'vite';
import { dataPath, loadData, option } from './data.mjs';

const { houses, collaborations } = await loadData();
const { module } = await runnerImport(dataPath('research-log.ts'), { configFile: false, logLevel: 'error' });
const counts = new Map();
for (const { houses: ids } of Object.values(collaborations)) for (const id of new Set(ids)) counts.set(id, (counts.get(id) ?? 0) + 1);
const ranked = Object.entries(houses)
  .map(([id, { name }]) => ({ id, name, count: counts.get(id) ?? 0 }))
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
const from = Number(option('from', 1));
const to = Number(option('to', 250));
for (const [i, { id, name, count }] of ranked.entries()) {
  if (i + 1 < from || i + 1 > to) continue;
  const search = module.collabSearches[id];
  if (search?.complete && !process.argv.includes('--all')) continue;
  console.log(`${i + 1}. ${name} (${id}) ${count} ${search ? (search.complete ? 'searched' : 'unfinished') : 'not searched'}`);
}
