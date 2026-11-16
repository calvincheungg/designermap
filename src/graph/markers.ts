import { pinScale, type Point } from './geo';
import { PIN_H, PIN_W } from './icons';
import { BoxIndex } from './box-index';

export interface MarkerAnchor {
  id: string;
  tip: Point;
}

export interface MarkerObstacle {
  center: Point;
  w: number;
  h: number;
}

/**
 * Place pins in priority order, keeping isolated pins at their true coordinates.
 * Search obstacle boundaries so nearby cities stay individually clickable
 * at every zoom. Callers draw a tether from displaced tips to the true location.
 */
export function placeMarkers(
  markers: readonly MarkerAnchor[],
  zoom: number,
  obstacles: readonly MarkerObstacle[] = [],
): Map<string, Point> {
  const w = PIN_W * pinScale(zoom);
  const h = PIN_H * pinScale(zoom);
  const gap = 4 / zoom;
  const placed = [...obstacles];
  const index = new BoxIndex();
  placed.forEach((box) => index.add(box));
  const positions = new Map<string, Point>();
  for (const { id, tip } of markers) {
    const home = { x: tip.x, y: tip.y - h / 2 };
    let center = home;
    const free = (point: Point) => !index.overlaps({ center: point, w, h }, gap);
    if (!free(home)) {
      const candidates: Point[] = [];
      for (const box of placed) {
        // A tiny margin keeps boundary arithmetic from introducing overlaps.
        const dx = (box.w + w) / 2 + gap + 1e-6;
        const dy = (box.h + h) / 2 + gap + 1e-6;
        const left = box.center.x - dx, right = box.center.x + dx;
        const top = box.center.y - dy, bottom = box.center.y + dy;
        const x = Math.max(left, Math.min(right, home.x));
        const y = Math.max(top, Math.min(bottom, home.y));
        candidates.push(
          { x: left, y }, { x: right, y }, { x, y: top }, { x, y: bottom },
          { x: left, y: top }, { x: right, y: top },
          { x: left, y: bottom }, { x: right, y: bottom },
        );
      }
      const distance = (point: Point) => (point.x - home.x) ** 2 + (point.y - home.y) ** 2;
      const ranked = candidates.map((point) => ({ point, distance: distance(point) }))
        .sort((a, b) => a.distance - b.distance);
      center = ranked.find(({ point }) => free(point))!.point;
    }
    positions.set(id, { x: center.x, y: center.y + h / 2 });
    placed.push({ center, w, h });
    index.add({ center, w, h });
  }
  return positions;
}
