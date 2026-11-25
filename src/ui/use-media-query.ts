import { useCallback, useSyncExternalStore } from 'react';

/** Whether a media query matches, followed as it changes. */
export function useMediaQuery(query: string) {
  const subscribe = useCallback((changed: () => void) => {
    const list = window.matchMedia?.(query);
    list?.addEventListener?.('change', changed);
    return () => list?.removeEventListener?.('change', changed);
  }, [query]);
  return useSyncExternalStore(subscribe, () => !!window.matchMedia?.(query).matches);
}
