import { ContextMenu } from '../context-menu';
import { SaveAsDialog } from '../save-as-dialog';
import { ChartWindow } from './chart';
import { getSheet, columnIndex, filterSheet, filterLabel, columnValues, effectiveSort } from './data';
import { SortIcon, FunnelIcon, SaveIcon, DropList, CustomFilterDialog, TopTenDialog, SortDialog, ZoomSlider, MessageDialog, GoToDialog, SubtotalDialog, ConditionalFormatDialog, TabColorDialog, FindDialog } from './dialogs';
import { SheetGrid } from './grid';
import { gridKeys } from './keys';
import { NO_RANGE, ZOOMS, ZOOM_MIN, ZOOM_MAX, clampZoom } from './layout';
import { sheetMenus } from './menus';
import { PivotView } from './pivot';
import { useCommands } from './use-commands';
import { useGridDrag } from './use-grid-drag';
import { MENUS, usePopups } from './use-popups';
import { useSelection } from './use-selection';
import { useSheetView } from './use-sheet-view';
import { useWorkbook, type WorkbookActions } from './use-workbook';

export * from './data';
export { readLayout } from './layout';
export { LAYOUT_KEY } from './layout-key';

/**
 * Spreadsheet: an Excel 2000 workbook with one worksheet per kind of record
 * (Brands, Groups, Designers, Careers, Collaborations, Locations): lettered
 * columns, numbered rows, a Name box, a formula bar that doubles as the sheet's
 * search box, AutoFilter drop-downs, Data ▸ Sort…, a frozen first column, zoom,
 * hideable and AutoFit columns and CSV export. Everything belongs to the
 * workbook alone; the map, Properties and the other windows never see it, and
 * every record is listed whatever the map shows.
 */

/** Toolbar Chart Wizard: three columns of a bar chart. */
function ChartIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
    <path d="M1.5 1v13.5H15" fill="none" stroke="#000" />
    <rect x="3.5" y="7.5" width="3" height="6" fill="#9999ff" stroke="#000" />
    <rect x="7.5" y="3.5" width="3" height="10" fill="#993366" stroke="#000" />
    <rect x="11.5" y="9.5" width="3" height="4" fill="#ffffcc" stroke="#000" />
  </svg>;
}
/** AutoCalculate numbers, at most two decimals, like Excel's status bar; years stay as 1990, not 1,990. */
const statNumber = (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 2, useGrouping: Math.abs(value) >= 10000 });
const darkColor = (color: string) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16)); return r! * 0.3 + g! * 0.59 + b! * 0.11 < 128; };

export function SpreadsheetContent(props: WorkbookActions) {
  const actions = { ...props, fullScreen: props.fullScreen ?? false };
  const workbook = useWorkbook(actions.fullScreen);
  const popups = usePopups({ workbook });
  const view = useSheetView({ workbook });
  const selection = useSelection({ workbook, view });
  const commands = useCommands({ actions, workbook, popups, view, selection });
  const drag = useGridDrag({ workbook, view, selection, commands });
  const menus = sheetMenus({ actions, workbook, popups, view, selection, commands });
  const { sheetId, autoFilter, formulaBar, tabColors, setTabColors, zoomPercent, setZoom, pivotOpen, pivot, setPivot, grid, formula, sheet, state, update, tabIds, tabIndex, tabName, rowsFor } = workbook;
  const { finding, setFinding, findOptions, nameText, setNameText, chart, setChart, zoomSlider, setZoomSlider, editing, setEditing, dropdown, setDropdown, cellMenu, dialog, setDialog, menu, setMenu, rowMenu, columnMenu, tabMenu, setTabMenu, justClosed, closeDropdown, closeCellMenu, closeRowMenu, closeColumnMenu, closeTabMenu, openMenu } = popups;
  const { sort, filters, search, columns, zoom, order, all, searched, visible, shown, filtered, narrowed } = view;
  const { col, activeText, reference, setActive, stats } = selection;
  const { applySort, setColumnFilter, showAll, setSearch, toggleAutoFilter, switchSheet, openPivot, goToTab, drill, openChart, saveCsv, writeXlsx, writeCsv, setSubtotals, goToOrWarn, findNext, dropdownEntries, dropdownSelected, dropdownTicks, applyTicks, cellMenuLabel, cellMenuEntries } = commands;
  const { columnActions, rowActions, tabActions, cellActions, menuActions } = menus;
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
      <input type="text" className="xl-name-box" aria-label="Name Box" title="Type a cell or range to go to it" spellCheck={false} value={nameText ?? reference}
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
    <SheetGrid {...{ actions, workbook, popups, view, selection, commands, drag }} onKeyDown={gridKeys({ workbook, popups, view, selection, commands, drag })} />
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
            onClick={show} onContextMenu={(event) => { if (!on) show(); event.preventDefault(); setDropdown(null); setTabMenu({ x: event.clientX, y: event.clientY, tab: id }); }}>{tabName(id)}</button>;
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
    {tabMenu && <ContextMenu x={tabMenu.x} y={tabMenu.y} label={`${tabName(tabMenu.tab)} tab`} actions={tabActions(tabMenu.tab)} onClose={closeTabMenu} />}
  </div>;
}
