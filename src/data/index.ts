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

export function isActiveIn(t: Tenure, year: number): boolean {
  const end = t.end === null ? Infinity : (t.end ?? t.start);
  return t.start <= year && year <= end;
}

/**
 * Each time a designer starts at a *different* house from their previous
 * tenure. Promotions within the same house (e.g. co-CD → CD) aren't moves.
 */
export function movesOf(designerId: string): Move[] {
  const career = careerOf(designerId);
  const moves: Move[] = [];
  for (let i = 1; i < career.length; i++) {
    const from = career[i - 1]!;
    const to = career[i]!;
    if (from.house !== to.house) moves.push({ designerId, from, to, year: to.start });
  }
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
