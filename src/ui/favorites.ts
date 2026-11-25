import { createContext } from 'react';
import type { MenuAction } from './context-menu';
import { isSelectionItem } from './desktop';
import type { Selection } from './panel';
import { isRecentItem, itemExists } from './recent';
import { readJson, writeJson } from './storage';

/** Explorer ▸ Favorites: brands, designers and groups kept in this browser, in the order added. */
export type Favorite = NonNullable<Selection>;
const FAVORITES_KEY = 'designer-map:favorites';

/** Saved favorites, dropping anything malformed, repeated or no longer in the data. */
export function readFavorites(): Favorite[] {
  const value = readJson(FAVORITES_KEY);
  const items = (Array.isArray(value) ? value : []).filter(isRecentItem).filter(itemExists).filter((item) => isSelectionItem(item)) as Favorite[];
  return items.filter((item, i) => items.findIndex((other) => sameFavorite(item, other)) === i);
}
export const saveFavorites = (list: readonly Favorite[]) => writeJson(FAVORITES_KEY, list.map(({ kind, id }) => ({ kind, id })));
export const sameFavorite = (a: Favorite, b: Favorite) => a.kind === b.kind && a.id === b.id;

export interface Favorites { has: (item: Favorite) => boolean; set: (items: readonly Favorite[], on: boolean) => void }
export const FavoritesContext = createContext<Favorites | null>(null);
/** A menu command that adds these items to Favorites, or removes them when all are there already. */
export function favoriteAction(favorites: Favorites | null, items: readonly Favorite[]): MenuAction[] {
  if (!favorites || !items.length) return [];
  const on = items.every(favorites.has);
  return [{ label: on ? 'Remove from Favorites' : 'Add to Favorites', run: () => favorites.set(items, !on) }];
}
