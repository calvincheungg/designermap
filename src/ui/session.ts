import { awardInfo, type AwardId } from '../data/awards';
import type { ConnectionFilter, MapViewState } from '../graph/graph';
import { initialDesk, isSelectionItem, sameItem, type Desk, type Item, type PropertyWindow, type ToolId } from './desktop';
import type { Selection } from './panel';
import { isRecentItem, itemExists } from './recent';
import type { WindowRect } from './side-panel';
import { readJson, readSessionJson, readText, writeSession, writeSetting } from './storage';

/**
 * What a page refresh keeps: the open windows (place, size, stacking), Explorer's
 * state, the selection and the map view. Kept in sessionStorage, so it belongs to
 * this tab and a new visit starts afresh, unless Settings ▸ When I come back keeps a
 * copy in localStorage too. The year and filters are in the URL.
 */
export interface Session {
  desk: Desk;
  /** Windows the user moved or resized, by key; the others open at their usual places. */
  rects: Readonly<Record<string, WindowRect>>;
  selection: Selection;
  mapState: 'open' | 'minimized' | 'closed';
  connectionFilter: ConnectionFilter;
  map?: MapViewState;
  /** Brought back from an earlier visit rather than a refresh. */
  lastVisit?: true;
}
const SESSION_KEY = 'designer-map:session';
const LAST_VISIT_KEY = 'designer-map:last-session';
export const STARTUP_KEY = 'designer-map:startup';
export type Startup = 'fresh' | 'restore';
const restoring = () => readText(STARTUP_KEY) === 'restore';
const TOOLS: Record<ToolId, true> = { stats: true, recycle: true, missing: import.meta.env.DEV as true, help: true, run: true, list: true, settings: true, computer: true, notepad: true };

const record = (value: unknown): Record<string, unknown> => value && typeof value === 'object' ? value as Record<string, unknown> : {};
const numbers = (value: unknown, keys: readonly string[]) => keys.every((key) => Number.isFinite(record(value)[key]));
/** An item that still exists, or undefined (a brand removed since, say). */
function validItem(value: unknown): Item | undefined {
  const { kind, id } = record(value);
  if (kind === 'award') return typeof id === 'string' && Object.hasOwn(awardInfo, id) ? { kind, id: id as AwardId } : undefined;
  if (kind === 'tool') return typeof id === 'string' && Object.hasOwn(TOOLS, id) && TOOLS[id as ToolId] ? { kind, id: id as ToolId } : undefined;
  return isRecentItem(value) && itemExists(value) ? { kind: value.kind, id: value.id } as Item : undefined;
}

export function validDesk(value: unknown): Desk {
  const { windows, order, active } = record(value);
  const kept: PropertyWindow[] = [];
  for (const entry of Array.isArray(windows) ? windows : []) {
    const { key, slot, anchor, minimized, maximized } = record(entry), item = validItem(record(entry).item);
    if (!item || typeof key !== 'string' || !/^props-\d+$/.test(key) || kept.some((w) => w.key === key || sameItem(w.item, item))) continue;
    kept.push({ key, item, minimized: minimized === true, ...(maximized === true ? { maximized } : {}), revision: 0, slot: Number.isInteger(slot) ? slot as number : 1,
      ...(numbers(anchor, ['left', 'top', 'right', 'bottom']) ? { anchor: anchor as PropertyWindow['anchor'] } : {}) });
  }
  if (!kept.length) return initialDesk();
  const keys = kept.map((w) => w.key);
  const stacked = [...new Set((Array.isArray(order) ? order : []).filter((key): key is string => keys.includes(key as string)))];
  return {
    windows: kept, order: [...stacked, ...keys.filter((key) => !stacked.includes(key))],
    active: kept.some((w) => w.key === active && !w.minimized) ? active as string : null,
    nextKey: Math.max(...keys.map((key) => Number(key.slice('props-'.length)))) + 1,
  };
}

/** This tab's last session or, if wanted, the last visit's (a shared link opens on its own instead). */
export function readSession(): Session | undefined {
  const refreshed = parseSession(readSessionJson(SESSION_KEY));
  if (refreshed || !restoring() || location.hash) return refreshed;
  const last = parseSession(readJson(LAST_VISIT_KEY));
  return last && { ...last, lastVisit: true };
}
/** A saved session, dropping anything malformed or gone from the data. */
function parseSession(saved: unknown): Session | undefined {
  if (!saved || typeof saved !== 'object') return undefined;
  const { desk: savedDesk, rects, selection, mapState, connectionFilter, map } = record(saved);
  const desk = validDesk(savedDesk), item = validItem(selection), view = record(map);
  return {
    desk,
    rects: Object.fromEntries(Object.entries(record(rects)).filter(([key, rect]) => desk.windows.some((w) => w.key === key) && numbers(rect, ['x', 'y', 'width', 'height']))) as Record<string, WindowRect>,
    selection: item && isSelectionItem(item) ? item : null,
    mapState: mapState === 'minimized' || mapState === 'closed' ? mapState : 'open',
    connectionFilter: connectionFilter === 'designers' || connectionFilter === 'collaborations' ? connectionFilter : 'all',
    ...(numbers(view, ['zoom', 'x', 'y']) && (view.zoom as number) > 0 ? { map: { zoom: view.zoom as number, x: view.x as number, y: view.y as number,
      open: Array.isArray(view.open) ? view.open.filter((city): city is string => typeof city === 'string') : [] } } : {}),
  };
}

/** Remember the session. A moved window's own place replaces what it opened beside. */
export function writeSessionState({ desk, rects, ...rest }: Session) {
  const windows = desk.windows.map(({ key, item, minimized, maximized, slot, anchor }) => ({ key, item, minimized, maximized, slot, anchor: rects[key] ? undefined : anchor }));
  const text = JSON.stringify({ desk: { windows, order: desk.order, active: desk.active }, rects, ...rest });
  writeSession(SESSION_KEY, text);
  writeSetting(LAST_VISIT_KEY, restoring() ? text : null);
}
