import { useEffect, useState } from 'react';
import type { Selection } from './panel';

type Item = NonNullable<Selection>;
const LIMIT = 50;
const same = (a: Item | undefined, b: Item) => a?.kind === b.kind && a.id === b.id;

/** Explorer's Back and Forward through what was selected, passing over items the year or filters hide. */
export function useSelectionHistory(selection: Selection, canOpen: (item: Item) => boolean, open: (item: Item) => void) {
  const [{ list, index }, setHistory] = useState<{ list: readonly Item[]; index: number }>({ list: [], index: -1 });
  useEffect(() => {
    if (!selection) return;
    setHistory((current) => {
      if (same(current.list[current.index], selection)) return current;
      const next = [...current.list.slice(0, current.index + 1), selection].slice(-LIMIT);
      return { list: next, index: next.length - 1 };
    });
  }, [selection]);
  const step = (delta: 1 | -1) => {
    // With nothing selected, Back returns to the last selection.
    for (let i = !selection && delta < 0 ? index : index + delta; i >= 0 && i < list.length; i += delta) if (canOpen(list[i]!)) return i;
    return undefined;
  };
  const go = (to: number | undefined) => {
    if (to === undefined) return undefined;
    return () => { setHistory((current) => ({ ...current, index: to })); open(list[to]!); };
  };
  return { back: go(step(-1)), forward: go(step(1)) };
}
