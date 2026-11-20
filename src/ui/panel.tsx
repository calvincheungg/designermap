import { Fragment, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import {
  careerOf, collaborationsOf, countryNames, formatTenureYears, foundersOf, getDesigner, getGroup,
  getHouse, housesInGroup, isBusinessLeadership, labelsOf, logoUrl, movesOf, parentHouseOf, regionalHousesInGroup, tenuresAt,
} from '../data';
import type { Selection as GraphSelection } from '../graph/graph';
import type { Collaboration, House, HouseEvent, HouseTenure, Tenure } from '../types';
import type { CountryCode } from '../data/countries';
import { mapLocationForCity } from '../graph/locations';
import { frameIcon, initialsIcon, logoInfo } from '../graph/icons';
import { tagLabel } from './labels';
import type { HouseFilters } from '../data/tags';
import { SelectBox } from './listbox';

export type Selection = GraphSelection;
/** A place window: a map location's brands, or a country's. */
export type Place = { kind: 'city'; id: string } | { kind: 'country'; id: CountryCode };
export interface Actions {
  onSelect: (selection: Selection, reveal?: boolean) => void;
  onTag: (group: keyof HouseFilters, value: string) => void;
  /** Open a city or country window; places show as plain text without it. */
  onOpenPlace?: (place: Place) => void;
  /** Select and frame an item on the map (the brand logo); the logo is a plain image without it. */
  onShowOnMap?: (selection: NonNullable<Selection>) => void;
}

/** A city or country name that opens its window of brands. */
export function PlaceLink({ place, children, onOpenPlace }: { place: Place; children: ReactNode; onOpenPlace?: Actions['onOpenPlace'] }) {
  if (!onOpenPlace) return <>{children}</>;
  return <a href="#" title={`Show brands in ${children}`} onClick={(event) => { event.preventDefault(); onOpenPlace(place); }}>{children}</a>;
}
type EntityKind = 'house' | 'designer' | 'group';

export function EntityLink({ kind, id, children, onSelect }: {
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

export function Fields({ rows }: { rows: [string, ReactNode][] }) {
  return <table className="fields"><tbody>{rows.filter(([, value]) => value !== undefined && value !== null && value !== '' && value !== false)
    .map(([label, value]) => <tr key={label}><th>{label}:</th><td>{value}</td></tr>)}</tbody></table>;
}
/** `fold`: a fitted Properties window opens only down to this section's heading; its contents need a scroll. */
export function ProfileSection({ title, className, defaultOpen = true, fold = false, children }: { title: string; className?: string; defaultOpen?: boolean; fold?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();
  return <fieldset className={className} data-fold={fold || undefined}>
    <legend><button className="section-toggle" aria-expanded={open} aria-controls={contentId}
      type="button" onClick={() => setOpen((value) => !value)}>
      <span aria-hidden="true">{open ? '▾' : '▸'}</span> {title}
    </button></legend>
    <div id={contentId} hidden={!open}>{children}</div>
  </fieldset>;
}
function Description({ text, defaultOpen = false }: { text?: string; defaultOpen?: boolean }) {
  return text ? <ProfileSection key={text} title="Description" defaultOpen={defaultOpen}>
    <div className="sunken-panel description-box"><p>{text}</p></div>
  </ProfileSection> : null;
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
  const ids = new Set(list.map((house) => house.id));
  const renderBranch = (house: House): ReactNode => {
    const children = list.filter((child) => child.parentHouse === house.id).sort((a, b) => a.name.localeCompare(b.name));
    const link = <EntityLink kind="house" id={house.id} onSelect={onSelect}>{house.name}</EntityLink>;
    return <li key={house.id}>{children.length ? <details><summary>{link} ({children.length} labels)</summary>
      <ul>{children.map(renderBranch)}</ul></details> : link}</li>;
  };
  return <ul>{[...list].filter((house) => !house.parentHouse || !ids.has(house.parentHouse))
    .sort((a, b) => a.name.localeCompare(b.name)).map(renderBranch)}</ul>;
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

/** Founding, moves, ownership changes and the Ended year, oldest first. */
function HistoryTable({ house, onSelect }: { house: House; onSelect: Actions['onSelect'] }) {
  const year = (value: number | undefined, approximate?: boolean) => value === undefined ? '?' : `${approximate ? '~' : ''}${value}`;
  const owner = (event: { group?: string; buyer?: string }) => event.group
    ? <EntityLink kind="group" id={event.group} onSelect={onSelect}>{event.buyer ?? getGroup(event.group)?.name ?? event.group}</EntityLink>
    : event.buyer;
  const describe = (event: HouseEvent): ReactNode => {
    switch (event.type) {
      case 'moved': return `Moved to ${event.city}, ${countryNames[event.country]}`;
      case 'acquired': return <>Acquired by {owner(event)}{event.stake && ` (${event.stake})`}</>;
      case 'spunOff': return event.group || event.buyer ? <>Spun off into {owner(event)}</> : 'Became independent';
      case 'renamed': return `Renamed ${event.name}`;
      case 'closed': return event.label ? `Closed: ${event.label}` : 'Closed';
      case 'relaunched': return event.label ? `Relaunched: ${event.label}` : 'Relaunched';
      case 'other': return event.label;
    }
  };
  const start = house.origin ?? house;
  const rows: [string, ReactNode][] = [
    [year(house.founded), `Founded in ${start.city}, ${countryNames[start.country]}`],
    ...(house.history ?? []).map((event): [string, ReactNode] => [year(event.year, event.approximate), describe(event)]),
    ...(house.closed !== undefined ? [[String(house.closed), 'Ended'] as [string, ReactNode]] : []),
  ];
  return <div className="sunken-panel"><table className="interactive history-table"><thead><tr><th>Year</th><th>Event</th></tr></thead><tbody>
    {rows.map(([when, what], index) => <tr key={index}><td className="nowrap">{when}</td><td>{what}</td></tr>)}
  </tbody></table></div>;
}

/** Collaboration rows visible before the table scrolls (wheel/touch; the scrollbar is hidden). */
export const COLLABORATION_ROWS = 8;
/** A sunken table panel that shows at most `rows` body rows; the rest scroll without a scrollbar. */
export function RowLimitedPanel({ rows, className, children }: { rows: number; className?: string; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = panel.current;
    if (!element) return;
    const fit = () => {
      const body = element.querySelectorAll('tbody > tr');
      const last = body.length > rows ? body[rows - 1] : null;
      if (!last) { element.style.maxHeight = ''; return; }
      const bottom = last.getBoundingClientRect().bottom - element.getBoundingClientRect().top + element.scrollTop;
      element.style.maxHeight = bottom > 0 ? `${Math.ceil(bottom + element.clientTop)}px` : '';
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(fit);
    const table = element.querySelector('table');
    if (table) observer.observe(table);
    return () => observer.disconnect();
  }, [rows, children]);
  return <div ref={panel} className={['sunken-panel row-limited', className].filter(Boolean).join(' ')}>{children}</div>;
}

function CollaborationRow({ house, projects, onSelect }: {
  house: House; projects: Collaboration[]; onSelect: Actions['onSelect'];
}) {
  const years = [...new Set(projects.map((project) => project.year))].sort((a, b) => b - a);
  const [chosenYear, setChosenYear] = useState(years[0]!);
  const year = years.includes(chosenYear) ? chosenYear : years[0]!;
  const partners = projects[0]!.houses.filter((id) => id !== house.id);
  const query = `${[house.id, ...partners].map((id) => getHouse(id)?.name ?? id).join(' x ')} ${year}`;
  return <tr>
    <td>{years.length > 1 ? <SelectBox label={`Search year for ${partners.map((id) => getHouse(id)?.name ?? id).join(', ')}`}
      values={years} value={year} onChange={setChosenYear} /> : year}</td>
    <td>{partners.map((id, index) => <Fragment key={id}>
      {index > 0 && ', '}<EntityLink kind="house" id={id} onSelect={onSelect}>{getHouse(id)?.name ?? id}</EntityLink>
    </Fragment>)}</td>
    <td><a href={`https://www.google.com/search?q=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer">Search</a></td>
  </tr>;
}

function HouseProfile({ house, year, onSelect, onTag, onOpenPlace, onShowOnMap }: { house: House; year: number } & Actions) {
  const collaborations = collaborationsOf(house.id).filter((project) => project.year <= year).toReversed();
  const partnerships = Map.groupBy(collaborations, (project) => project.houses.filter((id) => id !== house.id).toSorted().join('|'));
  const parent = parentHouseOf(house.id);
  const labels = labelsOf(house.id);
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
    <div className="identity">{onShowOnMap
      ? <button type="button" className="logo-button" title="Show on Map" aria-label={`Show ${house.name} on the map`}
        onClick={() => onShowOnMap({ kind: 'house', id: house.id })}><HouseLogo key={`${house.id}:${house.logo}`} house={house} /></button>
      : <HouseLogo key={`${house.id}:${house.logo}`} house={house} />}<div><h2>{house.name}</h2><Fields rows={[
      ['Founded', house.founded !== undefined ? <>{house.founded}{house.closed !== undefined && <><span className="field-separator"> | </span><strong>Ended:</strong> {house.closed}</>}</> : undefined],
      ['Closed', house.founded === undefined ? house.closed : undefined],
      ['Founder', founderLinks.length ? <>{founderLinks.map((link, index) => <Fragment key={index}>{index > 0 && ', '}{link}</Fragment>)}</> : undefined],
      ['Based in', <><PlaceLink place={{ kind: 'city', id: mapLocationForCity(house.city) }} onOpenPlace={onOpenPlace}>{house.city}</PlaceLink>, <PlaceLink place={{ kind: 'country', id: house.country }} onOpenPlace={onOpenPlace}>{countryNames[house.country]}</PlaceLink></>],
      ['Origin', house.origin && <><PlaceLink place={{ kind: 'city', id: mapLocationForCity(house.origin.city) }} onOpenPlace={onOpenPlace}>{house.origin.city}</PlaceLink>, <PlaceLink place={{ kind: 'country', id: house.origin.country }} onOpenPlace={onOpenPlace}>{countryNames[house.origin.country]}</PlaceLink></>],
      ['Label of', parent && <EntityLink kind="house" id={parent.id} onSelect={onSelect}>{parent.name}</EntityLink>],
      ['Group', house.parentGroup && <EntityLink kind="group" id={house.parentGroup} onSelect={onSelect}>{getGroup(house.parentGroup)?.name ?? house.parentGroup}</EntityLink>],
      ['Website', house.website && <Website url={house.website} />],
      ['Instagram', house.instagram && <a href={`https://www.instagram.com/${house.instagram}/`} target="_blank" rel="noreferrer">@{house.instagram}</a>],
    ]} /></div></div>
    {!!labels.length && <fieldset><legend>Labels ({labels.length})</legend><HouseList list={labels} onSelect={onSelect} /></fieldset>}
    {!!house.regionalAffiliations?.length && <fieldset><legend>Regional Relationships</legend><ul>
      {house.regionalAffiliations.map((affiliation) => <li key={`${affiliation.group}:${affiliation.territory}`}>
        <EntityLink kind="group" id={affiliation.group} onSelect={onSelect}>{getGroup(affiliation.group)?.name}</EntityLink>
        {` · ${affiliation.territory} · ${affiliation.relationship}`}
      </li>)}
    </ul></fieldset>}
    {(house.origin || !!house.history?.length) && <ProfileSection title="History"><HistoryTable house={house} onSelect={onSelect} /></ProfileSection>}
    <ProfileSection title={`Creative directors (${directors.length})`}>{directors.length ? <TenureTable list={directors} onSelect={onSelect} /> : <p className="hint">No creative directors recorded.</p>}</ProfileSection>
    {!!business.length && <fieldset><legend>Business leadership</legend><TenureTable list={business} business onSelect={onSelect} /></fieldset>}
    {!!team.length && <ProfileSection title={`Other roles (${team.length})`} defaultOpen={false}><TenureTable list={team} supporting onSelect={onSelect} /></ProfileSection>}
    <ProfileSection title={`Collaboration history (${collaborations.length}\u00a0\u00a0|\u00a0\u00a0Unique: ${partnerships.size})`}>
      {collaborations.length ? <>
        <RowLimitedPanel rows={COLLABORATION_ROWS}><table className="interactive">
        <thead><tr><th>Year</th><th>With</th><th></th></tr></thead>
        <tbody>{[...partnerships].map(([partners, projects]) => <CollaborationRow key={`${house.id}:${partners}`} house={house} projects={projects} onSelect={onSelect} />)}</tbody>
      </table></RowLimitedPanel></> : <p className="hint">No collaborations recorded{Number.isFinite(year) ? ` through ${year}` : ''}.</p>}
    </ProfileSection>
    <Description text={house.notes} defaultOpen />
    <ProfileSection title="Tags" className="house-tags" fold>{tagGroups.map(([group, label, values]) =>
      <div className="tag-group" key={group}><p>{label}</p><div className="tag-list">{values.map((value) =>
        <button key={value} className="tag" data-tag-kind={group} data-tag-value={value} title={`Filter by ${tagLabel(value)}`} onClick={() => onTag(group, value)}>{tagLabel(value)}</button>
      )}</div></div>)}</ProfileSection>
  </>;
}

function GroupProfile({ id, onSelect }: { id: string; onSelect: Actions['onSelect'] }) {
  const group = getGroup(id);
  if (!group) return <p>No group with id “{id}”.</p>;
  const brands = housesInGroup(id);
  const regionalBrands = regionalHousesInGroup(id);
  return <><h2>{group.name}</h2><Fields rows={[["Official Website", <Website url={group.website} />]]} />
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
    <Description text={[group.description, group.notes].filter(Boolean).join('\n\n')} /></>;
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
    </li>)}</ul> : <p className="hint">No moves between houses recorded.</p>}</fieldset><Description text={designer.notes} /></>;
}

export function panelTitle(selection: Selection): string {
  if (!selection) return 'Properties';
  const name = selection.kind === 'house' ? getHouse(selection.id)?.name : selection.kind === 'designer' ? getDesigner(selection.id)?.name : getGroup(selection.id)?.name;
  return name ?? 'Not found';
}

export function PanelContent({ selection, year = Infinity, onSelect, onTag, onOpenPlace, onShowOnMap }: {
  selection: Selection; year?: number;
} & Actions) {
  if (selection?.kind === 'house') {
    const house = getHouse(selection.id);
    return house ? <HouseProfile key={house.id} house={house} year={year} onSelect={onSelect} onTag={onTag} onOpenPlace={onOpenPlace} onShowOnMap={onShowOnMap} /> : <p>No house with id “{selection.id}”.</p>;
  }
  if (selection?.kind === 'designer') return <DesignerProfile id={selection.id} onSelect={onSelect} />;
  if (selection?.kind === 'group') return <GroupProfile id={selection.id} onSelect={onSelect} />;
  return <p className="hint">Nothing selected.</p>;
}
