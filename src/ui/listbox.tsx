import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';

export interface ListItem<T> { label: string; aliases?: readonly string[]; hint?: string; value: T }
const words = (value: string) => value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const compact = (value: string) => words(value).join('');

/** Ignore case, accents, punctuation and spaces; prefer prefix/word matches. */
export function matchingItems<T>(items: readonly ListItem<T>[], query: string, limit = 60): ListItem<T>[] {
  const q = compact(query);
  if (!q) return items.slice(0, limit);
  const folded = items.map((item) => ({ item, terms: [item.label, ...(item.aliases ?? [])].map(words) }));
  const starts = folded.filter(({ terms }) => terms.some((tokens) => tokens.some((_, index) => tokens.slice(index).join('').startsWith(q))));
  const contains = folded.filter((item) => !starts.includes(item) && item.terms.some((tokens) => tokens.join('').includes(q)));
  return [...starts, ...contains].slice(0, limit).map(({ item }) => item);
}

export function SearchBox<T>({ items, value, onChange, onPick }: {
  items: readonly ListItem<T>[]; value: string; onChange: (value: string) => void; onPick: (item: ListItem<T>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();
  const matches = useMemo(() => matchingItems(items, value), [items, value]);
  const activeIndex = matches.length ? Math.min(active, matches.length - 1) : -1;
  useEffect(() => { setActive(0); }, [items, value]);
  useLayoutEffect(() => {
    if (open && activeIndex >= 0) list.current?.children[activeIndex]?.scrollIntoView?.({ block: 'nearest' });
  }, [open, activeIndex]);
  function pick(item: ListItem<T>) {
    onChange(item.label); setOpen(false); onPick(item); input.current?.blur();
  }
  return <div className="field-row"><label htmlFor="search">Find:</label><div className="w98-combo">
    <input id="search" ref={input} type="text" placeholder="House, person or group" role="combobox" autoComplete="off"
      aria-autocomplete="list" aria-controls={id} aria-expanded={open} aria-activedescendant={open && activeIndex >= 0 ? `${id}-${activeIndex}` : undefined}
      value={value} onChange={(event) => { onChange(event.target.value); setActive(0); setOpen(true); }}
      onFocus={(event) => { event.target.select(); setActive(0); setOpen(true); }} onBlur={() => setOpen(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          if (!open) { setOpen(true); setActive(0); }
          else setActive(Math.max(0, Math.min(matches.length - 1, activeIndex + (event.key === 'ArrowDown' ? 1 : -1))));
        } else if (event.key === 'Enter' && open && matches[activeIndex]) {
          event.preventDefault(); pick(matches[activeIndex]);
        } else if (event.key === 'Escape') setOpen(false);
      }} />
    <ul id={id} ref={list} className="w98-listbox" role="listbox" hidden={!open} style={{ minWidth: input.current?.offsetWidth }}>
      {matches.length ? matches.map((item, index) => <li key={`${item.hint}:${item.label}`} id={`${id}-${index}`} role="option" aria-selected={index === activeIndex}
        className={index === activeIndex ? 'active' : undefined} onMouseDown={(event) => { event.preventDefault(); pick(item); }} onMouseMove={() => setActive(index)}>
        {item.label}{item.hint && <> <span className="hint">{item.hint}</span></>}
      </li>) : <li className="empty">No matches</li>}
    </ul>
  </div></div>;
}
