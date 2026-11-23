import { describe, expect, it } from 'vitest';
import { collaborations, getHouse, houses, marketPositionings } from '../data';
import { collabSearches } from '../data/research-log';
import { cellKey, collaborationNetwork, foundingDecades, heatmap, HEATMAP_COUNTRIES, incubators, lastSearchedYear, OTHER_VALUES, pairYears, relocations, shortestChain, stepsFrom, trendRows } from './stats-data';

describe('pairs and chains', () => {
  const pairs = pairYears([
    { houses: ['a', 'b'], year: 2000 }, { houses: ['b', 'a'], year: 2005 }, { houses: ['b', 'd'], year: 2001 },
    { houses: ['a', 'c'], year: 2001 }, { houses: ['c', 'd'], year: 2002 }, { houses: ['x', 'y'], year: 2003 },
  ]);
  const network = collaborationNetwork(pairs);
  it('groups a pair whichever way round it is recorded', () => {
    expect(pairs.get('a|b')).toEqual([2000, 2005]);
  });
  it('finds the shortest chain, preferring more releases', () => {
    expect(shortestChain(network, 'a', 'd')).toEqual(['a', 'b', 'd']);
    expect(shortestChain(network, 'a', 'b')).toEqual(['a', 'b']);
    expect(shortestChain(network, 'a', 'x')).toBeUndefined();
    expect(shortestChain(network, 'missing', 'a')).toBeUndefined();
    expect([...stepsFrom(network, 'a')]).toEqual([['a', 0], ['b', 1], ['c', 1], ['d', 2]]);
  });
  it('links each step of a real chain by a recorded release', () => {
    const real = collaborationNetwork(pairYears(collaborations));
    const steps = stepsFrom(real, 'nike');
    const [far, distance] = [...steps].at(-1)!;
    const chain = shortestChain(real, 'nike', far)!;
    expect(chain).toHaveLength(distance + 1);
    chain.slice(1).forEach((id, i) => expect(real.get(chain[i]!)!.has(id)).toBe(true));
  });
});

describe('trends', () => {
  it('compares full searched periods and skips brands never fully searched', () => {
    const end = lastSearchedYear(Infinity);
    expect(end).toBeLessThan(new Date().getFullYear());
    expect(lastSearchedYear(1999)).toBe(1999);
    const rows = trendRows([{ houses: ['nike', 'unsearched'], year: 2020 }, { houses: ['nike', 'adidas'], year: 2018 }, { houses: ['nike', 'adidas'], year: 2016 }], 2020, 2);
    expect(rows).toEqual([{ id: 'nike', before: 1, now: 1, change: 0 }, { id: 'adidas', before: 1, now: 0, change: -1 }]);
    const complete = new Set(Object.entries(collabSearches).filter(([, entry]) => entry.complete).map(([id]) => id));
    expect(trendRows(collaborations, end, 4).every((row) => complete.has(row.id))).toBe(true);
  });
});

describe('heatmap', () => {
  it('is symmetric and counts each pair once per cell', () => {
    const pairs = pairYears(collaborations);
    for (const dimension of ['market', 'country', 'category'] as const) {
      const { values, cells } = heatmap(pairs.keys(), dimension, dimension === 'market' ? marketPositionings : undefined);
      for (const a of values) for (const b of values) {
        const list = cells.get(cellKey(a, b)) ?? [];
        expect(list.length).toBe((cells.get(cellKey(b, a)) ?? []).length);
        expect(new Set(list).size).toBe(list.length);
      }
      // Upper triangle holds every pair exactly once when brands have a single value.
      if (dimension !== 'category') {
        const total = values.flatMap((a, i) => values.slice(i).map((b) => (cells.get(cellKey(a, b)) ?? []).length)).reduce((x, y) => x + y, 0);
        expect(total).toBe(pairs.size);
      }
      if (dimension === 'country') expect(values).toHaveLength(HEATMAP_COUNTRIES + 1);
      if (dimension === 'country') expect(values.at(-1)).toBe(OTHER_VALUES);
    }
  });
});

it('incubators list later leadership elsewhere only', () => {
  const found = incubators(new Set(houses.map((house) => house.id)), Infinity);
  expect(found.size).toBeGreaterThan(10);
  for (const [id, alumni] of found) for (const { led } of alumni) for (const lead of led) {
    expect(lead.house).not.toBe(id);
    expect(getHouse(lead.house)?.parentHouse).not.toBe(id);
  }
});

it('decades cover every founded brand and fill gaps', () => {
  const rows = foundingDecades(houses);
  expect(rows.reduce((sum, row) => sum + row.houses.length, 0)).toBe(houses.filter((house) => house.founded !== undefined).length);
  const decades = rows.flatMap((row) => row.decade ?? []);
  decades.slice(1).forEach((decade, i) => expect(decade - decades[i]!).toBe(10));
});

it('relocations gain and lose the same brands', () => {
  for (const by of ['city', 'country'] as const) {
    const places = [...relocations(houses, by, Infinity).values()];
    const sum = (key: 'gained' | 'lost') => places.reduce((total, place) => total + place[key].length, 0);
    expect(sum('gained')).toBe(sum('lost'));
    expect(sum('gained')).toBe(houses.filter((house) => house.origin && house.origin[by] !== house[by]).length);
  }
});
