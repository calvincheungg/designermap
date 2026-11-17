import { describe, expect, it } from 'vitest';
import { housesByMapLocation } from './geo';
import { mapLocationForHouse, setLocationMode } from './locations';

describe('origin locations', () => {
  it('places moved brands at their origin city only in origin mode', () => {
        try {
      expect(mapLocationForHouse('rayBan')).toBe('Milan');
      setLocationMode('origin');
      expect(mapLocationForHouse('rayBan')).toBe('Rochester');
      expect(mapLocationForHouse('dior')).toBe('Paris');
      expect(housesByMapLocation().get('Rochester')?.some((h) => h.id === 'rayBan')).toBe(true);
    } finally {
      setLocationMode('current');
    }
    expect(housesByMapLocation().get('Milan')?.some((h) => h.id === 'rayBan')).toBe(true);
  });
});
