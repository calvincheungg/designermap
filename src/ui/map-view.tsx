import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { DesignerGraph, type ConnectionFilter, type GraphCallbacks } from '../graph/graph';
import { ContextMenu } from './context-menu';

/** React owns the host and lifecycle; Cytoscape owns the canvas/SVG inside it. */
export function MapView({ graphRef, onSelect, onExpandChange }: {
  graphRef: RefObject<DesignerGraph | null>;
  onSelect: GraphCallbacks['onSelect']; onExpandChange: NonNullable<GraphCallbacks['onExpandChange']>;
}) {
  const [connectionFilter, setConnectionFilter] = useState<ConnectionFilter>('all');
  const [connectionLabel, setConnectionLabel] = useState<string | null>(null);
  const host = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const closeMenu = useCallback((restoreFocus = false) => {
    setMenu(null);
    if (restoreFocus) host.current?.focus({ preventScroll: true });
  }, []);
  useLayoutEffect(() => {
    const graph = new DesignerGraph(host.current!, { onSelect, onExpandChange, onConnectionHover: setConnectionLabel });
    graphRef.current = graph;
    const close = () => closeMenu();
    graph.cy.on('viewport', close);
    let mounted = true;
    document.fonts?.ready.then(() => { if (mounted) graph.refreshStyle(); });
    const debug = window as Window & { graph?: DesignerGraph; cy?: DesignerGraph['cy'] };
    if (import.meta.env.DEV) Object.assign(debug, { graph, cy: graph.cy });
    return () => {
      mounted = false;
      graph.cy.off('viewport', close);
      graph.destroy();
      if (graphRef.current === graph) graphRef.current = null;
      if (debug.graph === graph) { delete debug.graph; delete debug.cy; }
    };
  }, [graphRef, onSelect, onExpandChange, closeMenu]);

  useLayoutEffect(() => { graphRef.current?.setConnectionFilter(connectionFilter); }, [connectionFilter, graphRef]);

  return <><div className="map-workspace">
    <div className="connection-toolbar" role="group" aria-label="Connection filter">
      <span>Connections:</span>
      {(['all', 'designers', 'collaborations'] as const).map((filter) => <button key={filter}
        aria-pressed={connectionFilter === filter} onClick={() => setConnectionFilter(filter)}>
        {{ all: 'All', designers: 'Designers', collaborations: 'Collaborations' }[filter]}
      </button>)}
    </div>
    <div className="connection-details sunken-panel" role="status">{connectionLabel ?? 'Hover a connection for details. Designer arrows show career direction.'}</div>
    <div id="graph" ref={host} className="graph-pane" tabIndex={0} aria-label="Graph of fashion houses and designers"
    onContextMenuCapture={(event) => {
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      setMenu({ x: event.clientX || rect.left + rect.width / 2, y: event.clientY || rect.top + rect.height / 2 });
    }} onKeyDown={(event) => {
      if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) return;
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      setMenu({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }} />
    </div>
    {menu && <ContextMenu {...menu} onClose={closeMenu} actions={[
      { label: 'Expand All', run: () => graphRef.current?.setAllExpanded(true) },
      { label: 'Collapse All', run: () => graphRef.current?.setAllExpanded(false) },
    ]} />}
  </>;
}
