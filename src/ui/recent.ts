import { readJson, writeJson } from './storage';
import { cities } from '../data/cities';
import { countryNames, getDesigner, getGroup, getHouse, type CountryCode } from '../data';
import type { Place, Selection } from './panel';

/** The Start menu's Documents: the brands, designers, groups and places opened most recently. */
export type RecentItem = NonNullable<Selection> | Place;
export const RECENT_KEY = 'designer-map:recent';
export const MAX_RECENT = 10;

export const itemExists = (item: RecentItem) => item.kind === 'house' ? !!getHouse(item.id)
  : item.kind === 'designer' ? !!getDesigner(item.id)
  : item.kind === 'group' ? !!getGroup(item.id)
  : item.kind === 'city' ? Object.hasOwn(cities, item.id)
  : Object.hasOwn(countryNames, item.id);

export const isRecentItem = (value: unknown): value is RecentItem => {
  if (!value || typeof value !== 'object') return false;
  const { kind, id } = value as { kind?: unknown; id?: unknown };
  return typeof id === 'string' && ['house', 'designer', 'group', 'city', 'country'].includes(kind as string);
};

/** Saved recents, dropping anything malformed or no longer in the data. */
export function readRecent(): RecentItem[] {
  const value = readJson(RECENT_KEY);
  return Array.isArray(value) ? value.filter(isRecentItem).filter(itemExists).slice(0, MAX_RECENT) : [];
}

export function saveRecent(list: readonly RecentItem[]) {
  writeJson(RECENT_KEY, list.map(({ kind, id }) => ({ kind, id })));
}

/** Move `item` to the front, keeping at most MAX_RECENT entries. Returns the same list when nothing changes. */
export function addRecent(list: readonly RecentItem[], item: RecentItem): readonly RecentItem[] {
  if (list[0]?.kind === item.kind && list[0].id === item.id) return list;
  return [item, ...list.filter((r) => r.kind !== item.kind || r.id !== item.id)].slice(0, MAX_RECENT);
}

export function recentLabel(item: RecentItem): string {
  switch (item.kind) {
    case 'house': return getHouse(item.id)?.name ?? item.id;
    case 'designer': return getDesigner(item.id)?.name ?? item.id;
    case 'group': return getGroup(item.id)?.name ?? item.id;
    case 'city': return item.id;
    case 'country': return countryNames[item.id as CountryCode];
  }
}
