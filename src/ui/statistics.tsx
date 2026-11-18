import { useMemo, type ReactNode } from 'react';
import { allMoves, collaborations, countryNames, designers, getDesigner, getHouse, groups, isBusinessLeadership, marketPositionings, tenuresAt, type CountryCode } from '../data';
import type { House } from '../types';
import { mapLocationForCity } from '../graph/locations';
import { EntityLink, Fields, PlaceLink, ProfileSection, type Actions } from './panel';

/** Rows shown in each "top" table. */
export const STATS_TOP = 10;

interface Row {
  key: string; label: ReactNode; count: number;
  /** Extra columns after the label, one per `columns` heading. */
  cells?: ReactNode[];
}

const top = <T,>(entries: Iterable<readonly [T, number]>, limit = STATS_TOP) =>
  [...entries].sort((a, b) => b[1] - a[1]).slice(0, limit);
const tally = <T,>(values: Iterable<T>) => {
  const counts = new Map<T, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
};

/** A Win98 table of counts with a navy bar scaled to the largest row. */
function BarTable({ heading, rows, label, countHeading = 'Count', columns = [] }: {
  heading: string; rows: Row[]; label: string; countHeading?: string;
  /** Headings of extra columns between the label and the count. */
  columns?: string[];
}) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  if (!rows.length) return <p className="hint">Nothing to count with the current filters.</p>;
  return <div className="sunken-panel stats-table"><table aria-label={label}>
    <thead><tr><th>{heading}</th>{columns.map((column) => <th key={column}>{column}</th>)}<th className="stats-count">{countHeading}</th><th className="stats-bar-cell" aria-hidden="true"></th></tr></thead>
    <tbody>{rows.map((row) => <tr key={row.key}>
      <td>{row.label}</td>{columns.map((column, index) => <td key={column}>{row.cells?.[index]}</td>)}<td className="stats-count">{row.count.toLocaleString()}</td>
      <td className="stats-bar-cell" aria-hidden="true"><span className="stats-bar" style={{ width: `${(row.count / max) * 100}%` }} /></td>
    </tr>)}</tbody>
  </table></div>;
}

/**
 * Statistics for the brands the year and tag filters show: totals, market
 * tiers, countries, cities and the most connected people
 * and brands. Names open their Properties or place windows.
 */
export function StatisticsContent({ visibleHouses, year, filtered, onSelect, onOpenPlace }: {
  visibleHouses: readonly House[]; year: number; filtered: boolean;
} & Pick<Actions, 'onSelect' | 'onOpenPlace'>) {
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
    const collaborative = tally(releases.flatMap((project) => project.houses));
    // Distinct partner brands per brand, however many releases they shared.
    const partners = new Map<string, Set<string>>();
    for (const project of releases) for (const id of project.houses) {
      const set = partners.get(id) ?? new Set<string>();
      for (const other of project.houses) if (other !== id) set.add(other);
      partners.set(id, set);
    }
    const uniquePartners = [...partners].map(([id, set]) => [id, set.size] as const);
    // Each brand pair in a release (three-brand projects give three pairs), counted across releases.
    const pairs = tally(releases.flatMap((project) => {
      const members = [...new Set(project.houses)].sort();
      return members.flatMap((a, i) => members.slice(i + 1).map((b) => `${a}|${b}`));
    }));
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
      brands: visibleHouses.length, main: main.length, active, people: people.length, moves: moves.length, releases: releases.length,
      groups: groups.filter((group) => visibleHouses.some((house) => house.parentGroup === group.id)).length,
      countries, cities, tiers, directors, collaborative, uniquePartners, pairs, moveYears, tenures,
    };
  }, [visibleHouses, year]);

  const house = (id: string) => <EntityLink kind="house" id={id} onSelect={onSelect}>{getHouse(id)?.name ?? id}</EntityLink>;
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
        ['Collaborations', stats.releases.toLocaleString()],
        ['Groups', stats.groups.toLocaleString()],
        ['Countries', stats.countries.size.toLocaleString()],
        ['Cities', stats.cities.size.toLocaleString()],
      ]} />
    </ProfileSection>
    <ProfileSection title="Market positioning">
      <BarTable heading="Tier" label="Brands by market positioning"
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
    <ProfileSection title="Most collaborations">
      <BarTable heading="Brand" label="Brands by number of collaborations" rows={top(stats.collaborative)
        .map(([id, count]) => ({ key: id, count, label: house(id) }))} />
    </ProfileSection>
    <ProfileSection title="Most frequent pairings">
      <BarTable heading="Brands" countHeading="Releases" label="Brand pairs with the most collaborations"
        rows={top(stats.pairs).map(([pair, count]) => {
          const [a, b] = pair.split('|') as [string, string];
          return { key: pair, count, label: <>{house(a)} × {house(b)}</> };
        })} />
    </ProfileSection>
    <ProfileSection title="Most unique collaborators">
      <BarTable heading="Brand" label="Brands by number of distinct partner brands" rows={top(stats.uniquePartners)
        .map(([id, count]) => ({ key: id, count, label: house(id) }))} />
    </ProfileSection>
  </>;
}
