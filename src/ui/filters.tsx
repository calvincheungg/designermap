import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { aesthetics, brandCategories, collectionTags, marketPositionings, productTags, type HouseFilters } from '../data/tags';
import { tagLabel } from './labels';

export type FilterGroup = keyof HouseFilters;
export const filterFields = [
  ['marketPositioning', 'Market', marketPositionings],
  ['brandCategory', 'Category', brandCategories],
  ['aesthetic', 'Aesthetic', aesthetics],
  ['collections', 'Collections', collectionTags],
  ['product', 'Product', productTags],
] as const;

/** Validate values against the group's enum before updating the typed filter state. */
export function setFilterValue(filters: HouseFilters, group: FilterGroup, value: string, selected: boolean): HouseFilters {
  const field = filterFields.find(([key]) => key === group);
  if (!field || !field[2].some((option) => option === value)) return filters;
  const current: readonly string[] = filters[group] ?? [];
  if (current.includes(value) === selected) return filters;
  const next = selected ? [...new Set([...current, value])] : current.filter((item) => item !== value);
  return { ...filters, [group]: next };
}

export function Filters({ value, onChange, count, total }: {
  value: HouseFilters; onChange: (filters: HouseFilters) => void; count: number; total: number;
}) {
  const [open, setOpen] = useState<FilterGroup | null>(null);
  const root = useRef<HTMLDetailsElement>(null);
  const selections = useRef<HTMLDivElement>(null);
  const summaries = useRef(new Map<FilterGroup, HTMLElement>());
  const restoreFocus = useRef<FilterGroup | null>(null);
  const selectedCount = Object.values(value).reduce((sum, values) => sum + (values?.length ?? 0), 0);

  useEffect(() => {
    const closeOutside = (event: MouseEvent) => {
      if (!(event.target instanceof Node)) return;
      const inMenu = event.target instanceof Element && event.target.closest('.filter-menu');
      if (!inMenu || !root.current?.contains(event.target)) setOpen(null);
    };
    document.addEventListener('click', closeOutside);
    return () => document.removeEventListener('click', closeOutside);
  }, []);
  useLayoutEffect(() => {
    if (!restoreFocus.current) return;
    (selections.current?.querySelector<HTMLButtonElement>('button') ?? summaries.current.get(restoreFocus.current))?.focus();
    restoreFocus.current = null;
  }, [value]);

  return <details className="filters" ref={root} open onKeyDown={(event) => {
    if (event.key === 'Escape' && open) {
      summaries.current.get(open)?.focus();
      setOpen(null);
      event.preventDefault();
      event.stopPropagation();
    }
  }}>
    <summary>Filter houses <span id="filter-count" role="status" aria-live="polite">({count} of {total})</span></summary>
    <div className="filter-layout"><div><div className="filter-controls">
      {filterFields.map(([group, label, options]) => <details className="filter-menu" key={group} open={open === group}>
        <summary ref={(element) => { if (element) summaries.current.set(group, element); else summaries.current.delete(group); }} onClick={(event) => {
          event.preventDefault(); setOpen((current) => current === group ? null : group);
        }}>{label}{value[group]?.length ? ` (${value[group]!.length})` : ''}</summary>
        <div className="filter-options sunken-panel" role="group" aria-label={label}>
          {options.map((option, index) => <div className="field-row" key={option}>
            <input type="checkbox" id={`filter-${group}-${index}`} value={option} checked={value[group]?.some((item) => item === option) ?? false}
              onChange={(event) => onChange(setFilterValue(value, group, option, event.target.checked))} />
            <label htmlFor={`filter-${group}-${index}`}>{tagLabel(option)}</label>
          </div>)}
        </div>
      </details>)}
    </div><p className="hint">Match Any Within Each Group, All Across Groups. The Year Also Applies.</p></div>
      <div className="selected-filter-panel"><div className="selected-filter-heading">
        <span>Selected Filters <span id="selected-filter-count">({selectedCount})</span></span>
        <button id="clear-filters" disabled={!selectedCount} onClick={() => onChange({})}>Clear All</button>
      </div><div id="selected-filters" className="selected-filter-list" aria-label="Selected Filters" ref={selections}>
        {!selectedCount && <p className="hint">No Filters Selected</p>}
        {filterFields.flatMap(([group, label, options]) => options.filter((option) => value[group]?.some((item) => item === option)).map((option) =>
          <button type="button" key={`${group}:${option}`} className="filter-chip" aria-label={`Remove ${tagLabel(option)} from ${label}`} onClick={() => {
            restoreFocus.current = group;
            onChange(setFilterValue(value, group, option, false));
          }}>{label}: {tagLabel(option)} ×</button>))}
      </div></div>
    </div>
  </details>;
}
