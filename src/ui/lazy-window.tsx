import { useEffect, useState, type ComponentType } from 'react';

const preloads: (() => Promise<unknown>)[] = [];

/**
 * A window's content in its own download, fetched when it first opens or by
 * `preloadWindows` once the map is up (after which it opens at once).
 */
export function lazyWindow<P extends object>(load: () => Promise<ComponentType<P>>): ComponentType<P> {
  let loaded: ComponentType<P> | undefined;
  let pending: Promise<void> | undefined;
  const preload = () => pending ??= load().then((component) => { loaded = component; }, (error: unknown) => { pending = undefined; throw error; });
  preloads.push(preload);
  return function LazyWindow(props: P) {
    const [, redraw] = useState(0);
    const [failed, setFailed] = useState(false);
    const [attempt, setAttempt] = useState(0);
    useEffect(() => {
      if (loaded) return;
      let open = true;
      preload().then(() => { if (open) redraw((n) => n + 1); }, () => { if (open) setFailed(true); });
      return () => { open = false; };
    }, [attempt]);
    const Content = loaded;
    if (Content) return <Content {...props} />;
    // A failed download is usually a lost connection, or an old tab after a new release.
    return failed ? <p className="hint" role="alert">This window could not be loaded. <button type="button" onClick={() => { setFailed(false); setAttempt((n) => n + 1); }}>Try again</button></p>
      : <p className="hint">Loading…</p>;
  };
}

/** Fetch every lazy window; ones that fail are tried again when opened. */
export const preloadWindows = () => Promise.allSettled(preloads.map((preload) => preload()));

/** Run once the browser is idle (or shortly, where it can't say). */
export function whenIdle(run: () => void): () => void {
  if (typeof requestIdleCallback === 'function') { const id = requestIdleCallback(run, { timeout: 5000 }); return () => cancelIdleCallback(id); }
  const id = window.setTimeout(run, 1500);
  return () => clearTimeout(id);
}
