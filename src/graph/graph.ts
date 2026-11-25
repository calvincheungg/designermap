import { minesweeperColour } from './minesweeper';
import cytoscape, { type Collection, type Core, type EdgeSingular, type NodeSingular, type SingularElementArgument } from 'cytoscape';
import { reducedMotion } from '../motion';
import { allMoves, collaborationsOf, careerOf, getHouse, houses, housesInGroup, type GroupId } from '../data';
import { collaborationEdges, mapElements, moveEdges, nodeId } from './elements';
import { countryCenter, housesByMapLocation, LABEL_PX, layoutMap, MAP_HEIGHT, MAP_MIN_ZOOM, MAP_WIDTH, mapSvgMarkup, pinScale } from './geo';
import { cityMarkerIcon, frameIcon, logoInfo, logoSize, PIN_H, PIN_W } from './icons';
import { graphStyle, nightStyle, textStyle, NIGHT_BLUE, NIGHT_RED } from './style';
import { areaLabel, clusterLabel, mapHousePath, mapLocationForCity, mapLocationForHouse } from './locations';
import { placeMarkers } from './markers';
import { cityRegions, type CityName } from '../data/cities';
import { mapPicture } from './picture';
import { tooltipLines } from './tooltip';
import { buildClusterLevels, clusterLevel, type PinCluster } from './clusters';

export type ConnectionFilter = 'all' | 'designers' | 'collaborations';

export type Selection = { kind: 'house' | 'designer'; id: string } | { kind: 'group'; id: GroupId } | null;

/** Elements that are scenery, never faded. */
const SCENERY = '[kind = "marker"], [kind = "leader"], [kind = "grid"]';

/** How far past each map edge it can be dragged, as a fraction of the view. */
const OVERSCROLL = 0.4;
/** The most a drag can stretch past that allowance, in screen px, before it springs back. */
const RUBBER_BAND = 60;

/** Damp the part of `value` outside [min, max]: it approaches RUBBER_BAND px but never reaches it. */
function rubberBand(value: number, min: number, max: number): number {
  const stretch = (excess: number) => RUBBER_BAND * excess / (excess + RUBBER_BAND);
  if (value < min) return min - stretch(min - value);
  if (value > max) return max + stretch(value - max);
  return value;
}

/**
 * Turn `cls` on or off for each element, touching only the ones that change.
 * (Cytoscape restyles *every* element passed to add/remove/toggleClass, even if
 * its classes didn't change, so `cy.elements().removeClass(…)` restyles everything.)
 */
function setClass<E extends SingularElementArgument>(
  eles: { forEach(each: (el: E) => void): unknown },
  cls: string,
  on: boolean | ((el: E) => boolean),
) {
  eles.forEach((el) => {
    const want = typeof on === 'function' ? on(el) : on;
    if (want !== el.hasClass(cls)) el.toggleClass(cls, want);
  });
}

/** A box in viewport (client) pixels. */
/** Half a city pin's largest on-screen size. */
const PIN_HALF = 13;
/** The closest `showBrands` zooms in. */
const SHOWN_MAX_ZOOM = 1.5;
/** Room for a brand icon's label under it, in screen pixels. */
const LABEL_HEIGHT = 16;

export interface ScreenBox { left: number; top: number; right: number; bottom: number }

export interface GraphCallbacks {
  onSelect: (sel: Selection) => void;
  onConnectionHover?: (label: string | null) => void;
  /** Tooltip lines for what the mouse is over, at a viewport point; null when there is nothing. */
  onHover?: (tip: { lines: string[]; x: number; y: number } | null) => void;
  /** Fired when cities expand/collapse; `fullyOpen` are whole grids, not the brands a selection reveals. */
  onExpandChange?: (expandedCount: number, totalCities: number, fullyOpen: readonly string[]) => void;
  /**
   * Clicking a city pin: the app shows the city's brands in a window, placed
   * beside `pin` (the pin's box in viewport pixels). Without it, the pin expands on the map.
   */
  onOpenCity?: (city: string, pin?: ScreenBox) => void;
}

/** A map view that survives a page refresh. `x` and `y` are the map point at the centre. */
export interface MapViewState { zoom: number; x: number; y: number; open: readonly string[] }
/** How long after a restore resizes keep the view instead of fitting the map (ms). */
const RESTORE_SETTLE = 1500;

/**
 * Wrapper around Cytoscape: builds the world map, filters by year,
 * expands/collapses cities, highlights the selection. An SVG world map sits
 * under the canvas and follows its pan/zoom.
 */
export class DesignerGraph {
  readonly cy: Core;
  private year = Infinity;
  private matchingHouseIds: ReadonlySet<string> | undefined;
  /** Whether the selected brand's direct move connections are drawn. */
  private showMoves = true;
  /** Night map colours (setNight). */
  private night = false;
  /** Map label size multiplier (setTextScale). */
  private textScale = 1;
  private showCollaborations = true;
  private connectionFilter: ConnectionFilter = 'all';
  private pulseLayer: SVGSVGElement;
  private pulseGroup: SVGGElement;
  private pulseTimer: ReturnType<typeof setTimeout> | undefined;
  private showPulses = true;
  /** Running pulses by edge id; `hover` marks ones added only while a line is hovered. */
  private pulses = new Map<string, Pulse>();
  /** Copies of pulsing lines, drawn beneath their blocks (the canvas lines are made transparent). */
  private traceGroup: SVGGElement;
  private blockGroup: SVGGElement;
  private selection: Selection = null;
  /** Brands shown together without a selection (showBrands), until the next select(). */
  private shownBrands: ReadonlySet<string> | null = null;
  /** Where a running reveal animation will leave the view, so windows can open beside places that are still moving. */
  /** Where each node was last placed, so a running move animation's destination is known. */
  private placedAt = new Map<string, { x: number; y: number }>();
  private viewTarget: { zoom: number; pan: { x: number; y: number }; until: number } | null = null;
  /** The selection the current move and collaboration lines were built for. */
  private connectionsFor = selectionKey(null);
  private expanded = new Set<string>();
  /** Houses revealed by a selection in cities the user has not opened. */
  private autoRevealed = new Map<string, Set<string>>();
  /** The selected brand's move and collaboration partners, for the same-city ring. */
  private connectionPartners = new Set<string>();
  /** Labels are revealed only within the selected house's family. */
  private revealedLabels = new Set<string>();
  /** Keep returning brands at their last position instead of restarting at the pin. */
  private positionedHouses = new Set<string>();
  private mapContext = new Set<string>();
  private readonly allCities = [...housesByMapLocation().keys()];
  private mapLayer: SVGSVGElement;
  /** Group inside the map SVG that carries the pan/zoom transform. */
  private mapGroup: SVGGElement;
  private pinLeaders: SVGGElement;
  private markerTips = new Map<string, { x: number; y: number }>();
  private markerTimer: ReturnType<typeof setTimeout> | undefined;
  private clusterLevels: readonly (readonly PinCluster[])[] = [];
  /** Cities of the clicked cluster, shown individually until the map zooms out below `minZoom`. */
  private openedCluster?: { cities: ReadonlySet<string>; minZoom: number };
  private clusterLabels = new Map<string, string>();
  private canvasHost: HTMLElement;
  private resizeObserver: ResizeObserver;
  private pendingImages = new Set<HTMLImageElement>();
  /** A view put back after a page refresh, and until when resizes keep it. */
  private restored: { view: MapViewState; until: number } | undefined;
  private disposed = false;
  /** The un-damped pan of the drag in progress, the pan last shown, and the zoom it started at. */
  private dragPan: { x: number; y: number } | null = null;
  private shownPan: { x: number; y: number } | null = null;
  private dragZoom = 1;
  private panBouncing = false;

  constructor(
    pane: HTMLElement,
    private callbacks: GraphCallbacks,
  ) {
    this.mapLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.mapLayer.classList.add('map-layer');
    this.mapLayer.setAttribute('aria-hidden', 'true');
    // An SVG transform (not a CSS one) so `non-scaling-stroke` keeps borders hairline at any zoom.
    this.mapGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.mapGroup.innerHTML = mapSvgMarkup();
    this.pinLeaders = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.pinLeaders.setAttribute('class', 'pin-leaders');
    this.mapGroup.append(this.pinLeaders);
    this.mapLayer.append(this.mapGroup);

    const canvasHost = document.createElement('div');
    this.canvasHost = canvasHost;
    canvasHost.className = 'cy-layer';
    this.pulseLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.pulseLayer.classList.add('pulse-layer');
    this.pulseLayer.setAttribute('aria-hidden', 'true');
    this.pulseGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.traceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.traceGroup.classList.add('pulse-traces');
    this.blockGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.pulseGroup.append(this.traceGroup, this.blockGroup);
    this.pulseLayer.append(this.pulseGroup);
    // Pulses travel under the canvas, so brand icons and labels stay on top of them.
    pane.append(this.mapLayer, this.pulseLayer, canvasHost);

    this.cy = cytoscape({
      container: canvasHost,
      style: graphStyle,
      boxSelectionEnabled: false,
      // Positions come from geography, so nothing is draggable.
      autoungrabify: true,
    });

    this.cy.on('tap', 'node[kind = "marker"]', (e) => {
      const marker = e.target as NodeSingular;
      if (marker.data('isCluster')) this.openCluster(marker);
      else if (callbacks.onOpenCity) callbacks.onOpenCity(mapLocationForCity(marker.data('city')), this.screenBox(marker));
      else this.toggleCity(marker.data('city'));
    });
    this.cy.on('tap', 'node[kind = "house"]', (e) => {
      const id = (e.target as NodeSingular).data('refId');
      callbacks.onSelect(this.selection?.kind === 'house' && this.selection.id === id
        ? null : { kind: 'house', id });
    });
    this.cy.on('tap', 'edge[designerId]', (e) => {
      callbacks.onSelect({ kind: 'designer', id: e.target.data('designerId') });
    });
    this.cy.on('tap', (e) => {
      if (e.target === this.cy) callbacks.onSelect(null);
    });
    this.cy.on('mouseover', 'node[refId], node[kind = "marker"], edge[designerId]', () => {
      canvasHost.style.cursor = 'var(--cursor-pointer)';
    });
    this.cy.on('mouseout', 'node, edge', () => (canvasHost.style.cursor = ''));
    this.cy.on('mouseover', 'node[kind = "marker"]', (e) => e.target.style('text-opacity', 1));
    this.cy.on('mouseout', 'node[kind = "marker"]', (e) =>
      e.target.style('text-opacity', e.target.data('markerLabelVisible') ? 1 : 0));
    this.cy.on('mouseover', 'edge[kind = "move"], edge[kind = "collaboration"]', (e) => {
      const edge = e.target as EdgeSingular;
      callbacks.onConnectionHover?.(edge.data('label'));
      this.addPulse(edge, true);
    });
    this.cy.on('mouseout', 'edge', () => {
      callbacks.onConnectionHover?.(null);
      this.removeHoverPulses();
    });
    this.cy.on('mouseover', 'node[kind = "house"], edge[kind = "move"], edge[kind = "collaboration"]', (e) => {
      const event = e.originalEvent as MouseEvent | undefined;
      // Only a mouse really over the map: not a touch, nor a window above it.
      if (!event || !event.type.startsWith('mouse') || !canvasHost.contains(event.target as Node)) return;
      const lines = tooltipLines(e.target);
      if (lines.length) callbacks.onHover?.({ lines, x: event.clientX, y: event.clientY });
    });
    this.cy.on('mouseout', 'node, edge', () => callbacks.onHover?.(null));
    this.cy.on('viewport tapstart', () => callbacks.onHover?.(null));
    canvasHost.addEventListener('mouseleave', () => callbacks.onHover?.(null));
    this.cy.on('viewport', () => {
      // A press that moves the map shows the closed Win98 hand until release.
      if (this.dragPan) canvasHost.classList.add('grabbing');
      this.clampPan();
      this.syncMapLayer();
    });
    this.cy.on('tapstart', () => { this.restored = undefined; this.grabPan(); });
    canvasHost.addEventListener('wheel', () => { this.restored = undefined; }, { capture: true, passive: true });
    this.cy.on('tapend', () => { canvasHost.classList.remove('grabbing'); this.releasePan(); });
    this.cy.on('zoom', () => {
      // Keep sizes responsive while zooming; resolve collisions once the gesture settles.
      this.sizeMarkers(false);
      this.scalePulses();
      clearTimeout(this.markerTimer);
      this.markerTimer = setTimeout(() => this.sizeMarkers(), 90);
    });

    // Keep the canvas in sync with its container (window resize, mobile rotation).
    this.resizeObserver = new ResizeObserver(() => {
      if (this.disposed) return;
      this.cy.resize();
      this.applyZoomLimit();
      // The map window settles over a few resizes while the page loads; a restored view stays put through them.
      if (this.restored && performance.now() < this.restored.until) this.applyView(this.restored.view);
      else this.cy.fit(this.cy.elements(':visible'), 30);
    });
    this.resizeObserver.observe(canvasHost);
    // Cytoscape caches the canvas's screen rect and refreshes it only on resize, so after the map
    // window moves it would think presses land outside the map and ignore them. Re-measure before
    // each press, wheel or hover entry (capture phase, ahead of Cytoscape's own listeners).
    const remeasure = () => (this.cy as unknown as { renderer(): { invalidateContainerClientCoordsCache(): void } })
      .renderer().invalidateContainerClientCoordsCache();
    for (const type of ['pointerdown', 'mousedown', 'touchstart', 'wheel', 'pointerenter'])
      canvasHost.addEventListener(type, remeasure, { capture: true, passive: true });

    pane.classList.add('is-map');
    this.applyZoomLimit();
    this.cy.add(mapElements());
    const clusterCities = this.cy.nodes('[kind = "marker"]').map(marker => ({
      city: marker.data('city') as string, tip: marker.data('tip'), count: marker.data('count') as number,
      major: !!marker.data('major'), country: marker.data('country') as string,
      region: cityRegions[marker.data('city') as CityName]?.region,
    }));
    this.clusterLevels = buildClusterLevels(clusterCities, countryCenter);
    const counts = new Map(clusterCities.map(city => [city.city, city.count]));
    for (const level of this.clusterLevels) for (const cluster of level) {
      if (cluster.members.length < 2 || this.clusterLabels.has(cluster.id)) continue;
      const { area } = cluster;
      if (area) {
        this.clusterLabels.set(cluster.id, areaLabel(area));
        continue;
      }
      const representative = [...cluster.members].sort((a, b) => counts.get(b)! - counts.get(a)! || a.localeCompare(b))[0]!;
      this.clusterLabels.set(cluster.id, clusterLabel(cluster.members, representative));
    }
    this.relayoutMap(false);
    this.checkLogos();
    this.cy.fit(this.cy.elements(':visible'), 30);
    this.syncMapLayer();
  }

  /* ---------- public API ---------- */

  /** Logos that failed to load. */
  private brokenLogos = new Set<string>();

  /**
   * Draw each logo inside the bevelled frame, sized to its real proportions
   * and on its own background colour; swap any logo that can't load (typo,
   * dead link) for the house's initials square.
   */
  private checkLogos() {
    this.cy.nodes('[kind = "house"][?hasLogo]').forEach((n) => {
      const url: string = n.data('image');
      const fallBack = () => {
        if (this.disposed) return;
        this.brokenLogos.add(url);
        n.removeStyle('background-image background-width background-height background-fit background-clip');
        n.data({ image: n.data('fallbackImage'), hasLogo: false });
        console.warn(`Logo for ${n.data('label')} didn't load: ${url}`);
      };
      const draw = (info: { ratio: number; background: string }) => {
        if (this.disposed) return;
        const { w, h } = logoSize(info.ratio, n.data('logoFit'));
        n.style({
          'background-image': [frameIcon(info.background), url],
          'background-fit': ['none', 'none'],
          'background-width': ['100%', `${w}%`],
          'background-height': ['100%', `${h}%`],
          'background-clip': ['none', 'none'],
        } as unknown as cytoscape.Css.Node);
      };
      if (this.brokenLogos.has(url)) return fallBack();
      const known = logoInfo.get(url);
      if (known) return draw(known);

      const img = new Image();
      this.pendingImages.add(img);
      img.crossOrigin = 'anonymous';
      img.onerror = () => {
        // A remote logo may refuse cross-origin access; retry without it (we just
        // won't be able to read its background colour).
        if (img.crossOrigin) {
          img.crossOrigin = null;
          img.src = url;
        } else {
          this.pendingImages.delete(img);
          fallBack();
        }
      };
      img.onload = () => {
        this.pendingImages.delete(img);
        if (this.disposed) return;
        const info = { ratio: img.naturalWidth / img.naturalHeight || 1, background: cornerColour(img) };
        logoInfo.set(url, info);
        draw(info);
      };
      img.src = url;
    });
  }

  /** Show only what existed up to (and including) `year`. */
  setYear(year: number) {
    this.year = year;
    if (this.selection || this.shownBrands) {
      this.refreshSelection(false, true);
      return;
    }
    this.relayoutMap(false);
  }

  /** Tag filters apply to houses, city counts, and both ends of each move. */
  setHouseFilter(ids: ReadonlySet<string> | undefined) {
    this.matchingHouseIds = ids;
    if (this.selection || this.shownBrands) this.refreshSelection(false, true);
    else this.relayoutMap(false);
  }

  select(sel: Selection, reveal = false) {
    this.selection = sel;
    this.shownBrands = null;
    this.refreshSelection(reveal);
  }

  /** Reveal just these brands and frame them, with nothing selected (Favorites, several brands in a place window). */
  showBrands(ids: Iterable<string>) {
    this.selection = null;
    this.shownBrands = new Set(ids);
    this.refreshSelection(true);
    const cy = this.cy;
    const focus = cy.nodes('[kind = "house"]').filter((node) => this.shownBrands!.has(node.data('refId'))).not('.hidden, .collapsed');
    if (focus.empty()) return;
    cy.stop(true, false);
    // One or two brands shouldn't fill the map.
    const box = focus.boundingBox();
    const zoom = Math.max(cy.minZoom(), Math.min(SHOWN_MAX_ZOOM, (cy.width() - 160) / Math.max(1, box.w), (cy.height() - 160) / Math.max(1, box.h)));
    const pan = { x: cy.width() / 2 - (box.x1 + box.x2) / 2 * zoom, y: cy.height() / 2 - (box.y1 + box.y2) / 2 * zoom };
    if (reducedMotion()) cy.viewport({ zoom, pan });
    else cy.animate({ zoom, pan }, { duration: 400 });
  }

  /** The map as it looks now, as a PNG. */
  picture(): Promise<Blob> {
    return mapPicture(this.cy, getComputedStyle(this.canvasHost.parentElement!).backgroundColor, [this.mapLayer, this.pulseLayer]);
  }

  private refreshSelection(reveal: boolean, forceLayout = false) {
    this.clearPulses();
    this.callbacks.onConnectionHover?.(null);
    const sel = this.selection;
    const context = this.matchingMapContext();
    // Replace automatic reveals, preserving cities the user opened manually.
    let relayout = forceLayout || this.autoRevealed.size > 0 || this.revealedLabels.size > 0;
    for (const city of this.autoRevealed.keys()) this.expanded.delete(city);
    this.autoRevealed.clear();
    this.revealedLabels.clear();
    this.connectionPartners.clear();

    if (sel || this.shownBrands) {
      const ids = new Set(!sel ? this.shownBrands! : sel.kind === 'house' ? [sel.id]
        : sel.kind === 'group' ? housesInGroup(sel.id).map((house) => house.id)
        : careerOf(sel.id).map((t) => t.house));
      // The selected brand, its ancestry and direct labels (not connection partners).
      const family = new Set<string>();
      if (sel?.kind === 'house') {
        // Direct children open with their parent. Nested labels open one level at a time.
        for (const house of houses) if (house.parentHouse === sel.id) ids.add(house.id);
        for (const id of ids) for (const ancestor of mapHousePath(id)) this.revealedLabels.add(ancestor);
        for (const id of ids) family.add(id);
        // Read the underlying moves: collapsed endpoints currently point at pins.
        for (const move of !this.showMoves || this.connectionFilter === 'collaborations' ? [] : allMoves()) {
          if (move.year > this.year || !this.matchesHouse(move.from.house) || !this.matchesHouse(move.to.house)) continue;
          if (move.from.house === sel.id) { ids.add(move.to.house); this.connectionPartners.add(move.to.house); }
          if (move.to.house === sel.id) { ids.add(move.from.house); this.connectionPartners.add(move.from.house); }
        }
        if (this.showCollaborations && this.connectionFilter !== 'designers') {
          for (const project of collaborationsOf(sel.id)) {
            if (project.year > this.year || !this.matchesHouse(sel.id)) continue;
            for (const partner of project.houses) {
              if (!this.matchesHouse(partner)) continue;
              ids.add(partner);
              if (partner !== sel.id) this.connectionPartners.add(partner);
            }
          }
        }
      }
      for (const id of ids) {
        const house = getHouse(id);
        if (!house || !context.has(id) || (house.founded ?? -Infinity) > this.year) continue;
        // A partner label opens on its own; its parent shows only if it is involved too.
        const path = sel?.kind === 'house' && !family.has(id) ? [id] : mapHousePath(id);
        if (sel?.kind !== 'group') for (const ancestor of path) this.revealedLabels.add(ancestor);
        const city = mapLocationForHouse(id);
        if (!this.expanded.has(city)) {
          this.expanded.add(city);
          this.autoRevealed.set(city, new Set());
          relayout = true;
        }
        for (const ancestor of path) this.autoRevealed.get(city)?.add(ancestor);
      }
      if (this.revealedLabels.size) relayout = true;
    }
    // Connection lines are built for one selection, so a new selection needs its own.
    if (this.connectionsFor !== selectionKey(sel)) relayout = true;
    if (relayout) {
      // Animate local focus changes; explicit navigation frames its destination immediately.
      this.relayoutMap(!forceLayout && !reveal, false);
      this.notifyExpand();
    }
    this.applySelection(reveal);
  }

  toggleCity(city: string) {
    city = mapLocationForCity(city);
    this.autoRevealed.delete(city);
    if (this.expanded.has(city)) this.expanded.delete(city);
    else this.expanded.add(city);
    this.relayoutMap(true);
    this.notifyExpand();
  }

  /** A place window's Show on Map: open these map locations' full grids (other open cities stay) and frame them. */
  showCities(cities: Iterable<string>) {
    const locations = new Set([...cities].map((city) => mapLocationForCity(city)).filter((city) => this.allCities.includes(city)));
    if (!locations.size) return;
    for (const city of locations) {
      this.autoRevealed.delete(city);
      this.expanded.add(city);
    }
    this.relayoutMap(false);
    this.notifyExpand();
    const cy = this.cy;
    const focus = cy.nodes('[kind = "marker"]').filter((node) => locations.has(node.data('city')))
      .union(cy.nodes('[kind = "house"]').filter((node) => locations.has(node.data('mapLocation')) && !node.hasClass('collapsed')))
      .filter((node) => node.visible());
    if (focus.empty()) return;
    cy.stop(true, false);
    if (reducedMotion()) cy.fit(focus, 80);
    else cy.animate({ fit: { eles: focus, padding: 80 } }, { duration: 400 });
  }

  /** A place window's Hide: close these locations' grids, leaving the view and what a selection reveals. */
  hideCities(cities: Iterable<string>) {
    for (const city of cities) {
      this.autoRevealed.delete(mapLocationForCity(city));
      this.expanded.delete(mapLocationForCity(city));
    }
    if (this.selection || this.shownBrands) this.refreshSelection(false, true);
    else {
      this.relayoutMap(true);
      this.notifyExpand();
    }
  }

  setAllExpanded(open: boolean) {
    this.autoRevealed.clear();
    this.expanded = new Set(open ? this.allCities : []);
    this.relayoutMap(false);
    this.notifyExpand();
    this.cy.stop(true, false);
    this.cy.fit(this.cy.elements(':visible'), 30);
  }

  /** What a page refresh keeps: zoom, the map point at the centre, and the cities the user opened (not ones a selection reveals). */
  viewState(): MapViewState {
    const zoom = this.cy.zoom(), pan = this.cy.pan();
    return { zoom, x: (this.cy.width() / 2 - pan.x) / zoom, y: (this.cy.height() / 2 - pan.y) / zoom,
      open: this.fullyOpen() };
  }

  private fullyOpen(): string[] {
    return [...this.expanded].filter((city) => !this.autoRevealed.has(city));
  }

  /** Put back a `viewState`, at whatever size the map is now. */
  restoreView(view: MapViewState) {
    const open = view.open.filter((city) => this.allCities.includes(city));
    if (open.length) {
      for (const city of open) { this.autoRevealed.delete(city); this.expanded.add(city); }
      this.relayoutMap(false);
      this.notifyExpand();
    }
    this.restored = { view, until: performance.now() + RESTORE_SETTLE };
    this.applyView(view);
  }

  private applyView({ zoom: wanted, x, y }: MapViewState) {
    const zoom = Math.min(this.cy.maxZoom(), Math.max(this.cy.minZoom(), wanted));
    this.cy.viewport({ zoom, pan: { x: this.cy.width() / 2 - x * zoom, y: this.cy.height() / 2 - y * zoom } });
  }

  /** Show or hide move connections for the selected brand or designer. */
  setShowMoves(on: boolean) {
    if (this.showMoves === on) return;
    this.showMoves = on;
    this.refreshSelection(false, true);
  }

  /** Independent switch: off hides all collaboration arrows, including selected ones. */
  setShowCollaborations(on: boolean) {
    if (this.showCollaborations === on) return;
    this.showCollaborations = on;
    if (this.selection || this.shownBrands) this.refreshSelection(false, true);
    else this.relayoutMap(false);
  }

  setConnectionFilter(filter: ConnectionFilter) {
    if (this.connectionFilter === filter) return;
    this.connectionFilter = filter;
    this.refreshSelection(false, true);
  }

  /** The visible brand icon under a viewport point, for the map's context menu. */
  houseAt(clientX: number, clientY: number): string | undefined {
    const rect = this.cy.container()?.getBoundingClientRect();
    if (!rect) return undefined;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const hits = this.cy.nodes('[kind = "house"]').filter((node) => {
      if (!node.visible()) return false;
      const box = node.renderedBoundingBox({ includeLabels: false });
      return x >= box.x1 && x <= box.x2 && y >= box.y1 && y <= box.y2;
    });
    return hits.nonempty() ? hits.last().data('refId') : undefined;
  }

  get allExpanded() {
    return this.expanded.size === this.allCities.length;
  }

  /** Zoom about the middle of the view. */
  zoomBy(factor: number) {
    const cy = this.cy;
    this.restored = undefined;
    cy.stop(true, false);
    cy.zoom({ level: Math.min(cy.maxZoom(), Math.max(cy.minZoom(), cy.zoom() * factor)), renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
  }

  fit() {
    const visible = this.cy.elements(':visible');
    if (visible.empty()) return;
    if (reducedMotion()) this.cy.fit(visible, 30);
    else this.cy.animate({ fit: { eles: visible, padding: 30 } }, { duration: 300 });
  }

  /** Scale brand and city labels on the map (Settings ▸ Text size). */
  setTextScale(scale: number) {
    if (this.textScale === scale) return;
    this.textScale = scale;
    this.applyStylesheet();
    this.sizeMarkers();
  }

  private applyStylesheet() {
    this.cy.style().fromJson([...graphStyle, ...(this.night ? nightStyle : []), ...textStyle(this.textScale)]).update();
  }

  /** Switch the map between its day and night colours. */
  setNight(on: boolean) {
    if (this.night === on) return;
    this.night = on;
    // The map's CSS colours key off the pane (.graph-pane.night), not Cytoscape's inner container.
    this.canvasHost.parentElement?.classList.toggle('night', on);
    this.applyStylesheet();
    // Pulse traces copy the line colours when drawn, so recolour the running ones.
    for (const pulse of this.pulses.values()) {
      const { stroke, fill } = this.traceColours(pulse.edge);
      pulse.trace.querySelector('path')?.setAttribute('stroke', stroke);
      const arrow = pulse.trace.querySelector('polygon');
      arrow?.setAttribute('stroke', stroke);
      arrow?.setAttribute('fill', fill);
    }
  }

  /** Re-render after web fonts load (canvas text doesn't reflow on its own). */
  refreshStyle() {
    this.cy.style().update();
  }

  /** Release resources when the React map host unmounts or is hot-reloaded. */
  destroy() {
    if (this.disposed) return;
    this.disposed = true;
    clearTimeout(this.pulseTimer);
    clearTimeout(this.markerTimer);
    this.resizeObserver.disconnect();
    for (const img of this.pendingImages) {
      img.onload = null;
      img.onerror = null;
    }
    this.pendingImages.clear();
    this.cy.destroy();
    this.mapLayer.remove();
    this.pulseLayer.remove();
    this.canvasHost.remove();
  }

  /* ---------- map layout ---------- */

  /**
   * Re-place markers + houses for the current expansion state, show/hide
   * houses, and rebuild the move arrows so they attach to what's visible.
   */
  private relayoutMap(animate: boolean, updateSelection = true) {
    this.clearPulses();
    this.callbacks.onConnectionHover?.(null);
    const cy = this.cy;
    animate = animate && !reducedMotion();
    const houseNodes = cy.nodes('[kind = "house"]');
    // Interrupt from the current position, rather than queuing or jumping to an old target.
    houseNodes.stop(true, false);
    const previousPositions = new Map(houseNodes.map((node) => [node.data('refId'), { ...node.position() }] as const));
    const openLocations = new Set(cy.nodes('[kind = "marker"][?expanded]').map((node) => node.data('city')));
    this.mapContext = this.matchingMapContext();
    // Focus only families with visible children at this map location.
    const selectedId = this.selection?.kind === 'house' ? this.selection.id : undefined;
    const selectedLocation = selectedId ? mapLocationForHouse(selectedId) : undefined;
    const focusedLocation = selectedId && houses.some((house) => house.parentHouse === selectedId
      && this.mapContext.has(house.id) && mapLocationForHouse(house.id) === selectedLocation)
      ? selectedLocation : undefined;
    const byCity = new Map([...housesByMapLocation()].flatMap(([city, hs]) => {
      const revealed = this.autoRevealed.get(city);
      const matching = hs.filter((h) => this.mapContext.has(h.id)
        && (city !== focusedLocation || !!revealed || this.revealedLabels.has(h.id))
        && (!h.parentHouse || this.revealedLabels.has(h.id)) && (!revealed || revealed.has(h.id)));
      // Keep each revealed family together, with parents before their children.
      matching.sort((a, b) => mapHousePath(a.id).map((id) => getHouse(id)!.name).join('\0')
        .localeCompare(mapHousePath(b.id).map((id) => getHouse(id)!.name).join('\0')));
      return matching.length ? [[city, matching] as const] : [];
    }));
    const selectedNode = selectedId ? cy.getElementById(nodeId.house(selectedId)) : undefined;
    const anchor = focusedLocation && selectedNode?.nonempty() && !selectedNode.hasClass('collapsed')
      && !selectedNode.hasClass('hidden') && openLocations.has(focusedLocation)
      ? { houseId: selectedId!, position: previousPositions.get(selectedId!)! } : undefined;
    const focus = selectedId && selectedLocation && this.expanded.has(selectedLocation) ? {
      houseId: selectedId, location: selectedLocation, revealed: new Set(this.autoRevealed.keys()),
      ring: this.ringPartners(byCity.get(selectedLocation) ?? []),
    } : undefined;
    const layout = layoutMap(this.expanded, byCity, anchor, focus);

    cy.batch(() => {
      cy.nodes('[kind = "marker"][!isCluster]').forEach((marker) => {
        const open = this.expanded.has(marker.data('city'));
        if (open === !!marker.data('expanded')) return;
        marker.data({
          expanded: open,
          image: cityMarkerIcon(marker.data('shown') ?? marker.data('count'), open, false, !!marker.data('top')),
        });
      });
      // A grid, and the dotted leader from its pin, show while the city is open.
      setClass(cy.nodes('[kind = "grid"]').union(cy.edges('[kind = "leader"]')), 'collapsed', (el) => !this.expanded.has(el.data('city')));

      const houses = houseNodes;
      houses.forEach((n) => {
        const pos = layout.houses.get(n.data('refId'));
        if (!pos) return;
        // First-time labels emerge from their visible parent. Returning brands
        // retain their previous positions while newly opened cities fan out.
        if (animate && n.hasClass('collapsed')) {
          const city = n.data('mapLocation');
          if (!openLocations.has(city) || !this.positionedHouses.has(n.data('refId'))) {
            const parent = openLocations.has(city) ? mapHousePath(n.data('refId')).slice(0, -1).reverse()
              .find((id) => !cy.getElementById(nodeId.house(id)).hasClass('collapsed')) : undefined;
            n.position(parent ? previousPositions.get(parent)!
              : cy.getElementById(nodeId.city(city)).position());
          }
        }
        this.place(n, pos, animate);
        this.positionedHouses.add(n.data('refId'));
      });
      setClass(houses, 'collapsed', (n) => !layout.houses.has(n.data('refId')));

      cy.edges('[kind = "move"], [kind = "collaboration"]').remove();
      const visible = new Set(layout.houses.keys());
      const sel = this.selection;
      // Move lines show only for a selected brand or designer, so build just those.
      if (sel && sel.kind !== 'group') cy.add(moveEdges(this.expanded, visible, sel));
      this.connectionsFor = selectionKey(sel);
      if (this.showCollaborations && this.selection?.kind === 'house') {
        cy.add(collaborationEdges(this.expanded, visible, this.selection.id, this.year));
      }
    });

    this.applyYear();
    if (updateSelection) this.applySelection(false);
  }

  /**
   * Partners in the selected brand's own city would sit a tile away in its grid,
   * too close to read their lines, so they ring the brand instead (until the
   * selection changes and the grid is restored).
   */
  private ringPartners(local: readonly { id: string; name: string }[]): string[] {
    return local.filter((house) => this.connectionPartners.has(house.id))
      .sort((a, b) => a.name.localeCompare(b.name)).map((house) => house.id);
  }

  /** Only display membership/counts change with filters; the geographic hierarchy is cached. */
  private updateClusters() {
    const cy = this.cy;
    if (this.openedCluster && !cy.animated() && cy.zoom() < this.openedCluster.minZoom) this.openedCluster = undefined;
    const opened = this.openedCluster?.cities;
    const available = new Map(cy.nodes('[kind = "marker"][!isCluster]')
      .not('.hidden, .selection-hidden')
      .filter(marker => !this.expanded.has(marker.data('city')) && !opened?.has(marker.data('city')))
      .map(marker => [marker.data('city') as string, marker] as const));
    const clustered = new Set<string>();
    const active = new Set<string>();
    cy.batch(() => {
      for (const cluster of this.clusterLevels[clusterLevel(cy.zoom())] ?? []) {
        const members = cluster.members.filter(city => available.has(city));
        if (members.length < cluster.minCities || members.length < 2) continue;
        members.forEach(city => clustered.add(city));
        const count = members.reduce((total, city) => total + available.get(city)!.data('shown'), 0);
        active.add(cluster.id);
        const existing = cy.getElementById(cluster.id);
        if (existing.empty()) {
          cy.add({ group: 'nodes', data: {
            id: cluster.id, kind: 'marker', isCluster: true,
            members, tip: cluster.tip, label: this.clusterLabels.get(cluster.id),
            count, shown: count, image: cityMarkerIcon(count, false, true),
          }, position: { ...cluster.tip }, selectable: false });
        } else {
          existing.data('members', members);
          if (existing.data('shown') !== count) {
            existing.data({ count, shown: count, image: cityMarkerIcon(count, false, true) });
          }
        }
      }
      cy.nodes('[kind = "marker"][?isCluster]').filter(marker => !active.has(marker.id())).remove();
      setClass(cy.nodes('[kind = "marker"][!isCluster]'), 'clustered', marker => clustered.has(marker.data('city')));
    });
  }

  /**
   * The on-screen box (viewport pixels) of a brand's city pin, using the view a
   * running reveal will settle on, so its Properties window can open beside it.
   * Undefined when the city is outside the map view or the map isn't laid out.
   */
  locationBox(houseId: string): ScreenBox | undefined {
    const container = this.cy.container();
    const city = mapLocationForHouse(houseId);
    const tip = city ? this.cy.getElementById(nodeId.city(city)).data('tip') as { x: number; y: number } | undefined : undefined;
    if (!container || !tip) return undefined;
    const target = this.viewTarget && this.viewTarget.until > performance.now() ? this.viewTarget : null;
    const zoom = target?.zoom ?? this.cy.zoom();
    const pan = target?.pan ?? this.cy.pan();
    const x = tip.x * zoom + pan.x, y = tip.y * zoom + pan.y;
    if (x < 0 || y < 0 || x > this.cy.width() || y > this.cy.height()) return undefined;
    // The pin stands on its tip and is at most ~26px on screen.
    const box = { left: x - PIN_HALF, top: y - 2 * PIN_HALF, right: x + PIN_HALF, bottom: y };
    // Include the brand's own icon (and label) when it's shown, so the window doesn't cover it.
    const node = this.cy.getElementById(nodeId.house(houseId));
    if (node.nonempty() && node.visible()) {
      const at = this.placedAt.get(node.id()) ?? node.position();
      const half = (node.outerWidth() / 2) * zoom;
      const cx = at.x * zoom + pan.x, cy = at.y * zoom + pan.y;
      box.left = Math.min(box.left, cx - half); box.right = Math.max(box.right, cx + half);
      box.top = Math.min(box.top, cy - half); box.bottom = Math.max(box.bottom, cy + half + LABEL_HEIGHT);
    }
    const host = container.getBoundingClientRect();
    return { left: host.left + box.left, top: host.top + box.top, right: host.left + box.right, bottom: host.top + box.bottom };
  }

  /** A node's on-screen box in viewport pixels, for placing windows beside it. */
  private screenBox(node: NodeSingular): ScreenBox | undefined {
    const container = this.cy.container();
    if (!container) return undefined;
    const host = container.getBoundingClientRect();
    const box = node.renderedBoundingBox({ includeLabels: false });
    return { left: host.left + box.x1, top: host.top + box.y1, right: host.left + box.x2, bottom: host.top + box.y2 };
  }
  /** One click goes all the way: frame the cluster and show each of its cities. */
  private openCluster(marker: NodeSingular) {
    const cy = this.cy;
    const points = (marker.data('members') as string[]).map(city => cy.getElementById(nodeId.city(city)).data('tip'));
    const xs = points.map(point => point.x), ys = points.map(point => point.y);
    const x1 = Math.min(...xs), x2 = Math.max(...xs), y1 = Math.min(...ys), y2 = Math.max(...ys);
    const start = cy.zoom();
    const zoom = Math.max(cy.minZoom(), Math.min(cy.maxZoom(),
      Math.max(1, cy.width() - 120) / Math.max(32, x2 - x1),
      Math.max(1, cy.height() - 120) / Math.max(32, y2 - y1)));
    const pan = { x: cy.width() / 2 - (x1 + x2) / 2 * zoom, y: cy.height() / 2 - (y1 + y2) / 2 * zoom };
    cy.stop(true, false);
    if (reducedMotion()) cy.viewport({ zoom, pan });
    else cy.animate({ zoom, pan }, { duration: 300 });
    // Full membership, so cities a filter brings back later stay individual too.
    const cluster = this.clusterLevels.flat().find(c => c.id === marker.id());
    this.openedCluster = {
      cities: new Set(cluster?.members ?? marker.data('members')),
      minZoom: zoom > start * 1.3 ? (start + zoom) / 2 : zoom * 0.75,
    };
    this.sizeMarkers();
  }

  /**
   * Pins scale with the map when zoomed out, but stop growing past a small
   * on-screen size. Minor cities cluster at wide zooms; remaining crowded pins
   * spread apart with tethers, reserving major cities first. City names stay a
   * constant size on screen; colliding labels appear on hover or with more space.
   */
  private sizeMarkers(reposition = true) {
    if (this.disposed) return;
    if (reposition) clearTimeout(this.markerTimer);
    if (reposition) this.updateClusters();
    const z = this.cy.zoom();
    const k = pinScale(z);
    const w = PIN_W * k;
    const h = PIN_H * k;
    const markers = this.cy
      .nodes('[kind = "marker"]')
      .not('.hidden, .selection-hidden, .clustered')
      .sort((a, b) => Number(!!b.data('major')) - Number(!!a.data('major'))
        || (b.data('shown') ?? b.data('count')) - (a.data('shown') ?? a.data('count'))
        || a.id().localeCompare(b.id()));

    if (reposition) {
      // A selected brand's grid can surround its city, so its pin only avoids the icons themselves.
      const solid = this.selection?.kind === 'house' ? 'house' : 'grid';
      const obstacles = this.cy.nodes(`[kind = "${solid}"]`).not('.collapsed, .hidden').map((grid) => {
        const box = grid.boundingBox();
        return { center: { x: (box.x1 + box.x2) / 2, y: (box.y1 + box.y2) / 2 }, w: box.w, h: box.h };
      });
      this.markerTips = placeMarkers(markers.map((m) => ({ id: m.id(), tip: m.data('tip') })), z, obstacles);
    }
    const tips = new Map(markers.map((m) => [m.id(), this.markerTips.get(m.id()) ?? m.data('tip')]));
    const leaders: SVGLineElement[] = [];
    markers.forEach((m) => {
      const anchor = m.data('tip') as { x: number; y: number };
      const tip = tips.get(m.id())!;
      if (Math.hypot(tip.x - anchor.x, tip.y - anchor.y) < 1 / z) return;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(anchor.x));
      line.setAttribute('y1', String(anchor.y));
      line.setAttribute('x2', String(tip.x));
      line.setAttribute('y2', String(tip.y));
      leaders.push(line);
    });
    this.pinLeaders.replaceChildren(...leaders);

    // Reserve every pin before labels, so a bigger city's label cannot cover a smaller pin.
    const labelBoxes = markers.map((m) => {
      const tip = tips.get(m.id())!;
      return { x1: tip.x - w / 2, x2: tip.x + w / 2, y1: tip.y - h, y2: tip.y };
    });
    const showLabel = new Set<string>();
    const labelPx = LABEL_PX * this.textScale;
    markers.forEach((m) => {
      const tip = tips.get(m.id())!;
      const lw = (m.data('label').length * labelPx * 0.62) / z;
      const box = { x1: tip.x - lw / 2, x2: tip.x + lw / 2, y1: tip.y + 2 / z, y2: tip.y + (labelPx * 1.4 + 2) / z };
      const hits = (a: typeof box) =>
        labelBoxes.some((b) => a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1);
      if (!hits(box)) showLabel.add(m.id());
      if (showLabel.has(m.id())) labelBoxes.push(box);
    });

    this.cy.batch(() => {
      markers.forEach((m, i) => {
        m.data('markerLabelVisible', showLabel.has(m.id()));
        m.style({
          width: w,
          height: h,
          // (An empty `label` would remove the override rather than hide it.)
          'text-opacity': showLabel.has(m.id()) ? 1 : 0,
          'font-size': labelPx / z,
          'text-margin-y': 2 / z,
          'text-outline-width': 2 / z,
          'z-index': 100 - i,
        });
        const tip = tips.get(m.id())!;
        m.position({ x: tip.x, y: tip.y - h / 2 });
      });
    });
    this.scaleEdges();
  }

  /**
   * Edge widths and arrows are in map units, so past zoom 1 they'd keep
   * growing; cap them at their zoom-1 size on screen. Labels are left alone so
   * they grow with the map like the house names.
   */
  private scaleEdges() {
    const k = 1 / Math.max(1, this.cy.zoom());
    this.cy.batch(() => {
      this.cy.edges().forEach((e) => {
        const base = e.hasClass('highlight') ? 2 : e.data('kind') === 'leader' ? 1.5 : 1;
        // Restyling is the expensive part, and below zoom 1 the result never changes.
        const key = `${base}:${k}`;
        if (e.scratch('_edgeScale') === key) return;
        e.scratch('_edgeScale', key);
        e.style({ width: base * k, 'arrow-scale': 0.9 * k });
      });
    });
  }

  /**
   * On the map, don't zoom out past MAP_MIN_ZOOM or past the map filling the
   * view, and allow zooming in far enough to separate nearby cities
   * (e.g. Bologna / Reggio Emilia).
   */
  private applyZoomLimit() {
    const fill = Math.max(this.cy.width() / MAP_WIDTH, this.cy.height() / MAP_HEIGHT);
    this.cy.minZoom(Math.max(MAP_MIN_ZOOM, fill));
    this.cy.maxZoom(8);
  }

  private place(n: NodeSingular, pos: { x: number; y: number }, animate: boolean) {
    this.placedAt.set(n.id(), pos);
    if (animate) n.animate({ position: pos }, { duration: 250, easing: 'ease-in-out-cubic', queue: false });
    else n.position(pos);
  }

  private notifyExpand() {
    this.callbacks.onExpandChange?.(this.expanded.size, this.allCities.length, this.fullyOpen());
  }

  /** The SVG map is drawn in model coordinates; mirror Cytoscape's pan + zoom onto it. */
  /**
   * The pan range on one axis: the map may be dragged up to OVERSCROLL of the
   * view past each edge, so a place near the border (Japan, say) can still be
   * brought to the centre from under a window. A map smaller than the view is
   * centred, with the same allowance either side.
   */
  private panRange(view: number, size: number): [min: number, max: number] {
    const slack = view * OVERSCROLL;
    if (size <= view) { const centre = (view - size) / 2; return [centre - slack, centre + slack]; }
    return [view - size - slack, slack];
  }

  /**
   * Keep the map near the view. Programmatic changes (zoom, fit, animations)
   * clamp hard to `panRange`. While the pointer is down, the drag is tracked
   * un-damped in `dragPan`, and past the range it stretches with growing
   * resistance (at most RUBBER_BAND px); releasing springs back (`releasePan`).
   */
  private clampPan() {
    if (this.panBouncing) return;
    const zoom = this.cy.zoom();
    const pan = this.cy.pan();
    const [minX, maxX] = this.panRange(this.cy.width(), MAP_WIDTH * zoom);
    const [minY, maxY] = this.panRange(this.cy.height(), MAP_HEIGHT * zoom);
    let next: { x: number; y: number };
    if (this.dragPan && this.shownPan && zoom === this.dragZoom) {
      this.dragPan = { x: this.dragPan.x + pan.x - this.shownPan.x, y: this.dragPan.y + pan.y - this.shownPan.y };
      next = { x: rubberBand(this.dragPan.x, minX, maxX), y: rubberBand(this.dragPan.y, minY, maxY) };
    } else {
      next = { x: Math.min(maxX, Math.max(minX, pan.x)), y: Math.min(maxY, Math.max(minY, pan.y)) };
      if (this.dragPan) { this.dragPan = { ...next }; this.dragZoom = zoom; }
    }
    this.shownPan = next;
    if (Math.abs(next.x - pan.x) > 0.5 || Math.abs(next.y - pan.y) > 0.5) this.cy.pan(next);
  }

  private grabPan() {
    if (this.panBouncing) { this.cy.stop(); this.panBouncing = false; }
    this.dragPan = { ...this.cy.pan() };
    this.shownPan = { ...this.dragPan };
    this.dragZoom = this.cy.zoom();
  }

  /** On release, spring a stretched map back inside its pan range. */
  private releasePan() {
    if (!this.dragPan) return;
    this.dragPan = this.shownPan = null;
    const zoom = this.cy.zoom();
    const pan = this.cy.pan();
    const [minX, maxX] = this.panRange(this.cy.width(), MAP_WIDTH * zoom);
    const [minY, maxY] = this.panRange(this.cy.height(), MAP_HEIGHT * zoom);
    const target = { x: Math.min(maxX, Math.max(minX, pan.x)), y: Math.min(maxY, Math.max(minY, pan.y)) };
    if (Math.abs(target.x - pan.x) < 0.5 && Math.abs(target.y - pan.y) < 0.5) return;
    if (reducedMotion()) { this.cy.pan(target); return; }
    this.panBouncing = true;
    this.cy.animate({
      pan: target, duration: 450, easing: 'spring(380, 20)' as cytoscape.Css.TransitionTimingFunction,
      complete: () => { this.panBouncing = false; this.clampPan(); },
    });
  }

  private syncMapLayer() {
    const { x, y } = this.cy.pan();
    const transform = `translate(${x} ${y}) scale(${this.cy.zoom()})`;
    this.mapGroup.setAttribute('transform', transform);
    this.pulseGroup.setAttribute('transform', transform);
  }

  /* ---------- year filter + selection ---------- */

  private matchesHouse(id: string): boolean {
    return !this.matchingHouseIds || this.matchingHouseIds.has(id);
  }

  private matchingMapContext(): Set<string> {
    return new Set(houses.filter((h) => this.matchesHouse(h.id) && (h.founded ?? -Infinity) <= this.year)
      .flatMap((h) => mapHousePath(h.id)));
  }

  private applyYear() {
    const cy = this.cy;
    const year = this.year;
    cy.batch(() => {
      // Houses, career moves and collaboration releases have a start year.
      setClass(cy.elements('[start]'), 'hidden', (el) => el.data('start') > year
        || (el.data('kind') === 'house' && !this.mapContext.has(el.data('refId')))
        || ((el.data('kind') === 'move' || el.data('kind') === 'collaboration')
          && (!this.mapContext.has(el.data('fromHouse')) || !this.mapContext.has(el.data('toHouse'))
            || !this.matchesHouse(el.data('fromHouse')) || !this.matchesHouse(el.data('toHouse')))));
      // Map markers count only the houses that existed by then.
      const markers = cy.nodes('[kind = "marker"][!isCluster]');
      markers.forEach((m) => {
        const count = housesByMapLocation()
          .get(m.data('city'))!
          .filter((h) => !h.parentHouse && this.mapContext.has(h.id)).length;
        if (count !== m.data('shown')) {
          m.data({ shown: count, image: cityMarkerIcon(count, !!m.data('expanded'), false, !!m.data('top')) });
        }
      });
      setClass(markers, 'hidden', (m) => m.data('shown') === 0);
      setClass(cy.elements('[kind = "grid"], [kind = "leader"]'), 'hidden', (el) =>
        cy.getElementById(nodeId.city(el.data('city'))).data('shown') === 0);
    });
  }

  /** Show moving blocks along lines; also call it again when animations are switched, to stop or restart them. */
  setPulses(on: boolean) {
    this.showPulses = on;
    this.clearPulses();
    this.playPulses();
  }

  private clearPulses() {
    clearTimeout(this.pulseTimer);
    for (const pulse of this.pulses.values()) if (!pulse.edge.removed()) pulse.edge.removeClass('traced');
    this.traceGroup.replaceChildren();
    this.blockGroup.replaceChildren();
    this.pulses.clear();
  }

  /**
   * Start pulses on the selected lines. Lines that are already pulsing keep
   * their running animation, so hovering never restarts them.
   */
  private playPulses() {
    const selected = this.cy.edges('.highlight').filter((edge) => edge.visible());
    const ids = new Set(selected.map((edge) => edge.id()));
    for (const [id, pulse] of this.pulses) {
      if (ids.has(id)) pulse.hover = false;
      else if (!pulse.hover) this.removePulse(id);
    }
    selected.forEach((edge) => this.addPulse(edge as EdgeSingular, false));
  }

  private removeHoverPulses() {
    for (const [id, pulse] of this.pulses) if (pulse.hover) this.removePulse(id);
  }

  private removePulse(id: string) {
    const pulse = this.pulses.get(id);
    if (!pulse) return;
    pulse.node.remove();
    pulse.trace.remove();
    if (!pulse.edge.removed()) pulse.edge.removeClass('traced');
    this.pulses.delete(id);
  }

  /**
   * Pulses live in model space, so they grow with the map and its brand icons
   * when zooming in. Zoomed out, hold them at their zoom-1 size so they stay visible.
   */
  private pulseScale() {
    return `scale(${1 / Math.min(1, this.cy.zoom())})`;
  }

  private scalePulses() {
    const scale = this.pulseScale();
    for (const pulse of this.pulses.values()) {
      pulse.block.setAttribute('transform', scale);
      this.scaleTrace(pulse);
    }
  }

  /** Match the canvas edge's on-screen width (see scaleEdges) and arrow size. */
  private scaleTrace(pulse: Pulse) {
    const screen = Math.min(1, this.cy.zoom());
    pulse.trace.querySelector('path')?.setAttribute('stroke-width', String(pulse.width * screen));
    const arrow = pulse.trace.querySelector('.pulse-arrow');
    if (arrow) arrow.setAttribute('transform', `${arrow.getAttribute('data-at')} scale(${screen / this.cy.zoom()})`);
  }

  /** A pulsing line's stroke and arrowhead fill, matching its canvas style in day or night colours. */
  private traceColours(edge: EdgeSingular) {
    const highlighted = edge.hasClass('highlight');
    const stroke = edge.data('kind') === 'collaboration' ? this.night ? NIGHT_RED : '#cc0000'
      : highlighted ? this.night ? NIGHT_BLUE : '#000080' : this.night ? '#a0a0a4' : '#808080';
    return { stroke, fill: edge.data('concurrent') ? '#ffffff' : stroke };
  }

  /** The line itself, in the pulse layer under the block, with the same colour, dash and arrowhead. */
  private drawTrace(edge: EdgeSingular, path: string, end: { x: number; y: number }, lastControl: { x: number; y: number }): { trace: SVGGElement; width: number } {
    const ns = 'http://www.w3.org/2000/svg';
    const collaboration = edge.data('kind') === 'collaboration';
    const highlighted = edge.hasClass('highlight');
    const { stroke: colour, fill } = this.traceColours(edge);
    const width = highlighted ? 2 : 1;
    const trace = document.createElementNS(ns, 'g');
    trace.classList.add('pulse-trace');
    const line = document.createElementNS(ns, 'path');
    line.setAttribute('d', path);
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', colour);
    line.setAttribute('vector-effect', 'non-scaling-stroke');
    if (collaboration || edge.data('concurrent')) line.setAttribute('stroke-dasharray', '6 3');
    trace.append(line);
    if (!collaboration) {
      // Cytoscape's triangle arrowhead, at the target end, pointing along the final tangent.
      const angle = Math.atan2(end.y - lastControl.y, end.x - lastControl.x) * 180 / Math.PI;
      const arrow = document.createElementNS(ns, 'polygon');
      arrow.classList.add('pulse-arrow');
      arrow.setAttribute('points', '0,0 -9,-4.5 -9,4.5');
      arrow.setAttribute('fill', fill);
      arrow.setAttribute('stroke', colour);
      arrow.setAttribute('data-at', `translate(${end.x} ${end.y}) rotate(${angle})`);
      trace.append(arrow);
    }
    return { trace, width };
  }

  /** Native SVG motion follows the rendered Bezier route without restyling Cytoscape per frame. */
  private addPulse(edge: EdgeSingular, hover: boolean) {
    if (this.disposed || !this.showPulses || this.pulses.has(edge.id()) || reducedMotion()) return;
    if (!edge.visible() || edge.removed()) return;
    const route = renderedRoute(edge);
    if (!route) return;
    const { start, end, controls } = route;
    if ([start, ...controls, end].some((point) => !Number.isFinite(point.x) || !Number.isFinite(point.y))) return;
    let path = `M ${start.x} ${start.y}`;
    let length = 0;
    let from = start;
    controls.forEach((control, i) => {
      const next = controls[i + 1];
      const target = next ? { x: (control.x + next.x) / 2, y: (control.y + next.y) / 2 } : end;
      path += ` Q ${control.x} ${control.y} ${target.x} ${target.y}`;
      length += quadraticLength(from, control, target);
      from = target;
    });
    if (!controls.length) {
      path += ` L ${end.x} ${end.y}`;
      length = Math.hypot(end.x - start.x, end.y - start.y);
    }
    const ns = 'http://www.w3.org/2000/svg';
    // The outer group carries the motion; the inner one is scaled, so motion stays in model units.
    const node = document.createElementNS(ns, 'g');
    node.classList.add('pulse');
    const block = document.createElementNS(ns, 'g');
    block.setAttribute('transform', this.pulseScale());
    const square = (x: number, y: number, size: number, fill: string) => {
      const rect = document.createElementNS(ns, 'rect');
      for (const [name, value] of [['x', x], ['y', y], ['width', size], ['height', size]] as const) rect.setAttribute(name, String(value));
      rect.setAttribute('fill', fill);
      rect.setAttribute('shape-rendering', 'crispEdges');
      block.append(rect);
    };
    if (edge.data('kind') === 'collaboration') {
      // A revealed Minesweeper cell: grey square, dark top-left edge, number of releases with the partner.
      const count = Number(edge.data('count')) || 1;
      block.classList.add('pulse-tile');
      square(-8, -8, 16, '#000000');
      square(-7, -7, 14, '#808080');
      square(-6, -6, 13, '#c0c0c0');
      const label = document.createElementNS(ns, 'text');
      label.textContent = String(count);
      label.setAttribute('x', '0.5');
      label.setAttribute('y', '1');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dominant-baseline', 'central');
      label.setAttribute('font-family', "'Pixelated MS Sans Serif', Arial, sans-serif");
      label.setAttribute('font-weight', 'bold');
      label.setAttribute('font-size', count > 9 ? '9' : '12');
      label.setAttribute('fill', minesweeperColour(count));
      block.append(label);
    } else {
      // A raised Win98 button bevel: dark outline, white highlight, grey shadow, navy face.
      for (const [x, y, size, fill] of [[-4, -4, 8, '#0a0a0a'], [-4, -4, 7, '#ffffff'], [-3, -3, 6, '#808080'], [-3, -3, 5, '#000080']] as const) square(x, y, size, fill);
    }
    const motion = document.createElementNS(ns, 'animateMotion');
    motion.setAttribute('path', path);
    motion.setAttribute('dur', `${pulseDuration(length * this.cy.zoom())}s`);
    motion.setAttribute('repeatCount', 'indefinite');
    motion.setAttribute('begin', 'indefinite');
    motion.setAttribute('fill', 'freeze');
    node.append(block, motion);
    const { trace, width } = this.drawTrace(edge, path, end, controls.at(-1) ?? start);
    this.traceGroup.append(trace);
    this.blockGroup.append(node);
    const pulse: Pulse = { node, block, trace, width, edge, hover };
    this.pulses.set(edge.id(), pulse);
    this.scaleTrace(pulse);
    edge.addClass('traced');
    motion.beginElement?.();
  }

  private focusFor(sel: NonNullable<Selection>): Collection {
    const cy = this.cy;
    if (sel.kind === 'house') {
      const node = cy.getElementById(nodeId.house(sel.id));
      const family = [...this.revealedLabels].reduce((acc, id) => acc.union(cy.getElementById(nodeId.house(id))), cy.collection());
      const edges = node.connectedEdges().filter((edge) => edge.data('kind') === 'move'
        ? this.showMoves && this.connectionFilter !== 'collaborations'
        : edge.data('kind') === 'collaboration' && this.showCollaborations && this.connectionFilter !== 'designers');
      return edges.union(edges.connectedNodes()).not(SCENERY).union(node).union(family);
    }
    if (sel.kind === 'group') {
      return housesInGroup(sel.id).reduce(
        (acc, house) => acc.union(cy.getElementById(nodeId.house(house.id))),
        cy.collection(),
      );
    }
    // Designers aren't nodes: light up every house they worked at + their move arrows.
    const houses = careerOf(sel.id).reduce(
      (acc, t) => acc.union(cy.getElementById(nodeId.house(t.house))),
      cy.collection(),
    );
    const moves = cy.edges('[kind = "move"]').filter((e) => e.data('designerId') === sel.id);
    return houses.union(moves);
  }

  private applySelection(reveal: boolean) {
    const cy = this.cy;
    const sel = this.selection;
    const selectedLocation = sel?.kind === 'house' ? mapLocationForHouse(sel.id) : undefined;
    let focus: Collection | undefined;

    cy.batch(() => {
      // Keep connected brand grids visible, but remove their pins and orphaned leaders.
      setClass(cy.elements('[kind = "marker"], [kind = "leader"]'), 'selection-hidden', (el) =>
        selectedLocation !== undefined && el.data('city') !== selectedLocation);
      // Ignore parts of the selection the year slider or a collapsed city hides.
      const shown = sel ? this.focusFor(sel).not('.hidden, .collapsed') : cy.collection();
      const self = sel?.kind === 'house' ? cy.getElementById(nodeId.house(sel.id)) : cy.collection();
      const scenery = cy.elements(SCENERY);
      const all = cy.elements();
      setClass(all, 'highlight', (el) => shown.has(el) && (sel?.kind === 'designer' || el.isEdge() || self.has(el)));
      setClass(all, 'focus', (el) => shown.nonempty() && self.has(el));
      setClass(all, 'faded', (el) => shown.nonempty() && !shown.has(el) && !scenery.has(el));
      // Show a brand's direct moves or a selected designer's career moves.
      setClass(cy.edges('[kind = "move"]'), 'lines-off', (e) => (sel?.kind !== 'house' && sel?.kind !== 'designer')
        || !this.showMoves || this.connectionFilter === 'collaborations' || !shown.has(e));
      setClass(cy.edges('[kind = "collaboration"]'), 'lines-off', (e) => sel?.kind !== 'house'
        || !this.showCollaborations || this.connectionFilter === 'designers' || !shown.has(e));
      // Border the selected brand's partners like the lines that reach them.
      const lines = sel?.kind === 'house' ? self.connectedEdges().not('.lines-off, .hidden') : cy.collection();
      const partners = (kind: string) => lines.filter((e) => e.data('kind') === kind)
        .connectedNodes('[kind = "house"]').not(self);
      const movePartners = partners('move');
      const collabPartners = partners('collaboration');
      const houses = cy.nodes('[kind = "house"]');
      setClass(houses, 'move-partner', (n) => movePartners.has(n));
      setClass(houses, 'collab-partner', (n) => collabPartners.has(n));
      focus = shown;
    });

    this.sizeMarkers();
    this.clearPulses();
    this.pulseTimer = setTimeout(() => this.playPulses(), 450);

    if (reveal && focus && focus.nonempty()) {
      const target = (cy as unknown as { getFitViewport(eles: cytoscape.CollectionArgument, padding: number): { zoom: number; pan: { x: number; y: number } } | undefined })
        .getFitViewport(focus, 80);
      this.viewTarget = target ? { ...target, until: performance.now() + 500 } : null;
      if (reducedMotion()) cy.fit(focus, 80);
      else cy.animate({ fit: { eles: focus, padding: 80 } }, { duration: 400 });
    }
  }
}

const selectionKey = (sel: Selection) => (sel ? `${sel.kind}:${sel.id}` : '');

/** An edge's drawn route, or undefined before the renderer has laid it out. */
interface Pulse {
  node: SVGGElement; block: SVGGElement; trace: SVGGElement;
  /** Base line width before zoom capping, as in scaleEdges. */
  width: number;
  edge: EdgeSingular;
  /** Added only while the line is hovered. */
  hover: boolean;
}

/** Pulses travel at one on-screen speed, so long lines stay as readable as short ones. */
export const PULSE_SPEED = 45; // px per second
const MIN_PULSE_SECONDS = 1.2;
export function pulseDuration(screenLength: number) {
  return Math.round(Math.max(MIN_PULSE_SECONDS, screenLength / PULSE_SPEED) * 100) / 100;
}

/** Arc length of a quadratic Bezier, by sampling: close enough for animation timing. */
function quadraticLength(p0: { x: number; y: number }, p1: { x: number; y: number }, p2: { x: number; y: number }) {
  let length = 0;
  let previous = p0;
  for (let i = 1; i <= 16; i++) {
    const t = i / 16;
    const u = 1 - t;
    const point = { x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x, y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y };
    length += Math.hypot(point.x - previous.x, point.y - previous.y);
    previous = point;
  }
  return length;
}

export { MANY_COLLABORATIONS_COLOUR, minesweeperColour } from './minesweeper';

function renderedRoute(edge: EdgeSingular) {
  try {
    const start = edge.sourceEndpoint();
    const end = edge.targetEndpoint();
    return start && end ? { start, end, controls: edge.controlPoints() ?? [] } : undefined;
  } catch {
    return undefined;
  }
}

/**
 * The logo's own background colour, read from its top-left pixel, so the
 * frame's inside matches it. White if that pixel is transparent or unreadable.
 */
function cornerColour(img: HTMLImageElement): string {
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(img, 0, 0, 1, 1, 0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return a! < 200 ? '#ffffff' : `rgb(${r}, ${g}, ${b})`;
  } catch {
    return '#ffffff';
  }
}
