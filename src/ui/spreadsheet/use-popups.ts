import { useCallback, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { type ChartOptions } from './chart';
import { type SheetRow, type SheetId, type FindOptions } from './data';
import { type TabId } from './layout';
import { type Rect } from './select';
import { type Workbook } from './use-workbook';

export type MenuName = 'File' | 'Edit' | 'View' | 'Insert' | 'Format' | 'Data' | 'Window' | 'Help';
export const MENUS: readonly MenuName[] = ['File', 'Edit', 'View', 'Insert', 'Format', 'Data', 'Window', 'Help'];
export type DialogState = { kind: 'custom' | 'top' | 'format'; col: number } | { kind: 'sort' | 'save' | 'saveXlsx' | 'goto' | 'subtotals' }
  | { kind: 'message'; text: string } | { kind: 'tabColor'; tab: TabId } | null;

/** What's open over the sheet: dialogs, menus, drop-downs, the chart, Find and the copied cells. */
export function usePopups({ workbook }: { workbook: Workbook }) {
  const { grid } = workbook;
  /** The copied cells, inside their moving border until Esc or the list changes. */
  const [copied, setCopied] = useState<{ sheetId: SheetId; shown: readonly SheetRow[]; columns: string; rects: readonly Rect[] } | null>(null);
  const [finding, setFinding] = useState(false);
  const findOptions = useRef<FindOptions>({ text: '', matchCase: false, whole: false, by: 'rows' });
  /** What's being typed in the Name Box. */
  const [nameText, setNameText] = useState<string | null>(null);
  /** Insert ▸ Chart…: the chart object over the sheet, if one is open. */
  const [chart, setChart] = useState<ChartOptions | null>(null);
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
  const [tabMenu, setTabMenu] = useState<{ x: number; y: number; tab: TabId } | null>(null);
  /** The menu an outside press just closed: pressing its own title closes it rather than reopening it. */
  const justClosed = useRef<MenuName | null>(null);
  const closePopups = () => { setDropdown(null); setCellMenu(null); setDialog(null); setEditing(false); setChart(null); setFinding(false); setNameText(null); };
  const closeDropdown = useCallback(() => setDropdown(null), []);
  const closeCellMenu = useCallback(() => setCellMenu(null), []);
  const closeRowMenu = useCallback((restoreFocus?: boolean) => { setRowMenu(null); if (restoreFocus) grid.current?.focus(); }, []);
  const closeColumnMenu = useCallback((restoreFocus?: boolean) => { setColumnMenu(null); if (restoreFocus) grid.current?.focus(); }, []);
  const closeTabMenu = useCallback((restoreFocus?: boolean) => { setTabMenu(null); if (restoreFocus) grid.current?.focus(); }, []);
  const openColumnMenu = (event: ReactMouseEvent, target: number) => {
    event.preventDefault();
    setDropdown(null);
    setColumnMenu({ x: event.clientX, y: event.clientY, col: target });
  };
  const openMenu = (name: MenuName) => (event: ReactMouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (justClosed.current === name) { justClosed.current = null; return; }
    setMenu((current) => current?.name === name ? null : { name, x: rect.left, y: rect.bottom });
  };

  return {
    copied, setCopied, finding, setFinding, findOptions, nameText, setNameText, chart,
    setChart, zoomSlider, setZoomSlider, editing, setEditing, dropdown, setDropdown, cellMenu,
    setCellMenu, dialog, setDialog, menu, setMenu, rowMenu, setRowMenu, columnMenu,
    setColumnMenu, tabMenu, setTabMenu, justClosed, closePopups, closeDropdown, closeCellMenu, closeRowMenu,
    closeColumnMenu, closeTabMenu, openColumnMenu, openMenu,
  };
}
export type Popups = ReturnType<typeof usePopups>;
