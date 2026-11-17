import cytoscape, { type Collection, type Core, type EdgeSingular, type NodeSingular, type SingularElementArgument } from 'cytoscape';
import { allMoves, collaborationsOf, careerOf, getHouse, houses, housesInGroup, type GroupId } from '../data';
import { collaborationEdges, mapElements, moveEdges, nodeId } from './elements';
import { housesByMapLocation, LABEL_PX, layoutMap, MAP_HEIGHT, MAP_MIN_ZOOM, MAP_WIDTH, mapSvgMarkup, pinScale } from './geo';
import { cityMarkerIcon, frameIcon, logoInfo, logoSize, PIN_H, PIN_W } from './icons';
import { graphStyle } from './style';
import { clusterLabel, mapHousePath, mapLocationForCity, mapLocationForHouse } from './locations';
import { placeMarkers } from './markers';
import { buildClusterLevels, clusterLevel, CLUSTER_ZOOMS, MIN_CLUSTER_CITIES, type PinCluster } from './clusters';

export type ConnectionFilter = 'all' | 'designers' | 'collaborations';

export type Selection = { kind: 'house' | 'designer'; id: string } | { kind: 'group'; id: GroupId } | null;

/** Elements that are scenery, never faded. */
const SCENERY = '[kind = "marker"], [kind = "leader"], [kind = "grid"]';

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

export interface GraphCallbacks {
  onSelect: (sel: Selection) => void;
  onConnectionHover?: (label: string | null) => void;
  /** Fired when cities expand/collapse, so the toolbar can update its toggle. */
  onExpandChange?: (expandedCount: number, totalCities: number) => void;
}

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
  private showCollaborations = true;
  private connectionFilter: ConnectionFilter = 'all';
  private pulseLayer: SVGSVGElement;
  private pulseGroup: SVGGElement;
  private pulseTimer: ReturnType<typeof setTimeout> | undefined;
  private selection: Selection = null;
  /** The selection the current move and collaboration lines were built for. */
  private connectionsFor = selectionKey(null);
  private expanded = new Set<string>();
  /** Houses revealed by a selection in cities the user has not opened. */
  private autoRevealed = new Map<string, Set<string>>();
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
  private clusterLabels = new Map<string, string>();
  private canvasHost: HTMLElement;
  private resizeObserver: ResizeObserver;
  private pendingImages = new Set<HTMLImageElement>();
  private disposed = false;

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
    this.pulseLayer.append(this.pulseGroup);
    pane.append(this.mapLayer, canvasHost, this.pulseLayer);

    this.cy = cytoscape({
      container: canvasHost,
      style: graphStyle,
      boxSelectionEnabled: false,
      // Positions come from geography, so nothing is draggable.
      autoungrabify: true,
    });

    this.cy.on('tap', 'node[kind = "marker"]', (e) => {
      const marker = e.target as NodeSingular;
      if (marker.data('isCluster')) this.zoomToCluster(marker);
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
      canvasHost.style.cursor = 'pointer';
    });
    this.cy.on('mouseout', 'node, edge', () => (canvasHost.style.cursor = ''));
    this.cy.on('mouseover', 'node[kind = "marker"]', (e) => e.target.style('text-opacity', 1));
    this.cy.on('mouseout', 'node[kind = "marker"]', (e) =>
      e.target.style('text-opacity', e.target.data('markerLabelVisible') ? 1 : 0));
    this.cy.on('mouseover', 'edge[kind = "move"], edge[kind = "collaboration"]', (e) => {
      const edge = e.target as EdgeSingular;
      callbacks.onConnectionHover?.(edge.data('label'));
      this.playPulses([edge]);
    });
    this.cy.on('mouseout', 'edge', () => {
      callbacks.onConnectionHover?.(null);
      this.playPulses();
    });
    this.cy.on('viewport', () => this.syncMapLayer());
    this.cy.on('zoom', () => {
      // Keep sizes responsive while zooming; resolve collisions once the gesture settles.
      this.sizeMarkers(false);
      clearTimeout(this.markerTimer);
      this.markerTimer = setTimeout(() => this.sizeMarkers(), 90);
    });

    // Keep the canvas in sync with its container (window resize, mobile rotation).
    this.resizeObserver = new ResizeObserver(() => {
      if (this.disposed) return;
      this.cy.resize();
      this.applyZoomLimit();
      this.cy.fit(this.cy.elements(':visible'), 30);
    });
    this.resizeObserver.observe(canvasHost);

    pane.classList.add('is-map');
    this.applyZoomLimit();
    this.cy.add(mapElements());
    const clusterCities = this.cy.nodes('[kind = "marker"]').map(marker => ({
      city: marker.data('city') as string, tip: marker.data('tip'), count: marker.data('count') as number,
      major: !!marker.data('major'),
    }));
    this.clusterLevels = buildClusterLevels(clusterCities);
    const counts = new Map(clusterCities.map(city => [city.city, city.count]));
    for (const level of this.clusterLevels) for (const cluster of level) {
      if (cluster.members.length < MIN_CLUSTER_CITIES || this.clusterLabels.has(cluster.id)) continue;
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
    if (this.selection) {
      this.refreshSelection(false, true);
      return;
    }
    this.relayoutMap(false);
  }

  /** Tag filters apply to houses, city counts, and both ends of each move. */
  setHouseFilter(ids: ReadonlySet<string> | undefined) {
    this.matchingHouseIds = ids;
    if (this.selection) this.refreshSelection(false, true);
    else this.relayoutMap(false);
  }

  select(sel: Selection, reveal = false) {
    this.selection = sel;
    this.refreshSelection(reveal);
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

    if (sel) {
      const ids = new Set(sel.kind === 'house' ? [sel.id]
        : sel.kind === 'group' ? housesInGroup(sel.id).map((house) => house.id)
        : careerOf(sel.id).map((t) => t.house));
      if (sel.kind === 'house') {
        // Direct children open with their parent. Nested labels open one level at a time.
        for (const house of houses) if (house.parentHouse === sel.id) ids.add(house.id);
        for (const id of ids) for (const ancestor of mapHousePath(id)) this.revealedLabels.add(ancestor);
        // Read the underlying moves: collapsed endpoints currently point at pins.
        for (const move of !this.showMoves || this.connectionFilter === 'collaborations' ? [] : allMoves()) {
          if (move.year > this.year || !this.matchesHouse(move.from.house) || !this.matchesHouse(move.to.house)) continue;
          if (move.from.house === sel.id) ids.add(move.to.house);
          if (move.to.house === sel.id) ids.add(move.from.house);
        }
        if (this.showCollaborations && this.connectionFilter !== 'designers') {
          for (const project of collaborationsOf(sel.id)) {
            if (project.year > this.year || !this.matchesHouse(sel.id)) continue;
            for (const partner of project.houses) {
              if (!this.matchesHouse(partner)) continue;
              ids.add(partner);
              for (const ancestor of mapHousePath(partner)) this.revealedLabels.add(ancestor);
            }
          }
        }
      }
      for (const id of ids) {
        const house = getHouse(id);
        if (!house || !context.has(id) || (house.founded ?? -Infinity) > this.year) continue;
        if (sel.kind === 'designer') for (const ancestor of mapHousePath(id)) this.revealedLabels.add(ancestor);
        const city = mapLocationForHouse(id);
        if (!this.expanded.has(city)) {
          this.expanded.add(city);
          this.autoRevealed.set(city, new Set());
          relayout = true;
        }
        for (const ancestor of mapHousePath(id)) this.autoRevealed.get(city)?.add(ancestor);
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

  setAllExpanded(open: boolean) {
    this.autoRevealed.clear();
    this.expanded = new Set(open ? this.allCities : []);
    this.relayoutMap(false);
    this.notifyExpand();
    this.cy.stop(true, false);
    this.cy.fit(this.cy.elements(':visible'), 30);
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
    if (this.selection) this.refreshSelection(false, true);
    else this.relayoutMap(false);
  }

  setConnectionFilter(filter: ConnectionFilter) {
    if (this.connectionFilter === filter) return;
    this.connectionFilter = filter;
    this.refreshSelection(false, true);
  }

  get allExpanded() {
    return this.expanded.size === this.allCities.length;
  }

  fit() {
    const visible = this.cy.elements(':visible');
    if (visible.nonempty()) this.cy.animate({ fit: { eles: visible, padding: 30 } }, { duration: 300 });
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
    animate = animate && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
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
    const layout = layoutMap(this.expanded, byCity, anchor);

    cy.batch(() => {
      cy.nodes('[kind = "marker"][!isCluster]').forEach((marker) => {
        const open = this.expanded.has(marker.data('city'));
        if (open === !!marker.data('expanded')) return;
        marker.data({
          expanded: open,
          image: cityMarkerIcon(marker.data('shown') ?? marker.data('count'), open),
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

  /** Only display membership/counts change with filters; the geographic hierarchy is cached. */
  private updateClusters() {
    const cy = this.cy;
    const available = new Map(cy.nodes('[kind = "marker"][!isCluster]')
      .not('.hidden, .selection-hidden').filter(marker => !this.expanded.has(marker.data('city')))
      .map(marker => [marker.data('city') as string, marker] as const));
    const clustered = new Set<string>();
    const active = new Set<string>();
    cy.batch(() => {
      for (const cluster of this.clusterLevels[clusterLevel(cy.zoom())] ?? []) {
        const members = cluster.members.filter(city => available.has(city));
        if (members.length < MIN_CLUSTER_CITIES) continue;
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

  private zoomToCluster(marker: NodeSingular) {
    const cy = this.cy;
    const points = (marker.data('members') as string[]).map(city => cy.getElementById(nodeId.city(city)).data('tip'));
    const xs = points.map(point => point.x), ys = points.map(point => point.y);
    const x1 = Math.min(...xs), x2 = Math.max(...xs), y1 = Math.min(...ys), y2 = Math.max(...ys);
    const next = CLUSTER_ZOOMS[clusterLevel(cy.zoom())] ?? cy.maxZoom();
    const fit = Math.min(Math.max(1, cy.width() - 120) / Math.max(32, x2 - x1),
      Math.max(1, cy.height() - 120) / Math.max(32, y2 - y1));
    const zoom = Math.min(cy.maxZoom(), Math.max(next + 0.01, Math.min(fit, cy.zoom() * 2.5)));
    const pan = { x: cy.width() / 2 - (x1 + x2) / 2 * zoom, y: cy.height() / 2 - (y1 + y2) / 2 * zoom };
    cy.stop(true, false);
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) cy.viewport({ zoom, pan });
    else cy.animate({ zoom, pan }, { duration: 300 });
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
      const obstacles = this.cy.nodes('[kind = "grid"]').not('.collapsed, .hidden').map((grid) => {
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
    markers.forEach((m) => {
      const tip = tips.get(m.id())!;
      const lw = (m.data('label').length * LABEL_PX * 0.62) / z;
      const box = { x1: tip.x - lw / 2, x2: tip.x + lw / 2, y1: tip.y + 2 / z, y2: tip.y + (LABEL_PX * 1.4 + 2) / z };
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
          'font-size': LABEL_PX / z,
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
    if (animate) n.animate({ position: pos }, { duration: 250, easing: 'ease-in-out-cubic', queue: false });
    else n.position(pos);
  }

  private notifyExpand() {
    this.callbacks.onExpandChange?.(this.expanded.size, this.allCities.length);
  }

  /** The SVG map is drawn in model coordinates; mirror Cytoscape's pan + zoom onto it. */
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
          m.data({ shown: count, image: cityMarkerIcon(count, !!m.data('expanded')) });
        }
      });
      setClass(markers, 'hidden', (m) => m.data('shown') === 0);
      setClass(cy.elements('[kind = "grid"], [kind = "leader"]'), 'hidden', (el) =>
        cy.getElementById(nodeId.city(el.data('city'))).data('shown') === 0);
    });
  }

  private clearPulses() {
    clearTimeout(this.pulseTimer);
    this.pulseGroup.replaceChildren();
  }

  /** Native SVG motion follows the rendered Bezier route without restyling Cytoscape per frame. */
  private playPulses(edges?: EdgeSingular[]) {
    this.clearPulses();
    if (this.disposed || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const selected = this.cy.edges('.highlight').filter((edge) => edge.visible()).map((edge) => edge as EdgeSingular);
    for (const edge of edges ?? []) if (!selected.some((item) => item.id() === edge.id())) selected.push(edge);
    const ns = 'http://www.w3.org/2000/svg';
    for (const edge of selected) {
      if (!edge.visible() || edge.removed()) continue;
      const route = renderedRoute(edge);
      if (!route) continue;
      const { start, end, controls } = route;
      const points = [start, ...controls, end];
      if (points.some((point) => !Number.isFinite(point.x) || !Number.isFinite(point.y))) continue;
      let path = `M ${start.x} ${start.y}`;
      controls.forEach((control, i) => {
        const next = controls[i + 1];
        const target = next ? { x: (control.x + next.x) / 2, y: (control.y + next.y) / 2 } : end;
        path += ` Q ${control.x} ${control.y} ${target.x} ${target.y}`;
      });
      if (!controls.length) path += ` L ${end.x} ${end.y}`;
      const dot = document.createElementNS(ns, 'circle');
      dot.setAttribute('r', String(3 / this.cy.zoom()));
      dot.setAttribute('fill', edge.data('kind') === 'collaboration' ? '#cc0000' : '#000080');
      const motion = document.createElementNS(ns, 'animateMotion');
      motion.setAttribute('path', path);
      motion.setAttribute('dur', '3s');
      motion.setAttribute('repeatCount', 'indefinite');
      motion.setAttribute('begin', 'indefinite');
      motion.setAttribute('fill', 'freeze');
      dot.append(motion);
      this.pulseGroup.append(dot);
      motion.beginElement?.();
    }
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
      focus = shown;
    });

    this.sizeMarkers();
    this.clearPulses();
    this.pulseTimer = setTimeout(() => this.playPulses(), 450);

    if (reveal && focus && focus.nonempty()) {
      cy.animate({ fit: { eles: focus, padding: 80 } }, { duration: 400 });
    }
  }
}

const selectionKey = (sel: Selection) => (sel ? `${sel.kind}:${sel.id}` : '');

/** An edge's drawn route, or undefined before the renderer has laid it out. */
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
