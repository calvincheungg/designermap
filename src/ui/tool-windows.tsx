import { useMemo, type ReactNode } from 'react';
import { designers, getHouse, houses } from '../data';
import { missingOriginCandidates } from '../data/validate';
import { minesweeperColour } from '../graph/minesweeper';
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

/** A Win98 Minesweeper digit, as drawn on collaboration pulses. */
const Digit = ({ count }: { count: number }) => <span className="help-digit" style={{ color: minesweeperColour(count) }}>{count > 7 ? '8+' : count}</span>;

/** Help ▸ how to read and use the map: pins, lines, pulses, windows and brand details. */
export function HelpContent() {
  return <>
    <h2>Designer Map Help</h2>
    <p className="hint">A world map of fashion houses and the creative directors who move between them.</p>
    <ProfileSection title="Getting around">
      <ul className="help-list">
        <li>Drag to pan and scroll or pinch to zoom. Search in the taskbar, or use Start ▸ Run… to open anything by name.</li>
        <li>Click a city pin to see its brands. Choose whether cities open in windows or on the map under Start ▸ Open cities.</li>
        <li>Click a brand to select it: the map shows its connections and its Properties window opens.</li>
        <li>Use the clock in the taskbar to pick a year, or press Play to watch the map grow over time.</li>
        <li>Start ▸ List View shows every brand, group, designer, career role, collaboration and location in a spreadsheet, one sheet tab each. Right-click a cell to filter by it, drag or shift-click to select and copy a range, try Insert ▸ Chart and the PivotTable tab, and use File ▸ Save As CSV to export. Type in its formula bar to search. Its sorting, filters and search only change that list, never the map.</li>
        <li>Start ▸ Documents lists what you opened recently. Start ▸ Reset View clears everything and starts again.</li>
      </ul>
    </ProfileSection>
    <ProfileSection title="Map pins">
      <table className="help-legend"><tbody>
        <tr><td><span className="help-pin" /></td><td>A city. Larger fashion cities always keep their own pin.</td></tr>
        <tr><td><span className="help-pin cluster" /></td><td>A group of nearby smaller cities, with their brand count. Click to zoom in.</td></tr>
        <tr><td><span className="help-pin open" /></td><td>An open city, with its brands shown on the map.</td></tr>
      </tbody></table>
    </ProfileSection>
    <ProfileSection title="Connection lines">
      <table className="help-legend"><tbody>
        <tr><td><span className="help-line move" /></td><td>A designer move: someone started at another house. The navy block travels in the direction of their career.</td></tr>
        <tr><td><span className="help-line collaboration" /></td><td>A collaboration between two brands. Repeat releases share one line.</td></tr>
        <tr><td><span className="help-digits">{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <Digit key={n} count={n} />)}</span></td>
          <td>Collaboration pulses show how many releases the two brands have made together, in Minesweeper colours.</td></tr>
      </tbody></table>
      <p className="hint">Lines appear for the selected brand or designer. Turn them on or off under Start ▸ Connection lines.</p>
    </ProfileSection>
    <ProfileSection title="Brand details">
      <ul className="help-list">
        <li>Market positioning runs High Luxury → Luxury → Premium → Mid-market → Budget. These are editorial tiers, not rankings.</li>
        <li>Brands that have closed or paused show an Ended year and appear in the Recycle Bin.</li>
        <li>Other roles are design-team positions; they don't count as creative direction.</li>
        <li>Start ▸ Show brands at ▸ Origin moves brands to the city where they were founded.</li>
      </ul>
    </ProfileSection>
    <ProfileSection title="Sharing">
      <p>The address bar always holds the current selection, year and filters, so you can copy the link to share the view.</p>
    </ProfileSection>
  </>;
}
