import { useMemo, type ReactNode } from 'react';
import { designers, getHouse, houses } from '../data';
import { missingOriginCandidates } from '../data/validate';
import type { House } from '../types';
import { EntityLink, ProfileSection, type Actions } from './panel';

const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });

/**
 * The Recycle Bin: brands that have ended (closed or paused) by the selected
 * year, within the tag filters, most recent first. Names open their Properties.
 */
export function RecycleBinContent({ visibleHouses, year, onSelect }: {
  visibleHouses: readonly House[]; year: number; onSelect: Actions['onSelect'];
}) {
  const ended = useMemo(() => visibleHouses.filter((house) => house.closed !== undefined && house.closed <= year)
    .sort((a, b) => b.closed! - a.closed! || collator.compare(a.name, b.name)), [visibleHouses, year]);
  return <>
    <h2>Recycle Bin</h2>
    <p className="hint">{ended.length.toLocaleString()} {ended.length === 1 ? 'brand has' : 'brands have'} ended or paused{year === Infinity ? '' : ` by ${year}`}.</p>
    {ended.length ? <div className="sunken-panel"><table className="interactive" aria-label="Ended brands">
      <thead><tr><th>Brand</th><th>Founded</th><th>Ended</th></tr></thead>
      <tbody>{ended.map((house) => <tr key={house.id}>
        <td><EntityLink kind="house" id={house.id} onSelect={onSelect}>{house.name}</EntityLink></td>
        <td>{house.founded ?? '—'}</td><td>{house.closed}</td>
      </tr>)}</tbody>
    </table></div> : <p className="hint">The Recycle Bin is empty.</p>}
  </>;
}

function BrandList({ list, onSelect, detail }: { list: readonly House[]; onSelect: Actions['onSelect']; detail?: (house: House) => ReactNode }) {
  if (!list.length) return <p className="hint">Nothing missing.</p>;
  return <ul className="missing-list">{list.map((house) => <li key={house.id}>
    <EntityLink kind="house" id={house.id} onSelect={onSelect}>{house.name}</EntityLink>{detail && <span className="hint"> · {detail(house)}</span>}
  </li>)}</ul>;
}

/**
 * Research gaps in the dataset (dev only): brands with nobody linked, likely
 * missing origins, and missing logos, websites or Instagram handles. Lists all
 * brands, ignoring the map's filters, so the to-do list is complete.
 */
export function MissingReportContent({ onSelect }: { onSelect: Actions['onSelect'] }) {
  const report = useMemo(() => {
    const linked = new Set(designers.flatMap((designer) => designer.career.map((tenure) => tenure.house)));
    const byName = (list: House[]) => list.sort((a, b) => collator.compare(a.name, b.name));
    return {
      unlinked: byName(houses.filter((house) => !linked.has(house.id))),
      origins: missingOriginCandidates().sort((a, b) => collator.compare(a.house.name, b.house.name)),
      logos: byName(houses.filter((house) => !house.logo)),
      websites: byName(houses.filter((house) => !house.website)),
      instagram: byName(houses.filter((house) => !house.instagram)),
      founded: byName(houses.filter((house) => house.founded === undefined)),
    };
  }, []);
  const places = new Map(report.origins.map(({ house, place }) => [house.id, place]));
  return <>
    <h2>What's Missing</h2>
    <p className="hint">Research gaps across all {houses.length.toLocaleString()} brands. Shown in development only.</p>
    <ProfileSection title={`No founder or creative director (${report.unlinked.length})`}><BrandList list={report.unlinked} onSelect={onSelect} /></ProfileSection>
    <ProfileSection title={`Possible missing origin (${report.origins.length})`}>
      <BrandList list={report.origins.map(({ house }) => house)} onSelect={onSelect}
        detail={(house) => `notes say founded in ${places.get(house.id)}; based in ${getHouse(house.id)?.city}`} />
    </ProfileSection>
    <ProfileSection title={`No founding year (${report.founded.length})`} defaultOpen={false}><BrandList list={report.founded} onSelect={onSelect} /></ProfileSection>
    <ProfileSection title={`No logo (${report.logos.length})`} defaultOpen={false}><BrandList list={report.logos} onSelect={onSelect} /></ProfileSection>
    <ProfileSection title={`No website (${report.websites.length})`} defaultOpen={false}><BrandList list={report.websites} onSelect={onSelect} /></ProfileSection>
    <ProfileSection title={`No Instagram (${report.instagram.length})`} defaultOpen={false}><BrandList list={report.instagram} onSelect={onSelect} /></ProfileSection>
  </>;
}
