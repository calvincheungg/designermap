import { useCallback, useEffect, useId, useMemo, useState, type MouseEvent } from 'react';
import type { House } from '../types';
import { housesByMapLocation } from '../graph/geo';
import { initialsIcon, logoInfo, mapLogoUrl } from '../graph/icons';
import { matchingItems, SearchBox, SelectBox, type ListItem } from './listbox';
import { countryNames, houses } from '../data';
import { MarketPositioning } from '../data/tags';
import { mapLocationForCity, mapLocationForHouse } from '../graph/locations';
import { ContextMenu, type MenuAction } from './context-menu';
import type { Place, Selection } from './panel';

const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });

/** Main brands at a map location (labels sit with their parent), within the year and tag filters. */
export function cityBrands(city: string, visibleIds: ReadonlySet<string>): House[] {
  return (housesByMapLocation().get(city) ?? [])
    .filter((house) => !house.parentHouse && visibleIds.has(house.id))
    .sort((a, b) => collator.compare(a.name, b.name));
}

/** Main brands based in a country, within the year and tag filters. */
export function countryBrands(country: string, visibleIds: ReadonlySet<string>): House[] {
  return houses.filter((house) => house.country === country && !house.parentHouse && visibleIds.has(house.id))
    .sort((a, b) => collator.compare(a.name, b.name));
}

export const placeBrands = (place: Place, visibleIds: ReadonlySet<string>) =>
  place.kind === 'city' ? cityBrands(place.id, visibleIds) : countryBrands(place.id, visibleIds);
/**
 * Main brands founded at a place (their `origin`) but based elsewhere now, so
 * an origin link never opens an empty window. Brands already listed are skipped.
 */
export function placeOrigins(place: Place, visibleIds: ReadonlySet<string>): House[] {
  const listed = new Set(placeBrands(place, visibleIds).map((house) => house.id));
  return houses.filter((house) => house.origin && !house.parentHouse && visibleIds.has(house.id) && !listed.has(house.id)
    && (place.kind === 'city' ? mapLocationForCity(house.origin.city) === place.id : house.origin.country === place.id))
    .sort((a, b) => collator.compare(a.name, b.name));
}
/** Tiles the window must fit: brands, then (on a fresh row) a heading row and the founded-here brands. */
export function placeTileCount(place: Place, visibleIds: ReadonlySet<string>) {
  const based = placeBrands(place, visibleIds).length;
  const founded = placeOrigins(place, visibleIds).length;
  if (!founded) return based;
  const padded = Math.ceil(based / CITY_GRID_COLUMNS) * CITY_GRID_COLUMNS;
  return padded + CITY_GRID_COLUMNS + founded;
}
/** City windows are titled with the map location, country windows with the country's name. */
export const placeTitle = (place: Place) => place.kind === 'city' ? place.id : countryNames[place.id];

/** Grid cell and window chrome, in px, matching the city window CSS. */
const CELL = { width: 72, height: 90, columnGap: 2, rowGap: 4 };
/** Win98 (98.css) scrollbar width: also the padding between the tiles and the grid's border. */
const SCROLLBAR = 16;
/** Left padding + the right scrollbar gutter; +2px width and +6px height slack so rounding or a wrapped name never overflows. Height includes the Find row and the View/Sort toolbar. */
const CHROME = { width: 6 + 8 + 4 + 2 * SCROLLBAR + 2, height: 159 };
/** City windows are always CITY_GRID_COLUMNS icons wide and open at most CITY_GRID_ROWS tall; bigger places scroll. */
export const CITY_GRID_COLUMNS = 4;
export const CITY_GRID_ROWS = 4;

/** A CITY_GRID_COLUMNS-wide window, just tall enough for every brand up to CITY_GRID_ROWS rows. */
export function cityWindowSize(count: number) {
  const columns = CITY_GRID_COLUMNS;
  const rows = Math.max(1, Math.min(CITY_GRID_ROWS, Math.ceil(count / columns)));
  return {
    width: CHROME.width + columns * CELL.width + (columns - 1) * CELL.columnGap,
    height: CHROME.height + rows * CELL.height + (rows - 1) * CELL.rowGap,
  };
}

/** The map's icon: a logo inside the grey Win98 frame, or the (already framed) initials square. */
function BrandIcon({ house }: { house: House }) {
  const logo = mapLogoUrl(house);
  if (!logo) return <span className="city-icon-frame plain"><img src={initialsIcon(house)} alt="" draggable={false} /></span>;
  return <span className="city-icon-frame">
    <span className="city-icon-inside" style={{ background: logoInfo.get(logo)?.background ?? '#ffffff' }}>
      <img src={logo} alt="" loading="lazy" draggable={false} />
    </span>
  </span>;
}

export type PlaceView = 'icons' | 'details';
export type PlaceSort = 'name' | 'founded' | 'tier';
const VIEW_KEY = 'designer-map:place-view';
const SORT_KEY = 'designer-map:place-sort';
const VIEWS: readonly (readonly [PlaceView, string])[] = [['icons', 'Large Icons'], ['details', 'Details']];
const SORTS: readonly (readonly [PlaceSort, string])[] = [['name', 'Name'], ['founded', 'Founded'], ['tier', 'Tier']];
const VIEW_VALUES = VIEWS.map(([value]) => value);
const SORT_VALUES = SORTS.map(([value]) => value);
const TIERS: readonly string[] = Object.values(MarketPositioning);

/** One remembered choice shared by every place window (a per-viewer convenience). */
function useStoredChoice<T extends string>(key: string, options: readonly (readonly [T, string])[], fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return options.some(([option]) => option === stored) ? stored as T : fallback;
    } catch { return fallback; }
  });
  useEffect(() => { try { localStorage.setItem(key, value); } catch { /* storage unavailable */ } }, [key, value]);
  return [value, setValue] as const;
}

/** Name is alphabetical; Founded runs oldest first and Tier from High Luxury down, unknowns last, ties by name. */
export function sortPlaceBrands(list: readonly House[], sort: PlaceSort): House[] {
  const key = (house: House) => sort === 'founded' ? house.founded ?? Infinity
    : sort === 'tier' ? TIERS.indexOf(house.tags.marketPositioning) : 0;
  return [...list].sort((a, b) => key(a) - key(b) || collator.compare(a.name, b.name));
}

/**
 * A city's or country's brands as a grid of Win98 desktop icons (or a Details
 * table), like an Explorer folder. Find narrows the list as you type and its
 * dropdown lists every brand here; picking one, or clicking it, opens its
 * Properties. Right-click a brand for more; Show on Map opens the place on the map.
 */
export function PlaceWindowContent({ place, visibleIds, onSelect, onShowOnMap, onOpenPlace, onShowPlace }: {
  place: Place; visibleIds: ReadonlySet<string>; onSelect: (selection: Selection, reveal?: boolean) => void;
  /** Select a brand on the map without opening its Properties. */
  onShowOnMap: (houseId: string) => void;
  onOpenPlace: (place: Place) => void;
  /** Open these map locations' grids on the map and frame them. */
  onShowPlace: (cities: readonly string[]) => void;
}) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [view, setView] = useStoredChoice(VIEW_KEY, VIEWS, 'icons');
  const [sort, setSort] = useStoredChoice(SORT_KEY, SORTS, 'name');
  const [menu, setMenu] = useState<{ x: number; y: number; house: House } | null>(null);
  const closeMenu = useCallback(() => setMenu(null), []);
  const city = placeTitle(place);
  const brands = useMemo(() => placeBrands(place, visibleIds), [place, visibleIds]);
  const founded = useMemo(() => placeOrigins(place, visibleIds), [place, visibleIds]);
  const items = useMemo<ListItem<string>[]>(() => [...brands, ...founded]
    .map((house) => ({ label: house.name, aliases: house.aliases, value: house.id })), [brands, founded]);
  const matches = useMemo(() => query.trim() ? new Set(matchingItems(items, query, Infinity).map((item) => item.value)) : null, [items, query]);
  const shown = useMemo(() => sortPlaceBrands(matches ? brands.filter((house) => matches.has(house.id)) : brands, sort), [brands, matches, sort]);
  const shownFounded = useMemo(() => sortPlaceBrands(matches ? founded.filter((house) => matches.has(house.id)) : founded, sort), [founded, matches, sort]);
  const total = brands.length + founded.length;
  const open = (houseId: string) => onSelect({ kind: 'house', id: houseId }, true);
  const openMenu = (house: House) => (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    // A keyboard context menu (Shift+F10 / Menu key) has no pointer position: use the item's centre.
    const rect = event.currentTarget.getBoundingClientRect();
    const keyboard = event.clientX === 0 && event.clientY === 0;
    setMenu({ x: keyboard ? rect.left + rect.width / 2 : event.clientX, y: keyboard ? rect.top + rect.height / 2 : event.clientY, house });
  };
  const menuActions = (house: House): MenuAction[] => {
    const base = mapLocationForCity(house.city);
    return [
      { label: 'Open', primary: true, run: () => open(house.id) },
      { label: 'Show on Map', run: () => onShowOnMap(house.id) },
      ...(place.kind === 'city' && place.id === base ? [] : [{ label: `Open ${base}`, separator: true, run: () => onOpenPlace({ kind: 'city', id: base }) }]),
      ...(place.kind === 'country' && place.id === house.country ? []
        : [{ label: `Open ${countryNames[house.country]}`, separator: place.kind === 'city' && place.id === base, run: () => onOpenPlace({ kind: 'country', id: house.country }) }]),
    ];
  };
  const tile = (house: House) => <li key={house.id}>
    <button type="button" className="city-icon" title={house.name} onClick={() => open(house.id)} onContextMenu={openMenu(house)}>
      <BrandIcon house={house} />
      <span className="city-icon-name">{house.name}</span>
    </button>
  </li>;
  const row = (house: House) => <tr key={house.id} onClick={() => open(house.id)} onContextMenu={openMenu(house)}>
    <td><button type="button" className="city-row-name" onClick={(event) => { event.stopPropagation(); open(house.id); }}>{house.name}</button></td>
    <td>{house.founded ?? '—'}</td>
    <td>{house.tags.marketPositioning}</td>
  </tr>;
  const header = (key: PlaceSort, label: string) => <th aria-sort={sort === key ? 'ascending' : undefined}>
    <button type="button" className="city-sort" onClick={() => setSort(key)}>{label}{sort === key ? ' ▲' : ''}</button>
  </th>;
  const label = `Brands in ${city}`;
  const heading = 'Founded here, now based elsewhere';

  return <div className="city-window-content">
    <div className="city-search">
      <SearchBox items={items} value={query} onChange={setQuery} limit={Infinity} label="Find:" inputId={`${id}-find`}
        placeholder={`Brand in ${city}`} onPick={(item) => { setQuery(''); open(item.value); }} />
    </div>
    <div className="city-toolbar">
      <SelectBox label="View" className="city-choice" values={VIEW_VALUES} value={view} onChange={setView}
        text={(value) => VIEWS.find(([key]) => key === value)![1]} />
      <SelectBox label="Sort by" className="city-choice" values={SORT_VALUES} value={sort} onChange={setSort}
        text={(value) => `By ${SORTS.find(([key]) => key === value)![1]}`} />
      <button type="button" className="city-map" disabled={!brands.length} title={`Open ${city}'s brands on the map`}
        onClick={() => onShowPlace([...new Set(brands.map((house) => mapLocationForHouse(house.id)))])}>Show on Map</button>
    </div>
    {!shown.length && !shownFounded.length
      ? <p className="hint city-empty">{total ? 'No brands match your search.' : 'No brands here match the current year and filters.'}</p>
      : view === 'details'
        ? <div className="city-details sunken-panel"><table className="interactive" aria-label={label}>
          <thead><tr>{SORTS.map(([key, text]) => header(key, text))}</tr></thead>
          <tbody>
            {shown.map(row)}
            {!!shownFounded.length && <tr className="city-details-heading"><th colSpan={3} scope="rowgroup">{heading}</th></tr>}
            {shownFounded.map(row)}
          </tbody>
        </table></div>
        : <ul className="city-grid sunken-panel" aria-label={label}>
          {shown.map(tile)}
          {!!shownFounded.length && <>
            <li className="city-grid-heading" role="presentation">{heading}</li>
            {shownFounded.map(tile)}
          </>}
        </ul>}
    <p className="status-bar-field city-count">{matches ? `${shown.length + shownFounded.length} of ${total}` : brands.length} {(matches ? total : brands.length) === 1 ? 'brand' : 'brands'}
      {!matches && !!founded.length && ` · ${founded.length} founded here`}</p>
    {menu && <ContextMenu x={menu.x} y={menu.y} label={`${menu.house.name} actions`} actions={menuActions(menu.house)} onClose={closeMenu} />}
  </div>;
}
