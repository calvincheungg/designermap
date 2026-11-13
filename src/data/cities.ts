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
  Solomeo: [43.0905, 12.2836],
  Carpi: [44.7833, 10.885],
  "Sant'Elpidio a Mare": [43.2286, 13.6858],
  Florence: [43.7696, 11.2558],
  Rome: [41.9028, 12.4964],
  Bologna: [44.4949, 11.3426],
  'Reggio Emilia': [44.6983, 10.6312],
  Vicenza: [45.5455, 11.5354],
  Venice: [45.4408, 12.3155],
  Madrid: [40.4168, -3.7038],
  'New York': [40.7128, -74.006],
  'Los Angeles': [34.0522, -118.2437],
  Antwerp: [51.2194, 4.4025],
  Stockholm: [59.3293, 18.0686],
  Brighton: [50.8225, -0.1372],
  'Shepton Mallet': [51.1897, -2.5469],
  'South Shields': [54.9986, -1.4323],
  Copenhagen: [55.6761, 12.5683],
  Berlin: [52.52, 13.405],
  Munich: [48.1351, 11.582],
  'Weil am Rhein': [47.5937, 7.6206],
  'Tel Aviv': [32.0853, 34.7818],
  Moscow: [55.7558, 37.6173],
  Amsterdam: [52.3676, 4.9041],
  Budapest: [47.4979, 19.0402],
  Metzingen: [48.5368, 9.2853],
  Lugano: [46.0037, 8.9511],
  Toronto: [43.6532, -79.3832],
  Vancouver: [49.2827, -123.1207],
  Montreal: [45.5019, -73.5674],
  Sydney: [-33.8688, 151.2093],
  Tokyo: [35.6762, 139.6503],
  Okayama: [34.6551, 133.9195],
  Kyoto: [35.0116, 135.7681],
  Seoul: [37.5665, 126.978],
  Shanghai: [31.2304, 121.4737],
} satisfies Record<string, LatLng>;

export type CityName = keyof typeof cities;
