import { byName } from '../text';
import { geoGraticule10, geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import world from 'world-atlas/countries-110m.json';
import type { FeatureCollection, MultiLineString, Polygon } from 'geojson';
import subdivisions from '../data/map/north-america-subdivisions.json';
import { houses } from '../data';
import { CountryCode, countryNames } from '../data/countries';
import { getLocationMode, mapLocationCoordinates, mapLocationForHouse, type LocationMode } from './locations';
import type { House, LatLng } from '../types';
import { PIN_H, PIN_W } from './icons';
import { BoxIndex } from './box-index';
import { nearestFree, placeFocused } from './focus-layout';

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

/** Map names in world-atlas that differ from `countryNames`. */
const atlasNames: Partial<Record<string, string>> = {
  [CountryCode.UnitedKingdom]: 'United Kingdom',
  [CountryCode.UnitedStates]: 'United States of America',
};

/** Steps per side when searching a landmass for an inland point near its centroid. */
const CENTER_GRID = 60;
const centerCache = new Map<string, Point | undefined>();

/**
 * Middle of a country's largest landmass, so islands and overseas territories
 * don't pull it out to sea: the centroid, or an inland point near it when a
 * curved country's centroid is outside it. Undefined for places too small for the map.
 */
export function countryCenter(code: string): Point | undefined {
  if (!centerCache.has(code)) centerCache.set(code, findCountryCenter(code));
  return centerCache.get(code);
}

function findCountryCenter(code: string): Point | undefined {
  const topo = world as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
  const name = atlasNames[code] ?? countryNames[code as CountryCode];
  const geometry = topo.objects.countries.geometries.find((g) => g.properties && 'name' in g.properties && g.properties.name === name);
  if (!geometry) return undefined;
  const country = feature(topo, geometry);
  if (country.type !== 'Feature') return undefined;
  const shape = country.geometry;
  if (shape.type !== 'Polygon' && shape.type !== 'MultiPolygon') return undefined;
  const landmasses: Polygon[] = (shape.type === 'Polygon' ? [shape.coordinates] : shape.coordinates)
    .map((coordinates) => ({ type: 'Polygon', coordinates }));
  const main = landmasses.reduce((a, b) => (path.area(b) > path.area(a) ? b : a));
  const rings = main.coordinates.map((ring) => ring.map(([lng, lat]) => project([lat!, lng!])));
  const edges = rings.flatMap((ring) => ring.slice(1).map((b, i): [Point, Point] => [ring[i]!, b]));
  const inside = (p: Point) => edges.reduce((odd, [a, b]) =>
    (a.y > p.y) !== (b.y > p.y) && p.x < a.x + ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) ? !odd : odd, false);

  const [x, y] = path.centroid(main);
  const centroid = { x, y };
  if (inside(centroid)) return centroid;

  const coast = (p: Point) => Math.min(...edges.map(([a, b]) => {
    const dx = b.x - a.x, dy = b.y - a.y;
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1)));
    return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
  }));
  const [[x1, y1], [x2, y2]] = path.bounds(main);
  let best: Point | undefined;
  let bestScore = -Infinity;
  for (let i = 1; i < CENTER_GRID; i++) for (let j = 1; j < CENTER_GRID; j++) {
    const p = { x: x1 + ((x2 - x1) * i) / CENTER_GRID, y: y1 + ((y2 - y1) * j) / CENTER_GRID };
    if (!inside(p)) continue;
    // Close to the centroid, but clear of the border.
    const score = coast(p) - Math.hypot(p.x - x, p.y - y) / 2;
    if (score > bestScore) { bestScore = score; best = p; }
  }
  return best;
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

const byLocationCache = new Map<LocationMode, ReadonlyMap<string, readonly House[]>>();

/**
 * Houses grouped by map location (city or region), alphabetically within each grid.
 * The data is static, so this is built once and shared; don't mutate it.
 */
export function housesByMapLocation(): ReadonlyMap<string, readonly House[]> {
  const mode = getLocationMode();
  let grouped = byLocationCache.get(mode);
  if (!grouped) {
    grouped = new Map([...Map.groupBy(houses, (h) => mapLocationForHouse(h.id))].map(([city, hs]) => [city, [...hs].sort(byName)]));
    byLocationCache.set(mode, grouped);
  }
  return grouped;
}

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

// Bound the cache: filters and focused families can produce many arrangements.
const gridCache = new Map<string, Box[]>();
const copyBoxes = (boxes: readonly Box[]) => boxes.map((box) => ({
  ...box, home: { ...box.home }, center: { ...box.center },
}));

/** Place open-city grids near their pins, reserving an anchored family first. */
export function placeGrids(expanded: ReadonlySet<string>, byCity = housesByMapLocation(), anchor?: HouseAnchor): Box[] {
  const key = JSON.stringify([
    [...byCity].map(([city, hs]) => [city, hs.length, expanded.has(city)]),
    anchor && [anchor.houseId, anchor.position.x, anchor.position.y,
      [...byCity.values()].flat().findIndex((house) => house.id === anchor.houseId)],
  ]);
  const cached = gridCache.get(key);
  if (cached) return copyBoxes(cached);
  const placed: Box[] = [...byCity.keys()].map((c) => pinBox(c, GRID_REF_ZOOM));
  const collisionIndex = new BoxIndex();
  placed.forEach((box) => collisionIndex.add(box));
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
      collisionIndex.add(grid);
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
    const center = placeNear(pins.get(city)!, w, h, placed, collisionIndex);
    const grid: Box = { city, kind: 'grid', home: center, center, w, h };
    placed.push(grid);
    collisionIndex.add(grid);
    grids.push(grid);
  }
  if (gridCache.size >= 32) gridCache.delete(gridCache.keys().next().value!);
  gridCache.set(key, copyBoxes(grids));
  return grids;
}

/** All boxes for a state, for tests: pins (at the grid reference zoom) plus open-city grids. */
export function mapBoxes(expanded: ReadonlySet<string>): Box[] {
  return [...[...housesByMapLocation().keys()].map((c) => pinBox(c, GRID_REF_ZOOM)), ...placeGrids(expanded)];
}

/**
 * Nearest spot to pin `m` where a w×h box overlaps nothing already placed.
 * Search obstacle boundaries instead of allocating and scanning a 151×151
 * lattice for every city. Opening downward is preferred; upward costs extra.
 */
function placeNear(m: Box, w: number, h: number, placed: Box[], index: BoxIndex): Point {
  const below = { x: m.center.x, y: m.center.y + m.h / 2 + GAP + h / 2 };
  const candidates: Point[] = [
    below,
    { x: m.center.x + m.w / 2 + GAP + w / 2, y: m.center.y },
    { x: m.center.x - m.w / 2 - GAP - w / 2, y: m.center.y },
    { x: m.center.x, y: m.center.y - m.h / 2 - GAP - h / 2 },
  ];
  for (const box of placed) {
    const left = box.center.x - (box.w + w) / 2 - GAP;
    const right = box.center.x + (box.w + w) / 2 + GAP;
    const top = box.center.y - (box.h + h) / 2 - GAP;
    const bottom = box.center.y + (box.h + h) / 2 + GAP;
    const x = Math.max(left, Math.min(right, m.center.x));
    const y = Math.max(top, Math.min(bottom, m.center.y));
    candidates.push(
      { x: left, y }, { x: right, y }, { x, y: top }, { x, y: bottom },
      { x: left, y: top }, { x: right, y: top },
      { x: left, y: bottom }, { x: right, y: bottom },
    );
  }

  const cost = (c: Point) =>
    Math.hypot(c.x - m.center.x, c.y - m.center.y) + (c.y < m.center.y ? 60 : 0);
  const ranked = candidates.map((center) => ({ center, cost: cost(center) })).sort((a, b) => a.cost - b.cost);
  for (const { center } of ranked) {
    if (!index.overlaps({ center, w, h }, GAP - 1e-6)) return center;
  }
  // The rightmost boundary always has room, even in exceptionally dense datasets.
  return { x: Math.max(...placed.map((p) => p.center.x + p.w / 2)) + GAP + w / 2, y: below.y };
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

/** A selected brand: only its own pin shows, so the brands it reveals can sit on their cities. */
export interface LayoutFocus {
  houseId: string;
  location: string;
  /** Locations the selection opened; ones the user opened keep their places. */
  revealed: ReadonlySet<string>;
  /** Partners in the brand's own city, drawn in a ring around it. */
  ring: readonly string[];
}

/** Furthest ring icon from the selected brand, including its cell. */
const ringReach = (count: number) => count
  ? Math.max(...[...ringLayout({ x: 0, y: 0 }, Array.from({ length: count }, (_, i) => String(i))).values()].map((p) => Math.hypot(p.x, p.y))) + CELL_W / 2
  : 0;

function focusedPositions(expanded: ReadonlySet<string>, byCity: ReadonlyMap<string, readonly House[]>, focus: LayoutFocus, anchor?: HouseAnchor): Map<string, Point> {
  const opened = new Set([...expanded].filter((city) => !focus.revealed.has(city)));
  const grids = placeGrids(opened, new Map(byCity), anchor && opened.has(focus.location) ? anchor : undefined);
  const fixed: { center: Point; w: number; h: number }[] = [...grids];
  const positions = housePositions(grids, new Map(byCity));
  const pin = pinBox(focus.location, GRID_REF_ZOOM);
  const reach = ringReach(focus.ring.length);
  const own = byCity.get(focus.location) ?? [];
  if (opened.has(focus.location)) {
    const at = positions.get(focus.houseId);
    if (at && reach) fixed.push({ center: at, w: reach * 2, h: reach * 2 });
  } else if (own.some((house) => house.id === focus.houseId)) {
    // The brand and its labels under its pin; ringed partners don't take a place in that grid.
    const family = own.filter((house) => house.id === focus.houseId || !focus.ring.includes(house.id));
    const { cols, rows } = gridSize(family.length);
    const index = family.findIndex((house) => house.id === focus.houseId);
    const offset = { x: ((index % cols) - (cols - 1) / 2) * CELL_W, y: (Math.floor(index / cols) - (rows - 1) / 2) * CELL_H };
    // Centred on the brand, so the ring fits as well as the grid.
    const w = Math.max(reach * 2, cols * CELL_W + 2 * Math.abs(offset.x));
    const h = Math.max(reach * 2, rows * CELL_H + 2 * Math.abs(offset.y));
    const under = { x: pin.home.x, y: pin.home.y + pin.h / 2 + CELL_H / 2 };
    const at = anchor?.houseId === focus.houseId ? anchor.position : nearestFree(under, w, h, fixed);
    family.forEach((house, i) => positions.set(house.id, {
      x: at.x - offset.x + ((i % cols) - (cols - 1) / 2) * CELL_W,
      y: at.y - offset.y + (Math.floor(i / cols) - (rows - 1) / 2) * CELL_H,
    }));
    fixed.push({ center: at, w, h });
  }
  fixed.push(pin);
  const blocks = [...focus.revealed].flatMap((city) => {
    const count = byCity.get(city)?.length;
    if (!count || city === focus.location) return [];
    const { cols, rows } = gridSize(count);
    return [{ id: city, home: project(mapLocationCoordinates(city)), w: cols * CELL_W, h: rows * CELL_H }];
  });
  const centers = placeFocused(blocks, fixed);
  const placed = blocks.map((block): Box => ({ city: block.id, kind: 'grid', home: block.home, center: centers.get(block.id)!, w: block.w, h: block.h }));
  for (const [id, at] of housePositions(placed, new Map(byCity))) positions.set(id, at);
  const center = positions.get(focus.houseId);
  if (center) {
    // Lines to other cities, and the brand's own pin, are kept clear.
    const others = blocks.map((block) => centers.get(block.id)!);
    const avoid = [...others, pin.center].map((p) => Math.atan2(p.y - center.y, p.x - center.x));
    for (const [id, at] of ringLayout(center, focus.ring, avoid)) positions.set(id, at);
  }
  return positions;
}

/** Pins at their city or regional anchor + houses for an expansion state. */
export function layoutMap(expanded: ReadonlySet<string>, byCity = housesByMapLocation(), anchor?: HouseAnchor, focus?: LayoutFocus): MapLayout {
  const cityLayouts = [...byCity].map(([city, hs]): CityLayout => {
    const at = project(mapLocationCoordinates(city));
    return { city, anchor: at, tip: at, houses: hs };
  });
  return { cities: cityLayouts, houses: focus ? focusedPositions(expanded, byCity, focus, anchor) : housePositions(placeGrids(expanded, byCity, anchor), byCity) };
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

/* ---------- selection ring ---------- */

/** Model units (≈ screen px at zoom 1) from the selected brand to its ring of same-city partners. */
export const RING_RADIUS = 120;
/** Arc length per partner, roomy enough for an icon and its name. */
const RING_SPACING = 88;
/** Above this many partners, use two rings rather than one very large one. */
export const RING_CAPACITY = 12;
const RING_GAP = 96;

const angleBetween = (a: number, b: number) => {
  const d = Math.abs(a - b) % (2 * Math.PI);
  return Math.min(d, 2 * Math.PI - d);
};

/** Rotation for evenly spaced slots that keeps them furthest from the `avoid` directions. */
function bestRotation(count: number, step: number, avoid: readonly number[]): number {
  if (!avoid.length) return 0;
  let best = 0;
  let bestScore = -1;
  for (let k = 0; k < 24; k++) {
    const rotation = (step * k) / 24;
    let score = Infinity;
    for (let i = 0; i < count; i++) {
      const slot = rotation + i * step - Math.PI / 2;
      for (const angle of avoid) score = Math.min(score, angleBetween(slot, angle));
    }
    if (score > bestScore + 1e-9) { best = rotation; bestScore = score; }
  }
  return best;
}

/**
 * Place a selected brand's same-city partners evenly on a ring around it,
 * starting at the top and running clockwise in the given order. Slots are
 * rotated away from `avoid` (angles, in radians, of the brand's lines to other
 * cities) so spokes don't run along them. More than RING_CAPACITY partners
 * split across an inner and an outer ring.
 */
export function ringLayout(center: Point, ids: readonly string[], avoid: readonly number[] = []): Map<string, Point> {
  const positions = new Map<string, Point>();
  if (!ids.length) return positions;
  const split = ids.length > RING_CAPACITY ? Math.ceil(ids.length * 0.45) : ids.length;
  const rings = [ids.slice(0, split), ids.slice(split)].filter((ring) => ring.length);
  let radius = 0;
  rings.forEach((ring, index) => {
    radius = Math.max(index === 0 ? RING_RADIUS : radius + RING_GAP, (ring.length * RING_SPACING) / (2 * Math.PI));
    const step = (2 * Math.PI) / ring.length;
    // Stagger the outer ring so its icons sit between the inner ones.
    const rotation = bestRotation(ring.length, step, avoid) + (index ? step / 2 : 0);
    ring.forEach((id, i) => {
      const angle = rotation + i * step - Math.PI / 2;
      positions.set(id, { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) });
    });
  });
  return positions;
}
