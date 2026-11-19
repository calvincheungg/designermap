import { collaborations, CountryCode, countryNames, designers, getDesigner, getGroup, getHouse, groups, houses, housesInGroup, isBusinessLeadership, MarketPositioning, regionalHousesInGroup, tenuresAt } from '../data';
import { cities, cityRegions, type CityName } from '../data/cities';
import type { Collaboration, Designer, House, Tenure } from '../types';
import { mapLocationForCity } from '../graph/locations';
import { tagLabel } from './labels';
import type { Place } from './panel';

/**
 * The List View workbook's data: one sheet per kind of record, and the sheet
 * operations (sort, AutoFilter, search, CSV, AutoFit). Nothing here touches the
 * map or React; ui/list-view.tsx draws it.
 */

const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
const fold = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();

/** What a cell links to: a Properties window, a place window or an outside page. */
export type CellLink = { kind: 'house' | 'designer' | 'group'; id: string } | { kind: 'place'; place: Place } | { kind: 'url'; href: string };
export interface MenuEntry { label: string; link: CellLink }
interface Column<T> {
  /** `width` is the column's default; a double-click on its border AutoFits it instead. */
  id: string; label: string; width: number; numeric?: boolean;
  /** A year column: the Chart Wizard and PivotTable can group it by decade. */
  year?: boolean;
  /** A fixed value order for sorting and the AutoFilter list (Market runs High Luxury down). */
  order?: readonly string[];
  /** The cell's values: several for lists (each its own AutoFilter entry), none for a blank cell. */
  values: (item: T) => readonly string[];
  /** A link per value, in the same order. */
  links?: (item: T) => readonly (CellLink | undefined)[];
  /** An in-cell drop-down list (like Excel's validation lists); its labels also count for the search. */
  menu?: (item: T) => readonly MenuEntry[];
}
/** A column as the sheet uses it, once its rows are built. */
export type ColumnInfo = Omit<Column<never>, 'values' | 'links' | 'menu'> & { menu?: boolean };
export interface SheetRow {
  key: string;
  /** Ties sort by this name. */
  name: string;
  cells: readonly (readonly string[])[];
  links: readonly ((readonly (CellLink | undefined)[]) | undefined)[];
  menus: readonly ((readonly MenuEntry[]) | undefined)[];
  /** Enter or a double-click opens this. */
  open: CellLink;
  /** Drawn in grey when Format ▸ Grey Out Ended Brands is on. */
  ended?: boolean;
}
export type SheetId = 'brands' | 'groups' | 'designers' | 'careers' | 'collaborations' | 'locations';
export interface SortKey { column: string; descending: boolean }
/** Sort keys in priority order, like Data ▸ Sort's "Sort by / Then by / Then by". */
export type ListSort = readonly SortKey[];
export interface Sheet { id: SheetId; name: string; columns: readonly ColumnInfo[]; rows: () => readonly SheetRow[]; defaultSort: ListSort }

function defineSheet<T>(id: SheetId, name: string, items: () => readonly T[],
  row: (item: T) => Pick<SheetRow, 'key' | 'name' | 'open' | 'ended'>, columns: readonly Column<T>[], defaultSort?: ListSort): Sheet {
  let built: SheetRow[] | undefined;
  return {
    id, name, defaultSort: defaultSort ?? [{ column: columns[0]!.id, descending: false }],
    columns: columns.map(({ values: _, links: __, menu, ...info }) => ({ ...info, menu: !!menu })),
    rows: () => built ??= items().map((item) => ({
      ...row(item),
      cells: columns.map((column) => column.values(item)),
      links: columns.map((column) => column.links?.(item)),
      menus: columns.map((column) => column.menu?.(item)),
    })),
  };
}

const TIER_LABELS: readonly string[] = Object.values(MarketPositioning).map(tagLabel);
const tags = (values: readonly string[]) => values.map(tagLabel);
const year = (value: number | undefined) => value === undefined ? [] : [String(value)];
const count = (value: number) => [String(value)];
const unique = <T,>(list: readonly T[]) => [...new Set(list)];
const houseName = (id: string) => getHouse(id)?.name ?? id;
const houseLinks = (ids: readonly string[]) => ids.map((id): CellLink => ({ kind: 'house', id }));
const cityLink = (city: string): CellLink => ({ kind: 'place', place: { kind: 'city', id: mapLocationForCity(city) } });
const countryLink = (country: CountryCode): CellLink => ({ kind: 'place', place: { kind: 'country', id: country } });
/** "https://www.loewe.com/" → "loewe.com", as a sheet would show a pasted link. */
export const websiteLabel = (url: string) => url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
const byName = (a: { name: string }, b: { name: string }) => collator.compare(a.name, b.name);

/* Brand family, collaboration and creative-director look-ups, indexed once (scanning per brand would be quadratic). */
let labelIndex: Map<string, House[]> | undefined;
const labelsOfHouse = (id: string) => (labelIndex ??= Map.groupBy([...houses].sort(byName).filter((h) => h.parentHouse), (h) => h.parentHouse!)).get(id) ?? [];
let collabIndex: Map<string, Collaboration[]> | undefined;
function collabsOf(id: string): Collaboration[] {
  if (!collabIndex) {
    collabIndex = new Map();
    for (const c of collaborations) for (const house of new Set<string>(c.houses)) collabIndex.set(house, [...(collabIndex.get(house) ?? []), c]);
  }
  return collabIndex.get(id) ?? [];
}
/** Creative leadership only: design-team (Other) roles and business appointments never count as creative direction. */
const directorTenures = (id: string) => tenuresAt(id).filter((t) => t.role !== 'Other' && !isBusinessLeadership(t));
const designerName = (id: string) => getDesigner(id)?.name ?? id;
/** Collaboration partners, most releases first, as "Nike (4)". */
function partnerEntries(id: string): MenuEntry[] {
  const counts = new Map<string, number>();
  for (const c of collabsOf(id)) for (const other of new Set<string>(c.houses)) if (other !== id) counts.set(other, (counts.get(other) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || collator.compare(houseName(a[0]), houseName(b[0])))
    .map(([other, n]) => ({ label: `${houseName(other)} (${n})`, link: { kind: 'house', id: other } }));
}

const brandSheet = defineSheet('brands', 'Brands', () => houses, (h) => ({ key: h.id, name: h.name, open: { kind: 'house', id: h.id }, ended: h.closed !== undefined }), [
  { id: 'name', label: 'Brand', width: 190, values: (h) => [h.name], links: (h) => [{ kind: 'house', id: h.id }] },
  { id: 'city', label: 'City', width: 110, values: (h) => [h.city], links: (h) => [cityLink(h.city)] },
  { id: 'country', label: 'Country', width: 120, values: (h) => [countryNames[h.country]], links: (h) => [countryLink(h.country)] },
  { id: 'founded', label: 'Founded', width: 84, numeric: true, year: true, values: (h) => year(h.founded) },
  { id: 'closed', label: 'Ended', width: 74, numeric: true, year: true, values: (h) => year(h.closed) },
  { id: 'tier', label: 'Market', width: 96, order: TIER_LABELS, values: (h) => [tagLabel(h.tags.marketPositioning)] },
  { id: 'category', label: 'Category', width: 180, values: (h) => tags(h.tags.brandCategory) },
  { id: 'aesthetic', label: 'Aesthetic', width: 180, values: (h) => tags(h.tags.aesthetic) },
  { id: 'collections', label: 'Collections', width: 150, values: (h) => tags(h.tags.collections) },
  { id: 'product', label: 'Products', width: 210, values: (h) => tags(h.tags.product) },
  { id: 'group', label: 'Group', width: 160, values: (h) => h.parentGroup ? [getGroup(h.parentGroup)?.name ?? h.parentGroup] : [],
    links: (h) => h.parentGroup ? [{ kind: 'group', id: h.parentGroup }] : [] },
  { id: 'parent', label: 'Parent brand', width: 150, values: (h) => h.parentHouse ? [houseName(h.parentHouse)] : [],
    links: (h) => h.parentHouse ? houseLinks([h.parentHouse]) : [] },
  { id: 'website', label: 'Website', width: 170, values: (h) => h.website ? [websiteLabel(h.website)] : [],
    links: (h) => h.website ? [{ kind: 'url', href: h.website }] : [] },
  { id: 'currentDirector', label: 'Current creative director', width: 190,
    values: (h) => unique(directorTenures(h.id).filter((t) => t.end === null).map((t) => t.designerId)).map(designerName),
    links: (h) => unique(directorTenures(h.id).filter((t) => t.end === null).map((t) => t.designerId)).map((id): CellLink => ({ kind: 'designer', id })) },
  { id: 'directors', label: 'Creative directors', width: 120, numeric: true, values: (h) => count(new Set(directorTenures(h.id).map((t) => t.designerId)).size) },
  { id: 'collaborations', label: 'Collaborations', width: 116, numeric: true, values: (h) => count(collabsOf(h.id).length), menu: (h) => partnerEntries(h.id) },
  { id: 'sublabels', label: 'Sublabels', width: 90, numeric: true, values: (h) => count(labelsOfHouse(h.id).length),
    menu: (h) => labelsOfHouse(h.id).map((label) => ({ label: label.name, link: { kind: 'house', id: label.id } })) },
  { id: 'instagram', label: 'Instagram', width: 140, values: (h) => h.instagram ? [`@${h.instagram}`] : [],
    links: (h) => h.instagram ? [{ kind: 'url', href: `https://www.instagram.com/${h.instagram}/` }] : [] },
]);

type GroupRow = (typeof groups)[number];
const groupSheet = defineSheet('groups', 'Groups', () => [...groups].sort(byName), (g) => ({ key: g.id, name: g.name, open: { kind: 'group', id: g.id } }), [
  { id: 'name', label: 'Group', width: 190, values: (g: GroupRow) => [g.name], links: (g) => [{ kind: 'group', id: g.id }] },
  { id: 'count', label: 'Brands', width: 64, numeric: true, values: (g) => count(housesInGroup(g.id).length) },
  { id: 'brands', label: 'Member brands', width: 300, values: (g) => housesInGroup(g.id).map((h) => h.name), links: (g) => houseLinks(housesInGroup(g.id).map((h) => h.id)) },
  { id: 'countries', label: 'Countries', width: 180, values: (g) => unique(housesInGroup(g.id).map((h) => countryNames[h.country])).sort(collator.compare) },
  { id: 'regional', label: 'Regional operations', width: 220, values: (g) => regionalHousesInGroup(g.id).map((h) => h.name),
    links: (g) => houseLinks(regionalHousesInGroup(g.id).map((h) => h.id)) },
  { id: 'website', label: 'Website', width: 180, values: (g) => g.website ? [websiteLabel(g.website)] : [], links: (g) => g.website ? [{ kind: 'url', href: g.website }] : [] },
]);

const roleName = (t: Tenure) => t.role === 'Other' ? t.roleDetail ?? 'Other' : t.role;
const currentTenures = (d: Designer) => d.career.filter((t) => t.end === null);
const careerHouses = (d: Designer) => unique([...d.career].sort((a, b) => (a.start ?? Infinity) - (b.start ?? Infinity)).map((t) => t.house));
const designerSheet = defineSheet('designers', 'Designers', () => designers, (d) => ({ key: d.id, name: d.name, open: { kind: 'designer', id: d.id } }), [
  { id: 'name', label: 'Designer', width: 180, values: (d: Designer) => [d.name], links: (d) => [{ kind: 'designer', id: d.id }] },
  { id: 'nationality', label: 'Nationality', width: 110, values: (d) => d.nationality ? [d.nationality] : [] },
  { id: 'born', label: 'Born', width: 60, numeric: true, year: true, values: (d) => year(d.born) },
  { id: 'died', label: 'Died', width: 60, numeric: true, year: true, values: (d) => year(d.died) },
  { id: 'current', label: 'Current brands', width: 200, values: (d) => unique(currentTenures(d).map((t) => t.house)).map(houseName),
    links: (d) => houseLinks(unique(currentTenures(d).map((t) => t.house))) },
  { id: 'roles', label: 'Current roles', width: 180, values: (d) => unique(currentTenures(d).map(roleName)) },
  { id: 'career', label: 'Career brands', width: 280, values: (d) => careerHouses(d).map(houseName), links: (d) => houseLinks(careerHouses(d)) },
  { id: 'start', label: 'Career start', width: 84, numeric: true, year: true, values: (d) => {
    const starts = d.career.flatMap((t) => t.start ?? []);
    return starts.length ? year(Math.min(...starts)) : [];
  } },
  { id: 'tenures', label: 'Roles', width: 56, numeric: true, values: (d) => count(d.career.length) },
]);

/** One career entry: a designer's role at one brand. */
interface CareerRow { designer: Designer; tenure: Tenure; index: number }
const roleType = (t: Tenure) => t.role === 'Other' ? 'Other role' : isBusinessLeadership(t) ? 'Business leadership' : 'Creative leadership';
const status = (t: Tenure) => t.end === null ? 'Current' : t.end === undefined ? 'Unknown' : 'Ended';
const THIS_YEAR = new Date().getFullYear();
const careerSheet = defineSheet('careers', 'Careers', () => designers.flatMap((designer) => designer.career.map((tenure, index) => ({ designer, tenure, index }))),
  ({ designer, index }) => ({ key: `${designer.id}:${index}`, name: designer.name, open: { kind: 'designer', id: designer.id } }), [
    { id: 'designer', label: 'Designer', width: 170, values: (r: CareerRow) => [r.designer.name], links: (r) => [{ kind: 'designer', id: r.designer.id }] },
    { id: 'brand', label: 'Brand', width: 170, values: (r) => [houseName(r.tenure.house)], links: (r) => houseLinks([r.tenure.house]) },
    { id: 'role', label: 'Role', width: 130, values: (r) => [r.tenure.role] },
    { id: 'detail', label: 'Role detail', width: 160, values: (r) => r.tenure.roleDetail ? [r.tenure.roleDetail] : [] },
    { id: 'type', label: 'Type', width: 140, values: (r) => [roleType(r.tenure)] },
    { id: 'start', label: 'Start', width: 60, numeric: true, year: true, values: (r) => year(r.tenure.start) },
    { id: 'end', label: 'End', width: 60, numeric: true, year: true, values: (r) => year(r.tenure.end ?? undefined) },
    { id: 'status', label: 'Status', width: 76, order: ['Current', 'Ended', 'Unknown'], values: (r) => [status(r.tenure)] },
    { id: 'years', label: 'Years', width: 56, numeric: true, values: (r) => {
      const end = r.tenure.end === null ? THIS_YEAR : r.tenure.end;
      return r.tenure.start === undefined || end === undefined ? [] : count(end - r.tenure.start);
    } },
    { id: 'approximate', label: 'Approximate', width: 90, values: (r) => r.tenure.approximate ? ['Yes'] : [] },
    { id: 'city', label: 'City', width: 110, values: (r) => { const h = getHouse(r.tenure.house); return h ? [h.city] : []; },
      links: (r) => { const h = getHouse(r.tenure.house); return h ? [cityLink(h.city)] : []; } },
    { id: 'country', label: 'Country', width: 110, values: (r) => { const h = getHouse(r.tenure.house); return h ? [countryNames[h.country]] : []; },
      links: (r) => { const h = getHouse(r.tenure.house); return h ? [countryLink(h.country)] : []; } },
  ]);

const partners = (c: Collaboration) => c.houses.flatMap((id) => getHouse(id) ?? []).sort(byName);
const collaborationSheet = defineSheet('collaborations', 'Collaborations', () => collaborations,
  (c) => ({ key: c.id, name: partners(c).map((h) => h.name).join(' × '), open: { kind: 'house', id: partners(c)[0]?.id ?? c.houses[0] } }), [
    { id: 'year', label: 'Year', width: 56, numeric: true, year: true, values: (c: Collaboration) => count(c.year) },
    { id: 'brands', label: 'Brands', width: 320, values: (c) => partners(c).map((h) => h.name), links: (c) => houseLinks(partners(c).map((h) => h.id)) },
    { id: 'count', label: 'Participants', width: 90, numeric: true, values: (c) => count(c.houses.length) },
    { id: 'markets', label: 'Markets', width: 180, values: (c) => unique(partners(c).map((h) => tagLabel(h.tags.marketPositioning))).sort((a, b) => TIER_LABELS.indexOf(a) - TIER_LABELS.indexOf(b)) },
    { id: 'cities', label: 'Cities', width: 200, values: (c) => unique(partners(c).map((h) => h.city)).sort(collator.compare),
      links: (c) => unique(partners(c).map((h) => h.city)).sort(collator.compare).map(cityLink) },
    { id: 'countries', label: 'Countries', width: 180, values: (c) => unique(partners(c).map((h) => countryNames[h.country])).sort(collator.compare) },
  ], [{ column: 'year', descending: true }]);

interface Location { city: string; country: CountryCode; based: House[]; founded: House[] }
function locations(): Location[] {
  const byCity = new Map<string, Location>();
  const at = (city: string, country: CountryCode) => byCity.get(city) ?? byCity.set(city, { city, country, based: [], founded: [] }).get(city)!;
  for (const h of houses) at(h.city, h.country).based.push(h);
  for (const h of houses) if (h.origin && h.origin.city !== h.city) at(h.origin.city, h.origin.country).founded.push(h);
  return [...byCity.values()].sort((a, b) => collator.compare(a.city, b.city));
}
const coordinate = (l: Location, axis: 0 | 1) => {
  const point = (cities as Record<string, readonly [number, number]>)[l.city];
  return point ? [point[axis].toFixed(2)] : [];
};
const locationSheet = defineSheet('locations', 'Locations', locations, (l) => ({ key: l.city, name: l.city, open: cityLink(l.city) }), [
  { id: 'city', label: 'City', width: 140, values: (l: Location) => [l.city], links: (l) => [cityLink(l.city)] },
  { id: 'region', label: 'State/Province', width: 120, values: (l) => {
    const region = Object.hasOwn(cityRegions, l.city) ? cityRegions[l.city as CityName]?.region : undefined;
    return region ? [region] : [];
  } },
  { id: 'country', label: 'Country', width: 120, values: (l) => [countryNames[l.country]], links: (l) => [countryLink(l.country)] },
  // Every brand based in the city, sublabels included, in a drop-down; the cell shows how many.
  { id: 'brands', label: 'Brands', width: 90, numeric: true, values: (l) => count(l.based.length),
    menu: (l) => [...l.based].sort(byName).map((h) => ({ label: h.name, link: { kind: 'house', id: h.id } })) },
  { id: 'origins', label: 'Founded here, now elsewhere', width: 220, values: (l) => [...l.founded].sort(byName).map((h) => h.name),
    links: (l) => houseLinks([...l.founded].sort(byName).map((h) => h.id)) },
  { id: 'oldest', label: 'Oldest brand', width: 84, numeric: true, year: true, values: (l) => {
    const years = l.based.flatMap((h) => h.founded ?? []);
    return years.length ? year(Math.min(...years)) : [];
  } },
  { id: 'lat', label: 'Latitude', width: 70, numeric: true, values: (l) => coordinate(l, 0) },
  { id: 'lng', label: 'Longitude', width: 76, numeric: true, values: (l) => coordinate(l, 1) },
]);

/** The workbook's sheet tabs, in order. */
export const SHEETS: readonly Sheet[] = [brandSheet, groupSheet, designerSheet, careerSheet, collaborationSheet, locationSheet];
export const getSheet = (id: SheetId) => SHEETS.find((sheet) => sheet.id === id)!;
export const columnIndex = (sheet: Sheet, id: string) => sheet.columns.findIndex((column) => column.id === id);
/** Column letters as Excel draws them: A … Z, AA … */
export const columnLetter = (index: number): string => (index >= 26 ? columnLetter(Math.floor(index / 26) - 1) : '') + String.fromCharCode(65 + index % 26);
export const cellText = (row: SheetRow, col: number) => row.cells[col]!.join(', ');

/* ---------- AutoFilter ---------- */

/** Excel 2000's Custom AutoFilter comparisons. */
export const CUSTOM_OPS = [
  ['equals', 'equals'], ['notEquals', 'does not equal'],
  ['greater', 'is greater than'], ['greaterOrEqual', 'is greater than or equal to'],
  ['less', 'is less than'], ['lessOrEqual', 'is less than or equal to'],
  ['beginsWith', 'begins with'], ['notBeginsWith', 'does not begin with'],
  ['endsWith', 'ends with'], ['notEndsWith', 'does not end with'],
  ['contains', 'contains'], ['notContains', 'does not contain'],
] as const;
export type CustomOp = typeof CUSTOM_OPS[number][0];
export interface Condition { op: CustomOp; operand: string }
export type ColumnFilter =
  | { kind: 'value'; value: string } | { kind: 'blanks' } | { kind: 'nonBlanks' }
  /** (Custom...): one or two conditions joined by And / Or. */
  | { kind: 'custom'; conditions: readonly [Condition] | readonly [Condition, Condition]; join: 'and' | 'or' }
  /** (Top 10...): the largest or smallest values of a number column, by count or percent of rows. */
  | { kind: 'top'; bottom: boolean; amount: number; percent: boolean };
export type ListFilters = Partial<Record<string, ColumnFilter>>;

/** Does one cell meet one Custom AutoFilter condition? Text matching ignores case and accents. */
export function matchesCondition(values: readonly string[], { op, operand }: Condition, numeric = false): boolean {
  const negative = op === 'notEquals' || op === 'notBeginsWith' || op === 'notEndsWith' || op === 'notContains';
  if (!values.length) return negative;
  const text = fold(values.join(', ')), wanted = fold(operand);
  // A multi-valued cell equals (or begins with…) the operand if any one of its values does.
  const any = (test: (value: string) => boolean) => values.some((value) => test(fold(value))) || test(text);
  const compare = () => numeric && operand.trim() !== '' && Number.isFinite(Number(operand))
    ? Number(values[0]) - Number(operand) : collator.compare(values.join(', '), operand);
  switch (op) {
    case 'equals': return any((value) => value === wanted);
    case 'notEquals': return !any((value) => value === wanted);
    case 'greater': return compare() > 0;
    case 'greaterOrEqual': return compare() >= 0;
    case 'less': return compare() < 0;
    case 'lessOrEqual': return compare() <= 0;
    case 'beginsWith': return any((value) => value.startsWith(wanted));
    case 'notBeginsWith': return !any((value) => value.startsWith(wanted));
    case 'endsWith': return any((value) => value.endsWith(wanted));
    case 'notEndsWith': return !any((value) => value.endsWith(wanted));
    case 'contains': return text.includes(wanted);
    case 'notContains': return !text.includes(wanted);
  }
}

/** Does one cell pass its column's filter? (Top 10 needs the whole column: see `filterSheet`.) */
export function matchesColumnFilter(values: readonly string[], filter: Exclude<ColumnFilter, { kind: 'top' }>, numeric = false): boolean {
  if (filter.kind === 'value') return values.includes(filter.value);
  if (filter.kind === 'blanks') return !values.length;
  if (filter.kind === 'nonBlanks') return values.length > 0;
  const results = filter.conditions.map((condition) => matchesCondition(values, condition, numeric));
  return filter.join === 'and' ? results.every(Boolean) : results.some(Boolean);
}

/** The cut-off value for a Top 10 filter, over every row of the sheet (ties are kept, as in Excel). */
export function topThreshold(sheet: Sheet, col: number, filter: Extract<ColumnFilter, { kind: 'top' }>): number {
  const numbers = sheet.rows().flatMap((row) => row.cells[col]!.length ? [Number(row.cells[col]![0])] : []).filter(Number.isFinite)
    .sort((a, b) => filter.bottom ? a - b : b - a);
  if (!numbers.length) return filter.bottom ? -Infinity : Infinity;
  const take = filter.percent ? Math.ceil(numbers.length * filter.amount / 100) : filter.amount;
  return numbers[Math.max(0, Math.min(numbers.length, take) - 1)]!;
}

/** Rows passing every column's filter (AND across columns), optionally ignoring one column's. */
export function filterSheet(sheet: Sheet, rows: readonly SheetRow[], filters: ListFilters, except?: string): SheetRow[] {
  const tests = sheet.columns.flatMap((column, index): ((row: SheetRow) => boolean)[] => {
    const filter = column.id === except ? undefined : filters[column.id];
    if (!filter) return [];
    if (filter.kind !== 'top') return [(row) => matchesColumnFilter(row.cells[index]!, filter, column.numeric)];
    const threshold = topThreshold(sheet, index, filter);
    return [(row) => {
      const cell = row.cells[index]!;
      if (!cell.length) return false;
      const value = Number(cell[0]);
      return filter.bottom ? value <= threshold : value >= threshold;
    }];
  });
  return tests.length ? rows.filter((row) => tests.every((test) => test(row))) : [...rows];
}

const opLabel = (op: CustomOp) => CUSTOM_OPS.find(([value]) => value === op)![1];
export const filterLabel = (filter: ColumnFilter) => filter.kind === 'value' ? filter.value
  : filter.kind === 'blanks' ? '(Blanks)' : filter.kind === 'nonBlanks' ? '(NonBlanks)'
  : filter.kind === 'top' ? `${filter.bottom ? 'Bottom' : 'Top'} ${filter.amount}${filter.percent ? '%' : ''}`
  : filter.conditions.map((c) => `${opLabel(c.op)} "${c.operand}"`).join(filter.join === 'and' ? ' and ' : ' or ');

/* ---------- search, sort, values ---------- */

/** The formula bar's search: rows with every typed word in some cell (or a cell's drop-down), ignoring case and accents. */
export function searchSheet(rows: readonly SheetRow[], query: string): SheetRow[] {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [...rows];
  return rows.filter((row) => {
    const text = fold([...row.cells.map((cell) => cell.join(' ')), ...row.menus.flatMap((menu) => menu?.map((entry) => entry.label) ?? [])].join(' \u0000 '));
    return words.every((word) => text.includes(word));
  });
}

const valueOrder = (column: ColumnInfo) => (a: string, b: string) => column.numeric ? Number(a) - Number(b)
  : column.order ? column.order.indexOf(a) - column.order.indexOf(b) : collator.compare(a, b);

/** Sort by each key in turn. Blank cells stay last either way, as in Excel; remaining ties go by the row's name. */
export function sortSheet(sheet: Sheet, rows: readonly SheetRow[], sort: ListSort): SheetRow[] {
  const keys = sort.flatMap((key) => {
    const index = columnIndex(sheet, key.column);
    if (index < 0) return [];
    const column = sheet.columns[index]!;
    return [{ index, column, order: valueOrder(column), direction: key.descending ? -1 : 1 }];
  });
  return [...rows].sort((a, b) => {
    for (const { index, column, order, direction } of keys) {
      const x = a.cells[index]!, y = b.cells[index]!;
      const result = !x.length || !y.length ? (x.length ? 0 : 1) - (y.length ? 0 : 1)
        : direction * (column.numeric || column.order ? order(x[0]!, y[0]!) : collator.compare(x.join(', '), y.join(', ')));
      if (result) return result;
    }
    return collator.compare(a.name, b.name);
  });
}

/** An AutoFilter list's entries: the distinct values among the rows the other columns' filters leave. */
export function columnValues(sheet: Sheet, rows: readonly SheetRow[], id: string): { values: string[]; blanks: boolean } {
  const index = columnIndex(sheet, id);
  const values = new Set<string>();
  let blanks = false;
  for (const row of rows) {
    const cell = row.cells[index]!;
    if (!cell.length) blanks = true;
    for (const value of cell) values.add(value);
  }
  return { values: [...values].sort(valueOrder(sheet.columns[index]!)), blanks };
}

/* ---------- File ▸ Save As CSV ---------- */

const csvField = (text: string) => /[",\n\r]/.test(text) || /^\s|\s$/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
/** The listed rows and shown columns as CSV, a header row first. Lists stay in one cell, comma-separated. */
export function sheetCsv(sheet: Sheet, rows: readonly SheetRow[], columns: readonly number[]): string {
  const lines = [columns.map((col) => csvField(sheet.columns[col]!.label)), ...rows.map((row) => columns.map((col) => csvField(cellText(row, col))))];
  return lines.map((line) => line.join(',')).join('\r\n') + '\r\n';
}

/* ---------- Format ▸ Column ▸ AutoFit ---------- */

/** Widest a double-click AutoFit makes a column. */
export const AUTOFIT_MAX = 900;
/** Narrowest a column can be dragged, like Excel's smallest readable width. */
export const MIN_COLUMN_WIDTH = 24;
/** Cell padding, grid line and the active cell's 2px border; field names also leave room for their AutoFilter arrow, and drop-down cells for theirs. */
const CELL_CHROME = 10;
const ARROW_ROOM = 19;

/** Fit a column to its widest cell or field name, measured with `measure(text, bold)`. */
export function autoFitWidth(sheet: Sheet, col: number, measure: (text: string, bold: boolean) => number, max = AUTOFIT_MAX): number {
  const column = sheet.columns[col]!;
  let widest = measure(column.label, true) + ARROW_ROOM;
  const seen = new Set<string>();
  for (const row of sheet.rows()) {
    const text = cellText(row, col);
    if (seen.has(text)) continue;
    seen.add(text);
    widest = Math.max(widest, measure(text, false) + (column.menu && row.menus[col]?.length ? ARROW_ROOM : 0));
    if (widest >= max) break;
  }
  return Math.max(MIN_COLUMN_WIDTH, Math.min(max, Math.ceil(widest + CELL_CHROME)));
}

/* ---------- buckets: what the Chart Wizard and PivotTable count by ---------- */

/** One category of a column: its label, the AutoFilter that lists its rows, and how it sorts. */
export interface Bucket { key: string; label: string; filter: ColumnFilter; order: number | string }
export const BLANK_LABEL = '(blank)';
const decadeOf = (value: string) => Math.floor(Number(value) / 10) * 10;
/** A cell's buckets: each of its values, or each value's decade for a year column; a blank cell is "(blank)". */
export function cellBuckets(column: ColumnInfo, values: readonly string[], decades: boolean): Bucket[] {
  if (!values.length) return [{ key: '\u0000blank', label: BLANK_LABEL, filter: { kind: 'blanks' }, order: Infinity }];
  return unique(values).map((value): Bucket => {
    if (decades && column.year && Number.isFinite(Number(value))) {
      const decade = decadeOf(value);
      return { key: `d${decade}`, label: `${decade}s`, order: decade, filter: { kind: 'custom', join: 'and',
        conditions: [{ op: 'greaterOrEqual', operand: String(decade) }, { op: 'less', operand: String(decade + 10) }] } };
    }
    const order = column.numeric ? Number(value) : column.order ? column.order.indexOf(value) : value;
    return { key: `v${value}`, label: value, order, filter: { kind: 'value', value } };
  }).filter((bucket, i, list) => list.findIndex((other) => other.key === bucket.key) === i);
}
const compareBuckets = (a: Bucket, b: Bucket) => a.order === Infinity || b.order === Infinity ? (a.order === Infinity ? 1 : 0) - (b.order === Infinity ? 1 : 0)
  : typeof a.order === 'number' && typeof b.order === 'number' ? a.order - b.order : collator.compare(String(a.order), String(b.order));

export interface BucketCount extends Bucket { count: number }
/** How many rows fall in each bucket of a column (a row with several values counts once in each), in the column's order. */
export function valueCounts(sheet: Sheet, rows: readonly SheetRow[], col: number, decades = false): BucketCount[] {
  const column = sheet.columns[col]!;
  const counts = new Map<string, BucketCount>();
  for (const row of rows) for (const bucket of cellBuckets(column, row.cells[col]!, decades)) {
    const entry = counts.get(bucket.key);
    if (entry) entry.count++; else counts.set(bucket.key, { ...bucket, count: 1 });
  }
  return [...counts.values()].sort(compareBuckets);
}

export interface Pivot {
  rows: Bucket[]; columns: Bucket[];
  /** counts.get(rowKey)?.get(columnKey); a missing entry is an empty cell. */
  counts: Map<string, Map<string, number>>;
  rowTotals: Map<string, number>; columnTotals: Map<string, number>; total: number;
}
/**
 * Count of records by a row field and an optional column field. Totals count
 * records, so a brand in two categories adds to both rows but once to the
 * grand total, as in an Excel PivotTable over a list with repeated values.
 */
export function pivotTable(sheet: Sheet, rows: readonly SheetRow[], rowCol: number, columnCol: number | undefined, decades: boolean, sortBy: 'label' | 'total'): Pivot {
  const rowBuckets = new Map<string, Bucket>(), columnBuckets = new Map<string, Bucket>();
  const counts = new Map<string, Map<string, number>>(), rowTotals = new Map<string, number>(), columnTotals = new Map<string, number>();
  const bump = (map: Map<string, number>, key: string) => map.set(key, (map.get(key) ?? 0) + 1);
  for (const row of rows) {
    const across = cellBuckets(sheet.columns[rowCol]!, row.cells[rowCol]!, decades);
    const down = columnCol === undefined ? [] : cellBuckets(sheet.columns[columnCol]!, row.cells[columnCol]!, decades);
    for (const r of across) {
      rowBuckets.set(r.key, r);
      bump(rowTotals, r.key);
      for (const c of down) bump(counts.get(r.key) ?? counts.set(r.key, new Map()).get(r.key)!, c.key);
    }
    for (const c of down) { columnBuckets.set(c.key, c); bump(columnTotals, c.key); }
  }
  const sortedRows = [...rowBuckets.values()].sort(sortBy === 'total'
    ? (a, b) => rowTotals.get(b.key)! - rowTotals.get(a.key)! || compareBuckets(a, b) : compareBuckets);
  return { rows: sortedRows, columns: [...columnBuckets.values()].sort(compareBuckets), counts, rowTotals, columnTotals, total: rows.length };
}

/* ---------- a selected range: AutoCalculate and Copy ---------- */

/** The status bar's AutoCalculate over a range: non-blank cells, and Sum / Average / Min / Max of single numbers in number columns. */
export function rangeStats(sheet: Sheet, rows: readonly SheetRow[], columns: readonly number[]) {
  let count = 0;
  const numbers: number[] = [];
  for (const row of rows) for (const col of columns) {
    const cell = row.cells[col]!;
    if (!cell.length) continue;
    count++;
    if (sheet.columns[col]!.numeric && cell.length === 1 && Number.isFinite(Number(cell[0]))) numbers.push(Number(cell[0]));
  }
  if (!numbers.length) return { count };
  const sum = numbers.reduce((total, n) => total + n, 0);
  return { count, numbers: numbers.length, sum, average: sum / numbers.length, min: Math.min(...numbers), max: Math.max(...numbers) };
}

/** A range as tab-separated text, which pastes cell for cell into Excel or Google Sheets; `header` adds the field names first. */
export function rangeTsv(sheet: Sheet, rows: readonly SheetRow[], columns: readonly number[], header = false): string {
  const clean = (text: string) => text.replace(/[\t\r\n]+/g, ' ');
  const lines = [...(header ? [columns.map((col) => clean(sheet.columns[col]!.label))] : []), ...rows.map((row) => columns.map((col) => clean(cellText(row, col))))];
  return lines.map((line) => line.join('\t')).join('\n');
}
