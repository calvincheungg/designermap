import type { ScreenBox } from '../graph/graph';
import type { Place, Selection } from './panel';

/** Brand and group Properties windows open at once. */
export const MAX_PROPERTY_WINDOWS = 10;
/** Designer Properties windows open at once, counted separately from brands. */
export const MAX_DESIGNER_WINDOWS = 10;
/** City and country windows open at once, counted separately from Properties. */
export const MAX_LOCATION_WINDOWS = 10;

/** Single-instance tool windows: Statistics, the Recycle Bin of ended brands, the What's Missing report, Help, Run, the List View sheet, Settings, My Computer and Notepad. */
export type ToolId = 'stats' | 'recycle' | 'missing' | 'help' | 'run' | 'list' | 'settings' | 'computer' | 'notepad';
export type ToolItem = { kind: 'tool'; id: ToolId };
export const tool = (id: ToolId): ToolItem => ({ kind: 'tool', id });
export const STATISTICS = tool('stats');
export const HELP = tool('help');
export const RUN = tool('run');
export const LIST_VIEW = tool('list');
export const SETTINGS = tool('settings');
export const MY_COMPUTER = tool('computer');
export const NOTEPAD = tool('notepad');
/** A map selection shown in Properties, a city's brand grid, or a tool window. */
export type Item = NonNullable<Selection> | Place | ToolItem;
/** City and country windows: grids of brands, not map selections. */
export const isPlace = (item: Item): item is Place => item.kind === 'city' || item.kind === 'country';
export const isTool = (item: Item): item is ToolItem => item.kind === 'tool';
/** Brand, designer and group windows: the ones that follow (and drive) the map selection. */
export const isSelectionItem = (item: Item): item is NonNullable<Selection> => !isPlace(item) && !isTool(item);
/** Window types: each has its own limit, cascade and taskbar button. Each tool is its own type. */
export type WindowType = 'brand' | 'designer' | 'place' | ToolId;
export const windowType = (item: Item): WindowType => isPlace(item) ? 'place' : isTool(item) ? item.id : item.kind === 'designer' ? 'designer' : 'brand';
const limitFor = (item: Item) => isTool(item) ? 1 : ({ brand: MAX_PROPERTY_WINDOWS, designer: MAX_DESIGNER_WINDOWS, place: MAX_LOCATION_WINDOWS } as const)[windowType(item) as 'brand' | 'designer' | 'place'];
/** Designer windows cascade on past the brand windows instead of opening on top of them. */
const firstSlot = (item: Item) => windowType(item) === 'designer' ? MAX_PROPERTY_WINDOWS + 1 : 1;
const sameCategory = (a: Item, b: Item) => windowType(a) === windowType(b);
export interface PropertyWindow {
  key: string; item: Item; minimized: boolean;
  /** Filling the desktop area (Maximize, or a double-click on the title bar); kept while minimized. */
  maximized?: boolean;
  /** Bumped when the window is reused for another item, so its sections reset. */
  revision: number;
  /** Cascade position (1–3, designers 4–6), kept while the window stays open. */
  slot: number;
  /** What the window was opened from (a city pin, in viewport pixels): it opens beside it instead of cascading. */
  anchor?: ScreenBox;
}
export interface Desk {
  windows: PropertyWindow[];
  /** Stacking order of window keys, bottom first. */
  order: string[];
  active: string | null;
  nextKey: number;
}

export const sameItem = (a: Item | null | undefined, b: Item | null | undefined) =>
  a === b || (!!a && !!b && a.kind === b.kind && a.id === b.id);

export function initialDesk(): Desk {
  return { windows: [], order: [], active: null, nextKey: 1 };
}

export const windowFor = (desk: Desk, key: string | null) => desk.windows.find((w) => w.key === key);
const isOpen = (desk: Desk, key: string) => !!windowFor(desk, key);
const isMinimized = (desk: Desk, key: string) => !!windowFor(desk, key)?.minimized;

/** Bring a window to the front, restore it if minimized, and make it active. */
export function focusWindow(desk: Desk, key: string): Desk {
  if (!isOpen(desk, key)) return desk;
  return {
    ...desk,
    order: [...desk.order.filter((k) => k !== key), key],
    active: key,
    windows: desk.windows.map((w) => w.key === key && w.minimized ? { ...w, minimized: false } : w),
  };
}

/**
 * Show an item: focus its window if one is open, else open a new one. With
 * three of that kind (Properties or city) already open, the least recently
 * used window of the same kind is reused.
 */
export const openItem = (desk: Desk, item: Item): Desk => openItemAt(desk, item);

/** `openItem`, placing a newly opened (or reused) window beside `anchor` instead of cascading it. */
export function openItemAt(desk: Desk, item: Item, anchor?: ScreenBox): Desk {
  const existing = desk.windows.find((w) => sameItem(w.item, item));
  if (existing) return focusWindow(desk, existing.key);
  const peers = desk.windows.filter((w) => sameCategory(w.item, item));
  if (peers.length < limitFor(item)) {
    const used = new Set(peers.map((w) => w.slot));
    const first = firstSlot(item);
    const slot = Array.from({ length: limitFor(item) }, (_, i) => first + i).find((n) => !used.has(n)) ?? first + peers.length;
    const key = `props-${desk.nextKey}`;
    return focusWindow({ ...desk, nextKey: desk.nextKey + 1, windows: [...desk.windows, { key, item, minimized: false, revision: 0, slot, anchor }], order: [...desk.order, key] }, key);
  }
  const reuse = desk.order.find((k) => peers.some((w) => w.key === k))!;
  return focusWindow({
    ...desk,
    windows: desk.windows.map((w) => w.key === reuse ? { ...w, item, minimized: false, revision: w.revision + 1, anchor } : w),
  }, reuse);
}

/** Place an open window beside `anchor` (viewport pixels), e.g. once the map knows where a brand's city is. */
export function anchorWindow(desk: Desk, key: string, anchor: ScreenBox): Desk {
  return windowFor(desk, key) ? { ...desk, windows: desk.windows.map((w) => w.key === key ? { ...w, anchor } : w) } : desk;
}

/** The topmost open, unminimized window after `key` leaves the stack. */
function nextActive(desk: Desk, key: string): string | null {
  return [...desk.order].reverse().find((k) => k !== key && isOpen(desk, k) && !isMinimized(desk, k)) ?? null;
}

export function closeWindow(desk: Desk, key: string): Desk {
  const active = desk.active === key ? nextActive(desk, key) : desk.active;
  return { ...desk, windows: desk.windows.filter((w) => w.key !== key), order: desk.order.filter((k) => k !== key), active };
}

export function minimizeWindow(desk: Desk, key: string): Desk {
  const active = desk.active === key ? nextActive(desk, key) : desk.active;
  return { ...desk, windows: desk.windows.map((w) => w.key === key ? { ...w, minimized: true } : w), active };
}

/** Maximize / Restore: fill the desktop area, or go back to the window's own placement. */
export function toggleMaximized(desk: Desk, key: string): Desk {
  if (!windowFor(desk, key)) return desk;
  return focusWindow({ ...desk, windows: desk.windows.map((w) => w.key === key ? { ...w, maximized: !w.maximized } : w) }, key);
}

/** Win98 taskbar: restore a minimized window, minimize the active one, otherwise focus it. */
export function toggleTask(desk: Desk, key: string): Desk {
  if (desk.active === key && !isMinimized(desk, key)) return minimizeWindow(desk, key);
  return focusWindow(desk, key);
}

/** Taskbar group commands: apply one window command to several windows in turn. */
export const restoreWindows = (desk: Desk, keys: readonly string[]) => keys.reduce(focusWindow, desk);
export const minimizeWindows = (desk: Desk, keys: readonly string[]) => keys.reduce(minimizeWindow, desk);
export const closeWindows = (desk: Desk, keys: readonly string[]) => keys.reduce(closeWindow, desk);

/** Close windows whose item the year or tag filters now hide. */
export function retainItems(desk: Desk, visible: (item: Item) => boolean): Desk {
  const hidden = desk.windows.filter((w) => !visible(w.item));
  return hidden.length ? hidden.reduce((current, w) => closeWindow(current, w.key), desk) : desk;
}
