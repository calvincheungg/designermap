import { describe, expect, it } from 'vitest';
import { buildClusterLevels, clusterLevel, type ClusterCity } from './clusters';
import { countryCenter, housesByMapLocation, project } from './geo';
import { cityRegions, type CityName } from '../data/cities';
import { CountryCode } from '../data/countries';
import { areaLabel, clusterLabel, isMajorCity, mapCountryForHouse, mapLocationCoordinates, TOP_CITY_COUNT, topCities } from './locations';

const city = (name: string, x: number, count = 1): ClusterCity => ({
  city: name, tip: { x, y: 0 }, count, major: isMajorCity(count), country: 'FR',
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

describe('zoom-dependent country and region clusters', () => {
  it('protects cities by brand count alone', () => {
    expect([4, 5, 6].map(isMajorCity)).toEqual([false, true, true]);
    const levels = buildClusterLevels([city('Small city', 0, 5), city('Paris', 1), city('Village', 2)]);
    expect(levels[0]!.flatMap(cluster => cluster.members).sort()).toEqual(['Paris', 'Village']);
  });

  it('groups by state in the US and by country elsewhere, then proximity, only splitting as it zooms in', () => {
    const us = (name: string, x: number, region: string) => ({ ...city(name, x), country: 'US', region });
    const cities = [us('A', 0, 'Maine'), us('B', 5, 'Maine'), us('C', 10, 'Ohio'), us('D', 900, 'Ohio'),
      ...[0, 5, 10, 15, 200].map((x, i) => city(`F${i}`, x)), { ...city('Lone', 3), country: 'BE' }];
    const original = structuredClone(cities);
    const levels = buildClusterLevels(cities);
    const ids = (level: number) => levels[level]!.map(cluster => cluster.id).sort();
    expect(ids(0)).toEqual(['c:Lone', 'cluster:FR', 'cluster:US/Maine', 'cluster:US/Ohio']);
    expect(ids(1)).toEqual(['c:A', 'c:B', 'c:C', 'c:D', 'c:F4', 'c:Lone', 'cluster:F0|F1|F2|F3']);
    expect(levels[3]!.every(cluster => cluster.members.length === 1)).toBe(true);
    for (let level = 1; level < levels.length; level++) for (const cluster of levels[level]!) {
      expect(levels[level - 1]!.some(parent => cluster.members.every(member => parent.members.includes(member)))).toBe(true);
    }
    expect(cities).toEqual(original);
  });

  it('places area pins on a member city and keeps Beirut and Tel Aviv separate', () => {
    const levels = buildClusterLevels([city('A', 0), city('B', 90), city('C', 1000)]);
    expect(levels[0]![0]!.tip).toEqual({ x: 90, y: 0 });
    const pair = [{ ...city('Beirut', 0), country: 'LB' }, { ...city('Tel Aviv', 1), country: 'IL' }];
    expect(buildClusterLevels(pair).every(level => level.length === 2)).toBe(true);
  });

  it('places country pins in the middle of the country, leaving state pins on a city', () => {
    const at = { x: 50, y: 20 };
    expect(buildClusterLevels([city('A', 0), city('B', 90)], () => at)[0]![0]!.tip).toEqual(at);
    const states = ['A', 'B'].map((name, x) => ({ ...city(name, x), country: 'US', region: 'Maine' }));
    expect(buildClusterLevels(states, () => at)[0]![0]!.tip).not.toEqual(at);
  });

  it('finds the middle of real countries, ignoring overseas land', () => {
    const near = (code: CountryCode, lat: number, lng: number, within = 40) => {
      const center = countryCenter(code)!, expected = project([lat, lng]);
      expect(Math.hypot(center.x - expected.x, center.y - expected.y), code).toBeLessThan(within);
    };
    near(CountryCode.Australia, -25.5, 134.5);
    near(CountryCode.France, 46.6, 2.5);
    near(CountryCode.UnitedKingdom, 53.5, -2);
    near(CountryCode.Norway, 64.2, 13.6);
    near(CountryCode.Vietnam, 16.5, 107);
    expect(countryCenter(CountryCode.HongKong)).toBeUndefined();
    const missing = Object.values(CountryCode).filter(code => !countryCenter(code));
    expect(missing.sort()).toEqual([CountryCode.HongKong, CountryCode.Singapore].sort());
  });

  it('bounds proximity clusters instead of joining long chains of nearby cities', () => {
    const cities = Array.from({ length: 20 }, (_, i) => city(String(i), i * 10));
    for (const cluster of buildClusterLevels(cities)[1]!) {
      const xs = cluster.members.map(name => cities.find(city => city.city === name)!.tip.x);
      expect(Math.max(...xs) - Math.min(...xs)).toBeLessThanOrEqual(64);
    }
  });

  it('uses discrete levels and guarantees individual city pins at close zoom', () => {
    expect([0.3, 0.599, 0.6, 1.2, 2.4, 4.8, 8].map(clusterLevel)).toEqual([0, 0, 0, 1, 2, 3, 3]);
    expect(buildClusterLevels([]).every(level => level.length === 0)).toBe(true);
  });

  it('covers each non-major city exactly once at every level and reduces the real overview pin count', () => {
    const cities = [...housesByMapLocation()].map(([name, houses]) => ({
      ...city(name, 0, houses.filter(house => !house.parentHouse).length),
      country: mapCountryForHouse(houses[0]!.id), region: cityRegions[name as CityName]?.region,
    }));
    cities.forEach(city => { city.tip = project(mapLocationCoordinates(city.city)); });
    const expected = cities.filter(city => !city.major).map(city => city.city).sort();
    const levels = buildClusterLevels(cities);
    for (const level of levels) expect(level.flatMap(cluster => cluster.members).sort()).toEqual(expected);
    expect(levels[0]!.length).toBeLessThan(expected.length / 2);
  });

  it('labels geographic clusters without renaming their underlying cities', () => {
    expect(areaLabel({ country: CountryCode.Italy })).toBe('Italy');
    expect(areaLabel({ country: CountryCode.Norway })).toBe('Norway');
    expect(areaLabel({ country: CountryCode.UnitedStates, region: 'Maine' })).toBe('Maine');
    expect(clusterLabel(['Gardena', 'Irvine'], 'Gardena')).toBe('Southern California');
    expect(clusterLabel(['Denver', 'Broomfield'], 'Denver')).toBe('Colorado');
    expect(clusterLabel(['A', 'B'], 'A')).toBe('A area');
  });
});
