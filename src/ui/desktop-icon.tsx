import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';

interface Point { x: number; y: number }
const DRAG_THRESHOLD = 4;
const MARGIN = 8;

function readPoint(key: string): Point | null {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? 'null') as Partial<Point> | null;
    return value && Number.isFinite(value.x) && Number.isFinite(value.y) ? value as Point : null;
  } catch { return null; }
}

/**
 * A Win98 desktop icon floating over the map: drag it anywhere inside the map
 * area (position remembered under `storageKey`), click or press Enter to open.
 * Without a saved position it sits in the top-right corner.
 */
export function DesktopIcon({ label, icon, storageKey, onOpen }: { label: string; icon: ReactNode; storageKey: string; onOpen: () => void }) {
  const button = useRef<HTMLButtonElement>(null);
  const [point, setPoint] = useState<Point | null>(() => readPoint(storageKey));
  const drag = useRef<{ start: Point; origin: Point; moved: boolean } | null>(null);

  const clamp = (next: Point): Point => {
    const element = button.current, parent = element?.parentElement;
    if (!element || !parent) return next;
    return {
      x: Math.round(Math.min(Math.max(MARGIN, next.x), Math.max(MARGIN, parent.clientWidth - element.offsetWidth - MARGIN))),
      y: Math.round(Math.min(Math.max(MARGIN, next.y), Math.max(MARGIN, parent.clientHeight - element.offsetHeight - MARGIN))),
    };
  };
  const save = (next: Point | null) => {
    setPoint(next);
    try { if (next) localStorage.setItem(storageKey, JSON.stringify(next)); else localStorage.removeItem(storageKey); } catch { /* storage unavailable */ }
  };
  // Keep a saved position on screen when the map area shrinks.
  useLayoutEffect(() => {
    const parent = button.current?.parentElement;
    if (!parent || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => setPoint((current) => current && clamp(current)));
    observer.observe(parent);
    return () => observer.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const down = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const element = event.currentTarget, parent = element.parentElement!.getBoundingClientRect(), rect = element.getBoundingClientRect();
    element.setPointerCapture?.(event.pointerId);
    drag.current = { start: { x: event.clientX, y: event.clientY }, origin: { x: rect.left - parent.left, y: rect.top - parent.top }, moved: false };
  };
  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const current = drag.current;
    if (!current) return;
    const dx = event.clientX - current.start.x, dy = event.clientY - current.start.y;
    if (!current.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    current.moved = true;
    setPoint(clamp({ x: current.origin.x + dx, y: current.origin.y + dy }));
  };
  const up = () => {
    const current = drag.current;
    drag.current = null;
    if (!current) return;
    if (current.moved) save(point && clamp(point));
    else onOpen();
  };
  const keys = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(); }
  };

  return <button ref={button} type="button" className="desktop-icon" title={`Open ${label} (drag to move)`}
    style={point ? { left: point.x, top: point.y, right: 'auto' } : undefined}
    onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { drag.current = null; }}
    onKeyDown={keys} onDoubleClick={(event) => event.preventDefault()}>
    <span className="desktop-icon-image" aria-hidden="true">{icon}</span>
    <span className="desktop-icon-label">{label}</span>
  </button>;
}
