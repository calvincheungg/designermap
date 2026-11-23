import { describe, expect, it } from 'vitest';
import { collaborations } from '../data';
import { DIMENSIONS, diversityRows, partnersByBrand, percentiles, variety } from './collab-diversity';

describe('variety', () => {
  it('runs from 0 (all the same) to 1 (all different)', () => {
    expect(variety([['a'], ['a'], ['a']])).toBe(0);
    expect(variety([['a'], ['b'], ['c']])).toBe(1);
    // Of the three pairs, two differ.
    expect(variety([['a'], ['a'], ['b']])).toBeCloseTo(2 / 3);
  });
  it('splits a partner with several values across them', () => {
    expect(variety([['a', 'b'], ['a']])).toBeCloseTo(0.5);
    expect(variety([['a', 'b'], ['a', 'b']])).toBeCloseTo(0.5);
  });
  it('is 0 without a pair to compare', () => {
    expect(variety([])).toBe(0);
    expect(variety([['a', 'b']])).toBe(0);
  });
});

it('percentiles share the middle of a tie', () => {
  expect(percentiles([1, 2, 3])).toEqual([0, 50, 100]);
  expect(percentiles([1, 1, 2])).toEqual([25, 25, 100]);
  expect(percentiles([5])).toEqual([100]);
});

describe('diversityRows', () => {
  it('counts a repeat partner once', () => {
    const partners = partnersByBrand([{ houses: ['dior', 'nike'] }, { houses: ['dior', 'nike'] }, { houses: ['dior', 'nike', 'kith'] }]);
    expect([...partners.get('dior')!].sort()).toEqual(['kith', 'nike']);
  });
  it('keeps the minimum and averages only the included dimensions', () => {
    const partners = partnersByBrand(collaborations);
    for (const mode of ['variety', 'reach'] as const) {
      const rows = diversityRows(partners, mode, DIMENSIONS, 20);
      expect(rows.length).toBeGreaterThan(10);
      expect(rows.every((row) => row.partners.size >= 20 && row.overall >= 0 && row.overall <= 100)).toBe(true);
      const byCountry = diversityRows(partners, mode, ['country'], 20).sort((a, b) => b.overall - a.overall);
      expect(byCountry[0]!.scores.country).toBe(Math.max(...rows.map((row) => row.scores.country)));
    }
  });
});
