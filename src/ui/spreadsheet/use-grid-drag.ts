import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { type Cell } from './layout';
import { ROW_HEADER_WIDTH, MAC, adds } from './metrics';
import { type Commands } from './use-commands';
import { type GridSelection } from './use-selection';
import { type SheetView } from './use-sheet-view';
import { type Workbook } from './use-workbook';

/** Mouse dragging in the grid: selecting (with edge scrolling), moving columns and resizing them. */
export function useGridDrag({ workbook, view, selection, commands }: { workbook: Workbook; view: SheetView; selection: GridSelection; commands: Commands }) {
  const { grid } = workbook;
  const { headerHeight, zoom, rowHeight, widths, shownCols, lefts, frozenCols, shown, frozenRows, reveal } = view;
  const { anchorRow, anchorCol, extent, extentPosition, setActive, addArea, setExtent, fullColumns, selectColumn } = selection;
  const { setWidth, moveColumns } = commands;
  /** Where dragged columns would land, as a position among the shown columns. */
  const [dropAt, setDropAt] = useState<number | null>(null);
  /** A selection being dragged out with the mouse: cells, whole columns (from a letter) or whole rows (from a row number). */
  const dragging = useRef<{ mode: 'cells' | 'columns' | 'rows'; fromFields: boolean; x: number; y: number } | null>(null);
  /** The last press extended or dragged a selection, so the click ending it must not follow a link. */
  const suppressClick = useRef(false);
  /** Dragging past the grid's edge scrolls it and keeps extending the selection; refreshed each render. */
  const autoScroll = useRef(() => {});
  /** Selected columns being dragged by a letter to a new place. */
  const moving = useRef<{ target: number; x: number; from: number; started: boolean } | null>(null);
  const moveOver = useRef(() => {});
  const moveEnd = useRef((_commit: boolean) => {});
  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (moving.current) {
        if (event.buttons & 1) { moving.current.x = event.clientX; moveOver.current(); }
        else moveEnd.current(false);
      }
      if (!dragging.current) return;
      if (event.buttons & 1) Object.assign(dragging.current, { x: event.clientX, y: event.clientY });
      else dragging.current = null;
    };
    const stop = (event: PointerEvent) => { dragging.current = null; if (moving.current) moveEnd.current(event.type === 'pointerup'); };
    const timer = window.setInterval(() => { if (dragging.current || moving.current?.started) autoScroll.current(); }, 50);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, []);
  /** A column border being dragged. */
  const resizing = useRef<{ col: number; x: number; width: number } | null>(null);
  /** Dragging a selected column's letter: mark where the columns would land. */
  moveOver.current = () => {
    const drag = moving.current, element = grid.current;
    if (!drag || !element) return;
    if (!drag.started && Math.abs(drag.x - drag.from) < 4) return;
    drag.started = true;
    const view = (drag.x - element.getBoundingClientRect().left) / zoom;
    const x = view < lefts[frozenCols]! ? view : view + element.scrollLeft / zoom;
    setDropAt(shownCols.filter((c, p) => lefts[p]! + widths[c]! / 2 < x).length);
  };
  moveEnd.current = (commit) => {
    const drag = moving.current;
    moving.current = null;
    setDropAt(null);
    if (!drag || !commit) return;
    if (!drag.started) selectColumn(drag.target);
    else if (dropAt !== null) moveColumns(fullColumns, dropAt);
  };

  const resizeStart = (target: number) => (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    resizing.current = { col: target, x: event.clientX, width: widths[target]! };
  };
  const resizeMove = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = resizing.current;
    if (drag) setWidth(drag.col, drag.width + (event.clientX - drag.x) / zoom);
  };
  const resizeEnd = () => { resizing.current = null; };
  /** Press a cell: make it active, or with Shift extend the range to it; dragging on extends the range. */
  const pick = (target: Cell) => (event: ReactMouseEvent) => {
    if (event.button !== 0 || (MAC && event.ctrlKey)) return;
    if (event.shiftKey) setExtent(target);
    else if (adds(event)) addArea(target);
    else setActive(target);
    startDrag(event, 'cells');
  };
  /** Press a selected column's letter: dragging moves the selected columns. */
  const startMove = (event: ReactMouseEvent, target: number) => {
    moving.current = { target, x: event.clientX, from: event.clientX, started: false };
    grid.current?.focus({ preventScroll: true });
  };
  const startDrag = (event: ReactMouseEvent, mode: 'cells' | 'columns' | 'rows') => {
    const fromFields = mode === 'cells' && (event.shiftKey ? anchorRow : -1) < 0 && !!(event.target as HTMLElement).closest('thead');
    dragging.current = { mode, fromFields, x: event.clientX, y: event.clientY };
    suppressClick.current = event.shiftKey || adds(event);
    grid.current?.focus({ preventScroll: true });
  };
  /** Extend the selection to a cell: whole columns or rows when the drag began on a letter or row number. */
  const extendTo = (target: Cell) => {
    const mode = dragging.current?.mode;
    const next = mode === 'columns' ? { row: Math.max(-1, shown.length - 1), col: target.col }
      : mode === 'rows' ? { row: Math.max(0, target.row), col: shownCols.at(-1)! } : target;
    if (next.row === (extent?.row ?? anchorRow) && next.col === (extent?.col ?? anchorCol)) return;
    suppressClick.current = true;
    setExtent(next);
  };
  const dragTo = (target: Cell) => (event: ReactPointerEvent) => {
    const drag = dragging.current;
    if (!drag || !(event.buttons & 1)) return;
    // Over the frozen headers of a scrolled sheet, the drag scrolls up (autoScroll) instead of jumping to row 1.
    if (target.row < frozenRows && target.row < anchorRow && anchorRow >= frozenRows && drag.mode !== 'columns' && !drag.fromFields && grid.current?.scrollTop) return;
    extendTo(target);
  };
  autoScroll.current = () => {
    const drag = dragging.current, element = grid.current;
    if (element && moving.current?.started) {
      const box = element.getBoundingClientRect(), x = moving.current.x;
      const by = x > box.left + element.clientWidth ? 24 : x < box.left + lefts[frozenCols]! * zoom && element.scrollLeft > 0 ? -24 : 0;
      if (by) { element.scrollLeft += by; moveOver.current(); }
    }
    if (!drag || !element) return;
    const rect = element.getBoundingClientRect();
    const right = rect.left + element.clientWidth, bottom = rect.top + element.clientHeight;
    const dy = drag.mode === 'columns' ? 0 : drag.y > bottom ? 1
      : !drag.fromFields && drag.y < rect.top + headerHeight + frozenRows * rowHeight && element.scrollTop > 0 && anchorRow >= frozenRows ? -1 : 0;
    const dx = drag.mode === 'rows' ? 0 : drag.x > right ? 1
      : drag.x < rect.left + ROW_HEADER_WIDTH * zoom && element.scrollLeft > 0 ? -1 : 0;
    if (!dx && !dy) return;
    const distance = dy > 0 ? drag.y - bottom : rect.top + headerHeight + frozenRows * rowHeight - drag.y;
    const step = dy * Math.max(1, Math.round(distance / rowHeight));
    const next = {
      row: Math.max(dy < 0 ? 0 : -1, Math.min(shown.length - 1, (extent?.row ?? anchorRow) + step)),
      col: shownCols[Math.max(0, Math.min(shownCols.length - 1, extentPosition + dx))]!,
    };
    extendTo(next);
    // Whole columns only scroll sideways and whole rows only up and down.
    reveal({ row: dy ? next.row : -1, col: dx ? next.col : -1 });
  };

  return {
    startMove, dropAt, setDropAt, dragging, suppressClick, autoScroll, moving, moveOver, moveEnd,
    resizing, resizeStart, resizeMove, resizeEnd, pick, startDrag, extendTo, dragTo,
  };
}
export type GridDrag = ReturnType<typeof useGridDrag>;
