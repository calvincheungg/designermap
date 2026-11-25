import { useMemo } from 'react';
import { download } from '../download';
import { type Selection } from '../panel';
import { sharedViewHash } from '../share-link';
import { SHEETS, columnIndex, cellText, filterSheet, columnValues, sheetCsv, MIN_COLUMN_WIDTH, autoFitWidth, rangeTsv, rangeHtml, findMatches, GRAND, listRows, type CellLink, type SheetRow, type SheetId, type ColumnFilter, type ListFilters, type FindOptions, type Subtotals } from './data';
import { type ListEntry } from './dialogs';
import { NO_RANGE, type SheetState, type TabId } from './layout';
import { measureText } from './metrics';
import { type PivotOptions } from './pivot';
import { rectsRows, copyBlock, parseReference } from './select';
import { type Popups } from './use-popups';
import { type GridSelection } from './use-selection';
import { type SheetView } from './use-sheet-view';
import { type Workbook, type WorkbookActions } from './use-workbook';
import { zip, xlsxFiles } from './xlsx';

/** What the menus, keys and toolbar do to the sheet: sort, filter, copy, export, columns, rows, Go To and Find. */
export function useCommands({ actions, workbook, popups, view, selection }: { actions: WorkbookActions; workbook: Workbook; popups: Popups; view: SheetView; selection: GridSelection }) {
  const { onSelect, onOpenPlace, onShowOnMap, onShowPlace } = actions;
  const { sheetId, setSheetId, states, setStates, setAutoFilter, gridlines, tabColors, setHiddenTabs, greyEnded, setPivotOpen, pivot, setPivot, grid, sheet, state, updateSheet, update, showTab, tabIds, tabIndex } = workbook;
  const { setCopied, findOptions, setChart, dropdown, setDropdown, cellMenu, setCellMenu, setDialog, closePopups } = popups;
  const { filters, columns, order, shownCols, columnKey, all, list, searched, shown, numbers, scrollTop, reveal } = view;
  const { col, lastRow, rects, multi, row, position, activeText, setActive, columnsFor } = selection;
  const followLink = (link: CellLink) => {
    if (link.kind === 'place') onOpenPlace(link.place);
    else if (link.kind === 'url') window.open(link.href, '_blank', 'noreferrer');
    else onSelect({ kind: link.kind, id: link.id } as Selection, true);
  };
  const toggleGroup = (group: string) => update((now) => ({ ...NO_RANGE, collapsed: now.collapsed.includes(group) ? now.collapsed.filter((key) => key !== group) : [...now.collapsed, group] }));
  const openRow = (target: SheetRow | undefined) => { if (target?.subtotal) toggleGroup(target.subtotal.group); else if (target) followLink(target.open); };
  const showRowOnMap = (target: SheetRow) => {
    const link = target.open;
    if (link.kind === 'place') { if (link.place.kind === 'city') onShowPlace?.([link.place.id]); }
    else if (link.kind !== 'url') onShowOnMap?.({ kind: link.kind, id: link.id } as NonNullable<Selection>);
  };

  const applySort = (descending: boolean, target = col) => update(() => ({ sort: [{ column: columns[target]!.id, descending }], ...NO_RANGE }));
  const setColumnFilter = (target: number, filter: ColumnFilter | undefined) => {
    const id = columns[target]!.id;
    update((current) => {
      const { [id]: _, ...rest } = current.filters;
      return { filters: filter ? { ...rest, [id]: filter } : rest, active: { ...current.active, row: Math.min(current.active.row, 0) }, ...NO_RANGE };
    });
    scrollTop();
  };
  const showAll = () => update(() => ({ filters: {}, ...NO_RANGE }));
  const setSearch = (value: string) => {
    update((current) => ({ search: value, active: { ...current.active, row: Math.min(current.active.row, 0) }, ...NO_RANGE }));
    scrollTop();
  };
  const toggleAutoFilter = () => {
    setAutoFilter((on) => !on);
    setStates((current) => Object.fromEntries(Object.entries(current).map(([id, sheetState]): [string, SheetState] => [id, { ...sheetState, filters: {} }])) as Record<SheetId, SheetState>);
    setDropdown(null);
  };
  const switchSheet = (id: SheetId) => { showTab(id); setSheetId(id); setPivotOpen(false); closePopups(); };
  const openPivot = (options?: PivotOptions) => { showTab('pivot'); if (options) setPivot(options); setPivotOpen(true); closePopups(); };
  const hideTab = (id: TabId) => {
    const index = tabIds.indexOf(id);
    const next = tabIds[index + 1] ?? tabIds[index - 1];
    if (!next) return;
    if (index === tabIndex) { if (next === 'pivot') openPivot(); else switchSheet(next); }
    setHiddenTabs((tabs) => [...tabs, id]);
  };
  const goToTab = (index: number) => { const id = tabIds[index]; if (id === 'pivot') openPivot(); else if (id) switchSheet(id); };
  /** Clicking a PivotTable count: open its source sheet filtered to those records. */
  const drill = (source: SheetId, drillFilters: ListFilters) => {
    switchSheet(source);
    updateSheet(source, (current) => ({
      filters: pivot.useFilters ? { ...current.filters, ...drillFilters } : drillFilters,
      search: pivot.useFilters ? current.search : '', active: { row: 0, col: current.active.col }, ...NO_RANGE, hiddenRows: [], collapsed: [],
    }));
    scrollTop();
  };
  const copy = (text = activeText) => { void navigator.clipboard?.writeText(text).catch(() => {}); };
  /** An entity's link in pasted cells: its shareable view of this map. */
  const linkHref = (link: CellLink) => link.kind === 'url' ? link.href : link.kind === 'place' ? undefined
    : `${location.origin}${location.pathname}${sharedViewHash({ selection: { kind: link.kind, id: link.id } as Selection, filters: {} as never }, Infinity)}`;
  /** Copy the selection as formatted cells (links, bold field names) and as tab-separated text, field names first when it covers row 1. */
  const copySelection = () => {
    const block = copyBlock(rects);
    if (!block) { setDialog({ kind: 'message', text: 'That command cannot be used on multiple selections that don’t line up. Select areas in the same rows or the same columns, and try again.' }); return; }
    if (!multi && !activeText) return;
    const header = block.rows[0]! < 0, rows = block.rows.flatMap((r) => r < 0 ? [] : [shown[r]!]), cols = block.columns.map((p) => shownCols[p]!);
    const text = multi ? rangeTsv(sheet, rows, cols, header) : activeText;
    const plain = () => copy(text);
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      const html = rangeHtml(rows, cols, sheet, header, linkHref);
      try {
        navigator.clipboard.write([new ClipboardItem({
          'text/plain': new Blob([text], { type: 'text/plain' }), 'text/html': new Blob([html], { type: 'text/html' }),
        })]).catch(plain);
      } catch { plain(); }
    } else plain();
    setCopied({ sheetId, shown, columns: columnKey, rects });
  };
  const openChart = () => setChart({ column: columns[col]!.id, type: 'bar', top: 10, sort: 'count', decades: !!columns[col]!.year });
  /** File ▸ Save As CSV… asks for a file name first (the .csv extension is fixed). */
  const saveCsv = () => setDialog({ kind: 'save' });
  /** File ▸ Save As Excel Workbook…: every sheet as it's listed now, in one .xlsx. */
  const writeXlsx = async (name: string) => {
    const files = xlsxFiles(SHEETS.map((target) => {
      const now = states[target.id], listed = listRows(target, now);
      const left = new Set(listed.shown.map((r) => r.key));
      const ids = now.order ?? target.columns.map((column) => column.id);
      const cols = ids.filter((id) => !now.hidden.includes(id)).map((id) => columnIndex(target, id));
      return {
        sheet: target, rows: listed.lines.map((r) => ({ row: r, hidden: !left.has(r.key) })), columns: cols,
        widths: cols.map((c) => now.widths[target.columns[c]!.id] ?? target.columns[c]!.width), freeze: now.freeze, formats: now.formats,
        tabColor: tabColors[target.id], greyEnded, gridlines, outline: !!now.subtotals, href: linkHref,
      };
    }));
    download(name, await zip(files), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  };
  const writeCsv = (name: string) => download(name, `﻿${sheetCsv(sheet, shown, shownCols)}`, 'text/csv;charset=utf-8');

  /* ---------- columns: resize, AutoFit, hide ---------- */
  const setWidth = (target: number, width: number | undefined) => update((current) => {
    const { [columns[target]!.id]: _, ...rest } = current.widths;
    if (width === undefined) return { widths: rest };
    const size = Math.max(MIN_COLUMN_WIDTH, Math.round(width));
    return { widths: { ...current.widths, ...Object.fromEntries(columnsFor(target).map((c) => [columns[c]!.id, size])) } };
  });
  /** Double-click a column border (or Format ▸ AutoFit): fit the column to its widest entry. */
  const autoFit = (target: number) => update((current) => ({ widths: { ...current.widths,
    ...Object.fromEntries(columnsFor(target).map((c) => [columns[c]!.id, autoFitWidth(sheet, c, measureText)])) } }));
  const hideColumn = (target: number) => {
    const ids = columnsFor(target).map((c) => columns[c]!.id);
    if (shownCols.length <= ids.length) return;
    update((current) => ({ hidden: [...current.hidden, ...ids], ...NO_RANGE }));
  };
  /** Put columns (given by their positions) before the one at `before`, keeping their own order. */
  const moveColumns = (positions: readonly number[], before: number) => {
    const ids = positions.map((p) => columns[shownCols[p]!]!.id);
    const next = shownCols.slice(before).map((c) => columns[c]!.id).find((id) => !ids.includes(id));
    const rest = order.map((c) => columns[c]!.id).filter((id) => !ids.includes(id));
    const at = next === undefined ? rest.length : rest.indexOf(next);
    update(() => ({ ...NO_RANGE, order: [...rest.slice(0, at), ...ids, ...rest.slice(at)],
      active: { row: -1, col: shownCols[positions[0]!]! }, extent: { row: lastRow, col: shownCols[positions.at(-1)!]! } }));
  };
  const nudgeColumns = (target: number, step: 1 | -1) => {
    const positions = columnsFor(target).map((c) => shownCols.indexOf(c));
    moveColumns(positions, step < 0 ? Math.max(0, positions[0]! - 1) : Math.min(shownCols.length, positions.at(-1)! + 2));
  };
  /* ---------- rows: hide, subtotals; frozen panes ---------- */
  const selectedRows = () => rectsRows(rects).flatMap((r) => r >= 0 && !shown[r]?.subtotal ? [shown[r]!] : []);
  const hideRows = (targets: readonly SheetRow[]) => {
    if (targets.length) update((now) => ({ hiddenRows: [...now.hiddenRows, ...targets.map((r) => r.key)], active: { ...now.active, row: Math.min(now.active.row, shown.length - targets.length - 1) }, ...NO_RANGE }));
  };
  const unhideRows = () => update(() => ({ hiddenRows: [], ...NO_RANGE }));
  const setSubtotals = (subtotals: Subtotals | null) => { update(() => ({ subtotals, collapsed: [], active: { row: 0, col }, ...NO_RANGE })); scrollTop(); };
  /** Outline levels: 1 the grand total, 2 every group's total, 3 every row. */
  const outlineLevel = (level: 1 | 2 | 3) => {
    update(() => ({ ...NO_RANGE, active: { row: 0, col }, collapsed: level === 1 ? [GRAND] : level === 2 ? list.lines.flatMap((r) => r.subtotal && !r.subtotal.grand ? [r.subtotal.group] : []) : [] }));
    scrollTop();
  };
  const freezeHere = () => { update(() => ({ freeze: { rows: Math.max(0, row), cols: position } })); scrollTop(); if (grid.current) grid.current.scrollLeft = 0; };
  const frozen = state.freeze.rows > 0 || state.freeze.cols > 0;

  /* ---------- Go To, Find ---------- */
  /** Select a typed reference; a hidden row or column gives the next one shown. False if it isn't one. */
  const goTo = (text: string): boolean => {
    const parts = parseReference(text);
    if (!parts) return false;
    const rowAt = (n: number) => { if (n <= 1) return -1; const at = shown.findIndex((r) => numbers.get(r.key)! >= n); return at < 0 ? lastRow : at; };
    const colAt = (n: number) => { const next = order.slice(n).find((c) => shownCols.includes(c)); return next ?? shownCols.at(-1)!; };
    if (parts.some((part) => (part.col0 ?? 0) >= order.length)) return false;
    const areas = parts.map((part) => {
      let to = part.row1 === undefined ? lastRow : rowAt(part.row1);
      // The end of a range stops at the last shown row inside it.
      const from = part.row0 === undefined ? -1 : rowAt(part.row0);
      if (part.row1 !== undefined && to > from && to >= 0 && numbers.get(shown[to]!.key)! > part.row1) to--;
      return { from: { row: from, col: part.col0 === undefined ? shownCols[0]! : colAt(part.col0) }, to: { row: Math.max(from, to), col: part.col1 === undefined ? shownCols.at(-1)! : colAt(part.col1) } };
    });
    const last = areas.at(-1)!;
    update(() => ({ areas: areas.slice(0, -1), active: last.from, extent: last.to.row === last.from.row && last.to.col === last.from.col ? null : last.to, cursor: null }));
    reveal(last.from);
    return true;
  };
  const goToOrWarn = (text: string) => { if (!goTo(text)) setDialog({ kind: 'message', text: `“${text}” is not a cell on this sheet. Try D200, A1:C50 or B:D.` }); };
  const findNext = (options: FindOptions, backwards = false): boolean => {
    findOptions.current = options;
    const height = shown.length + 1, width = shownCols.length, total = height * width;
    const byRows = options.by === 'rows';
    const at = byRows ? (row + 1) * width + position : position * height + row + 1;
    for (let i = 1; i <= total; i++) {
      const n = ((at + (backwards ? -i : i)) % total + total) % total;
      const r = (byRows ? Math.floor(n / width) : n % height) - 1, p = byRows ? n % width : Math.floor(n / height);
      const target = shownCols[p]!;
      if (!findMatches(r < 0 ? columns[target]!.label : cellText(shown[r]!, target), options)) continue;
      setActive({ row: r, col: target });
      reveal({ row: r, col: target });
      return true;
    }
    return false;
  };
  const unhideColumns = () => update(() => ({ hidden: [], ...NO_RANGE }));
  const openDropdown = (target: number, element: HTMLElement) => {
    const anchor = (element.closest('th') ?? element).getBoundingClientRect();
    setActive({ row: -1, col: target });
    setDropdown((current) => current?.col === target ? null : { col: target, anchor });
  };
  const dropdownEntries = useMemo((): ListEntry[] => {
    if (!dropdown) return [];
    const column = columns[dropdown.col]!;
    const { values, blanks } = columnValues(sheet, filterSheet(sheet, searched, filters, column.id), column.id);
    const current = filters[column.id];
    return [
      { key: 'sort-asc', label: '(Sort Ascending)', run: () => applySort(false, dropdown.col) },
      { key: 'sort-desc', label: '(Sort Descending)', run: () => applySort(true, dropdown.col) },
      { key: 'all', label: '(All)', run: () => setColumnFilter(dropdown.col, undefined) },
      ...(column.numeric ? [{ key: 'top', label: '(Top 10...)', run: () => setDialog({ kind: 'top', col: dropdown.col }) }] : []),
      { key: 'custom', label: '(Custom...)', run: () => setDialog({ kind: 'custom', col: dropdown.col }) },
      ...values.map((value) => ({ key: `value:${value}`, label: value, tickable: true, run: () => setColumnFilter(dropdown.col, { kind: 'value', value }) })),
      ...(blanks || current?.kind === 'blanks' || current?.kind === 'nonBlanks' ? [
        { key: 'blanks', label: '(Blanks)', tickable: true, run: () => setColumnFilter(dropdown.col, { kind: 'blanks' }) },
        { key: 'nonBlanks', label: '(NonBlanks)', run: () => setColumnFilter(dropdown.col, { kind: 'nonBlanks' }) },
      ] : []),
    ];
  }, [dropdown, sheet, searched, filters]); // eslint-disable-line react-hooks/exhaustive-deps
  const dropdownSelected = (() => {
    const filter = dropdown && filters[columns[dropdown.col]!.id];
    return !filter ? 'all' : filter.kind === 'values' ? '' : filter.kind === 'value' ? `value:${filter.value}` : filter.kind;
  })();
  const dropdownTicks = (() => {
    const filter = dropdown && filters[columns[dropdown.col]!.id];
    return !filter ? [] : filter.kind === 'values' ? [...filter.values.map((value) => `value:${value}`), ...(filter.blanks ? ['blanks'] : [])]
      : filter.kind === 'value' ? [`value:${filter.value}`] : filter.kind === 'blanks' ? ['blanks'] : [];
  })();
  const applyTicks = (keys: readonly string[]) => {
    if (!dropdown) return;
    const values = keys.flatMap((key) => key.startsWith('value:') ? [key.slice(6)] : []), blanks = keys.includes('blanks');
    setColumnFilter(dropdown.col, !keys.length ? undefined : keys.length > 1 ? { kind: 'values', values, blanks }
      : blanks ? { kind: 'blanks' } : { kind: 'value', value: values[0]! });
  };
  const openCellMenu = (target: SheetRow, index: number, targetCol: number, element: HTMLElement) => {
    setActive({ row: index, col: targetCol });
    const anchor = (element.closest('td') ?? element).getBoundingClientRect();
    setCellMenu((current) => current?.key === target.key && current.col === targetCol ? null : { key: target.key, col: targetCol, anchor });
  };
  const cellMenuLabel = (() => {
    const target = cellMenu && all.find((r) => r.key === cellMenu.key);
    return target ? `${columns[cellMenu.col]!.label} ${sheetId === 'locations' ? 'in' : 'of'} ${target.name}` : '';
  })();
  const cellMenuEntries = useMemo((): ListEntry[] => {
    const entries = cellMenu ? all.find((r) => r.key === cellMenu.key)?.menus[cellMenu.col] ?? [] : [];
    return entries.map((entry, i) => ({ key: `${i}`, label: entry.label, run: () => followLink(entry.link) }));
  }, [cellMenu, all]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    followLink, toggleGroup, openRow, showRowOnMap, applySort, setColumnFilter, showAll, setSearch,
    toggleAutoFilter, switchSheet, openPivot, hideTab, goToTab, drill, copy, linkHref,
    copySelection, openChart, saveCsv, writeXlsx, writeCsv, setWidth, autoFit, hideColumn,
    moveColumns, nudgeColumns, selectedRows, hideRows, unhideRows, setSubtotals, outlineLevel, freezeHere,
    frozen, goTo, goToOrWarn, findNext, unhideColumns, openDropdown, dropdownEntries, dropdownSelected,
    dropdownTicks, applyTicks, openCellMenu, cellMenuLabel, cellMenuEntries,
  };
}
export type Commands = ReturnType<typeof useCommands>;
