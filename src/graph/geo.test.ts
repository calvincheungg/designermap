import { describe, expect, it } from 'vitest';
import { houses } from '../data';
import { cities, type CityName } from '../data/cities';
import { boxesOverlap, housesByCity, layoutMap, mapBoxes, pinScale, project } from './geo';

const allCities = new Set(housesByCity().keys());

describe('world map layout', () => {
  it('puts every pin tip exactly on its city', () => {
    for (const c of layoutMap(allCities).cities) {
      const at = project(cities[c.city as CityName]);
      expect(c.tip.x).toBeCloseTo(at.x);
      expect(c.tip.y).toBeCloseTo(at.y);
    }
  });

  it.each([
    ['all expanded', allCities],
    ['only Paris expanded', new Set(['Paris'])],
    ['Tokyo, Okayama and Seoul expanded', new Set(['Tokyo', 'Okayama', 'Seoul'])],
  ])('never lets an open city cover a pin or another open city (%s)', (_, expanded) => {
    const boxes = mapBoxes(expanded);
    const grids = boxes.filter((b) => b.kind === 'grid');
    for (const g of grids) {
      for (const other of boxes) {
        if (other !== g) expect(boxesOverlap(g, other), `${g.city} houses / ${other.kind} ${other.city}`).toBe(false);
      }
    }
  });

  it('places houses only for expanded cities', () => {
    expect(layoutMap(new Set()).houses.size).toBe(0);
    expect(layoutMap(new Set(['Paris'])).houses.size).toBe(housesByCity().get('Paris')!.length);
    const all = layoutMap(allCities);
    for (const h of houses) expect(all.houses.has(h.id), h.id).toBe(true);
  });

  it('keeps pins small on screen when zoomed in', () => {
    // Art pixels → screen px: grows with the map, then caps at 2px per pixel.
    expect(pinScale(0.3) * 0.3).toBeCloseTo(1.5);
    expect(pinScale(1) * 1).toBeCloseTo(2);
    expect(pinScale(3) * 3).toBeCloseTo(2);
  });

  it('keeps geography roughly right (west to east: New York, Paris, Tokyo)', () => {
    const x = (c: string) => layoutMap(new Set()).cities.find((b) => b.city === c)!.tip.x;
    expect(x('New York')).toBeLessThan(x('Paris'));
    expect(x('Paris')).toBeLessThan(x('Tokyo'));
  });
});
