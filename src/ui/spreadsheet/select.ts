/**
 * Selection arithmetic for the Spreadsheet's grid, in rows (-1 is the field-name
 * row, otherwise an index into the listed rows) and positions among the shown
 * columns. No React; ui/spreadsheet/ owns the state.
 */
export interface Rect { r0: number; r1: number; p0: number; p1: number }
export const rectOf = (r: number, p: number, r2 = r, p2 = p): Rect =>
  ({ r0: Math.min(r, r2), r1: Math.max(r, r2), p0: Math.min(p, p2), p1: Math.max(p, p2) });
export const inRect = (rect: Rect, r: number, p: number) => r >= rect.r0 && r <= rect.r1 && p >= rect.p0 && p <= rect.p1;
export const inRects = (rects: readonly Rect[], r: number, p: number) => rects.some((rect) => inRect(rect, r, p));

const span = (from: number, to: number) => Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);
export const rectsRows = (rects: readonly Rect[]) => [...new Set(rects.flatMap((rect) => span(rect.r0, rect.r1)))].sort((a, b) => a - b);
export const rectsColumns = (rects: readonly Rect[]) => [...new Set(rects.flatMap((rect) => span(rect.p0, rect.p1)))].sort((a, b) => a - b);
/** The rows and columns a selection copies as one block, or undefined when its areas don't line up (Excel refuses those too). */
export function copyBlock(rects: readonly Rect[]): { rows: number[]; columns: number[] } | undefined {
  const rows = rectsRows(rects), columns = rectsColumns(rects);
  return rects.length === 1 || rows.every((r) => columns.every((p) => inRects(rects, r, p))) ? { rows, columns } : undefined;
}

/** Tab (by rows) or Enter (by columns) inside a selection: the next cell, wrapping through each area in turn. */
export function cycle(rects: readonly Rect[], r: number, p: number, by: 'row' | 'column', step: 1 | -1): { r: number; p: number } {
  // The newest area containing the cell, as that's the one on top.
  const at = Math.max(0, rects.findLastIndex((rect) => inRect(rect, r, p)));
  const rect = rects[at]!;
  const height = rect.r1 - rect.r0 + 1, width = rect.p1 - rect.p0 + 1;
  const index = by === 'row' ? (r - rect.r0) * width + (p - rect.p0) : (p - rect.p0) * height + (r - rect.r0);
  let next = index + step, target = rect;
  if (next < 0 || next >= width * height) {
    target = rects[(at + step + rects.length) % rects.length]!;
    next = step > 0 ? 0 : (target.r1 - target.r0 + 1) * (target.p1 - target.p0 + 1) - 1;
  }
  const h = target.r1 - target.r0 + 1, w = target.p1 - target.p0 + 1;
  return by === 'row' ? { r: target.r0 + Math.floor(next / w), p: target.p0 + next % w } : { r: target.r0 + next % h, p: target.p0 + Math.floor(next / h) };
}

/** Ctrl+Arrow along one line: to the end of the current block of filled cells, or on to the next filled cell (or the edge). */
export function blockEdge(from: number, first: number, last: number, step: 1 | -1, filled: (index: number) => boolean): number {
  const end = step > 0 ? last : first;
  if (from === end) return from;
  let at = from + step;
  if (filled(from) && filled(at)) { while (at !== end && filled(at + step)) at += step; return at; }
  while (at !== end && !filled(at)) at += step;
  return at;
}

/** One part of a typed reference, in sheet row numbers (1-based) and column order; a missing side means the whole column or row. */
export interface ReferencePart { row0?: number; row1?: number; col0?: number; col1?: number }
const letterIndex = (letters: string) => [...letters.toUpperCase()].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0) - 1;
/** Read "B4", "A1:C50", "C", "B:D", "5:9" or several with commas ($ signs allowed); undefined if it isn't a reference. */
export function parseReference(text: string): ReferencePart[] | undefined {
  const parts = text.replace(/[$\s]/g, '').split(',');
  const out: ReferencePart[] = [];
  for (const part of parts) {
    const ends = part.split(':').map((end) => /^([a-z]{0,2})(\d{0,6})$/i.exec(end));
    if (!part || ends.length > 2 || ends.some((end) => !end || !end[0])) return undefined;
    const [a, b = a] = ends as [RegExpExecArray, RegExpExecArray?];
    // Both ends must be the same kind; a lone row number isn't a reference, as in Excel.
    if (!!a[1] !== !!b![1] || !!a[2] !== !!b![2] || (!a[1] && ends.length < 2)) return undefined;
    const cols = a[1] ? [letterIndex(a[1]), letterIndex(b![1]!)].sort((x, y) => x - y) : undefined;
    const rows = a[2] ? [Number(a[2]), Number(b![2])].sort((x, y) => x - y) : undefined;
    if (rows && rows[0]! < 1) return undefined;
    out.push({ ...(cols && { col0: cols[0], col1: cols[1] }), ...(rows && { row0: rows[0], row1: rows[1] }) });
  }
  return out;
}
