import { useTitleBarDrag } from '../dialog';
import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { valueCounts, type BucketCount, type ColumnFilter, type Sheet, type SheetRow } from './data';

/**
 * Insert ▸ Chart…: an Excel 2000 chart object floating over the sheet. It counts
 * the listed rows by one column (as a bar or column chart), follows the sheet's
 * filters and search as they change, and clicking a bar filters the sheet to it.
 * One series, so no legend: the title names it. The sheet itself is the table view.
 */

export type ChartType = 'bar' | 'column';
export interface ChartOptions { column: string; type: ChartType; top: number; sort: 'count' | 'label'; decades: boolean }
export const CHART_TOPS = [10, 20, 50, 0] as const;

/** A round axis maximum and step (1, 2 or 5 × 10ⁿ), about four gridlines. */
export function niceScale(max: number): { max: number; step: number } {
  if (max <= 0) return { max: 1, step: 1 };
  const raw = max / 4, power = 10 ** Math.floor(Math.log10(raw));
  const step = Math.max(1, [1, 2, 5, 10].find((m) => m * power >= raw)! * power);
  return { max: Math.ceil(max / step) * step, step };
}

/** The chart's bars: buckets sorted by count (or the column's own order), the top N kept and the rest folded into "Other". */
export function chartBars(sheet: Sheet, rows: readonly SheetRow[], col: number, options: Pick<ChartOptions, 'top' | 'sort' | 'decades'>) {
  const counts = valueCounts(sheet, rows, col, options.decades);
  const ranked = options.sort === 'count' ? [...counts].sort((a, b) => b.count - a.count) : counts;
  if (!options.top || ranked.length <= options.top) return { bars: ranked, other: undefined };
  const kept = ranked.slice(0, options.top), rest = ranked.slice(options.top);
  return { bars: kept, other: { values: rest.length, count: rest.reduce((sum, bucket) => sum + bucket.count, 0) } };
}

export function ChartWindow({ sheet, rows, options, onOptions, onFilter, onClose }: {
  sheet: Sheet; rows: readonly SheetRow[]; options: ChartOptions;
  onOptions: (options: ChartOptions) => void; onFilter: (col: number, filter: ColumnFilter) => void; onClose: () => void;
}) {
  const col = Math.max(0, sheet.columns.findIndex((column) => column.id === options.column));
  const column = sheet.columns[col]!;
  const { bars, other } = chartBars(sheet, rows, col, options);
  // "Other" is a note under the plot, not a bar: summed over many values, it would dwarf the bars being compared.
  const all: BucketCount[] = bars;
  const scale = niceScale(Math.max(0, ...all.map((bar) => bar.count)));
  const ticks = Array.from({ length: Math.round(scale.max / scale.step) + 1 }, (_, i) => i * scale.step);
  const multiValued = rows.some((row) => row.cells[col]!.length > 1);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);
  const drag = useTitleBarDrag();
  const plot = useRef<HTMLDivElement>(null);
  const set = (change: Partial<ChartOptions>) => onOptions({ ...options, ...change });
  const showTip = (event: ReactPointerEvent, bar: BucketCount) => {
    const box = plot.current?.getBoundingClientRect();
    if (!box) return;
    setTip({ x: event.clientX - box.left + 12, y: event.clientY - box.top + 14, text: `Series "Count" Point "${bar.label}" Value: ${bar.count.toLocaleString()}` });
  };
  const percent = (count: number) => `${(count / scale.max) * 100}%`;
  const barButton = (bar: BucketCount, children: ReactNode, className: string) => <button type="button" key={bar.key} className={className} aria-label={`${bar.label}: ${bar.count}. Filter the sheet to it`}
      onPointerMove={(event) => showTip(event, bar)} onPointerLeave={() => setTip(null)} onClick={() => onFilter(col, bar.filter)}>{children}</button>;

  return <div className="window xl-chart" role="dialog" aria-labelledby="xl-chart-title" style={drag.style}>
    <div className="title-bar" {...drag.bar}>
      <div className="title-bar-text" id="xl-chart-title">Chart - {sheet.name}</div>
      <div className="title-bar-controls"><button className="close" aria-label="Close Chart" onClick={onClose} /></div>
    </div>
    <div className="window-body xl-chart-body">
      <div className="xl-chart-options">
        <label>Count by <select aria-label="Chart column" value={column.id} onChange={(event) => {
          const next = sheet.columns.find((c) => c.id === event.target.value);
          set({ column: event.target.value, decades: !!next?.year });
        }}>{sheet.columns.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
        <label>Type <select aria-label="Chart type" value={options.type} onChange={(event) => set({ type: event.target.value as ChartType })}>
          <option value="bar">Bar</option><option value="column">Column</option></select></label>
        <label>Show <select aria-label="Chart size" value={options.top} onChange={(event) => set({ top: Number(event.target.value) })}>
          {CHART_TOPS.map((top) => <option key={top} value={top}>{top ? `Top ${top}` : 'All'}</option>)}</select></label>
        <label>Sort <select aria-label="Chart sort" value={options.sort} onChange={(event) => set({ sort: event.target.value as ChartOptions['sort'] })}>
          <option value="count">By count</option><option value="label">By {column.label}</option></select></label>
        {column.year && <span className="field-row"><input type="checkbox" id="xl-chart-decades" checked={options.decades}
          onChange={(event) => set({ decades: event.target.checked })} /><label htmlFor="xl-chart-decades">Decades</label></span>}
      </div>
      <h3 className="xl-chart-title">Count of {sheet.name} by {column.label}</h3>
      <p className="xl-chart-subtitle">{rows.length.toLocaleString()} rows listed{multiValued ? `; a row with several ${column.label.toLowerCase()} values counts in each` : ''}. Click a bar to filter the sheet.</p>
      <div ref={plot} className={`xl-chart-plot ${options.type}`} role="img" aria-label={`Count of ${sheet.name} by ${column.label}`}>
        {!all.length ? <p className="xl-chart-empty">No rows to chart.</p> : options.type === 'bar' ? <div className="xl-bars">
          {all.map((bar) => barButton(bar, <>
            <span className="xl-bar-label" title={bar.label}>{bar.label}</span>
            <span className="xl-bar-track">
              {ticks.slice(1).map((tick) => <i key={tick} className="xl-gridline" style={{ left: percent(tick) }} />)}
              <span className="xl-bar-fill" style={{ width: percent(bar.count) }} />
              <span className="xl-bar-value" style={{ left: percent(bar.count) }}>{bar.count.toLocaleString()}</span>
            </span>
          </>, 'xl-bar-row'))}
          <div className="xl-bar-axis" aria-hidden="true"><span className="xl-bar-label" />
            <span className="xl-bar-track">{ticks.map((tick) => <span key={tick} style={{ left: percent(tick) }}>{tick.toLocaleString()}</span>)}</span></div>
        </div> : <div className="xl-columns">
          <div className="xl-column-axis" aria-hidden="true">{ticks.map((tick) => <span key={tick} style={{ bottom: percent(tick) }}>{tick.toLocaleString()}</span>)}</div>
          <div className="xl-column-area">
            {/* Gridlines share the bars' height (the area minus the label strip), so they line up with the values. */}
            <div className="xl-column-grid" aria-hidden="true">{ticks.slice(1).map((tick) => <i key={tick} className="xl-gridline horizontal" style={{ bottom: percent(tick) }} />)}</div>
            {all.map((bar) => barButton(bar, <>
              <span className="xl-column-track"><span className="xl-column-fill" style={{ height: percent(bar.count) }}>
                <span className="xl-column-value">{bar.count.toLocaleString()}</span></span></span>
              <span className="xl-column-label" title={bar.label}>{bar.label}</span>
            </>, 'xl-column'))}
          </div>
        </div>}
        {tip && <div className="xl-chart-tip" style={{ left: tip.x, top: tip.y }}>{tip.text}</div>}
      </div>
      {other && <p className="xl-chart-other">Not shown: {other.values.toLocaleString()} more {other.values === 1 ? 'value' : 'values'} ({other.count.toLocaleString()} counted). Choose Show ▸ All to chart every value.</p>}
    </div>
  </div>;
}
