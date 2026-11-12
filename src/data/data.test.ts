import { describe, expect, it } from 'vitest';
import { movesOf, tenuresAt } from './index';
import { validateData } from './validate';

describe('data', () => {
  it('passes validation', () => {
    expect(validateData()).toEqual([]);
  });

  it('derives moves in chronological order', () => {
    expect(movesOf('hediSlimane').map((m) => [m.from.house, m.to.house, m.year])).toEqual([
      ['dior', 'saintLaurent', 2012],
      ['saintLaurent', 'celine', 2018],
    ]);
  });

  it('ignores promotions within the same house', () => {
    expect(movesOf('pierpaoloPiccioli').map((m) => m.to.house)).toEqual(['balenciaga']);
  });

  it('lists a house’s directors chronologically', () => {
    expect(tenuresAt('celine').map((t) => t.designerId)).toEqual(['phoebePhilo', 'hediSlimane']);
  });
});
