import { countryNames, designers, groups, houses, isBusinessLeadership, yearRange } from '../data';
import { collator } from '../text';
import type { ListItem } from './listbox';
import type { Selection } from './panel';
import type { RunTarget } from './run-dialog';

/** Everything Find, the Address bar and Run… can open. */

export const [minYear, maxYear] = yearRange();
export const searchItems: ListItem<NonNullable<Selection>>[] = [
  ...houses.map((h) => ({ label: h.name, aliases: h.aliases, hint: 'house', value: { kind: 'house' as const, id: h.id } })),
  ...groups.map((g) => ({ label: g.name, hint: 'group', value: { kind: 'group' as const, id: g.id } })),
  ...designers.map((d) => ({ label: d.name, hint: d.career.some(isBusinessLeadership) ? 'leader' : 'designer', value: { kind: 'designer' as const, id: d.id } })),
].sort((a, b) => collator.compare(a.label, b.label) || a.hint.localeCompare(b.hint));
/** Run… also opens places (every base or origin city, and every country with a brand) and years. */
export const placeRunItems: ListItem<RunTarget>[] = [
  ...[...new Set(houses.flatMap((h) => h.origin ? [h.city, h.origin.city] : [h.city]))]
    .map((city) => ({ label: city, hint: 'city', value: { kind: 'place' as const, value: { kind: 'city' as const, id: city } } })),
  ...[...new Set(houses.flatMap((h) => h.origin ? [h.country, h.origin.country] : [h.country]))]
    .map((country) => ({ label: countryNames[country], hint: 'country', value: { kind: 'place' as const, value: { kind: 'country' as const, id: country } } })),
].sort((a, b) => collator.compare(a.label, b.label));
export const yearRunItems: ListItem<RunTarget>[] = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i)
  .map((year) => ({ label: String(year), hint: 'year', value: { kind: 'year' as const, year } }));
