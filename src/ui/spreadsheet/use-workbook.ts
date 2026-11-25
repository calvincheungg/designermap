import { useCallback, useEffect, useRef, useState } from 'react';
import { type Actions, type Selection } from '../panel';
import { LAYOUT_KEY } from './layout-key';
import { readSessionJson, writeJson, writeSession } from '../storage';
import { SHEETS, getSheet, listRows, type SheetRow, type SheetId, type Sheet } from './data';
import { initialStates, readLayout, type SheetState, type TabId, type StoredLayout } from './layout';
import { type PivotOptions } from './pivot';

export interface WorkbookActions {
  onSelect: Actions['onSelect']; onOpenPlace: NonNullable<Actions['onOpenPlace']>;
  /** Right-click ▸ Show on Map: select and reveal on the map without opening Properties. */
  onShowOnMap?: (selection: NonNullable<Selection>) => void;
  onShowPlace?: (cities: readonly string[]) => void;
  onHelp: () => void; onClose: () => void;
  /** View ▸ Full Screen: whether the window fills the map area (the window itself is owned by App). */
  fullScreen?: boolean; onFullScreen?: (on: boolean) => void;
}

const REFRESH_KEY = 'designer-map:spreadsheet-refresh';
/** The sheets with what a page refresh saved, where it still makes sense. */
function withRefreshed(states: Record<SheetId, SheetState>): Record<SheetId, SheetState> {
  const saved = readSessionJson(REFRESH_KEY) as Partial<Record<SheetId, Partial<SheetState>>> | null | undefined;
  if (!saved || typeof saved !== 'object') return states;
  const object = (value: unknown) => !!value && typeof value === 'object' && !Array.isArray(value);
  return Object.fromEntries(SHEETS.map(({ id, columns }) => {
    const entry = saved[id], state = states[id];
    if (!entry || !object(entry)) return [id, state];
    const { filters, search, hiddenRows, subtotals, collapsed, active } = entry;
    return [id, {
      ...state, ...(object(filters) ? { filters } : {}), ...(typeof search === 'string' ? { search } : {}),
      ...(Array.isArray(hiddenRows) ? { hiddenRows } : {}), ...(Array.isArray(collapsed) ? { collapsed } : {}),
      ...(subtotals && columns.some((column) => column.id === subtotals.by) && Array.isArray(subtotals.columns) ? { subtotals } : {}),
      ...(active && Number.isInteger(active.row) && Number.isInteger(active.col) ? { active } : {}),
    }];
  })) as Record<SheetId, SheetState>;
}

/** The open workbook: every sheet's state, the tabs and the view options, remembered between visits. */
export function useWorkbook(fullScreen: boolean) {
  const [layout] = useState(readLayout);
  const [sheetId, setSheetId] = useState<SheetId>(layout.sheet);
  const [states, setStates] = useState(() => withRefreshed(initialStates(layout)));
  const [autoFilter, setAutoFilter] = useState(layout.autoFilter);
  const [gridlines, setGridlines] = useState(layout.gridlines);
  const [formulaBar, setFormulaBar] = useState(layout.formulaBar);
  const [tabColors, setTabColors] = useState(layout.tabColors);
  const [hiddenTabs, setHiddenTabs] = useState(layout.hiddenTabs);
  const [greyEnded, setGreyEnded] = useState(layout.greyEnded);
  const [zoomPercent, setZoom] = useState<number>(layout.zoom);
  const [pivotOpen, setPivotOpen] = useState(layout.pivotOpen);
  const [pivot, setPivot] = useState<PivotOptions>(layout.pivot);
  // Remember the layout (not filters or search) for the next visit.
  useEffect(() => {
    const saved: StoredLayout = {
      sheet: sheetId, zoom: zoomPercent, tabColors, hiddenTabs, gridlines, formulaBar, autoFilter, greyEnded, fullScreen, pivotOpen, pivot,
      sheets: Object.fromEntries(SHEETS.map((sheet) => [sheet.id, { sort: states[sheet.id].sort, widths: states[sheet.id].widths, hidden: states[sheet.id].hidden,
        order: states[sheet.id].order, freeze: states[sheet.id].freeze, formats: states[sheet.id].formats }])),
    };
    writeJson(LAYOUT_KEY, saved);
  }, [sheetId, states, zoomPercent, tabColors, hiddenTabs, gridlines, formulaBar, autoFilter, greyEnded, fullScreen, pivotOpen, pivot]);
  // Filters, search, hidden rows, subtotals and the active cell last through a page refresh, but not closing the window.
  const latest = useRef(states);
  latest.current = states;
  useEffect(() => {
    writeSession(REFRESH_KEY, null);
    const save = () => writeSession(REFRESH_KEY, JSON.stringify(Object.fromEntries(SHEETS.map(({ id }) => {
      const { filters, search, hiddenRows, subtotals, collapsed, active } = latest.current[id];
      return [id, { filters, search, hiddenRows, subtotals, collapsed, active }];
    }))));
    // Back from the browser's page cache: nothing was lost, so nothing to restore later.
    const back = () => writeSession(REFRESH_KEY, null);
    window.addEventListener('pagehide', save);
    window.addEventListener('pageshow', back);
    return () => { window.removeEventListener('pagehide', save); window.removeEventListener('pageshow', back); };
  }, []);
  const grid = useRef<HTMLDivElement>(null);
  const formula = useRef<HTMLInputElement>(null);
  const sheet = getSheet(sheetId);
  const state = states[sheetId];
  const updateSheet = useCallback((id: SheetId, change: (current: SheetState) => Partial<SheetState>) =>
    setStates((current) => ({ ...current, [id]: { ...current[id], ...change(current[id]) } })), []);
  const update = useCallback((change: (current: SheetState) => Partial<SheetState>) => updateSheet(sheetId, change), [sheetId, updateSheet]);
  /** Opening a hidden sheet (a PivotTable count, say) shows its tab again. */
  const showTab = (id: TabId) => setHiddenTabs((tabs) => tabs.includes(id) ? tabs.filter((tab) => tab !== id) : tabs);
  /** The tabs in order: the data sheets, then the PivotTable. */
  const tabIds: readonly TabId[] = [...SHEETS.map((s) => s.id), 'pivot' as const].filter((id) => !hiddenTabs.includes(id));
  const tabIndex = tabIds.indexOf(pivotOpen ? 'pivot' : sheetId);
  const tabName = (id: TabId) => id === 'pivot' ? 'PivotTable' : getSheet(id).name;
  /** A sheet's rows for the PivotTable: all of them, or the ones its sort, search and filters list. */
  const rowsFor = useCallback((source: SheetId, useFilters: boolean): readonly SheetRow[] => {
    const target: Sheet = getSheet(source);
    if (!useFilters) return target.rows();
    return listRows(target, states[source]).visible;
  }, [states]);

  return {
    sheetId, setSheetId, states, setStates, autoFilter, setAutoFilter, gridlines, setGridlines,
    formulaBar, setFormulaBar, tabColors, setTabColors, hiddenTabs, setHiddenTabs, greyEnded, setGreyEnded,
    zoomPercent, setZoom, pivotOpen, setPivotOpen, pivot, setPivot, grid, formula,
    sheet, state, updateSheet, update, showTab, tabIds, tabIndex, tabName,
    rowsFor,
  };
}
export type Workbook = ReturnType<typeof useWorkbook>;
