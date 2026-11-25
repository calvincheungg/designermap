import { createPortal } from 'react-dom';
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { DesignerGraph, type ConnectionFilter, type GraphCallbacks } from '../graph/graph';
import { favoriteAction, FavoritesContext } from './favorites';
import { ContextMenu } from './context-menu';

const TIP_DELAY = 400;
/** A Win98 tooltip below the mouse, kept on screen. */
function MapTooltip({ lines, x, y }: { lines: readonly string[]; x: number; y: number }) {
  const box = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = box.current!, { width, height } = element.getBoundingClientRect();
    element.style.left = `${Math.max(4, Math.min(x + 12, window.innerWidth - width - 4))}px`;
    element.style.top = `${y + 22 + height > window.innerHeight - 4 ? Math.max(4, y - height - 8) : y + 22}px`;
  }, [x, y, lines]);
  return createPortal(<div ref={box} className="map-tooltip" role="tooltip" style={{ left: x, top: y }}>
    <div className="map-tooltip-text">{lines.map((line, i) => i ? <div key={i}>{line}</div> : <b key={i}>{line}</b>)}</div>
  </div>, document.body);
}

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
  const favorites = useContext(FavoritesContext);
  /** The tooltip waits for the mouse to rest, like Win98's. */
  const [tip, setTip] = useState<{ lines: string[]; x: number; y: number } | null>(null);
  const tipTimer = useRef<number | undefined>(undefined);
  const onHover = useCallback<NonNullable<GraphCallbacks['onHover']>>((next) => {
    clearTimeout(tipTimer.current);
    setTip(null);
    if (next) tipTimer.current = window.setTimeout(() => setTip(next), TIP_DELAY);
  }, []);
  useEffect(() => () => clearTimeout(tipTimer.current), []);
  const closeMenu = useCallback((restoreFocus = false) => {
    setMenu(null);
    if (restoreFocus) host.current?.focus({ preventScroll: true });
  }, []);
  useLayoutEffect(() => {
    const graph = new DesignerGraph(host.current!, { onSelect, onExpandChange, onOpenCity, onHover });
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
  }, [graphRef, onSelect, onExpandChange, onOpenCity, onHover, closeMenu]);

  useLayoutEffect(() => { graphRef.current?.setConnectionFilter(connectionFilter); }, [connectionFilter, graphRef]);

  return <><div className="map-workspace">
    <div id="graph" ref={host} className="graph-pane" tabIndex={0} aria-label="Graph of fashion houses and designers"
    onContextMenuCapture={(event) => {
      event.preventDefault();
      onHover(null);
      const rect = event.currentTarget.getBoundingClientRect();
      const house = event.clientX || event.clientY ? graphRef.current?.houseAt(event.clientX, event.clientY) : undefined;
      setMenu({ x: event.clientX || rect.left + rect.width / 2, y: event.clientY || rect.top + rect.height / 2, house });
    }} onKeyDown={(event) => {
      if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) return;
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      setMenu({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }} />
      <div className="map-zoom" role="group" aria-label="Map zoom">
        <button type="button" title="Zoom In" aria-label="Zoom In" onClick={() => graphRef.current?.zoomBy(1.5)}>+</button>
        <button type="button" title="Zoom Out" aria-label="Zoom Out" onClick={() => graphRef.current?.zoomBy(1 / 1.5)}>−</button>
      </div>
    </div>
    {tip && !menu && <MapTooltip {...tip} />}
    {menu && <ContextMenu x={menu.x} y={menu.y} onClose={closeMenu} actions={[
      ...(menu.house ? [{ label: 'Show More', run: () => onShowMore(menu.house!) }, ...favoriteAction(favorites, [{ kind: 'house', id: menu.house }])] : []),
      { label: 'Expand All', run: () => graphRef.current?.setAllExpanded(true) },
      { label: 'Collapse All', run: () => graphRef.current?.setAllExpanded(false) },
    ]} />}
  </>;
}
