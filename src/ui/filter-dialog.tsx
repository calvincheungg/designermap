import type { ReactNode } from 'react';
import type { HouseFilters } from '../data/tags';
import { Dialog } from './dialog';
import { filterFields, setFilterValue, type FilterGroup } from './filters';
import { tagLabel } from './labels';
import { Tabs } from './tabs';

/** Explorer ▸ View ▸ Filter Brands…: the Start menu's brand filters in tabs, applied as they change. */
export function FilterDialog({ value, count, total, onChange, onClose }: {
  value: HouseFilters; count: number; total: number; onChange: (filters: HouseFilters) => void; onClose: () => void;
}) {
  const panels = Object.fromEntries(filterFields.map(([group, , options]) => [group, () => <div className="filter-dialog-options">
    {options.map((option, i) => <div className="field-row" key={option}>
      <input type="checkbox" id={`explorer-filter-${group}-${i}`} checked={value[group]?.some((item) => item === option) ?? false}
        onChange={(event) => onChange(setFilterValue(value, group, option, event.target.checked))} />
      <label htmlFor={`explorer-filter-${group}-${i}`}>{tagLabel(option)}</label>
    </div>)}
  </div>])) as Record<FilterGroup, () => ReactNode>;
  return <Dialog title="Filter Brands" className="filter-dialog" message submitLabel="Close" onSubmit={onClose} onCancel={onClose}
    extra={<><span role="status">{count.toLocaleString()} of {total.toLocaleString()} brands</span>
      <button type="button" disabled={!Object.values(value).some((list) => list?.length)} onClick={() => onChange({})}>Clear All</button></>}>
    <Tabs label="Filters" storageKey="designer-map:filter-tab" panels={panels}
      tabs={filterFields.map(([group, label]) => [group, value[group]?.length ? `${label} (${value[group]!.length})` : label] as const)} />
  </Dialog>;
}
