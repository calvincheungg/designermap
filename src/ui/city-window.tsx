import { useId, useMemo, useState } from 'react';
import type { House } from '../types';
import { housesByMapLocation } from '../graph/geo';
import { initialsIcon, logoInfo, mapLogoUrl } from '../graph/icons';
import { matchingItems, SearchBox, type ListItem } from './listbox';
import { countryNames, houses } from '../data';
import { mapLocationForCity } from '../graph/locations';
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
/** Left padding + the right scrollbar gutter; +2px width and +6px height slack so rounding or a wrapped name never overflows. */
const CHROME = { width: 6 + 8 + 4 + 2 * SCROLLBAR + 2, height: 132 };
/** City windows are always CITY_GRID_COLUMNS icons wide and open at most CITY_GRID_ROWS tall; bigger places scroll. */
export const CITY_GRID_COLUMNS = 3;
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

/**
 * A city's or country's brands as a grid of Win98 desktop icons, like an
 * Explorer folder in Large Icons view. Find narrows the grid as you type and
 * its dropdown lists every brand here; picking one, or clicking an icon, opens its Properties.
 */
export function PlaceWindowContent({ place, visibleIds, onSelect }: {
  place: Place; visibleIds: ReadonlySet<string>; onSelect: (selection: Selection, reveal?: boolean) => void;
}) {
  const id = useId();
  const [query, setQuery] = useState('');
  const city = placeTitle(place);
  const brands = useMemo(() => placeBrands(place, visibleIds), [place, visibleIds]);
  const founded = useMemo(() => placeOrigins(place, visibleIds), [place, visibleIds]);
  const items = useMemo<ListItem<string>[]>(() => [...brands, ...founded]
    .map((house) => ({ label: house.name, aliases: house.aliases, value: house.id })), [brands, founded]);
  const matches = useMemo(() => query.trim() ? new Set(matchingItems(items, query, Infinity).map((item) => item.value)) : null, [items, query]);
  const shown = matches ? brands.filter((house) => matches.has(house.id)) : brands;
  const shownFounded = matches ? founded.filter((house) => matches.has(house.id)) : founded;
  const total = brands.length + founded.length;
  const open = (houseId: string) => onSelect({ kind: 'house', id: houseId }, true);
  const tile = (house: House) => <li key={house.id}>
    <button type="button" className="city-icon" title={house.name} onClick={() => open(house.id)}>
      <BrandIcon house={house} />
      <span className="city-icon-name">{house.name}</span>
    </button>
  </li>;

  return <div className="city-window-content">
    <div className="city-search">
      <SearchBox items={items} value={query} onChange={setQuery} limit={Infinity} label="Find:" inputId={`${id}-find`}
        placeholder={`Brand in ${city}`} onPick={(item) => { setQuery(''); open(item.value); }} />
    </div>
    {shown.length || shownFounded.length ? <ul className="city-grid sunken-panel" aria-label={`Brands in ${city}`}>
      {shown.map(tile)}
      {!!shownFounded.length && <>
        <li className="city-grid-heading" role="presentation">Founded here, now based elsewhere</li>
        {shownFounded.map(tile)}
      </>}
    </ul> : <p className="hint city-empty">{total ? 'No brands match your search.' : 'No brands here match the current year and filters.'}</p>}
    <p className="status-bar-field city-count">{matches ? `${shown.length + shownFounded.length} of ${total}` : brands.length} {(matches ? total : brands.length) === 1 ? 'brand' : 'brands'}
      {!matches && !!founded.length && ` · ${founded.length} founded here`}</p>
  </div>;
}
