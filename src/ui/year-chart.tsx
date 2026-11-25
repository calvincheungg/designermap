import { useMemo, useState } from 'react';
import type { Collaboration } from '../types';

/** How many times each value occurs. */
export const tally = <T,>(values: Iterable<T>) => {
  const counts = new Map<T, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
};

/** Empty stretches longer than this many years collapse into one break column. */
export const CHART_GAP_YEARS = 10;

export type ChartColumn = { kind: 'year'; year: number; count: number } | { kind: 'gap'; from: number; to: number };

/**
 * The chart's columns from the first to the last year: every year, except that a run of more than
 * CHART_GAP_YEARS empty years (e.g. between a lone early release and the rest) becomes one break column.
 */
export function chartColumns(counts: Map<number, number>): ChartColumn[] {
  const years = [...counts.keys()].sort((a, b) => a - b);
  const columns: ChartColumn[] = [];
  years.forEach((year, i) => {
    const previous = years[i - 1];
    if (previous !== undefined) {
      if (year - previous - 1 > CHART_GAP_YEARS) columns.push({ kind: 'gap', from: previous + 1, to: year - 1 });
      else for (let empty = previous + 1; empty < year; empty++) columns.push({ kind: 'year', year: empty, count: 0 });
    }
    columns.push({ kind: 'year', year, count: counts.get(year) ?? 0 });
  });
  return columns;
}

export const releasesText = (count: number) => `${count.toLocaleString()} ${count === 1 ? 'release' : 'releases'}`;

/** Share of year leaves out years with fewer releases than this: one or two releases make 50–100% swings. */
export const MIN_SHARE_RELEASES = 4;
/** A year's bar height in Share of year: 100% for a stacked year, or the focused colour's share of it, in whole percent. */
export function yearShare(count: number, total: number) {
  return total ? Math.round((count / total) * 1000) / 10 : 0;
}

export interface Segment { key: string; label: string; color: string; hint?: string }
export interface Scheme { segments: readonly Segment[]; of: (project: Collaboration) => string }
/** One navy colour for every release. */
export const TOTAL_SCHEME: Scheme = { segments: [{ key: 'all', label: 'Releases', color: '#000080' }], of: () => 'all' };

export const Swatch = ({ color }: { color: string }) => <span className="stats-swatch" style={{ background: color }} aria-hidden="true" />;

/**
 * The line view: one polyline per colour across the year columns, with square markers like
 * Excel 2000's. Lines break at collapsed gaps and at years left out of Share of year.
 */
function ChartLines({ columns, segments, max, value, charted }: {
  columns: readonly ChartColumn[]; segments: readonly Segment[]; max: number;
  value: (key: string, year: number) => number; charted: (year: number) => boolean;
}) {
  const span = columns.length;
  const y = (v: number) => 100 - (v / max) * 100;
  return <svg className="stats-chart-lines" viewBox={`0 0 ${span} 100`} preserveAspectRatio="none" aria-hidden="true">
    {segments.map((segment) => {
      const runs: string[][] = [[]];
      columns.forEach((column, i) => {
        if (column.kind === 'year' && charted(column.year)) runs.at(-1)!.push(`${i + 0.5},${y(value(segment.key, column.year))}`);
        else if (runs.at(-1)!.length) runs.push([]);
      });
      return <g key={segment.key} stroke={segment.color}>
        {runs.filter((run) => run.length > 1).map((run, i) => <polyline key={i} points={run.join(' ')} fill="none" />)}
        {runs.flat().map((point) => <path key={point} className="stats-chart-marker" d={`M${point}h0`} />)}
      </g>;
    })}
  </svg>;
}

/**
 * A Win98 column chart of releases per year, optionally stacked; hovering a column shows its exact counts,
 * clicking picks the year. Clicking a colour (a bar segment or the legend) shows only that colour, rescaled
 * on the same year axis; clicking it again shows every colour.
 */
export function YearChart({ releases, scheme, label, selected, onPick, focus, onFocus, share: asShare = false, lines = false }: {
  releases: readonly Collaboration[]; scheme: Scheme; label: string;
  /** One line per colour (its count, or its share of each year) instead of stacked bars. */
  lines?: boolean;
  /** Share of year: bars show percentages of each year's releases instead of counts. */
  share?: boolean;
  selected?: number; onPick: (year: number, keep?: boolean) => void;
  focus?: string; onFocus: (segment: string | undefined) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const allSegments = scheme.segments;
  const focused = allSegments.find((segment) => segment.key === focus);
  const segments = focused ? [focused] : allSegments;
  const { counts, yearTotals, allTotals, bySegment, totals } = useMemo(() => {
    const bySegment = new Map<number, Map<string, number>>();
    const totals = new Map<string, number>();
    const allTotals = tally(releases.map((project) => project.year));
    // Share of year only charts years with enough releases for a share to mean something.
    const charted = asShare ? releases.filter((project) => (allTotals.get(project.year) ?? 0) >= MIN_SHARE_RELEASES) : releases;
    for (const project of charted) {
      const key = scheme.of(project);
      const year = bySegment.get(project.year) ?? new Map<string, number>();
      year.set(key, (year.get(key) ?? 0) + 1);
      bySegment.set(project.year, year);
      totals.set(key, (totals.get(key) ?? 0) + 1);
    }
    const yearTotals = tally(charted.map((project) => project.year));
    // A focused colour keeps every year on the axis, counting only its own releases.
    const counts = focus ? new Map([...yearTotals.keys()].map((year) => [year, bySegment.get(year)?.get(focus) ?? 0])) : yearTotals;
    return { counts, yearTotals, allTotals, bySegment, totals };
  }, [releases, scheme, focus, asShare]);
  const columns = useMemo(() => chartColumns(counts), [counts]);
  if (!columns.length) return <p className="hint">{asShare && releases.length
    ? `No year has ${MIN_SHARE_RELEASES} or more releases with the current filters; switch Show as to Count.`
    : 'Nothing to count with the current filters.'}</p>;
  const years = [...counts.keys()];
  const first = Math.min(...years), last = Math.max(...years);
  // In Share of year a stacked bar always fills the plot; a focused colour rescales to its own peak share.
  const value = (year: number) => !asShare ? counts.get(year) ?? 0
    : focus ? yearShare(counts.get(year) ?? 0, yearTotals.get(year) ?? 0) : (yearTotals.get(year) ? 100 : 0);
  /** A colour's own value in a year: its count, or its share of the year (lines are drawn per colour, not stacked). */
  const lineValue = (key: string, year: number) => {
    const n = bySegment.get(year)?.get(key) ?? 0;
    return asShare ? yearShare(n, yearTotals.get(year) ?? 0) : n;
  };
  const lineMax = Math.max(1, Math.ceil(Math.max(0, ...segments.flatMap((segment) => years.map((year) => lineValue(segment.key, year))))));
  const max = lines ? lineMax : asShare ? Math.max(1, Math.ceil(Math.max(...years.map(value)))) : Math.max(1, ...counts.values());
  const peakYear = years.find((y) => value(y) === Math.max(...years.map(value)));
  const span = columns.length;
  // Label roughly every fifth of the range, on round years.
  const step = [1, 2, 5, 10, 20, 25, 50].find((s) => span / s <= 8) ?? 100;
  // The first and last years are always labelled; a round year too close to either is left out so labels don't overlap.
  const clearance = Math.ceil(step * 0.6);
  const labelled = (i: number, year: number) => i === 0 || i === span - 1
    || (year % step === 0 && i >= clearance && span - 1 - i >= clearance);
  const stacked = segments.length > 1;
  const keyed = allSegments.length > 1;
  const parts = (year: number) => segments.map((segment) => [segment, bySegment.get(year)?.get(segment.key) ?? 0] as const);
  const share = (n: number, total: number) => total ? ` (${Math.round((n / total) * 100)}%)` : '';
  const tipText = (column: ChartColumn) => column.kind === 'year' && asShare && !yearTotals.has(column.year) && allTotals.get(column.year)
    ? `${column.year}: ${releasesText(allTotals.get(column.year)!)}, too few to show as a share`
    : column.kind === 'year'
    ? `${column.year}: ${focused ? `${focused.label} ${column.count.toLocaleString()} of ${releasesText(yearTotals.get(column.year) ?? 0)}${share(column.count, yearTotals.get(column.year) ?? 0)}` : releasesText(column.count)}${stacked && column.count ? ` (${parts(column.year).filter(([, n]) => n).map(([segment, n]) => `${segment.label} ${n}`).join(', ')})` : ''}`
    : `${column.from}–${column.to}: ${asShare ? `fewer than ${MIN_SHARE_RELEASES} releases a year` : 'no releases'}`;
  const hovered = hover === null ? undefined : columns[hover];
  // Keep the tooltip inside the plot: anchor it left, centred or right depending on the column.
  const tipAlign = hover === null ? '' : hover < span * 0.2 ? 'start' : hover > span * 0.8 ? 'end' : 'center';
  return <>
    <div className="sunken-panel stats-chart" role="group" aria-label={`${label}${asShare ? ' as a share of each year' : ''}, ${first}–${last}; peak ${asShare ? `${value(peakYear!)}%` : max} in ${peakYear}`}>
      <div className="stats-chart-scale" aria-hidden="true"><span>{asShare ? `${max}%` : max}</span><span>0{asShare ? '%' : ''}</span></div>
      <div className={`stats-chart-plot${lines ? ' lines' : ''}`} onMouseLeave={() => setHover(null)}>
        {lines && <ChartLines columns={columns} segments={segments} max={max} value={lineValue}
          charted={(year) => !asShare || yearTotals.has(year)} />}
        {columns.map((column, i) => {
          if (column.kind === 'gap') return <div key={`gap-${column.from}`} className="stats-chart-col stats-chart-gap" onMouseEnter={() => setHover(i)}>
            <span className="stats-chart-track"><span className="stats-chart-break" aria-hidden="true">≈</span></span>
            <span className="stats-chart-year" />
          </div>;
          return <button type="button" key={column.year} aria-disabled={!column.count || undefined}
            className={`stats-chart-col${hover === i ? ' hover' : ''}${selected === column.year ? ' selected' : ''}`}
            aria-label={tipText(column)} aria-pressed={selected === column.year}
            onMouseEnter={() => setHover(i)} onClick={(event) => {
              if (!column.count) return;
              // Clicking a colour in a stacked bar focuses that colour and lists the year's releases of it.
              const segment = stacked ? (event.target as HTMLElement).dataset.segment : undefined;
              if (segment) { onFocus(segment); onPick(column.year, true); } else onPick(column.year);
            }}>
            <span className="stats-chart-track">{!lines && <span className="stats-chart-bar" style={{ height: `${(value(column.year) / max) * 100}%` }}>
              {column.count > 0 && parts(column.year).map(([segment, n]) => n > 0 &&
                <span key={segment.key} data-segment={segment.key} title={stacked ? `Show only ${segment.label}` : undefined} className="stats-chart-seg" style={{ height: `${(n / column.count) * 100}%`, background: segment.color }} />)}
            </span>}</span>
            <span className="stats-chart-year">{labelled(i, column.year) ? column.year : ''}</span>
          </button>;
        })}
        {hovered && <span className={`stats-chart-tip ${tipAlign}`} style={{ left: `${((hover! + 0.5) / span) * 100}%` }} aria-hidden="true">
          {hovered.kind === 'year' && stacked && hovered.count
            ? <><strong>{hovered.year}: {releasesText(hovered.count)}</strong>
              {parts(hovered.year).filter(([, n]) => n).reverse().map(([segment, n]) =>
                <span key={segment.key} className="stats-tip-row"><Swatch color={segment.color} />{segment.label}: {n.toLocaleString()} ({Math.round((n / hovered.count) * 100)}%)</span>)}</>
            : tipText(hovered)}
        </span>}
      </div>
    </div>
    {keyed && <ul className={`stats-legend${focused ? ' focused' : ''}`} aria-label="Chart colours">
      {[...allSegments].reverse().map((segment) => {
        const n = totals.get(segment.key) ?? 0;
        const charted = [...totals.values()].reduce((sum, value) => sum + value, 0);
        const on = segment.key === focus;
        return <li key={segment.key}>
          <button type="button" className={`stats-legend-item${on ? ' on' : ''}`} aria-pressed={on} disabled={!n && !on}
            title={`${segment.hint ? `${segment.hint}. ` : ''}${on ? 'Click to show every colour' : 'Click to show only this colour'}`}
            onClick={() => onFocus(on ? undefined : segment.key)}>
            <Swatch color={segment.color} />{segment.label} <span className="stats-legend-count">{n.toLocaleString()} ({charted ? Math.round((n / charted) * 100) : 0}%)</span>
          </button>
        </li>;
      })}
      {focused && <li><button type="button" className="stats-legend-item stats-legend-all" onClick={() => onFocus(undefined)}>Show all</button></li>}
    </ul>}
  </>;
}
