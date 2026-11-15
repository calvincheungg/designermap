import { geoGraticule10, geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import world from 'world-atlas/countries-110m.json';
import type { FeatureCollection, MultiLineString } from 'geojson';
import subdivisions from '../data/map/north-america-subdivisions.json';
import { houses } from '../data';
import { mapLocationCoordinates, mapLocationForHouse } from './locations';
import type { House, LatLng } from '../types';
import { PIN_H, PIN_W } from './icons';

/**
 * World-map geometry, in Cytoscape *model* coordinates: the map SVG and the
 * graph share one coordinate space, so the SVG just follows the graph's
 * pan/zoom (see DesignerGraph.syncMapLayer).
 */

export const MAP_WIDTH = 4800;

const SPHERE = { type: 'Sphere' } as const;
const projection = geoNaturalEarth1().fitWidth(MAP_WIDTH, SPHERE);
const path = geoPath(projection);
export const MAP_HEIGHT = Math.ceil(path.bounds(SPHERE)[1][1]);

export interface Point {
  x: number;
  y: number;
}

export function project([lat, lng]: LatLng): Point {
  const [x, y] = projection([lng, lat])!;
  return { x, y };
}

/** World map with internal boundaries for Canadian provinces/territories and US states. */
export function mapSvgMarkup(): string {
  const topo = world as unknown as Topology<{
    countries: GeometryCollection;
    land: GeometryCollection;
  }>;
  const land = path(feature(topo, topo.objects.land));
  const borders = path(mesh(topo, topo.objects.countries, (a, b) => a !== b));
  const regions = subdivisions as unknown as FeatureCollection<MultiLineString, { country: string }>;
  return [
    // Subdivision data uses a finer coastline than world-atlas; clip at the land edge.
    `<defs><clipPath id="map-land-clip"><path d="${land}"/></clipPath></defs>`,
    `<path class="sphere" d="${path(SPHERE)}"/>`,
    `<path class="graticule" d="${path(geoGraticule10())}"/>`,
    `<path class="land" d="${land}"/>`,
    ...regions.features.map((region) =>
      `<path class="subdivision-borders" data-country="${region.properties.country}" clip-path="url(#map-land-clip)" d="${path(region)}"/>`),
    `<path class="borders" d="${borders}"/>`,
  ].join('');
}

/* ---------- City pins + expanded house grids ---------- */

/** Furthest the map can be zoomed out (it also never zooms out past filling the view). */
export const MAP_MIN_ZOOM = 0.3;
/** Pin art pixels → model units when zoomed all the way out. */
export const PIN_SCALE = 5;
/** Largest a pin gets on screen: 2 screen px per art pixel, so the city under it stays visible. */
const PIN_MAX_PX_PER_PIXEL = 2;
/** City names are always drawn at this size on screen. */
export const LABEL_PX = 11;
/** Zoom used to size pins when deciding where expanded house grids go. */
const GRID_REF_ZOOM = 0.6;
/** Grid cell per house icon (icon + two-line label). */
const CELL_W = 96;
const CELL_H = 86;
/** Minimum gap kept between neighbouring things, in model units. */
const GAP = 24;

/** Model units per pin art pixel at a given zoom: scales with the map, then stops growing on screen. */
export const pinScale = (zoom: number) => Math.min(PIN_SCALE, PIN_MAX_PX_PER_PIXEL / zoom);

export interface CityLayout {
  /** Map location ID: an individual city or a display-only regional group. */
  city: string;
  /** Position of the city, or the representative city for a region. */
  anchor: Point;
  /** Where the pin's pointer touches the map: exactly on the location anchor. */
  tip: Point;
  houses: readonly House[];
}

export interface MapLayout {
  cities: CityLayout[];
  /** Positions for the houses of *expanded* cities only. */
  houses: Map<string, Point>;
}

export interface Box {
  city: string;
  kind: 'marker' | 'grid';
  /** Where the box would like to be. */
  home: Point;
  center: Point;
  w: number;
  h: number;
}

/** Alphabetical, ignoring case and accents ("Chloé", "mastermind JAPAN", "424" all sort naturally). */
const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
const byName = (a: House, b: House) => collator.compare(a.name, b.name);

let byLocationCache: ReadonlyMap<string, readonly House[]> | undefined;

/**
 * Houses grouped by map location (city or region), alphabetically within each grid.
 * The data is static, so this is built once and shared; don't mutate it.
 */
export const housesByMapLocation = (): ReadonlyMap<string, readonly House[]> =>
  (byLocationCache ??= new Map(
    [...Map.groupBy(houses, (h) => mapLocationForHouse(h.id))].map(([city, hs]) => [city, [...hs].sort(byName)]),
  ));

const gridSize = (n: number) => {
  const cols = Math.ceil(Math.sqrt(n));
  return { cols, rows: Math.ceil(n / cols) };
};

/** Pin + location label, in model units, positioned at its geographic anchor. */
function pinBox(city: string, zoom: number): Box & { pinH: number } {
  const anchor = project(mapLocationCoordinates(city));
  const k = pinScale(zoom);
  const pinH = PIN_H * k;
  const w = Math.max(PIN_W * k, (city.length * LABEL_PX * 0.6) / zoom);
  const h = pinH + (LABEL_PX * 1.6) / zoom;
  // Box top = pin top, so the tip (top + pinH) lands on the city.
  const home = { x: anchor.x, y: anchor.y - pinH + h / 2 };
  return { city, kind: 'marker', home, center: { ...home }, w, h, pinH };
}

/** An already visible house that should stay in place while its family opens. */
export interface HouseAnchor {
  houseId: string;
  position: Point;
}

/** Place open-city grids near their pins, reserving an anchored family first. */
export function placeGrids(expanded: ReadonlySet<string>, byCity = housesByMapLocation(), anchor?: HouseAnchor): Box[] {
  const placed: Box[] = [...byCity.keys()].map((c) => pinBox(c, GRID_REF_ZOOM));
  const pins = new Map(placed.map((b) => [b.city, b]));
  const grids: Box[] = [];
  // Reserve the selected family's grid first so other open cities avoid it.
  if (anchor) {
    for (const city of expanded) {
      const hs = byCity.get(city);
      const index = hs?.findIndex((house) => house.id === anchor.houseId) ?? -1;
      if (!hs || index < 0) continue;
      const { cols, rows } = gridSize(hs.length);
      const center = {
        x: anchor.position.x - ((index % cols) - (cols - 1) / 2) * CELL_W,
        y: anchor.position.y - (Math.floor(index / cols) - (rows - 1) / 2) * CELL_H,
      };
      const grid: Box = { city, kind: 'grid', home: center, center, w: cols * CELL_W, h: rows * CELL_H };
      placed.push(grid);
      grids.push(grid);
      break;
    }
  }
  const toOpen = [...expanded]
    .filter((c) => byCity.has(c) && !grids.some((grid) => grid.city === c))
    .sort((a, b) => byCity.get(b)!.length - byCity.get(a)!.length || a.localeCompare(b));

  for (const city of toOpen) {
    const { cols, rows } = gridSize(byCity.get(city)!.length);
    const w = cols * CELL_W;
    const h = rows * CELL_H;
    const center = placeNear(pins.get(city)!, w, h, placed);
    const grid: Box = { city, kind: 'grid', home: center, center, w, h };
    placed.push(grid);
    grids.push(grid);
  }
  return grids;
}

/** All boxes for a state, for tests: pins (at the grid reference zoom) plus open-city grids. */
export function mapBoxes(expanded: ReadonlySet<string>): Box[] {
  return [...[...housesByMapLocation().keys()].map((c) => pinBox(c, GRID_REF_ZOOM)), ...placeGrids(expanded)];
}

/**
 * Nearest spot to pin `m` where a w×h box overlaps nothing already placed.
 * Tries directly below/right/left/above first, then a lattice around the
 * pin. Opening downward is preferred; upward is the last resort.
 */
function placeNear(m: Box, w: number, h: number, placed: Box[]): Point {
  const below = { x: m.center.x, y: m.center.y + m.h / 2 + GAP + h / 2 };
  const candidates: Point[] = [
    below,
    { x: m.center.x + m.w / 2 + GAP + w / 2, y: m.center.y },
    { x: m.center.x - m.w / 2 - GAP - w / 2, y: m.center.y },
    { x: m.center.x, y: m.center.y - m.h / 2 - GAP - h / 2 },
  ];
  const STEP = 24;
  const R = 1800;
  for (let dx = -R; dx <= R; dx += STEP) {
    for (let dy = -R; dy <= R; dy += STEP) candidates.push({ x: below.x + dx, y: below.y + dy });
  }

  const cost = (c: Point) =>
    Math.hypot(c.x - m.center.x, c.y - m.center.y) + (c.y < m.center.y ? 60 : 0);
  let best: Point | undefined;
  let bestCost = Infinity;
  for (const c of candidates) {
    const k = cost(c);
    if (k >= bestCost) continue;
    if (placed.some((p) => boxesOverlap({ center: c, w, h }, p, GAP))) continue;
    best = c;
    bestCost = k;
  }
  return best ?? below;
}

/** House positions for the open cities' grids, alphabetical, row by row. */
export function housePositions(grids: Box[], byCity = housesByMapLocation()): Map<string, Point> {
  const out = new Map<string, Point>();
  for (const g of grids) {
    const hs = byCity.get(g.city)!;
    const { cols, rows } = gridSize(hs.length);
    hs.forEach((h, i) => {
      out.set(h.id, {
        x: g.center.x + ((i % cols) - (cols - 1) / 2) * CELL_W,
        y: g.center.y + (Math.floor(i / cols) - (rows - 1) / 2) * CELL_H,
      });
    });
  }
  return out;
}

/** Pins at their city or regional anchor + houses for an expansion state. */
export function layoutMap(expanded: ReadonlySet<string>, byCity = housesByMapLocation(), anchor?: HouseAnchor): MapLayout {
  const cityLayouts = [...byCity].map(([city, hs]): CityLayout => {
    const at = project(mapLocationCoordinates(city));
    return { city, anchor: at, tip: at, houses: hs };
  });
  return { cities: cityLayouts, houses: housePositions(placeGrids(expanded, byCity, anchor), byCity) };
}

export function boxesOverlap(
  a: { center: Point; w: number; h: number },
  b: { center: Point; w: number; h: number },
  gap = 0,
): boolean {
  return (
    Math.abs(a.center.x - b.center.x) < (a.w + b.w) / 2 + gap &&
    Math.abs(a.center.y - b.center.y) < (a.h + b.h) / 2 + gap
  );
}
