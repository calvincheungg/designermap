import { useMemo, useState, type ReactNode } from 'react';
import { allMoves, BrandCategory, collaborations, countryNames, designers, getDesigner, getHouse, groups, isBusinessLeadership, marketPositionings, tenuresAt, type CountryCode } from '../data';
import type { Collaboration, House } from '../types';
import { MarketPositioning } from '../data/tags';
import { mapLocationForCity } from '../graph/locations';
import { EntityLink, Fields, PlaceLink, ProfileSection, RowLimitedPanel, type Actions } from './panel';
import { SelectBox } from './listbox';

/** Rows shown in each "top" table. */
export const STATS_TOP = 10;

interface Row {
  key: string; label: ReactNode; count: number;
  /** Full label text, shown on hover when a long name is cut short. */
  title?: string;
  /** Extra columns after the label, one per `columns` heading. */
  cells?: ReactNode[];
}

/** Rows a table shows before it scrolls, however many the "Show" picker lists. */
export const STATS_VISIBLE_ROWS = 25;

/** Row counts the collaboration tables can show. */
const COLLAB_LIMITS = [STATS_TOP, 25, 50, 100, 200] as const;

/** A statistics section with a "Show" picker for how many rows its table lists. */
function LimitedSection({ title, children, controls }: {
  title: string; children: (limit: number) => ReactNode;
  /** Extra controls beside the "Show" picker. */
  controls?: ReactNode;
}) {
  const [limit, setLimit] = useState<number>(STATS_TOP);
  return <ProfileSection title={title}>
    <div className="field-row stats-limit">
      <span>Show</span>
      <SelectBox label={`Rows shown in ${title}`} values={COLLAB_LIMITS} value={limit} onChange={setLimit} />
      {controls}
    </div>
    {children(limit)}
  </ProfileSection>;
}

const top = <T,>(entries: Iterable<readonly [T, number]>, limit = STATS_TOP) =>
  [...entries].sort((a, b) => b[1] - a[1]).slice(0, limit);
const tally = <T,>(values: Iterable<T>) => {
  const counts = new Map<T, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
};

/** A Win98 table of counts with a navy bar scaled to the largest row. */
function BarTable({ heading, rows, label, countHeading = 'Count', columns = [], ranked = true }: {
  heading: string; rows: Row[]; label: string; countHeading?: string;
  /** Headings of extra columns between the label and the count. */
  columns?: string[];
  /** Number the rows in a leading "#" column (off for fixed orders like market tiers). */
  ranked?: boolean;
}) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  if (!rows.length) return <p className="hint">Nothing to count with the current filters.</p>;
  return <RowLimitedPanel rows={STATS_VISIBLE_ROWS} className="stats-table"><table aria-label={label}>
    <thead><tr>{ranked && <th className="stats-rank">#</th>}<th className="stats-label">{heading}</th>{columns.map((column) => <th key={column} className="stats-label">{column}</th>)}<th className="stats-count">{countHeading}</th><th className="stats-bar-cell" aria-hidden="true"></th></tr></thead>
    <tbody>{rows.map((row, index) => <tr key={row.key}>
      {ranked && <td className="stats-rank">{index + 1}</td>}<td className="stats-label" title={row.title}>{row.label}</td>{columns.map((column, cell) => <td key={column} className="stats-label">{row.cells?.[cell]}</td>)}<td className="stats-count">{row.count.toLocaleString()}</td>
      <td className="stats-bar-cell" aria-hidden="true"><span className="stats-bar" style={{ width: `${(row.count / max) * 100}%` }} /></td>
    </tr>)}</tbody>
  </table></RowLimitedPanel>;
}

const houseName = (id: string) => getHouse(id)?.name ?? id;

/** Remember, per table, whether it counts releases with a retailer. */
const RETAILER_COLLABS_KEY = 'designer-map:stats-retailer-collabs';
const RETAILER_PAIRS_KEY = 'designer-map:stats-retailer-pairs';

/** Whether a release involves a brand that is also a multi-brand store (category Retailer). */
export const involvesRetailer = (project: Pick<Collaboration, 'houses'>) =>
  project.houses.some((id) => getHouse(id)?.tags.brandCategory.includes(BrandCategory.Retailer));

/** An on-by-default checkbox setting remembered in localStorage. */
function useRememberedToggle(key: string) {
  const [on, setOn] = useState(() => {
    try { return localStorage.getItem(key) !== 'off'; } catch { return true; }
  });
  const toggle = (next: boolean) => {
    setOn(next);
    try { localStorage.setItem(key, next ? 'on' : 'off'); } catch { /* storage unavailable */ }
  };
  return [on, toggle] as const;
}

/** "Include retailer collaborations" checkbox, shown beside a table's "Show" picker. */
function RetailerToggle({ id, checked, onChange }: { id: string; checked: boolean; onChange: (next: boolean) => void }) {
  return <span className="stats-retailers">
    <input type="checkbox" id={id} checked={checked} onChange={(event) => onChange(event.target.checked)} />
    <label htmlFor={id} title="Releases with a brand that is also a store stocking other brands (Kith, BEAMS, Undefeated…)">Include retailer collaborations</label>
  </span>;
}

/** Each brand pair in a release (three-brand projects give three pairs), counted across releases. */
const tallyPairs = (releases: readonly Collaboration[]) => tally(releases.flatMap(pairKeys));

/** Empty stretches longer than this many years collapse into one break column. */
export const CHART_GAP_YEARS = 10;

type ChartColumn = { kind: 'year'; year: number; count: number } | { kind: 'gap'; from: number; to: number };

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

const releasesText = (count: number) => `${count.toLocaleString()} ${count === 1 ? 'release' : 'releases'}`;

/** How the Collaborations by year bars are split: one colour, by partner type, or first-time vs repeat pairings. */
export type YearBreakdown = 'total' | 'partners' | 'pairings';
const BREAKDOWNS: readonly (readonly [YearBreakdown, string])[] = [['total', 'Total'], ['partners', 'Partner type'], ['pairings', 'First-time vs repeat']];
const BREAKDOWN_VALUES = BREAKDOWNS.map(([value]) => value);
const BREAKDOWN_KEY = 'designer-map:stats-year-breakdown';

interface Segment { key: string; label: string; color: string; hint?: string }
/** Bar segments per breakdown, bottom to top, in Win98's 16-colour palette. */
const SEGMENTS: Record<YearBreakdown, readonly Segment[]> = {
  total: [{ key: 'all', label: 'Releases', color: '#000080' }],
  partners: [
    { key: 'luxuryStreet', label: 'Luxury × streetwear', color: '#800080', hint: 'A High Luxury or Luxury brand with a different Streetwear brand' },
    { key: 'retailer', label: 'With a retailer', color: '#008080', hint: 'A brand that is also a store stocking other brands (Kith, BEAMS, Undefeated…)' },
    { key: 'sportswear', label: 'With sportswear', color: '#808000', hint: 'A Sportswear brand takes part' },
    { key: 'other', label: 'Other', color: '#000080' },
  ],
  pairings: [
    { key: 'first', label: 'First-time pairing', color: '#000080', hint: 'At least two of the brands had not released together in an earlier year' },
    { key: 'repeat', label: 'Repeat pairing', color: '#008080', hint: 'Every pair of brands had already released together in an earlier year' },
  ],
};

const isLuxury = (id: string) => {
  const tier = getHouse(id)?.tags.marketPositioning;
  return tier === MarketPositioning.HighLuxury || tier === MarketPositioning.Luxury;
};
const hasCategory = (id: string, category: BrandCategory) => !!getHouse(id)?.tags.brandCategory.includes(category);

/**
 * A release's partner type, the first that fits: luxury × streetwear (two different brands),
 * then any retailer, then any sportswear brand, else other.
 */
export function partnerType(project: Pick<Collaboration, 'houses'>): 'luxuryStreet' | 'retailer' | 'sportswear' | 'other' {
  const ids = [...new Set(project.houses)];
  if (ids.some((a) => isLuxury(a) && ids.some((b) => b !== a && hasCategory(b, BrandCategory.Streetwear)))) return 'luxuryStreet';
  if (involvesRetailer(project)) return 'retailer';
  if (ids.some((id) => hasCategory(id, BrandCategory.Sportswear))) return 'sportswear';
  return 'other';
}

/** Each pair of distinct brands in a release, as sorted "a|b" keys. */
function pairKeys(project: Pick<Collaboration, 'houses'>) {
  const members = [...new Set(project.houses)].sort();
  return members.flatMap((a, i) => members.slice(i + 1).map((b) => `${a}|${b}`));
}
let firstYears: Map<string, number> | undefined;
/** Each brand pair's first release year across every recorded collaboration (filters don't rewrite history). */
const pairFirstYears = () => {
  if (firstYears) return firstYears;
  firstYears = new Map();
  for (const project of collaborations) for (const pair of pairKeys(project)) {
    const known = firstYears.get(pair);
    if (known === undefined || project.year < known) firstYears.set(pair, project.year);
  }
  return firstYears;
};

/** First-time when some pair of its brands first released together that year; repeat when every pair had released together before. */
export function pairingKind(project: Pick<Collaboration, 'houses' | 'year'>): 'first' | 'repeat' {
  const known = pairFirstYears();
  return pairKeys(project).some((pair) => (known.get(pair) ?? project.year) >= project.year) ? 'first' : 'repeat';
}

const segmentOf = (breakdown: YearBreakdown, project: Collaboration) =>
  breakdown === 'partners' ? partnerType(project) : breakdown === 'pairings' ? pairingKind(project) : 'all';

const Swatch = ({ color }: { color: string }) => <span className="stats-swatch" style={{ background: color }} aria-hidden="true" />;

/** A Win98 column chart of releases per year, optionally stacked; hovering a column shows its exact counts, clicking picks the year. */
function YearChart({ releases, breakdown, label, selected, onPick }: {
  releases: readonly Collaboration[]; breakdown: YearBreakdown; label: string;
  selected?: number; onPick: (year: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const segments = SEGMENTS[breakdown];
  const { counts, bySegment, totals } = useMemo(() => {
    const bySegment = new Map<number, Map<string, number>>();
    const totals = new Map<string, number>();
    for (const project of releases) {
      const key = segmentOf(breakdown, project);
      const year = bySegment.get(project.year) ?? new Map<string, number>();
      year.set(key, (year.get(key) ?? 0) + 1);
      bySegment.set(project.year, year);
      totals.set(key, (totals.get(key) ?? 0) + 1);
    }
    return { counts: tally(releases.map((project) => project.year)), bySegment, totals };
  }, [releases, breakdown]);
  const columns = useMemo(() => chartColumns(counts), [counts]);
  if (!columns.length) return <p className="hint">Nothing to count with the current filters.</p>;
  const years = [...counts.keys()];
  const first = Math.min(...years), last = Math.max(...years);
  const max = Math.max(...counts.values());
  const span = columns.length;
  // Label roughly every fifth of the range, on round years.
  const step = [1, 2, 5, 10, 20, 25, 50].find((s) => span / s <= 8) ?? 100;
  const stacked = segments.length > 1;
  const parts = (year: number) => segments.map((segment) => [segment, bySegment.get(year)?.get(segment.key) ?? 0] as const);
  const tipText = (column: ChartColumn) => column.kind === 'year'
    ? `${column.year}: ${releasesText(column.count)}${stacked && column.count ? ` (${parts(column.year).filter(([, n]) => n).map(([segment, n]) => `${segment.label} ${n}`).join(', ')})` : ''}`
    : `${column.from}–${column.to}: no releases`;
  const hovered = hover === null ? undefined : columns[hover];
  // Keep the tooltip inside the plot: anchor it left, centred or right depending on the column.
  const tipAlign = hover === null ? '' : hover < span * 0.2 ? 'start' : hover > span * 0.8 ? 'end' : 'center';
  return <>
    <div className="sunken-panel stats-chart" role="group" aria-label={`${label}, ${first}–${last}; peak ${max} in ${years.find((y) => counts.get(y) === max)}`}>
      <div className="stats-chart-scale" aria-hidden="true"><span>{max}</span><span>0</span></div>
      <div className="stats-chart-plot" onMouseLeave={() => setHover(null)}>
        {columns.map((column, i) => {
          const edge = i === 0 || i === span - 1;
          if (column.kind === 'gap') return <div key={`gap-${column.from}`} className="stats-chart-col stats-chart-gap" onMouseEnter={() => setHover(i)}>
            <span className="stats-chart-track"><span className="stats-chart-break" aria-hidden="true">≈</span></span>
            <span className="stats-chart-year" />
          </div>;
          return <button type="button" key={column.year} aria-disabled={!column.count || undefined}
            className={`stats-chart-col${hover === i ? ' hover' : ''}${selected === column.year ? ' selected' : ''}`}
            aria-label={tipText(column)} aria-pressed={selected === column.year}
            onMouseEnter={() => setHover(i)} onClick={() => { if (column.count) onPick(column.year); }}>
            <span className="stats-chart-track"><span className="stats-chart-bar" style={{ height: `${(column.count / max) * 100}%` }}>
              {column.count > 0 && parts(column.year).map(([segment, n]) => n > 0 &&
                <span key={segment.key} className="stats-chart-seg" style={{ height: `${(n / column.count) * 100}%`, background: segment.color }} />)}
            </span></span>
            <span className="stats-chart-year">{column.year % step === 0 || edge ? column.year : ''}</span>
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
    {stacked && <ul className="stats-legend" aria-label="Chart colours">
      {[...segments].reverse().map((segment) => {
        const n = totals.get(segment.key) ?? 0;
        return <li key={segment.key} title={segment.hint}><Swatch color={segment.color} />{segment.label} <span className="stats-legend-count">{n.toLocaleString()} ({Math.round((n / releases.length) * 100)}%)</span></li>;
      })}
    </ul>}
  </>;
}

/** The Collaborations by year section: the "Colour by" picker, the chart and the picked year's releases. */
function YearSection({ releases, house }: { releases: readonly Collaboration[]; house: (id: string) => ReactNode }) {
  const [breakdown, setBreakdown] = useState<YearBreakdown>(() => {
    try {
      const stored = localStorage.getItem(BREAKDOWN_KEY);
      return BREAKDOWN_VALUES.find((value) => value === stored) ?? 'total';
    } catch { return 'total'; }
  });
  const pickBreakdown = (next: YearBreakdown) => {
    setBreakdown(next);
    try { localStorage.setItem(BREAKDOWN_KEY, next); } catch { /* storage unavailable */ }
  };
  // The year picked on the chart; dropped when the filters leave it without releases.
  const [pickedYear, setPickedYear] = useState<number>();
  const chartYear = pickedYear !== undefined && releases.some((project) => project.year === pickedYear) ? pickedYear : undefined;
  return <ProfileSection title="Collaborations by year">
    <div className="field-row stats-limit">
      <span>Colour by</span>
      <SelectBox label="Colour the chart by" values={BREAKDOWN_VALUES} value={breakdown} onChange={pickBreakdown}
        text={(value) => BREAKDOWNS.find(([key]) => key === value)![1]} />
    </div>
    <YearChart releases={releases} breakdown={breakdown} label="Collaboration releases per year" selected={chartYear}
      onPick={(picked) => setPickedYear((current) => current === picked ? undefined : picked)} />
    {chartYear === undefined
      ? releases.length > 0 && <p className="hint">Click a column to list that year's releases.</p>
      : <YearReleases year={chartYear} releases={releases} breakdown={breakdown} house={house} />}
  </ProfileSection>;
}

/** The releases of one year from the chart, each as its linked participating brands, grouped by the chart's colours. */
function YearReleases({ year, releases, breakdown, house }: {
  year: number; releases: readonly Collaboration[]; breakdown: YearBreakdown; house: (id: string) => ReactNode;
}) {
  const segments = SEGMENTS[breakdown];
  const stacked = segments.length > 1;
  const rows = useMemo(() => releases.filter((project) => project.year === year)
    .map((project) => {
      const key = segmentOf(breakdown, project);
      return { id: project.id, segment: segments.find((segment) => segment.key === key)!,
        houses: [...new Set(project.houses)].sort((a, b) => houseName(a).localeCompare(houseName(b))) };
    })
    .sort((a, b) => (stacked ? segments.indexOf(b.segment) - segments.indexOf(a.segment) : 0)
      || a.houses.map(houseName).join(' ').localeCompare(b.houses.map(houseName).join(' '))), [releases, year, breakdown, segments, stacked]);
  return <>
    <p className="stats-year-heading"><strong>{year}</strong>: {releasesText(rows.length)}</p>
    <RowLimitedPanel rows={STATS_VISIBLE_ROWS} className="stats-table"><table aria-label={`Collaboration releases in ${year}`}>
      <thead><tr><th className="stats-rank">#</th><th className="stats-label">Brands</th>{stacked && <th className="stats-label">Type</th>}</tr></thead>
      <tbody>{rows.map((row, index) => <tr key={row.id}>
        <td className="stats-rank">{index + 1}</td>
        <td className="stats-label" title={row.houses.map(houseName).join(' × ')}>{row.houses.map((id, i) => <span key={id}>{i > 0 && ' × '}{house(id)}</span>)}</td>
        {stacked && <td className="stats-label nowrap"><Swatch color={row.segment.color} />{row.segment.label}</td>}
      </tr>)}</tbody>
    </table></RowLimitedPanel>
  </>;
}

/**
 * Brands by collaboration releases and distinct partner brands, side by side.
 * Clicking either column heading sorts by it, high to low; clicking it again
 * flips to low to high, leaving out brands with none (ties fall back to the
 * other column, then the name).
 */
function CollaborationsSection({ releases, partners, house, controls }: {
  releases: Map<string, number>; partners: Map<string, number>;
  house: (id: string) => ReactNode; controls?: ReactNode;
}) {
  const [sort, setSort] = useState<{ key: 'releases' | 'partners'; ascending: boolean }>({ key: 'releases', ascending: false });
  const rows = useMemo(() => {
    const [first, second] = sort.key === 'releases' ? [releases, partners] : [partners, releases];
    const direction = sort.ascending ? -1 : 1;
    // Low to high skips brands with nothing in the sorted column, so it starts at 1.
    return [...releases.keys()].filter((id) => !sort.ascending || (first.get(id) ?? 0) > 0).sort((a, b) =>
      direction * ((first.get(b) ?? 0) - (first.get(a) ?? 0) || (second.get(b) ?? 0) - (second.get(a) ?? 0))
      || houseName(a).localeCompare(houseName(b)));
  }, [releases, partners, sort]);
  const heading = (key: typeof sort.key, text: string) => {
    const active = sort.key === key;
    return <th className="stats-count" aria-sort={active ? (sort.ascending ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className="stats-sort" title={active && !sort.ascending ? 'Sort low to high' : 'Sort high to low'}
        onClick={() => setSort({ key, ascending: active && !sort.ascending })}>{text}{active ? (sort.ascending ? ' ▲' : ' ▼') : ''}</button>
    </th>;
  };
  return <LimitedSection title="Most collaborations" controls={controls}>{(limit) => rows.length
    ? <RowLimitedPanel rows={STATS_VISIBLE_ROWS} className="stats-table"><table aria-label={`Brands by number of ${sort.key === 'releases' ? 'collaborations' : 'distinct partner brands'}`}>
      <thead><tr><th className="stats-rank">#</th><th className="stats-label">Brand</th>{heading('releases', 'Releases')}{heading('partners', 'Partners')}</tr></thead>
      <tbody>{rows.slice(0, limit).map((id, index) => <tr key={id}>
        <td className="stats-rank">{index + 1}</td>
        <td className="stats-label" title={houseName(id)}>{house(id)}</td>
        <td className="stats-count">{(releases.get(id) ?? 0).toLocaleString()}</td>
        <td className="stats-count">{(partners.get(id) ?? 0).toLocaleString()}</td>
      </tr>)}</tbody>
    </table></RowLimitedPanel>
    : <p className="hint">Nothing to count with the current filters.</p>}
  </LimitedSection>;
}

/**
 * Statistics for the brands the year and tag filters show: totals, market
 * tiers, countries, cities and the most connected people
 * and brands. Names open their Properties or place windows.
 */
export function StatisticsContent({ visibleHouses, year, filtered, onSelect, onOpenPlace }: {
  visibleHouses: readonly House[]; year: number; filtered: boolean;
} & Pick<Actions, 'onSelect' | 'onOpenPlace'>) {
  const [withRetailers, toggleRetailers] = useRememberedToggle(RETAILER_COLLABS_KEY);
  const [pairsWithRetailers, togglePairRetailers] = useRememberedToggle(RETAILER_PAIRS_KEY);
  const stats = useMemo(() => {
    const ids = new Set(visibleHouses.map((house) => house.id));
    const main = visibleHouses.filter((house) => !house.parentHouse);
    const started = (start?: number) => year === Infinity || (start !== undefined && start <= year);
    const active = visibleHouses.filter((house) => house.closed === undefined || house.closed > year).length;
    const people = designers.filter((designer) => designer.career.some((tenure) => ids.has(tenure.house) && started(tenure.start)));
    const moves = allMoves().filter((move) => move.year <= year && ids.has(move.to.house) && ids.has(move.from.house));
    const releases = collaborations.filter((project) => project.year <= year && project.houses.every((id) => ids.has(id)));
    const countries = tally(main.map((house) => house.country));
    const cities = tally(main.map((house) => house.city));
    const tiers = tally(visibleHouses.map((house) => house.tags.marketPositioning));
    const directors = main.map((house) => [house, new Set(tenuresAt(house.id)
      .filter((tenure) => tenure.role !== 'Other' && !isBusinessLeadership(tenure) && started(tenure.start)).map((tenure) => tenure.designerId)).size] as const);
    const moveYears = tally(moves.map((move) => move.year));
    // Creative-director stints with known years; a current one runs to this year (or the year filter).
    const now = Math.min(new Date().getFullYear(), year);
    const tenures = main.flatMap((house) => tenuresAt(house.id)
      .flatMap((tenure) => {
        const { start, end: recorded } = tenure;
        // Unknown start or end (omitted `end`) can't be measured.
        // Appointed creative leadership only: founders and family heads of house are a different measure.
        if (tenure.role === 'Other' || tenure.role === 'Founder' || tenure.role === 'Head of House' || isBusinessLeadership(tenure) || start === undefined || start > now || recorded === undefined) return [];
        const end = recorded === null ? now : Math.min(recorded, now);
        return [{ house, tenure, years: end - start, current: recorded === null || recorded > now }];
      }))
      .filter((stint) => stint.years > 0);
    return {
      brands: visibleHouses.length, main: main.length, active, people: people.length, moves: moves.length, releases,
      groups: groups.filter((group) => visibleHouses.some((house) => house.parentGroup === group.id)).length,
      countries, cities, tiers, directors, moveYears, tenures,
    };
  }, [visibleHouses, year]);

  // Only the Most collaborations and Most frequent pairings tables follow their retailer checkboxes.
  const ranking = useMemo(() => {
    const releases = withRetailers ? stats.releases : stats.releases.filter((project) => !involvesRetailer(project));
    const collaborative = tally(releases.flatMap((project) => project.houses));
    // Distinct partner brands per brand, however many releases they shared.
    const partners = new Map<string, Set<string>>();
    for (const project of releases) for (const id of project.houses) {
      const set = partners.get(id) ?? new Set<string>();
      for (const other of project.houses) if (other !== id) set.add(other);
      partners.set(id, set);
    }
    return { collaborative, uniquePartners: new Map([...partners].map(([id, set]) => [id, set.size] as const)) };
  }, [stats.releases, withRetailers]);
  const pairs = useMemo(() => tallyPairs(pairsWithRetailers ? stats.releases : stats.releases.filter((project) => !involvesRetailer(project))),
    [stats.releases, pairsWithRetailers]);

  const house = (id: string) => <EntityLink kind="house" id={id} onSelect={onSelect}>{houseName(id)}</EntityLink>;
  return <>
    <h2>Statistics</h2>
    <p className="hint">{filtered ? `For the brands matching the current ${year === Infinity ? '' : 'year and '}filters.`
      : year === Infinity ? 'For every brand on the map.' : `For brands founded by ${year}.`}</p>
    <ProfileSection title="Overview">
      <Fields rows={[
        ['Brands', `${stats.brands.toLocaleString()} (${stats.main.toLocaleString()} main brands, ${(stats.brands - stats.main).toLocaleString()} sublabels)`],
        ['Active', `${stats.active.toLocaleString()} active · ${(stats.brands - stats.active).toLocaleString()} ended`],
        ['People', stats.people.toLocaleString()],
        ['Career moves', stats.moves.toLocaleString()],
        ['Collaborations', stats.releases.length.toLocaleString()],
        ['Groups', stats.groups.toLocaleString()],
        ['Countries', stats.countries.size.toLocaleString()],
        ['Cities', stats.cities.size.toLocaleString()],
      ]} />
    </ProfileSection>
    <ProfileSection title="Market positioning">
      <BarTable heading="Tier" ranked={false} label="Brands by market positioning"
        rows={marketPositionings.filter((tier) => stats.tiers.has(tier)).map((tier) => ({ key: tier, label: tier, count: stats.tiers.get(tier)! }))} />
    </ProfileSection>
    <ProfileSection title={`Top countries (of ${stats.countries.size})`}>
      <BarTable heading="Country" label="Main brands by country" rows={top(stats.countries).map(([code, count]) => ({ key: code, count,
        label: <PlaceLink place={{ kind: 'country', id: code as CountryCode }} onOpenPlace={onOpenPlace}>{countryNames[code as CountryCode]}</PlaceLink> }))} />
    </ProfileSection>
    <ProfileSection title={`Top cities (of ${stats.cities.size})`}>
      <BarTable heading="City" label="Main brands by city" rows={top(stats.cities).map(([city, count]) => ({ key: city, count,
        label: <PlaceLink place={{ kind: 'city', id: mapLocationForCity(city) }} onOpenPlace={onOpenPlace}>{city}</PlaceLink> }))} />
    </ProfileSection>
    <ProfileSection title="Longest creative director tenures">
      <BarTable heading="Creative director" columns={['Brand', 'Tenure']} countHeading="Years" label="Longest creative director tenures"
        rows={[...stats.tenures].sort((a, b) => b.years - a.years).slice(0, STATS_TOP).map(({ house: brand, tenure, years, current }) => ({
          key: `${tenure.designerId}:${brand.id}:${tenure.start}`, count: years,
          label: <EntityLink kind="designer" id={tenure.designerId} onSelect={onSelect}>{getDesigner(tenure.designerId)?.name ?? tenure.designerId}</EntityLink>,
          cells: [house(brand.id), <span className="nowrap">{tenure.start}–{current ? 'present' : tenure.end}</span>],
        }))} />
    </ProfileSection>
    <ProfileSection title="Busiest years for moves">
      <BarTable heading="Year" countHeading="Moves" label="Years with the most career moves"
        rows={top(stats.moveYears).map(([moveYear, count]) => ({ key: String(moveYear), label: String(moveYear), count }))} />
    </ProfileSection>
    <ProfileSection title="Most creative directors">
      <BarTable heading="Brand" label="Brands by number of creative directors" rows={top(stats.directors.filter(([, count]) => count > 0))
        .map(([brand, count]) => ({ key: brand.id, count, label: house(brand.id) }))} />
    </ProfileSection>
    <CollaborationsSection releases={ranking.collaborative} partners={ranking.uniquePartners} house={house} controls={
      <RetailerToggle id="stats-retailer-collabs" checked={withRetailers} onChange={toggleRetailers} />} />
    <YearSection releases={stats.releases} house={house} />
    <LimitedSection title="Most frequent pairings" controls={
      <RetailerToggle id="stats-retailer-pairs" checked={pairsWithRetailers} onChange={togglePairRetailers} />}>{(limit) =>
      <BarTable heading="Brands" countHeading="Releases" label="Brand pairs with the most collaborations"
        rows={top(pairs, limit).map(([pair, count]) => {
          const [a, b] = pair.split('|') as [string, string];
          return { key: pair, count, label: <>{house(a)} × {house(b)}</>, title: `${houseName(a)} × ${houseName(b)}` };
        })} />}
    </LimitedSection>
  </>;
}
