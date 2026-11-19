import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { DesignerGraph, type ConnectionFilter, type GraphCallbacks } from '../graph/graph';
import { ContextMenu } from './context-menu';

/** React owns the host and lifecycle; Cytoscape owns the canvas/SVG inside it. */
export function MapView({ graphRef, connectionFilter, onSelect, onExpandChange, onShowMore, onOpenCity }: {
  graphRef: RefObject<DesignerGraph | null>; connectionFilter: ConnectionFilter;
  onSelect: GraphCallbacks['onSelect']; onExpandChange: NonNullable<GraphCallbacks['onExpandChange']>;
  /** "Show More" on a brand: open its Properties, even when that window is minimized. */
  onShowMore: (houseId: string) => void;
  /** Clicking a city pin opens that city's window. */
  onOpenCity: (city: string) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; house?: string } | null>(null);
  const closeMenu = useCallback((restoreFocus = false) => {
    setMenu(null);
    if (restoreFocus) host.current?.focus({ preventScroll: true });
  }, []);
  useLayoutEffect(() => {
    const graph = new DesignerGraph(host.current!, { onSelect, onExpandChange, onOpenCity });
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
  }, [graphRef, onSelect, onExpandChange, onOpenCity, closeMenu]);

  useLayoutEffect(() => { graphRef.current?.setConnectionFilter(connectionFilter); }, [connectionFilter, graphRef]);

  return <><div className="map-workspace">
    <div id="graph" ref={host} className="graph-pane" tabIndex={0} aria-label="Graph of fashion houses and designers"
    onContextMenuCapture={(event) => {
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      const house = event.clientX || event.clientY ? graphRef.current?.houseAt(event.clientX, event.clientY) : undefined;
      setMenu({ x: event.clientX || rect.left + rect.width / 2, y: event.clientY || rect.top + rect.height / 2, house });
    }} onKeyDown={(event) => {
      if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) return;
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      setMenu({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }} />
    </div>
    {menu && <ContextMenu x={menu.x} y={menu.y} onClose={closeMenu} actions={[
      ...(menu.house ? [{ label: 'Show More', run: () => onShowMore(menu.house!) }] : []),
      { label: 'Expand All', run: () => graphRef.current?.setAllExpanded(true) },
      { label: 'Collapse All', run: () => graphRef.current?.setAllExpanded(false) },
    ]} />}
  </>;
}
