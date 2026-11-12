import cytoscape, { type Core, type Collection, type NodeSingular } from 'cytoscape';
import fcose from 'cytoscape-fcose';
import { buildElements, nodeId, type ViewMode } from './elements';
import { graphStyle } from './style';

cytoscape.use(fcose);

export type Selection = { kind: 'house' | 'designer'; id: string } | null;

/** Thin wrapper around Cytoscape: rebuilds per view, filters by year, highlights selection. */
export class DesignerGraph {
  readonly cy: Core;
  private mode: ViewMode = 'network';
  private year = Infinity;
  private selection: Selection = null;

  constructor(
    container: HTMLElement,
    private onSelect: (sel: Selection) => void,
  ) {
    this.cy = cytoscape({
      container,
      style: graphStyle,
      minZoom: 0.2,
      maxZoom: 3,
      wheelSensitivity: 0.3,
      boxSelectionEnabled: false,
      autoungrabify: false,
    });

    this.cy.on('tap', 'node[kind = "house"], node[kind = "designer"]', (e) => {
      const n = e.target as NodeSingular;
      this.onSelect({ kind: n.data('kind'), id: n.data('refId') });
    });
    this.cy.on('tap', 'edge', (e) => {
      this.onSelect({ kind: 'designer', id: e.target.data('designerId') });
    });
    this.cy.on('tap', (e) => {
      if (e.target === this.cy) this.onSelect(null);
    });
    this.cy.on('mouseover', 'node[kind != "city"], edge', () => (container.style.cursor = 'pointer'));
    this.cy.on('mouseout', 'node, edge', () => (container.style.cursor = ''));

    // Keep the canvas in sync with its container (window resize, mobile rotation).
    new ResizeObserver(() => {
      this.cy.resize();
      this.cy.fit(this.cy.elements(':visible'), 30);
    }).observe(container);

    this.setMode('network');
  }

  setMode(mode: ViewMode) {
    this.mode = mode;
    this.cy.elements().remove();
    this.cy.add(buildElements(mode));
    this.cy
      .layout({
        name: 'fcose',
        quality: 'proof',
        animate: false,
        randomize: true,
        padding: 30,
        nodeDimensionsIncludeLabels: true,
        packComponents: true,
        nodeRepulsion: () => (mode === 'network' ? 6000 : 12000),
        idealEdgeLength: () => (mode === 'network' ? 60 : 120),
        edgeElasticity: () => 0.3,
        nestingFactor: 0.4,
        gravity: 0.4,
        gravityCompound: 1.2,
        tilingPaddingVertical: 20,
        tilingPaddingHorizontal: 20,
      } as cytoscape.LayoutOptions)
      .run();
    this.applyYear();
    this.applySelection(false);
  }

  /** Show only what existed up to (and including) `year`. */
  setYear(year: number) {
    this.year = year;
    this.applyYear();
  }

  select(sel: Selection, reveal = false) {
    this.selection = sel;
    this.applySelection(reveal);
  }

  fit() {
    this.cy.animate({ fit: { eles: this.cy.elements(':visible'), padding: 30 } }, { duration: 300 });
  }

  /** Re-render after web fonts load (canvas text doesn't reflow on its own). */
  refreshStyle() {
    this.cy.style().update();
  }

  private applyYear() {
    const cy = this.cy;
    cy.batch(() => {
      cy.elements().removeClass('hidden');
      cy.elements('[start]').filter((el) => el.data('start') > this.year).addClass('hidden');
      // Designers with every tenure hidden disappear too, as do empty city boxes.
      cy.nodes('[kind = "designer"]')
        .filter((n) => n.connectedEdges().not('.hidden').empty())
        .addClass('hidden');
      cy.nodes('[kind = "city"]')
        .filter((n) => n.children().not('.hidden').empty())
        .addClass('hidden');
    });
  }

  private focusFor(sel: NonNullable<Selection>): Collection {
    const cy = this.cy;
    if (sel.kind === 'house') return cy.getElementById(nodeId.house(sel.id)).closedNeighborhood();

    if (this.mode === 'network') {
      return cy.getElementById(nodeId.designer(sel.id)).closedNeighborhood();
    }
    // Moves view has no designer nodes: highlight their move arrows + endpoints.
    const edges = cy.edges().filter((e) => e.data('designerId') === sel.id);
    return edges.union(edges.connectedNodes());
  }

  private applySelection(reveal: boolean) {
    const cy = this.cy;
    const sel = this.selection;
    let focus: Collection | undefined;

    cy.batch(() => {
      cy.elements().removeClass('faded highlight focus');
      if (!sel) return;
      focus = this.focusFor(sel);
      if (focus.empty()) return;
      cy.elements().not(focus).not('[kind = "city"]').addClass('faded');
      focus.addClass('highlight');
      const self =
        sel.kind === 'house'
          ? cy.getElementById(nodeId.house(sel.id))
          : cy.getElementById(nodeId.designer(sel.id));
      self.addClass('focus');
    });

    if (reveal && focus && focus.nonempty()) {
      cy.animate({ fit: { eles: focus, padding: 80 } }, { duration: 400 });
    }
  }
}
