import type { Point } from './geo';

export interface ClusterCity {
  city: string;
  tip: Point;
  count: number;
  major: boolean;
}

export interface PinCluster {
  id: string;
  members: readonly string[];
  tip: Point;
}

// Each level approximately halves the geographic span; the finest shows every city.
export const CLUSTER_ZOOMS = [0.6, 1.2, 2.4, 4.8] as const;
/** Minimum distinct eligible city pins, independent of their combined brand count. */
export const MIN_CLUSTER_CITIES = 4;
const DIAMETERS = [256, 128, 64, 32, 0];
export const clusterLevel = (zoom: number): number => {
  const level = CLUSTER_ZOOMS.findIndex(limit => zoom < limit);
  return level < 0 ? CLUSTER_ZOOMS.length : level;
};

interface Group extends PinCluster {
  weight: number;
  x1: number; x2: number; y1: number; y2: number;
}

/**
 * Build once, using the full dataset. Merge nearest neighbours with a bounded
 * geographic diameter, avoiding chains that swallow an entire continent.
 * Coarser levels merge whole finer clusters, so zooming only splits groups.
 * Major cities never enter the hierarchy.
 */
export function buildClusterLevels(cities: readonly ClusterCity[]): readonly (readonly PinCluster[])[] {
  const leaves = cities.filter(city => !city.major).sort((a, b) => a.city.localeCompare(b.city))
    .map(({ city, tip, count }): Group => ({
      id: `c:${city}`, members: [city], tip: { ...tip }, weight: Math.max(1, count),
      x1: tip.x, x2: tip.x, y1: tip.y, y2: tip.y,
    }));
  const levels: Group[][] = Array.from({ length: DIAMETERS.length }, () => []);
  levels[DIAMETERS.length - 1] = leaves;
  for (let level = DIAMETERS.length - 2; level >= 0; level--) {
    const diameter = DIAMETERS[level]!;
    const groups = [...levels[level + 1]!];
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
      if (!pair) break;
      const [i, j] = pair;
      const a = groups[i]!, b = groups[j]!;
      const members = [...a.members, ...b.members].sort();
      const weight = a.weight + b.weight;
      groups[i] = {
        id: `cluster:${members.join('|')}`, members, weight,
        tip: { x: (a.tip.x * a.weight + b.tip.x * b.weight) / weight,
          y: (a.tip.y * a.weight + b.tip.y * b.weight) / weight },
        x1: Math.min(a.x1, b.x1), x2: Math.max(a.x2, b.x2),
        y1: Math.min(a.y1, b.y1), y2: Math.max(a.y2, b.y2),
      };
      groups.splice(j, 1);
    }
    levels[level] = groups;
  }
  // Keep smaller groups in the internal merge tree so they can join a larger
  // region, but display them as independent city pins at each zoom level.
  const byCity = new Map(leaves.map(leaf => [leaf.members[0]!, leaf]));
  return levels.map(level => level.flatMap(group => group.members.length >= MIN_CLUSTER_CITIES
    ? [group] : group.members.map(city => byCity.get(city)!)));
}
