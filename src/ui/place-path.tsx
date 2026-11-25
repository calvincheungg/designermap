import { useCallback, useState, type MouseEvent } from 'react';
import { countryNames, houses } from '../data';
import { countryContinents, type CountryCode } from '../data/countries';
import { housesByMapLocation } from '../graph/geo';
import { mapCountryForHouse } from '../graph/locations';
import { collator } from '../text';
import { ContextMenu, type MenuAction } from './context-menu';
import type { Place } from './panel';

/** The country a map location belongs to (an origin link can name a city no brand is placed at). */
export function countryOfCity(city: string): CountryCode | undefined {
  const placed = housesByMapLocation().get(city)?.[0];
  return placed ? mapCountryForHouse(placed.id) : houses.find((house) => house.city === city)?.country
    ?? houses.find((house) => house.origin?.city === city)?.origin?.country;
}

/** A place window's path, Europe ▸ France ▸ Paris: names go up, the arrows list what else is at that level. */
export function PlacePath({ place, visibleIds, onOpenPlace }: {
  place: Place; visibleIds: ReadonlySet<string>; onOpenPlace: (place: Place) => void;
}) {
  const [menu, setMenu] = useState<{ x: number; y: number; level: 'countries' | 'cities' } | null>(null);
  const close = useCallback(() => setMenu(null), []);
  const country = place.kind === 'country' ? place.id : countryOfCity(place.id);
  if (!country) return null;
  const continent = countryContinents[country];
  const open = (level: 'countries' | 'cities') => (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenu({ x: rect.left, y: rect.bottom, level });
  };
  const actions = (): MenuAction[] => menu?.level === 'countries'
    ? [...new Set(houses.filter((house) => !house.parentHouse && visibleIds.has(house.id) && countryContinents[house.country] === continent).map((house) => house.country))]
      .sort((a, b) => collator.compare(countryNames[a], countryNames[b]))
      .map((id) => ({ label: countryNames[id], primary: id === country, run: () => onOpenPlace({ kind: 'country', id }) }))
    : [...housesByMapLocation()].filter(([, list]) => list.some((house) => !house.parentHouse && visibleIds.has(house.id)) && mapCountryForHouse(list[0]!.id) === country)
      .map(([city]) => city).sort(collator.compare)
      .map((id) => ({ label: id, primary: place.kind === 'city' && id === place.id, run: () => onOpenPlace({ kind: 'city', id }) }));
  const arrow = (level: 'countries' | 'cities', label: string) => <button type="button" className="place-path-arrow" aria-haspopup="menu" aria-label={label} title={label} onClick={open(level)}>▸</button>;
  return <nav className="place-path" aria-label="Location">
    <button type="button" className="place-path-part" title={`Countries in ${continent}`} onClick={open('countries')}>{continent}</button>
    {arrow('countries', `Countries in ${continent}`)}
    {place.kind === 'country' ? <span aria-current="location">{countryNames[country]}</span>
      : <button type="button" className="place-path-part" title={`Open ${countryNames[country]}`} onClick={() => onOpenPlace({ kind: 'country', id: country })}>{countryNames[country]}</button>}
    {arrow('cities', `Cities in ${countryNames[country]}`)}
    {place.kind === 'city' && <span aria-current="location">{place.id}</span>}
    {menu && <ContextMenu x={menu.x} y={menu.y} label={menu.level === 'countries' ? `Countries in ${continent}` : `Cities in ${countryNames[country]}`} actions={actions()} onClose={close} />}
  </nav>;
}
