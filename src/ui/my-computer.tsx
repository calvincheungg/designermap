import { useCallback, useEffect, useMemo, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import type { House } from '../types';
import { countryNames, designers, getHouse, groups, housesInGroup, type GroupId } from '../data';
import { CountryCode, countryContinents } from '../data/countries';
import { cityRegions, type CityName } from '../data/cities';
import { mapLocationForCity } from '../graph/locations';
import { ContextMenu, type MenuAction } from './context-menu';
import { SelectBox } from './listbox';
import { BrandIcon, useStoredChoice } from './city-window';
import { marketPositionings } from '../data/tags';
import { StartIcon } from './start-icons';
import type { Place, Selection } from './panel';

/**
 * My Computer: the dataset as Win98 drives and folders. Locations (C:) holds
 * continents ▸ countries ▸ cities ▸ brands, Brands (D:) market-position folders,
 * Groups (E:) each group's brands and Designers (F:) designers filed A–Z. USA and Canada folders hold states / provinces, each listing all its brands. Everything follows the year and tag filters.
 */
const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
const byName = <T extends { name: string }>(list: readonly T[]) => [...list].sort((a, b) => collator.compare(a.name, b.name));
const PATH_KEY = 'designer-map:computer-path';
const VIEW_KEY = 'designer-map:computer-view';
const VIEWS = [['icons', 'Large Icons'], ['details', 'Details']] as const;
type View = (typeof VIEWS)[number][0];
export const DRIVES = { C: 'Locations', D: 'Brands', E: 'Groups', F: 'Designers' } as const;
type Drive = keyof typeof DRIVES;

export type ComputerPath = readonly string[];
/** A folder's contents. Folders open by path; brands and designers open their Properties. */
export type Entry = { key: string; name: string; type: string; info: string } & (
  | { kind: 'folder'; icon: 'folder' | 'drive' | 'group'; path: ComputerPath; place?: Place; group?: GroupId }
  | { kind: 'house'; house: House }
  | { kind: 'designer'; id: string }
  | { kind: 'settings' });
export interface Folder { name: string; address: string; entries: Entry[] }

const plural = (n: number, word: string) => `${n} ${n === 1 ? word : `${word}s`}`;
/** A–Z by the name's first letter, ignoring accents; anything else files under #. */
export function letterOf(name: string) {
  const letter = name.normalize('NFD').replace(/[̀-ͯ]/g, '').charAt(0).toUpperCase();
  return /[A-Z]/.test(letter) ? letter : '#';
}
const houseEntry = (house: House): Entry => {
  const parent = house.parentHouse ? getHouse(house.parentHouse) : undefined;
  return { kind: 'house', key: `house:${house.id}`, name: house.name, house, type: parent ? `Label of ${parent.name}` : 'Brand',
    info: house.founded ? `Founded ${house.founded}` : '' };
};
const folder = (path: ComputerPath, name: string, count: number, extra: Partial<Extract<Entry, { kind: 'folder' }>> = {}): Entry =>
  ({ kind: 'folder', key: `folder:${path.join('/')}`, name, path, icon: 'folder', type: 'File Folder', info: plural(count, 'item'), ...extra });

/** The folder at `path`, or null when it doesn't exist (or the filters left it empty). */
export function listFolder(path: ComputerPath, visibleHouses: readonly House[]): Folder | null {
  const [drive, ...rest] = path;
  if (drive === undefined) {
    return { name: 'My Computer', address: 'My Computer', entries: [
      ...(Object.entries(DRIVES) as [Drive, string][]).map(([letter, label]) =>
        folder([letter], `${label} (${letter}:)`, listFolder([letter], visibleHouses)?.entries.length ?? 0, { icon: 'drive', type: 'Local Disk' })),
      { kind: 'settings', key: 'settings', name: 'Control Panel', type: 'System Folder', info: '' },
    ] };
  }
  if (!Object.hasOwn(DRIVES, drive)) return null;
  const address = (names: readonly string[]) => `${drive}:\\${names.join('\\')}`;
  const ids = new Set(visibleHouses.map((house) => house.id));
  /** A brand with its city in Info, for folders that skip the city level. */
  const withCity = (house: House): Entry => {
    const entry = houseEntry(house);
    return { ...entry, info: [house.city, entry.info].filter(Boolean).join(' · ') };
  };
  if (drive === 'C') {
    const [continent, country, city, ...more] = rest;
    if (more.length) return null;
    const inContinent = (name: string) => visibleHouses.filter((house) => countryContinents[house.country] === name);
    if (continent === undefined) {
      const continents = [...new Set(visibleHouses.map((house) => countryContinents[house.country]))].sort(collator.compare);
      return { name: `${DRIVES.C} (C:)`, address: address([]), entries: continents.map((name) => {
        const count = new Set(inContinent(name).map((house) => house.country)).size;
        return folder(['C', name], name, count, { info: plural(count, 'country') });
      }) };
    }
    const continentHouses = inContinent(continent);
    if (!continentHouses.length) return null;
    if (country === undefined) {
      const countries = [...new Set(continentHouses.map((house) => house.country))]
        .map((code) => ({ code, name: countryNames[code] })).sort((a, b) => collator.compare(a.name, b.name));
      return { name: continent, address: address([continent]), entries: countries.map(({ code, name }) => {
        const count = new Set(continentHouses.filter((house) => house.country === code).map((house) => house.city)).size;
        return folder(['C', continent, code], name, count, { info: plural(count, 'city'), place: { kind: 'country', id: code } });
      }) };
    }
    const countryHouses = continentHouses.filter((house) => house.country === country);
    if (!countryHouses.length) return null;
    const countryName = countryNames[country as CountryCode];
    // The USA and Canada are filed by state / province instead: their cities are too many and too small to browse one by one.
    if (country === CountryCode.UnitedStates || country === CountryCode.Canada) {
      const regionType = country === CountryCode.Canada ? 'Province' : 'State';
      const stateOf = (house: House) => cityRegions[house.city as CityName]?.region ?? house.city;
      if (city === undefined) {
        const states = [...new Set(countryHouses.map(stateOf))].sort(collator.compare);
        return { name: countryName, address: address([continent, countryName]), entries: states.map((state) => {
          const count = countryHouses.filter((house) => stateOf(house) === state).length;
          return folder(['C', continent, country, state], state, count, { info: plural(count, 'brand'), type: regionType });
        }) };
      }
      const stateHouses = countryHouses.filter((house) => stateOf(house) === city);
      if (!stateHouses.length) return null;
      // Each brand's city replaces the city folder level it skips.
      return { name: city, address: address([continent, countryName, city]), entries: byName(stateHouses).map(withCity) };
    }
    if (city === undefined) {
      const cities = [...new Set(countryHouses.map((house) => house.city))].sort(collator.compare);
      return { name: countryName, address: address([continent, countryName]), entries: cities.map((name) => {
        const count = countryHouses.filter((house) => house.city === name).length;
        return folder(['C', continent, country, name], name, count, { info: plural(count, 'brand'), place: { kind: 'city', id: mapLocationForCity(name) } });
      }) };
    }
    // Every brand based in the city, labels included, so a label stays reachable when its parent is filtered out.
    const cityHouses = countryHouses.filter((house) => house.city === city);
    if (!cityHouses.length) return null;
    return { name: city, address: address([continent, countryName, city]), entries: byName(cityHouses).map(houseEntry) };
  }
  if (drive === 'D') {
    const [tier, ...more] = rest;
    if (more.length) return null;
    const inTier = (name: string) => visibleHouses.filter((house) => house.tags.marketPositioning === name);
    if (tier === undefined) {
      // High Luxury → Budget, as the tiers run everywhere else.
      return { name: `${DRIVES.D} (D:)`, address: address([]), entries: marketPositionings.filter((name) => inTier(name).length).map((name) =>
        folder(['D', name], name, inTier(name).length, { type: 'Market Position', info: plural(inTier(name).length, 'brand') })) };
    }
    const tierHouses = inTier(tier);
    if (!tierHouses.length) return null;
    return { name: tier, address: address([tier]), entries: byName(tierHouses).map(withCity) };
  }
  if (drive === 'E') {
    const [id, ...more] = rest;
    if (more.length) return null;
    const members = (group: string) => housesInGroup(group).filter((house) => ids.has(house.id));
    if (id === undefined) {
      return { name: `${DRIVES.E} (E:)`, address: address([]), entries: byName(groups).map((group) =>
        folder(['E', group.id], group.name, members(group.id).length, { icon: 'group', type: 'Group', info: plural(members(group.id).length, 'brand'), group: group.id })) };
    }
    const group = groups.find((g) => g.id === id);
    if (!group) return null;
    return { name: group.name, address: address([group.name]), entries: byName(members(group.id)).map(houseEntry) };
  }
  const [letter, ...more] = rest;
  if (more.length) return null;
  const people = byName(designers.filter((designer) => designer.career.some((tenure) => ids.has(tenure.house))));
  if (letter === undefined) {
    const letters = [...new Set(people.map((designer) => letterOf(designer.name)))].sort((a, b) => a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b));
    return { name: `${DRIVES.F} (F:)`, address: address([]), entries: letters.map((name) =>
      folder(['F', name], name, people.filter((designer) => letterOf(designer.name) === name).length)) };
  }
  const filed = people.filter((designer) => letterOf(designer.name) === letter);
  if (!filed.length) return null;
  return { name: letter, address: address([letter]), entries: filed.map((designer): Entry => ({
    kind: 'designer', key: `designer:${designer.id}`, name: designer.name, id: designer.id, type: 'Designer',
    info: plural(designer.career.filter((tenure) => ids.has(tenure.house)).length, 'role'),
  })) };
}

/** The deepest folder of `path` that still exists, e.g. after the filters empty a city. */
export function nearestFolder(path: ComputerPath, visibleHouses: readonly House[]): { path: ComputerPath; folder: Folder } {
  for (let depth = path.length; depth >= 0; depth--) {
    const folder = listFolder(path.slice(0, depth), visibleHouses);
    if (folder) return { path: path.slice(0, depth), folder };
  }
  return { path: [], folder: listFolder([], visibleHouses)! };
}

function readPath(): ComputerPath {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(PATH_KEY) ?? '[]');
    return Array.isArray(value) && value.every((part) => typeof part === 'string') ? value : [];
  } catch { return []; }
}

/** Win98's yellow folder (public/assets/folder.webp, cut from folder.jpg). */
export const FOLDER_ICON = '/assets/folder.webp';
/** Win98's 48px My Computer icon, cut from my_computer.jpg (its teal background made transparent). */
export const MY_COMPUTER_ICON = '/assets/my_computer.webp';
const folderImage = (size: number, className?: string) => <img className={className} src={FOLDER_ICON} alt="" width={size} height={size} draggable={false} />;

function EntryIcon({ entry }: { entry: Entry }) {
  if (entry.kind === 'house') return <BrandIcon house={entry.house} />;
  const icon: ReactNode = entry.kind === 'settings' ? <img src="/assets/settings.webp" alt="" width={32} height={32} draggable={false} />
    : entry.kind === 'folder' && entry.icon === 'folder' ? folderImage(32)
    : <StartIcon name={entry.kind === 'designer' ? 'designer' : entry.icon} size={32} className="computer-svg" />;
  return <span className="computer-icon-image">{icon}</span>;
}

/** The My Computer window: Back / Forward / Up, an Address bar, and the folder in Large Icons or Details. */
export function MyComputerContent({ visibleHouses, onSelect, onShowOnMap, onOpenPlace, onShowPlace, onOpenSettings }: {
  visibleHouses: readonly House[];
  onSelect: (selection: Selection, reveal?: boolean) => void;
  /** Select an item on the map without opening its Properties. */
  onShowOnMap: (selection: NonNullable<Selection>) => void;
  onOpenPlace: (place: Place) => void;
  /** Open these map locations' grids on the map and frame them. */
  onShowPlace: (cities: readonly string[]) => void;
  onOpenSettings: () => void;
}) {
  const [history, setHistory] = useState<{ back: ComputerPath[]; forward: ComputerPath[] }>({ back: [], forward: [] });
  const [wanted, setWanted] = useState<ComputerPath>(readPath);
  const [view, setView] = useStoredChoice<View>(VIEW_KEY, VIEWS, 'icons');
  const [menu, setMenu] = useState<{ x: number; y: number; entry: Entry } | null>(null);
  const closeMenu = useCallback(() => setMenu(null), []);
  const { path, folder: current } = useMemo(() => nearestFolder(wanted, visibleHouses), [wanted, visibleHouses]);
  useEffect(() => { try { localStorage.setItem(PATH_KEY, JSON.stringify(path)); } catch { /* storage unavailable */ } }, [path]);

  const go = (next: ComputerPath) => {
    if (next.join('/') === path.join('/')) return;
    setHistory((h) => ({ back: [...h.back, path], forward: [] }));
    setWanted(next);
  };
  const back = () => {
    const previous = history.back.at(-1);
    if (!previous) return;
    setHistory((h) => ({ back: h.back.slice(0, -1), forward: [path, ...h.forward] }));
    setWanted(previous);
  };
  const forward = () => {
    const [next] = history.forward;
    if (!next) return;
    setHistory((h) => ({ back: [...h.back, path], forward: h.forward.slice(1) }));
    setWanted(next);
  };
  const up = () => { if (path.length) go(path.slice(0, -1)); };
  const open = (entry: Entry) => {
    if (entry.kind === 'folder') go(entry.path);
    else if (entry.kind === 'house') onSelect({ kind: 'house', id: entry.house.id }, true);
    else if (entry.kind === 'designer') onSelect({ kind: 'designer', id: entry.id }, true);
    else onOpenSettings();
  };
  const actions = (entry: Entry): MenuAction[] => {
    const list: MenuAction[] = [{ label: 'Open', primary: true, run: () => open(entry) }];
    if (entry.kind === 'folder') {
      const { place, group } = entry;
      if (place) list.push({ label: `Open ${place.kind === 'city' ? 'City' : 'Country'} Window`, run: () => onOpenPlace(place) });
      if (place?.kind === 'city') list.push({ label: 'Show on Map', run: () => onShowPlace([place.id]) });
      if (group) {
        list.push({ label: 'Show on Map', run: () => onShowOnMap({ kind: 'group', id: group }) });
        list.push({ label: 'Properties', separator: true, run: () => onSelect({ kind: 'group', id: group }, true) });
      }
    } else if (entry.kind === 'house') {
      const city = mapLocationForCity(entry.house.city);
      list.push({ label: 'Show on Map', run: () => onShowOnMap({ kind: 'house', id: entry.house.id }) });
      list.push({ label: `Open ${city}`, separator: true, run: () => onOpenPlace({ kind: 'city', id: city }) });
    } else if (entry.kind === 'designer') {
      list.push({ label: 'Show on Map', run: () => onShowOnMap({ kind: 'designer', id: entry.id }) });
    }
    return list;
  };
  const openMenu = (entry: Entry) => (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const keyboard = event.clientX === 0 && event.clientY === 0;
    setMenu({ x: keyboard ? rect.left + rect.width / 2 : event.clientX, y: keyboard ? rect.top + rect.height / 2 : event.clientY, entry });
  };
  // Win98 Explorer keys: Backspace goes up a folder, Alt+← / Alt+→ go back and forward.
  const keys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    if (event.key === 'Backspace') { event.preventDefault(); up(); }
    else if (event.altKey && event.key === 'ArrowLeft') { event.preventDefault(); back(); }
    else if (event.altKey && event.key === 'ArrowRight') { event.preventDefault(); forward(); }
  };
  const label = `Contents of ${current.name}`;
  /** The Address bar's parts (C: ▸ Europe ▸ France…), each a link to that folder. */
  const crumbs = useMemo(() => path.length
    ? path.map((_, i) => {
      const prefix = path.slice(0, i + 1);
      const name = listFolder(prefix, visibleHouses)?.name ?? prefix.at(-1)!;
      return { path: prefix, name, label: i === 0 ? `${prefix[0]}:` : name };
    })
    : [{ path: [] as ComputerPath, name: 'My Computer', label: 'My Computer' }], [path, visibleHouses]);

  return <div className="city-window-content computer-content" onKeyDown={keys}>
    <div className="computer-toolbar" role="toolbar" aria-label="Standard Buttons">
      <button type="button" className="computer-nav" disabled={!history.back.length} onClick={back} title="Back (Alt+←)"><span aria-hidden="true">◄ </span>Back</button>
      <button type="button" className="computer-nav" disabled={!history.forward.length} onClick={forward} title="Forward (Alt+→)">Forward<span aria-hidden="true"> ►</span></button>
      <button type="button" className="computer-nav" disabled={!path.length} onClick={up} title="Up one level (Backspace)"><span aria-hidden="true">▲ </span>Up</button>
      <SelectBox label="View" className="city-choice" values={VIEWS.map(([key]) => key)} value={view} onChange={setView}
        text={(value) => VIEWS.find(([key]) => key === value)![1]} />
    </div>
    <div className="computer-address">
      <span>Address</span>
      <output className="computer-address-field" aria-label="Address">
        <button type="button" className="computer-crumb-icon" aria-label="Go to My Computer" title="My Computer" onClick={() => go([])}>
          {path.length > 1 ? folderImage(16, 'computer-address-icon') : path.length ? <StartIcon name="drive" size={16} className="computer-address-icon" />
            : <img className="computer-address-icon smooth-icon" src={MY_COMPUTER_ICON} alt="" width={16} height={16} draggable={false} />}
        </button>
        {crumbs.map((crumb, i) => <span key={crumb.path.join('/')} className="computer-crumb-part">
          {i > 1 && <span aria-hidden="true">{'\\'}</span>}
          <button type="button" className="computer-crumb" aria-current={i === crumbs.length - 1 ? 'location' : undefined}
            title={`Go to ${crumb.name}`} onClick={() => go(crumb.path)}>{crumb.label}</button>
          {i === 0 && path.length > 0 && <span aria-hidden="true">{'\\'}</span>}
        </span>)}
      </output>
    </div>
    {!current.entries.length ? <p className="hint city-empty">This folder is empty.</p>
      : view === 'details'
        ? <div className="city-details sunken-panel"><table className="interactive" aria-label={label}>
          <thead><tr><th>Name</th><th>Type</th><th>Info</th></tr></thead>
          <tbody>{current.entries.map((entry) => <tr key={entry.key} onClick={() => open(entry)} onContextMenu={openMenu(entry)}>
            <td><button type="button" className="city-row-name" onClick={(event) => { event.stopPropagation(); open(entry); }}>{entry.name}</button></td>
            <td>{entry.type}</td>
            <td>{entry.info}</td>
          </tr>)}</tbody>
        </table></div>
        : <ul className="city-grid sunken-panel" aria-label={label}>
          {current.entries.map((entry) => <li key={entry.key}>
            <button type="button" className="city-icon" title={[entry.name, entry.type, entry.info].filter(Boolean).join('\n')}
              onClick={() => open(entry)} onContextMenu={openMenu(entry)}>
              <EntryIcon entry={entry} />
              <span className="city-icon-name">{entry.name}</span>
            </button>
          </li>)}
        </ul>}
    <p className="status-bar-field city-count">{plural(current.entries.length, 'object')}</p>
    {menu && <ContextMenu x={menu.x} y={menu.y} label={`${menu.entry.name} actions`} actions={actions(menu.entry)} onClose={closeMenu} />}
  </div>;
}
