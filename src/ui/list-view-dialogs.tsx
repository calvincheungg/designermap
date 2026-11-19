import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CUSTOM_OPS, type ColumnFilter, type ColumnInfo, type Condition, type CustomOp, type ListSort } from './list-view-data';

/** Pop-ups and dialogs of the List View workbook, after Excel 2000's. */

/* ---------- toolbar icons: 16×16 pixel art like Office 2000's ---------- */
export function SortIcon({ descending }: { descending: boolean }) {
  const [top, bottom] = descending ? ['Z', 'A'] : ['A', 'Z'];
  return <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
    <text x="0.5" y="7" fontSize="7.5" fontFamily="Arial, sans-serif" fontWeight="bold" fill="#0000c0">{top}</text>
    <text x="0.5" y="15" fontSize="7.5" fontFamily="Arial, sans-serif" fontWeight="bold" fill="#c00000">{bottom}</text>
    <rect x="11" y="2" width="1" height="10" fill="#000" />
    <path d="M8.5 10h6l-3 4z" fill="#000" />
  </svg>;
}
export function FunnelIcon({ clear = false }: { clear?: boolean }) {
  return <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
    <path d="M1 2h12l-4.5 5v6l-3-2V7z" fill="#ffff00" stroke="#000" strokeWidth="1" />
    {clear && <path d="M10 10l5 5M15 10l-5 5" stroke="#c00000" strokeWidth="1.6" />}
  </svg>;
}
/** File ▸ Save As: a floppy disk. */
export function SaveIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
    <path d="M1.5 1.5h11l2 2v11h-13z" fill="#000080" stroke="#000" />
    <rect x="4" y="2" width="7" height="5" fill="#fff" /><rect x="8" y="3" width="2" height="3" fill="#000080" />
    <rect x="3.5" y="9.5" width="9" height="5" fill="#c0c0c0" />
  </svg>;
}

export interface ListEntry { key: string; label: string; run: () => void }

/** Excel's AutoFilter drop-down (and in-cell lists): a short white list under the cell, Win98 listbox keys. */
export function DropList({ anchor, entries, selected, label = 'AutoFilter', onPick, onClose }: {
  anchor: DOMRect; entries: readonly ListEntry[]; selected: string; label?: string;
  onPick: () => void; onClose: () => void;
}) {
  const list = useRef<HTMLUListElement>(null);
  const [focus, setFocus] = useState(() => Math.max(0, entries.findIndex((entry) => entry.key === selected)));
  useLayoutEffect(() => {
    const element = list.current!;
    const below = window.innerHeight - anchor.bottom - 4;
    const up = below < Math.min(element.offsetHeight, 160) && anchor.top > below;
    element.style.left = `${Math.max(4, Math.min(anchor.left, window.innerWidth - element.offsetWidth - 4))}px`;
    element.style.top = `${up ? Math.max(4, anchor.top - element.offsetHeight) : anchor.bottom}px`;
    element.focus({ preventScroll: true });
  }, [anchor]);
  useLayoutEffect(() => { list.current?.children[focus]?.scrollIntoView?.({ block: 'nearest' }); }, [focus]);
  useEffect(() => {
    // The open arrow button toggles the list itself, so pressing it isn't an outside press.
    const outside = (event: PointerEvent) => { if (!list.current?.contains(event.target as Node) && !(event.target as Element).closest?.('.xl-dropdown-open')) onClose(); };
    const scroll = (event: Event) => { if (!list.current?.contains(event.target as Node)) onClose(); };
    document.addEventListener('pointerdown', outside, true);
    document.addEventListener('scroll', scroll, true);
    window.addEventListener('resize', onClose);
    window.addEventListener('blur', onClose);
    return () => {
      document.removeEventListener('pointerdown', outside, true);
      document.removeEventListener('scroll', scroll, true);
      window.removeEventListener('resize', onClose);
      window.removeEventListener('blur', onClose);
    };
  }, [onClose]);
  const pick = (index: number) => { onPick(); entries[index]?.run(); };
  return createPortal(<ul ref={list} className="xl-autofilter" role="listbox" aria-label={label} tabIndex={-1}
    aria-activedescendant={`xl-autofilter-${focus}`} style={{ minWidth: anchor.width }}
    onKeyDown={(event) => {
      const last = entries.length - 1;
      const next = { ArrowDown: Math.min(last, focus + 1), ArrowUp: Math.max(0, focus - 1), Home: 0, End: last, PageDown: Math.min(last, focus + 10), PageUp: Math.max(0, focus - 10) }[event.key];
      if (next !== undefined) { event.preventDefault(); setFocus(next); }
      else if (event.key === 'Enter') { event.preventDefault(); pick(focus); }
      else if (event.key === 'Escape' || event.key === 'Tab') { event.preventDefault(); onClose(); }
    }}>
    {entries.map((entry, index) => <li key={entry.key} id={`xl-autofilter-${index}`} role="option" aria-selected={entry.key === selected}
      className={index === focus ? 'focused' : undefined} onPointerEnter={() => setFocus(index)} onClick={() => pick(index)}>{entry.label}</li>)}
  </ul>, document.body);
}

/** A small modal Win98 dialog over the workbook; Escape or Cancel closes it. */
function Dialog({ title, id, onSubmit, onCancel, children }: { title: string; id: string; onSubmit: () => void; onCancel: () => void; children: ReactNode }) {
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => { form.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(); }, []);
  return <div className="xl-dialog-backdrop" onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onCancel(); } }}>
    <div className="window xl-dialog" role="dialog" aria-labelledby={id}>
      <div className="title-bar"><div className="title-bar-text" id={id}>{title}</div>
        <div className="title-bar-controls"><button className="close" aria-label={`Close ${title}`} onClick={onCancel} /></div></div>
      <form ref={form} className="window-body xl-dialog-body" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        {children}
        <div className="xl-dialog-buttons"><button type="submit">OK</button><button type="button" onClick={onCancel}>Cancel</button></div>
      </form>
    </div>
  </div>;
}

/** (Custom...): one or two conditions on one column, joined by And or Or, as in Excel 2000. */
export function CustomFilterDialog({ column, initial, suggestions, onApply, onCancel }: {
  column: ColumnInfo; initial?: ColumnFilter; suggestions: readonly string[];
  onApply: (filter: ColumnFilter) => void; onCancel: () => void;
}) {
  const start = initial?.kind === 'custom' ? initial : undefined;
  const [first, setFirst] = useState<Condition>(start?.conditions[0]
    ?? { op: column.numeric ? 'greaterOrEqual' : 'contains', operand: initial?.kind === 'value' ? initial.value : '' });
  const [second, setSecond] = useState<{ op: CustomOp | ''; operand: string }>(start?.conditions[1] ?? { op: '', operand: '' });
  const [join, setJoin] = useState<'and' | 'or'>(start?.join ?? 'and');
  const apply = () => onApply({ kind: 'custom', join, conditions: second.op ? [first, { op: second.op, operand: second.operand }] : [first] });
  const ops = CUSTOM_OPS.map(([value, label]) => <option key={value} value={value}>{label}</option>);
  return <Dialog title="Custom AutoFilter" id="xl-custom-title" onSubmit={apply} onCancel={onCancel}>
    <p>Show rows where:</p>
    <fieldset><legend>{column.label}</legend>
      <div className="field-row">
        <select aria-label="First comparison" value={first.op} onChange={(event) => setFirst({ ...first, op: event.target.value as CustomOp })}>{ops}</select>
        <input data-autofocus type="text" aria-label="First value" list="xl-custom-values" value={first.operand}
          onChange={(event) => setFirst({ ...first, operand: event.target.value })} />
      </div>
      <div className="field-row xl-join" role="radiogroup" aria-label="Join">
        {(['and', 'or'] as const).map((value) => <span key={value} className="field-row">
          <input type="radio" id={`xl-join-${value}`} name="xl-join" checked={join === value} onChange={() => setJoin(value)} />
          <label htmlFor={`xl-join-${value}`}>{value === 'and' ? 'And' : 'Or'}</label>
        </span>)}
      </div>
      <div className="field-row">
        <select aria-label="Second comparison" value={second.op} onChange={(event) => setSecond({ ...second, op: event.target.value as CustomOp | '' })}>
          <option value="" />{ops}
        </select>
        <input type="text" aria-label="Second value" list="xl-custom-values" value={second.operand} disabled={!second.op}
          onChange={(event) => setSecond({ ...second, operand: event.target.value })} />
      </div>
      <datalist id="xl-custom-values">{suggestions.slice(0, 500).map((value) => <option key={value} value={value} />)}</datalist>
    </fieldset>
    <p className="hint">Matching ignores case and accents.</p>
  </Dialog>;
}

/** (Top 10...): Show [Top|Bottom] [n] [Items|Percent] of a number column. */
export function TopTenDialog({ column, initial, onApply, onCancel }: {
  column: ColumnInfo; initial?: ColumnFilter; onApply: (filter: ColumnFilter) => void; onCancel: () => void;
}) {
  const start = initial?.kind === 'top' ? initial : undefined;
  const [bottom, setBottom] = useState(start?.bottom ?? false);
  const [amount, setAmount] = useState(String(start?.amount ?? 10));
  const [percent, setPercent] = useState(start?.percent ?? false);
  const value = Math.max(1, Math.min(percent ? 100 : 500, Math.round(Number(amount)) || 10));
  return <Dialog title="Top 10 AutoFilter" id="xl-top-title" onSubmit={() => onApply({ kind: 'top', bottom, amount: value, percent })} onCancel={onCancel}>
    <fieldset><legend>Show ({column.label})</legend>
      <div className="field-row">
        <select aria-label="Top or bottom" value={bottom ? 'bottom' : 'top'} onChange={(event) => setBottom(event.target.value === 'bottom')}>
          <option value="top">Top</option><option value="bottom">Bottom</option>
        </select>
        <input data-autofocus type="number" aria-label="Amount" min={1} max={percent ? 100 : 500} value={amount} onChange={(event) => setAmount(event.target.value)} />
        <select aria-label="Items or percent" value={percent ? 'percent' : 'items'} onChange={(event) => setPercent(event.target.value === 'percent')}>
          <option value="items">Items</option><option value="percent">Percent</option>
        </select>
      </div>
    </fieldset>
    <p className="hint">Ties with the last value are kept.</p>
  </Dialog>;
}

/** Data ▸ Sort…: Sort by / Then by / Then by, each Ascending or Descending. */
export function SortDialog({ columns, sort, onApply, onCancel }: {
  columns: readonly ColumnInfo[]; sort: ListSort; onApply: (sort: ListSort) => void; onCancel: () => void;
}) {
  const [keys, setKeys] = useState(() => [0, 1, 2].map((i) => sort[i] ?? { column: '', descending: false }));
  const set = (i: number, change: Partial<(typeof keys)[number]>) => setKeys((current) => current.map((key, j) => j === i ? { ...key, ...change } : key));
  const apply = () => {
    const chosen = keys.filter((key) => key.column);
    onApply(chosen.filter((key, i) => chosen.findIndex((other) => other.column === key.column) === i));
  };
  return <Dialog title="Sort" id="xl-sort-title" onSubmit={apply} onCancel={onCancel}>
    {keys.map((key, i) => {
      const name = i === 0 ? 'Sort by' : 'Then by';
      return <fieldset key={i} className="xl-sort-key"><legend>{name}</legend>
        <select data-autofocus={i === 0 ? true : undefined} aria-label={`${name} ${i + 1}`} value={key.column} onChange={(event) => set(i, { column: event.target.value })}>
          {i > 0 && <option value="">(none)</option>}
          {columns.map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}
        </select>
        <div className="xl-sort-direction">
          {([false, true] as const).map((descending) => <div className="field-row" key={String(descending)}>
            <input type="radio" id={`xl-sort-${i}-${descending}`} name={`xl-sort-${i}`} checked={key.descending === descending}
              disabled={!key.column} onChange={() => set(i, { descending })} />
            <label htmlFor={`xl-sort-${i}-${descending}`}>{descending ? 'Descending' : 'Ascending'}</label>
          </div>)}
        </div>
      </fieldset>;
    })}
  </Dialog>;
}

/** The status bar's zoom: a slider in a small pop-up above the zoom field, with the presets as quick picks. */
export function ZoomSlider({ anchor, value, min, max, presets, onChange, onClose }: {
  anchor: DOMRect; value: number; min: number; max: number; presets: readonly number[];
  onChange: (value: number) => void; onClose: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = box.current!;
    element.style.left = `${Math.max(4, Math.min(anchor.right - element.offsetWidth, window.innerWidth - element.offsetWidth - 4))}px`;
    element.style.top = `${Math.max(4, anchor.top - element.offsetHeight - 2)}px`;
    element.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
  }, [anchor]);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!box.current?.contains(event.target as Node) && !(event.target as Element).closest?.('.xl-dropdown-open')) onClose(); };
    document.addEventListener('pointerdown', outside, true);
    window.addEventListener('resize', onClose);
    return () => { document.removeEventListener('pointerdown', outside, true); window.removeEventListener('resize', onClose); };
  }, [onClose]);
  return createPortal(<div ref={box} className="window xl-zoom-slider" role="dialog" aria-label="Zoom"
    onKeyDown={(event) => { if (event.key === 'Escape' || event.key === 'Enter') { event.preventDefault(); onClose(); } }}>
    <div className="xl-zoom-slider-body">
      <div className="xl-zoom-slider-value" aria-hidden="true">{value}%</div>
      <input type="range" aria-label="Zoom level" min={min} max={max} step={5} value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <div className="xl-zoom-slider-scale" aria-hidden="true"><span>{min}%</span><span>{max}%</span></div>
      <div className="xl-zoom-presets">{presets.map((preset) => <button type="button" key={preset} aria-pressed={preset === value}
        onClick={() => onChange(preset)}>{preset}%</button>)}</div>
    </div>
  </div>, document.body);
}
