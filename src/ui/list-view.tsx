import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { ContextMenu, type MenuAction } from './context-menu';
import { ChartWindow, type ChartOptions } from './list-view-chart';
import { DEFAULT_PIVOT, PivotView, validPivot, type PivotOptions } from './list-view-pivot';
import { CustomFilterDialog, DropList, FunnelIcon, SaveIcon, SortDialog, SortIcon, TopTenDialog, ZoomSlider, type ListEntry } from './list-view-dialogs';
import {
  autoFitWidth, cellText, columnIndex, columnLetter, columnValues, filterLabel, filterSheet, getSheet, MIN_COLUMN_WIDTH,
  rangeStats, rangeTsv, searchSheet, sheetCsv, SHEETS, sortSheet, type CellLink, type ColumnFilter, type ListFilters, type ListSort, type Sheet, type SheetId, type SortKey, type SheetRow,
} from './list-view-data';
import { EntityLink, PlaceLink, type Actions, type Selection } from './panel';

export * from './list-view-data';

/**
 * List View: an Excel 2000 workbook with one worksheet per kind of record
 * (Brands, Groups, Designers, Careers, Collaborations, Locations): lettered
 * columns, numbered rows, a Name box, a formula bar that doubles as the sheet's
 * search box, AutoFilter drop-downs, Data ▸ Sort…, a frozen first column, zoom,
 * hideable and AutoFit columns and CSV export. Everything belongs to the
 * workbook alone; the map, Properties and the other windows never see it, and
 * every record is listed whatever the map shows.
 */

/* ---------- layout ---------- */
const ROW_HEIGHT = 17;
const ROW_HEADER_WIDTH = 40;
/** Rows drawn above and below the visible ones. */
const OVERSCAN = 12;
/** The Zoom box's presets; the status bar's slider sets any value from ZOOM_MIN to ZOOM_MAX in steps of 5. */
export const ZOOMS = [50, 75, 100, 125, 150, 200] as const;
export const ZOOM_MIN = 25;
export const ZOOM_MAX = 200;
export const clampZoom = (value: number) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round(value / 5) * 5));

/* Double-click AutoFit measures text with a canvas in Arial 13px, the cells' font (an estimate where there is no canvas, as in tests). */
let context: CanvasRenderingContext2D | null | undefined;
const measured = new Map<string, number>();
function measureText(text: string, bold: boolean): number {
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

/** An active cell: `row` -1 is the field-name row (sheet row 1); otherwise an index into the listed rows. `col` is the column's index in the sheet. */
interface Cell { row: number; col: number }
/** Each sheet keeps its own sort, filters, search, active cell, column widths and hidden columns while you switch tabs. */
interface SheetState {
  sort: ListSort; filters: ListFilters; search: string; active: Cell; widths: Partial<Record<string, number>>; hidden: readonly string[];
  /** The selected range's far corner (shift-click, drag, Shift+arrows); the range runs from `active` to it. */
  extent: Cell | null;
}
const initialStates = (layout: StoredLayout) => Object.fromEntries(SHEETS.map((sheet): [SheetId, SheetState] => [sheet.id,
  { sort: sheet.defaultSort, filters: {}, search: '', active: { row: 0, col: 0 }, widths: {}, hidden: [], extent: null, ...layout.sheets[sheet.id] }])) as Record<SheetId, SheetState>;

/* ---------- the layout, remembered between visits ---------- */
export const LAYOUT_KEY = 'designer-map:list-view';
/** What List View remembers in this browser: the sheet, each sheet's sort, widths and hidden columns, and the view options. Filters and search start fresh. */
export interface StoredLayout {
  sheet: SheetId;
  sheets: Partial<Record<SheetId, Pick<SheetState, 'sort' | 'widths' | 'hidden'>>>;
  zoom: number; freeze: boolean; gridlines: boolean; formulaBar: boolean; autoFilter: boolean; greyEnded: boolean;
  /** View ▸ Full Screen: the window fills the map area. */
  fullScreen: boolean;
  /** The PivotTable tab is open, and its report's layout. */
  pivotOpen: boolean;
  pivot: PivotOptions;
}
const DEFAULT_LAYOUT: StoredLayout = { sheet: 'brands', sheets: {}, zoom: 100, freeze: true, gridlines: true, formulaBar: true, autoFilter: true, greyEnded: true, fullScreen: false, pivotOpen: false, pivot: DEFAULT_PIVOT };
/** Read the saved layout, keeping only values that still fit the sheets (a renamed column is dropped, not an error). */
export function readLayout(): StoredLayout {
  let saved: Record<string, unknown> | null = null;
  try { saved = JSON.parse(localStorage.getItem(LAYOUT_KEY) ?? 'null'); } catch { /* storage unavailable or corrupt */ }
  if (!saved || typeof saved !== 'object') return DEFAULT_LAYOUT;
  const flag = (key: keyof StoredLayout) => typeof saved[key] === 'boolean' ? saved[key] as boolean : DEFAULT_LAYOUT[key] as boolean;
  const sheets: StoredLayout['sheets'] = {};
  const stored = saved.sheets && typeof saved.sheets === 'object' ? saved.sheets as Record<string, Record<string, unknown>> : {};
  for (const sheet of SHEETS) {
    const entry = stored[sheet.id];
    if (!entry || typeof entry !== 'object') continue;
    const ids = new Set(sheet.columns.map((column) => column.id));
    const sort = Array.isArray(entry.sort) ? (entry.sort as unknown[]).flatMap((key) => key && typeof key === 'object'
      && ids.has((key as SortKey).column) ? [{ column: (key as SortKey).column, descending: !!(key as SortKey).descending }] : []).slice(0, 3) : [];
    const widths = Object.fromEntries(Object.entries(entry.widths && typeof entry.widths === 'object' ? entry.widths : {})
      .filter(([id, width]) => ids.has(id) && typeof width === 'number' && Number.isFinite(width))
      .map(([id, width]) => [id, Math.max(MIN_COLUMN_WIDTH, Math.round(width as number))]));
    const hidden = Array.isArray(entry.hidden) ? (entry.hidden as unknown[]).filter((id): id is string => typeof id === 'string' && ids.has(id)) : [];
    sheets[sheet.id] = { sort: sort.length ? sort : sheet.defaultSort, widths, hidden: hidden.length < sheet.columns.length ? hidden : [] };
  }
  return {
    sheet: SHEETS.some((sheet) => sheet.id === saved.sheet) ? saved.sheet as SheetId : DEFAULT_LAYOUT.sheet, sheets,
    zoom: typeof saved.zoom === 'number' && Number.isFinite(saved.zoom) && saved.zoom >= ZOOM_MIN && saved.zoom <= ZOOM_MAX ? clampZoom(saved.zoom) : DEFAULT_LAYOUT.zoom,
    fullScreen: flag('fullScreen'), pivotOpen: flag('pivotOpen'), pivot: validPivot(saved.pivot as Partial<PivotOptions> | undefined), freeze: flag('freeze'), gridlines: flag('gridlines'), formulaBar: flag('formulaBar'), autoFilter: flag('autoFilter'), greyEnded: flag('greyEnded'),
  };
}

type MenuName = 'File' | 'Edit' | 'View' | 'Insert' | 'Format' | 'Data' | 'Window' | 'Help';
const MENUS: readonly MenuName[] = ['File', 'Edit', 'View', 'Insert', 'Format', 'Data', 'Window', 'Help'];
/** Toolbar Chart Wizard: three columns of a bar chart. */
function ChartIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
    <path d="M1.5 1v13.5H15" fill="none" stroke="#000" />
    <rect x="3.5" y="7.5" width="3" height="6" fill="#9999ff" stroke="#000" />
    <rect x="7.5" y="3.5" width="3" height="10" fill="#993366" stroke="#000" />
    <rect x="11.5" y="9.5" width="3" height="4" fill="#ffffcc" stroke="#000" />
  </svg>;
}
/** AutoCalculate numbers, at most two decimals, like Excel's status bar. */
/** Years stay as 1990, not 1,990. */
const statNumber = (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 2, useGrouping: Math.abs(value) >= 10000 });
type DialogState = { kind: 'custom' | 'top'; col: number } | { kind: 'sort' } | null;

function CellContent({ row, col, onSelect, onOpenPlace }: { row: SheetRow; col: number; onSelect: Actions['onSelect']; onOpenPlace: NonNullable<Actions['onOpenPlace']> }) {
  const values = row.cells[col]!, links = row.links[col];
  if (!links) return <>{values.join(', ')}</>;
  return <>{values.map((value, i) => {
    const link = links[i];
    const content = !link ? value
      : link.kind === 'url' ? <a href={link.href} target="_blank" rel="noreferrer">{value}</a>
      : link.kind === 'place' ? <PlaceLink place={link.place} onOpenPlace={onOpenPlace}>{value}</PlaceLink>
      : <EntityLink kind={link.kind} id={link.id} onSelect={onSelect}>{value}</EntityLink>;
    return <span key={i}>{i > 0 && ', '}{content}</span>;
  })}</>;
}

/** Download text as a file, like File ▸ Save As. */
function download(name: string, text: string, type: string) {
  if (typeof URL.createObjectURL !== 'function') return;
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ListViewContent({ onSelect, onOpenPlace, onShowOnMap, onShowPlace, onHelp, onClose, fullScreen = false, onFullScreen }: {
  onSelect: Actions['onSelect']; onOpenPlace: NonNullable<Actions['onOpenPlace']>;
  /** Right-click ▸ Show on Map: select and reveal on the map without opening Properties. */
  onShowOnMap?: (selection: NonNullable<Selection>) => void;
  onShowPlace?: (cities: readonly string[]) => void;
  onHelp: () => void; onClose: () => void;
  /** View ▸ Full Screen: whether the window fills the map area (the window itself is owned by App). */
  fullScreen?: boolean; onFullScreen?: (on: boolean) => void;
}) {
  const [layout] = useState(readLayout);
  const [sheetId, setSheetId] = useState<SheetId>(layout.sheet);
  const [states, setStates] = useState(() => initialStates(layout));
  const [autoFilter, setAutoFilter] = useState(layout.autoFilter);
  const [gridlines, setGridlines] = useState(layout.gridlines);
  const [formulaBar, setFormulaBar] = useState(layout.formulaBar);
  const [freeze, setFreeze] = useState(layout.freeze);
  const [greyEnded, setGreyEnded] = useState(layout.greyEnded);
  const [zoomPercent, setZoom] = useState<number>(layout.zoom);
  const [pivotOpen, setPivotOpen] = useState(layout.pivotOpen);
  const [pivot, setPivot] = useState<PivotOptions>(layout.pivot);
  /** Insert ▸ Chart…: the chart object over the sheet, if one is open. */
  const [chart, setChart] = useState<ChartOptions | null>(null);
  // Remember the layout (not filters or search) for the next visit.
  useEffect(() => {
    const saved: StoredLayout = {
      sheet: sheetId, zoom: zoomPercent, freeze, gridlines, formulaBar, autoFilter, greyEnded, fullScreen, pivotOpen, pivot,
      sheets: Object.fromEntries(SHEETS.map((sheet) => [sheet.id, { sort: states[sheet.id].sort, widths: states[sheet.id].widths, hidden: states[sheet.id].hidden }])),
    };
    try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(saved)); } catch { /* storage unavailable */ }
  }, [sheetId, states, zoomPercent, freeze, gridlines, formulaBar, autoFilter, greyEnded, fullScreen, pivotOpen, pivot]);
  /** The status bar's zoom slider, open above its field. */
  const [zoomSlider, setZoomSlider] = useState<DOMRect | null>(null);
  const [editing, setEditing] = useState(false);
  const [dropdown, setDropdown] = useState<{ col: number; anchor: DOMRect } | null>(null);
  /** An open in-cell list (a location's brands). */
  const [cellMenu, setCellMenu] = useState<{ key: string; col: number; anchor: DOMRect } | null>(null);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [menu, setMenu] = useState<{ name: MenuName; x: number; y: number } | null>(null);
  const [context, setContext] = useState<{ x: number; y: number; label: string; actions: MenuAction[] } | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const formula = useRef<HTMLInputElement>(null);
  /** The menu an outside press just closed: pressing its own title closes it rather than reopening it. */
  const justClosed = useRef<MenuName | null>(null);
  /** A range being dragged out with the mouse. */
  const dragging = useRef(false);
  useEffect(() => {
    const stop = () => { dragging.current = false; };
    window.addEventListener('pointerup', stop);
    return () => window.removeEventListener('pointerup', stop);
  }, []);
  /** A column border being dragged. */
  const resizing = useRef<{ col: number; x: number; width: number } | null>(null);
  const [viewport, setViewport] = useState({ top: 0, height: 480 });

  const sheet = getSheet(sheetId);
  const state = states[sheetId];
  const { sort, filters, search } = state;
  const updateSheet = useCallback((id: SheetId, change: (current: SheetState) => Partial<SheetState>) =>
    setStates((current) => ({ ...current, [id]: { ...current[id], ...change(current[id]) } })), []);
  const update = useCallback((change: (current: SheetState) => Partial<SheetState>) => updateSheet(sheetId, change), [sheetId, updateSheet]);
  const columns = sheet.columns;
  const zoom = zoomPercent / 100;
  const rowHeight = ROW_HEIGHT * zoom, headerHeight = rowHeight * 2;

  // Widths: each column's default, or the width the user dragged or AutoFit it to.
  const widths = columns.map((column) => state.widths[column.id] ?? column.width);
  // Shown columns keep their letters, so a hidden column leaves a gap (A, B, D…), as in Excel.
  const shownCols = columns.flatMap((column, col) => state.hidden.includes(column.id) ? [] : [col]);
  const lefts = shownCols.reduce<number[]>((list, col, p) => [...list, list[p]! + widths[col]!], [ROW_HEADER_WIDTH]);
  const sheetWidth = lefts[shownCols.length]!;
  const frozenCol = freeze ? shownCols[0] : undefined;

  const all = sheet.rows();
  // Sheet row numbers follow the sort, so a filter or search leaves gaps in them, as in Excel.
  const sorted = useMemo(() => sortSheet(sheet, all, sort), [sheet, all, sort]);
  const numbers = useMemo(() => new Map(sorted.map((row, i) => [row.key, i + 2])), [sorted]);
  const searched = useMemo(() => searchSheet(sorted, search), [sorted, search]);
  const shown = useMemo(() => filterSheet(sheet, searched, filters), [sheet, searched, filters]);
  const filtered = Object.keys(filters).length > 0;
  const narrowed = filtered || search.trim() !== '';
  const row = Math.min(state.active.row, shown.length - 1);
  const col = shownCols.includes(state.active.col) ? state.active.col : shownCols[0]!;
  const cell: Cell = { row, col };
  const position = shownCols.indexOf(col);
  const activeRow = row >= 0 ? shown[row] : undefined;
  const activeText = row < 0 ? columns[col]!.label : activeRow ? cellText(activeRow, col) : '';
  const reference = `${columnLetter(col)}${row < 0 ? 1 : activeRow ? numbers.get(activeRow.key) : 1}`;
  /** Move the active cell; a plain move ends any range selection. */
  const setActive = (active: Cell | ((current: Cell) => Cell)) => update((current) => ({ active: typeof active === 'function' ? active(current.active) : active, extent: null }));
  const setExtent = (extent: Cell | null) => update(() => ({ extent }));

  // The selected range: from the active cell to `extent`, over listed rows and shown columns.
  const extent = state.extent && state.extent.row < shown.length && shownCols.includes(state.extent.col) ? state.extent : null;
  const extentPosition = extent ? shownCols.indexOf(extent.col) : position;
  const rowSpan = [Math.min(row, extent?.row ?? row), Math.max(row, extent?.row ?? row)] as const;
  const positionSpan = [Math.min(position, extentPosition), Math.max(position, extentPosition)] as const;
  const multi = !!extent && (rowSpan[0] !== rowSpan[1] || positionSpan[0] !== positionSpan[1]);
  const inRange = (index: number, target: number) => {
    if (!multi || index < rowSpan[0] || index > rowSpan[1]) return false;
    const p = shownCols.indexOf(target);
    return p >= positionSpan[0] && p <= positionSpan[1];
  };
  const rangeCols = shownCols.slice(positionSpan[0], positionSpan[1] + 1);
  const rangeRows = shown.slice(Math.max(0, rowSpan[0]), rowSpan[1] + 1);
  const selectAll = () => update(() => ({ active: { row: -1, col: shownCols[0]! }, extent: { row: Math.max(-1, shown.length - 1), col: shownCols.at(-1)! } }));
  /** Click a column letter: select the whole column (shift extends across columns). */
  const selectColumn = (target: number, extend: boolean) => update((current) => extend
    ? { active: { ...current.active, row: -1 }, extent: { row: Math.max(-1, shown.length - 1), col: target } }
    : { active: { row: -1, col: target }, extent: { row: Math.max(-1, shown.length - 1), col: target } });
  /** Click a row number: select the whole row (shift extends across rows). */
  const selectRow = (index: number, extend: boolean) => update((current) => extend
    ? { active: { ...current.active, col: shownCols[0]! }, extent: { row: index, col: shownCols.at(-1)! } }
    : { active: { row: index, col: shownCols[0]! }, extent: { row: index, col: shownCols.at(-1)! } });

  useLayoutEffect(() => {
    const element = grid.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => setViewport((current) => ({ ...current, height: element.clientHeight || current.height })));
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
    if (target.row >= 0) {
      const top = headerHeight + target.row * rowHeight;
      const view = element.clientHeight || viewport.height;
      if (top < element.scrollTop + headerHeight) element.scrollTop = top - headerHeight;
      else if (top + rowHeight > element.scrollTop + view) element.scrollTop = top + rowHeight - view;
    }
    const p = shownCols.indexOf(target.col);
    if (p < 0 || target.col === frozenCol) return;
    const left = lefts[p]! * zoom, right = lefts[p + 1]! * zoom;
    const fixed = (ROW_HEADER_WIDTH + (frozenCol !== undefined ? widths[frozenCol]! : 0)) * zoom;
    const width = element.clientWidth;
    if (left < element.scrollLeft + fixed) element.scrollLeft = left - fixed;
    else if (width && right > element.scrollLeft + width) element.scrollLeft = right - width;
  };
  const moveTo = (targetRow: number, targetPosition: number) => {
    const next = { row: Math.max(-1, Math.min(shown.length - 1, targetRow)), col: shownCols[Math.max(0, Math.min(shownCols.length - 1, targetPosition))]! };
    setActive(next);
    reveal(next);
  };
  const followLink = (link: CellLink) => {
    if (link.kind === 'place') onOpenPlace(link.place);
    else if (link.kind === 'url') window.open(link.href, '_blank', 'noreferrer');
    else onSelect({ kind: link.kind, id: link.id } as Selection, true);
  };
  const openRow = (target: SheetRow | undefined) => { if (target) followLink(target.open); };
  const showRowOnMap = (target: SheetRow) => {
    const link = target.open;
    if (link.kind === 'place') { if (link.place.kind === 'city') onShowPlace?.([link.place.id]); }
    else if (link.kind !== 'url') onShowOnMap?.({ kind: link.kind, id: link.id } as NonNullable<Selection>);
  };

  const applySort = (descending: boolean, target = col) => update(() => ({ sort: [{ column: columns[target]!.id, descending }], extent: null }));
  const setColumnFilter = (target: number, filter: ColumnFilter | undefined) => {
    const id = columns[target]!.id;
    update((current) => {
      const { [id]: _, ...rest } = current.filters;
      return { filters: filter ? { ...rest, [id]: filter } : rest, active: { ...current.active, row: Math.min(current.active.row, 0) }, extent: null };
    });
    scrollTop();
  };
  const showAll = () => update(() => ({ filters: {}, extent: null }));
  const setSearch = (value: string) => {
    update((current) => ({ search: value, active: { ...current.active, row: Math.min(current.active.row, 0) }, extent: null }));
    scrollTop();
  };
  const toggleAutoFilter = () => {
    setAutoFilter((on) => !on);
    setStates((current) => Object.fromEntries(Object.entries(current).map(([id, sheetState]): [string, SheetState] => [id, { ...sheetState, filters: {} }])) as Record<SheetId, SheetState>);
    setDropdown(null);
  };
  const closePopups = () => { setDropdown(null); setCellMenu(null); setDialog(null); setEditing(false); setChart(null); };
  const switchSheet = (id: SheetId) => { setSheetId(id); setPivotOpen(false); closePopups(); };
  const openPivot = (options?: PivotOptions) => { if (options) setPivot(options); setPivotOpen(true); closePopups(); };
  /** The tabs in order: the data sheets, then the PivotTable. */
  const tabIds: readonly (SheetId | 'pivot')[] = [...SHEETS.map((s) => s.id), 'pivot'];
  const tabIndex = pivotOpen ? tabIds.length - 1 : SHEETS.indexOf(sheet);
  const goToTab = (index: number) => { const id = tabIds[index]; if (id === 'pivot') openPivot(); else if (id) switchSheet(id); };
  /** A sheet's rows for the PivotTable: all of them, or the ones its sort, search and filters list. */
  const rowsFor = useCallback((source: SheetId, useFilters: boolean): readonly SheetRow[] => {
    const target: Sheet = getSheet(source);
    if (!useFilters) return target.rows();
    const sheetState = states[source];
    return filterSheet(target, searchSheet(sortSheet(target, target.rows(), sheetState.sort), sheetState.search), sheetState.filters);
  }, [states]);
  /** Clicking a PivotTable count: open its source sheet filtered to those records. */
  const drill = (source: SheetId, drillFilters: ListFilters) => {
    switchSheet(source);
    updateSheet(source, (current) => ({
      filters: pivot.useFilters ? { ...current.filters, ...drillFilters } : drillFilters,
      search: pivot.useFilters ? current.search : '', active: { row: 0, col: current.active.col }, extent: null,
    }));
    scrollTop();
  };
  const copy = (text = activeText) => { void navigator.clipboard?.writeText(text).catch(() => {}); };
  /** Copy the range as tab-separated text (field names first when the range covers row 1), or the active cell. */
  const copySelection = () => copy(multi ? rangeTsv(sheet, rangeRows, rangeCols, rowSpan[0] < 0) : activeText);
  const openChart = () => setChart({ column: columns[col]!.id, type: 'bar', top: 10, sort: 'count', decades: !!columns[col]!.year });
  const saveCsv = () => download(`Designer Map - ${sheet.name}.csv`, `﻿${sheetCsv(sheet, shown, shownCols)}`, 'text/csv;charset=utf-8');

  /* ---------- columns: resize, AutoFit, hide ---------- */
  const setWidth = (target: number, width: number | undefined) => update((current) => {
    const { [columns[target]!.id]: _, ...rest } = current.widths;
    return { widths: width === undefined ? rest : { ...rest, [columns[target]!.id]: Math.max(MIN_COLUMN_WIDTH, Math.round(width)) } };
  });
  /** Double-click a column border (or Format ▸ AutoFit): fit the column to its widest entry. */
  const autoFit = (target: number) => setWidth(target, autoFitWidth(sheet, target, measureText));
  const hideColumn = (target: number) => {
    if (shownCols.length <= 1) return;
    update((current) => ({ hidden: [...current.hidden, columns[target]!.id], extent: null }));
  };
  const unhideColumns = () => update(() => ({ hidden: [] }));
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

  /* ---------- drop-downs ---------- */
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
      ...values.map((value) => ({ key: `value:${value}`, label: value, run: () => setColumnFilter(dropdown.col, { kind: 'value', value }) })),
      ...(blanks || current?.kind === 'blanks' || current?.kind === 'nonBlanks' ? [
        { key: 'blanks', label: '(Blanks)', run: () => setColumnFilter(dropdown.col, { kind: 'blanks' }) },
        { key: 'nonBlanks', label: '(NonBlanks)', run: () => setColumnFilter(dropdown.col, { kind: 'nonBlanks' }) },
      ] : []),
    ];
  }, [dropdown, sheet, searched, filters]); // eslint-disable-line react-hooks/exhaustive-deps
  const dropdownSelected = (() => {
    const filter = dropdown && filters[columns[dropdown.col]!.id];
    return !filter ? 'all' : filter.kind === 'value' ? `value:${filter.value}` : filter.kind;
  })();
  const closeDropdown = useCallback(() => setDropdown(null), []);
  const closeCellMenu = useCallback(() => setCellMenu(null), []);
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

  /* ---------- menus ---------- */
  const columnActions = (target: number): MenuAction[] => [
    { label: 'Sort Ascending', run: () => applySort(false, target) },
    { label: 'Sort Descending', run: () => applySort(true, target) },
    { label: 'AutoFit Column', separator: true, run: () => autoFit(target) },
    { label: 'Hide Column', disabled: shownCols.length <= 1, run: () => hideColumn(target) },
    { label: 'Unhide Columns', disabled: !state.hidden.length, run: unhideColumns },
    ...(filters[columns[target]!.id] ? [{ label: `Clear Filter from ${columns[target]!.label}`, separator: true, run: () => setColumnFilter(target, undefined) }] : []),
  ];
  const cellActions = (target: SheetRow, targetCol: number): MenuAction[] => {
    const values = target.cells[targetCol]!, column = columns[targetCol]!;
    const mappable = target.open.kind !== 'url' && (target.open.kind !== 'place' || target.open.place.kind === 'city');
    return [
      { label: `Open ${target.name}`, primary: true, run: () => openRow(target) },
      { label: 'Show on Map', disabled: !mappable || !(target.open.kind === 'place' ? onShowPlace : onShowOnMap), run: () => showRowOnMap(target) },
      ...(inRange(shown.indexOf(target), targetCol) ? [{ label: `Copy ${rangeRows.length} × ${rangeCols.length} Cells`, separator: true, run: copySelection }]
        : [{ label: 'Copy', separator: true, disabled: !values.length, run: () => copy(cellText(target, targetCol)) }]),
      ...(values.length ? values.slice(0, 6).map((value, i) => ({ label: `Filter by "${value}"`, separator: i === 0,
        run: () => setColumnFilter(targetCol, { kind: 'value', value }) }))
        : [{ label: 'Filter by (Blanks)', separator: true, run: () => setColumnFilter(targetCol, { kind: 'blanks' }) }]),
      ...(filters[column.id] ? [{ label: `Clear Filter from ${column.label}`, run: () => setColumnFilter(targetCol, undefined) }] : []),
      { label: `Sort ${column.label} Ascending`, separator: true, run: () => applySort(false, targetCol) },
      { label: `Sort ${column.label} Descending`, run: () => applySort(true, targetCol) },
    ];
  };
  const openContext = (event: ReactMouseEvent, label: string, actions: MenuAction[]) => {
    event.preventDefault();
    setDropdown(null);
    setContext({ x: event.clientX, y: event.clientY, label, actions });
  };

  const menuActions = (name: MenuName): MenuAction[] => {
    const label = columns[col]!.label;
    switch (name) {
      case 'File': return [
        { label: 'Save As CSV…', run: saveCsv },
        { label: 'Close', separator: true, run: onClose },
      ];
      case 'Edit': return [
        { label: multi ? 'Copy Selection' : 'Copy', disabled: !multi && !activeText, run: copySelection },
        { label: 'Select All', run: selectAll },
        { label: 'Find…', separator: true, run: () => { setFormulaBar(true); window.setTimeout(() => formula.current?.focus()); } },
      ];
      case 'View': return [
        { label: 'Formula Bar', checked: formulaBar, run: () => setFormulaBar((on) => !on) },
        { label: 'Gridlines', checked: gridlines, run: () => setGridlines((on) => !on) },
        ...(onFullScreen ? [{ label: 'Full Screen', separator: true, checked: fullScreen, run: () => onFullScreen(!fullScreen) }] : []),
        ...ZOOMS.map((value, i) => ({ label: `Zoom ${value}%`, separator: i === 0, checked: zoomPercent === value, run: () => setZoom(value) })),
      ];
      case 'Insert': return [{ label: 'Chart…', run: openChart }];
      case 'Format': return [
        { label: `AutoFit Column (${label})`, run: () => autoFit(col) },
        { label: `Hide Column (${label})`, disabled: shownCols.length <= 1, run: () => hideColumn(col) },
        { label: 'Unhide Columns', disabled: !state.hidden.length, run: unhideColumns },
        { label: 'Reset Column Widths', disabled: !Object.keys(state.widths).length, run: () => update(() => ({ widths: {} })) },
        { label: 'Grey Out Ended Brands', separator: true, checked: greyEnded, run: () => setGreyEnded((on) => !on) },
      ];
      case 'Data': return [
        { label: 'Sort…', primary: true, run: () => setDialog({ kind: 'sort' }) },
        { label: `Sort Ascending by ${label}`, run: () => applySort(false) },
        { label: `Sort Descending by ${label}`, run: () => applySort(true) },
        { label: 'AutoFilter', checked: autoFilter, separator: true, run: toggleAutoFilter },
        { label: 'Show All', disabled: !filtered, run: showAll },
        { label: 'PivotTable Report…', separator: true, run: () => openPivot(validPivot({ ...pivot, source: sheetId, row: columns[col]!.id })) },
      ];
      case 'Window': return [{ label: 'Freeze Panes', checked: freeze, run: () => setFreeze((on) => !on) }];
      case 'Help': return [{ label: 'Designer Map Help', run: onHelp }];
    }
  };
  const openMenu = (name: MenuName) => (event: ReactMouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (justClosed.current === name) { justClosed.current = null; return; }
    setMenu((current) => current?.name === name ? null : { name, x: rect.left, y: rect.bottom });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    const page = Math.max(1, Math.floor((viewport.height - headerHeight) / rowHeight) - 1);
    const ctrl = event.ctrlKey || event.metaKey;
    const last = shownCols.length - 1;
    const movesFrom = (r: number, p: number): Record<string, [number, number]> => ({
      ArrowUp: [ctrl ? -1 : r - 1, p], ArrowDown: [ctrl ? shown.length - 1 : r + 1, p],
      ArrowLeft: [r, ctrl ? 0 : p - 1], ArrowRight: [r, ctrl ? last : p + 1],
      PageUp: [r - page, p], PageDown: [r + page, p],
      Home: [ctrl ? -1 : r, 0], End: [ctrl ? shown.length - 1 : r, ctrl ? last : p],
      Tab: [r, p + (event.shiftKey ? -1 : 1)],
    });
    const moves = movesFrom(row, position);
    if (ctrl && (event.key === 'PageDown' || event.key === 'PageUp')) {
      // Ctrl+Page Down / Page Up: the next or previous sheet, as in Excel.
      event.preventDefault();
      goToTab(tabIndex + (event.key === 'PageDown' ? 1 : -1));
    } else if (ctrl && event.key.toLowerCase() === 'a') { event.preventDefault(); selectAll(); }
    else if (event.shiftKey && event.key !== 'Tab' && movesFrom(0, 0)[event.key]) {
      // Shift+arrows grow or shrink the range from its far corner; the active cell stays put.
      event.preventDefault();
      const [r, p] = movesFrom(extent?.row ?? row, extentPosition)[event.key]!;
      const next = { row: Math.max(-1, Math.min(shown.length - 1, r)), col: shownCols[Math.max(0, Math.min(last, p))]! };
      setExtent(next);
      reveal(next);
    } else if (ctrl && event.key.toLowerCase() === 'f') { event.preventDefault(); formula.current?.focus(); }
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
      setContext({ x: rect?.left ?? 0, y: rect?.bottom ?? 0, label: 'Cell menu', actions: cellActions(activeRow, col) });
    }
  };

  const start = Math.max(0, Math.floor(viewport.top / rowHeight) - OVERSCAN);
  const end = Math.min(shown.length, Math.ceil((viewport.top + viewport.height) / rowHeight) + OVERSCAN);
  /** Press a cell: make it active, or with Shift extend the range to it; dragging on extends the range. */
  const pick = (target: Cell) => (event: ReactMouseEvent) => {
    if (event.button !== 0) return;
    if (event.shiftKey) { event.preventDefault(); setExtent(target); }
    else { setActive(target); dragging.current = true; }
    grid.current?.focus({ preventScroll: true });
  };
  const dragTo = (target: Cell) => (event: ReactPointerEvent) => { if (dragging.current && event.buttons & 1) setExtent(target); };
  const stats = multi ? rangeStats(sheet, rangeRows, rangeCols) : null;
  const autoCalculate = stats ? [`Count=${stats.count.toLocaleString()}`, ...(stats.numbers ? [`Sum=${statNumber(stats.sum!)}`, `Average=${statNumber(stats.average!)}`,
    `Min=${statNumber(stats.min!)}`, `Max=${statNumber(stats.max!)}`] : [])].join('  ') : '';
  const status = narrowed ? `${shown.length.toLocaleString()} of ${all.length.toLocaleString()} records found` : 'Ready';
  const sortLabels = sort.flatMap((key) => columns[columnIndex(sheet, key.column)] ? [`${columns[columnIndex(sheet, key.column)]!.label}${key.descending ? ' ↓' : ' ↑'}`] : []);
  const summary = [
    ...(search.trim() ? [`Search: "${search.trim()}"`] : []),
    ...columns.filter((column) => filters[column.id]).map((column) => `${column.label}: ${filterLabel(filters[column.id]!)}`),
  ].join(' · ');
  // While typing (or while a search is set) the formula bar holds the search; otherwise it shows the active cell.
  const searching = editing || search !== '';
  const frozenClass = (target: number) => target === frozenCol ? ' xl-frozen' : '';
  const gapClass = (target: number) => target > 0 && state.hidden.includes(columns[target - 1]!.id) ? ' after-hidden' : '';

  return <div className="xl">
    <div className="xl-menubar" role="menubar" aria-label="List View menu">
      {MENUS.map((name) => <button type="button" role="menuitem" key={name} aria-haspopup="menu" aria-expanded={menu?.name === name}
        className={menu?.name === name ? 'open' : undefined} onClick={openMenu(name)}><u>{name[0]}</u>{name.slice(1)}</button>)}
    </div>
    <div className="xl-toolbar" role="toolbar" aria-label="Standard">
      <button type="button" className="xl-tool" title="Save As CSV" aria-label="Save As CSV" onClick={saveCsv}><SaveIcon /></button>
      <span className="xl-tool-separator" />
      <button type="button" className="xl-tool" title={`Sort Ascending (${columns[col]!.label})`} aria-label="Sort Ascending" disabled={pivotOpen} onClick={() => applySort(false)}><SortIcon descending={false} /></button>
      <button type="button" className="xl-tool" title={`Sort Descending (${columns[col]!.label})`} aria-label="Sort Descending" disabled={pivotOpen} onClick={() => applySort(true)}><SortIcon descending /></button>
      <span className="xl-tool-separator" />
      <button type="button" className="xl-tool" title="AutoFilter" aria-label="AutoFilter" aria-pressed={autoFilter} disabled={pivotOpen} onClick={toggleAutoFilter}><FunnelIcon /></button>
      <button type="button" className="xl-tool" title="Show All" aria-label="Show All" disabled={pivotOpen || !filtered} onClick={showAll}><FunnelIcon clear /></button>
      <span className="xl-tool-separator" />
      <button type="button" className="xl-tool" title="Chart Wizard" aria-label="Chart Wizard" aria-pressed={!!chart} disabled={pivotOpen}
        onClick={() => chart ? setChart(null) : openChart()}><ChartIcon /></button>
      <span className="xl-tool-separator" />
      <select className="xl-zoom" aria-label="Zoom" title="Zoom" value={zoomPercent} onChange={(event) => setZoom(Number(event.target.value))}>
        {/* A slider value between the presets shows as its own entry, as Excel's Zoom box does. */}
        {[...new Set([...ZOOMS, zoomPercent])].sort((a, b) => b - a).map((value) => <option key={value} value={value}>{value}%</option>)}
      </select>
      {summary && !pivotOpen && <span className="xl-filter-summary">{summary}</span>}
    </div>
    {pivotOpen && <PivotView options={pivot} onOptions={setPivot} rowsFor={rowsFor} onDrill={drill} zoom={zoom} />}
    {formulaBar && !pivotOpen && <div className="xl-formula-bar">
      <input className="xl-name-box" aria-label="Name Box" readOnly value={reference} />
      {searching ? <>
        <button type="button" className="xl-formula-button cancel" aria-label="Clear search" title="Cancel"
          onPointerDown={(event) => event.preventDefault()} onClick={() => { setSearch(''); setEditing(false); grid.current?.focus(); }}>✕</button>
        <button type="button" className="xl-formula-button enter" aria-label="Go to results" title="Enter"
          onPointerDown={(event) => event.preventDefault()} onClick={() => { setEditing(false); grid.current?.focus(); }}>✓</button>
      </> : <span className="xl-equals" aria-hidden="true">=</span>}
      <input ref={formula} className={`xl-formula${search ? ' searching' : ''}`} aria-label="Formula Bar" type="text"
        placeholder={`Search ${sheet.name}`} title={`Type to search ${sheet.name}`}
        value={searching ? search : activeText} onFocus={() => setEditing(true)}
        onBlur={() => setEditing(false)} onChange={(event) => setSearch(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') { event.preventDefault(); setActive({ row: 0, col }); grid.current?.focus(); }
          else if (event.key === 'Escape') { event.preventDefault(); setSearch(''); grid.current?.focus(); }
        }} />
    </div>}
    <div ref={grid} hidden={pivotOpen} className={`xl-grid${gridlines ? '' : ' no-gridlines'}${greyEnded ? ' grey-ended' : ''}`} tabIndex={0} role="region" aria-label={`${sheet.name} worksheet`}
      onKeyDown={onKeyDown} onScroll={(event) => { const top = event.currentTarget.scrollTop; setViewport((current) => current.top === top ? current : { ...current, top }); }}>
      <table className="xl-sheet" style={{ width: sheetWidth, zoom }} aria-label={sheet.name} aria-rowcount={all.length + 1}>
        <colgroup><col style={{ width: ROW_HEADER_WIDTH }} />{shownCols.map((target) => <col key={columns[target]!.id} style={{ width: widths[target] }} />)}</colgroup>
        <thead>
          <tr className="xl-letters">
            <th className="xl-corner" title="Select All" onPointerDown={(event) => { if (event.button === 0) { selectAll(); grid.current?.focus({ preventScroll: true }); } }} />
            {shownCols.map((target) => {
              const column = columns[target]!;
              const p = shownCols.indexOf(target);
              const current = target === col || (multi && p >= positionSpan[0] && p <= positionSpan[1]);
              return <th key={column.id} className={`${current ? 'current' : ''}${frozenClass(target)}${gapClass(target)}`}
                onPointerDown={(event) => { if (event.button === 0) { selectColumn(target, event.shiftKey); grid.current?.focus({ preventScroll: true }); } }}
                onContextMenu={(event) => openContext(event, `${column.label} column`, columnActions(target))}>
                <span aria-hidden="true">{columnLetter(target)}</span>
                <span className="xl-col-resize" role="separator" aria-orientation="vertical" aria-label={`Resize ${column.label} column`}
                  aria-valuenow={widths[target]} title="Drag to resize · double-click to AutoFit" tabIndex={-1}
                  onPointerDown={resizeStart(target)} onPointerMove={resizeMove} onPointerUp={resizeEnd} onPointerCancel={resizeEnd}
                  onDoubleClick={(event) => { event.stopPropagation(); autoFit(target); }} />
              </th>;
            })}
          </tr>
          <tr className="xl-fields">
            <th className={`xl-row-number${row < 0 || (multi && rowSpan[0] < 0) ? ' current' : ''}`} scope="row">1</th>
            {shownCols.map((target) => {
              const column = columns[target]!;
              const filter = filters[column.id];
              const primary = sort[0]?.column === column.id ? sort[0] : undefined;
              return <th key={column.id} scope="col" data-field={target}
                className={`${row < 0 && col === target ? 'active' : inRange(-1, target) ? 'in-range' : ''}${frozenClass(target)}${gapClass(target)}`}
                aria-sort={primary ? primary.descending ? 'descending' : 'ascending' : undefined} onPointerDown={pick({ row: -1, col: target })}
                onContextMenu={(event) => openContext(event, `${column.label} column`, columnActions(target))}>
                <span className="xl-field-label">{column.label}</span>
                {autoFilter && <button type="button" className={`xl-filter-button${filter ? ' filtered' : ''}${dropdown?.col === target ? ' open xl-dropdown-open' : ''}`} tabIndex={-1}
                  aria-label={`Filter ${column.label}${filter ? ` (${filterLabel(filter)})` : ''}`} title={filter ? filterLabel(filter) : undefined}
                  onPointerDown={(event) => event.stopPropagation()} onClick={(event) => openDropdown(target, event.currentTarget)} />}
              </th>;
            })}
          </tr>
        </thead>
        <tbody>
          {start > 0 && <tr aria-hidden="true" style={{ height: start * ROW_HEIGHT }}><td colSpan={shownCols.length + 1} /></tr>}
          {shown.slice(start, end).map((target, i) => {
            const index = start + i;
            return <tr key={target.key} className={target.ended ? 'ended' : undefined} onDoubleClick={() => openRow(target)}>
              <th scope="row" className={`xl-row-number${narrowed ? ' filtered' : ''}${index === row || (multi && index >= rowSpan[0] && index <= rowSpan[1]) ? ' current' : ''}`}
                onPointerDown={(event) => { if (event.button === 0) { selectRow(index, event.shiftKey); grid.current?.focus({ preventScroll: true }); } }}>{numbers.get(target.key)}</th>
              {shownCols.map((c) => {
                const column = columns[c]!;
                const text = cellText(target, c);
                const hasMenu = !!target.menus[c]?.length;
                return <td key={column.id} data-cell={`${index}:${c}`}
                  className={`${column.numeric ? 'numeric' : ''}${hasMenu ? ' has-menu' : ''}${index === row && c === col ? ' active' : inRange(index, c) ? ' in-range' : ''}${frozenClass(c)}${gapClass(c)}`}
                  title={measureText(text, false) + 8 > widths[c]! ? text : undefined}
                  onPointerDown={pick({ row: index, col: c })} onPointerEnter={dragTo({ row: index, col: c })}
                  onContextMenu={(event) => { if (!inRange(index, c)) setActive({ row: index, col: c }); openContext(event, 'Cell menu', cellActions(target, c)); }}>
                  <CellContent row={target} col={c} onSelect={onSelect} onOpenPlace={onOpenPlace} />
                  {hasMenu && <button type="button" tabIndex={-1}
                    className={`xl-cell-dropdown${cellMenu?.key === target.key && cellMenu.col === c ? ' xl-dropdown-open' : ''}`}
                    aria-label={`${target.name} ${column.label.toLowerCase()} (${target.menus[c]!.length})`} aria-haspopup="listbox"
                    onPointerDown={(event) => event.stopPropagation()} onDoubleClick={(event) => event.stopPropagation()}
                    onClick={(event) => openCellMenu(target, index, c, event.currentTarget)} />}
                </td>;
              })}
            </tr>;
          })}
          {end < shown.length && <tr aria-hidden="true" style={{ height: (shown.length - end) * ROW_HEIGHT }}><td colSpan={shownCols.length + 1} /></tr>}
        </tbody>
      </table>
      {!shown.length && <p className="xl-empty">No rows match. Clear the search, or choose Data ▸ Show All.</p>}
    </div>
    <div className="xl-sheet-tabs">
      <span className="xl-tab-nav">{([['⏮', 'First sheet', 0], ['◀', 'Previous sheet', tabIndex - 1],
        ['▶', 'Next sheet', tabIndex + 1], ['⏭', 'Last sheet', tabIds.length - 1]] as const).map(([glyph, label, index]) =>
        <button type="button" key={label} aria-label={label} title={label} tabIndex={-1} disabled={!tabIds[index] || index === tabIndex}
          onClick={() => goToTab(index)}>{glyph}</button>)}</span>
      <div className="xl-tabs" role="tablist" aria-label="Sheets">
        {SHEETS.map((tab) => <button type="button" role="tab" key={tab.id} aria-selected={!pivotOpen && tab === sheet}
          className={`xl-tab${!pivotOpen && tab === sheet ? ' active' : ''}`} onClick={() => switchSheet(tab.id)}>{tab.name}</button>)}
        <button type="button" role="tab" aria-selected={pivotOpen} className={`xl-tab${pivotOpen ? ' active' : ''}`} onClick={() => openPivot()}>PivotTable</button>
      </div>
    </div>
    <div className="status-bar xl-status">
      <p className="status-bar-field" role="status">{pivotOpen ? 'Ready' : status}</p>
      {autoCalculate && !pivotOpen && <p className="status-bar-field xl-autocalc" aria-label="AutoCalculate">{autoCalculate}</p>}
      <p className="status-bar-field">{pivotOpen ? `PivotTable: Count of ${getSheet(pivot.source).name}` : sortLabels.length ? `Sorted by ${sortLabels.join(', ')}` : 'Unsorted'}</p>
      <p className="status-bar-field xl-num">
        <button type="button" className={`xl-zoom-status${zoomSlider ? ' xl-dropdown-open' : ''}`} aria-label={`Zoom ${zoomPercent}%`} aria-haspopup="dialog"
          title="Click or right-click to zoom" onClick={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setZoomSlider((open) => open ? null : rect); }}
          onContextMenu={(event) => { event.preventDefault(); setZoomSlider(event.currentTarget.getBoundingClientRect()); }}>{zoomPercent}%</button>
      </p>
    </div>
    {chart && !pivotOpen && <ChartWindow sheet={sheet} rows={shown} options={chart} onOptions={setChart}
      onFilter={(target, filter) => setColumnFilter(target, filter)} onClose={() => setChart(null)} />}
    {zoomSlider && <ZoomSlider anchor={zoomSlider} value={zoomPercent} min={ZOOM_MIN} max={ZOOM_MAX} presets={ZOOMS}
      onChange={(value) => setZoom(clampZoom(value))} onClose={() => setZoomSlider(null)} />}
    {cellMenu && <DropList anchor={cellMenu.anchor} entries={cellMenuEntries} selected="" label={cellMenuLabel}
      onPick={closeCellMenu} onClose={closeCellMenu} />}
    {dropdown && <DropList anchor={dropdown.anchor} entries={dropdownEntries} selected={dropdownSelected}
      onPick={closeDropdown} onClose={closeDropdown} />}
    {dialog?.kind === 'custom' && <CustomFilterDialog column={columns[dialog.col]!} initial={filters[columns[dialog.col]!.id]}
      suggestions={columnValues(sheet, filterSheet(sheet, searched, filters, columns[dialog.col]!.id), columns[dialog.col]!.id).values}
      onApply={(filter) => { setColumnFilter(dialog.col, filter); setDialog(null); grid.current?.focus(); }}
      onCancel={() => { setDialog(null); grid.current?.focus(); }} />}
    {dialog?.kind === 'top' && <TopTenDialog column={columns[dialog.col]!} initial={filters[columns[dialog.col]!.id]}
      onApply={(filter) => { setColumnFilter(dialog.col, filter); setDialog(null); grid.current?.focus(); }}
      onCancel={() => { setDialog(null); grid.current?.focus(); }} />}
    {dialog?.kind === 'sort' && <SortDialog columns={columns} sort={sort}
      onApply={(next) => { update(() => ({ sort: next.length ? next : sheet.defaultSort })); setDialog(null); grid.current?.focus(); }}
      onCancel={() => { setDialog(null); grid.current?.focus(); }} />}
    {menu && <ContextMenu x={menu.x} y={menu.y} label={`${menu.name} menu`} actions={menuActions(menu.name)}
      onClose={(restoreFocus) => {
        justClosed.current = restoreFocus ? null : menu.name;
        window.setTimeout(() => { justClosed.current = null; }, 300);
        setMenu(null);
        if (restoreFocus) grid.current?.focus();
      }} />}
    {context && <ContextMenu x={context.x} y={context.y} label={context.label} actions={context.actions}
      onClose={(restoreFocus) => { setContext(null); if (restoreFocus) grid.current?.focus(); }} />}
  </div>;
}
