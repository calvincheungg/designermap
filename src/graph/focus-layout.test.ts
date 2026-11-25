import { describe, expect, it } from 'vitest';
import { nearestFree, placeFocused } from './focus-layout';
import { boxesOverlap, housesByMapLocation, layoutMap, project } from './geo';
import { mapLocationCoordinates } from './locations';

describe('placing the brands a selection reveals', () => {
  it('leaves uncrowded blocks exactly on their cities', () => {
    const at = placeFocused([{ id: 'a', home: { x: 0, y: 0 }, w: 96, h: 86 }, { id: 'b', home: { x: 500, y: 0 }, w: 96, h: 86 }], []);
    expect(at.get('a')).toEqual({ x: 0, y: 0 });
    expect(at.get('b')).toEqual({ x: 500, y: 0 });
  });
  it('spreads crowded blocks without overlap, clear of fixed boxes, in their geographic order', () => {
    const fixed = { center: { x: 0, y: -100 }, w: 60, h: 60 };
    const blocks = Array.from({ length: 12 }, (_, i) => ({ id: String(i), home: { x: (i % 4) * 20, y: Math.floor(i / 4) * 20 }, w: 96 * (1 + i % 2), h: 86 }));
    const at = placeFocused(blocks, [fixed]);
    const boxes = [fixed, ...blocks.map((b) => ({ ...b, center: at.get(b.id)! }))];
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) expect(boxesOverlap(boxes[i]!, boxes[j]!)).toBe(false);
    expect(at.get('0')!.x).toBeLessThan(at.get('3')!.x);
  });
  it('finds the nearest free spot', () => {
    expect(nearestFree({ x: 10, y: 0 }, 20, 20, [{ center: { x: 0, y: 0 }, w: 20, h: 20 }])).toEqual({ x: 26, y: 0 });
  });
  it('keeps partner brands near their cities on the real map', () => {
    const cities = ['London', 'Milan', 'New York', 'Tokyo'];
    const byCity = new Map([...housesByMapLocation()].map(([city, hs]) => [city, hs.slice(0, 1)] as const));
    const own = byCity.get('Paris')![0]!;
    const { houses } = layoutMap(new Set(['Paris', ...cities]), byCity, undefined,
      { houseId: own.id, location: 'Paris', revealed: new Set(['Paris', ...cities]), ring: [] });
    for (const city of cities) {
      const at = houses.get(byCity.get(city)![0]!.id)!, home = project(mapLocationCoordinates(city));
      expect(Math.hypot(at.x - home.x, at.y - home.y)).toBeLessThan(120);
    }
  });
});
