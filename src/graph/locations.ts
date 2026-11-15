import { cities, type CityName } from '../data/cities';
import { getHouse } from '../data';
import type { LatLng } from '../types';

/**
 * Display groups only: a house's actual city remains in the source data,
 * directory and Properties window. Anchor each regional pin to a member city.
 * Keep these groups stable when filters change so pins don't jump around.
 * Major cities retain individual pins; group only the smaller nearby cities.
 */
export const mapRegions = {
  'Bay Area': {
    anchor: 'Richmond',
    cities: ['Richmond'],
  },
  'Central Coast': {
    anchor: 'Santa Barbara',
    cities: ['Santa Cruz', 'Santa Barbara', 'Goleta', 'Ventura'],
  },
  'Southern California': {
    anchor: 'Gardena',
    cities: ['Gardena', 'Hermosa Beach', 'San Bernardino', 'Foothill Ranch', 'Costa Mesa', 'San Clemente', 'Newport Beach', 'Irvine', 'Huntington Beach', 'Seal Beach', 'Carlsbad', 'Oceanside'],
  },
  Piedmont: {
    anchor: 'Biella',
    cities: ['Biella', 'Quarona', 'Lesa'],
  },
  Lombardy: {
    anchor: 'Albino',
    cities: ['Albino'],
  },
  Veneto: {
    anchor: 'Vicenza',
    cities: ['Vicenza', 'Caerano di San Marco', 'Onè di Fonte', 'Cavarzere', 'Segusino', 'Giavera del Montello'],
  },
  'Emilia-Romagna': {
    anchor: 'Reggio Emilia',
    cities: ['Reggio Emilia', 'Carpi', 'Ferrara'],
  },
  Tuscany: {
    anchor: 'Pescia',
    cities: ['Pescia'],
  },
} as const satisfies Record<string, { anchor: CityName; cities: readonly CityName[] }>;

const regionsByCity = new Map<string, string>(Object.entries(mapRegions)
  .flatMap(([region, { cities }]) => cities.map((city) => [city, region] as const)));

/** Unlisted cities keep their own pin. Region names are already location IDs. */
export const mapLocationForCity = (city: string): string => regionsByCity.get(city) ?? city;

/** Labels share their top-level house's map location; their actual city is retained. */
export function mapHousePath(id: string): string[] {
  const path: string[] = [];
  let house = getHouse(id);
  while (house && !path.includes(house.id)) {
    path.unshift(house.id);
    house = house.parentHouse ? getHouse(house.parentHouse) : undefined;
  }
  return path;
}

export const mapHouseRoot = (id: string): string => mapHousePath(id)[0] ?? id;
export const mapLocationForHouse = (id: string): string => mapLocationForCity(getHouse(mapHouseRoot(id))!.city);

export function mapLocationCoordinates(location: string): LatLng {
  const region = Object.hasOwn(mapRegions, location) ? mapRegions[location as keyof typeof mapRegions] : undefined;
  return cities[region?.anchor ?? (location as CityName)];
}
