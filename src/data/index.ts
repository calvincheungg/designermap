import type { Designer, House, HouseTenure, Move, Tenure } from '../types';
import { designers as designerRecords } from './designers';
import { houses as houseRecords } from './houses';

export type { HouseId } from './houses';
export type { DesignerId } from './designers';

export const houses: House[] = Object.entries(houseRecords).map(([id, h]) => ({ id, ...h }));
export const designers: Designer[] = Object.entries(designerRecords).map(([id, d]) => ({
  id,
  ...d,
}));

const houseById = new Map(houses.map((h) => [h.id, h]));
const designerById = new Map(designers.map((d) => [d.id, d]));

export const getHouse = (id: string) => houseById.get(id);
export const getDesigner = (id: string) => designerById.get(id);

const byStart = (a: Tenure, b: Tenure) => a.start - b.start;

/** A designer's career in chronological order. */
export function careerOf(designerId: string): Tenure[] {
  return [...(getDesigner(designerId)?.career ?? [])].sort(byStart);
}

/** Everyone who has held a role at a house, in chronological order. */
export function tenuresAt(houseId: string): HouseTenure[] {
  return designers
    .flatMap((d) => d.career.map((t) => ({ ...t, designerId: d.id })))
    .filter((t) => t.house === houseId)
    .sort(byStart);
}

/** Who was at the house in a given year. */
export function tenuresAtInYear(houseId: string, year: number): HouseTenure[] {
  return tenuresAt(houseId).filter((t) => isActiveIn(t, year));
}

/** Last year of a tenure: Infinity if current, start year if unknown. */
const endYear = (t: Tenure) => (t.end === null ? Infinity : (t.end ?? t.start));

export function isActiveIn(t: Tenure, year: number): boolean {
  return t.start <= year && year <= endYear(t);
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
    const earlier = career.slice(0, i);
    if (earlier.some((t) => t.house === to.house && endYear(t) >= to.start)) return;

    const recency = (t: Tenure) => Math.min(endYear(t), to.start);
    const from = earlier
      .filter((t) => t.house !== to.house)
      .sort((a, b) => recency(b) - recency(a) || endYear(a) - endYear(b))[0];
    if (!from) return;

    moves.push({ designerId, from, to, year: to.start, concurrent: endYear(from) > to.start });
  });
  return moves;
}

export const allMoves = (): Move[] => designers.flatMap((d) => movesOf(d.id));

/** Earliest and latest year in the dataset, for timeline sliders. */
export function yearRange(): [number, number] {
  const thisYear = new Date().getFullYear();
  const years = designers.flatMap((d) =>
    d.career.flatMap((t) => [t.start, t.end === null ? thisYear : (t.end ?? t.start)]),
  );
  return [Math.min(...years), Math.max(...years)];
}

/** "2012–2016", "2016–present", "~1964–1983", "2005–?" */
export function formatTenureYears(t: Tenure): string {
  const end = t.end === null ? 'present' : (t.end ?? '?');
  return `${t.approximate ? '~' : ''}${t.start}–${end}`;
}

export const logoUrl = (h: House): string | undefined =>
  h.logo ? `${import.meta.env.BASE_URL}logos/${h.logo}` : undefined;
