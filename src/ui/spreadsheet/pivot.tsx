import { useMemo } from 'react';
import { BLANK_LABEL, getSheet, pivotTable, SHEETS, type ColumnFilter, type ListFilters, type SheetId, type SheetRow } from './data';

/**
 * The PivotTable sheet: Count of a sheet's records by a row field and an
 * optional column field, laid out like an Excel 2000 PivotTable report with
 * grey field buttons and Grand Totals. Clicking a count opens the source sheet
 * filtered to exactly those records.
 */

export interface PivotOptions {
  source: SheetId; row: string; column: string;
  /** Group year fields by decade. */
  decades: boolean;
  sortBy: 'total' | 'label';
  /** Count only the rows the source sheet's filters and search leave. */
  useFilters: boolean;
}
export const DEFAULT_PIVOT: PivotOptions = { source: 'brands', row: 'country', column: 'tier', decades: true, sortBy: 'total', useFilters: false };

/** Keep a stored or edited configuration valid for its source sheet's columns. */
export function validPivot(options: Partial<PivotOptions> | undefined): PivotOptions {
  const source = SHEETS.some((sheet) => sheet.id === options?.source) ? options!.source! : DEFAULT_PIVOT.source;
  const ids = getSheet(source).columns.map((column) => column.id);
  const row = ids.includes(options?.row ?? '') ? options!.row! : source === DEFAULT_PIVOT.source ? DEFAULT_PIVOT.row : ids[0]!;
  const column = options?.column === '' || ids.includes(options?.column ?? '\u0000') ? options!.column! : source === DEFAULT_PIVOT.source ? DEFAULT_PIVOT.column : '';
  return {
    source, row, column: column === row ? '' : column,
    decades: typeof options?.decades === 'boolean' ? options.decades : DEFAULT_PIVOT.decades,
    sortBy: options?.sortBy === 'label' ? 'label' : 'total',
    useFilters: typeof options?.useFilters === 'boolean' ? options.useFilters : false,
  };
}

export function PivotView({ options, onOptions, rowsFor, onDrill, zoom }: {
  options: PivotOptions; onOptions: (options: PivotOptions) => void;
  /** The source sheet's rows: all of them, or what its filters and search leave. */
  rowsFor: (source: SheetId, useFilters: boolean) => readonly SheetRow[];
  /** Open the source sheet filtered to one count's records. */
  onDrill: (source: SheetId, filters: ListFilters) => void;
  zoom: number;
}) {
  const sheet = getSheet(options.source);
  const rowCol = sheet.columns.findIndex((column) => column.id === options.row);
  const columnCol = options.column ? sheet.columns.findIndex((column) => column.id === options.column) : -1;
  const rows = rowsFor(options.source, options.useFilters);
  const pivot = useMemo(() => pivotTable(sheet, rows, rowCol, columnCol < 0 ? undefined : columnCol, options.decades, options.sortBy),
    [sheet, rows, rowCol, columnCol, options.decades, options.sortBy]);
  const rowField = sheet.columns[rowCol]!, columnField = columnCol < 0 ? undefined : sheet.columns[columnCol]!;
  const set = (change: Partial<PivotOptions>) => onOptions(validPivot({ ...options, ...change }));
  const hasYears = rowField.year || columnField?.year;
  const drill = (rowFilter?: ColumnFilter, columnFilter?: ColumnFilter) => onDrill(options.source, {
    ...(rowFilter ? { [rowField.id]: rowFilter } : {}), ...(columnFilter && columnField ? { [columnField.id]: columnFilter } : {}),
  });
  const countButton = (count: number | undefined, label: string, rowFilter?: ColumnFilter, columnFilter?: ColumnFilter) => count
    ? <button type="button" className="xl-pivot-count" aria-label={`${count} ${sheet.name.toLowerCase()}: ${label}`} title={`Show these ${count} in ${sheet.name}`}
      onClick={() => drill(rowFilter, columnFilter)}>{count.toLocaleString()}</button> : null;
  const fieldOptions = sheet.columns.map((column) => <option key={column.id} value={column.id}>{column.label}</option>);

  return <div className="xl-pivot">
    <div className="xl-pivot-toolbar" role="toolbar" aria-label="PivotTable">
      <label>Data <select aria-label="PivotTable data" value={options.source} onChange={(event) => set({ source: event.target.value as SheetId, row: '', column: '' })}>
        {SHEETS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
      <label>Rows <select aria-label="Row field" value={options.row} onChange={(event) => set({ row: event.target.value, column: event.target.value === options.column ? '' : options.column })}>{fieldOptions}</select></label>
      <label>Columns <select aria-label="Column field" value={options.column} onChange={(event) => set({ column: event.target.value })}>
        <option value="">(none)</option>{sheet.columns.filter((column) => column.id !== options.row).map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}</select></label>
      <label>Sort rows <select aria-label="Sort rows" value={options.sortBy} onChange={(event) => set({ sortBy: event.target.value as PivotOptions['sortBy'] })}>
        <option value="total">By Grand Total</option><option value="label">By {rowField.label}</option></select></label>
      {hasYears && <span className="field-row"><input type="checkbox" id="xl-pivot-decades" checked={options.decades} onChange={(event) => set({ decades: event.target.checked })} />
        <label htmlFor="xl-pivot-decades">Group years by decade</label></span>}
      <span className="field-row"><input type="checkbox" id="xl-pivot-filters" checked={options.useFilters} onChange={(event) => set({ useFilters: event.target.checked })} />
        <label htmlFor="xl-pivot-filters">Only rows the {sheet.name} sheet lists</label></span>
    </div>
    <div className="xl-pivot-scroll" tabIndex={0} role="region" aria-label="PivotTable report">
      <table className="xl-pivot-table" style={{ zoom }} aria-label={`Count of ${sheet.name} by ${rowField.label}${columnField ? ` and ${columnField.label}` : ''}`}>
        <thead>
          <tr>
            <th className="xl-pivot-data">Count of {sheet.name}</th>
            {columnField ? <th className="xl-pivot-field" colSpan={pivot.columns.length + 1}><span className="xl-pivot-button">{columnField.label}</span></th>
              : <th className="xl-pivot-corner" />}
          </tr>
          <tr>
            <th className="xl-pivot-field"><span className="xl-pivot-button">{rowField.label}</span></th>
            {pivot.columns.map((bucket) => <th key={bucket.key} scope="col" className={bucket.label === BLANK_LABEL ? 'blank' : undefined}>{bucket.label}</th>)}
            <th scope="col" className="xl-pivot-total">{columnField ? 'Grand Total' : 'Total'}</th>
          </tr>
        </thead>
        <tbody>
          {pivot.rows.map((r) => <tr key={r.key}>
            <th scope="row" className={r.label === BLANK_LABEL ? 'blank' : undefined}>{r.label}</th>
            {pivot.columns.map((c) => <td key={c.key}>{countButton(pivot.counts.get(r.key)?.get(c.key), `${r.label}, ${c.label}`, r.filter, c.filter)}</td>)}
            <td className="xl-pivot-total">{countButton(pivot.rowTotals.get(r.key), r.label, r.filter)}</td>
          </tr>)}
        </tbody>
        <tfoot>
          <tr className="xl-pivot-total">
            <th scope="row">Grand Total</th>
            {pivot.columns.map((c) => <td key={c.key}>{countButton(pivot.columnTotals.get(c.key), c.label, undefined, c.filter)}</td>)}
            <td>{countButton(pivot.total, `all ${sheet.name.toLowerCase()}`)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>;
}
