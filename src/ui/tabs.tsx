import { useId, useState, type ReactNode } from 'react';
import { oneOf, useSetting } from './storage';

/** Win98 tabs, remembering the last one open. A panel mounts when first opened and stays mounted, so its state survives switching. */
export function Tabs<T extends string>({ label, tabs, storageKey, panels }: {
  label: string; tabs: readonly (readonly [T, string])[]; storageKey: string; panels: Record<T, () => ReactNode>;
}) {
  const id = useId();
  const [tab, setTab] = useSetting<T>(storageKey, oneOf(tabs.map(([key]) => key)), tabs[0]![0]);
  const [visited, setVisited] = useState<readonly T[]>([tab]);
  const pick = (next: T) => {
    setTab(next);
    setVisited((keys) => keys.includes(next) ? keys : [...keys, next]);
  };
  return <div className="win-tabs">
    <menu role="tablist" aria-label={label} onKeyDown={(event) => {
      const at = tabs.findIndex(([key]) => key === tab);
      const to = event.key === 'ArrowRight' ? (at + 1) % tabs.length : event.key === 'ArrowLeft' ? (at + tabs.length - 1) % tabs.length
        : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
      if (to < 0) return;
      event.preventDefault();
      pick(tabs[to]![0]);
      (event.currentTarget.children[to] as HTMLElement).focus();
    }}>{tabs.map(([key, text]) => <li key={key} role="tab" id={`${id}-${key}-tab`} aria-controls={`${id}-${key}`} aria-selected={key === tab}
      tabIndex={key === tab ? 0 : -1} onClick={() => pick(key)}>{text}</li>)}</menu>
    {tabs.filter(([key]) => visited.includes(key)).map(([key]) => <div key={key} role="tabpanel" className="win-tabpanel" id={`${id}-${key}`}
      aria-labelledby={`${id}-${key}-tab`} hidden={key !== tab}>{panels[key]()}</div>)}
  </div>;
}
