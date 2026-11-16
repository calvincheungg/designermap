import { describe, expect, it } from 'vitest';
import { boxesOverlap, housesByMapLocation, pinScale, project } from './geo';
import { PIN_H, PIN_W } from './icons';
import { mapLocationCoordinates } from './locations';
import { placeMarkers, type MarkerAnchor } from './markers';

const boxes = (markers: readonly MarkerAnchor[], zoom: number) => {
  const tips = placeMarkers(markers, zoom);
  const w = PIN_W * pinScale(zoom);
  const h = PIN_H * pinScale(zoom);
  return markers.map(({ id }) => {
    const tip = tips.get(id)!;
    return { center: { x: tip.x, y: tip.y - h / 2 }, w, h };
  });
};

describe('crowded city pins', () => {
  it.each([0.3, 0.6, 1, 4, 8])('separates Denver, Lakewood and Broomfield at zoom %s', (zoom) => {
    const markers = ['Denver', 'Lakewood', 'Broomfield'].map((id) => ({ id, tip: project(mapLocationCoordinates(id)) }));
    const placed = boxes(markers, zoom);
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        expect(boxesOverlap(placed[i]!, placed[j]!, 3 / zoom)).toBe(false);
      }
    }
    expect(placeMarkers(markers, zoom).get('Denver')).toEqual(markers[0]!.tip);
  });

  it.each([0.3, 1, 8])('keeps every map pin separate at zoom %s', (zoom) => {
    const markers = [...housesByMapLocation()].sort((a, b) => b[1].length - a[1].length)
      .map(([id]) => ({ id, tip: project(mapLocationCoordinates(id)) }));
    const placed = boxes(markers, zoom);
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        expect(boxesOverlap(placed[i]!, placed[j]!, 3 / zoom), `${markers[i]!.id} / ${markers[j]!.id}`).toBe(false);
      }
    }
  });

  it('leaves isolated cities anchored and restores crowded pins when zoomed in', () => {
    const markers = [{ id: 'one', tip: { x: 0, y: 0 } }, { id: 'two', tip: { x: 20, y: 0 } }];
    expect(placeMarkers(markers, 0.3).get('two')).not.toEqual(markers[1]!.tip);
    expect(placeMarkers(markers, 8).get('two')).toEqual(markers[1]!.tip);
    expect(placeMarkers(markers.slice(1), 0.3).get('two')).toEqual(markers[1]!.tip);
  });

  it('handles coincident coordinates deterministically without changing geographic anchors', () => {
    const markers = Array.from({ length: 20 }, (_, i) => ({ id: String(i), tip: { x: 100, y: 100 } }));
    const first = placeMarkers(markers, 1);
    expect(placeMarkers(markers, 1)).toEqual(first);
    expect(new Set([...first.values()].map((p) => `${p.x},${p.y}`)).size).toBe(markers.length);
    expect(markers.every((m) => m.tip.x === 100 && m.tip.y === 100)).toBe(true);
  });
});
