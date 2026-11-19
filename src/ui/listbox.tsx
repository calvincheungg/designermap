import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/** Styled list and arrow keep the opened menu consistent across operating systems. */
export function SelectBox<T extends string | number>({ label, values, value, onChange, text = String, className }: {
  label: string; values: readonly T[]; value: T; onChange: (value: T) => void;
  /** Display text of a value (the value itself by default). */
  text?: (value: T) => string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(value);
  const [position, setPosition] = useState({ left: 0, top: 0, minWidth: 0, maxHeight: 240 });
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();
  const activeValue = values.includes(active) ? active : value;
  useLayoutEffect(() => {
    if (!open || !button.current) return;
    const rect = button.current.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - 8;
    const above = rect.top - 8;
    const height = Math.min(240, values.length * 24 + 2);
    const upwards = below < height && above > below;
    const maxHeight = Math.max(24, Math.min(height, upwards ? above : below));
    setPosition({ left: rect.left, top: upwards ? rect.top - maxHeight : rect.bottom, minWidth: rect.width, maxHeight });
  }, [open, values.length]);
  useLayoutEffect(() => {
    if (open) list.current?.querySelector('.active')?.scrollIntoView?.({ block: 'nearest' });
  }, [open, activeValue]);
  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (event.target instanceof Node && list.current?.contains(event.target)) return;
      setOpen(false);
    };
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close, true);
    return () => {
      window.removeEventListener('resize', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [open]);
  function pick(next: T) { onChange(next); setOpen(false); }
  return <>
    <button ref={button} type="button" className={className ? `w98-select ${className}` : 'w98-select'} role="combobox" aria-label={label}
      aria-haspopup="listbox" aria-controls={open ? id : undefined} aria-expanded={open}
      aria-activedescendant={open ? `${id}-${activeValue}` : undefined}
      onClick={() => { setActive(value); setOpen(!open); }} onBlur={() => setOpen(false)}
      onKeyDown={(event) => {
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
          const index = values.indexOf(open ? activeValue : value);
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? values.length - 1
            : Math.max(0, Math.min(values.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)));
          setActive(values[next]!); setOpen(true);
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (open) pick(activeValue);
          else { setActive(value); setOpen(true); }
        } else if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
        else if (event.key === 'Tab') setOpen(false);
      }}><span className="w98-select-text">
        {/* Every option (CSS-drawn, outside the text content) sits hidden in the same grid cell, so the button keeps its widest option's width. */}
        <span>{text(value)}</span>
        {values.map((option) => <span key={option} className="w98-select-sizer" data-text={text(option)} aria-hidden="true" />)}
      </span><span className="w98-select-arrow" aria-hidden="true" /></button>
    {open && createPortal(<ul id={id} ref={list} className="w98-listbox w98-select-options" role="listbox" aria-label={label}
      style={position}>
      {values.map((option) => <li key={option} id={`${id}-${option}`} role="option" aria-selected={option === value}
        className={option === activeValue ? 'active' : undefined} onMouseMove={() => setActive(option)}
        onMouseDown={(event) => event.preventDefault()} onClick={() => pick(option)}>{text(option)}</li>)}
    </ul>, document.body)}
  </>;
}

export interface ListItem<T> { label: string; aliases?: readonly string[]; hint?: string; value: T }
const words = (value: string) => value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const compact = (value: string) => words(value).join('');

/**
 * Ignore case, accents, punctuation and spaces; prefer prefix/word matches.
 * `exactFirst` lists exact names (or aliases) before them, as Run… needs.
 */
export function matchingItems<T>(items: readonly ListItem<T>[], query: string, limit = 60, exactFirst = false): ListItem<T>[] {
  const q = compact(query);
  if (!q) return items.slice(0, limit);
  const folded = items.map((item) => ({ item, terms: [item.label, ...(item.aliases ?? [])].map(words) }));
  const exact = exactFirst ? folded.filter(({ terms }) => terms.some((tokens) => tokens.join('') === q)) : [];
  const starts = folded.filter((item) => !exact.includes(item) && item.terms.some((tokens) => tokens.some((_, index) => tokens.slice(index).join('').startsWith(q))));
  const contains = folded.filter((item) => !exact.includes(item) && !starts.includes(item) && item.terms.some((tokens) => tokens.join('').includes(q)));
  return [...exact, ...starts, ...contains].slice(0, limit).map(({ item }) => item);
}

export function SearchBox<T>({ items, value, onChange, onPick, label = 'Find:', inputId = 'search', placeholder = 'House, person or group', limit = 60,
  previewAll = true, dropUp = false, exactFirst = false, icon, dropButton = false }: {
  items: readonly ListItem<T>[]; value: string; onChange: (value: string) => void; onPick: (item: ListItem<T>) => void;
  label?: string; inputId?: string; placeholder?: string;
  /** List every item while the box is empty; false shows suggestions only once the user types. */
  previewAll?: boolean;
  /** Open the suggestions above the box (for the taskbar). */
  dropUp?: boolean;
  /** Most options listed; Infinity lists them all (e.g. every brand in a city). */
  limit?: number;
  /** List exact name matches first (see matchingItems). */
  exactFirst?: boolean;
  /** Small icon drawn inside the box, left of the text (like a browser's address bar). */
  icon?: ReactNode;
  /** A drop-down arrow button that lists every option, even while the box is empty. */
  dropButton?: boolean;
}) {
  const [focused, setOpen] = useState(false);
  const [listAll, setListAll] = useState(false);
  const open = focused && (previewAll || listAll || !!value.trim());
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();
  const query = listAll ? '' : value;
  const matches = useMemo(() => matchingItems(items, query, limit, exactFirst), [items, query, limit, exactFirst]);
  const activeIndex = matches.length ? Math.min(active, matches.length - 1) : -1;
  useEffect(() => { setActive(0); }, [items, value]);
  useLayoutEffect(() => {
    if (open && activeIndex >= 0) list.current?.children[activeIndex]?.scrollIntoView?.({ block: 'nearest' });
  }, [open, activeIndex]);
  function pick(item: ListItem<T>) {
    onChange(item.label); setOpen(false); onPick(item); input.current?.blur();
  }
  return <div className="field-row"><label htmlFor={inputId}>{label}</label><div className={`w98-combo${icon ? ' has-icon' : ''}${dropButton ? ' has-drop' : ''}`}>
    {icon && <span className="w98-combo-icon" aria-hidden="true">{icon}</span>}
    <input id={inputId} ref={input} type="text" placeholder={placeholder} role="combobox" autoComplete="off"
      aria-autocomplete="list" aria-controls={id} aria-expanded={open} aria-activedescendant={open && activeIndex >= 0 ? `${id}-${activeIndex}` : undefined}
      value={value} onChange={(event) => { onChange(event.target.value); setListAll(false); setActive(0); setOpen(true); }}
      onFocus={(event) => { event.target.select(); setActive(0); setOpen(true); }} onBlur={() => { setOpen(false); setListAll(false); }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          if (!open) { setOpen(true); setActive(0); }
          else setActive(Math.max(0, Math.min(matches.length - 1, activeIndex + (event.key === 'ArrowDown' ? 1 : -1))));
        } else if (event.key === 'Enter' && open && matches[activeIndex]) {
          event.preventDefault(); pick(matches[activeIndex]);
        } else if (event.key === 'Escape') setOpen(false);
      }} />
    {dropButton && <button type="button" className="w98-combo-drop" tabIndex={-1} aria-label="Show all" aria-controls={id} aria-expanded={open}
      onMouseDown={(event) => {
        event.preventDefault();
        if (open) { setOpen(false); setListAll(false); input.current?.blur(); return; }
        setListAll(true); setActive(0); input.current?.focus(); setOpen(true);
      }} />}
    <ul id={id} ref={list} className={`w98-listbox${dropUp ? ' drop-up' : ''}`} role="listbox" hidden={!open} style={{ minWidth: input.current?.offsetWidth }}>
      {matches.length ? matches.map((item, index) => <li key={`${item.hint}:${item.label}`} id={`${id}-${index}`} role="option" aria-selected={index === activeIndex}
        className={index === activeIndex ? 'active' : undefined} onMouseDown={(event) => { event.preventDefault(); pick(item); }} onMouseMove={() => setActive(index)}>
        {item.label}{item.hint && <> <span className="hint">{item.hint}</span></>}
      </li>) : <li className="empty">No matches</li>}
    </ul>
  </div></div>;
}
