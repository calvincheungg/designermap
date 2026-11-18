import { useLayoutEffect, useRef } from 'react';
import { aesthetics, brandCategories, collectionTags, marketPositionings, productTags, type HouseFilters } from '../data/tags';
import { tagLabel } from './labels';
import { StartIcon } from './start-icons';

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

const selectedCount = (value: HouseFilters) => Object.values(value).reduce((sum, values) => sum + (values?.length ?? 0), 0);

/**
 * Start menu entry: "Filter brands" ▸ group ▸ checkboxes, cascading like Win98
 * submenus. Checking options leaves the menu open so several can be picked.
 */
export function FilterMenu({ value, onChange }: { value: HouseFilters; onChange: (filters: HouseFilters) => void }) {
  const count = selectedCount(value);
  return <div className="start-item start-parent" tabIndex={0} aria-haspopup="true">
    <StartIcon name="filter" /><span className="start-label">Filter brands{count ? ` (${count})` : ''}</span><span className="start-arrow" aria-hidden="true" />
    <div className="window start-submenu filter-submenu" role="group" aria-label="Filter brands">
      {filterFields.map(([group, label, options]) => <div className="start-subitem start-subparent" key={group} tabIndex={0} aria-haspopup="true">
        <span className="start-label">{label}{value[group]?.length ? ` (${value[group]!.length})` : ''}</span><span className="start-arrow" aria-hidden="true" />
        <fieldset className="window start-submenu filter-options">
          <legend className="visually-hidden">{label}</legend>
          {options.map((option, index) => <div className="field-row start-subitem" key={option}>
            <input type="checkbox" id={`filter-${group}-${index}`} value={option} checked={value[group]?.some((item) => item === option) ?? false}
              onChange={(event) => onChange(setFilterValue(value, group, option, event.target.checked))} />
            <label htmlFor={`filter-${group}-${index}`}>{tagLabel(option)}</label>
          </div>)}
        </fieldset>
      </div>)}
      <hr className="start-separator" />
      <button type="button" className="start-subitem start-subcommand" disabled={!count} onClick={() => onChange({})}>Clear all filters</button>
    </div>
  </div>;
}

/** Toolbar strip listing active filters as removable chips; hidden when none are set. */
export function ActiveFilters({ value, onChange, count, total }: {
  value: HouseFilters; onChange: (filters: HouseFilters) => void; count: number; total: number;
}) {
  const list = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef(false);
  const selected = selectedCount(value);
  useLayoutEffect(() => {
    if (!restoreFocus.current) return;
    restoreFocus.current = false;
    (list.current?.querySelector<HTMLButtonElement>('button') ?? document.getElementById('graph'))?.focus();
  }, [value]);
  if (!selected) return null;
  return <div className="active-filters" role="group" aria-label="Selected Filters">
    <span id="filter-count" role="status" aria-live="polite">{count} of {total} brands</span>
    <div id="selected-filters" className="selected-filter-list" ref={list}>
      {filterFields.flatMap(([group, label, options]) => options.filter((option) => value[group]?.some((item) => item === option)).map((option) =>
        <button type="button" key={`${group}:${option}`} className="filter-chip" aria-label={`Remove ${tagLabel(option)} from ${label}`} onClick={() => {
          restoreFocus.current = true;
          onChange(setFilterValue(value, group, option, false));
        }}>{tagLabel(option)} ×</button>))}
    </div>
    <button type="button" id="clear-filters" onClick={() => onChange({})}>Clear All</button>
  </div>;
}
