import { Fragment, useMemo, type ReactNode } from 'react';
import { countryNames, getDesigner, type CountryCode } from '../data';
import { mapLocationForCity } from '../graph/locations';
import type { Collaboration, House } from '../types';
import { EntityLink, PlaceLink, ProfileSection, RowLimitedPanel, type Actions } from './panel';
import { FIRST_DECADE, foundingDecades, incubators, lastSearchedYear, relocations, trendRows, type TrendRow } from './stats-data';
import { Choice, houseName, involvesRetailer, LimitedSection, RetailerToggle, SortTable, STATS_VISIBLE_ROWS, useRememberedChoice, useRememberedToggle, type SortRow } from './stats-shared';

type HouseLink = (id: string) => ReactNode;
/** Brand links in one wrapping line. */
const brandList = (ids: readonly string[], house: HouseLink) => [...ids].sort((a, b) => houseName(a).localeCompare(houseName(b)))
  .map((id, index) => <Fragment key={id}>{index > 0 && ', '}{house(id)}</Fragment>);
const range = (from: number, to: number) => from === to ? String(from) : `${from}–${to}`;

const SPANS = [1, 2, 3, 4, 5] as const;
const SPAN_NAMES: Record<number, string> = { 1: '1 year', 2: '2 years', 3: '3 years', 4: '4 years', 5: '5 years' };

/** Brands releasing more, and fewer, collaborations than in the period before. */
export function TrendsSection({ releases, year, house }: { releases: readonly Collaboration[]; year: number; house: HouseLink }) {
  const [withRetailers, toggleRetailers] = useRememberedToggle('designer-map:stats-retailer-trends');
  const [span, setSpan] = useRememberedChoice<number>('designer-map:stats-trend-span', SPANS, 4);
  const end = lastSearchedYear(year);
  const rows = useMemo(() => trendRows(withRetailers ? releases : releases.filter((project) => !involvesRetailer(project)), end, span), [releases, withRetailers, end, span]);
  const periods = [range(end - 2 * span + 1, end - span), range(end - span + 1, end)] as const;
  const list = (direction: 1 | -1, limit: number) => rows.filter((row) => row.change * direction > 0)
    .sort((a, b) => direction * (b.change - a.change) || b.now + b.before - a.now - a.before || houseName(a.id).localeCompare(houseName(b.id))).slice(0, limit);
  const most = Math.max(1, ...rows.map((row) => Math.abs(row.change)));
  const table = (title: string, shown: readonly TrendRow[]) => <>
    <p className="stats-subheading">{title}</p>
    {shown.length ? <RowLimitedPanel rows={STATS_VISIBLE_ROWS} className="stats-table"><table aria-label={`${title} collaborators`}>
      <thead><tr><th className="stats-rank">#</th><th className="stats-label">Brand</th><th className="stats-count">{periods[0]}</th><th className="stats-count">{periods[1]}</th><th className="stats-count">Change</th><th className="stats-bar-cell" aria-hidden="true" /></tr></thead>
      <tbody>{shown.map((row, index) => <tr key={row.id}>
        <td className="stats-rank">{index + 1}</td><td className="stats-label" title={houseName(row.id)}>{house(row.id)}</td>
        <td className="stats-count">{row.before}</td><td className="stats-count">{row.now}</td><td className="stats-count">{row.change > 0 ? `+${row.change}` : `−${-row.change}`}</td>
        <td className="stats-bar-cell" aria-hidden="true"><span className={`stats-bar${row.change < 0 ? ' cooling' : ''}`} style={{ width: `${(Math.abs(row.change) / most) * 100}%` }} /></td>
      </tr>)}</tbody>
    </table></RowLimitedPanel> : <p className="hint">None with the current filters.</p>}
  </>;
  return <LimitedSection title="Rising and cooling" controls={<>
    <Choice text="Compare" label="Length of each period" values={SPANS} value={span} onChange={setSpan} names={SPAN_NAMES} />
    <RetailerToggle id="stats-retailer-trends" checked={withRetailers} onChange={toggleRetailers} />
  </>}>{(limit) => <>
    <p className="hint">Recorded releases in {periods[1]} against {periods[0]}. Only brands whose collaborations have been fully searched.</p>
    {table('Rising', list(1, limit))}
    {table('Cooling', list(-1, limit))}
  </>}</LimitedSection>;
}

/** Houses whose design-team members went on to lead or found another house. */
export function IncubatorsSection({ houses, year, house, onSelect }: { houses: readonly House[]; year: number; house: HouseLink; onSelect: Actions['onSelect'] }) {
  const found = useMemo(() => incubators(new Set(houses.map((item) => item.id)), year), [houses, year]);
  const rows = [...found].map(([id, alumni]): SortRow<'people' | 'houses'> => ({
    key: id, label: house(id), title: houseName(id),
    values: { people: alumni.length, houses: new Set(alumni.flatMap(({ led }) => led.map((lead) => lead.house))).size },
    details: () => <ul>{[...alumni].sort((a, b) => a.led[0]!.start - b.led[0]!.start).map(({ designer, led }) => <li key={designer}>
      <EntityLink kind="designer" id={designer} onSelect={onSelect}>{getDesigner(designer)?.name ?? designer}</EntityLink>
      {' → '}{led.map((lead, index) => <Fragment key={lead.house}>{index > 0 && ', '}{house(lead.house)} ({lead.start})</Fragment>)}
    </li>)}</ul>,
  }));
  return <LimitedSection title="Talent incubators">{(limit) => <>
    <p className="hint">Recorded design-team members who later led or founded a house outside that brand's family. Click a row for who.</p>
    <SortTable label="Brands whose design teams produced the most leaders" heading="Brand" detailsLabel="People from" initial="people" rows={rows} limit={limit}
      columns={INCUBATOR_COLUMNS} />
  </>}</LimitedSection>;
}
const INCUBATOR_COLUMNS = [{ key: 'people', label: 'People' }, { key: 'houses', label: 'Houses led', title: 'Different houses they went on to lead or found' }] as const;

/** Main brands by founding decade, newest first; clicking a decade lists its brands. */
export function DecadesSection({ houses, house }: { houses: readonly House[]; house: HouseLink }) {
  const decades = useMemo(() => foundingDecades(houses), [houses]);
  const unknown = houses.filter((item) => item.founded === undefined).length;
  const rows = decades.map(({ decade, houses: list }): SortRow<'decade' | 'brands' | 'ended'> => {
    const title = decade === undefined ? `Before ${FIRST_DECADE}` : `${decade}s`;
    return { key: title, label: title, title, values: { brands: list.length, ended: list.filter((item) => item.closed !== undefined).length, decade: decade ?? 0 },
      text: { decade: decade === undefined ? `–${FIRST_DECADE - 1}` : range(decade, decade + 9) },
      details: list.length ? () => <>{brandList(list.map((item) => item.id), house)}</> : undefined };
  });
  return <ProfileSection title="Brands founded by decade">
    <p className="hint">Main brands{unknown ? ` (${unknown.toLocaleString()} without a founding year left out)` : ''}. Click a decade for its brands.</p>
    <SortTable label="Main brands by founding decade" heading="Decade" detailsLabel="Brands founded in" initial="decade" ranked={false} bar="brands" rows={rows} columns={DECADE_COLUMNS} />
  </ProfileSection>;
}
const DECADE_COLUMNS = [{ key: 'decade', label: 'Years' }, { key: 'brands', label: 'Brands' }, { key: 'ended', label: 'Ended', title: 'Brands that have since ended or paused' }] as const;

const MOVE_PLACES = ['city', 'country'] as const;
const MOVE_NAMES = { city: 'City', country: 'Country' } as const;
const MOVE_COLUMNS = [{ key: 'total', label: 'Moves' }, { key: 'gained', label: 'Gained', title: 'Founded elsewhere, now based here' }, { key: 'lost', label: 'Lost', title: 'Founded here, now based elsewhere' }, { key: 'net', label: 'Net' }] as const;

/** Where main brands that left their founding place are now. */
export function RelocationsSection({ houses, year, house, onOpenPlace }: { houses: readonly House[]; year: number; house: HouseLink; onOpenPlace?: Actions['onOpenPlace'] }) {
  const [by, setBy] = useRememberedChoice<'city' | 'country'>('designer-map:stats-moves-by', MOVE_PLACES, 'city');
  const places = useMemo(() => relocations(houses, by, year), [houses, by, year]);
  const placeName = (place: string) => by === 'country' ? countryNames[place as CountryCode] : place;
  const moved = (list: readonly House[], other: (item: House) => string) => list.map((item, index) =>
    <Fragment key={item.id}>{index > 0 && ', '}{house(item.id)} ({placeName(other(item))})</Fragment>);
  const rows = [...places].map(([place, { gained, lost }]): SortRow<'total' | 'gained' | 'lost' | 'net'> => {
    const net = gained.length - lost.length;
    return { key: place, title: placeName(place),
      label: by === 'country' ? <PlaceLink place={{ kind: 'country', id: place as CountryCode }} onOpenPlace={onOpenPlace}>{placeName(place)}</PlaceLink>
        : <PlaceLink place={{ kind: 'city', id: mapLocationForCity(place) }} onOpenPlace={onOpenPlace}>{place}</PlaceLink>,
      values: { total: gained.length + lost.length, gained: gained.length, lost: lost.length, net }, text: { net: net > 0 ? `+${net}` : net < 0 ? `−${-net}` : '0' },
      details: () => <>
        {gained.length > 0 && <div><strong>From:</strong> {moved(gained, (item) => item.origin![by])}</div>}
        {lost.length > 0 && <div><strong>To:</strong> {moved(lost, (item) => item[by])}</div>}
      </> };
  });
  return <LimitedSection title="Where brands move" controls={
    <Choice text="By" label="Count moves by" values={MOVE_PLACES} value={by} onChange={setBy} names={MOVE_NAMES} />}>{(limit) => <>
    <p className="hint">Main brands now based somewhere other than where they were founded. Click a row for the brands.</p>
    <SortTable key={by} label={`Brand moves by ${by}`} heading={MOVE_NAMES[by]} detailsLabel="Brands that moved to or from" initial="total" rows={rows} limit={limit} columns={MOVE_COLUMNS} />
  </>}</LimitedSection>;
}
