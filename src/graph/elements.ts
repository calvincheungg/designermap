import type { ElementDefinition } from 'cytoscape';
import { allMoves, collaborations, getDesigner, getHouse, houses } from '../data';
import type { House } from '../types';
import { layoutMap } from './geo';
import { isMajorCity, mapHousePath, mapLocationForHouse, topCities } from './locations';
import { cityMarkerIcon, houseIcon, initialsIcon } from './icons';

/**
 * World map: a numbered marker per city or region; expand a city to see its houses;
 * arrows show moves between whatever is showing.
 */

export const nodeId = {
  house: (id: string) => `h:${id}`,
  city: (city: string) => `c:${city}`,
  grid: (city: string) => `g:${city}`,
};

function houseNode(h: House, parent?: string): ElementDefinition {
  return {
    group: 'nodes',
    data: {
      id: nodeId.house(h.id),
      refId: h.id,
      kind: 'house',
      city: h.city,
      mapLocation: mapLocationForHouse(h.id),
      label: h.name,
      ...(parent && { parent }),
      image: houseIcon(h),
      // Used if the logo image fails to load (see DesignerGraph.checkLogos).
      fallbackImage: initialsIcon(h),
      hasLogo: !!h.logo,
      logoFit: h.logoFit ?? 'contain',
      start: h.founded ?? -Infinity,
    },
  };
}

/* ---------- Map view ---------- */

/**
 * Static map elements: a pin per map location, an invisible group per location for its
 * houses (with a dotted leader back to the pin), and every house. Collapsed
 * cities' houses get hidden by DesignerGraph, which also applies positions.
 */
export function mapElements(): ElementDefinition[] {
  const els: ElementDefinition[] = [];
  const { cities } = layoutMap(new Set());
  const mainCount = (c: (typeof cities)[number]) => c.houses.filter((h) => !h.parentHouse).length;
  const top = topCities(cities.map((c) => ({ city: c.city, count: mainCount(c) })));

  for (const c of cities) {
    const count = mainCount(c);
    els.push({
      group: 'nodes',
      data: {
        id: nodeId.city(c.city),
        kind: 'marker',
        city: c.city,
        label: c.city,
        count,
        major: isMajorCity(c.city, count),
        top: top.has(c.city),
        image: cityMarkerIcon(count, false, false, top.has(c.city)),
        tip: c.tip,
      },
      // A copy: Cytoscape keeps and mutates the position object, and `tip` must
      // stay on the city (sizeMarkers lifts the pin above it).
      position: { ...c.tip },
      selectable: false,
    });
    // Invisible group holding the city's houses when expanded, with a leader
    // back to the marker (shown only if the group had to move out of the way).
    els.push({
      group: 'nodes',
      data: { id: nodeId.grid(c.city), kind: 'grid', city: c.city },
      selectable: false,
    });
    els.push({
      group: 'edges',
      data: { id: `gl:${c.city}`, kind: 'leader', city: c.city, source: nodeId.city(c.city), target: nodeId.grid(c.city) },
      selectable: false,
    });
  }
  for (const h of houses) els.push(houseNode(h, nodeId.grid(mapLocationForHouse(h.id))));
  return els;
}

/**
 * Move arrows for the current expansion state: each end attaches to the house
 * if its city is expanded, otherwise to the city marker. Moves inside one
 * collapsed city would be a loop on the marker, so they're left out.
 *
 * Move lines only show for a selection, so pass `focus` to build just the
 * selected brand's direct lines or the selected designer's career; adding and
 * styling every move on each relayout is the expensive part.
 */
export function moveEdges(
  expanded: ReadonlySet<string>,
  visibleHouses?: ReadonlySet<string>,
  focus?: { kind: 'house' | 'designer'; id: string },
): ElementDefinition[] {
  const end = (houseId: string) => mapEndpoint(houseId, expanded, visibleHouses);
  const focusNode = focus?.kind === 'house' ? nodeId.house(focus.id) : undefined;
  return allMoves().flatMap((m, i) => {
    if (focus?.kind === 'designer' && m.designerId !== focus.id) return [];
    const source = end(m.from.house);
    const target = end(m.to.house);
    if (source === target) return [];
    if (focusNode && source !== focusNode && target !== focusNode) return [];
    const name = getDesigner(m.designerId)?.name ?? m.designerId;
    return [
      {
        group: 'edges' as const,
        data: {
          id: `m:${i}`,
          kind: 'move',
          source,
          target,
          label: `${m.concurrent ? '+ ' : ''}${name} '${String(m.year).slice(-2)}`,
          designerId: m.designerId,
          fromHouse: m.from.house,
          toHouse: m.to.house,
          start: m.year,
          concurrent: m.concurrent,
        },
      },
    ];
  });
}

/** Shared routing for careers and collaborations, including hidden nested labels. */
function mapEndpoint(houseId: string, expanded: ReadonlySet<string>, visibleHouses?: ReadonlySet<string>): string {
  const city = mapLocationForHouse(houseId);
  if (!expanded.has(city)) return nodeId.city(city);
  const visible = visibleHouses ? mapHousePath(houseId).findLast((id) => visibleHouses.has(id)) : houseId;
  return visible ? nodeId.house(visible) : nodeId.city(city);
}

/** One arrow per brand pair, aggregating releases through the selected year. */
export function collaborationEdges(expanded: ReadonlySet<string>, visibleHouses?: ReadonlySet<string>, selectedHouse?: string, year = Infinity): ElementDefinition[] {
  const partnerships = new Map<string, { fromHouse: string; toHouse: string; years: Set<number>; releaseYears: number[]; collaborationIds: string[] }>();
  for (const project of collaborations) {
    if (selectedHouse && !project.houses.includes(selectedHouse)) continue;
    const pairs = selectedHouse ? project.houses.filter((id) => id !== selectedHouse).map((id) => [selectedHouse, id] as const)
      : project.houses.flatMap((id, i) => project.houses.slice(i + 1).map((partner) => [id, partner] as const));
    for (const [fromHouse, toHouse] of pairs) {
      const key = [fromHouse, toHouse].sort().join(':');
      let partnership = partnerships.get(key);
      if (!partnership) {
        partnership = { fromHouse, toHouse, years: new Set(), releaseYears: [], collaborationIds: [] };
        partnerships.set(key, partnership);
      }
      partnership.years.add(project.year);
      partnership.releaseYears.push(project.year);
      partnership.collaborationIds.push(project.id);
    }
  }
  return [...partnerships].flatMap(([key, { fromHouse, toHouse, years, releaseYears, collaborationIds }]) => {
    const source = mapEndpoint(fromHouse, expanded, visibleHouses);
    const target = mapEndpoint(toHouse, expanded, visibleHouses);
    if (source === target) return [];
    const start = Math.min(...years);
    const visibleYears = [...years].filter((releaseYear) => releaseYear <= year);
    const date = visibleYears.length > 1 ? 'Multiple' : visibleYears[0] ?? start;
    const names = [fromHouse, toHouse].map((id) => getHouse(id)?.name ?? id).join(' × ');
    return [{ group: 'edges' as const, data: {
      id: `collab:${key}`,
      kind: 'collaboration', collaborationIds,
      // Releases between the pair up to the selected year, shown on the travelling pulse.
      count: releaseYears.filter((releaseYear) => releaseYear <= year).length,
      source, target, fromHouse, toHouse, start,
      label: `${names} (${date})`,
    } }];
  });
}
