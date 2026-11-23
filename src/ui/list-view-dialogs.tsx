import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CUSTOM_OPS, FORMAT_COLORS, SUBTOTAL_FNS, type CellFormat, type FindOptions, type SubtotalFn, type Subtotals, type ColumnFilter, type ColumnInfo, type Condition, type CustomOp, type ListSort } from './list-view-data';

/** Pop-ups and dialogs of the Spreadsheet workbook, after Excel 2000's. */

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

export interface ListEntry { key: string; label: string; run: () => void;
  /** Has a tick box, to filter by several values at once. */
  tickable?: boolean }

/** Excel's AutoFilter drop-down (and in-cell lists): a short white list under the cell, Win98 listbox keys. */
export function DropList({ anchor, entries, selected, label = 'AutoFilter', ticked, onTicks, onPick, onClose }: {
  anchor: DOMRect; entries: readonly ListEntry[]; selected: string; label?: string;
  /** Ticked entries when the list opens; `onTicks` applies the new ticks (OK or Enter). Clicking a name still picks just that one. */
  ticked?: readonly string[]; onTicks?: (keys: readonly string[]) => void;
  onPick: () => void; onClose: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [ticks, setTicks] = useState<ReadonlySet<string>>(() => new Set(ticked));
  const [changed, setChanged] = useState(false);
  const toggle = (key: string) => {
    setChanged(true);
    setTicks((current) => { const next = new Set(current); if (!next.delete(key)) next.add(key); return next; });
  };
  const applyTicks = () => { onPick(); onTicks?.([...ticks]); };
  const [focus, setFocus] = useState(() => Math.max(0, entries.findIndex((entry) => entry.key === selected)));
  useLayoutEffect(() => {
    const element = box.current!;
    const below = window.innerHeight - anchor.bottom - 4;
    const up = below < Math.min(element.offsetHeight, 160) && anchor.top > below;
    element.style.left = `${Math.max(4, Math.min(anchor.left, window.innerWidth - element.offsetWidth - 4))}px`;
    element.style.top = `${up ? Math.max(4, anchor.top - element.offsetHeight) : anchor.bottom}px`;
    list.current!.focus({ preventScroll: true });
  }, [anchor]);
  useLayoutEffect(() => { list.current?.children[focus]?.scrollIntoView?.({ block: 'nearest' }); }, [focus]);
  useEffect(() => {
    // The open arrow button toggles the list itself, so pressing it isn't an outside press.
    const outside = (event: PointerEvent) => { if (!box.current?.contains(event.target as Node) && !(event.target as Element).closest?.('.xl-dropdown-open')) onClose(); };
    const scroll = (event: Event) => { if (!box.current?.contains(event.target as Node)) onClose(); };
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
  return createPortal(<div ref={box} className="xl-drop" style={{ minWidth: anchor.width }}>
    <ul ref={list} className="xl-autofilter" role="listbox" aria-label={label} tabIndex={-1} aria-multiselectable={onTicks ? true : undefined}
    aria-activedescendant={`xl-autofilter-${focus}`}
    onKeyDown={(event) => {
      const last = entries.length - 1;
      const next = { ArrowDown: Math.min(last, focus + 1), ArrowUp: Math.max(0, focus - 1), Home: 0, End: last, PageDown: Math.min(last, focus + 10), PageUp: Math.max(0, focus - 10) }[event.key];
      if (next !== undefined) { event.preventDefault(); setFocus(next); }
      else if (event.key === ' ' && onTicks && entries[focus]?.tickable) { event.preventDefault(); toggle(entries[focus]!.key); }
      else if (event.key === 'Enter') { event.preventDefault(); if (changed) applyTicks(); else pick(focus); }
      else if (event.key === 'Escape' || event.key === 'Tab') { event.preventDefault(); onClose(); }
    }}>
    {entries.map((entry, index) => <li key={entry.key} id={`xl-autofilter-${index}`} role="option" aria-selected={entry.key === selected}
      className={index === focus ? 'focused' : undefined} onPointerEnter={() => setFocus(index)} onClick={(event) => { if (onTicks && entry.tickable && (event.ctrlKey || event.metaKey)) toggle(entry.key); else pick(index); }}>
      {onTicks && entry.tickable && <span className={`xl-tick${ticks.has(entry.key) ? ' on' : ''}`} title={`Tick ${entry.label}`} data-tick={entry.label}
        onClick={(event) => { event.stopPropagation(); toggle(entry.key); }} />}{entry.label}</li>)}
    </ul>
    {onTicks && <div className="xl-drop-buttons">
      <button type="button" disabled={!changed} onClick={applyTicks}>OK</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </div>}
  </div>, document.body);
}

/** A small modal Win98 dialog over the workbook; Escape or Cancel closes it. */
function Dialog({ title, id, onSubmit, onCancel, children, extra, disabled = false, message = false }: {
  title: string; id: string; onSubmit: () => void; onCancel: () => void; children: ReactNode;
  /** More buttons, before OK. */
  extra?: ReactNode; disabled?: boolean;
  /** A message box: OK only. */
  message?: boolean;
}) {
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => { form.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(); }, []);
  return <div className="xl-dialog-backdrop" onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onCancel(); } }}>
    <div className="window xl-dialog" role="dialog" aria-labelledby={id}>
      <div className="title-bar"><div className="title-bar-text" id={id}>{title}</div>
        <div className="title-bar-controls"><button className="close" aria-label={`Close ${title}`} onClick={onCancel} /></div></div>
      <form ref={form} className="window-body xl-dialog-body" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        {children}
        <div className="xl-dialog-buttons">{extra}<button type="submit" disabled={disabled} data-autofocus={message || undefined}>OK</button>{!message && <button type="button" onClick={onCancel}>Cancel</button>}</div>
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

/** A message box, like Excel's alerts. */
export function MessageDialog({ text, onClose }: { text: string; onClose: () => void }) {
  return <Dialog title="Spreadsheet" id="xl-message-title" onSubmit={onClose} onCancel={onClose} message><p role="alert">{text}</p></Dialog>;
}

/** Edit ▸ Go To… (Ctrl+G, F5). */
export function GoToDialog({ onGo, onCancel }: { onGo: (reference: string) => void; onCancel: () => void }) {
  const [text, setText] = useState('');
  return <Dialog title="Go To" id="xl-goto-title" onSubmit={() => onGo(text)} onCancel={onCancel} disabled={!text.trim()}>
    <div className="field-row"><label htmlFor="xl-goto">Reference:</label>
      <input data-autofocus id="xl-goto" type="text" value={text} spellCheck={false} onChange={(event) => setText(event.target.value)} /></div>
    <p className="hint">A cell (D200), range (A1:C50), column (B:D) or rows (5:9).</p>
  </Dialog>;
}

/** Data ▸ Subtotals…: at each change in a column, a function over the ticked columns. */
export function SubtotalDialog({ columns, initial, onApply, onRemove, onCancel }: {
  columns: readonly ColumnInfo[]; initial: Subtotals; onApply: (subtotals: Subtotals) => void; onRemove?: () => void; onCancel: () => void;
}) {
  const [by, setBy] = useState(initial.by);
  const [fn, setFn] = useState<SubtotalFn>(initial.fn);
  const [chosen, setChosen] = useState<readonly string[]>(initial.columns);
  // Sums and averages need numbers, and the grouping column holds the group's name.
  const offered = columns.filter((column) => column.id !== by && (fn === 'count' || column.numeric));
  const picked = offered.filter((column) => chosen.includes(column.id)).map((column) => column.id);
  return <Dialog title="Subtotal" id="xl-subtotal-title" disabled={!picked.length} onCancel={onCancel}
    onSubmit={() => { if (picked.length) onApply({ by, fn, columns: picked }); }} extra={onRemove && <button type="button" onClick={onRemove}>Remove All</button>}>
    <div className="field-row"><label htmlFor="xl-subtotal-by">At each change in:</label>
      <select data-autofocus id="xl-subtotal-by" value={by} onChange={(event) => setBy(event.target.value)}>
        {columns.map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}
      </select></div>
    <div className="field-row"><label htmlFor="xl-subtotal-fn">Use function:</label>
      <select id="xl-subtotal-fn" value={fn} onChange={(event) => setFn(event.target.value as SubtotalFn)}>
        {SUBTOTAL_FNS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
      </select></div>
    <fieldset><legend>Add subtotal to</legend><div className="xl-check-list">
      {offered.map((column) => <div className="field-row" key={column.id}>
        <input type="checkbox" id={`xl-subtotal-${column.id}`} checked={chosen.includes(column.id)}
          onChange={(event) => setChosen((current) => event.target.checked ? [...current, column.id] : current.filter((id) => id !== column.id))} />
        <label htmlFor={`xl-subtotal-${column.id}`}>{column.label}</label>
      </div>)}
    </div></fieldset>
  </Dialog>;
}

/** Colour swatches to pick from, as radio buttons. */
function Swatches({ colors, value, name, onChange }: { colors: readonly (readonly [string, string])[]; value: string; name: string; onChange: (color: string) => void }) {
  return <div className="xl-swatches" role="radiogroup" aria-label={name}>{colors.map(([label, color]) =>
    <button type="button" role="radio" key={label} aria-checked={value === color} aria-label={label} title={label}
      className="xl-swatch" style={{ background: color || '#fff' }} onClick={() => onChange(color)}>{color ? '' : '×'}</button>)}</div>;
}

/** Format ▸ Conditional Formatting… for one column. */
export function ConditionalFormatDialog({ column, initial, onApply, onCancel }: {
  column: ColumnInfo; initial?: CellFormat; onApply: (format: CellFormat | undefined) => void; onCancel: () => void;
}) {
  const [kind, setKind] = useState<CellFormat['kind']>(initial?.kind ?? (column.numeric ? 'bars' : 'values'));
  const [condition, setCondition] = useState<Condition>(initial?.kind === 'highlight' ? initial.condition : { op: column.numeric ? 'greaterOrEqual' : 'contains', operand: '' });
  const [color, setColor] = useState<string>(initial && 'color' in initial ? initial.color : column.numeric ? '#99ccff' : '#ffff99');
  const kinds: readonly (readonly [CellFormat['kind'], string])[] = [
    ...(column.numeric ? [['bars', 'Data bars'], ['scale', 'Colour scale (low to high)']] as const : []),
    ['values', 'A colour for each value'], ['highlight', 'Cells that match…'],
  ];
  const format: CellFormat = kind === 'bars' ? { kind, color } : kind === 'highlight' ? { kind, condition, color } : { kind };
  return <Dialog title="Conditional Formatting" id="xl-format-title" onSubmit={() => onApply(format)} onCancel={onCancel}
    disabled={kind === 'highlight' && !condition.operand.trim()}
    extra={initial && <button type="button" onClick={() => onApply(undefined)}>Delete</button>}>
    <fieldset><legend>{column.label}</legend>
      <div className="field-row"><label htmlFor="xl-format-kind">Format:</label>
        <select data-autofocus id="xl-format-kind" value={kind} onChange={(event) => setKind(event.target.value as CellFormat['kind'])}>
          {kinds.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select></div>
      {kind === 'highlight' && <div className="field-row">
        <select aria-label="Comparison" value={condition.op} onChange={(event) => setCondition({ ...condition, op: event.target.value as CustomOp })}>
          {CUSTOM_OPS.map(([op, label]) => <option key={op} value={op}>{label}</option>)}
        </select>
        <input type="text" aria-label="Value" value={condition.operand} onChange={(event) => setCondition({ ...condition, operand: event.target.value })} />
      </div>}
      {(kind === 'highlight' || kind === 'bars') && <div className="field-row"><span>Colour:</span><Swatches colors={FORMAT_COLORS} name="Colour" value={color} onChange={setColor} /></div>}
    </fieldset>
  </Dialog>;
}

export const TAB_COLORS = [['No Color', ''], ['Red', '#ff0000'], ['Orange', '#ff9900'], ['Yellow', '#ffff00'], ['Green', '#008000'], ['Lime', '#99cc00'], ['Turquoise', '#33cccc'], ['Blue', '#3366ff'], ['Navy', '#000080'], ['Violet', '#800080'], ['Pink', '#ff99cc'], ['Grey', '#808080']] as const;
/** A sheet tab's right-click ▸ Tab Color…. */
export function TabColorDialog({ name, initial, onApply, onCancel }: { name: string; initial: string; onApply: (color: string) => void; onCancel: () => void }) {
  const [color, setColor] = useState(initial);
  return <Dialog title="Format Tab Color" id="xl-tab-color-title" onSubmit={() => onApply(color)} onCancel={onCancel}>
    <fieldset><legend>{name}</legend><Swatches colors={TAB_COLORS} name="Tab color" value={color} onChange={setColor} /></fieldset>
  </Dialog>;
}

/** Edit ▸ Find… (Ctrl+F): stays open beside the sheet, as Excel's does; drag it by its title bar. */
export function FindDialog({ initial, onFind, onClose }: {
  initial: FindOptions;
  /** Find the next match (or previous); false when there is none. */
  onFind: (options: FindOptions, backwards: boolean) => boolean; onClose: () => void;
}) {
  const [options, setOptions] = useState(initial);
  const [missing, setMissing] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { input.current?.focus(); input.current?.select(); }, []);
  const set = (change: Partial<FindOptions>) => { setOptions((current) => ({ ...current, ...change })); setMissing(false); };
  const find = (backwards: boolean) => { if (options.text.trim()) setMissing(!onFind(options, backwards)); };
  return <div className="window xl-find" role="dialog" aria-labelledby="xl-find-title" style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    onKeyDown={(event) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); }
      else if (event.key === 'Enter' && event.target instanceof HTMLInputElement) { event.preventDefault(); find(event.shiftKey); }
    }}>
    <div className="title-bar" onPointerDown={(event) => {
      if (event.button !== 0 || (event.target as Element).closest('button')) return;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      drag.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
    }} onPointerMove={(event) => { if (drag.current) setOffset({ x: event.clientX - drag.current.x, y: event.clientY - drag.current.y }); }}
      onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
      <div className="title-bar-text" id="xl-find-title">Find</div>
      <div className="title-bar-controls"><button className="close" aria-label="Close Find" onClick={onClose} /></div></div>
    <div className="window-body xl-dialog-body">
      <div className="field-row"><label htmlFor="xl-find-text">Find what:</label>
        <input ref={input} id="xl-find-text" type="text" value={options.text} onChange={(event) => set({ text: event.target.value })} /></div>
      <div className="field-row"><label htmlFor="xl-find-by">Search:</label>
        <select id="xl-find-by" value={options.by} onChange={(event) => set({ by: event.target.value as FindOptions['by'] })}>
          <option value="rows">By Rows</option><option value="columns">By Columns</option>
        </select></div>
      <div className="field-row"><input type="checkbox" id="xl-find-case" checked={options.matchCase} onChange={(event) => set({ matchCase: event.target.checked })} /><label htmlFor="xl-find-case">Match case</label></div>
      <div className="field-row"><input type="checkbox" id="xl-find-whole" checked={options.whole} onChange={(event) => set({ whole: event.target.checked })} /><label htmlFor="xl-find-whole">Find entire cells only</label></div>
      {missing && <p role="alert">Cannot find matching data.</p>}
      <div className="xl-dialog-buttons">
        <button type="button" disabled={!options.text.trim()} onClick={() => find(false)}>Find Next</button>
        <button type="button" onClick={onClose}>Close</button>
      </div>
    </div>
  </div>;
}
