import { describe, expect, it } from 'vitest';
import { BrandCategory, collaborations, getHouse, houses } from '../data';
import { MarketPositioning } from '../data/tags';
import type { Collaboration } from '../types';
import { CHART_GAP_YEARS, chartColumns, pairingKind, partnerType } from './statistics';

describe('chartColumns', () => {
  it('keeps short empty runs as zero-count years', () => {
    const columns = chartColumns(new Map([[2000, 2], [2003, 1]]));
    expect(columns.map((c) => c.kind === 'year' ? [c.year, c.count] : 'gap')).toEqual([[2000, 2], [2001, 0], [2002, 0], [2003, 1]]);
  });

  it(`collapses more than ${CHART_GAP_YEARS} empty years into one break column`, () => {
    const columns = chartColumns(new Map([[1967, 1], [1984, 1], [1996, 1], [1997, 2]]));
    expect(columns).toEqual([
      { kind: 'year', year: 1967, count: 1 },
      { kind: 'gap', from: 1968, to: 1983 },
      { kind: 'year', year: 1984, count: 1 },
      { kind: 'gap', from: 1985, to: 1995 },
      { kind: 'year', year: 1996, count: 1 },
      { kind: 'year', year: 1997, count: 2 },
    ]);
  });

  it('keeps a run of exactly the buffer length', () => {
    const columns = chartColumns(new Map([[1990, 1], [1990 + CHART_GAP_YEARS + 1, 1]]));
    expect(columns.every((c) => c.kind === 'year')).toBe(true);
    expect(columns).toHaveLength(CHART_GAP_YEARS + 2);
  });
});

describe('Collaborations by year breakdowns', () => {
  it('puts every release in exactly one partner type and one pairing kind', () => {
    for (const project of collaborations) {
      expect(['luxuryStreet', 'retailer', 'sportswear', 'other']).toContain(partnerType(project));
      expect(['first', 'repeat']).toContain(pairingKind(project));
    }
  });

  it('marks only a pair’s first release year as first-time', () => {
    const byPair = new Map<string, Collaboration[]>();
    for (const project of collaborations.filter((c) => new Set(c.houses).size === 2)) {
      const key = [...new Set(project.houses)].sort().join('|');
      byPair.set(key, [...byPair.get(key) ?? [], project]);
    }
    const repeated = [...byPair.values()].find((list) => new Set(list.map((c) => c.year)).size > 1)!;
    const firstYear = Math.min(...repeated.map((c) => c.year));
    for (const project of repeated) expect(pairingKind(project)).toBe(project.year === firstYear ? 'first' : 'repeat');
  });

  it('classifies luxury × streetwear before retailers and sportswear', () => {
    const luxury = houseIds.find((id) => [MarketPositioning.HighLuxury, MarketPositioning.Luxury].includes(getHouse(id)!.tags.marketPositioning)
      && !getHouse(id)!.tags.brandCategory.includes(BrandCategory.Streetwear))!;
    const street = houseIds.find((id) => getHouse(id)!.tags.brandCategory.includes(BrandCategory.Streetwear)
      && getHouse(id)!.tags.brandCategory.includes(BrandCategory.Retailer))!;
    expect(partnerType({ houses: [luxury, street] })).toBe('luxuryStreet');
    const sport = houseIds.find((id) => getHouse(id)!.tags.brandCategory.includes(BrandCategory.Sportswear) && !isLuxuryOrStreet(id))!;
    expect(partnerType({ houses: [sport, street] })).toBe('retailer');
  });
});

const houseIds = houses.map((house) => house.id);
const isLuxuryOrStreet = (id: string) => getHouse(id)!.tags.brandCategory.includes(BrandCategory.Streetwear)
  || [MarketPositioning.HighLuxury, MarketPositioning.Luxury].includes(getHouse(id)!.tags.marketPositioning);
