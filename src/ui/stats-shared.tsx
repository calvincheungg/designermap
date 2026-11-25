import { oneOf, readSetting, writeSetting } from './storage';
import { Fragment, useMemo, useState, type ReactNode } from 'react';
import { BrandCategory, getHouse } from '../data';
import type { Collaboration } from '../types';
import { tally } from './year-chart';
import { ProfileSection, RowLimitedPanel } from './panel';
import { SelectBox } from './listbox';

/** Rows shown in each "top" table. */
export const STATS_TOP = 10;

export interface Row {
  key: string; label: ReactNode; count: number;
  /** Full label text, shown on hover when a long name is cut short. */
  title?: string;
  /** Extra columns after the label, one per `columns` heading. */
  cells?: ReactNode[];
}

/** Rows a table shows before it scrolls, however many the "Show" picker lists. */
export const STATS_VISIBLE_ROWS = 25;

/** Row counts the collaboration tables can show. */
export const COLLAB_LIMITS = [STATS_TOP, 25, 50, 100, 200] as const;

/** A statistics section with a "Show" picker for how many rows its table lists. */
export function LimitedSection({ title, children, controls }: {
  title: string; children: (limit: number) => ReactNode;
  /** Extra controls beside the "Show" picker. */
  controls?: ReactNode;
}) {
  const [limit, setLimit] = useState<number>(STATS_TOP);
  return <ProfileSection title={title}>
    <div className="field-row stats-limit">
      <span>Show</span>
      <SelectBox label={`Rows shown in ${title}`} values={COLLAB_LIMITS} value={limit} onChange={setLimit} />
      {controls}
    </div>
    {children(limit)}
  </ProfileSection>;
}

export const top = <T,>(entries: Iterable<readonly [T, number]>, limit = STATS_TOP) =>
  [...entries].sort((a, b) => b[1] - a[1]).slice(0, limit);
export { tally };

/** A Win98 table of counts with a navy bar scaled to the largest row. */
export function BarTable({ heading, rows, label, countHeading = 'Count', columns = [], ranked = true }: {
  heading: string; rows: Row[]; label: string; countHeading?: string;
  /** Headings of extra columns between the label and the count. */
  columns?: string[];
  /** Number the rows in a leading "#" column (off for fixed orders like market tiers). */
  ranked?: boolean;
}) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  if (!rows.length) return <p className="hint">Nothing to count with the current filters.</p>;
  return <RowLimitedPanel rows={STATS_VISIBLE_ROWS} className="stats-table"><table aria-label={label}>
    <thead><tr>{ranked && <th className="stats-rank">#</th>}<th className="stats-label">{heading}</th>{columns.map((column) => <th key={column} className="stats-label">{column}</th>)}<th className="stats-count">{countHeading}</th><th className="stats-bar-cell" aria-hidden="true"></th></tr></thead>
    <tbody>{rows.map((row, index) => <tr key={row.key}>
      {ranked && <td className="stats-rank">{index + 1}</td>}<td className="stats-label" title={row.title}>{row.label}</td>{columns.map((column, cell) => <td key={column} className="stats-label">{row.cells?.[cell]}</td>)}<td className="stats-count">{row.count.toLocaleString()}</td>
      <td className="stats-bar-cell" aria-hidden="true"><span className="stats-bar" style={{ width: `${(row.count / max) * 100}%` }} /></td>
    </tr>)}</tbody>
  </table></RowLimitedPanel>;
}

export const houseName = (id: string) => getHouse(id)?.name ?? id;


/** Whether a release involves a brand that is also a multi-brand store (category Retailer). */
export const involvesRetailer = (project: Pick<Collaboration, 'houses'>) =>
  project.houses.some((id) => getHouse(id)?.tags.brandCategory.includes(BrandCategory.Retailer));

/** An on-by-default checkbox setting remembered in localStorage. */
export function useRememberedToggle(key: string) {
  const [on, setOn] = useState(() => readSetting(key, (stored) => stored !== 'off', true));
  const toggle = (next: boolean) => { setOn(next); writeSetting(key, next ? 'on' : 'off'); };
  return [on, toggle] as const;
}

/** "Include retailer collaborations" checkbox, shown beside a table's "Show" picker. */
export function RetailerToggle({ id, checked, onChange }: { id: string; checked: boolean; onChange: (next: boolean) => void }) {
  return <span className="stats-retailers">
    <input type="checkbox" id={id} checked={checked} onChange={(event) => onChange(event.target.checked)} />
    <label htmlFor={id} title="Releases with a brand that is also a store stocking other brands (Kith, BEAMS, Undefeated…)">Include retailer collaborations</label>
  </span>;
}

/** A remembered choice; `parse` returns undefined for values that no longer fit. */
export function useRememberedChoice<T extends string | number>(key: string, values: readonly T[], fallback: T) {
  const [value, setValue] = useState<T>(() => readSetting<T>(key, oneOf(values), fallback));
  const pick = (next: T) => { setValue(next); writeSetting(key, String(next)); };
  return [value, pick] as const;
}

/** A labelled drop-down in a section's controls row. */
export function Choice<T extends string | number>({ text, label, values, value, onChange, names }: {
  text: string; label: string; values: readonly T[]; value: T; onChange: (value: T) => void; names?: Readonly<Record<T, string>>;
}) {
  return <span className="stats-choice"><span>{text}</span>
    <SelectBox label={label} values={values} value={value} onChange={onChange} text={(option) => names?.[option] ?? String(option)} /></span>;
}

export interface Column<Key extends string> { key: Key; label: string; title?: string }
export interface SortRow<Key extends string> {
  key: string; label: ReactNode; title: string;
  /** Sort values, also shown unless `text` replaces them. */
  values: Record<Key, number>;
  text?: Partial<Record<Key, string>>;
  /** Shown under the row when it's opened. */
  details?: () => ReactNode;
}

/** A ranked table sorted by any number column; rows with details open by clicking them. */
export function SortTable<Key extends string>({ label, heading, columns, rows, limit = Infinity, initial, detailsLabel, ranked = true, bar }: {
  label: string; heading: string; columns: readonly Column<Key>[]; rows: readonly SortRow<Key>[]; limit?: number; initial: Key;
  ranked?: boolean;
  /** Column drawn as a bar after the numbers. */
  bar?: Key;
  /** Names a row's arrow, e.g. "Brands in". */
  detailsLabel?: string;
}) {
  const [sort, setSort] = useState<{ key: Key; ascending: boolean }>({ key: initial, ascending: false });
  const [opened, setOpened] = useState<string>();
  const sorted = useMemo(() => {
    const direction = sort.ascending ? 1 : -1;
    return [...rows].sort((a, b) => direction * (a.values[sort.key] - b.values[sort.key])
      || columns.reduce((order, { key }) => order || b.values[key] - a.values[key], 0) || a.title.localeCompare(b.title));
  }, [rows, sort, columns]);
  if (!rows.length) return <p className="hint">Nothing to count with the current filters.</p>;
  const most = bar ? Math.max(1, ...rows.map((row) => row.values[bar])) : 1;
  return <RowLimitedPanel rows={STATS_VISIBLE_ROWS} className="stats-table"><table aria-label={label}>
    <thead><tr>{ranked && <th className="stats-rank">#</th>}<th className="stats-label">{heading}</th>{columns.map(({ key, label: text, title }) => {
      const active = sort.key === key;
      return <th key={key} className="stats-count" aria-sort={active ? (sort.ascending ? 'ascending' : 'descending') : 'none'}>
        <button type="button" className="stats-sort" title={title} onClick={() => setSort({ key, ascending: active && !sort.ascending })}>{text}{active ? (sort.ascending ? ' ▲' : ' ▼') : ''}</button>
      </th>;
    })}{bar && <th className="stats-bar-cell" aria-hidden="true" />}</tr></thead>
    <tbody>{sorted.slice(0, limit).map((row, index) => {
      const open = opened === row.key;
      const flip = () => setOpened(open ? undefined : row.key);
      return <Fragment key={row.key}>
        <tr className={row.details && 'stats-open-row'} onClick={row.details && ((event) => {
          // Links and the arrow handle their own clicks.
          if (!(event.target as Element).closest('a, button')) flip();
        })}>
          {ranked && <td className="stats-rank">{index + 1}</td>}
          <td className="stats-label" title={row.title}>
            {row.details && <button type="button" className="stats-open-toggle" aria-expanded={open} aria-label={`${detailsLabel ?? 'Details of'} ${row.title}`} onClick={flip}>{open ? '▾' : '▸'}</button>}
            {row.label}
          </td>
          {columns.map(({ key }) => <td key={key} className="stats-count">{row.text?.[key] ?? row.values[key].toLocaleString()}</td>)}
          {bar && <td className="stats-bar-cell" aria-hidden="true"><span className="stats-bar" style={{ width: `${(row.values[bar] / most) * 100}%` }} /></td>}
        </tr>
        {open && row.details && <tr><td colSpan={(ranked ? 2 : 1) + columns.length + (bar ? 1 : 0)}><div className="stats-details">{row.details()}</div></td></tr>}
      </Fragment>;
    })}</tbody>
  </table></RowLimitedPanel>;
}
