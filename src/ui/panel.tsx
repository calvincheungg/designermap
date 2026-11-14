import { Fragment, useState, type ReactNode } from 'react';
import {
  careerOf, countryNames, designers, formatTenureYears, foundersOf, getDesigner, getGroup,
  getHouse, groups, houses, housesInGroup, isBusinessLeadership, logoUrl, movesOf, regionalHousesInGroup, tenuresAt,
} from '../data';
import type { Selection as GraphSelection } from '../graph/graph';
import type { House, HouseTenure, Tenure } from '../types';
import { frameIcon, initialsIcon, logoInfo } from '../graph/icons';
import { tagLabel } from './labels';
import type { HouseFilters } from '../data/tags';
import { formatCity } from '../data/cities';

export type Selection = GraphSelection;
interface Actions {
  onSelect: (selection: Selection, reveal?: boolean) => void;
  onTag: (group: keyof HouseFilters, value: string) => void;
}
type EntityKind = 'house' | 'designer' | 'group';

function EntityLink({ kind, id, children, onSelect }: {
  kind: EntityKind; id: string; children: ReactNode; onSelect: Actions['onSelect'];
}) {
  return <a href="#" data-select={`${kind}:${id}`} onClick={(event) => {
    event.preventDefault();
    if (kind === 'group') {
      const group = getGroup(id);
      if (group) onSelect({ kind, id: group.id }, true);
    } else onSelect({ kind, id }, true);
  }}>{children}</a>;
}

function Fields({ rows }: { rows: [string, ReactNode][] }) {
  return <table className="fields"><tbody>{rows.filter(([, value]) => value !== undefined && value !== null && value !== '' && value !== false)
    .map(([label, value]) => <tr key={label}><th>{label}:</th><td>{value}</td></tr>)}</tbody></table>;
}
function Notes({ text }: { text?: string }) {
  return text ? <fieldset><legend>Notes</legend><p>{text}</p></fieldset> : null;
}
function Website({ url }: { url: string }) {
  let label = url;
  try { label = new URL(url).hostname.replace(/^www\./, ''); } catch { /* retain original */ }
  return <a href={url} target="_blank" rel="noreferrer">{label}</a>;
}
const role = (tenure: Tenure) => tenure.roleDetail ? `${tenure.role} (${tenure.roleDetail})` : tenure.role;

function HouseLogo({ house }: { house: House }) {
  const [failed, setFailed] = useState(false);
  const url = logoUrl(house);
  const hasLogo = !!url && !failed;
  const background = url ? logoInfo.get(url)?.background ?? '#ffffff' : '#ffffff';
  return <img className={`logo${hasLogo ? ' has-logo' : ''}`}
    src={hasLogo ? url : initialsIcon(house)} alt={hasLogo ? `${house.name} logo` : house.name}
    style={hasLogo ? { backgroundImage: `url("${frameIcon(background)}")`, padding: house.logoFit === 'fill' ? 5 : 10 } : undefined}
    onError={hasLogo ? () => setFailed(true) : undefined} />;
}

function HouseList({ list, onSelect }: { list: readonly House[]; onSelect: Actions['onSelect'] }) {
  return <ul>{[...list].sort((a, b) => a.name.localeCompare(b.name)).map((house) =>
    <li key={house.id}><EntityLink kind="house" id={house.id} onSelect={onSelect}>{house.name}</EntityLink></li>)}</ul>;
}

function Directory({ visibleHouses, onSelect }: { visibleHouses: readonly House[]; onSelect: Actions['onSelect'] }) {
  const byCountry = [...Map.groupBy(visibleHouses, (h) => countryNames[h.country])].sort(([a], [b]) => a.localeCompare(b));
  const ids = new Set(visibleHouses.map((h) => h.id));
  const visibleDesigners = designers.filter((d) => d.career.some((t) => ids.has(t.house))).sort((a, b) => a.name.localeCompare(b.name));
  return <>
    <p className="hint">Click an icon in the graph, or pick from the lists below.</p>
    {!visibleHouses.length && <p className="hint">No houses match. Try another filter, a later year, or Clear filters.</p>}
    <fieldset><legend>Fashion houses ({visibleHouses.length})</legend><ul className="tree-view scroll-box">
      {byCountry.map(([country, list]) => {
        const cities = [...Map.groupBy(list, (h) => h.city)].sort(([a], [b]) => a.localeCompare(b));
        return <li key={country}><details><summary>{country}{cities.length === 1 ? ` · ${formatCity(cities[0]![0])}` : ''} ({list.length})</summary>
          {cities.length === 1 ? <HouseList list={list} onSelect={onSelect} /> : <ul>{cities.map(([city, cityHouses]) =>
            <li key={city}><details><summary>{formatCity(city)} ({cityHouses.length})</summary><HouseList list={cityHouses} onSelect={onSelect} /></details></li>)}</ul>}
        </details></li>;
      })}
    </ul></fieldset>
    <fieldset><legend>Groups ({groups.length})</legend><ul className="tree-view scroll-box">
      {[...groups].sort((a, b) => a.name.localeCompare(b.name)).map((group) => <li key={group.id}>
        <EntityLink kind="group" id={group.id} onSelect={onSelect}>{group.name}</EntityLink> ({housesInGroup(group.id).length})
      </li>)}
    </ul></fieldset>
    <fieldset><legend>Designers &amp; leaders ({visibleDesigners.length})</legend><ul className="tree-view scroll-box">
      {visibleDesigners.map((designer) => <li key={designer.id}><EntityLink kind="designer" id={designer.id} onSelect={onSelect}>{designer.name}</EntityLink></li>)}
    </ul></fieldset>
  </>;
}

function TenureTable({ list, supporting, business, onSelect }: { list: HouseTenure[]; supporting?: boolean; business?: boolean; onSelect: Actions['onSelect'] }) {
  return <div className="sunken-panel"><table className="interactive"><thead><tr><th>Years</th><th>{business ? 'Leader' : 'Designer'}</th><th>Role</th></tr></thead><tbody>
    {list.map((tenure, index) => <tr key={`${tenure.designerId}:${index}`}>
      <td className="nowrap">{formatTenureYears(tenure)}</td>
      <td><EntityLink kind="designer" id={tenure.designerId} onSelect={onSelect}>{getDesigner(tenure.designerId)?.name ?? tenure.designerId}</EntityLink></td>
      <td>{supporting ? tenure.roleDetail ?? 'Designer' : role(tenure)}</td>
    </tr>)}
  </tbody></table></div>;
}

function HouseProfile({ house, onSelect, onTag }: { house: House } & Actions) {
  const founderLinks: ReactNode[] = foundersOf(house.id).map((designer) =>
    <EntityLink kind="designer" id={designer.id} onSelect={onSelect}>{designer.name}</EntityLink>);
  if (house.founderHouse) founderLinks.push(
    <EntityLink kind="house" id={house.founderHouse} onSelect={onSelect}>{getHouse(house.founderHouse)?.name}</EntityLink>);
  if (house.founderGroup) founderLinks.push(
    <EntityLink kind="group" id={house.founderGroup} onSelect={onSelect}>{getGroup(house.founderGroup)?.name}</EntityLink>);
  if (house.founderOrganization) founderLinks.push(house.founderOrganization);
  const tenures = tenuresAt(house.id);
  const directors = tenures.filter((t) => t.role !== 'Other' && !isBusinessLeadership(t));
  const business = tenures.filter(isBusinessLeadership);
  const team = tenures.filter((t) => t.role === 'Other');
  const tagGroups: [keyof HouseFilters, string, readonly string[]][] = [
    ['marketPositioning', 'Market Positioning', [house.tags.marketPositioning]],
    ['brandCategory', 'Brand Type', house.tags.brandCategory],
    ['aesthetic', 'Aesthetic', house.tags.aesthetic],
    ['collections', 'Collections', house.tags.collections],
    ['product', 'Primary Products', house.tags.product],
  ];
  return <>
    <div className="identity"><HouseLogo key={`${house.id}:${house.logo}`} house={house} /><div><h2>{house.name}</h2><Fields rows={[
      ['Founded', house.founded],
      ['Founder', founderLinks.length ? <>{founderLinks.map((link, index) => <Fragment key={index}>{index > 0 && ', '}{link}</Fragment>)}</> : undefined],
      ['Based in', `${house.city}, ${countryNames[house.country]}`],
      ['Group', house.parentGroup && <EntityLink kind="group" id={house.parentGroup} onSelect={onSelect}>{getGroup(house.parentGroup)?.name ?? house.parentGroup}</EntityLink>],
      ['Website', house.website && <Website url={house.website} />],
      ['Instagram', house.instagram && <a href={`https://www.instagram.com/${house.instagram}/`} target="_blank" rel="noreferrer">@{house.instagram}</a>],
    ]} /></div></div>
    {!!house.regionalAffiliations?.length && <fieldset><legend>Regional Relationships</legend><ul>
      {house.regionalAffiliations.map((affiliation) => <li key={`${affiliation.group}:${affiliation.territory}`}>
        <EntityLink kind="group" id={affiliation.group} onSelect={onSelect}>{getGroup(affiliation.group)?.name}</EntityLink>
        {` · ${affiliation.territory} · ${affiliation.relationship}`}
      </li>)}
    </ul></fieldset>}
    <fieldset className="house-tags"><legend>Tags</legend>{tagGroups.map(([group, label, values]) =>
      <div className="tag-group" key={group}><p>{label}</p><div className="tag-list">{values.map((value) =>
        <button key={value} className="tag" data-tag-kind={group} data-tag-value={value} title={`Filter by ${tagLabel(value)}`} onClick={() => onTag(group, value)}>{tagLabel(value)}</button>
      )}</div></div>)}</fieldset>
    <fieldset><legend>Creative directors</legend>{directors.length ? <TenureTable list={directors} onSelect={onSelect} /> : <p className="hint">No creative directors recorded.</p>}</fieldset>
    {!!business.length && <fieldset><legend>Business leadership</legend><TenureTable list={business} business onSelect={onSelect} /></fieldset>}
    {!!team.length && <fieldset><legend>Design team &amp; other roles</legend><TenureTable list={team} supporting onSelect={onSelect} /></fieldset>}
    <Notes text={house.notes} />
  </>;
}

function GroupProfile({ id, onSelect }: { id: string; onSelect: Actions['onSelect'] }) {
  const group = getGroup(id);
  if (!group) return <p>No group with id “{id}”.</p>;
  const brands = housesInGroup(id);
  const regionalBrands = regionalHousesInGroup(id);
  return <><h2>{group.name}</h2><p>{group.description}</p><Fields rows={[["Official Website", <Website url={group.website} />]]} />
    <fieldset><legend>Current Brands in This Map ({brands.length})</legend>
      <p className="hint">Current ownership recorded in this map. The official website has more information on the wider portfolio.</p>
      <ul className="tree-view">{brands.map((house) => <li key={house.id}><EntityLink kind="house" id={house.id} onSelect={onSelect}>{house.name}</EntityLink></li>)}</ul>
    </fieldset>
    {!!regionalBrands.length && <fieldset><legend>Regional Relationships ({regionalBrands.length})</legend>
      <ul className="tree-view">{regionalBrands.map((house) => <li key={house.id}>
        <EntityLink kind="house" id={house.id} onSelect={onSelect}>{house.name}</EntityLink>
        <ul>{house.regionalAffiliations?.filter((affiliation) => affiliation.group === id).map((affiliation) =>
          <li key={affiliation.territory}>{affiliation.territory} · {affiliation.relationship}</li>)}</ul>
      </li>)}</ul>
    </fieldset>}
    <Notes text={group.notes} /></>;
}

function DesignerProfile({ id, onSelect }: { id: string; onSelect: Actions['onSelect'] }) {
  const designer = getDesigner(id);
  if (!designer) return <p>No designer with id “{id}”.</p>;
  const career = careerOf(id), moves = movesOf(id);
  return <><h2>{designer.name}</h2><Fields rows={[
    ['Born', designer.born ? `${designer.born}${designer.died ? `–${designer.died}` : ''}` : undefined], ['Nationality', designer.nationality],
  ]} /><fieldset><legend>Career</legend><div className="sunken-panel"><table className="interactive"><thead><tr><th>Years</th><th>House</th><th>Role</th></tr></thead><tbody>
    {career.map((tenure, index) => <tr key={index}><td className="nowrap">{formatTenureYears(tenure)}</td>
      <td><EntityLink kind="house" id={tenure.house} onSelect={onSelect}>{getHouse(tenure.house)?.name ?? tenure.house}</EntityLink></td><td>{role(tenure)}</td></tr>)}
  </tbody></table></div></fieldset>
    <fieldset><legend>Moves</legend>{moves.length ? <ul className="moves">{moves.map((move, index) => <li key={index}>
      <b>{move.year}</b>{' '}{move.concurrent ? <>{'+ '}<EntityLink kind="house" id={move.to.house} onSelect={onSelect}>{getHouse(move.to.house)?.name ?? move.to.house}</EntityLink>{' '}
        <span className="hint">(alongside <EntityLink kind="house" id={move.from.house} onSelect={onSelect}>{getHouse(move.from.house)?.name ?? move.from.house}</EntityLink>)</span></> : <>
        <EntityLink kind="house" id={move.from.house} onSelect={onSelect}>{getHouse(move.from.house)?.name ?? move.from.house}</EntityLink>{' → '}
        <EntityLink kind="house" id={move.to.house} onSelect={onSelect}>{getHouse(move.to.house)?.name ?? move.to.house}</EntityLink></>}
    </li>)}</ul> : <p className="hint">No moves between houses recorded.</p>}</fieldset><Notes text={designer.notes} /></>;
}

export function panelTitle(selection: Selection): string {
  if (!selection) return 'Directory';
  const name = selection.kind === 'house' ? getHouse(selection.id)?.name : selection.kind === 'designer' ? getDesigner(selection.id)?.name : getGroup(selection.id)?.name;
  return name ? `${name} Properties` : 'Not found';
}

export function PanelContent({ selection, visibleHouses = houses, onSelect, onTag }: {
  selection: Selection; visibleHouses?: readonly House[];
} & Actions) {
  if (selection?.kind === 'house') {
    const house = getHouse(selection.id);
    return house ? <HouseProfile house={house} onSelect={onSelect} onTag={onTag} /> : <p>No house with id “{selection.id}”.</p>;
  }
  if (selection?.kind === 'designer') return <DesignerProfile id={selection.id} onSelect={onSelect} />;
  if (selection?.kind === 'group') return <GroupProfile id={selection.id} onSelect={onSelect} />;
  return <Directory visibleHouses={visibleHouses} onSelect={onSelect} />;
}
