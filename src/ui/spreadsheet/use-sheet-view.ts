import { useLayoutEffect, useMemo, useState } from 'react';
import { columnIndex, columnLetter, listRows, formatPainter } from './data';
import { type Cell } from './layout';
import { ROW_HEIGHT, ROW_HEADER_WIDTH, MAX_FROZEN } from './metrics';
import { type Workbook } from './use-workbook';

/** The current sheet as drawn: its columns, listed rows, frozen panes and scroll position. */
export function useSheetView({ workbook }: { workbook: Workbook }) {
  const { sheetId, formulaBar, zoomPercent, grid, sheet, state } = workbook;
  const { sort, filters, search } = state;
  const [viewport, setViewport] = useState({ top: 0, height: 480, width: 0 });
  const columns = sheet.columns;
  const zoom = zoomPercent / 100;
  const rowHeight = ROW_HEIGHT * zoom;
  const headerHeight = rowHeight * 2;

  // Widths: each column's default, or the width the user dragged or AutoFit it to.
  const widths = useMemo(() => columns.map((column) => state.widths[column.id] ?? column.width), [columns, state.widths]);
  // Shown columns keep their letters, so a hidden column leaves a gap (A, B, D…), as in Excel.
  const order = useMemo(() => state.order?.map((id) => columnIndex(sheet, id)) ?? columns.map((_, col) => col), [sheet, columns, state.order]);
  const shownCols = useMemo(() => order.filter((col) => !state.hidden.includes(columns[col]!.id)), [order, columns, state.hidden]);
  const columnKey = shownCols.join();
  const letterOf = (col: number) => columnLetter(order.indexOf(col));
  const lefts = useMemo(() => shownCols.reduce<number[]>((list, col, p) => [...list, list[p]! + widths[col]!], [ROW_HEADER_WIDTH]), [shownCols, widths]);
  const sheetWidth = lefts[shownCols.length]!;
  // Frozen panes keep room for the rest of the sheet, however narrow the window (the first column always fits).
  const frozenCols = (() => {
    let count = Math.min(state.freeze.cols, shownCols.length);
    while (count > 1 && viewport.width && lefts[count]! * zoom > viewport.width * MAX_FROZEN) count--;
    return count;
  })();

  const all = sheet.rows();
  const list = useMemo(() => listRows(sheet, { sort, filters, search, hiddenRows: state.hiddenRows, subtotals: state.subtotals, collapsed: state.collapsed }),
    [sheet, sort, filters, search, state.hiddenRows, state.subtotals, state.collapsed]);
  const { searched, visible, shown, numbers } = list;
  const filtered = Object.keys(filters).length > 0;
  const narrowed = filtered || search.trim() !== '';
  const frozenRows = Math.min(state.freeze.rows, shown.length, Math.max(0, Math.floor((viewport.height * MAX_FROZEN - headerHeight) / rowHeight)));

  useLayoutEffect(() => {
    const element = grid.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => setViewport((current) => ({ ...current, height: element.clientHeight || current.height, width: element.clientWidth })));
    observer.observe(element);
    return () => observer.disconnect();
  }, [formulaBar]);
  const scrollTop = () => { if (grid.current) grid.current.scrollTop = 0; setViewport((current) => ({ ...current, top: 0 })); };
  // A new sheet opens at its top-left corner.
  useLayoutEffect(() => { if (grid.current) grid.current.scrollLeft = 0; scrollTop(); }, [sheetId]);

  /** Scroll the grid just enough to show a cell past the frozen header rows, row numbers and frozen column. */
  const reveal = (target: Cell) => {
    const element = grid.current;
    if (!element) return;
    if (target.row >= frozenRows) {
      const top = headerHeight + target.row * rowHeight;
      const view = element.clientHeight || viewport.height;
      if (top < element.scrollTop + headerHeight + frozenRows * rowHeight) element.scrollTop = top - headerHeight - frozenRows * rowHeight;
      else if (top + rowHeight > element.scrollTop + view) element.scrollTop = top + rowHeight - view;
    }
    const p = shownCols.indexOf(target.col);
    if (p < frozenCols) return;
    const left = lefts[p]! * zoom, right = lefts[p + 1]! * zoom;
    const fixed = lefts[frozenCols]! * zoom;
    const width = element.clientWidth;
    if (left < element.scrollLeft + fixed) element.scrollLeft = left - fixed;
    else if (width && right > element.scrollLeft + width) element.scrollLeft = right - width;
  };
  const painters = useMemo(() => new Map(Object.entries(state.formats).flatMap(([id, format]) => {
    const target = columnIndex(sheet, id);
    return format && target >= 0 ? [[target, { paint: formatPainter(sheet, target, format), format }] as const] : [];
  })), [sheet, state.formats]);

  return {
    headerHeight, sort, filters, search, viewport, setViewport, columns, zoom, rowHeight,
    widths, order, shownCols, columnKey, letterOf, lefts, sheetWidth, frozenCols,
    all, list, searched, visible, shown, numbers, filtered, narrowed,
    frozenRows, scrollTop, reveal, painters,
  };
}
export type SheetView = ReturnType<typeof useSheetView>;
