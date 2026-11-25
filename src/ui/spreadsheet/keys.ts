import { type KeyboardEvent } from 'react';
import { cycle, blockEdge } from './select';
import { type Commands } from './use-commands';
import { type GridDrag } from './use-grid-drag';
import { type Popups } from './use-popups';
import { type GridSelection } from './use-selection';
import { type SheetView } from './use-sheet-view';
import { type Workbook } from './use-workbook';

/** The grid's keyboard. */
export function gridKeys({ workbook, popups, view, selection, commands, drag }: { workbook: Workbook; popups: Popups; view: SheetView; selection: GridSelection; commands: Commands; drag: GridDrag }) {
  const { autoFilter, grid, update, tabIndex } = workbook;
  const { copied, setCopied, setFinding, findOptions, setDialog, setRowMenu } = popups;
  const { headerHeight, viewport, rowHeight, shownCols, shown, reveal } = view;
  const { col, lastRow, anchorRow, extent, extentPosition, rects, multi, row, cell, position, activeRow, setExtent, selectAll, growSelection, moveTo } = selection;
  const { openRow, goToTab, copySelection, findNext, openDropdown, openCellMenu } = commands;
  const { moving, moveEnd } = drag;
  return (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    const page = Math.max(1, Math.floor((viewport.height - headerHeight) / rowHeight) - 1);
    const ctrl = event.ctrlKey || event.metaKey;
    const last = shownCols.length - 1;
    const filled = (r: number, p: number) => r < 0 || !!shown[r]?.cells[shownCols[p]!]?.length;
    // Ctrl+Arrow stops at the edge of a block of filled cells, as in Excel.
    const edgeRow = (r: number, p: number, step: 1 | -1) => blockEdge(r, -1, lastRow, step, (at) => filled(at, p));
    const edgeCol = (r: number, p: number, step: 1 | -1) => blockEdge(p, 0, last, step, (at) => filled(r, at));
    const movesFrom = (r: number, p: number): Record<string, [number, number]> => ({
      ArrowUp: [ctrl ? edgeRow(r, p, -1) : r - 1, p], ArrowDown: [ctrl ? edgeRow(r, p, 1) : r + 1, p],
      ArrowLeft: [r, ctrl ? edgeCol(r, p, -1) : p - 1], ArrowRight: [r, ctrl ? edgeCol(r, p, 1) : p + 1],
      PageUp: [r - page, p], PageDown: [r + page, p],
      Home: [ctrl ? -1 : r, 0], End: [ctrl ? shown.length - 1 : r, ctrl ? last : p],
      Tab: [r, p + (event.shiftKey ? -1 : 1)],
    });
    const moves = movesFrom(row, position);
    if (ctrl && (event.key === 'PageDown' || event.key === 'PageUp')) {
      // Ctrl+Page Down / Page Up: the next or previous sheet, as in Excel.
      event.preventDefault();
      goToTab(tabIndex + (event.key === 'PageDown' ? 1 : -1));
    } else if (event.key === ' ' && (event.ctrlKey || event.shiftKey)) {
      event.preventDefault();
      if (event.ctrlKey && event.shiftKey) selectAll(); else growSelection(event.ctrlKey ? 'columns' : 'rows');
    } else if ((ctrl && event.key.toLowerCase() === 'g') || event.key === 'F5') { event.preventDefault(); setDialog({ kind: 'goto' }); }
    else if (event.shiftKey && event.key === 'F4') { event.preventDefault(); if (findOptions.current.text) findNext(findOptions.current); else setFinding(true); }
    else if (event.key === 'Escape' && (copied || moving.current)) { event.preventDefault(); event.stopPropagation(); setCopied(null); if (moving.current) moveEnd.current(false); }
    else if (multi && (event.key === 'Tab' || event.key === 'Enter')) {
      // Inside a selection, Tab and Enter walk the active cell through it.
      event.preventDefault();
      const next = cycle(rects, row, position, event.key === 'Tab' ? 'row' : 'column', event.shiftKey ? -1 : 1);
      const target = { row: next.r, col: shownCols[next.p]! };
      update(() => ({ cursor: target }));
      reveal(target);
    } else if (ctrl && event.key.toLowerCase() === 'a') { event.preventDefault(); selectAll(); }
    else if (event.shiftKey && event.key !== 'Tab' && movesFrom(0, 0)[event.key]) {
      // Shift+arrows grow or shrink the range from its far corner; the active cell stays put.
      event.preventDefault();
      const [r, p] = movesFrom(extent?.row ?? anchorRow, extentPosition)[event.key]!;
      const next = { row: Math.max(-1, Math.min(shown.length - 1, r)), col: shownCols[Math.max(0, Math.min(last, p))]! };
      setExtent(next);
      reveal(next);
    } else if (ctrl && event.key.toLowerCase() === 'f') { event.preventDefault(); setFinding(true); }
    else if (event.altKey && event.key === 'ArrowDown' && activeRow?.menus[col]?.length) {
      // Alt+Down opens a cell's own list, as in Excel's validation drop-downs.
      event.preventDefault();
      reveal(cell);
      const td = grid.current?.querySelector<HTMLElement>(`[data-cell="${row}:${col}"]`);
      if (td) openCellMenu(activeRow, row, col, td);
    } else if (event.altKey && event.key === 'ArrowDown' && autoFilter) {
      event.preventDefault();
      const th = grid.current?.querySelector<HTMLElement>(`[data-field="${col}"]`);
      if (th) { reveal({ row: -1, col }); openDropdown(col, th); }
    } else if (moves[event.key] && !(event.key === 'Tab' && (event.shiftKey ? position === 0 : position === last))) {
      event.preventDefault();
      moveTo(...moves[event.key]!);
    } else if (event.key === 'Enter' && activeRow) { event.preventDefault(); openRow(activeRow); }
    else if (ctrl && event.key.toLowerCase() === 'c') { event.preventDefault(); copySelection(); }
    else if ((event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) && activeRow) {
      event.preventDefault();
      const rect = grid.current?.querySelector<HTMLElement>(`[data-cell="${row}:${col}"]`)?.getBoundingClientRect();
      setRowMenu({ x: rect?.left ?? 0, y: rect?.bottom ?? 0, key: activeRow.key, col });
    }
  };
}
