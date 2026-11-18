import { describe, expect, it } from 'vitest';
import { houses } from '../data';
import { cities } from '../data/cities';
import { boxesOverlap, housesByMapLocation, layoutMap, mapBoxes, mapSvgMarkup, pinScale, project, ringLayout, RING_RADIUS } from './geo';
import subdivisions from '../data/map/north-america-subdivisions.json';
import { mapElements, nodeId } from './elements';
import { isMajorCity, mapLocationCoordinates, mapLocationForCity } from './locations';

const allCities = new Set(housesByMapLocation().keys());

describe('world map layout', () => {
  it('keeps an individual city pin and grid available beneath zoom clusters', () => {
    const markers = mapElements().filter((element) => element.data.kind === 'marker');
    for (const city of ['Gardena', 'Reggio Emilia', 'Albino', 'Los Angeles', 'San Francisco', 'Milan', 'Turin', 'Venice', 'Bologna', 'Florence'] as const) {
      expect(mapLocationForCity(city)).toBe(city);
      expect(mapLocationCoordinates(city)).toEqual(cities[city]);
      const marker = markers.find((element) => element.data.id === nodeId.city(city));
      expect(marker?.data.label).toBe(city);
      expect(marker?.data.count).toBe(houses.filter((h) => !h.parentHouse && h.city === city).length);
      expect(marker?.data.major).toBe(isMajorCity(city, marker!.data.count));
    }
    expect(houses.find((h) => h.id === 'sixEightSix')?.city).toBe('Gardena');
    expect(houses.find((h) => h.id === 'maxMara')?.city).toBe('Reggio Emilia');
    const grouped = [...housesByMapLocation().values()].flat();
    expect(grouped.length).toBe(houses.length);
    expect(new Set(grouped.map((h) => h.id)).size).toBe(houses.length);
    expect(markers.length).toBe(housesByMapLocation().size);
  });

  it('keeps map labels concise and preserves city IDs and coordinates', () => {
    const markers = mapElements().filter((element) => element.data.kind === 'marker');
    for (const [city, label] of [
      ['New York', 'New York'],
      ['Rockford', 'Rockford'],
      ['Toronto', 'Toronto'],
      ['Vancouver', 'Vancouver'],
      ['Montreal', 'Montreal'],
      ['Paris', 'Paris'],
    ] as const) {
      const marker = markers.find((element) => element.data.id === nodeId.city(city));
      expect(marker?.data.label).toBe(label);
      expect(marker?.data.city).toBe(city);
      expect(marker?.data.tip).toEqual(project(cities[city]));
    }
  });

  it('projects internal boundaries for Canada and the USA into the clipped map layer', () => {
    expect(subdivisions.features.map((f) => f.properties.country).sort()).toEqual(['CA', 'US']);
    const markup = mapSvgMarkup();
    expect(markup).toContain('<clipPath id="map-land-clip">');
    const paths = [...markup.matchAll(/<path class="subdivision-borders" data-country="(CA|US)" clip-path="url\(#map-land-clip\)" d="([^"]+)"\/>/g)];
    expect(paths.map((match) => match[1]).sort()).toEqual(['CA', 'US']);
    for (const [, , d] of paths) {
      expect(d).toMatch(/^M[\d.-]+,[\d.-]+/);
      expect(d).not.toMatch(/NaN|Infinity|null/);
    }
    for (const region of subdivisions.features) {
      expect(region.geometry.coordinates.length).toBeGreaterThan(0);
      for (const line of region.geometry.coordinates) {
        expect(line.length).toBeGreaterThan(1);
        for (const [lon, lat] of line) {
          expect(lon).toBeLessThan(-50);
          expect(lat).toBeGreaterThan(20);
        }
      }
    }
  });

  it('puts every pin tip exactly on its city or regional anchor', () => {
    for (const c of layoutMap(allCities).cities) {
      const at = project(mapLocationCoordinates(c.city));
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
    expect(layoutMap(new Set(['Paris'])).houses.size).toBe(housesByMapLocation().get('Paris')!.length);
    const all = layoutMap(allCities);
    for (const h of houses) expect(all.houses.has(h.id), h.id).toBe(true);
  });

  it('orders every open city\'s houses alphabetically, row by row', () => {
    const positions = layoutMap(allCities).houses;
    for (const [city, hs] of housesByMapLocation()) {
      const names = hs.map((h) => h.name);
      expect(names, city).toEqual(
        [...names].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base', numeric: true })),
      );
      // Reading order on screen (top-to-bottom, then left-to-right) matches.
      const onScreen = [...hs]
        .sort((a, b) => positions.get(a.id)!.y - positions.get(b.id)!.y || positions.get(a.id)!.x - positions.get(b.id)!.x)
        .map((h) => h.name);
      expect(onScreen, city).toEqual(names);
    }
  });

  it('keeps pins small on screen when zoomed in', () => {
    // Art pixels → screen px: grows with the map, then caps at 2px per pixel.
    expect(pinScale(0.3) * 0.3).toBeCloseTo(1.5);
    expect(pinScale(1) * 1).toBeCloseTo(2);
    expect(pinScale(3) * 3).toBeCloseTo(2);
  });

  it('compacts filtered houses and skips cities with no matches', () => {
    const paris = housesByMapLocation().get('Paris')!.slice(0, 2);
    const filtered = new Map([['Paris', paris]]);
    const layout = layoutMap(allCities, filtered);
    expect(layout.cities.map((c) => c.city)).toEqual(['Paris']);
    expect([...layout.houses.keys()]).toEqual(paris.map((h) => h.id));
    const [first, second] = paris.map((h) => layout.houses.get(h.id)!);
    expect(first!.y).toBe(second!.y);
    expect(first!.x).toBeLessThan(second!.x);
    const empty = layoutMap(allCities, new Map());
    expect(empty.cities).toEqual([]);
    expect(empty.houses.size).toBe(0);
  });

  it('keeps geography roughly right (west to east: New York, Paris, Tokyo)', () => {
    const x = (c: string) => layoutMap(new Set()).cities.find((b) => b.city === c)!.tip.x;
    expect(x('New York')).toBeLessThan(x('Paris'));
    expect(x('Paris')).toBeLessThan(x('Tokyo'));
  });
});

describe('selection ring', () => {
  it('spaces partners evenly from the top, at least RING_RADIUS away', () => {
    const ring = ringLayout({ x: 0, y: 0 }, ['a', 'b', 'c', 'd']);
    const a = ring.get('a')!;
    expect(a.x).toBeCloseTo(0);
    expect(a.y).toBeCloseTo(-RING_RADIUS);
    for (const point of ring.values()) expect(Math.hypot(point.x, point.y)).toBeCloseTo(RING_RADIUS);
    expect(ring.get('b')!.x).toBeCloseTo(RING_RADIUS);
  });

  it('rotates slots away from lines to other cities', () => {
    // One partner would sit at the top; a line straight up pushes it aside.
    const point = ringLayout({ x: 0, y: 0 }, ['a'], [-Math.PI / 2]).get('a')!;
    expect(Math.atan2(point.y, point.x)).not.toBeCloseTo(-Math.PI / 2);
  });

  it('splits large groups into two rings with room for every icon', () => {
    const ids = Array.from({ length: 20 }, (_, i) => `h${i}`);
    const radii = [...ringLayout({ x: 0, y: 0 }, ids).values()].map((p) => Math.round(Math.hypot(p.x, p.y)));
    expect(new Set(radii).size).toBe(2);
    expect(Math.min(...radii)).toBeGreaterThanOrEqual(RING_RADIUS);
  });
});
