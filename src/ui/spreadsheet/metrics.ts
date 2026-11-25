
/** Grid measurements, in unzoomed px. */
export const ROW_HEIGHT = 17;
export const ROW_HEADER_WIDTH = 40;
/** Rows drawn above and below the visible ones. */
export const OVERSCAN = 12;
/** Excel refuses to freeze or hide everything; panes never take more than this share of the grid. */
export const MAX_FROZEN = 0.7;

/** On a Mac, Ctrl+click is a right-click and ⌘ adds to a selection. */
export const MAC = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform);
export const adds = (event: { ctrlKey: boolean; metaKey: boolean }) => event.metaKey || (event.ctrlKey && !MAC);

/* Double-click AutoFit measures text with a canvas in Arial 13px, the cells' font (an estimate where there is no canvas, as in tests). */
let context: CanvasRenderingContext2D | null | undefined;
const measured = new Map<string, number>();
export function measureText(text: string, bold: boolean): number {
  const key = `${bold ? 'b' : 'n'}${text}`;
  const known = measured.get(key);
  if (known !== undefined) return known;
  if (context === undefined) {
    try { context = typeof navigator !== 'undefined' && !/jsdom/i.test(navigator.userAgent) ? document.createElement('canvas').getContext('2d') : null; }
    catch { context = null; }
  }
  let width = text.length * (bold ? 7.5 : 7);
  if (context) { context.font = `${bold ? 'bold ' : ''}13px Arial, Helvetica, sans-serif`; width = context.measureText(text).width; }
  measured.set(key, width);
  return width;
}

