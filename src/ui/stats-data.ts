import { designers, getHouse, isBusinessLeadership } from '../data';
import { collabSearches, type CollabSearch } from '../data/research-log';
import type { Collaboration, House, Tenure } from '../types';
import { dimensionValues, type Dimension } from './collab-diversity';

type Release = Pick<Collaboration, 'houses' | 'year'>;

/** Each brand pair with the years of its shared releases (one entry per release). */
export function pairYears(releases: readonly Release[]) {
  const pairs = new Map<string, number[]>();
  for (const project of releases) {
    const ids = [...new Set(project.houses)].sort();
    ids.forEach((a, i) => ids.slice(i + 1).forEach((b) => {
      const key = `${a}|${b}`;
      const years = pairs.get(key);
      if (years) years.push(project.year); else pairs.set(key, [project.year]);
    }));
  }
  return pairs;
}
export const splitPair = (key: string) => key.split('|') as [string, string];

// ---- Degrees of separation ----

export type Network = Map<string, Map<string, readonly number[]>>;

/** Brand → partner → the years of their releases. */
export function collaborationNetwork(pairs: ReadonlyMap<string, readonly number[]>): Network {
  const network: Network = new Map();
  const link = (from: string, to: string, years: readonly number[]) => {
    const partners = network.get(from);
    if (partners) partners.set(to, years); else network.set(from, new Map([[to, years]]));
  };
  for (const [key, years] of pairs) {
    const [a, b] = splitPair(key);
    link(a, b, years);
    link(b, a, years);
  }
  return network;
}

/** Steps from a brand to every brand it can reach, itself included at 0. */
export function stepsFrom(network: Network, start: string) {
  const steps = new Map<string, number>();
  if (!network.has(start)) return steps;
  steps.set(start, 0);
  // A Map iterates entries added during the loop, so this walks breadth first.
  for (const [id, step] of steps) for (const partner of network.get(id)!.keys()) if (!steps.has(partner)) steps.set(partner, step + 1);
  return steps;
}

/** The shortest chain between two brands; among equally short ones, the one with the most releases along it. */
export function shortestChain(network: Network, from: string, to: string): string[] | undefined {
  const steps = stepsFrom(network, from);
  if (!steps.has(to)) return undefined;
  const best = new Map<string, { total: number; previous?: string }>([[from, { total: 0 }]]);
  for (const [id, step] of steps) {
    if (step >= steps.get(to)!) break;
    for (const [partner, years] of network.get(id)!) {
      if (steps.get(partner) !== step + 1) continue;
      const total = best.get(id)!.total + years.length;
      if (total > (best.get(partner)?.total ?? -1)) best.set(partner, { total, previous: id });
    }
  }
  const chain: string[] = [];
  for (let id: string | undefined = to; id !== undefined; id = best.get(id)!.previous) chain.unshift(id);
  return chain;
}

// ---- Rising and cooling ----

const searches = Object.entries(collabSearches) as [string, CollabSearch][];

/** The last full year both the calendar and most collaboration searches cover, up to the year filter. */
export function lastSearchedYear(year: number, thisYear = new Date().getFullYear()) {
  const years = searches.map(([, entry]) => Number(entry.date.slice(0, 4))).sort((a, b) => a - b);
  return Math.min(year, thisYear - 1, (years[Math.floor(years.length / 2)] ?? thisYear) - 1);
}

export interface TrendRow { id: string; before: number; now: number; change: number }

/** Releases in the `span` years up to `end` against the `span` years before, for brands fully searched since `end`. */
export function trendRows(releases: readonly Release[], end: number, span: number): TrendRow[] {
  const searched = new Set(searches.filter(([, entry]) => entry.complete && Number(entry.date.slice(0, 4)) > end).map(([id]) => id));
  const rows = new Map<string, TrendRow>();
  for (const project of releases) {
    if (project.year > end || project.year <= end - 2 * span) continue;
    for (const id of project.houses) {
      if (!searched.has(id)) continue;
      const row = rows.get(id) ?? { id, before: 0, now: 0, change: 0 };
      if (project.year > end - span) row.now++; else row.before++;
      row.change = row.now - row.before;
      rows.set(id, row);
    }
  }
  return [...rows.values()];
}

// ---- Who collaborates with whom ----

/** Countries listed on their own in the heatmap; the rest share `OTHER_VALUES`. */
export const HEATMAP_COUNTRIES = 10;
export const OTHER_VALUES = 'Other';

export interface Heatmap {
  values: readonly string[];
  /** Pairs per `row|column` cell, both ways round. */
  cells: ReadonlyMap<string, readonly string[]>;
}
export const cellKey = (row: string, column: string) => `${row}|${column}`;

/** Brand pairs by the two brands' values. A pair counts once in each combination its brands' categories make. */
export function heatmap(pairs: Iterable<string>, dimension: Dimension, order?: readonly string[]): Heatmap {
  const list = [...pairs].map((key) => {
    const [a, b] = splitPair(key);
    return { key, a: dimensionValues(a, dimension), b: dimensionValues(b, dimension) };
  });
  const counts = new Map<string, number>();
  for (const { a, b } of list) for (const value of [...a, ...b]) counts.set(value, (counts.get(value) ?? 0) + 1);
  const ranked = [...counts].sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0])).map(([value]) => value);
  const kept = order ? order.filter((value) => counts.has(value)) : dimension === 'country' ? ranked.slice(0, HEATMAP_COUNTRIES) : ranked;
  const known = new Set(kept);
  const named = (values: readonly string[]) => [...new Set(values.map((value) => known.has(value) ? value : OTHER_VALUES))];
  const cells = new Map<string, string[]>();
  for (const { key, a, b } of list) {
    const combos = new Set<string>();
    for (const x of named(a)) for (const y of named(b)) { combos.add(cellKey(x, y)); combos.add(cellKey(y, x)); }
    for (const combo of combos) {
      const cell = cells.get(combo);
      if (cell) cell.push(key); else cells.set(combo, [key]);
    }
  }
  return { values: known.size < counts.size ? [...kept, OTHER_VALUES] : kept, cells };
}

// ---- Talent incubators ----

const rootHouse = (id: string) => {
  let house = getHouse(id);
  for (const seen = new Set<string>(); house?.parentHouse && !seen.has(house.id);) {
    seen.add(house.id);
    const parent = getHouse(house.parentHouse);
    if (!parent) break;
    house = parent;
  }
  return house?.id ?? id;
};

export interface Alumnus { designer: string; led: readonly { house: string; start: number }[] }

/**
 * Houses whose design-team members (`Other` roles) first led or founded a
 * different house after joining. Labels of the same family don't count, nor do
 * people who already led a house when they joined.
 */
export function incubators(houses: ReadonlySet<string>, year: number): Map<string, Alumnus[]> {
  const found = new Map<string, Alumnus[]>();
  for (const designer of designers) {
    const career: readonly Tenure[] = designer.career;
    const leads = career.flatMap((tenure) => tenure.role !== 'Other' && !isBusinessLeadership(tenure) && tenure.start !== undefined
      ? [{ house: tenure.house, start: tenure.start }] : []);
    // First time on each house's team.
    const joined = new Map<string, number>();
    for (const tenure of career) {
      if (tenure.role !== 'Other' || tenure.start === undefined || !houses.has(tenure.house)) continue;
      joined.set(tenure.house, Math.min(tenure.start, joined.get(tenure.house) ?? Infinity));
    }
    for (const [house, start] of joined) {
      if (leads.some((lead) => lead.start < start)) continue;
      const led = new Map<string, number>();
      for (const lead of leads) {
        if (lead.start <= start || lead.start > year || rootHouse(lead.house) === rootHouse(house)) continue;
        led.set(lead.house, Math.min(lead.start, led.get(lead.house) ?? Infinity));
      }
      if (!led.size) continue;
      const list = found.get(house) ?? [];
      list.push({ designer: designer.id, led: [...led].map(([id, first]) => ({ house: id, start: first })).sort((a, b) => a.start - b.start) });
      found.set(house, list);
    }
  }
  return found;
}

// ---- Brands by decade, and where they move ----

/** Brands founded earlier than this share one row. */
export const FIRST_DECADE = 1900;

/** Brands by founding decade, oldest first, empty decades included; those before FIRST_DECADE under `undefined`. */
export function foundingDecades(houses: readonly House[]): { decade: number | undefined; houses: House[] }[] {
  const known = houses.filter((house): house is House & { founded: number } => house.founded !== undefined);
  const early = known.filter((house) => house.founded < FIRST_DECADE);
  const decadeOf = (house: { founded: number }) => Math.floor(house.founded / 10) * 10;
  const later = Map.groupBy(known.filter((house) => house.founded >= FIRST_DECADE), decadeOf);
  const rows: { decade: number | undefined; houses: House[] }[] = early.length ? [{ decade: undefined, houses: early }] : [];
  if (later.size) for (let decade = Math.min(...later.keys()); decade <= Math.max(...later.keys()); decade += 10) rows.push({ decade, houses: later.get(decade) ?? [] });
  return rows;
}

export interface Relocations { gained: House[]; lost: House[] }

/** Brands that left their founding city (or country) for their current base, by place. */
export function relocations(houses: readonly House[], by: 'city' | 'country', year: number) {
  const places = new Map<string, Relocations>();
  const at = (place: string) => {
    const entry = places.get(place) ?? { gained: [], lost: [] };
    places.set(place, entry);
    return entry;
  };
  for (const house of houses) {
    if (!house.origin || house.origin[by] === house[by]) continue;
    // Not yet at its current base in the filter's year.
    if (house.history?.some((event) => event.type === 'moved' && event.year !== undefined && event.year > year)) continue;
    at(house.origin[by]).lost.push(house);
    at(house[by]).gained.push(house);
  }
  return places;
}
