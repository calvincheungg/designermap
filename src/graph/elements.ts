import type { ElementDefinition } from 'cytoscape';
import { allMoves, designers, formatTenureYears, getDesigner, getHouse, houses } from '../data';
import type { House } from '../types';
import { housesByCity, layoutMap } from './geo';
import { cityMarkerIcon, houseIcon } from './icons';

/**
 * map     → world map: a numbered marker per city; expand a city to see its
 *           houses; arrows show moves between whatever is showing.
 * network → free-form graph: designers are nodes linked to every house they worked at.
 */
export type ViewMode = 'map' | 'network';

export const nodeId = {
  house: (id: string) => `h:${id}`,
  designer: (id: string) => `d:${id}`,
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
      label: h.name,
      ...(parent && { parent }),
      image: houseIcon(h),
      start: h.founded ?? -Infinity,
    },
  };
}

/* ---------- Map view ---------- */

/**
 * Static map elements: a pin per city, an invisible group per city for its
 * houses (with a dotted leader back to the pin), and every house. Collapsed
 * cities' houses get hidden by DesignerGraph, which also applies positions.
 */
export function mapElements(): ElementDefinition[] {
  const els: ElementDefinition[] = [];
  const { cities } = layoutMap(new Set());

  for (const c of cities) {
    els.push({
      group: 'nodes',
      data: {
        id: nodeId.city(c.city),
        kind: 'marker',
        city: c.city,
        label: c.city,
        count: c.houses.length,
        image: cityMarkerIcon(c.houses.length, false),
        tip: c.tip,
      },
      position: c.tip,
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
      data: { id: `gl:${c.city}`, kind: 'leader', source: nodeId.city(c.city), target: nodeId.grid(c.city) },
      selectable: false,
    });
  }
  for (const h of houses) els.push(houseNode(h, nodeId.grid(h.city)));
  return els;
}

/**
 * Move arrows for the current expansion state: each end attaches to the house
 * if its city is expanded, otherwise to the city marker. Moves inside one
 * collapsed city would be a loop on the marker, so they're left out.
 */
export function moveEdges(expanded: ReadonlySet<string>): ElementDefinition[] {
  const end = (houseId: string) => {
    const city = getHouse(houseId)!.city;
    return expanded.has(city) ? nodeId.house(houseId) : nodeId.city(city);
  };
  return allMoves().flatMap((m, i) => {
    const source = end(m.from.house);
    const target = end(m.to.house);
    if (source === target) return [];
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

/* ---------- Network view ---------- */

export function networkElements(): ElementDefinition[] {
  const els: ElementDefinition[] = [];

  for (const city of housesByCity().keys()) {
    els.push({ group: 'nodes', data: { id: nodeId.city(city), kind: 'city', label: city } });
  }
  for (const h of houses) els.push(houseNode(h, nodeId.city(h.city)));

  for (const d of designers) {
    els.push({
      group: 'nodes',
      data: {
        id: nodeId.designer(d.id),
        refId: d.id,
        kind: 'designer',
        label: d.name,
        start: Math.min(...d.career.map((t) => t.start)),
      },
    });
    d.career.forEach((t, i) => {
      els.push({
        group: 'edges',
        data: {
          id: `t:${d.id}:${i}`,
          kind: 'tenure',
          source: nodeId.designer(d.id),
          target: nodeId.house(t.house),
          label: formatTenureYears(t),
          designerId: d.id,
          start: t.start,
          current: t.end === null,
        },
      });
    });
  }

  return els;
}
