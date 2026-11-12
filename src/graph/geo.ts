import { geoGraticule10, geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import world from 'world-atlas/countries-110m.json';
import { houses } from '../data';
import { cities, type CityName } from '../data/cities';
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

/** Inner SVG markup for the map: ocean, graticule, land, country borders. */
export function mapSvgMarkup(): string {
  const topo = world as unknown as Topology<{
    countries: GeometryCollection;
    land: GeometryCollection;
  }>;
  const land = path(feature(topo, topo.objects.land));
  const borders = path(mesh(topo, topo.objects.countries, (a, b) => a !== b));
  return [
    `<path class="sphere" d="${path(SPHERE)}"/>`,
    `<path class="graticule" d="${path(geoGraticule10())}"/>`,
    `<path class="land" d="${land}"/>`,
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
  city: string;
  /** True position of the city on the map. */
  anchor: Point;
  /** Where the pin's pointer touches the map: exactly on the city. */
  tip: Point;
  houses: House[];
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

export const housesByCity = (): Map<string, House[]> =>
  new Map(
    [...Map.groupBy(houses, (h) => h.city)].map(([city, hs]) => [
      city,
      [...hs].sort((a, b) => (a.founded ?? 0) - (b.founded ?? 0)),
    ]),
  );

const gridSize = (n: number) => {
  const cols = Math.ceil(Math.sqrt(n));
  return { cols, rows: Math.ceil(n / cols) };
};

/** Pin + city name, in model units, sitting exactly on the city at this zoom. */
function pinBox(city: string, zoom: number): Box & { pinH: number } {
  const anchor = project(cities[city as CityName]);
  const k = pinScale(zoom);
  const pinH = PIN_H * k;
  const w = Math.max(PIN_W * k, (city.length * LABEL_PX * 0.6) / zoom);
  const h = pinH + (LABEL_PX * 1.6) / zoom;
  // Box top = pin top, so the tip (top + pinH) lands on the city.
  const home = { x: anchor.x, y: anchor.y - pinH + h / 2 };
  return { city, kind: 'marker', home, center: { ...home }, w, h, pinH };
}

/**
 * Where each expanded city's houses go: the free spot nearest its pin that
 * doesn't cover any pin or another open city (biggest cities first, so small
 * ones fit around them). Doesn't depend on zoom, so houses stay put.
 */
export function placeGrids(expanded: ReadonlySet<string>): Box[] {
  const byCity = housesByCity();
  const placed: Box[] = [...byCity.keys()].map((c) => pinBox(c, GRID_REF_ZOOM));
  const pins = new Map(placed.map((b) => [b.city, b]));
  const grids: Box[] = [];
  const toOpen = [...expanded]
    .filter((c) => byCity.has(c))
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
  return [...[...housesByCity().keys()].map((c) => pinBox(c, GRID_REF_ZOOM)), ...placeGrids(expanded)];
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

/** House positions for the open cities' grids (oldest house first). */
export function housePositions(grids: Box[]): Map<string, Point> {
  const byCity = housesByCity();
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

/** Pins (always exactly on their city) + houses for an expansion state. */
export function layoutMap(expanded: ReadonlySet<string>): MapLayout {
  const byCity = housesByCity();
  const cityLayouts = [...byCity].map(([city, hs]): CityLayout => {
    const at = project(cities[city as CityName]);
    return { city, anchor: at, tip: at, houses: hs };
  });
  return { cities: cityLayouts, houses: housePositions(placeGrids(expanded)) };
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
