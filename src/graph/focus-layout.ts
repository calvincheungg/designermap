import type { Point } from './geo';

/** A block of brand icons that wants to sit at `home`, its city. */
export interface FocusBlock { id: string; home: Point; w: number; h: number }
interface Rect { center: Point; w: number; h: number }

/** Icon cells have their own padding, so blocks need little between them. */
const GAP = 6;
const ROUNDS = 400;
/** How strongly each round draws a block back to its city. */
const PULL = 0.02;
const PASSES = 3;

const overlaps = (center: Point, w: number, h: number, box: Rect) =>
  Math.abs(center.x - box.center.x) < (w + box.w) / 2 + GAP - 1e-6
  && Math.abs(center.y - box.center.y) < (h + box.h) / 2 + GAP - 1e-6;

/** The free spot for a w×h box nearest `target`. */
export function nearestFree(target: Point, w: number, h: number, placed: readonly Rect[]): Point {
  const free = (p: Point) => !placed.some((box) => overlaps(p, w, h, box));
  if (free(target)) return target;
  // The nearest free spot touches one box, or sits in the corner between two.
  const spans = placed.map((box) => {
    const dx = (box.w + w) / 2 + GAP, dy = (box.h + h) / 2 + GAP;
    return { left: box.center.x - dx, right: box.center.x + dx, top: box.center.y - dy, bottom: box.center.y + dy };
  });
  const xs = [target.x, ...spans.flatMap((s) => [s.left, s.right])].sort((a, b) => Math.abs(a - target.x) - Math.abs(b - target.x));
  const ys = [target.y, ...spans.flatMap((s) => [s.top, s.bottom])].sort((a, b) => Math.abs(a - target.y) - Math.abs(b - target.y));
  let best: Point | undefined;
  let bestDistance = Infinity;
  for (const x of xs) {
    if (Math.abs(x - target.x) >= bestDistance) break;
    for (const y of ys) {
      const distance = Math.hypot(x - target.x, y - target.y);
      if (distance >= bestDistance) break;
      if (free({ x, y })) { best = { x, y }; bestDistance = distance; break; }
    }
  }
  return best!;
}

/**
 * Place blocks as near their cities as they fit without overlapping each other or the
 * `fixed` boxes. Crowded blocks first push each other apart evenly, so neighbours keep
 * their geographic arrangement, then each settles into the free spot nearest its city.
 */
export function placeFocused(blocks: readonly FocusBlock[], fixed: readonly Rect[]): Map<string, Point> {
  const boxes = blocks.map((block) => ({ ...block, center: { ...block.home }, mass: block.w * block.h }));
  const all: { center: Point; w: number; h: number; home: Point; mass: number }[] = [
    ...boxes,
    ...fixed.map((box) => ({ ...box, home: box.center, mass: Infinity })),
  ];
  for (let round = 0; round < ROUNDS; round++) {
    let moved = false;
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < all.length; j++) {
      const a = all[i]!, b = all[j]!;
      const x = (a.w + b.w) / 2 + GAP - Math.abs(a.center.x - b.center.x);
      const y = (a.h + b.h) / 2 + GAP - Math.abs(a.center.y - b.center.y);
      if (x <= 0.01 || y <= 0.01) continue;
      moved = true;
      const axis = x < y ? 'x' : 'y';
      const away = Math.sign(a.home[axis] - b.home[axis]) || Math.sign(a.center[axis] - b.center[axis]) || -1;
      const push = Math.min(x, y) * away;
      const share = b.mass === Infinity ? 1 : b.mass / (a.mass + b.mass);
      a.center[axis] += push * share;
      if (b.mass !== Infinity) b.center[axis] -= push * (1 - share);
    }
    if (!moved) break;
    for (const box of boxes) {
      box.center.x += (box.home.x - box.center.x) * PULL;
      box.center.y += (box.home.y - box.center.y) * PULL;
    }
  }
  // Settle: biggest first at the spots found above, then each as near its city as the rest allow.
  const order = [...boxes].sort((a, b) => b.mass - a.mass || a.id.localeCompare(b.id));
  const placed: Rect[] = [...fixed];
  for (const box of order) {
    box.center = nearestFree(box.center, box.w, box.h, placed);
    placed.push(box);
  }
  for (let pass = 0; pass < PASSES; pass++) for (const box of order) {
    box.center = nearestFree(box.home, box.w, box.h, placed.filter((other) => other !== box));
  }
  return new Map(boxes.map((box) => [box.id, box.center]));
}
