import { cities, cityRegions, type CityName } from '../data/cities';
import { countryNames, type CountryCode } from '../data/countries';
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

/** Main brands a city needs to keep its own pin; smaller cities join their country's. */
export const MAJOR_CITY_BRANDS = 5;

/** Count main brands across all years/filters, so a major city never flickers into a cluster. */
export const isMajorCity = (brandCount: number): boolean => brandCount >= MAJOR_CITY_BRANDS;

/** How many of the busiest map locations get a red pin. */
export const TOP_CITY_COUNT = 10;

/**
 * The `TOP_CITY_COUNT` map locations with the most main brands, counted across the
 * full dataset (like major cities), so filters never recolour a pin. Ties break by name.
 */
export function topCities(counts: readonly { city: string; count: number }[]): ReadonlySet<string> {
  return new Set([...counts]
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city))
    .slice(0, TOP_CITY_COUNT)
    .map((c) => c.city));
}

export const mapLocationForCity = (city: string): string => city;

/** Which city places brands on the map: their current base or their founding city. */
export type LocationMode = 'current' | 'origin';
let locationMode: LocationMode = 'current';
export const getLocationMode = (): LocationMode => locationMode;
/** Set before creating a DesignerGraph; an existing graph keeps the layout it was built with. */
export function setLocationMode(mode: LocationMode) { locationMode = mode; }
const mapCityOf = (house: House): string => locationMode === 'origin' && house.origin ? house.origin.city : house.city;

/** Country of the brand's map location, matching `mapLocationForHouse`. */
export function mapCountryForHouse(id: string): CountryCode {
  const house = getHouse(mapHouseRoot(id))!;
  return locationMode === 'origin' && house.origin ? house.origin.country : house.country;
}

/** Name of a country or state/province pin. */
export const areaLabel = (area: { country: string; region?: string }): string =>
  area.region ?? countryNames[area.country as CountryCode] ?? area.country;

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
