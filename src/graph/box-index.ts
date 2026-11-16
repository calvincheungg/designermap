interface Rect {
  center: { x: number; y: number };
  w: number;
  h: number;
}

/** Small spatial hash: collision checks visit nearby boxes instead of the entire map. */
export class BoxIndex {
  private cells = new Map<string, Rect[]>();
  constructor(private cellSize = 128) {}

  private range(box: Rect, gap = 0) {
    return {
      x1: Math.floor((box.center.x - box.w / 2 - gap) / this.cellSize),
      x2: Math.floor((box.center.x + box.w / 2 + gap) / this.cellSize),
      y1: Math.floor((box.center.y - box.h / 2 - gap) / this.cellSize),
      y2: Math.floor((box.center.y + box.h / 2 + gap) / this.cellSize),
    };
  }

  add(box: Rect) {
    const range = this.range(box);
    for (let x = range.x1; x <= range.x2; x++) {
      for (let y = range.y1; y <= range.y2; y++) {
        const key = `${x},${y}`;
        const cell = this.cells.get(key);
        if (cell) cell.push(box);
        else this.cells.set(key, [box]);
      }
    }
  }

  overlaps(box: Rect, gap = 0): boolean {
    const range = this.range(box, gap);
    for (let x = range.x1; x <= range.x2; x++) {
      for (let y = range.y1; y <= range.y2; y++) {
        const cell = this.cells.get(`${x},${y}`);
        if (cell?.some((other) =>
          Math.abs(box.center.x - other.center.x) < (box.w + other.w) / 2 + gap
          && Math.abs(box.center.y - other.center.y) < (box.h + other.h) / 2 + gap)) return true;
      }
    }
    return false;
  }
}
