import { describe, expect, it } from 'vitest';
import { buildClusterLevels, clusterLevel, type ClusterCity } from './clusters';
import { housesByMapLocation, project } from './geo';
import { clusterLabel, isMajorCity, mapLocationCoordinates, TOP_CITY_COUNT, topCities } from './locations';

const city = (name: string, x: number, count = 1): ClusterCity => ({
  city: name, tip: { x, y: 0 }, count, major: isMajorCity(name, count),
});

describe('top cities (red pins)', () => {
  it('picks the busiest map locations, ties broken by name', () => {
    const counts = Array.from({ length: 14 }, (_, i) => ({ city: `C${String(i).padStart(2, '0')}`, count: 20 - i }));
    counts.push({ city: 'A tie', count: 11 }, { city: 'Empty', count: 0 });
    const top = topCities(counts);
    expect(top.size).toBe(TOP_CITY_COUNT);
    expect(top.has('C00') && top.has('A tie') && top.has('C08')).toBe(true);
    expect(top.has('C09') || top.has('Empty')).toBe(false);
  });

  it('gives the real dataset ten top cities, Paris among them', () => {
    const counts = [...housesByMapLocation()].map(([city, hs]) => ({ city, count: hs.filter(h => !h.parentHouse).length }));
    const top = topCities(counts);
    expect(top.size).toBe(TOP_CITY_COUNT);
    expect(top.has('Paris')).toBe(true);
  });
});

describe('zoom-dependent regional clusters', () => {
  it('protects cities with exactly five main brands and explicit major cities with fewer brands', () => {
    expect(isMajorCity('Small city', 4)).toBe(false);
    expect(isMajorCity('Small city', 5)).toBe(true);
    expect(isMajorCity('Small city', 6)).toBe(true);
    expect(isMajorCity('Paris', 1)).toBe(true);
    const levels = buildClusterLevels([city('Small city', 0, 5), city('Paris', 1), city('Village A', 2), city('Village B', 3)]);
    expect(levels[0]!.flatMap(cluster => cluster.members).sort()).toEqual(['Village A', 'Village B']);
  });

  it('splits nested clusters progressively, keeping isolated cities and all geographic coordinates', () => {
    const cities = [city('A', 0), city('B', 20), city('C', 90), city('D', 110), city('E', 1000)];
    const original = structuredClone(cities);
    const levels = buildClusterLevels(cities);
    expect(levels[0]!.map(cluster => cluster.members)).toContainEqual(['A', 'B', 'C', 'D']);
    expect(levels[0]!.map(cluster => cluster.members)).toContainEqual(['E']);
    expect(levels[levels.length - 1]!.every(cluster => cluster.members.length === 1)).toBe(true);
    for (let level = 1; level < levels.length; level++) {
      for (const cluster of levels[level]!) {
        expect(levels[level - 1]!.some(parent => cluster.members.every(member => parent.members.includes(member)))).toBe(true);
      }
    }
    expect(cities).toEqual(original);
    expect(buildClusterLevels([...cities].reverse())).toEqual(levels);
  });

  it('requires four city pins, rather than four brands, and keeps Beirut and Tel Aviv separate', () => {
    const pair = ['Beirut', 'Tel Aviv'].map(name => ({ ...city(name, 0), tip: project(mapLocationCoordinates(name)) }));
    expect(buildClusterLevels(pair)[0]!.map(cluster => cluster.members)).toEqual([['Beirut'], ['Tel Aviv']]);
    const cities = [city('A', 0, 4), city('B', 5, 4), city('C', 10, 4)];
    expect(buildClusterLevels(cities).every(level => level.every(cluster => cluster.members.length === 1))).toBe(true);
    cities.push(city('D', 15));
    expect(buildClusterLevels(cities)[0]!.map(cluster => cluster.members)).toEqual([['A', 'B', 'C', 'D']]);
  });

  it('bounds cluster extents instead of joining long chains of nearby cities', () => {
    const cities = Array.from({ length: 20 }, (_, i) => city(String(i), i * 25));
    for (const cluster of buildClusterLevels(cities)[0]!) {
      const xs = cluster.members.map(name => cities.find(city => city.city === name)!.tip.x);
      expect(Math.max(...xs) - Math.min(...xs)).toBeLessThanOrEqual(256);
    }
  });

  it('uses discrete levels and guarantees individual city pins at close zoom', () => {
    expect([0.3, 0.599, 0.6, 1.2, 2.4, 4.8, 8].map(clusterLevel)).toEqual([0, 0, 1, 2, 3, 4, 4]);
    expect(buildClusterLevels([]).every(level => level.length === 0)).toBe(true);
  });

  it('covers each non-major city exactly once at every level and reduces the real overview pin count', () => {
    const cities = [...housesByMapLocation()].map(([name, houses]) => city(name, 0, houses.filter(house => !house.parentHouse).length));
    cities.forEach(city => { city.tip = project(mapLocationCoordinates(city.city)); });
    const expected = cities.filter(city => !city.major).map(city => city.city).sort();
    const levels = buildClusterLevels(cities);
    for (const level of levels) expect(level.flatMap(cluster => cluster.members).sort()).toEqual(expected);
    expect(levels[0]!.length).toBeLessThan(expected.length / 2);
  });

  it('labels geographic clusters without renaming their underlying cities', () => {
    expect(clusterLabel(['Gardena', 'Irvine'], 'Gardena')).toBe('Southern California');
    expect(clusterLabel(['Denver', 'Broomfield'], 'Denver')).toBe('Colorado');
    expect(clusterLabel(['A', 'B'], 'A')).toBe('A area');
  });
});
