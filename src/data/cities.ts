import type { LatLng } from '../types';

/**
 * Where each city sits on the world map. Every house's `city` must be a key
 * here (enforced by the type in houses.ts), so add the city first when a
 * house is somewhere new.
 */
export const cities = {
  Paris: [48.8566, 2.3522],
  London: [51.5074, -0.1278],
  Milan: [45.4642, 9.19],
  Florence: [43.7696, 11.2558],
  Rome: [41.9028, 12.4964],
  Madrid: [40.4168, -3.7038],
  'New York': [40.7128, -74.006],
  Tokyo: [35.6762, 139.6503],
  Okayama: [34.6551, 133.9195],
  Seoul: [37.5665, 126.978],
} satisfies Record<string, LatLng>;

export type CityName = keyof typeof cities;
