import { oneOf, readJson, storedKeys, useSetting, useSettingsCleared, writeSetting } from './storage';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import { ContextMenu, type MenuAction } from './context-menu';

interface Point { x: number; y: number }
interface Rect { x: number; y: number; width: number; height: number }
const DRAG_THRESHOLD = 4;
const MARGIN = 8;

export interface DesktopShortcut {
  label: string; icon: ReactNode; storageKey: string; open: () => void;
  /** Arrange Icons by Type: system icons (My Computer, Recycle Bin…) first, then programs. */
  type?: 'system' | 'program';
}
export type ArrangeBy = 'type' | 'name';
const ARRANGE_KEY = 'designer-map:desktop-arrange';
/** Every remembered icon place, and how the icons are arranged. */
export const iconPlaceKeys = () => [...storedKeys('designer-map:desktop-icon:'), ARRANGE_KEY];
const TYPE_ORDER = { system: 0, program: 1 } as const;
/** The icons in slot order: by type (keeping the given order within a type) or alphabetically. */
export function arrangeIcons<T extends Pick<DesktopShortcut, 'label' | 'type'>>(icons: readonly T[], by: ArrangeBy): T[] {
  return by === 'name' ? [...icons].sort((a, b) => a.label.localeCompare(b.label))
    : [...icons].sort((a, b) => TYPE_ORDER[a.type ?? 'program'] - TYPE_ORDER[b.type ?? 'program']);
}

function readPoint(key: string): Point | null {
  const value = readJson(key) as Partial<Point> | null | undefined;
  return value && Number.isFinite(value.x) && Number.isFinite(value.y) ? value as Point : null;
}
const writePoint = (key: string, point: Point | null) => writeSetting(key, point && JSON.stringify(point));
const overlaps = (a: Rect, b: Rect) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

/**
 * The desktop's Win98 icons, laid out in one layer (`.desktop-icons`). Click or Enter opens an
 * icon; drag to move it (positions remembered under each `storageKey`; without one it sits in
 * its `slot` row down the left edge). Drag across empty desktop for a dotted rubber band that
 * selects the icons it touches (Ctrl/Shift adds to the selection, as does Ctrl+click); dragging
 * any selected icon moves them all. Right-click an icon for its Win98 menu, or the bare
 * desktop for Arrange Icons, Line Up Icons, Refresh and the caller's `desktopActions`.
 */
export function DesktopIcons({ icons: given, desktopActions = [] }: {
  icons: readonly DesktopShortcut[];
  /** Extra commands at the end of the desktop's own right-click menu (New, Properties). */
  desktopActions?: readonly MenuAction[];
}) {
  const layer = useRef<HTMLDivElement>(null);
  const [arrange, setArrange] = useSetting<ArrangeBy>(ARRANGE_KEY, oneOf(['name', 'type']), 'type');
  const icons = arrangeIcons(given, arrange);
  /** Refresh: the icons blink off for a frame, as Win98's desktop redraws. */
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    if (!refreshing) return;
    const frame = requestAnimationFrame(() => setRefreshing(false));
    return () => cancelAnimationFrame(frame);
  }, [refreshing]);
  const [desktopMenu, setDesktopMenu] = useState<{ x: number; y: number } | null>(null);
  const [points, setPoints] = useState<Record<string, Point | null>>(() =>
    Object.fromEntries(icons.map((icon) => [icon.storageKey, readPoint(icon.storageKey)])));
  useSettingsCleared((keys) => setPoints((current) => Object.fromEntries(Object.entries(current).map(([key, point]) => [key, keys.includes(key) ? null : point]))));
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [band, setBand] = useState<Rect | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; keys: readonly string[] } | null>(null);
  const closeDesktopMenu = useCallback(() => setDesktopMenu(null), []);
  const drag = useRef<{ start: Point; origins: Map<string, Point>; moved: boolean; open?: () => void } | null>(null);

  const element = (key: string) => layer.current?.querySelector<HTMLElement>(`[data-icon="${CSS.escape(key)}"]`) ?? null;
  const box = (key: string): Rect | null => {
    const icon = element(key);
    return icon ? { x: icon.offsetLeft, y: icon.offsetTop, width: icon.offsetWidth, height: icon.offsetHeight } : null;
  };
  const clamp = useCallback((key: string, next: Point): Point => {
    const icon = layer.current?.querySelector<HTMLElement>(`[data-icon="${CSS.escape(key)}"]`), parent = layer.current;
    if (!icon || !parent) return next;
    return {
      x: Math.round(Math.min(Math.max(MARGIN, next.x), Math.max(MARGIN, parent.clientWidth - icon.offsetWidth - MARGIN))),
      y: Math.round(Math.min(Math.max(MARGIN, next.y), Math.max(MARGIN, parent.clientHeight - icon.offsetHeight - MARGIN))),
    };
  }, []);

  // Keep saved positions on screen when the area shrinks (not saved, so they return when it grows).
  useLayoutEffect(() => {
    const parent = layer.current;
    if (!parent || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => setPoints((current) =>
      Object.fromEntries(Object.entries(current).map(([key, point]) => [key, point && clamp(key, point)]))));
    observer.observe(parent);
    return () => observer.disconnect();
  }, [clamp]);

  // Rubber-band selection: a press on the bare desktop (the layer's parent) starts a dotted band.
  // Any other press outside the icons (a window, the map) deselects them, as in Win98.
  useEffect(() => {
    const area = layer.current?.parentElement;
    if (!area) return;
    const press = (event: globalThis.PointerEvent) => {
      const target = event.target as Element;
      if (target.closest?.('.desktop-icon, .map-context-menu')) return;
      const additive = event.ctrlKey || event.metaKey || event.shiftKey;
      if (target !== area || event.button !== 0) { setSelected(new Set()); return; }
      const origin = layer.current!.getBoundingClientRect();
      const start = { x: event.clientX - origin.left, y: event.clientY - origin.top };
      const before = additive ? selectedRef.current : new Set<string>();
      setSelected(before);
      const move = (moveEvent: globalThis.PointerEvent) => {
        const x = moveEvent.clientX - origin.left, y = moveEvent.clientY - origin.top;
        const rect = { x: Math.min(start.x, x), y: Math.min(start.y, y), width: Math.abs(x - start.x), height: Math.abs(y - start.y) };
        setBand(rect);
        const hit = iconsRef.current.filter((icon) => { const b = box(icon.storageKey); return b && overlaps(rect, b); }).map((icon) => icon.storageKey);
        setSelected(new Set([...before, ...hit]));
      };
      const up = () => {
        setBand(null);
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
      };
      event.preventDefault();
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    };
    // Right-clicking the bare desktop opens its own menu.
    const context = (event: globalThis.MouseEvent) => {
      if (event.target !== area && event.target !== layer.current) return;
      event.preventDefault();
      setSelected(new Set());
      setDesktopMenu({ x: event.clientX, y: event.clientY });
    };
    document.addEventListener('pointerdown', press, true);
    area.addEventListener('contextmenu', context);
    return () => { document.removeEventListener('pointerdown', press, true); area.removeEventListener('contextmenu', context); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const iconsRef = useRef(icons);
  iconsRef.current = icons;

  const down = (icon: DesktopShortcut) => (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    let group = selected;
    if (event.ctrlKey || event.metaKey) {
      // Ctrl+click toggles this icon without opening it.
      const toggled = new Set(selected);
      if (toggled.has(icon.storageKey)) toggled.delete(icon.storageKey); else toggled.add(icon.storageKey);
      setSelected(group = toggled);
    } else if (!selected.has(icon.storageKey)) {
      group = new Set([icon.storageKey]);
      setSelected(group);
    }
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const origins = new Map<string, Point>();
    for (const key of group.has(icon.storageKey) ? group : [icon.storageKey]) {
      const b = box(key);
      if (b) origins.set(key, { x: b.x, y: b.y });
    }
    drag.current = { start: { x: event.clientX, y: event.clientY }, origins, moved: false, open: event.ctrlKey || event.metaKey ? undefined : icon.open };
  };
  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const current = drag.current;
    if (!current) return;
    const dx = event.clientX - current.start.x, dy = event.clientY - current.start.y;
    if (!current.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    current.moved = true;
    setPoints((all) => {
      const next = { ...all };
      for (const [key, origin] of current.origins) next[key] = clamp(key, { x: origin.x + dx, y: origin.y + dy });
      return next;
    });
  };
  const up = () => {
    const current = drag.current;
    drag.current = null;
    if (!current) return;
    if (current.moved) setPoints((all) => {
      for (const key of current.origins.keys()) writePoint(key, all[key] ?? null);
      return all;
    });
    else current.open?.();
  };
  const keys = (icon: DesktopShortcut) => (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); icon.open(); }
  };
  const contextMenu = (icon: DesktopShortcut) => (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // Right-clicking an unselected icon selects it alone; a selected one keeps the whole selection.
    const group = selected.has(icon.storageKey) ? [...selected] : [icon.storageKey];
    if (!selected.has(icon.storageKey)) setSelected(new Set(group));
    setMenu({ x: event.clientX, y: event.clientY, keys: group });
  };

  /** Line Up Icons: forget every dragged position, back to the column down the left edge. */
  const lineUp = () => {
    for (const icon of icons) writePoint(icon.storageKey, null);
    setPoints(Object.fromEntries(icons.map((icon) => [icon.storageKey, null])));
  };
  const arrangeBy = (by: ArrangeBy) => {
    setArrange(by);
    lineUp();
  };
  const desktopMenuActions = (): MenuAction[] => [
    { label: 'Arrange Icons by Name', checked: arrange === 'name', run: () => arrangeBy('name') },
    { label: 'Arrange Icons by Type', checked: arrange === 'type', run: () => arrangeBy('type') },
    { label: 'Line Up Icons', run: lineUp },
    { label: 'Refresh', separator: true, run: () => {
      setRefreshing(true);
      setPoints((current) => Object.fromEntries(Object.entries(current).map(([key, point]) => [key, point && clamp(key, point)])));
    } },
    ...desktopActions.map((action, index) => index === 0 ? { ...action, separator: true } : action),
  ];
  const menuActions = (keys: readonly string[]): MenuAction[] => {
    const chosen = icons.filter((icon) => keys.includes(icon.storageKey));
    return [
      { label: 'Open', primary: true, run: () => chosen.forEach((icon) => icon.open()) },
      { label: 'Select All', separator: true, run: () => setSelected(new Set(icons.map((icon) => icon.storageKey))) },
      { label: 'Line Up Icons', run: lineUp },
      { label: chosen.length > 1 ? 'Reset Positions' : 'Reset Position', disabled: chosen.every((icon) => !points[icon.storageKey]), run: () => {
        for (const icon of chosen) writePoint(icon.storageKey, null);
        setPoints((all) => ({ ...all, ...Object.fromEntries(chosen.map((icon) => [icon.storageKey, null])) }));
      } },
    ];
  };

  return <div ref={layer} className={`desktop-icons${refreshing ? ' refreshing' : ''}`}>
    {icons.map((icon, slot) => {
      const point = points[icon.storageKey];
      return <button key={icon.storageKey} type="button" data-icon={icon.storageKey}
        className={`desktop-icon${selected.has(icon.storageKey) ? ' selected' : ''}`} title={`Open ${icon.label} (drag to move)`}
        style={point ? { left: point.x, top: point.y, right: 'auto' } : { '--slot': slot } as CSSProperties}
        onPointerDown={down(icon)} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { drag.current = null; }}
        onKeyDown={keys(icon)} onContextMenu={contextMenu(icon)} onDoubleClick={(event) => event.preventDefault()}>
        <span className="desktop-icon-image" aria-hidden="true">{icon.icon}</span>
        <span className="desktop-icon-label">{icon.label}</span>
      </button>;
    })}
    {band && <div className="desktop-band" aria-hidden="true" style={{ left: band.x, top: band.y, width: band.width, height: band.height }} />}
    {desktopMenu && <ContextMenu x={desktopMenu.x} y={desktopMenu.y} label="Desktop" actions={desktopMenuActions()} onClose={closeDesktopMenu} />}
    {menu && <ContextMenu x={menu.x} y={menu.y} label="Icon Actions" actions={menuActions(menu.keys)} onClose={(restoreFocus) => {
      setMenu(null);
      if (restoreFocus && menu.keys[0]) element(menu.keys[0])?.focus();
    }} />}
  </div>;
}
