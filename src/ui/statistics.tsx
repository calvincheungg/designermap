import { readJson, readSetting, writeJson, writeSetting } from './storage';
import { Fragment, useId, useMemo, useState, type ReactNode } from 'react';
import { allMoves, BrandCategory, collaborations, countryNames, designers, getDesigner, getHouse, groups, isBusinessLeadership, marketPositionings, tenuresAt, type CountryCode } from '../data';
import type { Collaboration, House } from '../types';
import { MarketPositioning } from '../data/tags';
import { mapLocationForCity } from '../graph/locations';
import { Tabs } from './tabs';
import { EntityLink, Fields, PlaceLink, ProfileSection, RowLimitedPanel, type Actions } from './panel';
import { SearchBox, SelectBox, type ListItem } from './listbox';
import { filterFields, type FilterGroup } from './filters';
import { tagLabel } from './labels';
import { DIMENSIONS, dimensionValues, diversityRows, partnersByBrand, type Dimension, type DiversityMode } from './collab-diversity';
import { BarTable, houseName, involvesRetailer, LimitedSection, RetailerToggle, STATS_TOP, STATS_VISIBLE_ROWS, tally, top, useRememberedChoice, useRememberedToggle } from './stats-shared';
import { MIN_SHARE_RELEASES, releasesText, Swatch, TOTAL_SCHEME, YearChart, type Scheme, type Segment } from './year-chart';
import { DegreesSection, HeatmapSection, PairingsSection } from './stats-connections';
import { DecadesSection, IncubatorsSection, RelocationsSection, TrendsSection } from './stats-trends';

/** Remember, per table, whether it counts releases with a retailer. */
const RETAILER_COLLABS_KEY = 'designer-map:stats-retailer-collabs';
const RETAILER_DIVERSE_KEY = 'designer-map:stats-retailer-diverse';

/** How the Collaborations by year bars are split: one colour, by partner type, or first-time vs repeat pairings. */
export type YearBreakdown = 'total' | 'partners' | 'pairings' | 'tags';
const BREAKDOWNS: readonly (readonly [YearBreakdown, string])[] = [['total', 'Total'], ['partners', 'Partner type'], ['pairings', 'First-time vs repeat'], ['tags', 'My tags…']];
const BREAKDOWN_VALUES = BREAKDOWNS.map(([value]) => value);
const BREAKDOWN_KEY = 'designer-map:stats-year-breakdown';
/** Collaborations by year: bar heights as release counts, or as each colour's share of the year's releases. */
export type YearScale = 'count' | 'share';
const SCALES: readonly (readonly [YearScale, string])[] = [['count', 'Count'], ['share', 'Share of year']];
const SCALE_VALUES = SCALES.map(([value]) => value);
const SCALE_KEY = 'designer-map:stats-year-scale';
/** Collaborations by year drawn as (stacked) bars or as one line per colour. */
export type YearStyle = 'bars' | 'lines';
const STYLES: readonly (readonly [YearStyle, string])[] = [['bars', 'Bars'], ['lines', 'Lines']];
const STYLE_VALUES = STYLES.map(([value]) => value);
const STYLE_KEY = 'designer-map:stats-year-style';
/** Bar segments per breakdown, bottom to top, in Win98's 16-colour palette. */
const SEGMENTS: Record<Exclude<YearBreakdown, 'tags'>, readonly Segment[]> = {
  total: TOTAL_SCHEME.segments,
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

/** One brand tag from the filter groups (`group` keeps Avant-garde the category apart from Avant-garde the aesthetic). */
export interface TagRef { group: FilterGroup; value: string }
/**
 * A "My tags" chart series: one tag (a release with any brand tagged it), or two tags
 * (one brand tagged the first with a different brand tagged the second; both can be the same tag).
 */
export type TagSeries = readonly [TagRef] | readonly [TagRef, TagRef];

/** Most series the chart holds, one per colour. */
export const MAX_TAG_SERIES = 6;
const SERIES_COLORS = ['#000080', '#800000', '#008000', '#800080', '#808000', '#008080'] as const;
const OTHER_TAGS: Segment = { key: 'other', label: 'Other', color: '#808080', hint: 'Matches none of your tags' };
const TAG_SERIES_KEY = 'designer-map:stats-year-tags';

const groupLabel = (group: FilterGroup) => filterFields.find(([key]) => key === group)![1];
export const seriesKey = (series: TagSeries) => series.map(({ group, value }) => `${group}:${value}`).join('×');
export const seriesLabel = (series: TagSeries) => series.map(({ value }) => tagLabel(value)).join(' × ');
const seriesHint = (series: TagSeries) => series.length === 1
  ? `A ${tagLabel(series[0].value)} brand (${groupLabel(series[0].group).toLowerCase()}) takes part`
  : `A ${tagLabel(series[0].value)} brand with a different ${tagLabel(series[1].value)} brand`;

/** Every tag a series can use, searchable by name, with its filter group as the hint. */
const TAG_ITEMS: readonly ListItem<TagRef>[] = filterFields.flatMap(([group, label, options]) =>
  options.map((value) => ({ label: tagLabel(value), hint: label, value: { group, value } })));

const validTag = (ref: unknown): ref is TagRef => !!ref && typeof ref === 'object'
  && filterFields.some(([group, , options]) => group === (ref as TagRef).group && (options as readonly string[]).includes((ref as TagRef).value));

function readTagSeries(): TagSeries[] {
  const stored = readJson(TAG_SERIES_KEY);
  if (!Array.isArray(stored)) return [];
  const valid = stored.filter((series): series is TagSeries => Array.isArray(series)
    && (series.length === 1 || series.length === 2) && series.every(validTag));
  return valid.filter((series, i) => valid.findIndex((other) => seriesKey(other) === seriesKey(series)) === i).slice(0, MAX_TAG_SERIES);
}

function hasTag(id: string, { group, value }: TagRef) {
  const tags: string | readonly string[] | undefined = getHouse(id)?.tags[group];
  return typeof tags === 'string' ? tags === value : !!tags?.includes(value);
}

/** Whether a release fits a tag series (see TagSeries). */
export function matchesSeries(project: Pick<Collaboration, 'houses'>, series: TagSeries): boolean {
  const ids = [...new Set(project.houses)];
  const [first, second] = series;
  if (!second) return ids.some((id) => hasTag(id, first));
  return ids.some((a) => hasTag(a, first) && ids.some((b) => b !== a && hasTag(b, second)));
}

/** The chart's colours, bottom to top, and the colour each release falls under. */

/** A release counts under the first of the user's series it fits (legend order), else Other. */
function tagScheme(list: readonly TagSeries[]): Scheme {
  if (!list.length) return { segments: SEGMENTS.total, of: () => 'all' };
  const segments = list.map((series, i) => ({ key: seriesKey(series), label: seriesLabel(series), color: SERIES_COLORS[i]!, hint: seriesHint(series) }));
  return {
    segments: [...segments, OTHER_TAGS],
    of: (project) => { const i = list.findIndex((series) => matchesSeries(project, series)); return i < 0 ? OTHER_TAGS.key : segments[i]!.key; },
  };
}

const builtInScheme = (breakdown: Exclude<YearBreakdown, 'tags'>): Scheme => ({
  segments: SEGMENTS[breakdown],
  of: (project) => breakdown === 'partners' ? partnerType(project) : breakdown === 'pairings' ? pairingKind(project) : 'all',
});

/** The Collaborations by year section: the "Colour by" picker, the chart and the picked year's releases. */
/** Releases the year chart shows: none dated after the current year (announced ones would end every line in a cliff). */
export function chartedReleases(releases: readonly Collaboration[], thisYear = new Date().getFullYear()) {
  return releases.filter((project) => project.year <= thisYear);
}

function YearSection({ releases: all, house }: { releases: readonly Collaboration[]; house: (id: string) => ReactNode }) {
  const thisYear = new Date().getFullYear();
  const releases = useMemo(() => chartedReleases(all, thisYear), [all, thisYear]);
  const upcoming = all.length - releases.length;
  const [scale, pickScale] = useRememberedChoice<YearScale>(SCALE_KEY, ['count', 'share'], 'count');
  const [style, pickStyle] = useRememberedChoice<YearStyle>(STYLE_KEY, ['bars', 'lines'], 'bars');
  const [breakdown, setBreakdown] = useRememberedChoice<YearBreakdown>(BREAKDOWN_KEY, BREAKDOWN_VALUES, 'total');
  const [tagSeries, setTagSeries] = useState<TagSeries[]>(readTagSeries);
  // The one colour shown on its own (a segment key of the current breakdown), if any.
  const [focus, setFocus] = useState<string>();
  const pickBreakdown = (next: YearBreakdown) => {
    setBreakdown(next);
    setFocus(undefined);
  };
  const changeSeries = (next: TagSeries[]) => {
    setTagSeries(next);
    setFocus(undefined);
    writeJson(TAG_SERIES_KEY, next);
  };
  const scheme = useMemo(() => breakdown === 'tags' ? tagScheme(tagSeries) : builtInScheme(breakdown), [breakdown, tagSeries]);
  // The year picked on the chart; dropped when the filters leave it without releases.
  const [pickedYear, setPickedYear] = useState<number>();
  const chartYear = pickedYear !== undefined && releases.some((project) => project.year === pickedYear
    && (!focus || scheme.of(project) === focus)) ? pickedYear : undefined;
  return <ProfileSection title="Collaborations by year">
    <div className="field-row stats-limit">
      <span>Colour by</span>
      <SelectBox label="Colour the chart by" values={BREAKDOWN_VALUES} value={breakdown} onChange={pickBreakdown}
        text={(value) => BREAKDOWNS.find(([key]) => key === value)![1]} />
    </div>
    {breakdown === 'tags' && <TagSeriesPicker series={tagSeries} onChange={changeSeries} />}
    <div className="field-row stats-limit">
      <span>Chart</span>
      <SelectBox label="Draw the chart as" values={STYLE_VALUES} value={style} onChange={pickStyle}
        text={(value) => STYLES.find(([key]) => key === value)![1]} />
      {/* Shares need colours to compare: with Total there is only one, so the chart stays in counts. */}
      {scheme.segments.length > 1 && <>
        <span>Show as</span>
        <SelectBox label="Show the chart as" values={SCALE_VALUES} value={scale} onChange={pickScale}
          text={(value) => SCALES.find(([key]) => key === value)![1]} />
      </>}
    </div>
    <YearChart releases={releases} scheme={scheme} label="Collaboration releases per year" selected={chartYear}
      share={scale === 'share' && scheme.segments.length > 1} lines={style === 'lines'}
      onPick={(picked, keep) => setPickedYear((current) => !keep && current === picked ? undefined : picked)}
      focus={focus} onFocus={setFocus} />
    {chartYear === undefined
      ? releases.length > 0 && <p className="hint">Click a column to list that year's releases{scheme.segments.length > 1 ? ', or a colour to show it on its own' : ''}.
        {scale === 'share' && scheme.segments.length > 1 && ` Years with fewer than ${MIN_SHARE_RELEASES} releases are left out, since one or two releases swing the share widely; hover a column for its counts.`}</p>
      : <YearReleases year={chartYear} releases={releases} scheme={scheme} house={house} focus={focus} onFocus={setFocus} />}
    {upcoming > 0 && <p className="hint">{releasesText(upcoming)} dated after {thisYear} {upcoming === 1 ? 'is' : 'are'} not charted yet.</p>}
  </ProfileSection>;
}

/** A tag typed in full (any case) counts as picked, so Add works without choosing from the list. */
function typedTag(text: string): TagRef | undefined {
  const name = text.trim().toLowerCase();
  const exact = TAG_ITEMS.filter((item) => item.label.toLowerCase() === name);
  return exact.length === 1 ? exact[0]!.value : undefined;
}

/**
 * "My tags": the chart's series as removable chips, plus two searchable tag boxes and Add.
 * One tag charts releases with a brand tagged it; a second tag charts that brand with a different brand tagged the second.
 */
function TagSeriesPicker({ series, onChange }: { series: readonly TagSeries[]; onChange: (next: TagSeries[]) => void }) {
  const id = useId();
  const [firstText, setFirstText] = useState('');
  const [secondText, setSecondText] = useState('');
  const [firstPick, setFirstPick] = useState<TagRef>();
  const [secondPick, setSecondPick] = useState<TagRef>();
  const first = firstPick ?? typedTag(firstText);
  const second = secondPick ?? typedTag(secondText);
  const unknownSecond = !!secondText.trim() && !second;
  const candidate: TagSeries | undefined = first ? (second ? [first, second] : [first]) : undefined;
  const duplicate = !!candidate && series.some((existing) => seriesKey(existing) === seriesKey(candidate)
    || (candidate.length === 2 && seriesKey(existing) === seriesKey([candidate[1], candidate[0]])));
  const full = series.length >= MAX_TAG_SERIES;
  const problem = full ? `Up to ${MAX_TAG_SERIES} tags; remove one to add another.`
    : duplicate ? 'Already on the chart.'
    : unknownSecond ? 'Pick the second tag from the list, or clear it.'
    : (firstText.trim() && !first) ? 'Pick a tag from the list.' : undefined;
  const add = () => {
    if (!candidate || duplicate || full || unknownSecond) return;
    onChange([...series, candidate]);
    setFirstText(''); setSecondText(''); setFirstPick(undefined); setSecondPick(undefined);
  };
  return <div className="stats-tag-picker">
    {series.length > 0 && <ul className="stats-tag-chips" aria-label="Your chart tags">
      {series.map((item, i) => <li key={seriesKey(item)}>
        <button type="button" className="filter-chip" title={`${seriesHint(item)}. Click to remove`}
          aria-label={`Remove ${seriesLabel(item)} from the chart`} onClick={() => onChange(series.filter((_, j) => j !== i))}>
          <Swatch color={SERIES_COLORS[i]!} />{seriesLabel(item)} ×
        </button>
      </li>)}
    </ul>}
    <form className="stats-tag-form" onSubmit={(event) => { event.preventDefault(); add(); }}>
      <SearchBox items={TAG_ITEMS} value={firstText} label="Tag:" inputId={`${id}-first`} placeholder="Search tags" limit={Infinity} dropButton
        onChange={(text) => { setFirstText(text); setFirstPick(undefined); }} onPick={(item) => setFirstPick(item.value)} />
      <SearchBox items={TAG_ITEMS} value={secondText} label="with:" inputId={`${id}-second`} placeholder="Any brand (optional)" limit={Infinity} dropButton
        onChange={(text) => { setSecondText(text); setSecondPick(undefined); }} onPick={(item) => setSecondPick(item.value)} />
      <button type="submit" disabled={!candidate || !!problem}>Add</button>
    </form>
    <p className="hint">{problem ?? (series.length
      ? 'Each release counts under the first tag it matches, in this order. Click a tag above to remove it.'
      : 'Pick a tag to chart its collaborations; add a second to see releases between brands of the two tags (e.g. Luxury with Streetwear).')}</p>
  </div>;
}

/** The releases of one year from the chart, each as its linked participating brands, grouped by the chart's colours. */
function YearReleases({ year, releases, scheme, house, focus, onFocus }: {
  year: number; releases: readonly Collaboration[]; scheme: Scheme; house: (id: string) => ReactNode;
  focus?: string; onFocus: (segment: string | undefined) => void;
}) {
  const segments = scheme.segments;
  const stacked = segments.length > 1;
  const focused = segments.find((segment) => segment.key === focus);
  const rows = useMemo(() => releases.filter((project) => project.year === year)
    .map((project) => {
      const key = scheme.of(project);
      return { id: project.id, segment: segments.find((segment) => segment.key === key)!,
        houses: [...new Set(project.houses)].sort((a, b) => houseName(a).localeCompare(houseName(b))) };
    })
    .filter((row) => !focus || row.segment.key === focus)
    .sort((a, b) => (stacked ? segments.indexOf(b.segment) - segments.indexOf(a.segment) : 0)
      || a.houses.map(houseName).join(' ').localeCompare(b.houses.map(houseName).join(' '))), [releases, year, scheme, segments, stacked, focus]);
  return <>
    <p className="stats-year-heading"><strong>{year}</strong>: {releasesText(rows.length)}{focused && <> ({focused.label})</>}</p>
    <RowLimitedPanel rows={STATS_VISIBLE_ROWS} className="stats-table"><table aria-label={`Collaboration releases in ${year}`}>
      <thead><tr><th className="stats-rank">#</th><th className="stats-label">Brands</th>{stacked && <th className="stats-label">Type</th>}</tr></thead>
      <tbody>{rows.map((row, index) => <tr key={row.id}>
        <td className="stats-rank">{index + 1}</td>
        <td className="stats-label" title={row.houses.map(houseName).join(' × ')}>{row.houses.map((id, i) => <span key={id}>{i > 0 && ' × '}{house(id)}</span>)}</td>
        {stacked && <td className="stats-label nowrap">
          <button type="button" className="stats-type" aria-pressed={row.segment.key === focus}
            title={row.segment.key === focus ? 'Show every colour' : `Show only ${row.segment.label}`}
            onClick={() => onFocus(row.segment.key === focus ? undefined : row.segment.key)}>
            <Swatch color={row.segment.color} />{row.segment.label}
          </button>
        </td>}
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

const DIVERSITY_MODE_KEY = 'designer-map:stats-diverse-mode';
const DIVERSITY_DIMENSIONS_KEY = 'designer-map:stats-diverse-include';
const DIVERSITY_MIN_KEY = 'designer-map:stats-diverse-min';
const MIN_PARTNERS = [5, 10, 20, 50] as const;
const DEFAULT_MIN_PARTNERS = 20; // Below this, small samples dominate Variety.
const DIMENSION_LABELS: Record<Dimension, { title: string; column: string; differ: string; reached: string }> = {
  category: { title: 'Categories', column: 'Categories', differ: 'are in different brand categories', reached: 'brand categories' },
  market: { title: 'Market positions', column: 'Market', differ: 'have different market positions', reached: 'market positions' },
  country: { title: 'Countries', column: 'Countries', differ: 'are based in different countries', reached: 'countries' },
};
type DiversitySort = Dimension | 'partners' | 'overall';
const DIVERSITY_SORTS: readonly DiversitySort[] = ['partners', ...DIMENSIONS, 'overall'];
const sortLabel = (key: DiversitySort) => key === 'partners' ? 'Partners' : key === 'overall' ? 'Overall' : DIMENSION_LABELS[key].column;

/** Where a brand's scores come from: its partners counted by each dimension, scores included. */
function DiversityBreakdown({ partners, scores }: { partners: ReadonlySet<string>; scores: (key: Dimension) => string }) {
  return <div className="stats-diverse-breakdown">{DIMENSIONS.map((dimension) => {
    const counts = tally([...partners].flatMap((id) => dimensionValues(id, dimension)));
    const rows = top(counts, Infinity);
    const max = Math.max(1, ...counts.values());
    return <div key={dimension}>
      <strong>{DIMENSION_LABELS[dimension].title}</strong> ({scores(dimension)})
      <ul>{rows.map(([value, count]) => <li key={value}>
        <span className="stats-diverse-value" title={value}>{value}</span>
        <span className="stats-diverse-track" aria-hidden="true"><span className="stats-bar" style={{ width: `${(count / max) * 100}%` }} /></span>
        <span className="stats-diverse-n">{count}</span>
      </li>)}</ul>
    </div>;
  })}</div>;
}

/**
 * Brands whose collaboration partners differ most in category, market position
 * and country. Settings are remembered; a row opens the partner counts behind it.
 */
function DiversitySection({ releases, house }: { releases: readonly Collaboration[]; house: (id: string) => ReactNode }) {
  const id = useId();
  const [withRetailers, toggleRetailers] = useRememberedToggle(RETAILER_DIVERSE_KEY);
  const [mode, setMode] = useState<DiversityMode>(() => readSetting(DIVERSITY_MODE_KEY, (stored) => stored === 'reach' ? 'reach' : 'variety', 'variety'));
  const [included, setIncluded] = useState<readonly Dimension[]>(() => readSetting(DIVERSITY_DIMENSIONS_KEY, (stored) => {
    const list = stored.split(',');
    const valid = DIMENSIONS.filter((dimension) => list.includes(dimension));
    return valid.length ? valid : undefined;
  }, DIMENSIONS));
  const [min, setMin] = useState<number>(() => readSetting<number>(DIVERSITY_MIN_KEY, (stored) => MIN_PARTNERS.find((value) => String(value) === stored), DEFAULT_MIN_PARTNERS));
  const [sort, setSort] = useState<{ key: DiversitySort; ascending: boolean }>({ key: 'overall', ascending: false });
  const [opened, setOpened] = useState<string>();
  const pickMode = (next: DiversityMode) => { setMode(next); writeSetting(DIVERSITY_MODE_KEY, next); };
  const pickMin = (next: number) => { setMin(next); writeSetting(DIVERSITY_MIN_KEY, String(next)); };
  const toggle = (dimension: Dimension) => {
    const next = DIMENSIONS.filter((key) => (key === dimension) !== included.includes(key));
    if (!next.length) return;
    setIncluded(next);
    writeSetting(DIVERSITY_DIMENSIONS_KEY, next.join(','));
  };
  const partners = useMemo(() => partnersByBrand(withRetailers ? releases : releases.filter((project) => !involvesRetailer(project))), [releases, withRetailers]);
  const scored = useMemo(() => diversityRows(partners, mode, included, min), [partners, mode, included, min]);
  const rows = useMemo(() => {
    const value = (row: typeof scored[number]) => sort.key === 'partners' ? row.partners.size : sort.key === 'overall' ? row.overall : row.scores[sort.key];
    const direction = sort.ascending ? 1 : -1;
    return [...scored].sort((a, b) => direction * (value(a) - value(b)) || b.overall - a.overall
      || b.partners.size - a.partners.size || houseName(a.id).localeCompare(houseName(b.id)));
  }, [scored, sort]);
  const most = useMemo(() => Object.fromEntries(DIMENSIONS.map((dimension) =>
    [dimension, Math.max(1, ...scored.map((row) => row.scores[dimension]))])) as Record<Dimension, number>, [scored]);

  const hint = (key: DiversitySort) => key === 'partners' ? 'Distinct partner brands'
    : key === 'overall' ? `Average rank among the ${scored.length} brands compared, from 0 (lowest) to 100 (highest), over the ticked measures`
    : mode === 'reach' ? `How many ${DIMENSION_LABELS[key].reached} its partners cover`
    : `Chance that two partners picked at random ${DIMENSION_LABELS[key].differ}`;
  const heading = (key: DiversitySort) => {
    const active = sort.key === key;
    return <th key={key} className={`stats-count stats-diverse-${key}`} aria-sort={active ? (sort.ascending ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className="stats-sort" title={hint(key)}
        onClick={() => setSort({ key, ascending: active && !sort.ascending })}>{sortLabel(key)}{active ? (sort.ascending ? ' ▲' : ' ▼') : ''}</button>
    </th>;
  };
  const scoreText = (score: number) => mode === 'reach' ? String(score) : `${Math.round(score * 100)}%`;
  const cell = (key: DiversitySort, text: string, share: number) => <td key={key} className={`stats-count stats-diverse-${key}`}>
    <span className="stats-diverse-cell"><span className="stats-diverse-track" aria-hidden="true"><span className="stats-bar" style={{ width: `${share * 100}%` }} /></span>
      <span className="stats-diverse-n">{text}</span></span>
  </td>;

  return <LimitedSection title="Most diverse collaborators" controls={<>
    <span>Min. partners</span>
    <SelectBox label="Fewest partners to be listed" values={MIN_PARTNERS} value={min} onChange={pickMin} />
    <RetailerToggle id="stats-retailer-diverse" checked={withRetailers} onChange={toggleRetailers} />
  </>}>{(limit) => <div className="stats-diverse">
    <div className="field-row stats-limit" role="radiogroup" aria-label="Rank by">
      <span>Rank by</span>
      {([['variety', 'Variety', 'How evenly its partners are spread'], ['reach', 'Number reached', 'How many different values its partners cover']] as const).map(([value, text, title]) =>
        <span key={value} className="stats-diverse-option" title={title}>
          <input type="radio" id={`${id}-${value}`} name={`${id}-mode`} checked={mode === value} onChange={() => pickMode(value)} />
          <label htmlFor={`${id}-${value}`}>{text}</label>
        </span>)}
    </div>
    <div className="field-row stats-limit" role="group" aria-label="Measures in Overall">
      <span>Overall uses</span>
      {DIMENSIONS.map((dimension) => <span key={dimension} className="stats-diverse-option">
        <input type="checkbox" id={`${id}-${dimension}`} checked={included.includes(dimension)}
          disabled={included.length === 1 && included[0] === dimension} onChange={() => toggle(dimension)} />
        <label htmlFor={`${id}-${dimension}`}>{DIMENSION_LABELS[dimension].title}</label>
      </span>)}
    </div>
    <div className="field-row stats-limit stats-diverse-sort">
      <span>Sort by</span>
      <SelectBox label="Sort diverse collaborators by" values={DIVERSITY_SORTS} value={sort.key} text={sortLabel} onChange={(key) => setSort({ key, ascending: false })} />
    </div>
    <p className="hint">{mode === 'variety' ? 'Percentages are the chance that two of a brand’s partners, picked at random, differ.'
      : 'Counts are how many different values a brand’s partners cover.'} Overall is its average rank from 0 to 100. Click a row for its partners.</p>
    {rows.length ? <RowLimitedPanel rows={STATS_VISIBLE_ROWS} className="stats-table"><table aria-label="Brands with the most diverse collaborations" data-sort={sort.key}>
      <thead><tr><th className="stats-rank">#</th><th className="stats-label">Brand</th>{DIVERSITY_SORTS.map(heading)}</tr></thead>
      <tbody>{rows.slice(0, limit).map((row, index) => {
        const open = opened === row.id;
        const flip = () => setOpened(open ? undefined : row.id);
        return <Fragment key={row.id}>
          <tr className="stats-open-row" onClick={(event) => {
            // Brand links and the arrow handle their own clicks.
            if (!(event.target as Element).closest('a, button')) flip();
          }}>
            <td className="stats-rank">{index + 1}</td>
            <td className="stats-label" title={houseName(row.id)}>
              <button type="button" className="stats-open-toggle" aria-expanded={open} aria-label={`Partner breakdown for ${houseName(row.id)}`} onClick={flip}>{open ? '▾' : '▸'}</button>
              {house(row.id)}
            </td>
            <td className="stats-count stats-diverse-partners">{row.partners.size.toLocaleString()}</td>
            {DIMENSIONS.map((key) => cell(key, scoreText(row.scores[key]), mode === 'reach' ? row.scores[key] / most[key] : row.scores[key]))}
            {cell('overall', String(Math.round(row.overall)), row.overall / 100)}
          </tr>
          {open && <tr><td colSpan={2 + DIVERSITY_SORTS.length}><DiversityBreakdown partners={row.partners} scores={(key) => scoreText(row.scores[key])} /></td></tr>}
        </Fragment>;
      })}</tbody>
    </table></RowLimitedPanel> : <p className="hint">No brand has {min} or more partners with the current filters.</p>}
    {rows.length > 0 && <p className="hint">{rows.length.toLocaleString()} {rows.length === 1 ? 'brand' : 'brands'} with at least {min} partners compared.</p>}
  </div>}</LimitedSection>;
}

export type StatsTab = 'overview' | 'collaborations' | 'connections' | 'people' | 'places';
const TABS: readonly (readonly [StatsTab, string])[] = [['overview', 'Overview'], ['collaborations', 'Collaborations'], ['connections', 'Connections'], ['people', 'People'], ['places', 'Brands & places']];
const TAB_KEY = 'designer-map:stats-tab';

/**
 * Statistics for the brands the year and tag filters show: totals, market
 * tiers, countries, cities and the most connected people
 * and brands. Names open their Properties or place windows.
 */
export function StatisticsContent({ visibleHouses, year, filtered, onSelect, onOpenPlace }: {
  visibleHouses: readonly House[]; year: number; filtered: boolean;
} & Pick<Actions, 'onSelect' | 'onOpenPlace'>) {
  const [withRetailers, toggleRetailers] = useRememberedToggle(RETAILER_COLLABS_KEY);
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
      brands: visibleHouses.length, main, active, people: people.length, moves: moves.length, releases,
      groups: groups.filter((group) => visibleHouses.some((house) => house.parentGroup === group.id)).length,
      countries, cities, tiers, directors, moveYears, tenures,
    };
  }, [visibleHouses, year]);

  // Only the Most collaborations table follows this checkbox.
  const ranking = useMemo(() => {
    const releases = withRetailers ? stats.releases : stats.releases.filter((project) => !involvesRetailer(project));
    const collaborative = tally(releases.flatMap((project) => project.houses));
    const partners = partnersByBrand(releases);
    return { collaborative, uniquePartners: new Map([...partners].map(([id, set]) => [id, set.size] as const)) };
  }, [stats.releases, withRetailers]);
  const house = (id: string) => <EntityLink kind="house" id={id} onSelect={onSelect}>{houseName(id)}</EntityLink>;
  return <>
    <h2>Statistics</h2>
    <p className="hint">{filtered ? `For the brands matching the current ${year === Infinity ? '' : 'year and '}filters.`
      : year === Infinity ? 'For every brand on the map.' : `For brands founded by ${year}.`}</p>
    <Tabs label="Statistics" tabs={TABS} storageKey={TAB_KEY} panels={{
      overview: () => <>
      <ProfileSection title="Overview">
        <Fields rows={[
          ['Brands', `${stats.brands.toLocaleString()} (${stats.main.length.toLocaleString()} main brands, ${(stats.brands - stats.main.length).toLocaleString()} sublabels)`],
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
      </>,
      collaborations: () => <>
        <CollaborationsSection releases={ranking.collaborative} partners={ranking.uniquePartners} house={house} controls={
          <RetailerToggle id="stats-retailer-collabs" checked={withRetailers} onChange={toggleRetailers} />} />
        <DiversitySection releases={stats.releases} house={house} />
        <TrendsSection releases={stats.releases} year={year} house={house} />
        <YearSection releases={stats.releases} house={house} />
      </>,
      connections: () => <>
        <DegreesSection releases={stats.releases} house={house} />
        <HeatmapSection releases={stats.releases} house={house} />
        <PairingsSection releases={stats.releases} house={house} />
      </>,
      people: () => <>
      <ProfileSection title="Longest creative director tenures">
        <BarTable heading="Creative director" columns={['Brand', 'Tenure']} countHeading="Years" label="Longest creative director tenures"
          rows={[...stats.tenures].sort((a, b) => b.years - a.years).slice(0, STATS_TOP).map(({ house: brand, tenure, years, current }) => ({
            key: `${tenure.designerId}:${brand.id}:${tenure.start}`, count: years,
            label: <EntityLink kind="designer" id={tenure.designerId} onSelect={onSelect}>{getDesigner(tenure.designerId)?.name ?? tenure.designerId}</EntityLink>,
            cells: [house(brand.id), <span className="nowrap">{tenure.start}–{current ? 'present' : tenure.end}</span>],
          }))} />
      </ProfileSection>
      <ProfileSection title="Most creative directors">
        <BarTable heading="Brand" label="Brands by number of creative directors" rows={top(stats.directors.filter(([, count]) => count > 0))
          .map(([brand, count]) => ({ key: brand.id, count, label: house(brand.id) }))} />
      </ProfileSection>
      <ProfileSection title="Busiest years for moves">
        <BarTable heading="Year" countHeading="Moves" label="Years with the most career moves"
          rows={top(stats.moveYears).map(([moveYear, count]) => ({ key: String(moveYear), label: String(moveYear), count }))} />
      </ProfileSection>
        <IncubatorsSection houses={visibleHouses} year={year} house={house} onSelect={onSelect} />
      </>,
      places: () => <>
        <DecadesSection houses={stats.main} house={house} />
      <ProfileSection title={`Top countries (of ${stats.countries.size})`}>
        <BarTable heading="Country" label="Main brands by country" rows={top(stats.countries).map(([code, count]) => ({ key: code, count,
          label: <PlaceLink place={{ kind: 'country', id: code as CountryCode }} onOpenPlace={onOpenPlace}>{countryNames[code as CountryCode]}</PlaceLink> }))} />
      </ProfileSection>
      <ProfileSection title={`Top cities (of ${stats.cities.size})`}>
        <BarTable heading="City" label="Main brands by city" rows={top(stats.cities).map(([city, count]) => ({ key: city, count,
          label: <PlaceLink place={{ kind: 'city', id: mapLocationForCity(city) }} onOpenPlace={onOpenPlace}>{city}</PlaceLink> }))} />
      </ProfileSection>
        <RelocationsSection houses={stats.main} year={year} house={house} onOpenPlace={onOpenPlace} />
      </>,
    }} />
  </>;
}
