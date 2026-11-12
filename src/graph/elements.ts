import type { ElementDefinition } from 'cytoscape';
import { allMoves, designers, formatTenureYears, getDesigner, houses } from '../data';
import { houseIcon } from './icons';

/**
 * network → designers are nodes, linked to every house they worked at.
 * moves   → houses only; an arrow per move, from old house to new house.
 */
export type ViewMode = 'network' | 'moves';

export const nodeId = {
  house: (id: string) => `h:${id}`,
  designer: (id: string) => `d:${id}`,
  city: (city: string) => `c:${city}`,
};

export function buildElements(mode: ViewMode): ElementDefinition[] {
  const els: ElementDefinition[] = [];

  // Cities are compound "group box" nodes that contain their houses.
  for (const city of new Set(houses.map((h) => h.city))) {
    els.push({ group: 'nodes', data: { id: nodeId.city(city), kind: 'city', label: city } });
  }

  for (const h of houses) {
    els.push({
      group: 'nodes',
      data: {
        id: nodeId.house(h.id),
        refId: h.id,
        kind: 'house',
        label: h.name,
        parent: nodeId.city(h.city),
        image: houseIcon(h),
        start: h.founded ?? -Infinity,
      },
    });
  }

  if (mode === 'network') {
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
  } else {
    allMoves().forEach((m, i) => {
      const name = getDesigner(m.designerId)?.name ?? m.designerId;
      els.push({
        group: 'edges',
        data: {
          id: `m:${i}`,
          kind: 'move',
          source: nodeId.house(m.from.house),
          target: nodeId.house(m.to.house),
          label: `${name} '${String(m.year).slice(-2)}`,
          designerId: m.designerId,
          start: m.year,
        },
      });
    });
  }

  return els;
}
