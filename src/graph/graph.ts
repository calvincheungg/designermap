import cytoscape, { type Collection, type Core, type NodeSingular, type SingularElementArgument } from 'cytoscape';
import { careerOf, getHouse } from '../data';
import { mapElements, moveEdges, nodeId } from './elements';
import { housesByCity, LABEL_PX, layoutMap, MAP_HEIGHT, MAP_MIN_ZOOM, MAP_WIDTH, mapSvgMarkup, pinScale } from './geo';
import { cityMarkerIcon, frameIcon, logoInfo, logoSize, PIN_H, PIN_W } from './icons';
import { graphStyle } from './style';

export type Selection = { kind: 'house' | 'designer'; id: string } | null;

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
  /** Whether move lines between brands are drawn (the selection's own lines always are). */
  private showMoves = true;
  private selection: Selection = null;
  private expanded = new Set<string>();
  private readonly allCities = [...housesByCity().keys()];
  private mapLayer: SVGSVGElement;
  /** Group inside the map SVG that carries the pan/zoom transform. */
  private mapGroup: SVGGElement;
  private canvasHost: HTMLElement;
  private resizeObserver: ResizeObserver;
  private fitTimer: ReturnType<typeof setTimeout> | undefined;
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
    this.mapLayer.append(this.mapGroup);

    const canvasHost = document.createElement('div');
    this.canvasHost = canvasHost;
    canvasHost.className = 'cy-layer';
    pane.append(this.mapLayer, canvasHost);

    this.cy = cytoscape({
      container: canvasHost,
      style: graphStyle,
      boxSelectionEnabled: false,
      // Positions come from geography, so nothing is draggable.
      autoungrabify: true,
    });

    this.cy.on('tap', 'node[kind = "marker"]', (e) => this.toggleCity(e.target.data('city')));
    this.cy.on('tap', 'node[kind = "house"]', (e) => {
      callbacks.onSelect({ kind: 'house', id: (e.target as NodeSingular).data('refId') });
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
    this.cy.on('viewport', () => this.syncMapLayer());
    this.cy.on('zoom', () => this.sizeMarkers());

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
    this.applyYear();
    this.applySelection(false);
  }

  /** Tag filters apply to houses, city counts, and both ends of each move. */
  setHouseFilter(ids: ReadonlySet<string> | undefined) {
    this.matchingHouseIds = ids;
    this.relayoutMap(false);
  }

  select(sel: Selection, reveal = false) {
    this.selection = sel;
    // Open the cities involved so the selection can be seen.
    if (sel) {
      const cities =
        sel.kind === 'house'
          ? [getHouse(sel.id)?.city]
          : careerOf(sel.id).map((t) => getHouse(t.house)?.city);
      const toOpen = cities.filter((c): c is string => !!c && !this.expanded.has(c)
        && (housesByCity().get(c)?.some((h) => this.matchesHouse(h.id)) ?? false));
      if (toOpen.length) {
        toOpen.forEach((c) => this.expanded.add(c));
        this.relayoutMap(false);
        this.notifyExpand();
      }
    }
    this.applySelection(reveal);
  }

  toggleCity(city: string) {
    if (this.expanded.has(city)) this.expanded.delete(city);
    else this.expanded.add(city);
    this.relayoutMap(true);
    this.notifyExpand();
  }

  setAllExpanded(open: boolean) {
    this.expanded = new Set(open ? this.allCities : []);
    this.relayoutMap(true);
    this.notifyExpand();
    // Wait for the move animation, then frame everything.
    clearTimeout(this.fitTimer);
    this.fitTimer = setTimeout(() => this.fit(), 280);
  }

  /** Show or hide the move lines between brands (a selected designer's lines stay visible). */
  setShowMoves(on: boolean) {
    this.showMoves = on;
    this.applySelection(false);
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
    clearTimeout(this.fitTimer);
    this.resizeObserver.disconnect();
    for (const img of this.pendingImages) {
      img.onload = null;
      img.onerror = null;
    }
    this.pendingImages.clear();
    this.cy.destroy();
    this.mapLayer.remove();
    this.canvasHost.remove();
  }

  /* ---------- map layout ---------- */

  /**
   * Re-place markers + houses for the current expansion state, show/hide
   * houses, and rebuild the move arrows so they attach to what's visible.
   */
  private relayoutMap(animate: boolean) {
    const cy = this.cy;
    const byCity = new Map([...housesByCity()].flatMap(([city, hs]) => {
      const matching = hs.filter((h) => this.matchesHouse(h.id));
      return matching.length ? [[city, matching] as const] : [];
    }));
    const layout = layoutMap(this.expanded, byCity);

    cy.batch(() => {
      cy.nodes('[kind = "marker"]').forEach((marker) => {
        const open = this.expanded.has(marker.data('city'));
        if (open === !!marker.data('expanded')) return;
        marker.data({
          expanded: open,
          image: cityMarkerIcon(marker.data('shown') ?? marker.data('count'), open),
        });
      });
      // A grid, and the dotted leader from its pin, show while the city is open.
      setClass(cy.nodes('[kind = "grid"]').union(cy.edges('[kind = "leader"]')), 'collapsed', (el) => !this.expanded.has(el.data('city')));

      const houses = cy.nodes('[kind = "house"]');
      houses.forEach((n) => {
        const pos = layout.houses.get(n.data('refId'));
        if (!pos) return;
        // Newly opened houses start at their marker and fan out.
        if (animate && n.hasClass('collapsed')) {
          n.position(cy.getElementById(nodeId.city(n.data('city'))).position());
        }
        this.place(n, pos, animate);
      });
      setClass(houses, 'collapsed', (n) => !layout.houses.has(n.data('refId')));

      cy.edges('[kind = "move"]').remove();
      cy.add(moveEdges(this.expanded));
    });

    // (applyYear re-sizes the markers too.)
    this.applyYear();
    this.applySelection(false);
  }

  /**
   * Pins scale with the map when zoomed out, but stop growing past a small
   * on-screen size so you can see the city underneath. Each stays anchored with
   * its tip on the city, and city names stay a constant size on screen.
   * Where pins crowd together, the city with more houses draws on top and
   * labels that would collide with a bigger city's are hidden until you zoom in.
   */
  private sizeMarkers() {
    const z = this.cy.zoom();
    const k = pinScale(z);
    const w = PIN_W * k;
    const h = PIN_H * k;
    const markers = this.cy
      .nodes('[kind = "marker"]')
      .not('.hidden')
      .sort((a, b) => (b.data('shown') ?? b.data('count')) - (a.data('shown') ?? a.data('count')));

    // Label boxes (model units), biggest city first; skip any that would collide.
    const labelBoxes: { x1: number; x2: number; y1: number; y2: number }[] = [];
    const showLabel = new Set<string>();
    markers.forEach((m) => {
      const tip = m.data('tip') as { x: number; y: number };
      const lw = (m.data('label').length * LABEL_PX * 0.62) / z;
      const box = { x1: tip.x - lw / 2, x2: tip.x + lw / 2, y1: tip.y, y2: tip.y + (LABEL_PX * 1.4) / z };
      const pinBox = { x1: tip.x - w / 2, x2: tip.x + w / 2, y1: tip.y - h, y2: tip.y };
      const hits = (a: typeof box) =>
        labelBoxes.some((b) => a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1);
      if (!hits(box)) showLabel.add(m.id());
      labelBoxes.push(pinBox);
      if (showLabel.has(m.id())) labelBoxes.push(box);
    });

    this.cy.batch(() => {
      markers.forEach((m, i) => {
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
        const tip = m.data('tip') as { x: number; y: number };
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
    if (animate) n.animate({ position: pos }, { duration: 250 });
    else n.position(pos);
  }

  private notifyExpand() {
    this.callbacks.onExpandChange?.(this.expanded.size, this.allCities.length);
  }

  /** The SVG map is drawn in model coordinates; mirror Cytoscape's pan + zoom onto it. */
  private syncMapLayer() {
    const { x, y } = this.cy.pan();
    this.mapGroup.setAttribute('transform', `translate(${x} ${y}) scale(${this.cy.zoom()})`);
  }

  /* ---------- year filter + selection ---------- */

  private matchesHouse(id: string): boolean {
    return !this.matchingHouseIds || this.matchingHouseIds.has(id);
  }

  private applyYear() {
    const cy = this.cy;
    const year = this.year;
    cy.batch(() => {
      // Only houses and moves have a start year.
      setClass(cy.elements('[start]'), 'hidden', (el) => el.data('start') > year
        || (el.data('kind') === 'house' && !this.matchesHouse(el.data('refId')))
        || (el.data('kind') === 'move'
          && (!this.matchesHouse(el.data('fromHouse')) || !this.matchesHouse(el.data('toHouse')))));
      // Map markers count only the houses that existed by then.
      const markers = cy.nodes('[kind = "marker"]');
      markers.forEach((m) => {
        const count = housesByCity()
          .get(m.data('city'))!
          .filter((h) => this.matchesHouse(h.id) && (h.founded ?? -Infinity) <= year).length;
        if (count !== m.data('shown')) {
          m.data({ shown: count, image: cityMarkerIcon(count, !!m.data('expanded')) });
        }
      });
      setClass(markers, 'hidden', (m) => m.data('shown') === 0);
      setClass(cy.elements('[kind = "grid"], [kind = "leader"]'), 'hidden', (el) =>
        cy.getElementById(nodeId.city(el.data('city'))).data('shown') === 0);
    });
    this.sizeMarkers();
  }

  private focusFor(sel: NonNullable<Selection>): Collection {
    const cy = this.cy;
    if (sel.kind === 'house') {
      const node = cy.getElementById(nodeId.house(sel.id));
      return node.closedNeighborhood().not(SCENERY).union(node);
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
    let focus: Collection | undefined;

    cy.batch(() => {
      // Ignore parts of the selection the year slider or a collapsed city hides.
      const shown = sel ? this.focusFor(sel).not('.hidden, .collapsed') : cy.collection();
      const self = sel?.kind === 'house' ? cy.getElementById(nodeId.house(sel.id)) : cy.collection();
      const scenery = cy.elements(SCENERY);
      const all = cy.elements();
      setClass(all, 'highlight', (el) => shown.has(el));
      setClass(all, 'focus', (el) => shown.nonempty() && self.has(el));
      setClass(all, 'faded', (el) => shown.nonempty() && !shown.has(el) && !scenery.has(el));
      // Lines setting off: hide every move line except the selection's own.
      setClass(cy.edges('[kind = "move"]'), 'lines-off', (e) => !this.showMoves && !shown.has(e));
      focus = shown;
    });

    this.scaleEdges();

    if (reveal && focus && focus.nonempty()) {
      cy.animate({ fit: { eles: focus, padding: 80 } }, { duration: 400 });
    }
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
