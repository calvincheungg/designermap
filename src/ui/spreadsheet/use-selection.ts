import { useMemo } from 'react';
import { cellText, rangeStats } from './data';
import { NO_RANGE, type Cell } from './layout';
import { rectOf, inRects, rectsRows, rectsColumns, type Rect } from './select';
import { type SheetView } from './use-sheet-view';
import { type Workbook } from './use-workbook';

/** The selected cells: an anchored range, Ctrl+clicked areas, and the active cell among them. */
export function useSelection({ workbook, view }: { workbook: Workbook; view: SheetView }) {
  const { sheet, state, update } = workbook;
  const { columns, shownCols, columnKey, letterOf, shown, numbers, reveal } = view;
  // The selection: the range from the anchor (`active`) to `extent`, plus any Ctrl+clicked areas, over listed rows and shown columns.
  const lastRow = Math.max(-1, shown.length - 1);
  const clampRow = (r: number) => Math.max(-1, Math.min(lastRow, r));
  const anchorRow = Math.min(state.active.row, shown.length - 1);
  const anchorCol = shownCols.includes(state.active.col) ? state.active.col : shownCols[0]!;
  const anchorPosition = shownCols.indexOf(anchorCol);
  const extent = state.extent && state.extent.row < shown.length && shownCols.includes(state.extent.col) ? state.extent : null;
  const extentPosition = extent ? shownCols.indexOf(extent.col) : anchorPosition;
  const current = rectOf(anchorRow, anchorPosition, extent?.row ?? anchorRow, extentPosition);
  const rects: readonly Rect[] = useMemo(() => [...state.areas.flatMap(({ from, to }) => {
    const p0 = shownCols.indexOf(from.col), p1 = shownCols.indexOf(to.col);
    return p0 < 0 || p1 < 0 ? [] : [rectOf(clampRow(from.row), p0, clampRow(to.row), p1)];
  }), current], [state.areas, state.active, state.extent, shown, columnKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const multi = rects.length > 1 || current.r0 !== current.r1 || current.p0 !== current.p1;
  const cursor = state.cursor && inRects(rects, state.cursor.row, shownCols.indexOf(state.cursor.col)) ? state.cursor : null;
  const row = cursor?.row ?? anchorRow;
  const col = cursor?.col ?? anchorCol;
  const cell: Cell = { row, col };
  const position = shownCols.indexOf(col);
  const activeRow = row >= 0 ? shown[row] : undefined;
  const activeText = row < 0 ? columns[col]!.label : activeRow ? cellText(activeRow, col) : '';
  const reference = `${letterOf(col)}${row < 0 ? 1 : activeRow ? numbers.get(activeRow.key) : 1}`;
  /** Move the active cell; a plain move ends any range selection. */
  const setActive = (active: Cell | ((current: Cell) => Cell)) => update((now) => ({ ...NO_RANGE, active: typeof active === 'function' ? active(now.active) : active }));
  const setRange = (from: Cell, to: Cell) => update(() => ({ ...NO_RANGE, active: from, extent: to }));
  /** Ctrl+click or Ctrl+drag: keep what's selected and start another area. */
  const addArea = (from: Cell, to: Cell | null = null) => update(() => ({
    areas: rects.map((rect) => ({ from: { row: rect.r0, col: shownCols[rect.p0]! }, to: { row: rect.r1, col: shownCols[rect.p1]! } })),
    active: from, extent: to, cursor: null,
  }));
  const setExtent = (next: Cell | null) => update(() => ({ extent: next, cursor: null }));
  const inRange = (index: number, p: number) => multi && inRects(rects, index, p);
  /** Positions of wholly selected columns, and the selected rows when only whole rows are selected. */
  const fullColumns = useMemo(() => rectsColumns(rects.filter((rect) => rect.r0 < 0 && rect.r1 === lastRow && lastRow >= 0)), [rects, lastRow]);
  const isFullRow = (index: number) => rects.some((rect) => index >= rect.r0 && index <= rect.r1 && rect.p0 === 0 && rect.p1 === shownCols.length - 1);
  /** What a column command acts on: every selected column when this one is among them, otherwise just this one. */
  const columnsFor = (target: number) => fullColumns.includes(shownCols.indexOf(target)) ? fullColumns.map((p) => shownCols[p]!) : [target];
  const selectAll = () => setRange({ row: -1, col: shownCols[0]! }, { row: lastRow, col: shownCols.at(-1)! });
  /** Click a column letter: select the whole column (shift extends across columns, Ctrl adds one). */
  const selectColumn = (target: number, extend = false, add = false) => {
    const from = { row: -1, col: target }, to = { row: lastRow, col: target };
    if (extend) update((now) => ({ active: { ...now.active, row: -1 }, extent: to, cursor: null }));
    else if (add) addArea(from, to);
    else setRange(from, to);
  };
  /** Click a row number: select the whole row (shift extends across rows, Ctrl adds one). */
  const selectRow = (index: number, extend = false, add = false) => {
    const from = { row: index, col: shownCols[0]! }, to = { row: index, col: shownCols.at(-1)! };
    if (extend) update((now) => ({ active: { ...now.active, col: shownCols[0]! }, extent: to, cursor: null }));
    else if (add) addArea(from, to);
    else setRange(from, to);
  };
  /** Ctrl+Space and Shift+Space: the whole columns or rows the selection touches. */
  const growSelection = (whole: 'columns' | 'rows') => setRange(
    whole === 'columns' ? { row: -1, col: shownCols[current.p0]! } : { row: current.r0, col: shownCols[0]! },
    whole === 'columns' ? { row: lastRow, col: shownCols[current.p1]! } : { row: current.r1, col: shownCols.at(-1)! });

  const moveTo = (targetRow: number, targetPosition: number) => {
    const next = { row: Math.max(-1, Math.min(shown.length - 1, targetRow)), col: shownCols[Math.max(0, Math.min(shownCols.length - 1, targetPosition))]! };
    setActive(next);
    reveal(next);
  };
  const stats = useMemo(() => {
    if (!multi) return null;
    const rows = rectsRows(rects).filter((r) => r >= 0), cols = rectsColumns(rects);
    return rangeStats(sheet, rows.map((r) => shown[r]!), cols.map((p) => shownCols[p]!), rects.length > 1 ? (r, c) => inRects(rects, rows[r]!, cols[c]!) : undefined);
  }, [multi, rects, sheet, shown, shownCols]);

  return {
    col, lastRow, clampRow, anchorRow, anchorCol, anchorPosition, extent, extentPosition, current,
    rects, multi, cursor, row, cell, position, activeRow, activeText,
    reference, setActive, setRange, addArea, setExtent, inRange, fullColumns, isFullRow,
    columnsFor, selectAll, selectColumn, selectRow, growSelection, moveTo, stats,
  };
}
export type GridSelection = ReturnType<typeof useSelection>;
