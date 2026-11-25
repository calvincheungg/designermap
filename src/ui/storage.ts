import { useEffect, useRef, useState } from 'react';

/**
 * Settings remembered in this browser (localStorage). Storage can be missing,
 * full or blocked, so reads fall back and writes may quietly do nothing.
 */

/** A stored value; `parse` returns undefined for one that no longer fits. */
export function readSetting<T>(key: string, parse: (stored: string) => T | undefined, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? fallback : parse(stored) ?? fallback;
  } catch { return fallback; }
}
/** Remember a value, or forget it with null. */
export function writeSetting(key: string, value: string | null) {
  try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value); } catch { /* storage unavailable */ }
}
export const readText = (key: string) => readSetting<string | null>(key, (stored) => stored, null);
/** Stored JSON; undefined when missing or corrupt. Check its shape before using it. */
export const readJson = (key: string): unknown => readSetting<unknown>(key, (stored) => JSON.parse(stored) as unknown, undefined);
export const writeJson = (key: string, value: unknown) => writeSetting(key, JSON.stringify(value));

/* Session storage: kept through a refresh of this tab, forgotten when it closes. */
export function readSessionJson(key: string): unknown {
  try { return JSON.parse(sessionStorage.getItem(key) ?? 'null') as unknown; } catch { return undefined; }
}
export function writeSession(key: string, value: string | null) {
  try { if (value === null) sessionStorage.removeItem(key); else sessionStorage.setItem(key, value); } catch { /* storage unavailable */ }
}

/* Settings cleared from outside the component that holds them (Settings ▸ Saved data). */
const clearListeners = new Set<(keys: readonly string[]) => void>();
/** Forget these values and tell whatever is showing them. */
export function clearSettings(keys: readonly string[]) {
  for (const key of keys) writeSetting(key, null);
  for (const listener of [...clearListeners]) listener(keys);
}
export function useSettingsCleared(listener: (keys: readonly string[]) => void) {
  const latest = useRef(listener);
  latest.current = listener;
  useEffect(() => {
    const call = (keys: readonly string[]) => latest.current(keys);
    clearListeners.add(call);
    return () => { clearListeners.delete(call); };
  }, []);
}
export function storedKeys(prefix: string): string[] {
  try { return Object.keys(localStorage).filter((key) => key.startsWith(prefix)); } catch { return []; }
}

/** State that is remembered whenever it changes. */
export function useSetting<T>(key: string, parse: (stored: string) => T | undefined, fallback: T, format: (value: T) => string = String) {
  const [value, setValue] = useState<T>(() => readSetting(key, parse, fallback));
  const text = format(value);
  useEffect(() => writeSetting(key, text), [key, text]);
  useSettingsCleared((keys) => { if (keys.includes(key)) setValue(fallback); });
  return [value, setValue] as const;
}
/** One of a fixed list of values. */
export const oneOf = <T extends string | number>(values: readonly T[]) => (stored: string) => values.find((value) => String(value) === stored);
/** An on-by-default switch. */
export const useSwitch = (key: string) => useSetting<boolean>(key, (stored) => stored !== 'off', true, (on) => on ? 'on' : 'off');
