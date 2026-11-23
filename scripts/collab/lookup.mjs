/**
 * Finds house ids for partner names, checking ids, names and aliases.
 *   node scripts/collab/lookup.mjs "Clarks, Wild Things, HOBO"
 */
import { loadData, normalize } from './data.mjs';

const names = (process.argv[2] ?? '').split(',').map((name) => name.trim()).filter(Boolean);
if (!names.length) {
  console.error('Usage: node scripts/collab/lookup.mjs "Brand A, Brand B"');
  process.exit(1);
}
const { houses } = await loadData();
for (const name of names) {
  const query = normalize(name);
  const exact = [];
  const partial = [];
  for (const [id, house] of Object.entries(houses)) {
    const keys = [id, house.name, ...(house.aliases ?? [])].map(normalize);
    if (keys.includes(query)) exact.push(id);
    else if (query.length >= 3 && keys.some((key) => key.startsWith(query))) partial.push(id);
  }
  const matches = exact.length ? exact.join(' ') : partial.length ? `? ${partial.slice(0, 6).join(' ')}` : '—';
  console.log(`${name}: ${matches}`);
}
