/** Loads the dataset's TypeScript modules for the scripts in this folder. */
import { fileURLToPath } from 'node:url';
import { runnerImport } from 'vite';

export const dataPath = (file) => fileURLToPath(new URL(`../../src/data/${file}`, import.meta.url));

export async function loadData() {
  const options = { configFile: false, logLevel: 'error' };
  const { module: h } = await runnerImport(dataPath('houses.ts'), options);
  const { module: c } = await runnerImport(dataPath('collaborations.ts'), options);
  return { houses: h.houses, collaborations: c.collaborations };
}

/** Same spirit as Find: ignores case, accents, punctuation and spaces. */
export const normalize = (text) =>
  text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}]/gu, '');

/** A house's top-level parent: BEAMS for BEAMS PLUS, UNITED ARROWS for monkey time. */
export function rootOf(houses, id) {
  const seen = new Set();
  while (houses[id]?.parentHouse && !seen.has(id)) {
    seen.add(id);
    id = houses[id].parentHouse;
  }
  return id;
}

/** Years already recorded between a house's family and each other family, by family root. */
export function recordedYears(houses, collaborations, id) {
  const family = rootOf(houses, id);
  const years = new Map();
  for (const { houses: ids, year } of Object.values(collaborations)) {
    const roots = new Set(ids.map((house) => rootOf(houses, house)));
    if (!roots.delete(family)) continue;
    for (const root of roots) years.set(root, (years.get(root) ?? new Set()).add(year));
  }
  return years;
}

/** `--name value` from the command line. */
export function option(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index < 0 ? fallback : process.argv[index + 1];
}
