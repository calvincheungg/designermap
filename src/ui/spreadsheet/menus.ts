import { type MenuAction } from '../context-menu';
import { type SheetRow } from './data';
import { ZOOMS, NO_RANGE, FIRST_COLUMN, type TabId } from './layout';
import { validPivot } from './pivot';
import { type Commands } from './use-commands';
import { type MenuName, type Popups } from './use-popups';
import { type GridSelection } from './use-selection';
import { type SheetView } from './use-sheet-view';
import { type Workbook, type WorkbookActions } from './use-workbook';

/** The workbook's menus: the menu bar, and right-click on cells, rows, columns and tabs. */
export function sheetMenus({ actions, workbook, popups, view, selection, commands }: { actions: WorkbookActions; workbook: Workbook; popups: Popups; view: SheetView; selection: GridSelection; commands: Commands }) {
  const { onShowOnMap, onShowPlace, onHelp, onClose, fullScreen, onFullScreen } = actions;
  const { sheetId, autoFilter, gridlines, setGridlines, formulaBar, setFormulaBar, hiddenTabs, greyEnded, setGreyEnded, zoomPercent, setZoom, pivotOpen, pivot, grid, formula, sheet, state, update, showTab, tabIds, tabName } = workbook;
  const { setFinding, setDialog } = popups;
  const { filters, columns, shownCols, shown, filtered } = view;
  const { col, current, rects, multi, row, position, activeText, reference, inRange, fullColumns, isFullRow, columnsFor, selectAll } = selection;
  const { openRow, showRowOnMap, applySort, setColumnFilter, showAll, toggleAutoFilter, openPivot, hideTab, copySelection, openChart, saveCsv, autoFit, hideColumn, nudgeColumns, selectedRows, hideRows, unhideRows, setSubtotals, freezeHere, frozen, unhideColumns } = commands;
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

  return {
    columnActions, canMap, rowActions, tabActions, cellActions, menuActions,
  };
}
export type Menus = ReturnType<typeof sheetMenus>;
