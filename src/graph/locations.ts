import { cities, cityRegions, type CityName } from '../data/cities';
import { getHouse } from '../data';
import type { House, LatLng } from '../types';

/**
 * Geographic names for nearby-city clusters. These are label hints only:
 * every city keeps its own pin and grid, revealed as the map zooms in.
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

/** Always independent, even when the dataset contains fewer than five brands. */
export const majorCities = [
  'Paris', 'London', 'Milan', 'Rome', 'Florence', 'Turin', 'Venice', 'Bologna',
  'New York', 'Los Angeles', 'San Francisco',
  'Tokyo', 'Osaka', 'Kyoto', 'Seoul', 'Shanghai', 'Hong Kong', 'Taipei',
  'Toronto', 'Montreal', 'Vancouver', 'Copenhagen', 'Stockholm',
  'Berlin', 'Munich', 'Amsterdam', 'Antwerp', 'Barcelona', 'Madrid',
  'Sydney', 'Melbourne', 'Singapore',
] as const satisfies readonly CityName[];
const majorCitySet: ReadonlySet<string> = new Set(majorCities);

/** Count main brands across all years/filters, so a major city never flickers into a cluster. */
export const isMajorCity = (city: string, brandCount: number): boolean =>
  brandCount >= 5 || majorCitySet.has(city);

export const mapLocationForCity = (city: string): string => city;

/** Which city places brands on the map: their current base or their founding city. */
export type LocationMode = 'current' | 'origin';
let locationMode: LocationMode = 'current';
export const getLocationMode = (): LocationMode => locationMode;
/** Set before creating a DesignerGraph; an existing graph keeps the layout it was built with. */
export function setLocationMode(mode: LocationMode) { locationMode = mode; }
const mapCityOf = (house: House): string => locationMode === 'origin' && house.origin ? house.origin.city : house.city;

/** Prefer familiar region names; otherwise name the area after its largest member city. */
export function clusterLabel(members: readonly string[], representative: string): string {
  for (const [name, region] of Object.entries(mapRegions)) {
    if (members.every(city => (region.cities as readonly string[]).includes(city))) return name;
  }
  const regions = members.map(city => cityRegions[city as CityName]);
  const first = regions[0];
  if (first && regions.every(region => region?.country === first.country && region.region === first.region)) {
    return first.region;
  }
  return `${representative} area`;
}

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
export const mapLocationForHouse = (id: string): string => mapLocationForCity(mapCityOf(getHouse(mapHouseRoot(id))!));

export function mapLocationCoordinates(location: string): LatLng {
  return cities[location as CityName];
}
