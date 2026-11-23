import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { ContextMenu, type MenuAction } from './context-menu';
import { SaveAsDialog } from './save-as-dialog';
import { ChartWindow, type ChartOptions } from './list-view-chart';
import { DEFAULT_PIVOT, PivotView, validPivot, type PivotOptions } from './list-view-pivot';
import { ConditionalFormatDialog, CustomFilterDialog, DropList, FindDialog, GoToDialog, MessageDialog, SubtotalDialog, TAB_COLORS, TabColorDialog, FunnelIcon, SaveIcon, SortDialog, SortIcon, TopTenDialog, ZoomSlider, type ListEntry } from './list-view-dialogs';
import {
  effectiveSort, findMatches, formatPainter, GRAND, listRows, rangeHtml, validFormats, type CellFormat, type FindOptions, type Subtotals,
  autoFitWidth, cellText, columnIndex, columnLetter, columnValues, filterLabel, filterSheet, getSheet, MIN_COLUMN_WIDTH,
  rangeStats, rangeTsv, sheetCsv, SHEETS, type CellLink, type ColumnFilter, type ListFilters, type ListSort, type Sheet, type SheetId, type SortKey, type SheetRow,
} from './list-view-data';
import { blockEdge, copyBlock, cycle, inRect, inRects, parseReference, rectOf, rectsColumns, rectsRows, type Rect } from './list-view-select';
import { xlsxFiles, zip } from './list-view-xlsx';
import { EntityLink, PlaceLink, type Actions, type Selection } from './panel';
import { sharedViewHash } from './share-link';

export * from './list-view-data';

/**
 * Spreadsheet: an Excel 2000 workbook with one worksheet per kind of record
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
  /** More selected areas, from Ctrl+click and Ctrl+drag. */
  areas: readonly { from: Cell; to: Cell }[];
  /** The active cell while Tab or Enter walks it through the selection; otherwise it is `active`. */
  cursor: Cell | null;
  /** The columns' order, by id, once any has been moved. */
  order?: readonly string[];
  /** Frozen panes: how many listed rows (besides the field names) and shown columns stay put. */
  freeze: { rows: number; cols: number };
  /** Hidden rows' keys; like filters, not remembered. */
  hiddenRows: readonly string[];
  subtotals: Subtotals | null;
  /** Collapsed subtotal groups (and GRAND for outline level 1). */
  collapsed: readonly string[];
  formats: Partial<Record<string, CellFormat>>;
}
type SavedSheet = Pick<SheetState, 'sort' | 'widths' | 'hidden' | 'order'> & Partial<Pick<SheetState, 'freeze' | 'formats'>>;
const FIRST_COLUMN = { rows: 0, cols: 1 };
/** A change that moves cells about ends any selection beyond the active cell. */
const NO_RANGE = { extent: null, areas: [], cursor: null } as const;
const initialStates = (layout: StoredLayout) => Object.fromEntries(SHEETS.map((sheet): [SheetId, SheetState] => [sheet.id,
  { sort: sheet.defaultSort, filters: {}, search: '', active: { row: 0, col: 0 }, widths: {}, hidden: [], ...NO_RANGE,
    freeze: FIRST_COLUMN, hiddenRows: [], subtotals: null, collapsed: [], formats: {}, ...layout.sheets[sheet.id] }])) as Record<SheetId, SheetState>;

/* ---------- the layout, remembered between visits ---------- */
export const LAYOUT_KEY = 'designer-map:list-view';
/** What Spreadsheet remembers in this browser: the sheet, each sheet's sort, columns, frozen panes and formats, the tabs and the view options. Filters, search, hidden rows and subtotals start fresh. */
export type TabId = SheetId | 'pivot';
export interface StoredLayout {
  sheet: SheetId;
  sheets: Partial<Record<SheetId, SavedSheet>>;
  /** Sheet tab colours, and tabs hidden from their right-click menu. */
  tabColors: Partial<Record<TabId, string>>; hiddenTabs: readonly TabId[];
  zoom: number; gridlines: boolean; formulaBar: boolean; autoFilter: boolean; greyEnded: boolean;
  /** View ▸ Full Screen: the window fills the map area. */
  fullScreen: boolean;
  /** The PivotTable tab is open, and its report's layout. */
  pivotOpen: boolean;
  pivot: PivotOptions;
}
const DEFAULT_LAYOUT: StoredLayout = { sheet: 'brands', sheets: {}, tabColors: {}, hiddenTabs: [], zoom: 100, gridlines: true, formulaBar: true, autoFilter: true, greyEnded: true, fullScreen: false, pivotOpen: false, pivot: DEFAULT_PIVOT };
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
    const order = Array.isArray(entry.order) ? [...new Set((entry.order as unknown[]).filter((id): id is string => typeof id === 'string' && ids.has(id)))] : [];
    const freeze = entry.freeze as { rows?: unknown; cols?: unknown } | undefined;
    const size = (value: unknown) => Number.isInteger(value) && (value as number) >= 0 ? value as number : 0;
    const formats = validFormats(sheet, entry.formats);
    sheets[sheet.id] = {
      sort: sort.length ? sort : sheet.defaultSort, widths, hidden: hidden.length < sheet.columns.length ? hidden : [],
      // A column added since goes last.
      ...(order.length ? { order: [...order, ...[...ids].filter((id) => !order.includes(id))] } : {}),
      ...(freeze && typeof freeze === 'object' ? { freeze: { rows: size(freeze.rows), cols: size(freeze.cols) } } : {}),
      ...(Object.keys(formats).length ? { formats } : {}),
    };
  }
  // Freeze Panes used to be one switch for the whole workbook.
  if (saved.freeze === false) for (const sheet of SHEETS) {
    const entry = sheets[sheet.id] ?? { sort: sheet.defaultSort, widths: {}, hidden: [] };
    sheets[sheet.id] = { ...entry, freeze: entry.freeze ?? { rows: 0, cols: 0 } };
  }
  const tabs: readonly TabId[] = [...SHEETS.map((sheet) => sheet.id), 'pivot'];
  const current = SHEETS.some((sheet) => sheet.id === saved.sheet) ? saved.sheet as SheetId : DEFAULT_LAYOUT.sheet;
  const pivotOpen = flag('pivotOpen');
  const hiddenTabs = Array.isArray(saved.hiddenTabs) ? tabs.filter((id) => (saved.hiddenTabs as unknown[]).includes(id) && id !== current && !(id === 'pivot' && pivotOpen)) : [];
  const colors = saved.tabColors && typeof saved.tabColors === 'object' ? saved.tabColors as Record<string, unknown> : {};
  const tabColors = Object.fromEntries(tabs.flatMap((id) => TAB_COLORS.some(([, color]) => color && color === colors[id]) ? [[id, colors[id] as string]] : []));
  return {
    sheet: current, sheets, tabColors, hiddenTabs,
    zoom: typeof saved.zoom === 'number' && Number.isFinite(saved.zoom) && saved.zoom >= ZOOM_MIN && saved.zoom <= ZOOM_MAX ? clampZoom(saved.zoom) : DEFAULT_LAYOUT.zoom,
    fullScreen: flag('fullScreen'), pivotOpen, pivot: validPivot(saved.pivot as Partial<PivotOptions> | undefined), gridlines: flag('gridlines'), formulaBar: flag('formulaBar'), autoFilter: flag('autoFilter'), greyEnded: flag('greyEnded'),
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
type DialogState = { kind: 'custom' | 'top' | 'format'; col: number } | { kind: 'sort' | 'save' | 'saveXlsx' | 'goto' | 'subtotals' }
  | { kind: 'message'; text: string } | { kind: 'tabColor'; tab: TabId } | null;
/** On a Mac, Ctrl+click is a right-click and ⌘ adds to a selection. */
const MAC = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform);
const adds = (event: { ctrlKey: boolean; metaKey: boolean }) => event.metaKey || (event.ctrlKey && !MAC);
const darkColor = (color: string) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16)); return r! * 0.3 + g! * 0.59 + b! * 0.11 < 128; };
/** Excel refuses to freeze or hide everything; panes never take more than this share of the grid. */
const MAX_FROZEN = 0.7;


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
function download(name: string, content: BlobPart, type: string) {
  if (typeof URL.createObjectURL !== 'function') return;
  const url = URL.createObjectURL(new Blob([content], { type }));
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
  const [tabColors, setTabColors] = useState(layout.tabColors);
  const [hiddenTabs, setHiddenTabs] = useState(layout.hiddenTabs);
  /** The copied cells, inside their moving border until Esc or the list changes. */
  const [copied, setCopied] = useState<{ sheetId: SheetId; shown: readonly SheetRow[]; columns: string; rects: readonly Rect[] } | null>(null);
  const [finding, setFinding] = useState(false);
  const findOptions = useRef<FindOptions>({ text: '', matchCase: false, whole: false, by: 'rows' });
  /** What's being typed in the Name Box. */
  const [nameText, setNameText] = useState<string | null>(null);
  /** Where dragged columns would land, as a position among the shown columns. */
  const [dropAt, setDropAt] = useState<number | null>(null);
  const [greyEnded, setGreyEnded] = useState(layout.greyEnded);
  const [zoomPercent, setZoom] = useState<number>(layout.zoom);
  const [pivotOpen, setPivotOpen] = useState(layout.pivotOpen);
  const [pivot, setPivot] = useState<PivotOptions>(layout.pivot);
  /** Insert ▸ Chart…: the chart object over the sheet, if one is open. */
  const [chart, setChart] = useState<ChartOptions | null>(null);
  // Remember the layout (not filters or search) for the next visit.
  useEffect(() => {
    const saved: StoredLayout = {
      sheet: sheetId, zoom: zoomPercent, tabColors, hiddenTabs, gridlines, formulaBar, autoFilter, greyEnded, fullScreen, pivotOpen, pivot,
      sheets: Object.fromEntries(SHEETS.map((sheet) => [sheet.id, { sort: states[sheet.id].sort, widths: states[sheet.id].widths, hidden: states[sheet.id].hidden,
        order: states[sheet.id].order, freeze: states[sheet.id].freeze, formats: states[sheet.id].formats }])),
    };
    try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(saved)); } catch { /* storage unavailable */ }
  }, [sheetId, states, zoomPercent, tabColors, hiddenTabs, gridlines, formulaBar, autoFilter, greyEnded, fullScreen, pivotOpen, pivot]);
  /** The status bar's zoom slider, open above its field. */
  const [zoomSlider, setZoomSlider] = useState<DOMRect | null>(null);
  const [editing, setEditing] = useState(false);
  const [dropdown, setDropdown] = useState<{ col: number; anchor: DOMRect } | null>(null);
  /** An open in-cell list (a location's brands). */
  const [cellMenu, setCellMenu] = useState<{ key: string; col: number; anchor: DOMRect } | null>(null);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [menu, setMenu] = useState<{ name: MenuName; x: number; y: number } | null>(null);
  /** A row's, cell's or column's menu, whose actions are built when drawn, so they see the selection the right-click just made. */
  const [rowMenu, setRowMenu] = useState<{ x: number; y: number; key: string; col?: number } | null>(null);
  const [columnMenu, setColumnMenu] = useState<{ x: number; y: number; col: number } | null>(null);
  const [context, setContext] = useState<{ x: number; y: number; label: string; actions: MenuAction[] } | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const formula = useRef<HTMLInputElement>(null);
  /** The menu an outside press just closed: pressing its own title closes it rather than reopening it. */
  const justClosed = useRef<MenuName | null>(null);
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
  const [viewport, setViewport] = useState({ top: 0, height: 480, width: 0 });

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
  const order = useMemo(() => state.order?.map((id) => columnIndex(sheet, id)) ?? columns.map((_, col) => col), [sheet, columns, state.order]);
  const shownCols = useMemo(() => order.filter((col) => !state.hidden.includes(columns[col]!.id)), [order, columns, state.hidden]);
  const columnKey = shownCols.join();
  const letterOf = (col: number) => columnLetter(order.indexOf(col));
  const lefts = shownCols.reduce<number[]>((list, col, p) => [...list, list[p]! + widths[col]!], [ROW_HEADER_WIDTH]);
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
  const row = cursor?.row ?? anchorRow, col = cursor?.col ?? anchorCol;
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
  /** Classes for a cell: the selection's tint and heavy outer border, and the copied cells' moving border. */
  const ants = copied && copied.sheetId === sheetId && copied.shown === shown && copied.columns === columnKey ? copied.rects : null;
  const rangeClass = (index: number, p: number) => {
    let names = '';
    if (ants?.some((rect) => inRect(rect, index, p))) {
      const edge = (r: number, q: number) => !inRects(ants, r, q);
      const edges = `${edge(index - 1, p) ? ' ants-top' : ''}${edge(index + 1, p) ? ' ants-bottom' : ''}${edge(index, p - 1) ? ' ants-left' : ''}${edge(index, p + 1) ? ' ants-right' : ''}`;
      if (edges) names += ` ants${edges}`;
    }
    if (inRange(index, p)) {
      if (index !== row || p !== position) names += ' in-range';
      if (!inRects(rects, index - 1, p)) names += ' range-top';
      if (!inRects(rects, index + 1, p)) names += ' range-bottom';
      if (!inRects(rects, index, p - 1)) names += ' range-left';
      if (!inRects(rects, index, p + 1)) names += ' range-right';
    }
    if (dropAt === p) names += ' drop-before';
    else if (dropAt === shownCols.length && p === dropAt - 1) names += ' drop-after';
    return names;
  };
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
  const closePopups = () => { setDropdown(null); setCellMenu(null); setDialog(null); setEditing(false); setChart(null); setFinding(false); setNameText(null); };
  /** Opening a hidden sheet (a PivotTable count, say) shows its tab again. */
  const showTab = (id: TabId) => setHiddenTabs((tabs) => tabs.includes(id) ? tabs.filter((tab) => tab !== id) : tabs);
  const switchSheet = (id: SheetId) => { showTab(id); setSheetId(id); setPivotOpen(false); closePopups(); };
  const openPivot = (options?: PivotOptions) => { showTab('pivot'); if (options) setPivot(options); setPivotOpen(true); closePopups(); };
  /** The tabs in order: the data sheets, then the PivotTable. */
  const tabIds: readonly TabId[] = [...SHEETS.map((s) => s.id), 'pivot' as const].filter((id) => !hiddenTabs.includes(id));
  const tabIndex = tabIds.indexOf(pivotOpen ? 'pivot' : sheetId);
  const tabName = (id: TabId) => id === 'pivot' ? 'PivotTable' : getSheet(id).name;
  const hideTab = (id: TabId) => {
    const index = tabIds.indexOf(id);
    const next = tabIds[index + 1] ?? tabIds[index - 1];
    if (!next) return;
    if (index === tabIndex) { if (next === 'pivot') openPivot(); else switchSheet(next); }
    setHiddenTabs((tabs) => [...tabs, id]);
  };
  const goToTab = (index: number) => { const id = tabIds[index]; if (id === 'pivot') openPivot(); else if (id) switchSheet(id); };
  /** A sheet's rows for the PivotTable: all of them, or the ones its sort, search and filters list. */
  const rowsFor = useCallback((source: SheetId, useFilters: boolean): readonly SheetRow[] => {
    const target: Sheet = getSheet(source);
    if (!useFilters) return target.rows();
    return listRows(target, states[source]).visible;
  }, [states]);
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
  const columnActions = (target: number): MenuAction[] => {
    const several = columnsFor(target).length, at = columnsFor(target).map((c) => shownCols.indexOf(c));
    return [
    ...(fullColumns.includes(shownCols.indexOf(target)) ? [{ label: several > 1 ? 'Copy Columns' : 'Copy Column', run: copySelection }] : []),
    { label: 'Sort Ascending', separator: fullColumns.includes(shownCols.indexOf(target)), run: () => applySort(false, target) },
    { label: 'Sort Descending', run: () => applySort(true, target) },
    { label: several > 1 ? `AutoFit ${several} Columns` : 'AutoFit Column', separator: true, run: () => autoFit(target) },
    { label: several > 1 ? `Hide ${several} Columns` : 'Hide Column', disabled: shownCols.length <= several, run: () => hideColumn(target) },
    { label: 'Unhide Columns', disabled: !state.hidden.length, run: unhideColumns },
    { label: 'Move Left', separator: true, disabled: at[0] === 0, run: () => nudgeColumns(target, -1) },
    { label: 'Move Right', disabled: at.at(-1) === shownCols.length - 1, run: () => nudgeColumns(target, 1) },
    { label: 'Conditional Formatting…', separator: true, run: () => setDialog({ kind: 'format', col: target }) },
    ...(filters[columns[target]!.id] ? [{ label: `Clear Filter from ${columns[target]!.label}`, separator: true, run: () => setColumnFilter(target, undefined) }] : []),
    ];
  };
  const canMap = (target: SheetRow) => !target.subtotal && target.open.kind !== 'url' && (target.open.kind !== 'place' || target.open.place.kind === 'city')
    && !!(target.open.kind === 'place' ? onShowPlace : onShowOnMap);
  const rowActions = (target: SheetRow, index: number): MenuAction[] => {
    const rows = isFullRow(index) ? selectedRows() : target.subtotal ? [] : [target];
    return [
      target.subtotal ? { label: state.collapsed.includes(target.subtotal.group) ? 'Show Detail' : 'Hide Detail', primary: true, run: () => openRow(target) }
        : { label: `Open ${target.name}`, primary: true, run: () => openRow(target) },
      { label: 'Show on Map', disabled: !canMap(target), run: () => showRowOnMap(target) },
      { label: rows.length > 1 ? 'Copy Rows' : 'Copy Row', separator: true, run: copySelection },
      { label: rows.length > 1 ? `Hide ${rows.length} Rows` : 'Hide Row', separator: true, disabled: !rows.length, run: () => hideRows(rows) },
      { label: 'Unhide Rows', disabled: !state.hiddenRows.length, run: unhideRows },
    ];
  };
  const tabActions = (id: TabId): MenuAction[] => [
    { label: 'Hide', disabled: tabIds.length <= 1, run: () => hideTab(id) },
    ...hiddenTabs.map((hidden) => ({ label: `Unhide ${tabName(hidden)}`, run: () => showTab(hidden) })),
    { label: 'Tab Color…', separator: true, run: () => setDialog({ kind: 'tabColor', tab: id }) },
    { label: 'Save As CSV…', separator: true, disabled: id === 'pivot', run: saveCsv },
    { label: 'Select All', disabled: id === 'pivot', run: () => { selectAll(); grid.current?.focus(); } },
  ];
  const cellActions = (target: SheetRow, targetCol: number): MenuAction[] => {
    if (target.subtotal) return rowActions(target, shown.indexOf(target)).map((action) => action.label.startsWith('Copy') ? { ...action, label: 'Copy' } : action);
    const values = target.cells[targetCol]!, column = columns[targetCol]!;
    return [
      { label: `Open ${target.name}`, primary: true, run: () => openRow(target) },
      { label: 'Show on Map', disabled: !canMap(target), run: () => showRowOnMap(target) },
      ...(inRange(shown.indexOf(target), shownCols.indexOf(targetCol)) ? [{ label: rects.length > 1 ? 'Copy Selection' : `Copy ${current.r1 - current.r0 + 1} × ${current.p1 - current.p0 + 1} Cells`, separator: true, run: copySelection }]
        : [{ label: 'Copy', separator: true, disabled: !values.length, run: copySelection }]),
      ...(values.length ? values.slice(0, 6).map((value, i) => ({ label: `Filter by "${value}"`, separator: i === 0,
        run: () => setColumnFilter(targetCol, { kind: 'value', value }) }))
        : [{ label: 'Filter by (Blanks)', separator: true, run: () => setColumnFilter(targetCol, { kind: 'blanks' }) }]),
      ...(filters[column.id] ? [{ label: `Clear Filter from ${column.label}`, run: () => setColumnFilter(targetCol, undefined) }] : []),
      { label: `Sort ${column.label} Ascending`, separator: true, run: () => applySort(false, targetCol) },
      { label: `Sort ${column.label} Descending`, run: () => applySort(true, targetCol) },
    ];
  };
  const closeRowMenu = useCallback((restoreFocus?: boolean) => { setRowMenu(null); if (restoreFocus) grid.current?.focus(); }, []);
  const closeColumnMenu = useCallback((restoreFocus?: boolean) => { setColumnMenu(null); if (restoreFocus) grid.current?.focus(); }, []);
  const openColumnMenu = (event: ReactMouseEvent, target: number) => {
    event.preventDefault();
    setDropdown(null);
    setColumnMenu({ x: event.clientX, y: event.clientY, col: target });
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
        { label: 'Save As Excel Workbook…', run: () => setDialog({ kind: 'saveXlsx' }) },
        { label: 'Save As CSV…', run: saveCsv },
        { label: 'Close', separator: true, run: onClose },
      ];
      case 'Edit': return [
        { label: multi ? 'Copy Selection' : 'Copy', disabled: !multi && !activeText, run: copySelection },
        { label: 'Select All', run: selectAll },
        { label: 'Find…', shortcut: 'Ctrl+F', separator: true, disabled: pivotOpen, run: () => setFinding(true) },
        { label: 'Go To…', shortcut: 'Ctrl+G', disabled: pivotOpen, run: () => setDialog({ kind: 'goto' }) },
        { label: `Search ${sheet.name}`, run: () => { setFormulaBar(true); window.setTimeout(() => formula.current?.focus()); } },
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
        { label: 'Reset Column Order', disabled: !state.order, run: () => update(() => ({ order: undefined, ...NO_RANGE })) },
        { label: 'Reset Column Widths', disabled: !Object.keys(state.widths).length, run: () => update(() => ({ widths: {} })) },
        { label: 'Hide Rows', separator: true, disabled: !selectedRows().length, run: () => hideRows(selectedRows()) },
        { label: 'Unhide Rows', disabled: !state.hiddenRows.length, run: unhideRows },
        { label: 'Conditional Formatting…', separator: true, run: () => setDialog({ kind: 'format', col }) },
        { label: 'Clear Conditional Formats', disabled: !Object.keys(state.formats).length, run: () => update(() => ({ formats: {} })) },
        { label: 'Grey Out Ended Brands', separator: true, checked: greyEnded, run: () => setGreyEnded((on) => !on) },
      ];
      case 'Data': return [
        { label: 'Sort…', primary: true, run: () => setDialog({ kind: 'sort' }) },
        { label: `Sort Ascending by ${label}`, run: () => applySort(false) },
        { label: `Sort Descending by ${label}`, run: () => applySort(true) },
        { label: 'AutoFilter', checked: autoFilter, separator: true, run: toggleAutoFilter },
        { label: 'Show All', disabled: !filtered, run: showAll },
        { label: 'Subtotals…', separator: true, run: () => setDialog({ kind: 'subtotals' }) },
        { label: 'Remove Subtotals', disabled: !state.subtotals, run: () => setSubtotals(null) },
        { label: 'PivotTable Report…', separator: true, run: () => openPivot(validPivot({ ...pivot, source: sheetId, row: columns[col]!.id })) },
      ];
      case 'Window': {
        const first = state.freeze.rows === 0 && state.freeze.cols === 1;
        return [
          { label: `Freeze Panes at ${reference}`, disabled: row <= 0 && position === 0, run: freezeHere },
          { label: 'Freeze First Column', checked: first, run: () => update(() => ({ freeze: first ? { rows: 0, cols: 0 } : FIRST_COLUMN })) },
          { label: 'Unfreeze Panes', disabled: !frozen, run: () => update(() => ({ freeze: { rows: 0, cols: 0 } })) },
        ];
      }
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

  const start = Math.max(frozenRows, Math.floor(viewport.top / rowHeight) - OVERSCAN);
  const end = Math.max(start, Math.min(shown.length, Math.ceil((viewport.top + viewport.height) / rowHeight) + OVERSCAN));
  /** Press a cell: make it active, or with Shift extend the range to it; dragging on extends the range. */
  const pick = (target: Cell) => (event: ReactMouseEvent) => {
    if (event.button !== 0 || (MAC && event.ctrlKey)) return;
    if (event.shiftKey) setExtent(target);
    else if (adds(event)) addArea(target);
    else setActive(target);
    startDrag(event, 'cells');
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
  const stats = useMemo(() => {
    if (!multi) return null;
    const rows = rectsRows(rects).filter((r) => r >= 0), cols = rectsColumns(rects);
    return rangeStats(sheet, rows.map((r) => shown[r]!), cols.map((p) => shownCols[p]!), rects.length > 1 ? (r, c) => inRects(rects, rows[r]!, cols[c]!) : undefined);
  }, [multi, rects, sheet, shown, shownCols]);
  const painters = useMemo(() => new Map(Object.entries(state.formats).flatMap(([id, format]) => {
    const target = columnIndex(sheet, id);
    return format && target >= 0 ? [[target, { paint: formatPainter(sheet, target, format), format }] as const] : [];
  })), [sheet, state.formats]);
  const autoCalculate = stats ? [`Count=${stats.count.toLocaleString()}`, ...(stats.numbers ? [`Sum=${statNumber(stats.sum!)}`, `Average=${statNumber(stats.average!)}`,
    `Min=${statNumber(stats.min!)}`, `Max=${statNumber(stats.max!)}`] : [])].join('  ') : '';
  const status = narrowed ? `${visible.length.toLocaleString()} of ${all.length.toLocaleString()} records found` : 'Ready';
  const sortLabels = effectiveSort(sort, state.subtotals).flatMap((key) => columns[columnIndex(sheet, key.column)] ? [`${columns[columnIndex(sheet, key.column)]!.label}${key.descending ? ' ↓' : ' ↑'}`] : []);
  const summary = [
    ...(search.trim() ? [`Search: "${search.trim()}"`] : []),
    ...columns.filter((column) => filters[column.id]).map((column) => `${column.label}: ${filterLabel(filters[column.id]!)}`),
  ].join(' · ');
  // While typing (or while a search is set) the formula bar holds the search; otherwise it shows the active cell.
  const searching = editing || search !== '';
  const frozenClass = (p: number) => p < frozenCols ? ` xl-frozen${p === frozenCols - 1 ? ' xl-frozen-edge' : ''}` : '';
  const frozenLeft = (p: number) => p < frozenCols ? { left: lefts[p]! } : undefined;
  const gapClass = (target: number) => { const before = order[order.indexOf(target) - 1]; return before !== undefined && state.hidden.includes(columns[before]!.id) ? ' after-hidden' : ''; };
  const hiddenRowKeys = new Set(state.subtotals ? [] : state.hiddenRows);
  const afterHiddenRow = (target: SheetRow) => hiddenRowKeys.size > 0 && hiddenRowKeys.has(list.sorted[numbers.get(target.key)! - 3]?.key ?? '');
  const renderRow = (index: number) => {
    const target = shown[index]!, pinned = index < frozenRows;
    // Frozen rows stick below the two header rows (unzoomed px: the table itself is zoomed).
    const top = pinned ? ROW_HEIGHT * (2 + index) : undefined;
    const pinClass = pinned ? ` xl-pinned${index === frozenRows - 1 ? ' xl-pinned-edge' : ''}` : '';
    const rowGap = afterHiddenRow(target) ? ' after-hidden-row' : '';
    return <tr key={target.key} className={target.subtotal ? 'xl-subtotal' : target.ended ? 'ended' : undefined} onDoubleClick={() => openRow(target)}>
      <th scope="row" className={`xl-row-number${narrowed ? ' filtered' : ''}${index === row || (multi && rects.some((rect) => index >= rect.r0 && index <= rect.r1)) ? ' current' : ''}${pinClass}${rowGap}`} style={{ top }}
        onPointerDown={(event) => { if (event.button === 0 && !(MAC && event.ctrlKey)) { selectRow(index, event.shiftKey, adds(event)); startDrag(event, 'rows'); } }}
        onContextMenu={(event) => { if (!isFullRow(index)) selectRow(index); setContext(null); setRowMenu({ x: event.clientX, y: event.clientY, key: target.key }); event.preventDefault(); }}
        onPointerEnter={dragTo({ row: index, col: shownCols[0]! })}>
        {target.subtotal && <button type="button" className="xl-outline" tabIndex={-1} aria-expanded={!state.collapsed.includes(target.subtotal.group)}
          aria-label={`${state.collapsed.includes(target.subtotal.group) ? 'Show' : 'Hide'} detail of ${target.name}`}
          onPointerDown={(event) => event.stopPropagation()} onDoubleClick={(event) => event.stopPropagation()}
          onClick={() => toggleGroup(target.subtotal!.group)}>{state.collapsed.includes(target.subtotal.group) ? '+' : '−'}</button>}
        {numbers.get(target.key)}</th>
      {shownCols.map((c, p) => {
        const column = columns[c]!;
        const text = cellText(target, c);
        const hasMenu = !!target.menus[c]?.length;
        const selected = rangeClass(index, p);
        const painter = target.subtotal ? undefined : painters.get(c), painted = painter?.paint(target);
        const color = painter && 'color' in painter.format ? painter.format.color : undefined;
        return <td key={column.id} data-cell={`${index}:${c}`}
          className={`${column.numeric ? 'numeric' : ''}${hasMenu ? ' has-menu' : ''}${index === row && c === col ? ' active' : ''}${selected}${frozenClass(p)}${pinClass}${gapClass(c)}${rowGap}`}
          style={{ top, ...frozenLeft(p),
            ...(painted?.fill && !selected.includes('in-range') ? { backgroundColor: painted.fill } : {}),
            // A data bar shares the cell with its number; the copied border and selection tint take its place while they show.
            ...(painted?.bar !== undefined && !selected.includes('ants') ? { backgroundImage: `linear-gradient(90deg, ${color}, ${color})`, backgroundSize: `${painted.bar * 100}% 100%`, backgroundRepeat: 'no-repeat' } : {}) }}
          title={measureText(text, false) + 8 > widths[c]! ? text : undefined}
          onPointerDown={pick({ row: index, col: c })} onPointerEnter={dragTo({ row: index, col: c })}
          onContextMenu={(event) => {
            event.preventDefault();
            if (!inRange(index, p)) setActive({ row: index, col: c });
            setContext(null);
            setRowMenu({ x: event.clientX, y: event.clientY, key: target.key, col: c });
          }}>
          <CellContent row={target} col={c} onSelect={onSelect} onOpenPlace={onOpenPlace} />
          {hasMenu && <button type="button" tabIndex={-1}
            className={`xl-cell-dropdown${cellMenu?.key === target.key && cellMenu.col === c ? ' xl-dropdown-open' : ''}`}
            aria-label={`${target.name} ${column.label.toLowerCase()} (${target.menus[c]!.length})`} aria-haspopup="listbox"
            onPointerDown={(event) => event.stopPropagation()} onDoubleClick={(event) => event.stopPropagation()}
            onClick={(event) => openCellMenu(target, index, c, event.currentTarget)} />}
        </td>;
      })}
    </tr>;
  };

  return <div className="xl">
    <div className="xl-menubar" role="menubar" aria-label="Spreadsheet menu">
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
      <input className="xl-name-box" aria-label="Name Box" title="Type a cell or range to go to it" spellCheck={false} value={nameText ?? reference}
        onFocus={(event) => { setNameText(reference); event.currentTarget.select(); }} onBlur={() => setNameText(null)}
        onChange={(event) => setNameText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') { event.preventDefault(); grid.current?.focus(); goToOrWarn(event.currentTarget.value); }
          else if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); grid.current?.focus(); }
        }} />
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
    <div ref={grid} hidden={pivotOpen} className={`xl-grid${moving.current?.started ? ' moving-columns' : ''}${gridlines ? '' : ' no-gridlines'}${greyEnded ? ' grey-ended' : ''}${multi ? ' has-range' : ''}`} tabIndex={0} role="region" aria-label={`${sheet.name} worksheet`}
      onKeyDown={onKeyDown} onScroll={(event) => { const top = event.currentTarget.scrollTop; setViewport((current) => current.top === top ? current : { ...current, top }); }}>
      <table className="xl-sheet" style={{ width: sheetWidth, zoom }} aria-label={sheet.name} aria-rowcount={all.length + 1}
        // The sheet has its own selection: no browser text selection or link dragging, and focus stays on the grid so Ctrl+C copies the cells.
        onMouseDown={(event) => { if (event.button === 0) event.preventDefault(); }}
        onClickCapture={(event) => {
          if (suppressClick.current && event.detail > 0) { event.preventDefault(); event.stopPropagation(); }
          suppressClick.current = false;
        }}>
        <colgroup><col style={{ width: ROW_HEADER_WIDTH }} />{shownCols.map((target) => <col key={columns[target]!.id} style={{ width: widths[target] }} />)}</colgroup>
        <thead>
          <tr className="xl-letters">
            <th className="xl-corner" title="Select All" onPointerDown={(event) => { if (event.button === 0) { selectAll(); grid.current?.focus({ preventScroll: true }); } }}>
              {state.subtotals && <span className="xl-levels">{([1, 2, 3] as const).map((level) => <button type="button" key={level} tabIndex={-1} aria-label={`Outline level ${level}`}
                title={['Grand total only', 'Group totals', 'All rows'][level - 1]} onPointerDown={(event) => event.stopPropagation()} onClick={() => outlineLevel(level)}>{level}</button>)}</span>}
            </th>
            {shownCols.map((target, p) => {
              const column = columns[target]!;
              const lit = target === col || (multi && rects.some((rect) => p >= rect.p0 && p <= rect.p1));
              return <th key={column.id} style={frozenLeft(p)}
                className={`${lit ? 'current' : ''}${fullColumns.includes(p) ? ' movable' : ''}${dropAt === p ? ' drop-before' : dropAt === shownCols.length && p === dropAt - 1 ? ' drop-after' : ''}${frozenClass(p)}${gapClass(target)}`}
                onPointerDown={(event) => { 
                  if (event.button !== 0 || (MAC && event.ctrlKey)) return;
                  if (fullColumns.includes(p) && fullColumns.length < shownCols.length && !event.shiftKey && !adds(event) && event.pointerType !== 'touch') {
                    // A selected column's letter drags the selected columns to a new place; a plain click selects just that one.
                    moving.current = { target, x: event.clientX, from: event.clientX, started: false };
                    grid.current?.focus({ preventScroll: true });
                    return;
                  }
                  selectColumn(target, event.shiftKey, adds(event));
                  startDrag(event, 'columns');
                }}
                onPointerEnter={dragTo({ row: -1, col: target })}
                onContextMenu={(event) => { if (!fullColumns.includes(p)) selectColumn(target); openColumnMenu(event, target); }}>
                <span aria-hidden="true">{letterOf(target)}</span>
                <span className="xl-col-resize" role="separator" aria-orientation="vertical" aria-label={`Resize ${column.label} column`}
                  aria-valuenow={widths[target]} title="Drag to resize · double-click to AutoFit" tabIndex={-1}
                  onPointerDown={resizeStart(target)} onPointerMove={resizeMove} onPointerUp={resizeEnd} onPointerCancel={resizeEnd}
                  onDoubleClick={(event) => { event.stopPropagation(); autoFit(target); }} />
              </th>;
            })}
          </tr>
          <tr className="xl-fields">
            <th className={`xl-row-number${row < 0 || (multi && rects.some((rect) => rect.r0 < 0)) ? ' current' : ''}`} scope="row">1</th>
            {shownCols.map((target, p) => {
              const column = columns[target]!;
              const filter = filters[column.id];
              const primary = sort[0]?.column === column.id ? sort[0] : undefined;
              return <th key={column.id} scope="col" data-field={target} style={frozenLeft(p)}
                className={`${row < 0 && col === target ? 'active' : ''}${rangeClass(-1, p)}${frozenClass(p)}${gapClass(target)}`}
                aria-sort={primary ? primary.descending ? 'descending' : 'ascending' : undefined} onPointerDown={pick({ row: -1, col: target })} onPointerEnter={dragTo({ row: -1, col: target })}
                onContextMenu={(event) => openColumnMenu(event, target)}>
                <span className="xl-field-label">{column.label}</span>
                {autoFilter && <button type="button" className={`xl-filter-button${filter ? ' filtered' : ''}${dropdown?.col === target ? ' open xl-dropdown-open' : ''}`} tabIndex={-1}
                  aria-label={`Filter ${column.label}${filter ? ` (${filterLabel(filter)})` : ''}`} title={filter ? filterLabel(filter) : undefined}
                  onPointerDown={(event) => event.stopPropagation()} onClick={(event) => openDropdown(target, event.currentTarget)} />}
              </th>;
            })}
          </tr>
        </thead>
        <tbody>
          {shown.slice(0, frozenRows).map((_, index) => renderRow(index))}
          {start > frozenRows && <tr aria-hidden="true" style={{ height: (start - frozenRows) * ROW_HEIGHT }}><td colSpan={shownCols.length + 1} /></tr>}
          {shown.slice(start, end).map((_, i) => renderRow(start + i))}
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
        {tabIds.map((id) => {
          const on = id === (pivotOpen ? 'pivot' : sheetId), color = tabColors[id];
          const show = () => { if (id === 'pivot') openPivot(); else switchSheet(id); };
          return <button type="button" role="tab" key={id} aria-selected={on} className={`xl-tab${on ? ' active' : ''}${color ? ' coloured' : ''}`}
            // The open tab is white with its colour underlined, the others are filled with it, as in Excel.
            style={!color ? undefined : on ? { boxShadow: `inset 0 -3px ${color}` } : { background: color, color: darkColor(color) ? '#fff' : '#000' }}
            onClick={show} onContextMenu={(event) => { if (!on) show(); openContext(event, `${tabName(id)} tab`, tabActions(id)); }}>{tabName(id)}</button>;
        })}
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
    {chart && !pivotOpen && <ChartWindow sheet={sheet} rows={visible} options={chart} onOptions={setChart}
      onFilter={(target, filter) => setColumnFilter(target, filter)} onClose={() => setChart(null)} />}
    {zoomSlider && <ZoomSlider anchor={zoomSlider} value={zoomPercent} min={ZOOM_MIN} max={ZOOM_MAX} presets={ZOOMS}
      onChange={(value) => setZoom(clampZoom(value))} onClose={() => setZoomSlider(null)} />}
    {cellMenu && <DropList anchor={cellMenu.anchor} entries={cellMenuEntries} selected="" label={cellMenuLabel}
      onPick={closeCellMenu} onClose={closeCellMenu} />}
    {dropdown && <DropList anchor={dropdown.anchor} entries={dropdownEntries} selected={dropdownSelected} ticked={dropdownTicks} onTicks={applyTicks}
      onPick={closeDropdown} onClose={closeDropdown} />}
    {dialog?.kind === 'custom' && <CustomFilterDialog column={columns[dialog.col]!} initial={filters[columns[dialog.col]!.id]}
      suggestions={columnValues(sheet, filterSheet(sheet, searched, filters, columns[dialog.col]!.id), columns[dialog.col]!.id).values}
      onApply={(filter) => { setColumnFilter(dialog.col, filter); setDialog(null); grid.current?.focus(); }}
      onCancel={() => { setDialog(null); grid.current?.focus(); }} />}
    {dialog?.kind === 'top' && <TopTenDialog column={columns[dialog.col]!} initial={filters[columns[dialog.col]!.id]}
      onApply={(filter) => { setColumnFilter(dialog.col, filter); setDialog(null); grid.current?.focus(); }}
      onCancel={() => { setDialog(null); grid.current?.focus(); }} />}
    {dialog?.kind === 'save' && <SaveAsDialog defaultName={`Designer Map - ${sheet.name}`} extension="csv" typeLabel="CSV (Comma delimited) (*.csv)"
      onSave={(name) => { writeCsv(name); setDialog(null); grid.current?.focus(); }}
      onCancel={() => { setDialog(null); grid.current?.focus(); }} />}
    {dialog?.kind === 'saveXlsx' && <SaveAsDialog defaultName="Designer Map" extension="xlsx" typeLabel="Microsoft Excel Workbook (*.xlsx)"
      onSave={(name) => { void writeXlsx(name); setDialog(null); grid.current?.focus(); }}
      onCancel={() => { setDialog(null); grid.current?.focus(); }} />}
    {dialog?.kind === 'message' && <MessageDialog text={dialog.text} onClose={() => { setDialog(null); grid.current?.focus(); }} />}
    {dialog?.kind === 'goto' && <GoToDialog onGo={(text) => { setDialog(null); grid.current?.focus(); goToOrWarn(text); }}
      onCancel={() => { setDialog(null); grid.current?.focus(); }} />}
    {dialog?.kind === 'subtotals' && <SubtotalDialog columns={order.map((c) => columns[c]!)}
      initial={state.subtotals ?? { by: columns[col]!.id, fn: 'count', columns: [columns.find((column) => column.id !== columns[col]!.id)!.id] }}
      onApply={(subtotals) => { setSubtotals(subtotals); setDialog(null); grid.current?.focus(); }}
      onRemove={state.subtotals ? () => { setSubtotals(null); setDialog(null); grid.current?.focus(); } : undefined}
      onCancel={() => { setDialog(null); grid.current?.focus(); }} />}
    {dialog?.kind === 'format' && <ConditionalFormatDialog column={columns[dialog.col]!} initial={state.formats[columns[dialog.col]!.id]}
      onApply={(format) => {
        const { [columns[dialog.col]!.id]: _, ...rest } = state.formats;
        update(() => ({ formats: format ? { ...rest, [columns[dialog.col]!.id]: format } : rest }));
        setDialog(null);
        grid.current?.focus();
      }} onCancel={() => { setDialog(null); grid.current?.focus(); }} />}
    {dialog?.kind === 'tabColor' && <TabColorDialog name={tabName(dialog.tab)} initial={tabColors[dialog.tab] ?? ''}
      onApply={(color) => { const { [dialog.tab]: _, ...rest } = tabColors; setTabColors(color ? { ...rest, [dialog.tab]: color } : rest); setDialog(null); }}
      onCancel={() => setDialog(null)} />}
    {finding && !pivotOpen && <FindDialog initial={findOptions.current} onFind={findNext} onClose={() => { setFinding(false); grid.current?.focus(); }} />}
    {rowMenu && (() => {
      const index = shown.findIndex((target) => target.key === rowMenu.key), target = shown[index];
      return target && <ContextMenu x={rowMenu.x} y={rowMenu.y} label={rowMenu.col === undefined ? 'Row menu' : 'Cell menu'}
        actions={rowMenu.col === undefined ? rowActions(target, index) : cellActions(target, rowMenu.col)} onClose={closeRowMenu} />;
    })()}
    {columnMenu && <ContextMenu x={columnMenu.x} y={columnMenu.y} label={`${columns[columnMenu.col]!.label} column`} actions={columnActions(columnMenu.col)} onClose={closeColumnMenu} />}
    {dialog?.kind === 'sort' && <SortDialog columns={columns} sort={sort}
      onApply={(next) => { update(() => ({ sort: next.length ? next : sheet.defaultSort, ...NO_RANGE })); setDialog(null); grid.current?.focus(); }}
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
