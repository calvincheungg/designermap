import { describe, expect, it } from 'vitest';
import { MarketPositioning } from '../data';
import { readSharedView, sharedViewHash } from './share-link';

describe('share links', () => {
  it('round-trips the selection, year and filters', () => {
    const view = { selection: { kind: 'house' as const, id: 'dior' }, year: 1990, filters: { marketPositioning: [MarketPositioning.HighLuxury, MarketPositioning.Luxury] } };
    const hash = sharedViewHash(view, 2026);
    expect(hash).toBe('#brand=dior&year=1990&marketPositioning=High+Luxury,Luxury');
    expect(readSharedView(hash, 1800, 2026)).toEqual(view);
  });

  it('leaves the default view without a hash and drops unknown or out-of-range values', () => {
    expect(sharedViewHash({ selection: null, year: 2026, filters: {} }, 2026)).toBe('');
    expect(readSharedView('#brand=notABrand&year=3000&aesthetic=Nope', 1800, 2026)).toEqual({ selection: null, year: 2026, filters: {} });
    expect(readSharedView('#designer=karlLagerfeld', 1800, 2026).selection).toEqual({ kind: 'designer', id: 'karlLagerfeld' });
  });
});
