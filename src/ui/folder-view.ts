import { createContext, useContext, useState } from 'react';
import { oneOf, useSetting } from './storage';

export const FOLDER_VIEWS = [['icons', 'Large Icons'], ['details', 'Details']] as const;
export type FolderView = typeof FOLDER_VIEWS[number][0];
/** Settings ▸ Open folders as: each kind of window's last view, or always the same one. */
export type FolderViewPreference = 'last' | FolderView;
export const FolderViewContext = createContext<FolderViewPreference>('last');

/** A folder-like window's view. With a fixed preference, a change in the window lasts until it closes. */
export function useFolderView(key: string): readonly [FolderView, (view: FolderView) => void] {
  const preference = useContext(FolderViewContext);
  const [last, setLast] = useSetting<FolderView>(key, oneOf(FOLDER_VIEWS.map(([view]) => view)), 'icons');
  const [own, setOwn] = useState<{ preference: FolderView; view: FolderView } | null>(null);
  if (preference === 'last') return [last, setLast];
  return [own?.preference === preference ? own.view : preference, (view) => setOwn({ preference, view })];
}
