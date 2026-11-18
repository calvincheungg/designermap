import { aesthetics, brandCategories, collectionTags, getDesigner, getGroup, getHouse, marketPositionings, productTags, type HouseFilters } from '../data';
import type { Selection } from './panel';

/**
 * Shareable view state in the URL hash: `#brand=dior&year=2010&marketPositioning=Luxury,Premium`.
 * Unknown ids, tag values and out-of-range years are dropped when reading, so
 * an old or hand-edited link still opens.
 */
export interface SharedView { selection: Selection; year?: number; filters: HouseFilters }

const SELECTION_KEYS = { house: 'brand', designer: 'designer', group: 'group' } as const;
const FILTER_VALUES: { [K in keyof HouseFilters]-?: readonly string[] } = {
  marketPositioning: marketPositionings, brandCategory: brandCategories, aesthetic: aesthetics,
  collections: collectionTags, product: productTags,
};
const FILTER_KEYS = Object.keys(FILTER_VALUES) as (keyof HouseFilters)[];

export function readSharedView(hash: string, minYear: number, maxYear: number): SharedView {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  let selection: Selection = null;
  const brand = params.get('brand'), designer = params.get('designer'), group = params.get('group');
  if (brand && getHouse(brand)) selection = { kind: 'house', id: brand };
  else if (designer && getDesigner(designer)) selection = { kind: 'designer', id: designer };
  else if (group && getGroup(group)) selection = { kind: 'group', id: getGroup(group)!.id };
  const yearValue = Number(params.get('year'));
  const year = params.has('year') && Number.isInteger(yearValue) ? Math.min(maxYear, Math.max(minYear, yearValue)) : undefined;
  const filters: Record<string, string[]> = {};
  for (const key of FILTER_KEYS) {
    const values = (params.get(key) ?? '').split(',').filter((value) => FILTER_VALUES[key].includes(value));
    if (values.length) filters[key] = values;
  }
  return { selection, year, filters: filters as HouseFilters };
}

/** The hash for a view; empty for the default view (nothing selected, all years, no filters). */
export function sharedViewHash({ selection, year, filters }: SharedView, maxYear: number): string {
  const params = new URLSearchParams();
  if (selection) params.set(SELECTION_KEYS[selection.kind], selection.id);
  if (year !== undefined && year < maxYear) params.set('year', String(year));
  for (const key of FILTER_KEYS) if (filters[key]?.length) params.set(key, filters[key]!.join(','));
  const query = params.toString();
  return query ? `#${query.replace(/%2C/g, ',')}` : '';
}
