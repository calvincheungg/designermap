import type { Point } from './geo';

export interface ClusterCity {
  city: string;
  tip: Point;
  count: number;
  major: boolean;
  /** Country the city's brands are in; unknown countries cluster together. */
  country: string;
  /** State or province, where the country is subdivided (US and Canada). */
  region?: string;
}

export interface PinCluster {
  id: string;
  members: readonly string[];
  tip: Point;
  /** Fewest visible member cities needed to show the cluster instead of city pins. */
  minCities: number;
  /** Set on country and state/province clusters; absent on proximity ones. */
  area?: { country: string; region?: string };
}

/** Widest level: one pin per country (per state/province where subdivided), then proximity, then every city. */
export const CLUSTER_ZOOMS = [1.2, 2.4, 4.8] as const;
/** Minimum distinct city pins in a country or state cluster, independent of brand count. */
export const MIN_AREA_CITIES = 2;
/** Minimum distinct city pins in a proximity cluster. */
export const MIN_CLUSTER_CITIES = 4;
/** Proximity span at levels 1 and 2. */
const DIAMETERS = [64, 32] as const;
export const clusterLevel = (zoom: number): number => {
  const level = CLUSTER_ZOOMS.findIndex(limit => zoom < limit);
  return level < 0 ? CLUSTER_ZOOMS.length : level;
};

interface Group extends PinCluster {
  weight: number;
  x1: number; x2: number; y1: number; y2: number;
}

/** Merge nearest neighbours with a bounded span, avoiding long chains of nearby cities. */
function mergeNearby(start: readonly Group[], diameter: number): Group[] {
  const groups = [...start];
  while (true) {
    let pair: [number, number] | undefined;
    let nearest = Infinity;
    for (let i = 0; i < groups.length; i++) {
      const a = groups[i]!;
      for (let j = i + 1; j < groups.length; j++) {
        const b = groups[j]!;
        const span = Math.hypot(Math.max(a.x2, b.x2) - Math.min(a.x1, b.x1),
          Math.max(a.y2, b.y2) - Math.min(a.y1, b.y1));
        if (span > diameter) continue;
        const distance = Math.hypot(a.tip.x - b.tip.x, a.tip.y - b.tip.y);
        if (distance < nearest) { nearest = distance; pair = [i, j]; }
      }
    }
    if (!pair) return groups;
    const [i, j] = pair;
    const a = groups[i]!, b = groups[j]!;
    const members = [...a.members, ...b.members].sort();
    const weight = a.weight + b.weight;
    groups[i] = {
      id: `cluster:${members.join('|')}`, members, weight, minCities: MIN_CLUSTER_CITIES,
      tip: { x: (a.tip.x * a.weight + b.tip.x * b.weight) / weight,
        y: (a.tip.y * a.weight + b.tip.y * b.weight) / weight },
      x1: Math.min(a.x1, b.x1), x2: Math.max(a.x2, b.x2),
      y1: Math.min(a.y1, b.y1), y2: Math.max(a.y2, b.y2),
    };
    groups.splice(j, 1);
  }
}

/** A country or state cluster, pinned on `center` or else its most central city, so it never lands at sea. */
function areaCluster(cities: readonly Group[], area: { country: string; region?: string }, center?: Point): PinCluster {
  const weight = cities.reduce((total, city) => total + city.weight, 0);
  const x = cities.reduce((total, city) => total + city.tip.x * city.weight, 0) / weight;
  const y = cities.reduce((total, city) => total + city.tip.y * city.weight, 0) / weight;
  const distance = (city: Group) => Math.hypot(city.tip.x - x, city.tip.y - y);
  const central = cities.reduce((best, city) => distance(city) < distance(best) ? city : best);
  return {
    id: `cluster:${area.country}${area.region ? `/${area.region}` : ''}`,
    members: cities.map(city => city.members[0]!), tip: { ...(center ?? central.tip) }, minCities: MIN_AREA_CITIES, area,
  };
}

/**
 * Build once, using the full dataset. Borders decide which cities may share a
 * pin; distance decides how a state or country splits as the map zooms in.
 * Each level only splits the one before. Major cities never enter the hierarchy.
 * `countryCenter` places whole-country pins; state pins stay on a member city.
 */
export function buildClusterLevels(
  cities: readonly ClusterCity[],
  countryCenter: (country: string) => Point | undefined = () => undefined,
): readonly (readonly PinCluster[])[] {
  const minor = cities.filter(city => !city.major).sort((a, b) => a.city.localeCompare(b.city));
  const leaves = new Map(minor.map(({ city, tip, count }): [string, Group] => [city, {
    id: `c:${city}`, members: [city], tip: { ...tip }, weight: Math.max(1, count), minCities: 1,
    x1: tip.x, x2: tip.x, y1: tip.y, y2: tip.y,
  }]));
  const leavesOf = (members: readonly ClusterCity[]) => members.map(({ city }) => leaves.get(city)!);
  // Groups below their minimum stay in the merge tree but display as city pins.
  const display = (group: PinCluster): PinCluster[] =>
    group.members.length >= group.minCities ? [group] : group.members.map(city => leaves.get(city)!);

  const levels: PinCluster[][] = CLUSTER_ZOOMS.map(() => []);
  for (const [country, inCountry] of Map.groupBy(minor, city => city.country)) {
    for (const [region, inRegion] of Map.groupBy(inCountry, city => city.region)) {
      const members = leavesOf(inRegion);
      levels[0]!.push(...display(region
        ? areaCluster(members, { country, region })
        : areaCluster(members, { country }, countryCenter(country))));
      const tight = mergeNearby(members, DIAMETERS[1]);
      levels[1]!.push(...mergeNearby(tight, DIAMETERS[0]).flatMap(display));
      levels[2]!.push(...tight.flatMap(display));
    }
  }
  return [...levels, [...leaves.values()]];
}
