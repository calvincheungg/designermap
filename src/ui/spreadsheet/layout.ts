import { LAYOUT_KEY } from './layout-key';
import { readJson } from '../storage';
import { SHEETS, MIN_COLUMN_WIDTH, validFormats, type SheetId, type SortKey, type ListSort, type ListFilters, type Subtotals, type CellFormat } from './data';
import { TAB_COLORS } from './dialogs';
import { DEFAULT_PIVOT, validPivot, type PivotOptions } from './pivot';

/** The Zoom box's presets; the status bar's slider sets any value from ZOOM_MIN to ZOOM_MAX in steps of 5. */
export const ZOOMS = [50, 75, 100, 125, 150, 200] as const;
export const ZOOM_MIN = 25;
export const ZOOM_MAX = 200;
export const clampZoom = (value: number) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round(value / 5) * 5));

/** An active cell: `row` -1 is the field-name row (sheet row 1); otherwise an index into the listed rows. `col` is the column's index in the sheet. */
export interface Cell { row: number; col: number }
/** Each sheet keeps its own sort, filters, search, active cell, column widths and hidden columns while you switch tabs. */
export interface SheetState {
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
export type SavedSheet = Pick<SheetState, 'sort' | 'widths' | 'hidden' | 'order'> & Partial<Pick<SheetState, 'freeze' | 'formats'>>;
export const FIRST_COLUMN = { rows: 0, cols: 1 };
/** A change that moves cells about ends any selection beyond the active cell. */
export const NO_RANGE = { extent: null, areas: [], cursor: null } as const;
export const initialStates = (layout: StoredLayout) => Object.fromEntries(SHEETS.map((sheet): [SheetId, SheetState] => [sheet.id,
  { sort: sheet.defaultSort, filters: {}, search: '', active: { row: 0, col: 0 }, widths: {}, hidden: [], ...NO_RANGE,
    freeze: FIRST_COLUMN, hiddenRows: [], subtotals: null, collapsed: [], formats: {}, ...layout.sheets[sheet.id] }])) as Record<SheetId, SheetState>;

/* ---------- the layout, remembered between visits ---------- */
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
export const DEFAULT_LAYOUT: StoredLayout = { sheet: 'brands', sheets: {}, tabColors: {}, hiddenTabs: [], zoom: 100, gridlines: true, formulaBar: true, autoFilter: true, greyEnded: true, fullScreen: false, pivotOpen: false, pivot: DEFAULT_PIVOT };
/** Read the saved layout, keeping only values that still fit the sheets (a renamed column is dropped, not an error). */
export function readLayout(): StoredLayout {
  const saved = readJson(LAYOUT_KEY) as Record<string, unknown> | null | undefined;
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

