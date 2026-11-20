import type { Collaboration, CollaborationData, Designer, House, HouseTenure, Move, Tenure } from '../types';
import { collaborations as collaborationRecords } from './collaborations';
import type { HouseId } from './houses';
import { designers as designerRecords } from './designers';
import type { DesignerId } from './designers';
import { houses as houseRecords } from './houses';
import { groups as groupRecords, GroupId, type GroupData } from './groups';

export type { HouseId } from './houses';
export type { DesignerId } from './designers';
export type { CollaborationId } from './collaborations';
export type { Collaboration, CollaborationData } from '../types';
export { MarketPositioning, BrandCategory, Aesthetic, CollectionTag, ProductTag, marketPositionings, brandCategories, aesthetics, collectionTags, productTags, matchesHouseFilters } from './tags';
export type { HouseTags, HouseFilters } from './tags';
export { GroupId } from './groups';
export type { GroupData } from './groups';
export { CountryCode, countryNames } from './countries';

export const groups: (GroupData & { id: GroupId })[] = Object.values(GroupId).map((id) => ({ id, ...groupRecords[id] }));
const groupById = new Map<string, (typeof groups)[number]>(groups.map((group) => [group.id, group]));
export const getGroup = (id: string) => groupById.get(id);

/** Current affiliations recorded in the map; membership is never copied to groups.ts. */
export const housesInGroup = (id: string): House[] => houses
  .filter((house) => house.parentGroup === id)
  .sort((a, b) => a.name.localeCompare(b.name));

/** Licensed or regional operations, kept separate from owned group brands. */
export const regionalHousesInGroup = (id: string): House[] => houses
  .filter((house) => house.regionalAffiliations?.some((affiliation) => affiliation.group === id))
  .sort((a, b) => a.name.localeCompare(b.name));

export const houses: House[] = Object.entries(houseRecords).map(([id, h]) => ({ id, ...h }));
export const designers: Designer[] = Object.entries(designerRecords).map(([id, d]) => ({
  id,
  ...d,
}));

const houseById = new Map(houses.map((h) => [h.id, h]));
const designerById = new Map(designers.map((d) => [d.id, d]));

// Read the literal records here so misspelled founder IDs fail type checking,
// without a circular dependency between house and designer ID inference.
// Assigning to an explicit view checks every ID without building a union of all founder tuples.
const founderRecords: Record<string, { readonly founders?: readonly DesignerId[]; readonly [field: string]: unknown }> = houseRecords;
const founderIdsByHouse = new Map<string, readonly DesignerId[]>(Object.entries(founderRecords)
  .map(([id, house]) => [id, house.founders ?? []]));

export const getHouse = (id: string) => houseById.get(id);
export const getDesigner = (id: string) => designerById.get(id);

// The explicit view keeps the queries usable while the literal dataset is empty.
const collaborationData: Record<string, CollaborationData<HouseId>> = collaborationRecords;
export const collaborations: Collaboration[] = Object.entries(collaborationData)
  .map(([id, collaboration]) => ({ id, ...collaboration }))
  .sort((a, b) => a.year - b.year || a.id.localeCompare(b.id));
const collaborationById = new Map(collaborations.map((collaboration) => [collaboration.id, collaboration]));

export const getCollaboration = (id: string): Collaboration | undefined => collaborationById.get(id);

/** Projects involving a brand, optionally restricted to a release year. */
export const collaborationsOf = (houseId: string, year?: number): Collaboration[] => collaborations
  .filter((collaboration) => collaboration.houses.includes(houseId)
    && (year === undefined || collaboration.year === year));

export const collaborationsInYear = (year: number): Collaboration[] => collaborations
  .filter((collaboration) => collaboration.year === year);

/** Direct labels in a house's brand family; ownership remains a separate relationship. */
export const labelsOf = (houseId: string): House[] => houses
  .filter((house) => house.parentHouse === houseId)
  .sort((a, b) => a.name.localeCompare(b.name));

export const parentHouseOf = (houseId: string): House | undefined => {
  const parentId = getHouse(houseId)?.parentHouse;
  return parentId ? getHouse(parentId) : undefined;
};

/** Founders in editorial display order, with names owned by designer profiles. */
export const foundersOf = (houseId: string): Designer[] => (founderIdsByHouse.get(houseId) ?? [])
  .map((id) => designerById.get(id)!);

const startYear = (t: Tenure) => t.start ?? (typeof t.end === 'number' ? t.end : -Infinity);
const byStart = (a: Tenure, b: Tenure) => startYear(a) - startYear(b) || 0;

/** A designer's career in chronological order. */
export function careerOf(designerId: string): Tenure[] {
  return [...(getDesigner(designerId)?.career ?? [])].sort(byStart);
}

/** Everyone who has held a role at a house, in chronological order. */
export function tenuresAt(houseId: string): HouseTenure[] {
  return [...(tenuresByHouse().get(houseId) ?? [])];
}

/**
 * Every tenure grouped by house, built once: scanning all careers per call made
 * per-brand loops (Statistics, What's Missing) quadratic, ~1s on the main thread.
 */
let tenureIndex: Map<string, readonly HouseTenure[]> | undefined;
function tenuresByHouse(): Map<string, readonly HouseTenure[]> {
  if (tenureIndex) return tenureIndex;
  const grouped = Map.groupBy(designers.flatMap((d) => d.career.map((t): HouseTenure => ({ ...t, designerId: d.id }))), (t) => t.house as string);
  for (const list of grouped.values()) list.sort(byStart);
  return tenureIndex = grouped;
}

/** Business appointments must never be presented as creative direction. */
export const isBusinessLeadership = (tenure: Pick<Tenure, 'role'>): boolean =>
  tenure.role === 'CEO' || tenure.role === 'President' || tenure.role === 'Managing Director';

/** Who was at the house in a given year. */
export function tenuresAtInYear(houseId: string, year: number): HouseTenure[] {
  return tenuresAt(houseId).filter((t) => isActiveIn(t, year));
}

/** Undated past roles sort before dated roles without implying concurrency. */
const endYear = (t: Tenure) => (t.end === null ? Infinity : (t.end ?? t.start ?? -Infinity));

export function isActiveIn(t: Tenure, year: number): boolean {
  return t.start !== undefined && t.start <= year && year <= endYear(t);
}

/**
 * Each time a designer starts at a new house.
 *
 * - Continuing at the same house (co-CD → CD, a new title) isn't a move.
 * - `from` is the other house they were most recently at. If they left one
 *   house the year they joined, that's the one (Lagerfeld: Chloé → Chanel 1983,
 *   even though he stayed at Fendi).
 * - `concurrent` = they kept the old role too (JW Anderson + Loewe, Prada + Miu Miu).
 */
export function movesOf(designerId: string): Move[] {
  const career = careerOf(designerId);
  const moves: Move[] = [];

  career.forEach((to, i) => {
    const year = to.start;
    if (year === undefined) return;
    const earlier = career.slice(0, i);
    if (earlier.some((t) => t.house === to.house && endYear(t) >= year)) return;

    const recency = (t: Tenure) => Math.min(endYear(t), year);
    const from = earlier
      .filter((t) => t.house !== to.house)
      // Most recently left; then prefer a role that ended over one still held.
      // Still a tie: among roles already over, the one started most recently
      // (Cucinelli → Prada → Canali, all ending 2024); among roles still held,
      // the longest-held (Margiela, not its MM6 line, → Hermès in 1997).
      .sort(
        (a, b) =>
          recency(b) - recency(a) ||
          endYear(a) - endYear(b) ||
          (endYear(a) <= year ? startYear(b) - startYear(a) : startYear(a) - startYear(b)),
      )[0];
    if (!from) return;

    moves.push({ designerId, from, to, year, concurrent: endYear(from) > year });
  });
  return moves;
}

export const allMoves = (): Move[] => designers.flatMap((d) => movesOf(d.id));

/** Earliest and latest year in the dataset, for timeline sliders. */
export function yearRange(): [number, number] {
  const thisYear = new Date().getFullYear();
  const years = designers.flatMap((d) =>
    d.career.flatMap((t) => [t.start, t.end === null ? thisYear : (t.end ?? t.start)]),
  ).filter((year): year is number => year !== undefined);
  years.push(...collaborations.map((project) => project.year));
  return [Math.min(...years), Math.max(...years)];
}

/** "2012–2016", "2016–Present", "~1964–1983", or "2021" when no end year is supplied. */
export function formatTenureYears(t: Tenure): string {
  const prefix = t.approximate ? '~' : '';
  if (t.start === undefined && t.end === undefined) return 'Unknown';
  if (t.start !== undefined && (t.end === undefined || t.end === t.start)) return `${prefix}${t.start}`;
  const end = t.end === null ? 'Present' : t.end;
  return `${prefix}${t.start ?? '?'}–${end}`;
}

/** Where a house's logo loads from: a full URL as-is, or a file in public/logos/. */
export const logoUrl = (h: House): string | undefined => {
  if (!h.logo) return undefined;
  if (/^https?:\/\//.test(h.logo)) return h.logo;
  // Encoded so names like "99%is.jpg" or ones with spaces load correctly.
  return `${import.meta.env.BASE_URL}logos/${encodeURIComponent(h.logo)}`;
};
