import { readSetting, writeSetting } from './storage';
import { useId, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { getHouse, marketPositionings } from '../data';
import type { Collaboration } from '../types';
import type { Dimension } from './collab-diversity';
import { SearchBox, type ListItem } from './listbox';
import { ProfileSection } from './panel';
import { cellKey, collaborationNetwork, heatmap, HEATMAP_COUNTRIES, pairYears, shortestChain, splitPair, stepsFrom } from './stats-data';
import { BarTable, Choice, houseName, involvesRetailer, LimitedSection, RetailerToggle, SortTable, useRememberedChoice, useRememberedToggle, type SortRow } from './stats-shared';

interface Props { releases: readonly Collaboration[]; house: (id: string) => ReactNode }

/** A section's brand pairs, without retailer releases when its remembered checkbox is off. */
function usePairs(releases: readonly Collaboration[], key: string) {
  const [on, toggle] = useRememberedToggle(`designer-map:${key}`);
  const pairs = useMemo(() => pairYears(on ? releases : releases.filter((project) => !involvesRetailer(project))), [releases, on]);
  return { pairs, control: <RetailerToggle id={key} checked={on} onChange={toggle} /> };
}

const yearsText = (years: readonly number[]) => {
  const from = Math.min(...years), to = Math.max(...years);
  return `${years.length.toLocaleString()} ${years.length === 1 ? 'release' : 'releases'}, ${from === to ? from : `${from}–${to}`}`;
};

const DEGREES_KEY = 'designer-map:stats-degrees';
const DEFAULT_DEGREES = ['nike', 'hermes'] as const;

/** The shortest chain of collaborations between two brands, and how far the first is from everyone. */
export function DegreesSection({ releases, house }: Props) {
  const id = useId();
  const { pairs, control } = usePairs(releases, 'stats-retailer-degrees');
  const network = useMemo(() => collaborationNetwork(pairs), [pairs]);
  const [ends, setEnds] = useState<readonly [string, string]>(() => readSetting<readonly [string, string]>(DEGREES_KEY, (stored) => {
    const [a, b] = splitPair(stored);
    return a && b && getHouse(a) && getHouse(b) ? [a, b] : undefined;
  }, DEFAULT_DEGREES));
  const [text, setText] = useState<readonly [string, string]>([houseName(ends[0]), houseName(ends[1])]);
  const items = useMemo<ListItem<string>[]>(() => [...network.keys()].map((brand) => ({ label: houseName(brand), aliases: getHouse(brand)?.aliases, value: brand }))
    .sort((a, b) => a.label.localeCompare(b.label)), [network]);
  const choose = (next: readonly [string, string]) => {
    setEnds(next);
    setText([houseName(next[0]), houseName(next[1])]);
    writeSetting(DEGREES_KEY, next.join('|'));
  };
  const [from, to] = ends;
  const chain = useMemo(() => shortestChain(network, from, to), [network, from, to]);
  const distances = useMemo(() => [...stepsFrom(network, from).values()], [network, from]);
  const reached = distances.length - 1;
  const steps = (chain?.length ?? 1) - 1;
  const missing = [...new Set(ends)].filter((brand) => !network.has(brand));
  return <ProfileSection title="Degrees of separation">
    <p className="hint">The shortest chain of collaborations from one brand to another.</p>
    <div className="stats-degrees-form">
      <SearchBox items={items} value={text[0]} label="From:" inputId={`${id}-from`} placeholder="Search brands" limit={Infinity}
        onChange={(value) => setText(([, b]) => [value, b])} onPick={(item) => choose([item.value, to])} />
      <SearchBox items={items} value={text[1]} label="To:" inputId={`${id}-to`} placeholder="Search brands" limit={Infinity}
        onChange={(value) => setText(([a]) => [a, value])} onPick={(item) => choose([from, item.value])} />
      <button type="button" onClick={() => choose([to, from])}>Swap</button>
      {control}
    </div>
    {missing.length ? <p>{missing.map(houseName).join(' and ')} {missing.length === 1 ? 'has' : 'have'} no collaborations with the current filters.</p>
      : from === to ? <p>Pick two different brands.</p>
      : !chain ? <p>No chain of collaborations connects {houseName(from)} and {houseName(to)}.</p>
      : <>
        <p aria-live="polite"><strong>{steps === 1 ? `${houseName(from)} and ${houseName(to)} have collaborated directly.` : `${steps} steps from ${houseName(from)} to ${houseName(to)}.`}</strong></p>
        <ol className="stats-chain" aria-label={`Chain from ${houseName(from)} to ${houseName(to)}`}>{chain.map((brand, index) => <li key={brand}>
          {house(brand)}
          {index < steps && <div className="stats-chain-link">↓ {yearsText(network.get(brand)!.get(chain[index + 1]!)!)}</div>}
        </li>)}</ol>
      </>}
    {reached > 0 && <>
      <p className="hint">{houseName(from)} can reach {reached.toLocaleString()} of the {(network.size - 1).toLocaleString()} other brands with collaborations.</p>
      <BarTable heading="Steps away" countHeading="Brands" ranked={false} label={`Brands by steps from ${houseName(from)}`}
        rows={[...Map.groupBy(distances.filter((step) => step > 0), (step) => step)].map(([step, list]) =>
          ({ key: String(step), label: step === 1 ? '1 (direct partners)' : String(step), count: list.length }))} />
    </>}
  </ProfileSection>;
}

const HEATMAP_NAMES: Record<Dimension, string> = { category: 'Category', market: 'Market position', country: 'Country' };
const HEATMAP_ORDER: readonly Dimension[] = ['market', 'country', 'category'];

/** Brand pairs by the two brands' market positions, countries or categories; a cell lists its pairs. */
export function HeatmapSection({ releases, house }: Props) {
  const { pairs, control } = usePairs(releases, 'stats-retailer-heatmap');
  const [dimension, setDimension] = useRememberedChoice<Dimension>('designer-map:stats-heatmap', HEATMAP_ORDER, 'market');
  const [picked, setPicked] = useState<readonly [string, string]>();
  const { values, cells } = useMemo(() => heatmap(pairs.keys(), dimension, dimension === 'market' ? marketPositionings : undefined), [pairs, dimension]);
  const most = Math.max(1, ...[...cells.values()].map((list) => list.length));
  const shown = picked && cells.get(cellKey(...picked));
  return <LimitedSection title="Who collaborates with whom" controls={<>
    <Choice text="Compare by" label="Compare partners by" values={HEATMAP_ORDER} value={dimension} names={HEATMAP_NAMES}
      onChange={(next) => { setDimension(next); setPicked(undefined); }} />
    {control}
  </>}>{(limit) => values.length ? <>
    <p className="hint">Brand pairs that have collaborated, each counted once. {dimension === 'category' ? 'Brands with several categories count in each. ' : ''}
      {dimension === 'country' && values.length > HEATMAP_COUNTRIES ? `The ${HEATMAP_COUNTRIES} countries with the most pairs; the rest are Other. ` : ''}Click a cell for its pairs; Show sets how many are listed.</p>
    <div className="sunken-panel stats-heatmap"><table aria-label={`Brand pairs by ${HEATMAP_NAMES[dimension].toLowerCase()}`}>
      <thead><tr><td />{values.map((value) => <th key={value} scope="col" className={dimension === 'market' ? undefined : 'turned'}><span>{value}</span></th>)}</tr></thead>
      <tbody>{values.map((row) => <tr key={row}><th scope="row">{row}</th>{values.map((column) => {
        const count = cells.get(cellKey(row, column))?.length ?? 0;
        // Square root, so a few huge cells don't wash out the rest.
        const heat = Math.sqrt(count / most);
        return <td key={column}>{count ? <button type="button" className={`stats-heat${heat > 0.45 ? ' hot' : ''}`} style={{ '--heat': heat.toFixed(3) } as CSSProperties}
          aria-label={`${row} × ${column}: ${count.toLocaleString()} ${count === 1 ? 'pair' : 'pairs'}`} title={`${row} × ${column}: ${count.toLocaleString()}`}
          aria-pressed={picked?.[0] === row && picked[1] === column}
          onClick={() => setPicked(picked?.[0] === row && picked[1] === column ? undefined : [row, column])}>{count}</button>
          : <span className="stats-heat" style={{ '--heat': 0 } as CSSProperties}>–</span>}</td>;
      })}</tr>)}</tbody>
    </table></div>
    {picked && shown && <>
      <p className="stats-subheading">{picked[0]} × {picked[1]} ({shown.length.toLocaleString()} {shown.length === 1 ? 'pair' : 'pairs'})</p>
      <BarTable heading="Brands" countHeading="Releases" label={`${picked[0]} × ${picked[1]} pairs`}
        rows={shown.map((key) => [key, pairs.get(key)!.length] as const).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([key, count]) => {
          const [a, b] = splitPair(key);
          return { key, count, label: <>{house(a)} × {house(b)}</>, title: `${houseName(a)} × ${houseName(b)}` };
        })} />
    </>}
  </> : <p className="hint">Nothing to count with the current filters.</p>}</LimitedSection>;
}

type PairColumn = 'releases' | 'years' | 'span';
const PAIR_COLUMNS = [
  { key: 'releases', label: 'Releases' },
  { key: 'years', label: 'Active years', title: 'Different years with a release together' },
  { key: 'span', label: 'Span', title: 'First to latest release together, sorted by length' },
] as const;

/** Brand pairs by releases, years with a release, or the span from first to latest. */
export function PairingsSection({ releases, house }: Props) {
  const { pairs, control } = usePairs(releases, 'stats-retailer-pairs');
  const rows = useMemo(() => [...pairs].map(([key, years]): SortRow<PairColumn> => {
    const [a, b] = splitPair(key);
    const from = Math.min(...years), to = Math.max(...years);
    return { key, label: <>{house(a)} × {house(b)}</>, title: `${houseName(a)} × ${houseName(b)}`,
      values: { releases: years.length, years: new Set(years).size, span: to - from }, text: { span: from === to ? String(from) : `${from}–${to}` } };
  }), [pairs, house]);
  return <LimitedSection title="Top partnerships" controls={control}>{(limit) => <>
    <p className="hint">Sort by Active years for the steadiest partnerships, or Span for the longest.</p>
    <SortTable label="Brand pairs with the most collaborations" heading="Brands" columns={PAIR_COLUMNS} rows={rows} limit={limit} initial="releases" />
  </>}</LimitedSection>;
}
